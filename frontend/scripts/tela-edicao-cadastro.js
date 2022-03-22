// pegando parametros da url
const urlParams = new URLSearchParams(window.location.search);
const btnSalvar = document.getElementById("btn-salvar");
const btnOk = document.querySelector(".botao-ok");

const nomeInput = document.getElementById("nome");
const emailInput = document.getElementById("email");

const idParam = urlParams.get("id");

async function editar() {
	const nome = nomeInput.value;
	const email = emailInput.value;

	const config = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			nome,
			email,
		}),
	};

	const response = await fetch(
		`http://localhost:3000/amigos/${idParam}`,
		config
	);

	console.log(response);
	if (response.status === 400) {
		const dados = await response.json();

		let erro = document.querySelector(".erro");
		erro.innerText = dados.error;
		return false;
	} else {
		let formulario = document.getElementById("formulario");
		formulario.style.display = "none";

		let sucesso = document.getElementById("sucesso");
		sucesso.style.display = "flex";

		return true;
	}
}

async function obterById(id) {
	const response = await fetch(`http://localhost:3000/amigos/${id}`);

	if (response.status === 200) {
		const amigo = await response.json();

		const nome = amigo.nome;
		const email = amigo.email;

		nomeInput.value = nome;
		emailInput.value = email;
	} else if (response.status === 204) {
		// errinho
	}
}

obterById(idParam);

function voltaToIndex(event) {
	const editou = editar();

	if (editou) {
		btnOk.addEventListener("click", () => {
			document.location.href = "../pages/index.html";
		});
	}
}

btnSalvar.addEventListener("click", voltaToIndex);
