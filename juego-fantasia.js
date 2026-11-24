// ---------- Clase base (contiene el esqueleto) ----------
class Personaje {
  constructor(nombre) {
    if (new.target === Personaje) {
      throw new Error("Personaje es abstracta, no se puede instanciar");
    }
    this.nombre = nombre;
  }

  // MÉTODO PLANTILLA: define el esqueleto. Las subclases NO deberían redefinirlo.
  pelear() {
    this.anunciarCombate();   // hook
    this.prepararAtaque();    // abstracto
    this.prepararDefensa();   // abstracto
    this.posicionarse();      // abstracto
    this.ejecutarAtaque();    // abstracto
    this.evaluarResultado();  // concreto
  }

  // Pasos abstractos: cada subclase los implementa
  prepararAtaque() { throw new Error("prepararAtaque() debe implementarse"); }
  prepararDefensa() { throw new Error("prepararDefensa() debe implementarse"); }
  posicionarse() { throw new Error("posicionarse() debe implementarse"); }
  ejecutarAtaque() { throw new Error("ejecutarAtaque() debe implementarse"); }

  // Paso concreto: igual para todos
  evaluarResultado() {
    console.log(`${this.nombre} evalúa el resultado del combate`);
  }

  // HOOK: vacío por defecto, la subclase puede sobrescribirlo
  anunciarCombate() {}
}

// ---------- Subclases ----------
class Guerrero extends Personaje {
  constructor(nombre, arma, armadura) {
    super(nombre);
    this.arma = arma;
    this.armadura = armadura;
  }

  prepararAtaque() { console.log(`${this.nombre} prepara su ${this.arma}`); }
  prepararDefensa() { console.log(`${this.nombre} equipa su ${this.armadura}`); }
  posicionarse() { console.log(`${this.nombre} se acerca al enemigo`); }
  ejecutarAtaque() { console.log(`${this.nombre} ejecuta un ataque físico`); }

  // Sobrescribe el hook
  anunciarCombate() { console.log(`${this.nombre} lanza un grito de guerra`); }
}

class Mago extends Personaje {
  constructor(nombre, hechizo, baston, energiaMagica) {
    super(nombre);
    this.hechizo = hechizo;
    this.baston = baston;
    this.energiaMagica = energiaMagica;
  }

  prepararAtaque() { console.log(`${this.nombre} selecciona el hechizo ${this.hechizo}`); }
  prepararDefensa() { console.log(`${this.nombre} prepara su ${this.baston}`); }
  posicionarse() { console.log(`${this.nombre} concentra energía mágica (${this.energiaMagica})`); }
  ejecutarAtaque() { console.log(`${this.nombre} ejecuta un ataque mágico`); }
  // No redefine el hook
}

// ---------- Prueba ----------
const guerrero = new Guerrero("Thorin", "espada", "armadura de acero");
const mago = new Mago("Merlín", "Bola de fuego", "bastón", 80);

guerrero.pelear();
console.log("-----");
mago.pelear();