const botao = document.querySelector(".btn-input");
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
	console.log(response);

	if (response.status === 400) {
        const dados = await response.json();

		let erro = document.querySelector(".erro");
		erro.innerText = dados.error;

	} else {
		let container = document.querySelector(".container");
		container.innerHTML = "";

        // criando o P de Sucesso, adicionando no MAIN e criando uma classe pra ele
        let p = document.createElement("p");
        let mensagemP = document.createTextNode("Cadastrado com Sucesso!");
        p.appendChild(mensagemP);
        container.appendChild(p);

        if (p.classList) p.classList.add("p-sucesso");
        else p.className += " p-sucesso";

        // criando o BotaoOk, adicionando no MAIN e criando uma classe pra ele
        let botaoOk = document.createElement("button");
        let mensagemBotao = document.createTextNode("Ok");
        botaoOk.appendChild(mensagemBotao);
        container.appendChild(botaoOk);

        if (botaoOk.classList) botaoOk.classList.add("botao-ok");
        else botaoOk.className += " botao-ok";
	}
}

botao.addEventListener("click", (event) => {
	event.preventDefault();
	adicionar(nome, email);
});
