// pegando os dados do html
const botoesNav = document.querySelectorAll(".nav-btn");
const app = document.querySelector("#container");
const body = document.body;
const destaque = document.querySelector("#destaque");
const noticias = document.querySelector("#noticias");
const resumos = document.querySelector("#resumos");
const botaoVerMais = document.querySelector("#ver-mais");
const botaoVoltar = document.querySelector("#voltar");
const secaoNoticias = document.querySelector("#secao-noticias");
const secaoBase = document.querySelector("#secao-base");

function injetarTopo(nomeLiga, icone, fase, timeCasa, gols, timeFora) {
  return `
    <h1 style="margin-bottom: 20px;">${icone} ${nomeLiga}</h1>
    <div class="card-glass">
        <h2>Partida em Destaque</h2>
        <p class="texto-destaque">${fase}</p>
        <div class="linha-jogo">
            <span>${timeCasa}</span>
            <span class="placar">${gols}</span>
            <span>${timeFora}</span>
        </div>
        <button class="botao-acao">Ver Todos</button>
    </div>
  `;
}


// 3. A Lógica de Roteamento
function carregarTela(tela) {
  body.className = "";

  if (tela === "inicio") {
    // ESCONDE AS SEÇÕES DE NOTÍCIAS E RESUMOS NO INÍCIO
    secaoNoticias.style.display = "none";
    secaoBase.style.display = "none";

    destaque.innerHTML = `
      <div style="text-align: center;">
          <h1>Dashboard UEFA ⚽</h1>
          <p style="color: #aaa; margin-top: 10px;">Selecione uma competição no menu para alterar o tema.</p>
      </div>
    `;

  } else {
    // MOSTRA AS SEÇÕES ASSIM QUE QUALQUER LIGA FOR CLICADA
    secaoNoticias.style.display = "block";
    secaoBase.style.display = "block";

    if (tela === "champions") {
      body.classList.add("tema-champions");
      destaque.innerHTML = injetarTopo("Champions League", "🏆", "Fase de Grupos", "Real Madrid", "2 - 1", "Dortmund");
      filtrarNoticiasPorLiga("champions");
    }
    else if (tela === "europa") {
      body.classList.add("tema-europa");
      destaque.innerHTML = injetarTopo("Europa League", "🟠", "Semifinal - Ida", "Atalanta", "1 - 1", "Bayer Leverkusen");
      filtrarNoticiasPorLiga("europa");
    }
    else if (tela === "conference") {
      body.classList.add("tema-conference");
      destaque.innerHTML = injetarTopo("Conference League", "🟢", "Semifinal - Ida", "Fiorentina", "0 - 0", "West Ham");
      filtrarNoticiasPorLiga("conference");
    }
  }
}

// Adicionando eventListeners nos botões do navBar
botoesNav.forEach((botao) => {
  botao.addEventListener("click", (event) => {
    // pega o valor que ta no data-tela
    const valor = event.currentTarget.dataset.tela;
    // carrega a tela com determinado valor
    carregarTela(valor);
  });
});

// Inserindo as noticias
let indiceAtual = 0;
let maximoNoticias = window.innerWidth <= 768 ? 1 : 4; // Caso seja celular, mostra 1 noticia por vez
let todasNoticias = [];
let noticiasFiltradas = [];
let ultimoCard = 0;

function filtrarNoticiasPorLiga(liga) {
  if (todasNoticias.length === 0) return;
  // Cria um novo array só com as noticias da liga esperada do tema
  noticiasFiltradas = todasNoticias.filter(noticias => noticias.liga == liga);
  indiceAtual = 0;
  ultimoCard = 0;
  atualizarNoticias();
}

// primeiro carregando os dados do JSON com async func
async function carregarJSON() {
  try {
    const resposta = await fetch("scripts/noticias.json");
    todasNoticias = await resposta.json();
    carregarTela("inicio");
  } catch (erro) {
    console.error("Erro ao carregar o JSON:", erro);
  }
}

// Criando os cards de noticia na tela
function atualizarNoticias(direcao = "") {
  const noticiasAparentes = noticiasFiltradas.slice(
    ultimoCard,
    indiceAtual + maximoNoticias,
  );


  let classeAnimacao = "";
  if (direcao === "proximo") {
    classeAnimacao = "anima-proximo";
  } else if (direcao === "anterior") {
    classeAnimacao = "anima-anterior";
  } else {
    classeAnimacao = "anima-entrada";
  }

  noticias.innerHTML = noticiasAparentes
    .map(
      (noticia) => `
    <article class="card-noticia ${classeAnimacao}">
      <img src="${noticia.imagem}" alt="${noticia.titulo}">
      <h3>${noticia.titulo}</h3>
      <p>${noticia.resumo}</p>
    </article>
  `,
    )
    .join("");

  if (indiceAtual <= 0) {
    botaoVoltar.style.display = "none"; // Esconde se estiver no começo
  } else {
    botaoVoltar.style.display = "block"; // Aparece se ja clicou 1 vez no avançar
  }

  if (indiceAtual + maximoNoticias >= noticiasFiltradas.length) {
    botaoVerMais.style.display = "none";
  } else {
    botaoVerMais.style.display = "block";
  }
}

botaoVerMais.addEventListener("click", () => {
  if (indiceAtual + maximoNoticias < noticiasFiltradas.length) {
    ultimoCard = indiceAtual + maximoNoticias;
    indiceAtual += 2;
    atualizarNoticias("proximo");
  }
});

botaoVoltar.addEventListener("click", () => {
  if (indiceAtual > 0) {
    indiceAtual -= 2;
    ultimoCard -= indiceAtual + noticiasFiltradas;
    atualizarNoticias("anterior");
  }
});

carregarJSON();
