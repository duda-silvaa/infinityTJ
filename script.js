document.addEventListener("DOMContentLoaded", function () {
  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
          event.preventDefault();

          const email = document.getElementById("email").value;
          const senha = document.getElementById("senha").value;

          console.log('Tentando login com:', { email, senha });

          fetch('http://127.0.0.1:3000/login', {
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

          fetch('http://127.0.0.1:3000/register', {
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
              alert(data.message); // Mostra a mensagem de sucesso ou erro
          })
          .catch(error => {
              console.error("Erro durante o cadastro:", error);
              alert("Ocorreu um erro. Por favor, tente novamente.");
          });
      });
  }
});



//solicitacao 
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
          fetch('http://127.0.0.1:3000/solicitacao-orcamento', {
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


//suporte
const suporteForm = document.getElementById("suporteForm");
if (suporteForm) {
    suporteForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nomeSup = document.getElementById("nomeSup").value;
        const emailSup = document.getElementById("emailSup").value;
        const messageSup = document.getElementById("messageSup").value;

        console.log('Tentando enviar para o suporte com:', { nomeSup, emailSup, messageSup });

        fetch('http://127.0.0.1:3000/suporte', {
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
                suporteForm.reset(); // Limpa o formulário
            } else {
                alert("Ocorreu um problema: " + data.message); // Mostra a mensagem de erro
            }
        })
        .catch(error => {
            console.error("Erro ao enviar a mensagem para o suporte:", error);
            alert("Ocorreu um erro. Por favor, tente novamente.");
        });
    });
}



