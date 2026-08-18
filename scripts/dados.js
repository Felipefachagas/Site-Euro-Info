// arquivo para o tratamento de dados vindos da API

const memoriaDasTabelas = {};

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
