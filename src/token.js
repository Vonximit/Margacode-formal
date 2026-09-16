export const TokenType = Object.freeze({
  EOF: "EOF",
  IDENTIFIER: "IDENTIFIER",
  NUMBER: "NUMBER",
  FREQUENCY: "FREQUENCY",
  STRING: "STRING",
  LET: "LET",
  REACTION: "REACTION",
  IF: "IF",
  ELSE: "ELSE",
  RETURN: "RETURN",
  TRUE: "TRUE",
  FALSE: "FALSE",
  NULL: "NULL",
  AND: "AND",
  OR: "OR",
  NOT: "NOT",
  LEFT_PAREN: "LEFT_PAREN",
  RIGHT_PAREN: "RIGHT_PAREN",
  LEFT_BRACE: "LEFT_BRACE",
  RIGHT_BRACE: "RIGHT_BRACE",
  LEFT_BRACKET: "LEFT_BRACKET",
  RIGHT_BRACKET: "RIGHT_BRACKET",
  COMMA: "COMMA",
  DOT: "DOT",
  COLON: "COLON",
  SEMICOLON: "SEMICOLON",
  ARROW: "ARROW",
  PLUS: "PLUS",
  MINUS: "MINUS",
  STAR: "STAR",
  SLASH: "SLASH",
  PERCENT: "PERCENT",
  ASSIGN: "ASSIGN",
  EQUAL: "EQUAL",
  BANG_EQUAL: "BANG_EQUAL",
  GREATER: "GREATER",
  GREATER_EQUAL: "GREATER_EQUAL",
  LESS: "LESS",
  LESS_EQUAL: "LESS_EQUAL"
});

export const KEYWORDS = Object.freeze({
  let: TokenType.LET,
  reaction: TokenType.REACTION,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  null: TokenType.NULL,
  and: TokenType.AND,
  or: TokenType.OR,
  not: TokenType.NOT
});

export class MargaCodeError extends SyntaxError {
  constructor(message, tokenOrLocation = {}) {
    const line = tokenOrLocation.line ?? 1;
    const column = tokenOrLocation.column ?? 1;
    super(`${message} (${line}:${column})`);
    this.name = "MargaCodeError";
    this.line = line;
    this.column = column;
  }
}
