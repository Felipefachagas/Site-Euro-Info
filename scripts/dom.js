// pegando os dados do html
const botoesNav = document.querySelectorAll(".nav-btn");
const app = document.querySelector("#container");
const body = document.body;
const destaque = document.querySelector("#destaque");
const noticias = document.querySelector("#noticias");
const resumos = document.querySelector("#resumos");
const botaoVerMais = document.querySelector("#ver-mais");
const botaoVoltar = document.querySelector("#voltar");

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
    destaque.innerHTML = `
      <div style="text-align: center;">
          <h1>Dashboard UEFA ⚽</h1>
          <p style="color: #aaa; margin-top: 10px;">Selecione uma competição no menu para alterar o tema.</p>
      </div>
    `;
    noticias.innerHTML = ""; // Limpa as notícias na home
  } else if (tela === "champions") {
    body.classList.add("tema-champions");

    destaque.innerHTML = injetarTopo(
      "Champions League",
      "🏆",
      "Fase de Grupos",
      "Real Madrid",
      "2 - 1",
      "Dortmund",
    );
    noticias.innerHTML = `<p style="color: #000;">Carregando notícias da Champions...</p>`;
  } else if (tela === "europa") {
    body.classList.add("tema-europa");

    destaque.innerHTML = injetarTopo(
      "Europa League",
      "🟠",
      "Semifinal - Ida",
      "Atalanta",
      "1 - 1",
      "Bayer Leverkusen",
    );
    noticias.innerHTML = `<p style="color: #000;">Carregando notícias da Europa...</p>`;
  } else if (tela === "conference") {
    body.classList.add("tema-conference");

    destaque.innerHTML = injetarTopo(
      "Conference League",
      "🟢",
      "Semifinal - Ida",
      "Fiorentina",
      "0 - 0",
      "West Ham",
    );
    noticias.innerHTML = `<p style="color: #000;">Carregando notícias da Conference...</p>`;
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
let maximoNoticias = 4;
let todasNoticias = [];

// primeiro carregando os dados do JSON com async func
async function carregarJSON() {
  try {
    const resposta = await fetch("scripts/noticias.json");
    todasNoticias = await resposta.json();
    atualizarNoticias();
  } catch (erro) {
    console.error("Erro ao carregar o JSON:", erro);
  }
}

// Criando os cards de noticia na tela
function atualizarNoticias() {
  const noticiasAparentes = todasNoticias.slice(
    indiceAtual,
    indiceAtual + maximoNoticias,
  );

  noticias.innerHTML = noticiasAparentes
    .map(
      (noticia) => `
    <article class="card-noticia">
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

  if (indiceAtual + maximoNoticias >= todasNoticias.length) {
    botaoVerMais.style.display = "none";
  } else {
    botaoVerMais.style.display = "block";
  }
}

botaoVerMais.addEventListener("click", () => {
  if (indiceAtual + maximoNoticias < todasNoticias.length) {
    indiceAtual += 2;
    atualizarNoticias();
  }
});

botaoVoltar.addEventListener("click", () => {
  if (indiceAtual > 0) {
    indiceAtual -= 2;
    atualizarNoticias();
  }
});

carregarJSON();
