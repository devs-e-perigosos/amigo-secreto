const botao = document.querySelector(".btn-input");
const botaoOk = document.querySelector(".botao-ok");

const nome = document.getElementById("nome");
const email = document.getElementById("email");

async function adicionar(nome, email) {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: nome.value,
      email: email.value,
    }),
  };

  const response = await fetch("http://localhost:3000/amigos", config);
  if (response.status === 400) {
    const dados = await response.json();

    let erro = document.querySelector(".erro");
    erro.innerText = dados.error;
  } else {
    let formulario = document.getElementById("formulario");
    formulario.style.display = "none";

    let sucesso = document.getElementById("sucesso");
    sucesso.style.display = "flex";
  }
}

botao.addEventListener("click", (_) => {
  adicionar(nome, email);
});

function voltaToIndex() {
  document.location.href = "../pages/index.html";
}

botaoOk.addEventListener("click", (_) => {
  voltaToIndex();
});
