  // DECODIFICAR TOKEN SALVO
  const token     = localStorage.getItem("token");
  const user_id   = localStorage.getItem("id");
  const user_name = localStorage.getItem("name");
  console.log(token);
  
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
  
      // CARREGAR LISTA DE USUÁRIOS
      fetch("http://localhost:8080/api/starvingless/user/v1/list", requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // montar lista de usuários
        const usersContainer = document.getElementById("master");
        let usersHTML = '';
        for (let i = 0; i < data.length; i++) {
          usersHTML += `
            <div class="user" title="${data[i].FirstName}" data-user-id="${data[i].Id}">
              <p>${data[i].FirstName}</p>
            </div>
          `;
        }
        usersContainer.innerHTML = usersHTML;

        // CLICAR NO USUÁRIO, SALVAR ID NO LOCAL STORAGE, ABRIR PÁGINA DO PERFIL
        const userElements = document.querySelectorAll('.user'); // Adiciona o event listener para cada elemento de usuário
        userElements.forEach(userElement => {
          userElement.addEventListener('click', () => {
            const userId = userElement.getAttribute('data-user-id');
            const userDetailsUrl = `http://localhost:8080/api/starvingless/user/v1/id/${userId}`;

            fetch(userDetailsUrl, requestOptions)
              .then(response => response.json())
              .then(userData => {
                // Abre a aba de perfil
                const userTab = window.open('/views/perfil.html', '_self');

                // salva o id do usuário clicado
                localStorage.setItem("perfil", userDetailsUrl);
              })
              .catch(error => console.error(error));
          });
        });
      });

      // CARREGAR POSTS CRIADOS
      const listSize = 1000; // carrega 1000 posts
      fetch(`http://localhost:8080/api/starvingless/post/v1/pt/list?size=${listSize}`, requestOptions)
      .then(response => response.json())
      .then(post => {
        console.log(post);
        post.sort((a, b) => b.id - a.id); // Ordena as mensagens pelo ID em ordem decrescente
        const postContainer = document.getElementById("messages");
        let postHTML = '';
        for (let i = 0; i < post.length; i++) {
          const j = post.length - 1 - i; // Obtém o índice do elemento na ordem decrescente
          postHTML += `
            <li class="message appeared" data-user-post="${post[i].id}">
              <div>
                <div class="avatar"></div>
                <div class="name-chat">${post[i].firstName}</div>
                <div class="data-chat">${post[i].createDate}</div>
              </div>
              <div class="text_wrapper">
                <div class="text"><span class="titlepost">${post[i].title}</span> <br><span>${post[i].description}</span></div>
              </div>
            </li>
          `;
        }
        postContainer.innerHTML = postHTML;

    
  

        // CLICAR NO POST, SALVAR ID NO LOCAL STORAGE, ABRIR PÁGINA DO POST
        const userElements = document.querySelectorAll('.message'); // Adiciona o event listener para cada elemento de post
        userElements.forEach(userElement => {
          userElement.addEventListener('click', () => {
            const postId = userElement.getAttribute('data-user-post');
            const postDetailsUrl = `http://localhost:8080/api/starvingless/post/v1/pt/id/${postId}`;

            fetch(postDetailsUrl, requestOptions)
              .then(response => response.json())
              .then(userData => {
                // Abre a aba de perfil
                const userTab = window.open('/views/post.html', '_self');

                // salva o id do usuário clicado
                localStorage.setItem("post", postDetailsUrl);
              })
              .catch(error => console.error(error));
          });
        });
             

        // CRIAR NOVO POST
        $('.send_message').on('click', function() {
          // Pega valores do login e seta nas variáveis
          var title = document.getElementById("message_title").value;
          var description = document.getElementById("message_input").value;

          if ((""+title).length < 10 || (""+title).length > 50 || ""+description=="") {
            alert("Preencha todos os campos");
            return false;
          }

          var imageUrl = localStorage.getItem("imagepost");
          var date = new Date();
          var optionsdate = {
            year: "numeric",
            month: "numeric",
            day: "numeric"
          };

          var createDate = date.toLocaleDateString("pt", optionsdate);
          var threadOpen = true;

          // Cria um objeto com as informações de login
          const envioPost = {
            title: title,
            description: description,
            createDate: createDate,
            threadOpen: threadOpen,
            userId: user_id
          };

          // Envia a requisição POST com o corpo da mensagem
          const postEnvioUrl = `http://localhost:8080/api/starvingless/post/v1/pt/create`;
          fetch(postEnvioUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(envioPost)
          }) 
          .then(response => {
            if (response.ok) { 
              console.log("Postagem criada");
              localStorage.removeItem("imagepost");
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else {
              response.json().then(data => {
                
          
                const errors = data.errors;
                if (errors && errors.length > 0) {
                  let errorsMessage = "Erros:\n";
                  errors.forEach((error, index) => {
                    errorsMessage += `\n${index + 1}. ${error.message}`;
                  });
                  alert(errorsMessage);
                }
              }).catch(error => {
                console.log("Erro ao processar a resposta JSON:", error);
              });
            }
          })
          .catch(error => {
            console.log("Erro na requisição:", error);
          });
        });
      })
      .catch(error => console.error(error));
    } catch (err) {
      console.log("Erro ao decodificar o token", err);
    }
    

  } else {
    window.location.href = '/index.html';
  }

  