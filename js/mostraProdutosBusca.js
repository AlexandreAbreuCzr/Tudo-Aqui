import { conexaoApi } from "./conexaoApi.js";
import mostraProdutos from "./mostraProdutos.js";

const params = new URLSearchParams(window.location.search);
const termo = params.get('busca');

const inputPesq = document.querySelector('[data-pesquisa]');
if (inputPesq && termo) inputPesq.value = termo;

async function buscaProduto() {
    const lista = document.querySelector('[data-lista]');
    if (!lista) return;

    const produtos = await conexaoApi.buscarProduto(termo);
    const usuarios = await conexaoApi.conexaoCadastros();

    lista.innerHTML = ''; // limpa a lista

    produtos.forEach(elemento => {
        const item = mostraProdutos(
            elemento.idDono,
            elemento.titulo,
            elemento.preco,
            elemento.imagem,
            elemento.id,
            usuarios // <-- passa aqui
        );
        lista.appendChild(item);
    });
}

buscaProduto();
