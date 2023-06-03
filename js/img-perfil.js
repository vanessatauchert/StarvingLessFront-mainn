function abrirImagem() {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = function (event) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = document.createElement("img");
      img.src = reader.result;
      var avatarPerfil = document.querySelector(".avatar-perfil");
      avatarPerfil.innerHTML = "";
      avatarPerfil.appendChild(img);
    };
    reader.readAsDataURL(event.target.files[0]);
    enviarImagem();
  };
  input.click();
}

function enviarImagem(imagemBase64) {
  if (token) {
    try {
      const decodedToken = jwt.jwtDecode(token);
      console.log(decodedToken);
  
      // pegar informações com o token salvo
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const requestOptions = {
      method: 'GET',
      headers: headers
    };
    const formData = new FormData();
    formData.append("imagem", imagemBase64);
    fetch('/upload-imagem', {
      method: 'POST',
      headers: headers,
      body: formData
    })
    .then(response => {
      if (response.ok) {
        console.log("Imagem enviada com sucesso!");
      }
    })
    .catch(error => {
      console.log(error);
    });
  } catch (err) {
    console.log("Erro ao decodificar o token", err);
  }
} else {
console.log("Token não encontrado na storage");
}
};