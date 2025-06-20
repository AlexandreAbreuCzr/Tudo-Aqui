import { conexaoApi } from "./conexaoApi.js";

const listaProdutos = document.querySelector('[data-lista]');
const totalSpan = document.getElementById('total');
const Idlogado = localStorage.getItem('id');

async function mostrarProdutosCarrinho() {
  const usuarios = await conexaoApi.conexaoCadastros();
  const usuario = usuarios.find(u => u.id == Idlogado);
  const produtos = await conexaoApi.conexaoProdutos();

  if (!usuario || !usuario.carrinho) {
    listaProdutos.innerHTML = "<p>Carrinho vazio.</p>";
    totalSpan.textContent = "0.00";
    return;
  }

  let carrinhoIds = usuario.carrinho.split(',').map(id => parseInt(id.trim()));
  let quantidades = usuario.carrinhoQ.split(',').map(q => parseInt(q.trim()));

  listaProdutos.innerHTML = ''; // limpa carrinho antes

  let total = 0;

  carrinhoIds.forEach((id, index) => {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
      const quantidade = quantidades[index];
      total += quantidade * parseFloat(produto.preco);

      const item = document.createElement('li');
      item.classList.add('produtoCarrinho');
      item.innerHTML = `
        <img src="${produto.imagem}" alt="Imagem do produto">
        <div class="info-carrinho">
          <h3>${produto.titulo}</h3>
          <h2>R$ ${parseFloat(produto.preco).toFixed(2)}</h2>
          <input type="number" value="${quantidade}" min="1" data-index="${index}">
          <button data-index="${index}">Remover</button>
        </div>
      `;
      listaProdutos.appendChild(item);
    }
  });

  totalSpan.textContent = total.toFixed(2);
  adicionarEventos(usuarios, usuario, carrinhoIds, quantidades);
}
function adicionarEventos(usuarios, usuario, carrinhoIds, quantidades) {
    const botoesRemover = document.querySelectorAll('button[data-index]');
    const inputsQuantidade = document.querySelectorAll('input[type="number"]');
  
    botoesRemover.forEach(botao => {
      botao.addEventListener('click', async () => {
        const index = parseInt(botao.dataset.index);
        carrinhoIds.splice(index, 1);
        quantidades.splice(index, 1);
  
        await atualizarCarrinho(usuario.id, carrinhoIds, quantidades);
        mostrarProdutosCarrinho(); // recarrega
      });
    });
  
    inputsQuantidade.forEach(input => {
      input.addEventListener('change', async () => {
        const index = parseInt(input.dataset.index);
        let novaQuantidade = parseInt(input.value);
        if (novaQuantidade < 1) novaQuantidade = 1;
  
        quantidades[index] = novaQuantidade;
        await atualizarCarrinho(usuario.id, carrinhoIds, quantidades);
        mostrarProdutosCarrinho(); // recarrega
      });
    });
  }
  async function atualizarCarrinho(idUsuario, carrinhoIds, quantidades) {
    const dadosAtualizados = {
      carrinho: carrinhoIds.join(', '),
      carrinhoQ: quantidades.join(', ')
    };
  
    await fetch(`https://tudo-aqui.onrender.com/api/cadastros/${idUsuario}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosAtualizados)
    });
  }
  mostrarProdutosCarrinho(); // ISSO É ESSENCIAL
