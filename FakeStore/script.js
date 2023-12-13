
var usernames = [];
var passwords = [];
var emails = [];
var username = document.getElementById('username').value;
var email = document.getElementById('email').value;
var password = document.getElementById('password').value;
var usernameLogin = document.getElementById('username_login').value;
var passwordLogin = document.getElementById('password_login').value;


function registerUser(){
    event.preventDefault();
    
    usernames.push(username);
    passwords.push(password);
    emails.push(email);

    mostrarAlerta("User registered successfully")

    window.open("indexAdmin.html")
}

function validateUser() { 
  let usernameLogin = document.getElementById('username_login').value;
  let passwordLogin = document.getElementById('password_login').value;
  event.preventDefault();
  if (usernameLogin == "admin") {
    if (passwordLogin == "admin12345" ) {
      window.open("indexAdmin.html")
    }
    else {
      mostrarAlerta("Incorrect password")
    }
  } else {
    mostrarAlerta("User doesn't exist")
  }

}

function mostrarAlerta(mensaje) {
    var alerta = document.createElement('div');
    alerta.classList.add('mi-alerta');
    alerta.textContent = mensaje;
  
    document.body.appendChild(alerta);
  
    setTimeout(function() {
      alerta.remove();
    }, 3000);
  }