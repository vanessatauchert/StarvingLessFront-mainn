  // decodificar token salvo
  const token = localStorage.getItem("token");
  const user_id   = localStorage.getItem("id");
  const user_name = localStorage.getItem("name");
  
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
      
      // CARREGAR COMENTÁRIO CLICADO
      const comment = localStorage.getItem("comment");
      // trazer resposta da api por array
      fetch(comment, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // montar lista de comentários
        const usersContainer = document.getElementById("comments");
        let usersHTML = '';
        usersHTML += `
            <div id="deletarcomment" class="deletarpost invisivel" title="EXCLUIR POST"><i class="bi bi-trash3"></i></div>
            <li class="postselecionado message appeared" id="postselecionado" data-id-comment="${data.id}" data-post-id="${data.postId}">
                <div>
                    <div class="avatar"></div>
                    <div class="name-chat">${data.firstName}</div>
                    <div class="data-chat">${data.createDate}</div>
                </div>
                <div class="text_wrapper">
                    <div class="text">${data.description}</div>
                </div>
            </li>
        `;
        usersContainer.innerHTML = usersHTML;

        // Exibir ícone de excluir post apenas para usuário com id = 1 ou criador do comentário
        if (user_id == 1){
          $("#deletarcomment").addClass("visivel").removeClass("invisivel");
          $("#editarcomentario").addClass("visivel").removeClass("invisivel");
        }

        // DELETAR COMENTÁRIO
        var excluirPost = document.getElementById("deletarcomment");
        var textExcluir = "Deseja excluir o post";
        $(excluirPost).on('click', function() {
          textExcluir;
          if (confirm(textExcluir) == true) {
              console.log('Você clicou em OK!');
              const postId = document.getElementById("postselecionado").getAttribute('data-id-comment');
              const postDeleteUrl = `http://localhost:8080/api/starvingless/comment/v1/cm/delete/${postId}`;
              fetch(postDeleteUrl, {
                method: "DELETE",
                headers: headers,
              })
              .then(response => { 
              if (response.ok) { 
                console.log('Você deletou o post!');
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

        // ATUALIZAR COMENTÁRIO
        $('.send_message').on('click', function() {
          // Pega valores do login e seta nas variáveis
          var id = document.getElementById("postselecionado").getAttribute('data-id-comment');
          var postId = document.getElementById("postselecionado").getAttribute('data-post-id');
          var description = document.getElementById("message_input").value;

          if (""+description=="") {
            alert("Preencha todos os campos");
            return false;
          }
          var date = new Date();
          var optionsdate = {
            year: "numeric",
            month: "numeric",
            day: "numeric"
          };
          var imageUrl = "";
          var createDate = date.toLocaleDateString("pt", optionsdate);
          var threadOpen = true;

          // Cria um objeto com as informações
          const envioPost = {
            description: description,
            createDate: createDate,
            postId: postId,
            userId: user_id
          };

          // Envia a requisição POST com o corpo do comentário editado
          var envioId = document.getElementById("postselecionado").getAttribute('data-id-comment');
          const postUpdateUrl = `http://localhost:8080/api/starvingless/comment/v1/cm/update/${envioId}`;
          fetch(postUpdateUrl, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(envioPost)
          }) 
          .then(response => {
            if (response.ok) { 
              console.log("Comentário editado");
              setTimeout(() => {
                location.reload();
              }, "1000");
            }
          })
          .catch(error => {
            console.log(error);
          });
        });
      });
    } catch (err) {
        console.log("Erro ao decodificar o token", err);
      }
  } else {
    window.location.href = '/index.html';
  }