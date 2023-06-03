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
      
      // CARREGAR POST CLICADO
      const post = localStorage.getItem("post");
      // trazer resposta da api por array
      fetch(post, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // montar lista de POSTS
        const usersContainer = document.getElementById("post");
        let usersHTML = '';
        usersHTML += `
            <div id="deletarpost" class="deletarpost invisivel" title="EXCLUIR POST"><i class="bi bi-trash3"></i></div>
            <li class="postselecionado message appeared" id="postselecionado" data-post-id="" data-user-post="${data.id}">
                <div>
                    <div class="avatar"></div>
                    <div class="name-chat">${data.firstName}</div>
                    <div class="data-chat">${data.createDate}</div>
                </div>
                <div class="text_wrapper">
                    <div class="text">${data.title} <br> ${data.description}</div>
                </div>
            </li>
        `;
        usersContainer.innerHTML = usersHTML;

        // Exibir ícone de EXCLUIR / EDITAR post apenas para usuário com id = 1 
        if (user_id == 1){
          $("#editarpost").addClass("visivel").removeClass("invisivel");
          $("#deletarpost").addClass("visivel").removeClass("invisivel");
        }

        // DELETAR POST
        var excluirPost = document.getElementById("deletarpost");
        var textExcluir = "Deseja excluir o post";
        $(excluirPost).on('click', function() {
          textExcluir;
          if (confirm(textExcluir) == true) {
              console.log('Você clicou em OK!');
              const postId = document.getElementById("postselecionado").getAttribute('data-user-post');
              const postDeleteUrl = `http://localhost:8080/api/starvingless/post/v1/pt/delete/${postId}`;
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

        // ATUALIZAR POST
        $('#send_message').on('click', function() {
          // Pega valores do login e seta nas variáveis
          var id = document.getElementById("postselecionado").getAttribute('data-user-post');
          var title = document.getElementById("message_title").value;
          var description = document.getElementById("message_input").value;

          if ((""+title).length < 10 || (""+title).length > 50 || ""+description=="") {
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
            id: id,
            title: title,
            description: description,
            imageUrl: imageUrl,
            createDate: createDate,
            threadOpen: threadOpen,
            numberOfComments: null,
            userId: user_id
          };

          // Envia a requisição POST com o corpo da mensagem editada
          const postId = document.getElementById("postselecionado").getAttribute('data-user-post');
          const postUpdateUrl = `http://localhost:8080/api/starvingless/post/v1/pt/update/${postId}`;
          fetch(postUpdateUrl, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(envioPost)
          }) 
          .then(response => {
            if (response.ok) { 
              console.log("Postagem editada");
              setTimeout(() => {
                location.reload();
              }, "1000");
            }
          })
          .catch(error => {
            console.log(error);
          });
        });

        // CARREGAR COMENTÁRIOS CRIADOS
        const listSize = 1000; // carrega 1000 posts
        const commentId = document.getElementById("postselecionado").getAttribute('data-user-post');
        fetch(`http://localhost:8080/api/starvingless/comment/v1/cm/post/${commentId}?size=${listSize}`, requestOptions)
        .then(response => response.json())
        .then(comments => {
          console.log(comments);
          comments.sort((a, b) => b.id - a.id); // Ordena as mensagens pelo ID em ordem decrescente
          const commentsContainer = document.getElementById("comments");
          let commentsHTML = '';
          for (let i = 0; i < comments.length; i++) {
            const j = post.length - 1 - i; // Obtém o índice do elemento na ordem decrescente
            commentsHTML += `
              <li class="comment appeared" data-id-comments="${comments[i].id}" data-post-id="${comments[i].postId}" data-user-id="${comments[i].userId}">
                <div>
                  <div class="avatar"></div>
                  <div class="name-chat">${comments[i].firstName}</div>
                  <div class="data-chat">${comments[i].createDate}</div>
                </div>
                <div class="text_wrapper">
                  <div class="text">${comments[i].description}</div>
                </div>
              </li>
            `;
          }

           

          commentsContainer.innerHTML = commentsHTML;

          // CLICAR NO COMENTÁRIO, SALVAR ID NO LOCAL STORAGE, ABRIR PÁGINA DO COMENTÁRIO
          const userElements = document.querySelectorAll('.comment'); // Adiciona o event listener para cada elemento de post
          userElements.forEach(userElement => {
            userElement.addEventListener('click', () => {
              const postId = userElement.getAttribute('data-id-comments');
              const postDetailsUrl = `http://localhost:8080/api/starvingless/comment/v1/cm/id/${postId}`;
        
              fetch(postDetailsUrl, requestOptions)
                .then(response => response.json())
                .then(userData => {
                  // Abre a aba de perfil
                  const userTab = window.open('/views/comments.html', '_self');
        
                  // salva o id do usuário clicado
                  localStorage.setItem("comment", postDetailsUrl);
                })
                .catch(error => console.error(error));
            });
          });
        });

        // CRIAR NOVO COMENTARIO
        $('#send_comment').on('click', function() {
          // Pega valores do login e seta nas variáveis
          var description = document.getElementById("comment_input").value;
          var postId = document.getElementById("postselecionado").getAttribute('data-user-post');

          if ((""+description).length < 10 || (""+description).length > 50) {
            alert("Preencha o campo");
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

          // Cria um objeto com as informações de login
          const envioPost = {
            description: description,
            createDate: createDate,
            postId: postId,
            userId: user_id
          };

          // Envia a requisição POST com o corpo do comentário
          const postEnvioUrl = `http://localhost:8080/api/starvingless/comment/v1/cm/create`;
          fetch(postEnvioUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(envioPost)
          }) 
          .then(response => {
            if (response.ok) { 
              console.log("Comentário criado");
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