
// punto 4 - Sistema monitoreo 

// ---------- Sujeto (interfaz) ----------
class Sujeto {
  suscribir(observador) { throw new Error("suscribir() debe implementarse"); }
  desuscribir(observador) { throw new Error("desuscribir() debe implementarse"); }
  notificar() { throw new Error("notificar() debe implementarse"); }
}

// ---------- Observador (interfaz) ----------
class Observador {
  actualizar(sensor) { throw new Error("actualizar() debe implementarse"); }
}

// ---------- Sensor (abstracta, implementa Sujeto) ----------
class Sensor extends Sujeto {
  _nombre;
  _unidad;
  _valor = 0;
  _observadores = [];

  constructor(nombre, unidad) {
    super();
    if (new.target === Sensor) {
      throw new Error("Sensor es abstracta, no se puede instanciar");
    }
    this._nombre = nombre;
    this._unidad = unidad;
  }

  suscribir(observador) {
    if (!this._observadores.includes(observador)) {
      this._observadores.push(observador);
    }
  }

  desuscribir(observador) {
    this._observadores = this._observadores.filter(o => o !== observador);
  }

  notificar() {
    for (const o of this._observadores) {
      o.actualizar(this);
    }
  }

  setValor(v) {
    this._valor = v;
    this.notificar();
  }

  getValor() { return this._valor; }
  getNombre() { return this._nombre; }
  getUnidad() { return this._unidad; }
}

// ---------- Sujetos concretos ----------
class SensorTemperatura extends Sensor {
  constructor() { super("Temperatura", "°C"); }
}

class SensorHumedad extends Sensor {
  constructor() { super("Humedad", "%"); }
}

class SensorCO2 extends Sensor {
  constructor() { super("CO2", "ppm"); }
}

class SensorLuminosidad extends Sensor {
  constructor() { super("Luminosidad", "lux"); }
}

// ---------- Observadores concretos ----------
class PanelPrincipal extends Observador {
  #valores = new Map();

  actualizar(sensor) {
    this.#valores.set(sensor.getNombre(), sensor.getValor());
    console.log("[Panel principal]");
    for (const [nombre, valor] of this.#valores) {
      console.log(`   ${nombre}: ${valor}`);
    }
  }
}

class PanelAlertas extends Observador {
  #umbrales = new Map();

  setUmbral(nombre, limite) {
    this.#umbrales.set(nombre, limite);
  }

  actualizar(sensor) {
    const limite = this.#umbrales.get(sensor.getNombre());
    if (limite !== undefined && sensor.getValor() > limite) {
      console.log(
        `[ALERTA] ${sensor.getNombre()} = ${sensor.getValor()} ${sensor.getUnidad()} supera el umbral (${limite})`
      );
    }
  }
}

class RegistroConsola extends Observador {
  actualizar(sensor) {
    console.log(`[Log] ${sensor.getNombre()} cambió a ${sensor.getValor()} ${sensor.getUnidad()}`);
  }
}

// ---------- Prueba ----------
const temperatura = new SensorTemperatura();
const co2 = new SensorCO2();

const principal = new PanelPrincipal();
const alertas = new PanelAlertas();
const consola = new RegistroConsola();

alertas.setUmbral("Temperatura", 35);
alertas.setUmbral("CO2", 1000);




// Suscripciones
temperatura.suscribir(principal);
temperatura.suscribir(alertas);
temperatura.suscribir(consola);
co2.suscribir(principal);
co2.suscribir(alertas);

console.log("--- Temperatura = 25 ---");
temperatura.setValor(25);

console.log("--- Temperatura = 40 (supera umbral) ---");
temperatura.setValor(40);

console.log("--- Desactivo la consola para temperatura ---");
temperatura.desuscribir(consola);
temperatura.setValor(30);

console.log("--- CO2 = 1200 (supera umbral) ---");
co2.setValor(1200);