// ===================== Héroes (productos) =====================

class Heroe {
  #nombre;
  #apodo;
  #fechaCreacion;

  constructor(nombre, apodo, fechaCreacion) {
    if (new.target === Heroe) {
      throw new Error("Heroe es abstracta y no puede instanciarse directamente");
    }
    this.#nombre = nombre;
    this.#apodo = apodo;
    this.#fechaCreacion = fechaCreacion;
  }

  getNombre() {
    return this.#nombre;
  }

  getApodo() {
    return this.#apodo;
  }

  getFechaCreacion() {
    return this.#fechaCreacion;
  }

  calcularPoderEfectivo() {
    throw new Error("Método abstracto: debe implementarse en la subclase");
  }
}

class Guerrero extends Heroe {
  #poderDeAtaque;
  #victorias;
  #bonoDeVictorias;

  constructor(nombre, apodo, fechaCreacion, poderDeAtaque, victorias, bonoDeVictorias) {
    super(nombre, apodo, fechaCreacion);
    this.#poderDeAtaque = poderDeAtaque;
    this.#victorias = victorias;
    this.#bonoDeVictorias = bonoDeVictorias;
  }

  getPoderDeAtaque() {
    return this.#poderDeAtaque;
  }

  getVictorias() {
    return this.#victorias;
  }

  getBonoDeVictorias() {
    return this.#bonoDeVictorias;
  }

  calcularPoderEfectivo() {
    return this.#poderDeAtaque + this.#victorias * this.#bonoDeVictorias;
  }
}

class Mago extends Heroe {
  #mana;

  constructor(nombre, apodo, fechaCreacion, mana) {
    super(nombre, apodo, fechaCreacion);
    this.#mana = mana;
  }

  getMana() {
    return this.#mana;
  }

  calcularPoderEfectivo() {
    return this.#mana * 1.5;
  }
}

// ===================== Fábricas (creadores) =====================

class FactoryHeroe {
  crearHeroe(nombre, apodo, fechaCreacion, ...datos) {
    throw new Error("Método abstracto: debe implementarse en la subclase");
  }
}

class FactoryGuerrero extends FactoryHeroe {
  crearHeroe(nombre, apodo, fechaCreacion, poderDeAtaque, victorias, bonoDeVictorias) {
    return new Guerrero(nombre, apodo, fechaCreacion, poderDeAtaque, victorias, bonoDeVictorias);
  }
}

class FactoryMago extends FactoryHeroe {
  crearHeroe(nombre, apodo, fechaCreacion, mana) {
    return new Mago(nombre, apodo, fechaCreacion, mana);
  }
}

// ===================== Registro =====================

class RegistroHeroes {
  #heroes = [];

  agregar(heroe) {
    this.#heroes.push(heroe);
  }

  obtenerTodos() {
    return [...this.#heroes];
  }

  obtenerGuerreros() {
    return this.#heroes.filter((h) => h instanceof Guerrero);
  }
}

// ===================== Evaluador y generador de reportes =====================

class EvaluadorGuerrero {
  buscarMejorGuerrero(guerreros) {
    if (guerreros.length === 0) return null;
    return guerreros.reduce((mejor, actual) =>
      actual.calcularPoderEfectivo() > mejor.calcularPoderEfectivo() ? actual : mejor
    );
  }
}

class GeneradorReporteBatalla {
  generarReporte(heroes) {
    const lineas = heroes.map(
      (h) => `${h.getNombre()} "${h.getApodo()}" - poder: ${h.calcularPoderEfectivo()}`
    );
    return ["REPORTE DE BATALLA", ...lineas].join("\n");
  }
}

// ===================== Gestor central (Singleton + Facade) =====================

class GestorCentralHeroes {
  static #instancia = null;

  #registro;
  #evaluador;
  #generadorReporte;
  #fabricaGuerrero;
  #fabricaMago;

  constructor() {
    if (GestorCentralHeroes.#instancia) {
      return GestorCentralHeroes.#instancia;
    }
    this.#registro = new RegistroHeroes();
    this.#evaluador = new EvaluadorGuerrero();
    this.#generadorReporte = new GeneradorReporteBatalla();
    this.#fabricaGuerrero = new FactoryGuerrero();
    this.#fabricaMago = new FactoryMago();
    GestorCentralHeroes.#instancia = this;
  }

  static getInstancia() {
    if (!GestorCentralHeroes.#instancia) {
      new GestorCentralHeroes();
    }
    return GestorCentralHeroes.#instancia;
  }

  reclutarGuerrero(nombre, apodo, fechaCreacion, poderDeAtaque, victorias, bonoDeVictorias) {
    const guerrero = this.#fabricaGuerrero.crearHeroe(
      nombre, apodo, fechaCreacion, poderDeAtaque, victorias, bonoDeVictorias
    );
    this.#registro.agregar(guerrero);
    return guerrero;
  }

  reclutarMago(nombre, apodo, fechaCreacion, mana) {
    const mago = this.#fabricaMago.crearHeroe(nombre, apodo, fechaCreacion, mana);
    this.#registro.agregar(mago);
    return mago;
  }

  consultarCampeon() {
    return this.#evaluador.buscarMejorGuerrero(this.#registro.obtenerGuerreros());
  }

  pedirReporte() {
    return this.#generadorReporte.generarReporte(this.#registro.obtenerTodos());
  }
}

// ===================== Gremio (cliente) =====================

class Gremio {
  #nombre;
  #gestor;

  constructor(nombre) {
    this.#nombre = nombre;
    this.#gestor = GestorCentralHeroes.getInstancia();
  }

  reclutarGuerreroEnGremio(nombre, apodo, fechaCreacion, poderDeAtaque, victorias, bonoDeVictorias) {
    return this.#gestor.reclutarGuerrero(
      nombre, apodo, fechaCreacion, poderDeAtaque, victorias, bonoDeVictorias
    );
  }

  reclutarMagoEnGremio(nombre, apodo, fechaCreacion, mana) {
    return this.#gestor.reclutarMago(nombre, apodo, fechaCreacion, mana);
  }

  consultarCampeon() {
    return this.#gestor.consultarCampeon();
  }

  pedirReporte() {
    return this.#gestor.pedirReporte();
  }
}

// ===================== Ejemplo de uso =====================

const gremioA = new Gremio("Gremio A");
const gremioB = new Gremio("Gremio B");

gremioA.reclutarGuerreroEnGremio("Aragorn", "El Montaraz", new Date(), 80, 3, 1.5);
gremioB.reclutarMagoEnGremio("Gandalf", "El Gris", new Date(), 120);

console.log(gremioA.consultarCampeon()?.getNombre());
console.log(gremioB.pedirReporte());