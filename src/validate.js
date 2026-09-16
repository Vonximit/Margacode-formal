import { MargaTypes, validateTypeValue } from "./types.js";

function literalValue(node) {
  return node?.type === "Literal" ? { known: true, value: node.value } : { known: false };
}

export function validate(ast) {
  const errors = [];
  const warnings = [];
  const checkedFrequencies = new WeakSet();

  function report(node, message) {
    errors.push({ message, line: node?.loc?.line ?? 1, column: node?.loc?.column ?? 1 });
  }

  function visit(node) {
    if (!node || typeof node !== "object") return;

    if (node.type === "VariableDeclaration" && node.valueType) {
      const type = node.valueType.name;
      if (!MargaTypes[type]) report(node.valueType, `Tipo desconocido «${type}»`);
      const literal = literalValue(node.init);
      if (literal.known && MargaTypes[type]) {
        const result = validateTypeValue(type, literal.value);
        if (!result.ok) report(node.init, result.error);
        else if (type === "frequency" && !result.preferred) {
          warnings.push({ message: `La frecuencia ${literal.value}Hz es válida, pero no pertenece al conjunto preferido`, ...node.init.loc });
        }
        if (type === "frequency" && node.init?.type === "Literal") checkedFrequencies.add(node.init);
      }
    }

    if (node.type === "Literal" && node.valueType === "frequency" && !checkedFrequencies.has(node)) {
      const result = validateTypeValue("frequency", node.value);
      if (!result.ok) report(node, result.error);
      else if (!result.preferred) warnings.push({ message: `La frecuencia ${node.value}Hz es válida, pero no pertenece al conjunto preferido`, ...node.loc });
    }

    for (const [key, value] of Object.entries(node)) {
      if (key === "loc") continue;
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === "object") visit(value);
    }
  }

  visit(ast);
  return { ok: errors.length === 0, errors, warnings };
}
