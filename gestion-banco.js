//Gestion banco - punto 1

// Transaccion.js  (Estrategia)
class Transaccion {
  realizarOperacion(origen, destino, importe) {
    throw new Error("realizarOperacion() debe ser implementado por la subclase");
  }
}

// Deposito.js
class Deposito extends Transaccion {
  realizarOperacion(origen, destino, importe) {
    if (!origen || importe <= 0) return false;
    origen.acreditar(importe);
    return true;
  }
}

// Extraccion.js
class Extraccion extends Transaccion {
  realizarOperacion(origen, destino, importe) {
    if (!origen || importe <= 0) return false;
    if (origen.getSaldo() < importe) return false;
    origen.debitar(importe);
    return true;
  }
}

// Transferencia.js
class Transferencia extends Transaccion {
  realizarOperacion(origen, destino, importe) {
    if (!origen || !destino || importe <= 0) return false;
    if (origen.getSaldo() < importe) return false;
    origen.debitar(importe);
    destino.acreditar(importe);
    return true;
  }
}

// Cuenta.js
class Cuenta {
  #dni;
  #nombre;
  #numeroDeCuenta;
  #saldo;

  constructor(dni, nombre, numeroDeCuenta, saldo) {
    this.#dni = dni;
    this.#nombre = nombre;
    this.#numeroDeCuenta = numeroDeCuenta;
    this.#saldo = saldo;
  }

  getNumeroDeCuenta() { return this.#numeroDeCuenta; }
  getSaldo() { return this.#saldo; }
  acreditar(importe) { this.#saldo += importe; }
  debitar(importe) { this.#saldo -= importe; }
}

// Banco.js  (Contexto)
class Banco {
  #transaccionActual = null;
  #cuentas = [];

  agregarCuenta(cuenta) {
    this.#cuentas.push(cuenta);
  }

  setTransaccion(transaccion) {
    this.#transaccionActual = transaccion;
  }

  confirmarOperacion(origen, destino, importe) {
    if (!this.#transaccionActual) return false;
    return this.#transaccionActual.realizarOperacion(origen, destino, importe);
  }

  obtenerCuenta(numeroDeCuenta) {
    return this.#cuentas.find(c => c.getNumeroDeCuenta() === numeroDeCuenta) ?? null;
  }
}

// main.js  (prueba)
const banco = new Banco();
banco.agregarCuenta(new Cuenta(111, "Ana", 1, 1000));
banco.agregarCuenta(new Cuenta(222, "Luis", 2, 500));

const ana = banco.obtenerCuenta(1);
const luis = banco.obtenerCuenta(2);

banco.setTransaccion(new Extraccion());     // elige extracción...
banco.setTransaccion(new Transferencia());  // ...cambia de idea
console.log(banco.confirmarOperacion(ana, luis, 300));          // true
console.log(`${ana.getSaldo()} / ${luis.getSaldo()}`);          // 700 / 800

banco.setTransaccion(new Deposito());
banco.confirmarOperacion(ana, null, 100);   // destino null en depósito


