const botaoCadastro = document.querySelector(".btn-cadastro");
const img = document.querySelector(".img-principal");
const participantes = document.querySelector(".participantes");
participantes.style.display = "none";
const obs = document.querySelector(".obs");
const botaoSorteio = document.querySelector("#btn-sorteio");
const botoes = document.querySelector(".btns");
const loader = document.querySelector(".lds-ring");
let dados;
async function obterAmigos() {
    const response = await fetch("http://localhost:3000/amigos/all");
    loader.style.display = "none";
    if (response.status === 204) {
        img.style.display = "block";
        botaoCadastro.style.display = "flex";
    } else if (response.status === 200) {
        participantes.style.display = "flex";
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

    card.classList.add("card");
    buttons.classList.add("buttons");
    data.classList.add("data");

    nomePessoa.classList.add("nome");
    nomePessoa.innerText = `${nome}`;

    emailPessoa.classList.add("email");
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

    const pagRemove = document.createElement("div");
    body.appendChild(pagRemove);
    pagRemove.classList.add("pag-remove");

    const frases = document.createElement("div");

    const mensagemExclusao = document.createElement("p");
    const mensagemExclusaoPessoa = document.createElement("p");

    const buttons = document.createElement("div");

    const buttonSim = document.createElement("button");
    const buttonCancelar = document.createElement("button");

    frases.classList.add("frases");
    mensagemExclusao.classList.add("mensagem-exclusao");
    mensagemExclusaoPessoa.classList.add("mensagem-exclusao-pessoa");
    buttons.classList.add("buttonsSimNao");
    buttonSim.classList.add("button-sim");
    buttonCancelar.classList.add("button-cancelar");

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
            botoes.style.display = "none";
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
        pagRemove.style.display = "none";
    });

    buttonCancelar.addEventListener("click", (_) => {
        frases.style.display = "none";
        buttons.style.display = "none";
        main.style.display = "flex";
        pagRemove.style.display = "none";
    });

    buttonSim.innerText = "Sim";
    buttonCancelar.innerText = "Não";

    mensagemExclusao.innerText = "Deseja realmente excluir";
    mensagemExclusaoPessoa.innerText = `${nome} ?`;

    frases.appendChild(mensagemExclusao);
    frases.appendChild(mensagemExclusaoPessoa);

    buttons.appendChild(buttonSim);
    buttons.appendChild(buttonCancelar);

    pagRemove.appendChild(frases);
    pagRemove.appendChild(buttons);
}

function adicionarListenerBotaoSorteio() {
    const config = {
        method: "PUT",
    };

    botaoSorteio.addEventListener("click", async (_) => {
        //Mudar para tela de loading
        participantes.style.display = "none";
        obs.style.display = "none";
        botoes.style.display = "none";
        loader.style.display = "block";

        await fetch("http://localhost:3000/amigos/sorteio", config);
        //Mudar tela para "Sorteio realizado com sucesso!"

        loader.style.display = "none";
        const sucesso = document.getElementById("sucesso");
        sucesso.style.display = "flex";
        const botaoOk = document.querySelector(".botao-ok");
        botaoOk.style.display = "block";

        botaoOk.addEventListener("click", (_) => {
            sucesso.style.display = "none";
            botaoOk.style.display = "none";
            document.location.href = `../pages/index.html`;
        });
    });
}

obterAmigos();
adicionarListenerBotaoSorteio();
