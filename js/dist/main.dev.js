"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

document.addEventListener("DOMContentLoaded", function () {
  fetchDatos(); //llama a funcion para traer datos del JSON

  filtroProductos(".buscarProductos", ".card");
  actualUsuario();
  datosFactura();
  verificarBackupMesa();
  mostrarResumen();
  mostrarFactura();
});

var fetchDatos = function fetchDatos() {
  var res, data;
  return regeneratorRuntime.async(function fetchDatos$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch("../database/db.json"));

        case 3:
          res = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(res.json());

        case 6:
          data = _context.sent;
          mostrarPlatos(data);
          detectarBotones(data);
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var boton = document.getElementById("botonCambiar"); //manejo de vistas platos y resumen

boton.addEventListener("click", function () {
  if (boton.textContent == " Resumen") {
    var platos = document.getElementById("contenedorPlatos");
    platos.className = "container-fluid invisible";

    var _resumen = document.getElementById("resumen");

    _resumen.className = "my-5";

    var _boton = document.getElementById("botonCambiar");

    _boton.textContent = " Ordenar";
    var factura = document.getElementById("factura");
    factura.className = "my-5 invisible";
    var botonImprimir = document.getElementById("botonImprimirFactura");
    botonImprimir.className = "btn btn-lg btn-success my-2 invisible";
    var botonDescuento = document.getElementById("botonCuponDescuento");
    botonDescuento.className = "btn btn-lg btn-warning my-2 invisible";
  } else if (boton.textContent == " Ordenar") {
    var _platos = document.getElementById("contenedorPlatos");

    _platos.className = "container-fluid";

    var _resumen2 = document.getElementById("resumen");

    _resumen2.className = "my-5 invisible";

    var _boton2 = document.getElementById("botonCambiar");

    _boton2.textContent = " Resumen";

    var _factura = document.getElementById("factura");

    _factura.className = "my-5 invisible";

    var _botonImprimir = document.getElementById("botonImprimirFactura");

    _botonImprimir.className = "btn btn-lg btn-success my-2 invisible";

    var _botonDescuento = document.getElementById("botonCuponDescuento");

    _botonDescuento.className = "btn btn-lg btn-warning my-2 invisible";
  }
});
var boton2 = document.getElementById("botonFacturar"); //manejo de vistas platos y resumen

boton2.addEventListener("click", function () {
  var platos = document.getElementById("contenedorPlatos");
  platos.className = "container-fluid invisible";
  var resumen = document.getElementById("resumen");
  resumen.className = "my-5 invisible";
  var factura = document.getElementById("factura");
  factura.className = "my-5";
  var botonImprimir = document.getElementById("botonImprimirFactura");
  botonImprimir.className = "btn btn-lg btn-success my-2";
  var botonDescuento = document.getElementById("botonCuponDescuento");
  botonDescuento.className = "btn btn-lg btn-warning my-2";
}); //generador de tarjetas de productos

var contendorProductos = document.querySelector("#contenedor-productos");

var mostrarPlatos = function mostrarPlatos(data) {
  //Funcion para cargar datos del JSON en forma de tarjetas en el HTML
  var template = document.querySelector("#template-productos").content;
  var fragment = document.createDocumentFragment();
  data.forEach(function (producto) {
    template.querySelector("img").setAttribute("src", producto.thumbnailUrl);
    template.querySelector("h3").textContent = producto.title;
    template.querySelector(".descripcion").textContent = producto.descripcion;
    template.querySelector(".claves").textContent = producto.claves;
    template.querySelector("p span").textContent = producto.precio;
    template.querySelector("button").dataset.id = producto.id;
    var clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  contendorProductos.appendChild(fragment);
};

var resumen = {};
resumen = JSON.parse(localStorage.getItem("backupMesa"));

var verificarBackupMesa = function verificarBackupMesa() {
  if (localStorage.getItem("backupMesa") !== null) {
    resumen = JSON.parse(localStorage.getItem("backupMesa"));
    return;
  } else {
    resumen = {};
    localStorage.setItem("backupMesa", JSON.stringify(resumen));
    return;
  }
}; //boton agregar producto a la mesa


var detectarBotones = function detectarBotones(data) {
  var botones = document.querySelectorAll(".card button"); //escuchar botones de tarjetas para agregar el plato a la mesa

  botones.forEach(function (btn) {
    btn.addEventListener("click", function () {
      //detecta click en tarjeta
      var producto = data.find(function (item) {
        return item.id === parseInt(btn.dataset.id);
      });
      producto.cantidad = 1;

      if (resumen.hasOwnProperty(producto.id)) {
        producto.cantidad = resumen[producto.id].cantidad + 1;
      }

      resumen[producto.id] = _objectSpread({}, producto);
      Toastify({
        text: "Agregado " + producto.title + " a la mesa.",
        duration: 1500,
        className: "info",
        gravity: "top",
        // `top` or `bottom`
        position: "right",
        // `left`, `center` or `right`
        offset: {
          y: 110 // vertical axis - can be a number or a string indicating unity. eg: '2em'

        },
        style: {
          background: "linear-gradient(to right, #198754, #558a3f)"
        }
      }).showToast();
      mostrarResumen();
      mostrarFactura();
    });
  });
};

var items = document.querySelector("#items");

var mostrarResumen = function mostrarResumen() {
  //muestra resumen de lo cargado en la mesa
  items.innerHTML = "";
  var template = document.querySelector("#template-resumen").content;
  var fragment = document.createDocumentFragment();
  Object.values(resumen).forEach(function (producto) {
    template.querySelector("th").textContent = producto.id;
    template.querySelectorAll("td")[0].textContent = producto.title;
    template.querySelectorAll("td")[1].textContent = producto.cantidad;
    template.querySelector("span").textContent = producto.precio * producto.cantidad; //botones para sumar o restar items

    template.querySelector(".btn-info").dataset.id = producto.id;
    template.querySelector(".btn-danger").dataset.id = producto.id;
    var clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);
  localStorage.setItem("backupMesa", JSON.stringify(resumen));
  pintarFooter();
  accionBotones();
};

var itemsfactura = document.querySelector("#itemsfactura");

var mostrarFactura = function mostrarFactura() {
  //muestra resumen de lo cargado en la mesa
  itemsfactura.innerHTML = "";
  var template2 = document.querySelector("#template-factura").content;
  var fragment2 = document.createDocumentFragment();
  Object.values(resumen).forEach(function (producto) {
    template2.querySelector("th").textContent = producto.id;
    template2.querySelectorAll("td")[0].textContent = producto.title;
    template2.querySelectorAll("td")[1].textContent = producto.cantidad;
    template2.querySelector("span").textContent = producto.precio * producto.cantidad;
    var clone = template2.cloneNode(true);
    fragment2.appendChild(clone);
  });
  var multiplicador = 100000000000000000;
  itemsfactura.appendChild(fragment2);
  var aleatorio = Math.random() * multiplicador;
  JsBarcode("#barcode", aleatorio);
  pintarFooterFactura();
};

var footer = document.querySelector("#footer-resumen");

var pintarFooter = function pintarFooter() {
  footer.innerHTML = "";

  if (Object.keys(resumen).length === 0) {
    footer.innerHTML = "\n        <th scope=\"row\" colspan=\"5\">Se han eliminado los pedidos de la mesa</th>\n        ";
    return;
  }

  var template = document.querySelector("#template-footer").content;
  var fragment = document.createDocumentFragment(); // sumar cantidad y sumar totales

  var nCantidad = Object.values(resumen).reduce(function (acc, _ref) {
    var cantidad = _ref.cantidad;
    return acc + cantidad;
  }, 0);
  var nPrecio = Object.values(resumen).reduce(function (acc, _ref2) {
    var cantidad = _ref2.cantidad,
        precio = _ref2.precio;
    return acc + cantidad * precio;
  }, 0);
  template.querySelectorAll("td")[0].textContent = nCantidad;
  template.querySelector("span").textContent = nPrecio;
  var clone = template.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);
};

var footerFactura = document.querySelector("#footer-resumen-factura");

var pintarFooterFactura = function pintarFooterFactura() {
  footerFactura.innerHTML = "";
  var template2 = document.querySelector("#template-footer-factura").content;
  var fragment2 = document.createDocumentFragment();
  var nCantidad = Object.values(resumen).reduce(function (acc, _ref3) {
    var cantidad = _ref3.cantidad;
    return acc + cantidad;
  }, 0);
  var nPrecio = Object.values(resumen).reduce(function (acc, _ref4) {
    var cantidad = _ref4.cantidad,
        precio = _ref4.precio;
    return acc + cantidad * precio;
  }, 0); //CUPON DE DESCUENTO APLICADO A nPrecio

  template2.querySelectorAll("td")[0].textContent = nCantidad;
  template2.querySelector("span").textContent = nPrecio;
  var clone = template2.cloneNode(true);
  fragment2.appendChild(clone);
  footerFactura.appendChild(fragment2);
};

botonImpresion = document.getElementById("imprimir");
botonImpresion.addEventListener("click", function () {
  var imprimirContenido = document.getElementById("factura").innerHTML;
  document.body.innerHTML = imprimirContenido;
  window.print();
  resumen = {};
  localStorage.setItem("backupMesa", JSON.stringify(resumen));
  window.location.href = "../pages/sistema.html";
});

function accionBotones() {
  var botonesAgregar = document.querySelectorAll("#items .btn-info");
  var botonesEliminar = document.querySelectorAll("#items .btn-danger");
  botonesAgregar.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var producto = resumen[btn.dataset.id];
      producto.cantidad++;
      resumen[btn.dataset.id] = _objectSpread({}, producto);
      localStorage.setItem("backupMesa", JSON.stringify(resumen));
      mostrarResumen();
      mostrarFactura();
    });
  });
  botonesEliminar.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var producto = resumen[btn.dataset.id];
      producto.cantidad--;

      if (producto.cantidad === 0) {
        delete resumen[btn.dataset.id];
      } else {
        resumen[btn.dataset.id] = _objectSpread({}, producto);
      }

      localStorage.setItem("backupMesa", JSON.stringify(resumen));
      mostrarResumen();
      mostrarFactura();
    });
  });
  var botonVaciar = document.getElementById("vaciarMesa");
  botonVaciar.addEventListener("click", function () {
    resumen = {};
    localStorage.setItem("backupMesa", JSON.stringify(resumen));
    window.location.href = "../pages/sistema.html";
  });
} //BUSCADOR DE PRODUCTOS


function filtroProductos(input, selector) {
  document.addEventListener("keydown", function (e) {
    //se eleigió keydown porque funciona mejor con celulares (o al menos eso vi probandolo)
    var entradaMinuscula = e.target.value.toLowerCase(); //manda a minusculas las entradas del input

    if (e.target.matches(input)) {
      document.querySelectorAll(selector).forEach(function (el //recorre cada elemento selector (tarjetas)
      ) {
        return el.textContent.toLowerCase().includes(entradaMinuscula) //manda a minusculas el contenido de las tarjetas y compara con el input
        ? el.classList.remove("filtrar") //visibiliza tarjetas
        : el.classList.add("filtrar");
      } //esconde tarjetas
      );
    }
  });
}

function actualUsuario() {
  var mailUsuarioActual = document.querySelector(".mailmesero");
  mailUsuarioActual.textContent = localStorage.getItem("mailActual");
  var mailfactura = document.querySelector(".mailmesero2");
  mailfactura.textContent = localStorage.getItem("mailActual");

  if (localStorage.getItem("mailActual") === null) {
    alert("Usuario no registrado, por favor, regístrese antes de usar la aplicación.");
    window.location.href = "../index.html";
  }
}

function datosFactura() {
  var date = new Date();
  var fechaTexto = String(date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes());
  var fechaFactura = document.getElementById("fechaEmisionFactura");
  fechaFactura.textContent = fechaTexto;
  verificarFacturacion();
  var facturaUltima = JSON.parse(localStorage.getItem("ultimaFactura"));
  console.log(facturaUltima);
  facturaUltima++;
  console.log(facturaUltima);
  var numeroFactura = document.getElementById("numeroEmisionFactura");
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