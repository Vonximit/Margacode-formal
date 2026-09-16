import test from "node:test";
import assert from "node:assert/strict";
import { parse, validate } from "../src/index.js";

test("produce AST para una reacción con parámetros tipados", () => {
  const ast = parse(`
    REACTION cuidar(persona: string, nivel: energy_level = 0.8) -> intention {
      return "presencia";
    }
  `);
  const reaction = ast.body[0];
  assert.equal(reaction.type, "ReactionDeclaration");
  assert.equal(reaction.name, "cuidar");
  assert.equal(reaction.params[1].valueType.name, "energy_level");
  assert.equal(reaction.returnType.name, "intention");
});

test("separa referencias de llamadas y conserva argumentos nombrados", () => {
  const ast = parse('resonancia.emitir(frequency=528Hz, intensity=0.7);');
  const call = ast.body[0].expression;
  assert.equal(call.type, "CallExpression");
  assert.equal(call.callee.type, "ReferenceExpression");
  assert.equal(call.callee.property.name, "emitir");
  assert.deepEqual(call.arguments.map(arg => arg.name), ["frequency", "intensity"]);
});

test("rechaza argumentos posicionales después de argumentos nombrados", () => {
  assert.throws(() => parse('luz.emitir(color="violeta", 0.8);'), /posicionales/);
});

test("valida tipos de dominio", () => {
  const ast = parse(`
    let estado: emotional_state = "joy";
    let energía: energy_level = 1.2;
    let frecuencia: frequency = 25000Hz;
  `);
  const result = validate(ast);
  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0].message, /energy_level/);
  assert.match(result.errors[1].message, /frequency/);
});

test("advierte sobre frecuencias válidas no preferidas", () => {
  const result = validate(parse("let tono: frequency = 440Hz;"));
  assert.equal(result.ok, true);
  assert.equal(result.warnings.length, 1);
});

test("informa errores sintácticos con ubicación", () => {
  assert.throws(() => parse("let emoción: emotional_state = ;"), /\(1:32\)/);
});
