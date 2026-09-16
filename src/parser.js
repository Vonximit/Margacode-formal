import { tokenize } from "./lexer.js";
import { MargaCodeError, TokenType as T } from "./token.js";

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    const body = [];
    while (!this.check(T.EOF)) body.push(this.declaration());
    return { type: "Program", version: "1.2", body };
  }

  declaration() {
    if (this.match(T.REACTION)) return this.reactionDeclaration();
    if (this.match(T.LET)) return this.variableDeclaration();
    return this.statement();
  }

  reactionDeclaration() {
    const start = this.previous();
    const name = this.consume(T.IDENTIFIER, "Se esperaba el nombre de la reacción");
    this.consume(T.LEFT_PAREN, "Se esperaba '(' después del nombre");
    const params = [];
    if (!this.check(T.RIGHT_PAREN)) {
      do {
        const paramName = this.consume(T.IDENTIFIER, "Se esperaba el nombre del parámetro");
        this.consume(T.COLON, "Se esperaba ':' antes del tipo del parámetro");
        const valueType = this.typeReference();
        let defaultValue = null;
        if (this.match(T.ASSIGN)) defaultValue = this.expression();
        params.push({ type: "Parameter", name: paramName.value, valueType, defaultValue, loc: this.loc(paramName) });
      } while (this.match(T.COMMA));
    }
    this.consume(T.RIGHT_PAREN, "Se esperaba ')' después de los parámetros");
    const returnType = this.match(T.ARROW) ? this.typeReference() : null;
    const body = this.blockStatement();
    return { type: "ReactionDeclaration", name: name.value, params, returnType, body, loc: this.loc(start) };
  }

  variableDeclaration() {
    const start = this.previous();
    const name = this.consume(T.IDENTIFIER, "Se esperaba el nombre de la variable");
    const valueType = this.match(T.COLON) ? this.typeReference() : null;
    this.consume(T.ASSIGN, "Se esperaba '=' en la declaración");
    const init = this.expression();
    this.semicolon("Se esperaba ';' después de la declaración");
    return { type: "VariableDeclaration", name: name.value, valueType, init, loc: this.loc(start) };
  }

  typeReference() {
    const token = this.consume(T.IDENTIFIER, "Se esperaba un tipo");
    return { type: "TypeReference", name: token.value, loc: this.loc(token) };
  }

  statement() {
    if (this.match(T.IF)) return this.ifStatement();
    if (this.match(T.RETURN)) return this.returnStatement();
    if (this.check(T.LEFT_BRACE)) return this.blockStatement();
    return this.expressionStatement();
  }

  ifStatement() {
    const start = this.previous();
    this.consume(T.LEFT_PAREN, "Se esperaba '(' después de if");
    const test = this.expression();
    this.consume(T.RIGHT_PAREN, "Se esperaba ')' después de la condición");
    const consequent = this.blockStatement();
    const alternate = this.match(T.ELSE) ? (this.check(T.IF) ? (this.advance(), this.ifStatement()) : this.blockStatement()) : null;
    return { type: "IfStatement", test, consequent, alternate, loc: this.loc(start) };
  }

  returnStatement() {
    const start = this.previous();
    const argument = this.check(T.SEMICOLON) ? null : this.expression();
    this.semicolon("Se esperaba ';' después de return");
    return { type: "ReturnStatement", argument, loc: this.loc(start) };
  }

  blockStatement() {
    const brace = this.consume(T.LEFT_BRACE, "Se esperaba '{'");
    const body = [];
    while (!this.check(T.RIGHT_BRACE) && !this.check(T.EOF)) body.push(this.declaration());
    this.consume(T.RIGHT_BRACE, "Se esperaba '}' para cerrar el bloque");
    return { type: "BlockStatement", body, loc: this.loc(brace) };
  }

  expressionStatement() {
    const expression = this.expression();
    this.semicolon("Se esperaba ';' después de la expresión");
    return { type: "ExpressionStatement", expression, loc: expression.loc };
  }

  expression() { return this.or(); }

  or() {
    let expression = this.and();
    while (this.match(T.OR)) expression = this.binary(expression, this.previous(), this.and(), "LogicalExpression");
    return expression;
  }

  and() {
    let expression = this.equality();
    while (this.match(T.AND)) expression = this.binary(expression, this.previous(), this.equality(), "LogicalExpression");
    return expression;
  }

  equality() {
    let expression = this.comparison();
    while (this.match(T.EQUAL, T.BANG_EQUAL)) expression = this.binary(expression, this.previous(), this.comparison());
    return expression;
  }

  comparison() {
    let expression = this.term();
    while (this.match(T.GREATER, T.GREATER_EQUAL, T.LESS, T.LESS_EQUAL)) expression = this.binary(expression, this.previous(), this.term());
    return expression;
  }

  term() {
    let expression = this.factor();
    while (this.match(T.PLUS, T.MINUS)) expression = this.binary(expression, this.previous(), this.factor());
    return expression;
  }

  factor() {
    let expression = this.unary();
    while (this.match(T.STAR, T.SLASH, T.PERCENT)) expression = this.binary(expression, this.previous(), this.unary());
    return expression;
  }

  unary() {
    if (this.match(T.NOT, T.MINUS)) {
      const operator = this.previous();
      return { type: "UnaryExpression", operator: operator.lexeme, argument: this.unary(), loc: this.loc(operator) };
    }
    return this.postfix();
  }

  postfix() {
    let expression = this.primary();
    while (true) {
      if (this.match(T.DOT)) {
        const property = this.consume(T.IDENTIFIER, "Se esperaba una propiedad después de '.'");
        expression = {
          type: "ReferenceExpression",
          object: expression,
          property: { type: "Identifier", name: property.value, loc: this.loc(property) },
          loc: expression.loc
        };
      } else if (this.match(T.LEFT_PAREN)) {
        expression = this.finishCall(expression);
      } else break;
    }
    return expression;
  }

  finishCall(callee) {
    const args = [];
    const named = new Set();
    let foundNamed = false;
    if (!this.check(T.RIGHT_PAREN)) {
      do {
        if (this.check(T.IDENTIFIER) && this.peekType(1) === T.ASSIGN) {
          foundNamed = true;
          const name = this.advance();
          this.advance();
          if (named.has(name.value)) throw this.error(name, `El argumento «${name.value}» está repetido`);
          named.add(name.value);
          args.push({ type: "NamedArgument", name: name.value, value: this.expression(), loc: this.loc(name) });
        } else {
          if (foundNamed) throw this.error(this.peek(), "Los argumentos posicionales deben aparecer antes de los nombrados");
          const value = this.expression();
          args.push({ type: "PositionalArgument", value, loc: value.loc });
        }
      } while (this.match(T.COMMA));
    }
    this.consume(T.RIGHT_PAREN, "Se esperaba ')' después de los argumentos");
    return { type: "CallExpression", callee, arguments: args, loc: callee.loc };
  }

  primary() {
    if (this.match(T.TRUE)) return this.literal(true, "boolean");
    if (this.match(T.FALSE)) return this.literal(false, "boolean");
    if (this.match(T.NULL)) return this.literal(null, "null");
    if (this.match(T.NUMBER)) return this.literal(this.previous().value, "number");
    if (this.match(T.FREQUENCY)) return this.literal(this.previous().value, "frequency");
    if (this.match(T.STRING)) return this.literal(this.previous().value, "string");
    if (this.match(T.IDENTIFIER)) {
      const token = this.previous();
      return { type: "Identifier", name: token.value, loc: this.loc(token) };
    }
    if (this.match(T.LEFT_BRACKET)) {
      const start = this.previous();
      const elements = [];
      if (!this.check(T.RIGHT_BRACKET)) do elements.push(this.expression()); while (this.match(T.COMMA));
      this.consume(T.RIGHT_BRACKET, "Se esperaba ']' después de la lista");
      return { type: "ArrayExpression", elements, loc: this.loc(start) };
    }
    if (this.match(T.LEFT_PAREN)) {
      const expression = this.expression();
      this.consume(T.RIGHT_PAREN, "Se esperaba ')' después de la expresión");
      return expression;
    }
    throw this.error(this.peek(), `Se esperaba una expresión y se encontró «${this.peek().lexeme || this.peek().type}»`);
  }

  literal(value, valueType) {
    const token = this.previous();
    return { type: "Literal", value, valueType, loc: this.loc(token) };
  }

  binary(left, operator, right, type = "BinaryExpression") {
    return { type, operator: operator.lexeme.toLowerCase(), left, right, loc: left.loc };
  }

  semicolon(message) {
    this.consume(T.SEMICOLON, message);
  }

  match(...types) {
    for (const type of types) if (this.check(type)) { this.advance(); return true; }
    return false;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  check(type) { return this.peek().type === type; }
  peekType(offset) { return this.tokens[Math.min(this.current + offset, this.tokens.length - 1)].type; }
  advance() { if (!this.check(T.EOF)) this.current += 1; return this.previous(); }
  peek() { return this.tokens[this.current]; }
  previous() { return this.tokens[this.current - 1]; }
  loc(token) { return { line: token.line, column: token.column }; }
  error(token, message) { return new MargaCodeError(message, token); }
}

export function parse(source) {
  return new Parser(tokenize(source)).parse();
}
