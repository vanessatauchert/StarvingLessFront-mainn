  const user_id   = localStorage.getItem("id");  
  // decodificar token salvo
  const token = localStorage.getItem("token");
  console.log(token);
  
  if (token) {
    try {
      const decodedToken = jwt.jwtDecode(token);
      console.log(decodedToken);
  
      // pegar informações com o token salvo
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      // trazer resposta da api por array
      const perfil = localStorage.getItem("perfil");
      // trazer resposta da api por array
      fetch(perfil, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // montar lista de usuários
        const usersContainer = document.getElementById("perfil");
        let usersHTML = '';
          usersHTML += `
            <div class="user master" data-user-id="${data.Id}">
              <div class="avatar-perfil" onclick="abrirImagem()">
              </div>
              <h5>${data.FirstName} ${data.LastName}</h5>
              <p>Endereço: <span>${data.Address}</span><p>
              <p>E-mail: <span>${data.email}</span><p>
              <p>Telefone: <span>${data.Phone}</span><p>
              <p>Data de criação: <span>${data.SignUpDate}</span><p>
            </div>
          `;
        usersContainer.innerHTML = usersHTML;

        // Exibir ícone de excluir post apenas para usuário com id = 1
        if (user_id == 1 || user_id == data.Id){
          $("#editarperfil").addClass("visivel").removeClass("invisivel");
        }

        if (user_id == 1){
          $("#deletaruser").addClass("visivel").removeClass("invisivel");
        }

        // ATUALIZAR USUÁRIO
        $('#send_message').on('click', function() {
          // Pega valores do login e seta nas variáveis
          var FirstName = document.getElementById("firstname").value;
          var LastName = document.getElementById("lastname").value;
          var CPF = document.getElementById("cpf").value;
          var Address = document.getElementById("address").value;
          var Password = document.getElementById("password").value;
          var email = document.getElementById("email").value;
          var Phone = document.getElementById("phone").value;
          var date = new Date();
          var optionsdate = {
            year: "numeric",
            month: "numeric",
            day: "numeric"
          };
          var createDate = date.toLocaleDateString("pt", optionsdate);

          // Cria um objeto com as informações de login
          const envioPost = {
            FirstName: FirstName,
            LastName: LastName,
            CPF: CPF,
            Address: Address,
            Password: Password,
            email: email,
            Phone: Phone,
            SignUpDate: createDate
          };

          // Envia a requisição POST com o corpo da mensagem editada
          const postUpdateUrl = `http://localhost:8080/api/starvingless/user/v1/update/${data.Id}`;
          fetch(postUpdateUrl, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(envioPost)
          }) 
          .then(response => {
            if (response.ok) { 
              console.log("Usuário editado");
              setTimeout(() => {
                location.reload();
              }, "1000");
            }
          })
          .catch(error => {
            console.log(error);
          });
        });

        // DELETAR USUÁRIO
        var excluirUser = document.getElementById("deletaruser");
        var textExcluir = "Deseja excluir o usuário";
        $(excluirUser).on('click', function() {
          textExcluir;
          if (confirm(textExcluir) == true) {
              console.log('Você clicou em OK!');
              const postDeleteUrl = `http://localhost:8080/api/starvingless/user/v1/delete/${data.Id}`;
              fetch(postDeleteUrl, {
                method: "DELETE",
                headers: headers,
              })
              .then(response => { 
              if (response.ok) { 
                console.log('Você deletou o usuário!');
                setTimeout(() => {
                  window.open('/views/home.html', '_self');
                }, "1000");
              }
            })
            .catch(error => {
              console.log(error);
            });
          } else {
              console.log('Você clicou em Cancelar!');
          }
        });
      });
    } catch (err) {
        console.log("Erro ao decodificar o token", err);
      }
  } else {
    window.location.href = '/index.html';
  }