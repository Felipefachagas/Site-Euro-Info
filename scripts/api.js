const API_KEY = "c58083e21061647c34c7b22032f8900e";
const BASE_URL = "https://v3.football.api-sports.io";

// Busca a tabela na api e retorna os dados
async function buscarTabelaNaAPI(idLiga, temporada) {
  try {
    // O 'fetch' faz o pedido. Passamos a URL e o nosso "crachá" (API Key) nos headers
    const resposta = await fetch(
      `${BASE_URL}/standings?league=${idLiga}&season=${temporada}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": API_KEY,
        },
      },
    );
    // transformando os dados em objetos, pq vem em forma de texto
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro na conexão com a API:", erro);
  }
}
