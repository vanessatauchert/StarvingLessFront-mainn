function Teste() { 
    const url = "http://localhost:8080/api/starvingless/user/v1/list";

    // Pega valores do login e seta nas variáveis
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;

    // Cria um objeto com as informações de login
    const infoUser = {
        email: email,
        password: password
    };
    
    // Envia a requisição POST com o corpo da mensagem
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(infoUser)
    })
    .then(response => {
        // Trata a resposta da API
        if (response.ok) {
            // Se a resposta for bem sucedida, verifica se o token de acesso é retornado
            response.json().then(data => {
                if (data.token) {
                    // Se o token de acesso for retornado, armazena-o em algum lugar para uso posterior
                    localStorage.setItem("token", data.token);
                    console.log("Login bem sucedido");
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