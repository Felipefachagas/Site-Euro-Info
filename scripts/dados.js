// arquivo para o tratamento de dados vindos da API

const memoriaDasTabelas = {};  // Estamos usando isso para evitar muitos usos de API diariamente
const memoriaDosJogos = {};

async function obterTabelaTratada(idLiga, temporada, limite = 8) {
  const chaveMemoria = `${idLiga}-${temporada}`;
  let dadosBrutos;

  // verificando se os dados ja estao na memoria para poupar usos de api
  if (memoriaDasTabelas[chaveMemoria]) {
    dadosBrutos = memoriaDasTabelas[chaveMemoria];
  } else {
    // se não tem, vai buscar na API
    dadosBrutos = await buscarTabelaNaAPI(idLiga, temporada);
    // salva na memória para não precisar buscar de novo se você voltar na aba
    if (
      dadosBrutos &&
      dadosBrutos.response &&
      dadosBrutos.response.length > 0
    ) {
      memoriaDasTabelas[chaveMemoria] = dadosBrutos;
    }
  }

  // Trava de segurança caso venha errado
  if (
    !dadosBrutos ||
    !dadosBrutos.response ||
    dadosBrutos.response.length === 0
  ) {
    return [];
  }

  // Pega a tabela principal
  const tabelaCompleta = dadosBrutos.response[0].league.standings[0];

  // Corta a tabela de acordo com o limite
  const tabelaFinal = tabelaCompleta.slice(0, limite);

  return tabelaFinal;
}


// Tratamento dos jogos
// precisamos de uma função que vai filtrar os jogos por data -> Essa é a parte mais importante provavelmente
// recebe a data e retorna um array com os jogos da data
async function jogosPorData(idLiga, temporada, data) {
  // lógica para guardar na memoria
  const chaveMemoria = `${idLiga}-${temporada}`;
  let todosOsJogos;
  if (memoriaDosJogos[chaveMemoria]) {
    todosOsJogos = memoriaDosJogos[chaveMemoria];
  } else {
    const dadosBrutos = await buscarJogos(idLiga, temporada);
    if (dadosBrutos && dadosBrutos.response && dadosBrutos.response.length > 0) {
      todosOsJogos = dadosBrutos.response;
      memoriaDosJogos[chaveMemoria] = todosOsJogos;
    } else {
      return [];
    }
  }

  // api nos entrega "time": "2019-11-26T00:00:00+00:00",
  const jogosFiltrados = todosOsJogos.filter((jogo) => {
    const dataJogo = jogo.fixture.date.substring(0, 10)
    return dataJogo == data;
  })

  // criamos um array apenas com os jogos que batem com a data selecionada, agora retornamos ele
  return jogosFiltrados;
}

// retorna a final
async function retornaFinal(idLiga, temporada) {
  // lógica para guardar na memoria
  const chaveMemoria = `${idLiga}-${temporada}`;
  let todosOsJogos;
  if (memoriaDosJogos[chaveMemoria]) {
    todosOsJogos = memoriaDosJogos[chaveMemoria];
  } else {
    const dadosBrutos = await buscarJogos(idLiga, temporada);
    if (dadosBrutos && dadosBrutos.response && dadosBrutos.response.length > 0) {
      todosOsJogos = dadosBrutos.response;
      memoriaDosJogos[chaveMemoria] = todosOsJogos;
    } else {
      return [];
    }
  }

  const jogoFinal = todosOsJogos.filter((jogo) => {
    return jogo.league.round == "Final"
  })

  return jogoFinal;
}