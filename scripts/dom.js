// pegando os dados do html
const botoesNav = document.querySelectorAll(".nav-btn");
const app = document.querySelector("#container");
const body = document.body;

// Repare como a função diminuiu. A "casca" do HTML é idêntica para todas as ligas!
function injetarHTMLGenerico(nomeLiga, icone, fase, timeCasa, gols, timeFora) {
  return `
                <div class="area-conteudo">
                    <div class="container">
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
                    </div>
                </div>
            `;
}

// Funcao para carregar a tela dependendo do tema que for escolhido
function carregarTela(tela) {
  body.className = "";

  // 2. LÓGICA DE ROTEAMENTO
  if (tela === "inicio") {
    app.innerHTML = `
                    <div class="area-conteudo" style="display: flex; align-items: center; justify-content: center; text-align: center; background-image: none;">
                        <div>
                            <h1>Dashboard UEFA ⚽</h1>
                            <p style="color: #aaa; margin-top: 10px;">Selecione uma competição no menu para alterar o tema.</p>
                        </div>
                    </div>
                `;
  } else if (tela === "champions") {
    body.classList.add("tema-champions"); // Ativa as cores da Champions!
    app.innerHTML = injetarHTMLGenerico(
      "Champions League",
      "🏆",
      "Fase de Grupos",
      "Real Madrid",
      "2 - 1",
      "Dortmund",
    );
  } else if (tela === "europa") {
    body.classList.add("tema-europa"); // Ativa as cores da Europa!
    app.innerHTML = injetarHTMLGenerico(
      "Europa League",
      "🟠",
      "Semifinal - Ida",
      "Atalanta",
      "1 - 1",
      "Bayer Leverkusen",
    );
  } else if (tela === "conference") {
    body.classList.add("tema-conference"); // Ativa as cores da Conference!
    app.innerHTML = injetarHTMLGenerico(
      "Conference League",
      "🟢",
      "Semifinal - Ida",
      "Fiorentina",
      "0 - 0",
      "West Ham",
    );
  }
}

// Adicionando eventListeners nos botões
botoesNav.forEach((botao) => {
  botao.addEventListener("click", (event) => {
    // pega o valor que ta no data-tela
    const valor = event.currentTarget.dataset.tela;
    // carrega a tela com determinado valor
    carregarTela(valor);
  });
});
