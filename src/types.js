export const PREFERRED_FREQUENCIES = Object.freeze([396, 417, 432, 528, 639, 741, 852, 963]);
export const EMOTIONAL_STATES = Object.freeze([
  "peace", "joy", "love", "fear", "anger", "sadness",
  "excitement", "calm", "anxious", "confident", "grateful"
]);
export const PROTECTION_LEVELS = Object.freeze(["low", "moderate", "high", "critical"]);

export const MargaTypes = Object.freeze({
  string: value => typeof value === "string",
  number: value => typeof value === "number" && Number.isFinite(value),
  boolean: value => typeof value === "boolean",
  emotional_state: value => typeof value === "string" && EMOTIONAL_STATES.includes(value),
  energy_level: value => typeof value === "number" && value >= 0 && value <= 1,
  frequency: value => typeof value === "number" && value >= 20 && value <= 20000,
  intention: value => typeof value === "string" && value.trim().length > 0,
  protection_level: value => typeof value === "string" && PROTECTION_LEVELS.includes(value)
});

export function validateTypeValue(type, value) {
  const validator = MargaTypes[type];
  if (!validator) return { ok: false, error: `Tipo desconocido «${type}»` };
  if (!validator(value)) return { ok: false, error: `El valor ${JSON.stringify(value)} no cumple el tipo ${type}` };
  return {
    ok: true,
    preferred: type !== "frequency" || PREFERRED_FREQUENCIES.includes(value)
  };
}
