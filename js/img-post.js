function abrirImagem() {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = function (event) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = document.createElement("img");
      img.src = reader.result;
      var avatarPerfil = document.querySelector(".image-post");
      avatarPerfil.innerHTML = "";
      avatarPerfil.appendChild(img);
      var imageUrl = reader.result; // passa a URL base64 como parâmetro
          localStorage.setItem("imagepost", imageUrl);
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  input.click();
}
