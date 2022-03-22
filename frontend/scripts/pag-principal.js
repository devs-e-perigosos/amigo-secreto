const botaoCadastro = document.querySelector(".btn-cadastro");
const img = document.querySelector(".img-principal");
const participantes = document.querySelector(".participantes");
const obs = document.querySelector(".obs");
const botaoSorteio = document.querySelector("#btn-sorteio");
const botoes = document.querySelector(".btns");
let dados;
async function obterAmigos() {
  const response = await fetch("http://localhost:3000/amigos/all");
  const loader = document.querySelector(".lds-ring");
  loader.style.display = "none";
  if (response.status === 204) {
    img.style.display = "block";
    botaoCadastro.style.display = "flex";
  } else if (response.status === 200) {
    dados = await response.json();
    obs.style.display = "flex";
    dados.forEach(({ nome, email, id }) => {
      criarCard(nome, email, id);
    });
    botoes.style.display = "flex";
    botaoCadastro.style.display = "none";
    if (dados.length < 3) {
      botaoSorteio.style.display = "none";
    } else {
      botaoSorteio.style.display = "inline-block";
    }
  }
  //if (dados.length < 3) {
  //  const id = "judfj";
  //}
}

function criarCard(nome, email, id) {
  const card = document.createElement("div");
  const buttons = document.createElement("span");
  const data = document.createElement("span");
  const nomePessoa = document.createElement("p");
  const emailPessoa = document.createElement("p");

  const img1 = document.createElement("img");
  img1.src = "../img/editButton.svg";

  const img2 = document.createElement("img");
  img2.src = "../img/deleteButton.svg";

  card.setAttribute("class", "card");
  buttons.setAttribute("class", "buttons");

  data.setAttribute("class", "data");

  nomePessoa.setAttribute("class", "nome");
  nomePessoa.innerText = `${nome}`;

  emailPessoa.setAttribute("class", "email");
  emailPessoa.innerText = `${email}`;

  data.appendChild(nomePessoa);
  data.appendChild(emailPessoa);

  buttons.appendChild(img1);
  buttons.appendChild(img2);

  img1.addEventListener("click", (_) => {
    document.location.href = `../pages/tela-edicao-cadastro.html?id=${id}`;
  });

  img2.addEventListener("click", (_) => confirmarDelete(nome, id));

  card.appendChild(buttons);
  card.appendChild(data);

  participantes.appendChild(card);
}
/**/
function confirmarDelete(nome, id) {
  const main = document.querySelector("main");
  const body = document.querySelector("body");
  main.style.display = "none";

  const frases = document.createElement("div");
  const mensagemExclusao = document.createElement("p");
  const mensagemExclusaoPessoa = document.createElement("p");

  const buttons = document.createElement("div");
  const buttonSim = document.createElement("button");
  const buttonCancelar = document.createElement("button");

  buttonSim.addEventListener("click", async (_) => {
    const config = {
      method: "DELETE",
    };

    await fetch(`http://localhost:3000/amigos/${id}`, config);

    dados = dados.filter((dado) => {
      return dado.id != id;
    });
    participantes.innerHTML = "";

    if (dados.length === 0) {
      obs.style.display = "none";
      participantes.style.display = "none";
      img.style.display = "block";
      botaoCadastro.style.display = "flex";
    } else {
      dados.forEach(({ nome, email, id }) => {
        criarCard(nome, email, id);
      });
      botoes.style.display = "flex";
      botaoCadastro.style.display = "none";
      if (dados.length < 3) {
        botaoSorteio.style.display = "none";
      } else {
        botaoSorteio.style.display = "inline-block";
      }
    }

    frases.style.display = "none";
    buttons.style.display = "none";
    main.style.display = "flex";
  });

  buttonCancelar.addEventListener("click", (_) => {
    frases.style.display = "none";
    buttons.style.display = "none";
    main.style.display = "flex";
  });

  buttonSim.innerText = "Sim";
  buttonCancelar.innerText = "Não";

  mensagemExclusao.innerText = "Deseja realmente excluir";
  mensagemExclusaoPessoa.innerText = `${nome} ?`;

  frases.appendChild(mensagemExclusao);
  frases.appendChild(mensagemExclusaoPessoa);

  buttons.appendChild(buttonSim);
  buttons.appendChild(buttonCancelar);

  body.appendChild(frases);
  body.appendChild(buttons);
}

obterAmigos();
