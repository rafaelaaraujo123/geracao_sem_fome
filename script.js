
/* =====================================
   GERAÇÃO SEM FOME
   Funcionamento do aplicativo
===================================== */


/* DADOS */

let usuarioAtual = null;

let usuarios = JSON.parse(
    localStorage.getItem("usuarios") || "[]"
);

let doacoes = JSON.parse(
    localStorage.getItem("doacoes") || "[]"
);


/* DOAÇÕES DE EXEMPLO */

if (doacoes.length === 0) {

    doacoes = [
        {
            id: 1,
            alimento: "Cesta de alimentos",
            quantidade: 2,
            unidade: "unidades",
            categoria: "Alimentos não perecíveis",
            endereco: "Rua das Flores, 120",
            descricao: "Arroz, feijão e macarrão",
            emoji: "📦",
            doador: "Projeto Geração sem Fome"
        },

        {
            id: 2,
            alimento: "Frutas frescas",
            quantidade: 5,
            unidade: "kg",
            categoria: "Frutas e verduras",
            endereco: "Avenida Central, 250",
            descricao: "Frutas disponíveis para doação",
            emoji: "🍎",
            doador: "Maria"
        },

        {
            id: 3,
            alimento: "Arroz",
            quantidade: 3,
            unidade: "kg",
            categoria: "Alimentos não perecíveis",
            endereco: "Rua da Solidariedade, 45",
            descricao: "Pacotes de arroz",
            emoji: "🍚",
            doador: "João"
        }
    ];

    salvarDoacoes();

}


/* SALVAR DADOS */

function salvarUsuarios() {

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

}

function salvarDoacoes() {

    localStorage.setItem(
        "doacoes",
        JSON.stringify(doacoes)
    );

}


/* NAVEGAÇÃO */

function irPara(id) {

    const telas = document.querySelectorAll(".tela");

    telas.forEach(function(tela) {

        tela.classList.remove("ativa");

    });

    const telaDestino = document.getElementById(id);

    if (!telaDestino) {

        mostrarMensagem("Página não encontrada.");

        return;

    }

    telaDestino.classList.add("ativa");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    atualizarDados();

}


/* MENSAGENS */

function mostrarMensagem(texto) {

    const mensagem = document.getElementById("mensagem");

    mensagem.textContent = texto;

    mensagem.classList.add("visivel");

    setTimeout(function() {

        mensagem.classList.remove("visivel");

    }, 3500);

}


/* ATUALIZAR INFORMAÇÕES */

function atualizarDados() {

    const total = document.getElementById("totalDoacoes");

    if (total) {

        total.textContent = doacoes.length;

    }

    if (usuarioAtual) {

        const nomeHome = document.getElementById("nomeHome");

        const perfilNome = document.getElementById("perfilNome");

        const perfilEmail = document.getElementById("perfilEmail");

        if (nomeHome) {

            nomeHome.textContent =
                usuarioAtual.nome.split(" ")[0];

        }

        if (perfilNome) {

            perfilNome.textContent = usuarioAtual.nome;

        }

        if (perfilEmail) {

            perfilEmail.textContent = usuarioAtual.email;

        }

        preencherPerfil();

    }

    renderizarDoacoes();

    renderizarRanking();

}


/* CADASTRO */

const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();

    const email = document.getElementById("email").value.trim().toLowerCase();

    const senha = document.getElementById("senha").value;

    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const aceitarTermos = document.getElementById("aceitarTermos").checked;


    if (senha.length < 6) {

        mostrarMensagem("A senha precisa ter pelo menos 6 caracteres.");

        return;

    }

    if (senha !== confirmarSenha) {

        mostrarMensagem("As senhas não são iguais.");

        return;

    }

    if (!aceitarTermos) {

        mostrarMensagem("Aceite os termos para continuar.");

        return;

    }

    const emailExiste = usuarios.some(function(usuario) {

        return usuario.email === email;

    });

    if (emailExiste) {

        mostrarMensagem("Este e-mail já está cadastrado.");

        return;

    }


    const novoUsuario = {

        id: Date.now(),

        nome: nome,

        email: email,

        senha: senha,

        telefone: "",

        localizacao: "",

        doacoes: 0

    };


    usuarios.push(novoUsuario);

    salvarUsuarios();

    usuarioAtual = novoUsuario;

    mostrarMensagem("Conta criada com sucesso!");

    formCadastro.reset();

    irPara("sucesso");

});


/* LOGIN */

const formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();

    const senha = document.getElementById("loginSenha").value;


    const usuarioEncontrado = usuarios.find(function(usuario) {

        return (
            usuario.email === email ||
            usuario.nome.toLowerCase() === email
        ) && usuario.senha === senha;

    });


    if (!usuarioEncontrado) {

        mostrarMensagem("Usuário ou senha incorretos.");

        return;

    }


    usuarioAtual = usuarioEncontrado;

    mostrarMensagem("Login realizado!");

    formLogin.reset();

    irPara("home");

});


/* LOGIN SOCIAL - DEMONSTRAÇÃO */

function loginSocial(plataforma) {

    mostrarMensagem(
        "Login com " + plataforma +
        " ainda não está conectado. Use seu cadastro."
    );

}


/* ESQUECI A SENHA */

function esqueciSenha() {

    const email = prompt("Digite seu e-mail cadastrado:");

    if (!email) {

        return;

    }

    const usuario = usuarios.find(function(item) {

        return item.email === email.trim().toLowerCase();

    });

    if (usuario) {

        mostrarMensagem(
            "Protótipo: sua senha cadastrada é " + usuario.senha
        );

    } else {

        mostrarMensagem("E-mail não encontrado.");

    }

}


/* TERMOS */

function mostrarTermos(event) {

    event.preventDefault();

    alert(
        "Termos de uso\n\n" +
        "Este aplicativo é um protótipo escolar criado " +
        "para conectar doadores e pessoas que precisam de alimentos."
    );

}

function mostrarPrivacidade(event) {

    event.preventDefault();

    alert(
        "Política de privacidade\n\n" +
        "Esta versão utiliza armazenamento local no navegador. " +
        "Não é um sistema de produção."
    );

}


/* PUBLICAR DOAÇÃO */

const formDoacao = document.getElementById("formDoacao");

formDoacao.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!usuarioAtual) {

        mostrarMensagem("Entre na sua conta para fazer uma doação.");

        irPara("login");

        return;

    }


    const alimento = document.getElementById("alimento").value.trim();

    const quantidade = Number(
        document.getElementById("quantidade").value
    );

    const unidade = document.getElementById("unidade").value;

    const categoria = document.getElementById("categoria").value;

    const endereco = document.getElementById("endereco").value.trim();

    const validade = document.getElementById("validade").value;

    const descricao = document.getElementById("descricao").value.trim();


    if (quantidade <= 0) {

        mostrarMensagem("Digite uma quantidade válida.");

        return;

    }


    const novaDoacao = {

        id: Date.now(),

        alimento: alimento,

        quantidade: quantidade,

        unidade: unidade,

        categoria: categoria,

        endereco: endereco,

        validade: validade,

        descricao: descricao,

        emoji: escolherEmoji(categoria),

        doador: usuarioAtual.nome

    };


    doacoes.unshift(novaDoacao);

    salvarDoacoes();


    usuarioAtual.doacoes = (usuarioAtual.doacoes || 0) + 1;

    atualizarUsuarioAtual();

    formDoacao.reset();

    mostrarMensagem("Doação publicada com sucesso!");

    irPara("home");

});


/* EMOJI */

function escolherEmoji(categoria) {

    if (categoria === "Frutas e verduras") {

        return "🍎";

    }

    if (categoria === "Alimentos preparados") {

        return "🍲";

    }

    if (categoria === "Alimentos não perecíveis") {

        return "📦";

    }

    return "🥫";

}


/* ATUALIZAR USUÁRIO */

function atualizarUsuarioAtual() {

    if (!usuarioAtual) {

        return;

    }

    const indice = usuarios.findIndex(function(usuario) {

        return usuario.id === usuarioAtual.id;

    });

    if (indice !== -1) {

        usuarios[indice] = usuarioAtual;

        salvarUsuarios();

    }

}


/* BUSCAR DOAÇÕES */

function renderizarDoacoes() {

    const lista = document.getElementById("listaDoacoes");

    if (!lista) {

        return;

    }

    const campoBusca = document.getElementById("campoBusca");

    const termo = campoBusca.value.trim().toLowerCase();


    const doacoesFiltradas = doacoes.filter(function(doacao) {

        return (
            doacao.alimento.toLowerCase().includes(termo) ||
            doacao.categoria.toLowerCase().includes(termo) ||
            doacao.endereco.toLowerCase().includes(termo)
        );

    });


    lista.innerHTML = "";


    if (doacoesFiltradas.length === 0) {

        lista.innerHTML = `
            <div class="card">
                <h3>Nenhuma doação encontrada</h3>
                <p>Tente buscar outro alimento.</p>
            </div>
        `;

        return;

    }


    doacoesFiltradas.forEach(function(doacao) {

        const item = document.createElement("article");

        item.className = "doacao-item";


        item.innerHTML = `
            <div class="emoji">
                ${doacao.emoji || "📦"}
            </div>

            <div class="info">
                <h3>${escaparHTML(doacao.alimento)}</h3>

                <p>
                    ${escaparHTML(String(doacao.quantidade))} 
                    ${escaparHTML(doacao.unidade)}
                </p>

                <p>
                    📍 ${escaparHTML(doacao.endereco)}
                </p>
            </div>

            <button
                onclick="selecionarDoacao(${doacao.id})"
            >
                Ver
            </button>
        `;


        lista.appendChild(item);

    });

}


/* DETALHES */

function selecionarDoacao(id) {

    const doacao = doacoes.find(function(item) {

        return item.id === id;

    });

    if (!doacao) {

        return;

    }


    const detalhe = document.getElementById("detalheDoacao");


    detalhe.innerHTML = `
        <div class="detalhe-card">

            <h3>${doacao.emoji || "📦"} ${escaparHTML(doacao.alimento)}</h3>

            <p>
                <strong>Quantidade:</strong>
                ${escaparHTML(String(doacao.quantidade))}
                ${escaparHTML(doacao.unidade)}
            </p>

            <p>
                <strong>Tipo:</strong>
                ${escaparHTML(doacao.categoria)}
            </p>

            <p>
                <strong>Endereço:</strong>
                ${escaparHTML(doacao.endereco)}
            </p>

            <p>
                <strong>Descrição:</strong>
                ${escaparHTML(doacao.descricao || "Sem descrição")}
            </p>

            <p>
                <strong>Doador:</strong>
                ${escaparHTML(doacao.doador)}
            </p>

            <button
                class="btn btn-rosa"
                onclick="solicitarDoacao(${doacao.id})"
            >
                Quero receber
            </button>

        </div>
    `;


    detalhe.scrollIntoView({

        behavior: "smooth",

        block: "nearest"

    });

}


/* SOLICITAR DOAÇÃO */

function solicitarDoacao(id) {

    if (!usuarioAtual) {

        mostrarMensagem("Entre na sua conta para continuar.");

        irPara("login");

        return;

    }


    const doacao = doacoes.find(function(item) {

        return item.id === id;

    });

    if (!doacao) {

        return;

    }


    const confirmar = confirm(
        "Deseja solicitar esta doação?\n\n" +
        doacao.alimento + "\n" +
        doacao.endereco
    );


    if (!confirmar) {

        return;

    }


    mostrarMensagem(
        "Solicitação registrada no protótipo. " +
        "Entre em contato com o doador para combinar a retirada."
    );

}


/* MAPA / LISTA */

function mostrarMapa() {

    document.getElementById("mapa").style.display = "block";

    document.getElementById("listaDoacoes").style.display = "none";

    document.getElementById("abaMapa").classList.add("ativa");

    document.getElementById("abaLista").classList.remove("ativa");

}

function mostrarLista() {

    document.getElementById("mapa").style.display = "none";

    document.getElementById("listaDoacoes").style.display = "flex";

    document.getElementById("abaLista").classList.add("ativa");

    document.getElementById("abaMapa").classList.remove("ativa");

}

function alternarVisualizacao() {

    const lista = document.getElementById("listaDoacoes");

    if (lista.style.display === "flex") {

        mostrarMapa();

    } else {

        mostrarLista();

    }

}


/* BUSCA AUTOMÁTICA */

document.getElementById("campoBusca").addEventListener(
    "input",
    renderizarDoacoes
);


/* RANKING */

function renderizarRanking() {

    const lista = document.getElementById("rankingLista");

    if (!lista) {

        return;

    }


    const ranking = [...usuarios].sort(function(a, b) {

        return (b.doacoes || 0) - (a.doacoes || 0);

    });


    lista.innerHTML = "";


    if (ranking.length === 0) {

        lista.innerHTML = `
            <div class="card">
                <p>Ainda não existem doadores cadastrados.</p>
            </div>
        `;

        return;

    }


    ranking.forEach(function(usuario, index) {

        const item = document.createElement("div");

        item.className = "ranking-item";


        item.innerHTML = `
            <span class="ranking-posicao">
                ${index + 1}º
            </span>

            <div class="info">
                <h3>${escaparHTML(usuario.nome)}</h3>

                <p>
                    ${usuario.doacoes || 0} doações
                </p>
            </div>

            <span>♡</span>
        `;


        lista.appendChild(item);

    });

}


/* EDITAR PERFIL */

function preencherPerfil() {

    if (!usuarioAtual) {

        return;

    }

    document.getElementById("editarNome").value =
        usuarioAtual.nome || "";

    document.getElementById("editarEmail").value =
        usuarioAtual.email || "";

    document.getElementById("telefone").value =
        usuarioAtual.telefone || "";

    document.getElementById("localizacao").value =
        usuarioAtual.localizacao || "";

}


const formPerfil = document.getElementById("formPerfil");

formPerfil.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!usuarioAtual) {

        return;

    }


    const nome = document.getElementById("editarNome").value.trim();

    const email = document.getElementById("editarEmail").value.trim().toLowerCase();

    const telefone = document.getElementById("telefone").value.trim();

    const localizacao = document.getElementById("localizacao").value.trim();


    const emailExiste = usuarios.some(function(usuario) {

        return (
            usuario.email === email &&
            usuario.id !== usuarioAtual.id
        );

    });

    if (emailExiste) {

        mostrarMensagem("Este e-mail já está sendo usado.");

        return;

    }


    usuarioAtual.nome = nome;

    usuarioAtual.email = email;

    usuarioAtual.telefone = telefone;

    usuarioAtual.localizacao = localizacao;


    atualizarUsuarioAtual();

    atualizarDados();

    mostrarMensagem("Perfil atualizado!");

    irPara("perfil");

});


/* SAIR */

function sair() {

    const confirmar = confirm("Deseja sair da sua conta?");

    if (!confirmar) {

        return;

    }

    usuarioAtual = null;

    mostrarMensagem("Você saiu da sua conta.");

    irPara("inicio");

}


/* LIMPAR DADOS */

function limparDados() {

    const confirmar = confirm(
        "Deseja apagar todos os dados salvos neste navegador?"
    );

    if (!confirmar) {

        return;

    }


    localStorage.removeItem("usuarios");

    localStorage.removeItem("doacoes");


    usuarios = [];

    doacoes = [];

    usuarioAtual = null;


    mostrarMensagem("Dados locais apagados.");

    irPara("inicio");

}


/* PROTEÇÃO DE TEXTO */

function escaparHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* INICIAR APLICATIVO */

document.addEventListener("DOMContentLoaded", function() {

    irPara("inicio");

    mostrarMapa();

});
