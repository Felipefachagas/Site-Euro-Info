// ==========================================
// ARQUIVO: dados.js (Com memória anti-bug)
// ==========================================

const memoriaDasTabelas = {};

async function obterTabelaTratada(idLiga, temporada, limite = 4) {
  const chaveMemoria = `${idLiga}-${temporada}`;
  let dadosBrutos;

  // 1. Antes de ir na internet, olha se já tem na memória!
  if (memoriaDasTabelas[chaveMemoria]) {
    console.log("⚡ Pegando da memória! Zero requisições gastas.");
    dadosBrutos = memoriaDasTabelas[chaveMemoria];
  } else {
    // 2. Se não tem, vai na internet buscar
    console.log("🌐 Buscando na API oficial...");
    dadosBrutos = await buscarTabelaNaAPI(idLiga, temporada);

    // 3. Salva na memória para não precisar buscar de novo se você voltar na aba
    if (
      dadosBrutos &&
      dadosBrutos.response &&
      dadosBrutos.response.length > 0
    ) {
      memoriaDasTabelas[chaveMemoria] = dadosBrutos;
    }
  }

  // Trava de segurança caso venha quebrado
  if (
    !dadosBrutos ||
    !dadosBrutos.response ||
    dadosBrutos.response.length === 0
  ) {
    return [];
  }

  // Pega a tabela principal
  const tabelaCompleta = dadosBrutos.response[0].league.standings[0];

  // Corta a tabela de acordo com o limite que a aba pediu (4 ou 40)
  const tabelaFinal = tabelaCompleta.slice(0, limite);

  return tabelaFinal;
}
