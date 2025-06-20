import { conexaoApi } from "./conexaoApi.js";

// Verifica se o usuário está logado
const logado = localStorage.getItem('logado');
const idLogado = localStorage.getItem('id');

// Pegando os elementos do formulário
const nomeProdutoInput = document.getElementById('nomeProduto');
const precoProdutoInput = document.getElementById('precoProduto');
const imagemProdutoInput = document.getElementById('imagemProduto');
const form = document.querySelector('[data-form]');
const erro = document.querySelector('[data-erro]');

// Quando o formulário for enviado
form.addEventListener('submit', anunciar);

// Função que trata o envio do formulário
async function anunciar(event) {
    event.preventDefault();

    const nomeProduto = nomeProdutoInput.value.trim();
    const precoProduto = precoProdutoInput.value.trim();
    const imagem = imagemProdutoInput.value.trim();

    // Verifica se está logado
    if (!logado) {
        erro.textContent = 'Para anunciar, você precisa estar logado.';
        return;
    }

    // Verifica se o nome é muito longo
    if (nomeProduto.length > 20) {
        erro.textContent = 'O nome do produto não pode ter mais que 20 caracteres.';
        return;
    }

    // Verifica se o preço está válido
    const { valido, numero } = verificarPreco(precoProduto);
    if (!valido) {
        erro.textContent = 'Digite um preço válido, como 29,00 ou 29.00';
        return;
    }

    // Verifica se tem imagem
    if (!imagem) {
        erro.textContent = 'Digite um link de imagem válido.';
        return;
    }

    // Tudo certo, pode enviar!
    const precoFormatado = numero.toFixed(2); // Ex: 29.00
    conexaoApi.anunciarProdutos(idLogado, nomeProduto, precoFormatado, imagem);
}

// Função que valida o preço
function verificarPreco(preco) {
    const limpo = preco.trim().replace(/[^\d,.\-]/g, '');
    const normalizado = limpo.replace(/,(\d{1,2})$/, '.$1');
    const numero = parseFloat(normalizado);
    const valido = !isNaN(numero) && numero >= 0;
    return { valido, numero: valido ? numero : null };
}
