document.addEventListener("DOMContentLoaded", () => {
  fetchDatos(); //llama a funcion para traer datos del JSON
  filtroProductos(".buscarProductos", ".card");
  actualUsuario();
  datosFactura();
  verificarBackupMesa();
  mostrarResumen();
  mostrarFactura();
});

const fetchDatos = async () => {
  //Funcion para traer platos disponibles desde archivo JSON
  try {
    const res = await fetch("../database/db.json");
    const data = await res.json();
    mostrarPlatos(data);
    detectarBotones(data);
  } catch (error) {
    console.log(error);
  }
};

const boton = document.getElementById("botonCambiar");

//manejo de vistas platos y resumen
boton.addEventListener("click", () => {
  if (boton.textContent == " Resumen") {
    const platos = document.getElementById("contenedorPlatos");
    platos.className = "container-fluid invisible";
    const resumen = document.getElementById("resumen");
    resumen.className = "my-5";
    const boton = document.getElementById("botonCambiar");
    boton.textContent = " Ordenar";
    const factura = document.getElementById("factura");
    factura.className = "my-5 invisible";
    const botonImprimir = document.getElementById("botonImprimirFactura");
    botonImprimir.className = "btn btn-lg btn-success my-2 invisible";
    const botonDescuento = document.getElementById("botonCuponDescuento");
    botonDescuento.className = "btn btn-lg btn-warning my-2 invisible";
  } else if (boton.textContent == " Ordenar") {
    const platos = document.getElementById("contenedorPlatos");
    platos.className = "container-fluid";
    const resumen = document.getElementById("resumen");
    resumen.className = "my-5 invisible";
    const boton = document.getElementById("botonCambiar");
    boton.textContent = " Resumen";
    const factura = document.getElementById("factura");
    factura.className = "my-5 invisible";
    const botonImprimir = document.getElementById("botonImprimirFactura");
    botonImprimir.className = "btn btn-lg btn-success my-2 invisible";
    const botonDescuento = document.getElementById("botonCuponDescuento");
    botonDescuento.className = "btn btn-lg btn-warning my-2 invisible";
  }
});

const boton2 = document.getElementById("botonFacturar");

//manejo de vistas platos y resumen
boton2.addEventListener("click", () => {
  const platos = document.getElementById("contenedorPlatos");
  platos.className = "container-fluid invisible";
  const resumen = document.getElementById("resumen");
  resumen.className = "my-5 invisible";
  const factura = document.getElementById("factura");
  factura.className = "my-5";
  const botonImprimir = document.getElementById("botonImprimirFactura");
  botonImprimir.className = "btn btn-lg btn-success my-2";
  const botonDescuento = document.getElementById("botonCuponDescuento");
  botonDescuento.className = "btn btn-lg btn-warning my-2";
});

//generador de tarjetas de productos
const contendorProductos = document.querySelector("#contenedor-productos");
const mostrarPlatos = (data) => {
  //Funcion para cargar datos del JSON en forma de tarjetas en el HTML
  const template = document.querySelector("#template-productos").content;
  const fragment = document.createDocumentFragment();
  data.forEach((producto) => {
    template.querySelector("img").setAttribute("src", producto.thumbnailUrl);
    template.querySelector("h3").textContent = producto.title;
    template.querySelector(".descripcion").textContent = producto.descripcion;
    template.querySelector(".claves").textContent = producto.claves;
    template.querySelector("p span").textContent = producto.precio;
    template.querySelector("button").dataset.id = producto.id;
    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  contendorProductos.appendChild(fragment);
};

let resumen = {};
resumen = JSON.parse(localStorage.getItem("backupMesa"));

const verificarBackupMesa = () => {
  if (localStorage.getItem("backupMesa") !== null) {
    resumen = JSON.parse(localStorage.getItem("backupMesa"));
    return;
  } else {
    resumen = {};
    localStorage.setItem("backupMesa", JSON.stringify(resumen));
    return;
  }
};

//boton agregar producto a la mesa
const detectarBotones = (data) => {
  const botones = document.querySelectorAll(".card button");
  //escuchar botones de tarjetas para agregar el plato a la mesa
  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      //detecta click en tarjeta

      const producto = data.find(
        (item) => item.id === parseInt(btn.dataset.id)
      );
      producto.cantidad = 1;
      if (resumen.hasOwnProperty(producto.id)) {
        producto.cantidad = resumen[producto.id].cantidad + 1;
      }
      resumen[producto.id] = { ...producto };
      Toastify({
        text: "Agregado " + producto.title + " a la mesa.",
        duration: 1500,
        className: "info",
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        offset: {
          y: 110, // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        style: {
          background: "linear-gradient(to right, #198754, #558a3f)",
        },
      }).showToast();
      mostrarResumen();
      mostrarFactura();
    });
  });
};

const items = document.querySelector("#items");

const mostrarResumen = () => {
  //muestra resumen de lo cargado en la mesa
  items.innerHTML = "";
  const template = document.querySelector("#template-resumen").content;
  const fragment = document.createDocumentFragment();

  Object.values(resumen).forEach((producto) => {
    template.querySelector("th").textContent = producto.id;
    template.querySelectorAll("td")[0].textContent = producto.title;
    template.querySelectorAll("td")[1].textContent = producto.cantidad;
    template.querySelector("span").textContent =
      producto.precio * producto.cantidad;

    //botones para sumar o restar items
    template.querySelector(".btn-info").dataset.id = producto.id;
    template.querySelector(".btn-danger").dataset.id = producto.id;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
  localStorage.setItem("backupMesa", JSON.stringify(resumen));
  pintarFooter();
  accionBotones();
};

const itemsfactura = document.querySelector("#itemsfactura");

const mostrarFactura = () => {
  //muestra resumen de lo cargado en la mesa

  itemsfactura.innerHTML = "";

  const template2 = document.querySelector("#template-factura").content;
  const fragment2 = document.createDocumentFragment();

  Object.values(resumen).forEach((producto) => {
    template2.querySelector("th").textContent = producto.id;
    template2.querySelectorAll("td")[0].textContent = producto.title;
    template2.querySelectorAll("td")[1].textContent = producto.cantidad;
    template2.querySelector("span").textContent =
      producto.precio * producto.cantidad;
    const clone = template2.cloneNode(true);
    fragment2.appendChild(clone);
  });
  const multiplicador = 100000000000000000;
  itemsfactura.appendChild(fragment2);
  const aleatorio = Math.random() * multiplicador;
  JsBarcode("#barcode", aleatorio);
  pintarFooterFactura();
};

const footer = document.querySelector("#footer-resumen");
const pintarFooter = () => {
  footer.innerHTML = "";

  if (Object.keys(resumen).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">Se han eliminado los pedidos de la mesa</th>
        `;
    return;
  }

  const template = document.querySelector("#template-footer").content;
  const fragment = document.createDocumentFragment();

  // sumar cantidad y sumar totales
  const nCantidad = Object.values(resumen).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(resumen).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  template.querySelectorAll("td")[0].textContent = nCantidad;
  template.querySelector("span").textContent = nPrecio;

  const clone = template.cloneNode(true);
  fragment.appendChild(clone);

  footer.appendChild(fragment);
};

const footerFactura = document.querySelector("#footer-resumen-factura");

const pintarFooterFactura = () => {
  footerFactura.innerHTML = "";

  const template2 = document.querySelector("#template-footer-factura").content;
  const fragment2 = document.createDocumentFragment();
  const nCantidad = Object.values(resumen).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(resumen).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );
  //CUPON DE DESCUENTO APLICADO A nPrecio
  template2.querySelectorAll("td")[0].textContent = nCantidad;
  template2.querySelector("span").textContent = nPrecio;

  const clone = template2.cloneNode(true);
  fragment2.appendChild(clone);

  footerFactura.appendChild(fragment2);
};

botonImpresion = document.getElementById("imprimir");
botonImpresion.addEventListener("click", () => {
  let imprimirContenido = document.getElementById("factura").innerHTML;
  document.body.innerHTML = imprimirContenido;
  window.print();
  resumen = {};
  localStorage.setItem("backupMesa", JSON.stringify(resumen));
  window.location.href = "../pages/sistema.html";
});

function accionBotones() {
  const botonesAgregar = document.querySelectorAll("#items .btn-info");
  const botonesEliminar = document.querySelectorAll("#items .btn-danger");

  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = resumen[btn.dataset.id];
      producto.cantidad++;
      resumen[btn.dataset.id] = { ...producto };
      localStorage.setItem("backupMesa", JSON.stringify(resumen));
      mostrarResumen();
      mostrarFactura();
    });
  });

  botonesEliminar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = resumen[btn.dataset.id];
      producto.cantidad--;
      if (producto.cantidad === 0) {
        delete resumen[btn.dataset.id];
      } else {
        resumen[btn.dataset.id] = { ...producto };
      }
      localStorage.setItem("backupMesa", JSON.stringify(resumen));
      mostrarResumen();
      mostrarFactura();
    });
  });

  const botonVaciar = document.getElementById("vaciarMesa");
  botonVaciar.addEventListener("click", () => {
    resumen = {};
    localStorage.setItem("backupMesa", JSON.stringify(resumen));
    window.location.href = "../pages/sistema.html";
  });
}

//BUSCADOR DE PRODUCTOS
function filtroProductos(input, selector) {
  document.addEventListener("keydown", (e) => {
    //se eleigió keydown porque funciona mejor con celulares (o al menos eso vi probandolo)
    let entradaMinuscula = e.target.value.toLowerCase(); //manda a minusculas las entradas del input
    if (e.target.matches(input)) {
      document.querySelectorAll(selector).forEach(
        (
          el //recorre cada elemento selector (tarjetas)
        ) =>
          el.textContent.toLowerCase().includes(entradaMinuscula) //manda a minusculas el contenido de las tarjetas y compara con el input
            ? el.classList.remove("filtrar") //visibiliza tarjetas
            : el.classList.add("filtrar") //esconde tarjetas
      );
    }
  });
}

function actualUsuario() {
  const mailUsuarioActual = document.querySelector(".mailmesero");
  mailUsuarioActual.textContent = localStorage.getItem("mailActual");
  const mailfactura = document.querySelector(".mailmesero2");
  mailfactura.textContent = localStorage.getItem("mailActual");
  if (localStorage.getItem("mailActual") === null) {
    alert(
      "Usuario no registrado, por favor, regístrese antes de usar la aplicación."
    );
    window.location.href = "../index.html";
  }
}

function datosFactura() {
  let date = new Date();
  let fechaTexto = String(
    date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      " - " +
      date.getHours() +
      ":" +
      date.getMinutes()
  );
  let fechaFactura = document.getElementById("fechaEmisionFactura");
  fechaFactura.textContent = fechaTexto;
  verificarFacturacion();
  let facturaUltima = JSON.parse(localStorage.getItem("ultimaFactura"));
  console.log(facturaUltima);
  facturaUltima++;
  console.log(facturaUltima);
  let numeroFactura = document.getElementById("numeroEmisionFactura");
  numeroFactura.textContent = facturaUltima;
  localStorage.setItem("ultimaFactura", JSON.stringify(facturaUltima));
}

function verificarFacturacion() {
  if (localStorage.getItem("ultimaFactura") !== null) {
    return;
  } else {
    localStorage.setItem("ultimaFactura", JSON.stringify(34552));
    return;
  }
}
