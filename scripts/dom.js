// pegando os dados do html
const botoesNav = document.querySelectorAll(".nav-btn"); // Botões da NavBar
const app = document.querySelector("#container");
const body = document.body;
const destaque = document.querySelector("#destaque");  // As seções, importante pegar a "caixa" para inserir os dados via DOM
const noticias = document.querySelector("#noticias");
const resumos = document.querySelector("#resumos");
const botaoVerMais1 = document.querySelector("#ver-mais1");  // Para a parte das noticias
const botaoVoltar1 = document.querySelector("#voltar1");
const secaoNoticias = document.querySelector("#secao-noticias");
const secaoBase = document.querySelector("#secao-base");
const botaoVerMais2 = document.querySelector("#ver-mais2");  // Para os melhores jogadores
const botaoVoltar2 = document.querySelector("#voltar2");


// função enqt nao tem a API
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



// Carregando a tela completa
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
      filtrarJogadoresPorLiga("champions")
    }
    else if (tela === "europa") {
      body.classList.add("tema-europa");
      destaque.innerHTML = injetarTopo("Europa League", "🟠", "Semifinal - Ida", "Atalanta", "1 - 1", "Bayer Leverkusen");
      filtrarNoticiasPorLiga("europa");
      filtrarJogadoresPorLiga("europa")
    }
    else if (tela === "conference") {
      body.classList.add("tema-conference");
      destaque.innerHTML = injetarTopo("Conference League", "🟢", "Semifinal - Ida", "Fiorentina", "0 - 0", "West Ham");
      filtrarNoticiasPorLiga("conference");
      filtrarJogadoresPorLiga("conference")
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
async function carregarJSONNoticias() {
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
    botaoVoltar1.style.display = "none"; // Esconde se estiver no começo
  } else {
    botaoVoltar1.style.display = "block"; // Aparece se ja clicou 1 vez no avançar
  }

  if (indiceAtual + maximoNoticias >= noticiasFiltradas.length) {
    botaoVerMais1.style.display = "none";
  } else {
    botaoVerMais1.style.display = "block";
  }
}

botaoVerMais1.addEventListener("click", () => {
  if (indiceAtual + maximoNoticias < noticiasFiltradas.length) {
    ultimoCard = indiceAtual + maximoNoticias;
    indiceAtual += 2;
    atualizarNoticias("proximo");
  }
});

botaoVoltar1.addEventListener("click", () => {
  if (indiceAtual > 0) {
    indiceAtual -= 2;
    ultimoCard -= indiceAtual + noticiasFiltradas;
    atualizarNoticias("anterior");
  }
});
carregarJSONNoticias();


// Seção dos melhores jogadores (lógica bem parecida com a aba das notícias, só muda pq agora pode aparecer 5 ao invés de 4 cards)
let indice = 0;
let todosJogadores = [];
let jogadoresFiltrados = [];
let maximoJogadores = window.innerWidth <= 768 ? 1 : 5; // 5 ou 1

// Carregando os dados do JSON

// primeiro carregando os dados do JSON com async func
async function carregarJSONJogadores() {
  try {
    const jogadores = await fetch("scripts/jogadores.json");
    todosJogadores = await jogadores.json();
    carregarTela("inicio");
  } catch (erro2) {
    console.error("Erro ao carregar o JSON:", erro2);
  }
}

// Tratamento de dados -> na parte de jogadores, vamos ainda ter o "carrosel", porém vamos permitir 5 jogadores por "tela"

function filtrarJogadoresPorLiga(liga) {
  if (todosJogadores.length === 0) return;
  // Cria um novo array só com os jogadores da liga esperada do tema
  jogadoresFiltrados = todosJogadores.filter(jogador => jogador.liga == liga);
  indice = 0;
  atualizarJogadores();
}

// Função que vai atualizar o DOM da página
function atualizarJogadores(direcao2 = "") {
  const jogadoresNaTela = jogadoresFiltrados.slice(indice, indice + maximoJogadores);

  let classeAnimacao2 = "";
  if (direcao2 === "proximo") {
    classeAnimacao2 = "anima-proximo";
  } else if (direcao2 === "anterior") {
    classeAnimacao2 = "anima-anterior";
  } else {
    classeAnimacao2 = "anima-entrada";
  }

  resumos.innerHTML = jogadoresNaTela
    .map(
      (jogador) => `
    <article class="card-jogador ${classeAnimacao2}">
      <div class="imagem-container">
        <img src="${jogador.imagem}" alt="${jogador.nome}" class="imagem-jogador">
      </div>
      <div class="dados-jogador">
        <h3>${jogador.nome}</h3>
        <p>${jogador.jogos} Jogos</p>
        <p>${jogador.gols} Gols</p>
        <p>${jogador.assistencias} Assistências</p>
      </div>
    </article>
  `
    )
    .join("");

  if (indice <= 0) {
    botaoVoltar2.style.display = "none"; // Esconde se estiver no começo
  } else {
    botaoVoltar2.style.display = "block"; // Aparece se ja clicou 1 vez no avançar
  }

  if (indice + maximoJogadores >= jogadoresFiltrados.length) {
    botaoVerMais2.style.display = "none";
  } else {
    botaoVerMais2.style.display = "block";
  }
}

botaoVerMais2.addEventListener("click", () => {
  if (indice + maximoJogadores < jogadoresFiltrados.length) {
    indice += maximoJogadores;
    atualizarJogadores("proximo");
  }
});

botaoVoltar2.addEventListener("click", () => {
  if (indice > 0) {
    indice -= maximoJogadores;
    atualizarJogadores("anterior");
  }
});
carregarJSONJogadores();