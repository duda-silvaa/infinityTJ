//pesquisar
function searchFunction() {
    // Pega o valor do campo de pesquisa
    var input = document.getElementById('search-input').value.trim().toUpperCase();
  
    // Pega todos os itens de serviço (ajustando os seletores para cobrir todas as seções)
    var serviceItems = document.querySelectorAll('.col-md-3, .col-md-4, .card');
  
    var servicesVisible = false;
  
    // Itera sobre os itens e verifica se o texto de pesquisa está presente no título ou descrição
    serviceItems.forEach(function(item) {
      // Obtém o título e a descrição do serviço
      var title = item.querySelector('.card-title') ? item.querySelector('.card-title').textContent.trim().toUpperCase() : '';
      var description = item.querySelector('.card-text') ? item.querySelector('.card-text').textContent.trim().toUpperCase() : '';
      var h5Title = item.querySelector('h5') ? item.querySelector('h5').textContent.trim().toUpperCase() : '';  // Verificar h5 para serviços na primeira seção
      var pDescription = item.querySelector('p') ? item.querySelector('p').textContent.trim().toUpperCase() : '';  // Verificar p para serviços na primeira seção
      
      // Verifica se o termo de pesquisa aparece no título ou descrição
      if (title.indexOf(input) > -1 || description.indexOf(input) > -1 || h5Title.indexOf(input) > -1 || pDescription.indexOf(input) > -1) {
        item.style.display = ''; // Exibe o item de serviço
        servicesVisible = true;
      } else {
        item.style.display = 'none'; // Oculta o item de serviço
      }
    });
  
    // Se nenhum serviço corresponder, mostre uma mensagem ou deixe a página intacta
    if (!servicesVisible) {
      console.log("Nenhum serviço encontrado.");
    }
  }


  document.addEventListener("DOMContentLoaded", function () {
    const typedTitle = document.getElementById("typed-title");
    const serviceIcon = document.getElementById("service-icon");

    const text = "Contrate o serviço"; // O texto do título
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typedTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100); // Ajuste a velocidade de digitação aqui
        } else {
            typedTitle.classList.add("completed"); // Indica que a animação terminou
        }
    }

    typeWriter();
});

  
  
document.addEventListener("DOMContentLoaded", function () {
  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
          event.preventDefault();

          const email = document.getElementById("email").value;
          const senha = document.getElementById("senha").value;

          console.log('Tentando login com:', { email, senha });

          fetch('http://infinity-tj.vercel.app:3000/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({ email, senha })
          })
          .then(response => response.json())
          .then(data => {
              console.log('Resposta recebida:', data);
              if (data.success) {
                  window.location.href = "http://127.0.0.1:5501/pag2.html";
              } else {
                  alert(data.message);
              }
          })
          .catch(error => {
              console.error("Erro durante o login:", error);
              alert("Ocorreu um erro. Por favor, tente novamente.");
          });
      });
  }

  // cadastro - ok
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
      registerForm.addEventListener("submit", function (event) {
          event.preventDefault();

          const regNome = document.getElementById("regNome").value;
          const regEmail = document.getElementById("regEmail").value;
          const regSenha = document.getElementById("regSenha").value;

          console.log('Tentando registrar com:', { regNome, regEmail, regSenha });

          fetch('http://infinity-tj.vercel.app:3000/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify({ regNome, regEmail, regSenha })
          })
          .then(response => response.json())
          .then(data => {
              console.log('Resposta recebida:', data);

             // Abre o modal de confirmação
             const confirmation = new bootstrap.Modal(document.getElementById('confirmation'));
             confirmation.show();

              // Limpa o formulário quando o modal é fechado
              document.getElementById('confirmation').addEventListener('hidden.bs.modal', () => {
            registerForm.reset();
            });
          })
          .catch(error => {
              console.error("Erro durante o cadastro:", error);
              alert("Ocorreu um erro. Por favor, tente novamente.");
          });
      });
  }
});



//solicitacao -ok

  // Função para capturar o nome do serviço da URL e inserir no campo
  document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const servico = urlParams.get('servico');
    if (servico) {
        document.getElementById('servico').value = decodeURIComponent(servico);
    }
});

//solicitacao orçamento - ok
document.addEventListener("DOMContentLoaded", function () {
  const formSolicitacao = document.getElementById("formSolicitacao");

  if (formSolicitacao) {
      formSolicitacao.addEventListener("submit", function (event) {
          event.preventDefault(); // Evita o comportamento padrão do formulário

          // Pega os valores dos campos do formulário
          const servico = document.getElementById("servico").value;
          const descricao = document.getElementById("descricao").value;
          const telefone = document.getElementById("telefone").value;

          console.log('Tentando enviar solicitação com:', { servico, descricao, telefone });

          // Envia a requisição para o backend via fetch
          fetch('http://infinity-tj.vercel.app:3000/solicitacao-orcamento', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },

              credentials: 'include', // Inclui os cookies de sessão na requisição
              body: JSON.stringify({ servico, descricao, telefone })
          })
          .then(response => response.json())
          .then(data => {
              console.log('Resposta recebida:', data);

                // Abre o modal de confirmação
                const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
                confirmationModal.show();

                // Limpa o formulário quando o modal é fechado
                document.getElementById('confirmationModal').addEventListener('hidden.bs.modal', () => {
                    formSolicitacao.reset();
                });

          })
          .catch(error => {
              console.error("Erro durante o envio da solicitação:", error);
              alert("Ocorreu um erro. Por favor, tente novamente.");
          });
      });
  }
});


//suporte - ok 
const suporteForm = document.getElementById("suporteForm");
if (suporteForm) {
    suporteForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nomeSup = document.getElementById("nomeSup").value;
        const emailSup = document.getElementById("emailSup").value;
        const messageSup = document.getElementById("messageSup").value;

        console.log('Tentando enviar para o suporte com:', { nomeSup, emailSup, messageSup });

        fetch('http://infinity-tj.vercel.app:3000/suporte', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ nomeSup, emailSup, messageSup })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                suporteForm.reset(); 
            } 
        })
        .catch(error => {
            alert("Ocorreu um erro. Por favor, tente novamente.");
        });
    });
}



