// pegando os dados do html
const botoesNav = document.querySelectorAll("nav .nav-btn"); // Botões da NavBar
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
    iniciarVisaoGeral();

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
      // Clicou na aba Tabela? Chama a função passando FALSE (não é resumida)
      iniciarSecaoTabela(false);
    } else if (abaClicada == "jogos") {

    }
    else if (abaClicada === "visaoGeral") {
      // Clicou na Visão Geral? Chama a função passando TRUE (é resumida)
      iniciarVisaoGeral();
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





async function iniciarVisaoGeral() {
  destaque.innerHTML = `
    <div style="display: flex; gap: 20px; flex-wrap: wrap; align-items: flex-start; width: 100%;">
      <div id="caixa-jogos" style="width: 350px; flex-shrink: 0;"></div>
      <div id="caixa-tabela" style="flex-grow: 1; min-width: 450px;"></div>
      
    </div>
  `;

  // Teremos uma promessa chamando tanto os dados dos jogos quanto os da tabela
  await Promise.all([
    iniciarSecaoTabela(true),
    iniciarSecaoJogos(true)
  ]);
}


// Parte da Tabela - API
let tabelaCompletaAtual = []; // Guarda a tabela completa na memória

// Função que cria o HTML da tabela
function renderizarTabela(times, mostrarBotaoVerMais = true) {
  // cria as linhas para cada time 
  const htmlLinhas = times
    .map(
      (time) => `
    <tr class="tabela-linha">
      <td class="col-rank">${time.rank}</td>
      <td class="col-clube">
        <img src="images/logos/${time.team.id}.png" class="logo-clube" alt="Logo do ${time.team.name}">
        ${time.team.name}
      </td>
      <td class="col-pts">${time.points}</td>
      <td>${time.all.played}</td>
      <td>${time.all.win}</td>
      <td>${time.all.draw}</td>
      <td>${time.all.lose}</td>
      <td>${time.goalsDiff}</td>
    </tr>
  `,
    )
    .join("");

  //  monta a tabela
  let htmlFinal = `
    <div class="card-glass tabela-wrapper">
      <h2 class="tabela-titulo">Classificação</h2>
      <table class="tabela-classificacao">
        <thead>
          <tr class="tabela-cabecalho">
            <th>#</th>
            <th>Clube</th>
            <th>Pts</th>
            <th>J</th>
            <th>V</th>
            <th>E</th>
            <th>D</th>
            <th>SG</th>
          </tr>
        </thead>
        <tbody>
          ${htmlLinhas}
        </tbody>
      </table>
  `;

  // adiciona o botão de Ver Mais se for no Visão Geral
  if (mostrarBotaoVerMais) {
    htmlFinal += `
      <button id="btn-ver-mais-tabela" class="botao-acao btn-tabela-completa">
        Ver Tabela Completa
      </button>
    `;
  }

  htmlFinal += `</div>`;

  // atualiza a tela
  const caixaAlvo = document.querySelector("#caixa-tabela") || destaque;
  caixaAlvo.innerHTML = htmlFinal;


  // ativa o ver mais
  if (mostrarBotaoVerMais) {
    document
      .querySelector("#btn-ver-mais-tabela")
      .addEventListener("click", () => {
        iniciarSecaoTabela(false);
      });
  }
}

// Ativando a API quando clica em "Tabela"
async function iniciarSecaoTabela(ehResumida = true) {

  if (!ehResumida) {
    destaque.innerHTML = "<h2 class='texto-carregando'>Carregando Tabela Completa</h2>";
  }

  const idsLigas = { champions: 2, europa: 3, conference: 848 };
  const idDaLigaParaAPI = idsLigas[ligaAtual];  // pegando os valores necessarios
  const temporada = 2024;

  const limiteDeTimes = ehResumida ? 8 : 40;

  const dados = await obterTabelaTratada(  // pegando os dados da api
    idDaLigaParaAPI,
    temporada,
    limiteDeTimes,
  );

  let tabelaParaMostrar = [];
  if (Array.isArray(dados)) {
    tabelaParaMostrar = dados;
  } else if (dados && dados.completa) {
    tabelaParaMostrar = ehResumida ? dados.limitada : dados.completa;
  }

  // Trava de segurança final usando a classe de erro
  if (!tabelaParaMostrar || tabelaParaMostrar.length === 0) {
    destaque.innerHTML = "<h2 class='texto-erro'>Erro ao buscar tabela!</h2>";
    return;
  }

  renderizarTabela(tabelaParaMostrar, ehResumida);  // chamando a funcao de mostrar na tela
}

// Parte dos JOGOS

// Funcao que pega os jogos da API já tratados
async function iniciarSecaoJogos(jogoFinal = true, data) {
  const idsLigas = { champions: 2, europa: 3, conference: 848 };
  const idDaLigaParaAPI = idsLigas[ligaAtual];  // pegando os valores necessarios
  const temporada = 2024;

  let dados;
  if (jogoFinal) {
    dados = await retornaFinal(idDaLigaParaAPI, temporada) // Caso seja na visão geral, vai printar só o jogo da final
  } else {
    dados = await jogosPorData(idDaLigaParaAPI, temporada, data);
  }

  renderizarJogos(dados, jogoFinal);

}

// responsavel por colocar os jogos na tela (puramente DOM)
function renderizarJogos(jogos, jogoFinal) {
  const htmlDosJogos = jogos.map((jogo) => {
    const mandante = jogo.teams.home;
    const visitante = jogo.teams.away;
    const golsCasa = jogo.goals.home !== null ? jogo.goals.home : "-";
    const golsFora = jogo.goals.away !== null ? jogo.goals.away : "-";
    // Puxando a data e o status oficial da API para a coluna da esquerda!
    let dataFormatada = "Em breve";
    let status = "-";

    if (jogo.fixture) {
      // Pega a data ("2024-05-31") e transforma no formato brasileiro curto ("31/05/24")
      const dataObjeto = new Date(jogo.fixture.date);
      dataFormatada = dataObjeto.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
      status = jogo.fixture.status.short; // Ex: "FT", "NS", etc.
    }

    return `
      <div class="card-glass sofa-card">
        ${jogoFinal ? '<div class="sofa-header">Final</div>' : ''}
        
        <div class="sofa-body">
          <div class="sofa-info">
            <span class="sofa-data">${dataFormatada}</span>
            <span class="sofa-status">${status}</span>
          </div>

          <!-- Coluna Direita: Times e Placar empilhados -->
          <div class="sofa-times">
            <!-- Linha do Mandante -->
            <div class="sofa-linha">
              <div class="sofa-time-detalhe">
                  <img src="${mandante.logo}" alt="${mandante.name}" class="sofa-escudo">
                  <span class="sofa-nome">${mandante.name}</span>
              </div>
              <span class="sofa-placar">${golsCasa}</span>
            </div>

            <!-- Linha do Visitante -->
            <div class="sofa-linha">
              <div class="sofa-time-detalhe">
                  <img src="${visitante.logo}" alt="${visitante.name}" class="sofa-escudo">
                  <span class="sofa-nome">${visitante.name}</span>
              </div>
              <span class="sofa-placar">${golsFora}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Injeta no layout dividido ou na tela inteira
  const caixaAlvo = document.querySelector("#caixa-jogos") || destaque;
  caixaAlvo.innerHTML = htmlDosJogos;
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
