document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  console.log('Tentando login com:', { email, senha });

  fetch('http://127.0.0.1:3000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
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
