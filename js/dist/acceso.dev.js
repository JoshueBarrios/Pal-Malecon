"use strict";

//ACCESO REGISTRO - cargar datos de localstorage
function validarFormulario() {
  var data = localStorage.getItem("datosGuardados") ? JSON.parse(localStorage.getItem("datosGuardados")) : [];
  var formData = {
    name: document.getElementById("uName").value,
    email: document.getElementById("uEmail").value,
    password: document.getElementById("uPassword").value,
    confirmpassword: document.getElementById("confirmPassword").value
  };
  data.push(formData);

  if (localStorage) {
    localStorage.setItem("datosGuardados", JSON.stringify(data));
  }
} //ACCESO REGISTRO - verificar coincidencia de password


function verificarPassword(input) {
  if (input.value != document.getElementById("uPassword").value) {
    input.setCustomValidity("El password no coincide");
  } else {
    input.setCustomValidity("");
  }
} //ACCESO REGISTRO - verificar usuario ya registrado


function verificarEmail(value) {
  var existemail = JSON.parse(localStorage.getItem("datosGuardados"));
  var emailid = existemail.map(function (email, i, existemail) {
    return existemail[i].email;
  });
  var getexistemail = emailid.filter(function (email) {
    if (email == value.value) {
      value.setCustomValidity("el usuario ya se encuentra registrado");
    } else {
      value.setCustomValidity("");
    }
  });
} //ACCESO REGISTRO - manejo de vistas acceso registro


var form = document.getElementById("formularioRegistro");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  form.reset();
  document.getElementById("usuarioRegistrado").style.display = "block";
  form.style.display = "none";
});

function mostrarOcultar(mostrar, ocultar) {
  var mostrarElemento = document.getElementById(mostrar);
  var ocultarElemento = document.getElementById(ocultar);
  mostrarElemento.style.display = "block";
  ocultarElemento.style.display = "none";
} //ACCESO REGISTRO - login y acceso


function loginUser() {
  localStorage.removeItem("mailActual"); //limpiar datos usuario anterior de localstorage

  var loginEmail = document.getElementById("uemailId").value;
  var loginPass = document.getElementById("ePassword").value;
  var matchEmail = JSON.parse(localStorage.getItem("datosGuardados"));
  var emailArray = [];
  var passArray = [];
  var result = matchEmail.map(function (email, i, matchEmail) {
    emailArray.push(matchEmail[i].email);
    passArray.push(matchEmail[i].password);
  });

  if (emailArray.indexOf(loginEmail) > -1 && passArray.indexOf(loginPass) > -1) {
    localStorage.setItem("mailActual", loginEmail); //en caso de validar, cargar datos de ID de usuario actual (mail) en localstorage

    window.location.href = "./pages/sistema.html";
  } else {
    alert("Los datos de usuario son incorrectos, por favor verifique los datos o regístrese");
    mostrarOcultar("formularioRegistro", "logIn"); //cambia vista a formulario de registro
  }
}

var loginForm = document.getElementById("logIn");
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
});