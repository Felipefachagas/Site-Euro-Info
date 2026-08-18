// pegando os dados do html
const botoesNav = document.querySelectorAll(".nav-btn"); // Botões da NavBar
const app = document.querySelector("#container");
const body = document.body;
const destaque = document.querySelector("#destaque"); // As seções, importante pegar a "caixa" para inserir os dados via DOM
const navSecundaria = document.querySelector("#navSecundaria");
const noticias = document.querySelector("#noticias");
const resumos = document.querySelector("#resumos");
const botaoVerMais1 = document.querySelector("#ver-mais1"); // Para a parte das noticias
const botaoVoltar1 = document.querySelector("#voltar1");
const secaoNoticias = document.querySelector("#secao-noticias");
const secaoBase = document.querySelector("#secao-base");
const botaoVerMais2 = document.querySelector("#ver-mais2"); // Para os melhores jogadores
const botaoVoltar2 = document.querySelector("#voltar2");

let ligaAtual = "";

// Carregando a tela completa
function carregarTela(tela) {
  body.className = "";

  if (tela === "inicio") {
    // ESCONDE AS SEÇÕES DE NOTÍCIAS E RESUMOS NO INÍCIO
    secaoNoticias.style.display = "none";
    secaoBase.style.display = "none";
    navSecundaria.style.display = "none";

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
    navSecundaria.style.display = "flex";

    ligaAtual = tela;
    iniciarSecaoTabela(true);

    if (tela === "champions") {
      body.classList.add("tema-champions");
      filtrarNoticiasPorLiga("champions");
      filtrarJogadoresPorLiga("champions");
    } else if (tela === "europa") {
      body.classList.add("tema-europa");
      filtrarNoticiasPorLiga("europa");
      filtrarJogadoresPorLiga("europa");
    } else if (tela === "conference") {
      body.classList.add("tema-conference");
      filtrarNoticiasPorLiga("conference");
      filtrarJogadoresPorLiga("conference");
    }
  }
}

const botoesNavSecundaria = document.querySelectorAll(
  "#navSecundaria .nav-btn",
);

botoesNavSecundaria.forEach((botao) => {
  botao.addEventListener("click", (event) => {
    const abaClicada = event.currentTarget.dataset.tela;

    if (abaClicada === "tabela") {
      console.log("ENTROU AQUI")
      // Clicou na aba Tabela? Chama a função passando FALSE (não é resumida)
      iniciarSecaoTabela(false);
    } else if (abaClicada === "visaoGeral") {
      // Clicou na Visão Geral? Chama a função passando TRUE (é resumida)
      iniciarSecaoTabela(true);
    }
  });
});

// Adicionando eventListeners nos botões do navBar
botoesNav.forEach((botao) => {
  botao.addEventListener("click", (event) => {
    // pega o valor que ta no data-tela
    const valor = event.currentTarget.dataset.tela;
    // carrega a tela com determinado valor
    carregarTela(valor);
  });
});

// Parte da API

let tabelaCompletaAtual = []; // Guarda a tabela completa na memória

// Função que cria o HTML da tabela
// Função que cria o HTML da tabela
function renderizarTabela(times, mostrarBotaoVerMais = true) {
  // 1. Cria as linhas para cada time
  const htmlLinhas = times
    .map(
      (time) => `
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
      <td style="padding: 12px; font-weight: bold; color: var(--cor-destaque);">${time.rank}</td>
      <td style="padding: 12px; display: flex; align-items: center; gap: 10px; font-weight: bold;">
        <img src="${time.team.logo}" style="width: 25px; height: 25px;">
        ${time.team.name}
      </td>
      <td style="padding: 12px; font-weight: bold; font-size: 1.1rem;">${time.points}</td>
      <td style="padding: 12px;">${time.all.played}</td>
      <td style="padding: 12px;">${time.all.win}</td>
      <td style="padding: 12px;">${time.all.draw}</td>
      <td style="padding: 12px;">${time.all.lose}</td>
      <td style="padding: 12px;">${time.goalsDiff}</td>
    </tr>
  `,
    )
    .join("");

  // 2. Monta o card principal com o cabeçalho
  let htmlFinal = `
    <div class="card-glass" style="overflow-x: auto; margin-top: 20px;">
      <h2 style="color: white; margin-bottom: 15px; text-transform: uppercase;">Classificação do Grupo</h2>
      <table style="width: 100%; text-align: left; border-collapse: collapse; min-width: 500px;">
        <thead>
          <tr style="border-bottom: 2px solid rgba(255,255,255,0.2);">
            <th style="padding: 12px;">#</th>
            <th style="padding: 12px;">Clube</th>
            <th style="padding: 12px;">Pts</th>
            <th style="padding: 12px;">J</th>
            <th style="padding: 12px;">V</th>
            <th style="padding: 12px;">E</th>
            <th style="padding: 12px;">D</th>
            <th style="padding: 12px;">SG</th>
          </tr>
        </thead>
        <tbody>
          ${htmlLinhas}
        </tbody>
      </table>
  `;

  // 3. Adiciona o botão de Ver Mais APENAS se for a tabela resumida
  if (mostrarBotaoVerMais) {
    htmlFinal += `
      <button id="btn-ver-mais-tabela" class="botao-acao" style="width: 100%; margin-top: 20px; text-align: center;">
        Ver Tabela Completa
      </button>
    `;
  }

  htmlFinal += `</div>`;

  // 4. Joga tudo na tela
  destaque.innerHTML = htmlFinal;

  // 5. Ativa o botão de "Ver Mais"
  if (mostrarBotaoVerMais) {
    document
      .querySelector("#btn-ver-mais-tabela")
      .addEventListener("click", () => {
        // A MUDANÇA FOI AQUI: Acionamos a função passando "false" para carregar 40 times!
        iniciarSecaoTabela(false);
      });
  }
}

// Ativando a API quando clica em "Tabela"
async function iniciarSecaoTabela(ehResumida = true) {
  destaque.innerHTML =
    "<h2 style='text-align:center;'>Carregando dados ao vivo da UEFA... ⏳</h2>";

  const idsLigas = { champions: 2, europa: 3, conference: 848 };
  const idDaLigaParaAPI = idsLigas[ligaAtual];
  const temporada = 2024;

  // Define se vai cortar em 4 (Visão Geral) ou buscar 40 (Tabela Completa)
  const limiteDeTimes = ehResumida ? 4 : 40;

  const dados = await obterTabelaTratada(
    idDaLigaParaAPI,
    temporada,
    limiteDeTimes,
  );

  // Extrai a lista de times de forma segura, independente da versão do seu dados.js
  let tabelaParaMostrar = [];
  if (Array.isArray(dados)) {
    tabelaParaMostrar = dados;
  } else if (dados && dados.completa) {
    tabelaParaMostrar = ehResumida ? dados.limitada : dados.completa;
  }

  // Trava de segurança final
  if (!tabelaParaMostrar || tabelaParaMostrar.length === 0) {
    destaque.innerHTML =
      "<h2 style='text-align:center; color: red;'>Erro ao buscar tabela!</h2>";
    return;
  }

  // Desenha na tela!
  renderizarTabela(tabelaParaMostrar, ehResumida);
}

// Inserindo as noticias
let indiceAtual = 0;
let maximoNoticias = window.innerWidth <= 768 ? 1 : 4; // Caso seja celular, mostra 1 noticia por vez
let todasNoticias = [];
let noticiasFiltradas = [];
let ultimoCard = 0;

function filtrarNoticiasPorLiga(liga) {
  if (todasNoticias.length === 0) return;
  // Cria um novo array só com as noticias da liga esperada do tema
  noticiasFiltradas = todasNoticias.filter((noticias) => noticias.liga == liga);
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
  jogadoresFiltrados = todosJogadores.filter((jogador) => jogador.liga == liga);
  indice = 0;
  atualizarJogadores();
}

// Função que vai atualizar o DOM da página
function atualizarJogadores(direcao2 = "") {
  const jogadoresNaTela = jogadoresFiltrados.slice(
    indice,
    indice + maximoJogadores,
  );

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
  `,
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
