email = document.getElementById("email").value;
password = document.getElementById("password").value;
var err ;

function validateForm() {
    if(email.value == ""){
        document.getElementById('validaemail').innerHTML = "Digite um e-mail";
        err = 0;
    } else if(email.length <3){
        document.getElementById('validaemail').innerHTML = "Email não cadastrado";
        err = 0;
    } else{
        document.getElementById('validaemail').innerHTML = "";
        err = 1;
    }

    if(password.value == ""){
        document.getElementById('validapass').innerHTML = "Digite uma senha";
        err = 0;
    } else if(password.length == 0){
        document.getElementById('validapass').innerHTML = "Senha incorreta";
        err = 0;
    } else{
        document.getElementById('validapass').innerHTML = "";
        err = 1;
    }
}

const form = document.getElementById('loginform')
form.addEventListener('submit', e => {
    e.preventDefault();
});

function Teste() { 
    const url = "http://localhost:8080/login";

    // Pega valores do login e seta nas variáveis
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;

    // Cria um objeto com as informações de login
    const loginData = {
        email: email,
        password: password
    };
    
    // Envia a requisição POST com o corpo da mensagem
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        // Trata a resposta da API
        if (response.ok) {
            // Se a resposta for bem sucedida, verifica se o token de acesso é retornado
            response.json().then(data => {
                if (data.token) {
                    // Se o token de acesso for retornado, armazena-o em algum lugar para uso posterior
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("id"   , data.Id);
                    localStorage.setItem("name" , data.FirstName + ' ' + data.LastName);
                    console.log("Login bem sucedido");
                    console.log(response);
                    window.location.href = "/views/home.html";
                } else {
                    console.log("Erro ao fazer login");
                }
            });
        } else {
            console.log("Erro ao fazer login");
        }
    })
    .catch(error => {
        console.log(error);
    });
}

var submitButton = document.getElementById("submit");
$(submitButton).on('click', function() {
    Teste();
});

