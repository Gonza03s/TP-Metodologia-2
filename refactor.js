// Cada tipo de habilidad tiene su propio cálculo de daño y su texto
const estrategiasHabilidad = {
  magica: {
    calcularDanio: (danioBase) => danioBase * 2,
    tipoTexto: "Habilidad tipo habilidad mágica",
    efectoTexto: "Esta habilidad dobla tu fuerza",
  },
  cuerpoACuerpo: {
    calcularDanio: (danioBase) => danioBase,
    tipoTexto: "Habilidad tipo habilidad Cuerpo a cuerpo",
    efectoTexto: "Este habilidad mantiene tu fuerza",
  },
};

function obtenerEstrategia(nombreHabilidad) {
  return (
    estrategiasHabilidad[nombreHabilidad] || {
      calcularDanio: (danioBase) => danioBase,
      tipoTexto: "Habilidad genérica",
      efectoTexto: "Mantiene tu fuerza",
    }
  );
}

function personajeConMasDanio(personajes) {
  if (!personajes || personajes.length === 0) return null;

  let mejorPersonaje = personajes[0];
  let maxDanio = obtenerEstrategia(mejorPersonaje.habilidad).calcularDanio(mejorPersonaje.danio);

  for (const personaje of personajes) {
    const estrategia = obtenerEstrategia(personaje.habilidad);
    const danioTotal = estrategia.calcularDanio(personaje.danio);

    if (danioTotal > maxDanio) {
      maxDanio = danioTotal;
      mejorPersonaje = personaje;
    }
  }

  return mejorPersonaje;
}

function imprimirInfo(personaje) {
  if (!personaje) return;

  const estrategia = obtenerEstrategia(personaje.habilidad);

  console.log(`${personaje.nombre} tiene como daño ${personaje.danio}`);
  console.log(estrategia.tipoTexto);
  console.log(estrategia.efectoTexto);
}

// --- Ejemplo ---
const personajes = [
  { nombre: "Gandalf", danio: 30, habilidad: "magica" },
  { nombre: "Aragorn", danio: 50, habilidad: "cuerpoACuerpo" },
];

imprimirInfo(personajes[0]);

const ganador = personajeConMasDanio(personajes);
if (ganador) {
  console.log("Mayor daño:", ganador.nombre);
}