import { KEYWORDS, MargaCodeError, TokenType } from "./token.js";

const IDENTIFIER_START = /[\p{L}_]/u;
const IDENTIFIER_PART = /[\p{L}\p{N}_]/u;

export class Lexer {
  constructor(source) {
    this.source = String(source);
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.column = 1;
    this.startLine = 1;
    this.startColumn = 1;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.startLine = this.line;
      this.startColumn = this.column;
      this.scanToken();
    }
    this.tokens.push(this.token(TokenType.EOF, null, ""));
    return this.tokens;
  }

  scanToken() {
    const char = this.advance();
    const simple = {
      "(": TokenType.LEFT_PAREN,
      ")": TokenType.RIGHT_PAREN,
      "{": TokenType.LEFT_BRACE,
      "}": TokenType.RIGHT_BRACE,
      "[": TokenType.LEFT_BRACKET,
      "]": TokenType.RIGHT_BRACKET,
      ",": TokenType.COMMA,
      ".": TokenType.DOT,
      ":": TokenType.COLON,
      ";": TokenType.SEMICOLON,
      "+": TokenType.PLUS,
      "*": TokenType.STAR,
      "%": TokenType.PERCENT
    };

    if (simple[char]) return this.add(simple[char]);
    if (char === "-") return this.add(this.match(">") ? TokenType.ARROW : TokenType.MINUS);
    if (char === "=") return this.add(this.match("=") ? TokenType.EQUAL : TokenType.ASSIGN);
    if (char === "!") {
      if (this.match("=")) return this.add(TokenType.BANG_EQUAL);
      throw this.error("Se esperaba '=' después de '!'. Usa 'not' para negación");
    }
    if (char === ">") return this.add(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER);
    if (char === "<") return this.add(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
    if (char === "/") {
      if (this.match("/")) return this.skipLineComment();
      if (this.match("*")) return this.skipBlockComment();
      return this.add(TokenType.SLASH);
    }
    if (char === "#") return this.skipLineComment();
    if (char === '"' || char === "'") return this.string(char);
    if (/\d/.test(char)) return this.number();
    if (IDENTIFIER_START.test(char)) return this.identifier();
    if (/\s/.test(char)) return;
    if (char === "@") throw this.error("Los decoradores '@' fueron eliminados en MargaCode v1.2");
    throw this.error(`Carácter inesperado «${char}»`);
  }

  identifier() {
    while (!this.isAtEnd() && IDENTIFIER_PART.test(this.peek())) this.advance();
    const lexeme = this.source.slice(this.start, this.current);
    const type = KEYWORDS[lexeme.toLowerCase()] ?? TokenType.IDENTIFIER;
    this.add(type, type === TokenType.IDENTIFIER ? lexeme : lexeme.toLowerCase());
  }

  number() {
    while (/\d/.test(this.peek())) this.advance();
    if (this.peek() === "." && /\d/.test(this.peekNext())) {
      this.advance();
      while (/\d/.test(this.peek())) this.advance();
    }
    const value = Number(this.source.slice(this.start, this.current));
    if ((this.peek() === "H" || this.peek() === "h") && (this.peekNext() === "z" || this.peekNext() === "Z")) {
      this.advance();
      this.advance();
      return this.add(TokenType.FREQUENCY, value);
    }
    this.add(TokenType.NUMBER, value);
  }

  string(quote) {
    let value = "";
    while (!this.isAtEnd() && this.peek() !== quote) {
      const char = this.advance();
      if (char === "\\") {
        if (this.isAtEnd()) throw this.error("Cadena sin cerrar");
        const escaped = this.advance();
        const escapes = { n: "\n", r: "\r", t: "\t", "\\": "\\", '"': '"', "'": "'" };
        value += escapes[escaped] ?? escaped;
      } else {
        value += char;
      }
    }
    if (this.isAtEnd()) throw this.error("Cadena sin cerrar");
    this.advance();
    this.add(TokenType.STRING, value);
  }

  skipLineComment() {
    while (!this.isAtEnd() && this.peek() !== "\n") this.advance();
  }

  skipBlockComment() {
    while (!this.isAtEnd()) {
      if (this.peek() === "*" && this.peekNext() === "/") {
        this.advance();
        this.advance();
        return;
      }
      this.advance();
    }
    throw this.error("Comentario de bloque sin cerrar");
  }

  add(type, value = null) {
    this.tokens.push(this.token(type, value));
  }

  token(type, value, lexeme = this.source.slice(this.start, this.current)) {
    return { type, value, lexeme, line: this.startLine, column: this.startColumn };
  }

  advance() {
    const char = this.source[this.current++];
    if (char === "\n") {
      this.line += 1;
      this.column = 1;
    } else {
      this.column += 1;
    }
    return char;
  }

  match(expected) {
    if (this.isAtEnd() || this.source[this.current] !== expected) return false;
    this.advance();
    return true;
  }

  peek() {
    return this.isAtEnd() ? "\0" : this.source[this.current];
  }

  peekNext() {
    return this.current + 1 >= this.source.length ? "\0" : this.source[this.current + 1];
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  error(message) {
    return new MargaCodeError(message, { line: this.startLine, column: this.startColumn });
  }
}

export function tokenize(source) {
  return new Lexer(source).scanTokens();
}
