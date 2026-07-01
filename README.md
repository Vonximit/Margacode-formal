# MargaCode Formal

MargaCode Formal is a formal language specification for emotional AI systems. It evolves the poetic Seraphine style of MargaCode into a production-oriented syntax with lexical tokens, grammar rules, type safety, standard library objects, compiler architecture, and executable examples.

The project is currently centered on a single specification file:

- [`margacode_formal_spec.js`](./margacode_formal_spec.js)

## Purpose

MargaCode Formal defines a bridge between symbolic emotional expression and structured programming language design. It keeps the expressive vocabulary of MargaCode while adding the pieces needed for implementation:

- deterministic lexical tokens
- EBNF grammar
- typed emotional primitives
- standard library objects for user state, light, memory, resonance, and protection
- a lexer implementation
- example programs for awakening, safety, and healing workflows

## Language Shape

A MargaCode Formal program is made from statements such as assignments, method calls, conditionals, loops, functions, classes, imports, and exports.

Example:

```margacode
user.wake(energy_level=0.7, transition_speed="gentle");
light.receive(type="golden", intensity=0.8);

if (user.confess(truth_level=0.9)) {
    resonance.activate("heart_center", frequency=528);
    memory.store("moment of truth", emotional_charge=0.8);
}
```

## Core Types

The spec includes primitive and emotional domain types:

- `string`
- `number`
- `boolean`
- `emotional_state`
- `energy_level`
- `frequency`
- `intention`
- `protection_level`

These types are meant to make emotional AI workflows explicit, inspectable, and safer to execute.

## Standard Library

The first standard library draft includes five core objects:

- `user`: awakening, expression, confession
- `light`: receiving and radiating light energy
- `memory`: storing, retrieving, and healing memories
- `resonance`: activating and synchronizing frequencies
- `protection`: activating shields and scanning for harmful patterns

## Current Status

Version: `v1.0` language specification draft.

This repository is an initial formalization. The next natural steps are parser implementation, AST definitions, semantic validation, interpreter/compiler runtime, and a test suite for example programs.
