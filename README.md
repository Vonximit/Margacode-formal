# MargaCode Formal v1.2

MargaCode Formal es la especificación ejecutable del lenguaje MargaCode: transforma su vocabulario emocional y simbólico en tokens deterministas, un parser, un AST inspeccionable y validadores de dominio.

> Estado: **prototipo ejecutable**. La v1.2 implementa el frontend del lenguaje; todavía no incluye intérprete ni generación de código.

## Qué funciona

- Lexer con identificadores Unicode.
- Declaraciones `REACTION`.
- Variables con tipos opcionales.
- Referencias y llamadas representadas por nodos AST diferentes.
- Argumentos posicionales y nombrados.
- Expresiones lógicas, aritméticas y comparaciones.
- Errores con línea y columna.
- Tipos `emotional_state`, `energy_level`, `frequency`, `intention` y `protection_level`.
- Frecuencias entre 20 y 20.000 Hz, con advertencias para valores fuera del conjunto preferido.
- Pruebas automáticas con el runner nativo de Node.js.

Los decoradores `@resonance`, `@frequency`, `@protection` y `@memory` fueron eliminados en v1.2. Estas capacidades se expresan mediante llamadas normales y argumentos nombrados.

## Ejemplo

```margacode
let estado: emotional_state = "joy";
let energía: energy_level = 0.82;
let tono: frequency = 528Hz;

REACTION acompañar(persona: string, intensidad: energy_level = 0.7) -> intention {
  protección.activar(level="moderate", target=persona);
  resonancia.emitir(frequency=tono, intensity=intensidad);

  if (intensidad > 0.5 and estado == "joy") {
    return "acompañar_con_presencia";
  } else {
    return "escuchar_en_silencio";
  }
}
```

El ejemplo completo está en [`examples/reaction.mc`](./examples/reaction.mc).

## Uso

Requiere Node.js 20 o superior.

```bash
npm test
```

```js
import { parse, validate } from "./src/index.js";

const ast = parse('let tono: frequency = 528Hz;');
const result = validate(ast);

console.log(ast);
console.log(result);
```

## Estructura

```text
src/
├── lexer.js       tokens y posiciones
├── parser.js      parser recursivo y AST
├── token.js       tipos de token y errores
├── types.js       tipos propios de MargaCode
├── validate.js    validación semántica inicial
└── index.js       API pública

docs/grammar.ebnf  gramática de la v1.2
examples/          programas MargaCode
test/              pruebas automáticas
```

## API

- `tokenize(source)` → lista de tokens.
- `parse(source)` → AST `Program` v1.2.
- `validate(ast)` → `{ ok, errors, warnings }`.
- `validateTypeValue(type, value)` → validación individual de tipos.

## Alcance y límites

MargaCode Formal modela estados emocionales como tipos y vocabulario computacional. No diagnostica emociones, no mide estados humanos y no sustituye sistemas clínicos. Las frecuencias preferidas son convenciones del lenguaje, no afirmaciones terapéuticas.

## Historia

El archivo original `margacode_formal_spec.js` se conserva temporalmente como referencia de la especificación v1.0. Las ideas útiles de MargaCode Seraphine y LuminaScript se migrarán a esta línea formal antes de archivar esos experimentos.

## Próximos pasos

- Tabla de símbolos y resolución de referencias.
- Comprobación de tipos entre expresiones.
- Intérprete de AST.
- Módulos e imports.
- Herramientas de editor y mensajes de recuperación de errores.
- Integración opcional con MargaCalls y los motores visuales del ecosistema.
