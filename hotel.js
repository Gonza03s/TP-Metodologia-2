// hotel - punto 2

// ---------- Clases existentes (Adaptees, NO se modifican) ----------
class TarjetaCredito {
  validarLimite(numeroTarjeta, monto) {
    console.log(`Validando límite de la tarjeta ${numeroTarjeta} para $${monto}`);
    return monto <= 100000; // límite simulado
  }

  autorizarCargo(numeroTarjeta, monto) {
    console.log(`Cargo autorizado en la tarjeta ${numeroTarjeta} por $${monto}`);
    return true;
  }
}

class BilleteraVirtual {
  pagar(email, monto) {
    console.log(`Pago de $${monto} con billetera de ${email}`);
    return true;
  }
}

// ---------- Clases del sistema ----------
class Huesped {
  #nombre;
  #apellido;
  #email;
  #numeroTarjeta;

  constructor(nombre, apellido, email, numeroTarjeta) {
    this.#nombre = nombre;
    this.#apellido = apellido;
    this.#email = email;
    this.#numeroTarjeta = numeroTarjeta;
  }

  getEmail() { return this.#email; }
  getNumeroTarjeta() { return this.#numeroTarjeta; }
}

class Reserva {
  #huesped;
  #montoTotal;

  constructor(huesped, montoTotal) {
    this.#huesped = huesped;
    this.#montoTotal = montoTotal;
  }

  pagarCon(medio) {
    return medio.pagar(this.#huesped, this.#montoTotal);
  }
}

// ---------- Target ----------
class MedioDePago {
  pagar(huesped, monto) {
    throw new Error("pagar() debe ser implementado por la subclase");
  }
}

// ---------- Adapters ----------
class TarjetaCreditoAdapter extends MedioDePago {
  #tarjeta;

  constructor(tarjeta) {
    super();
    this.#tarjeta = tarjeta;
  }

  pagar(huesped, monto) {
    const numero = huesped.getNumeroTarjeta();
    if (this.#tarjeta.validarLimite(numero, monto)) {
      return this.#tarjeta.autorizarCargo(numero, monto);
    }
    return false;
  }
}

class BilleteraVirtualAdapter extends MedioDePago {
  #billetera;

  constructor(billetera) {
    super();
    this.#billetera = billetera;
  }

  pagar(huesped, monto) {
    return this.#billetera.pagar(huesped.getEmail(), monto);
  }
}

// ---------- Prueba ----------
const huesped = new Huesped("Ana", "Gómez", "ana@mail.com", "4111-1111");
const reserva = new Reserva(huesped, 50000);

const conTarjeta = new TarjetaCreditoAdapter(new TarjetaCredito());
const conBilletera = new BilleteraVirtualAdapter(new BilleteraVirtual());

console.log(reserva.pagarCon(conTarjeta));   // true
console.log(reserva.pagarCon(conBilletera)); // true