import { conexaoApi } from "./conexaoApi.js";

const listaProdutos = document.querySelector('[data-lista]');
const Idlogado = localStorage.getItem('id'); // id do usuário logado
const usuarios = await conexaoApi.conexaoCadastros();

export default function mostraProdutos(donoId, titulo, preco, imagem, produtoId) {
  const produto = document.createElement('li');
  const usuario = usuarios.find(u => u.id.toString() === donoId.toString());
  produto.className = 'produto';
  produto.innerHTML = `
    <div class="autor-produto">
      <img src="${usuario.imagem}" alt="${usuario.nome}" class="foto-autor" />
      <span class="nome-autor">${usuario.nome}</span>
    </div>
    <div class="imgh">
      <img src="${imagem}" alt="Imagem do produto ${titulo}" class="produto-imagem" />
    </div>
    <div class="info-produto">
      <h3>${titulo}</h3>
      <p class="preco">R$ ${preco}</p>
      <button data-id="${produtoId}">Adicionar ao Carrinho</button>
    </div>
  `;
  return produto;
}

async function adicionarAoCarrinho(idProduto) {
  // Busca o usuário logado
  const usuariosAtualizados = await conexaoApi.conexaoCadastros();
  const usuario = usuariosAtualizados.find(u => u.id.toString() === Idlogado);
  if (!usuario) {
    alert('Usuário não logado');
    return;
  }

  let carrinho = usuario.carrinho ? usuario.carrinho.split(',').map(id => id.trim()) : [];
  let carrinhoQ = usuario.carrinhoQ ? usuario.carrinhoQ.split(',').map(q => parseInt(q.trim())) : [];

  const index = carrinho.indexOf(idProduto);

  if (index !== -1) {
    carrinhoQ[index] += 1; // aumenta quantidade
  } else {
    carrinho.push(idProduto);
    carrinhoQ.push(1);
  }

  // Atualiza no backend
  await fetch(`http://localhost:3000/cadastros/${usuario.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      carrinho: carrinho.join(', '),
      carrinhoQ: carrinhoQ.join(', ')
    })
  });

  alert('Produto adicionado ao carrinho!');
}

async function listaDeProdutos() {
  const listaApi = await conexaoApi.conexaoProdutos();
  listaProdutos.innerHTML = ''; // limpa lista antes
  listaApi.forEach(elemento => {
    const produtoElemento = mostraProdutos(elemento.idDono, elemento.titulo, elemento.preco, elemento.imagem, elemento.id);
    listaProdutos.appendChild(produtoElemento);
  });

  // Depois de adicionar os produtos, adiciona evento nos botões
  const botoes = document.querySelectorAll('button[data-id]');
  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const idProduto = botao.dataset.id;
      adicionarAoCarrinho(idProduto);
    });
  });
}

listaDeProdutos();
