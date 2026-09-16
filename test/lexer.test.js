import test from "node:test";
import assert from "node:assert/strict";
import { MargaCodeError, TokenType, tokenize } from "../src/index.js";

test("reconoce identificadores Unicode y REACTION", () => {
  const tokens = tokenize("REACTION acompañar(niña: string) { return niña; }");
  assert.equal(tokens[0].type, TokenType.REACTION);
  assert.equal(tokens[1].value, "acompañar");
  assert.equal(tokens[3].value, "niña");
});

test("convierte 528Hz en un literal de frecuencia", () => {
  const token = tokenize("528Hz")[0];
  assert.equal(token.type, TokenType.FREQUENCY);
  assert.equal(token.value, 528);
});

test("rechaza decoradores eliminados en v1.2", () => {
  assert.throws(() => tokenize("@resonance"), error => {
    assert.ok(error instanceof MargaCodeError);
    assert.match(error.message, /eliminados/);
    return true;
  });
});

test("conserva línea y columna en errores léxicos", () => {
  assert.throws(() => tokenize("let x = 1;\n  ~"), /\(2:3\)/);
});
