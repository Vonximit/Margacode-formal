# MargaCode Formal v1.2

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
