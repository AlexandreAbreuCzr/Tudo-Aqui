import { conexaoApi } from "./conexaoApi.js";

const trocarFotoBtn = document.getElementById('trocar-foto');
const campoEndereco = document.querySelector('.campo-endereco');
const inputEndereco = document.getElementById('input-endereco');
const salvarEndereco = document.getElementById('salvar-endereco');
const fotoPerfil = document.getElementById('foto-perfil');
const nomePerfil = document.getElementById('nome-perfil');
const id = localStorage.getItem('id');
document.addEventListener('DOMContentLoaded', () => {
    const logado = localStorage.getItem('logado') === 'true';
    
    if (!logado) {
      window.location.href = '/Paginas/cadastro.html';
    }
  });
  

// Mostra campo para digitar nova imagem
trocarFotoBtn.addEventListener('click', () => {
    campoEndereco.style.display = 'flex';
    inputEndereco.focus();
});

// Salva imagem nova no JSON Server e atualiza na tela
salvarEndereco.addEventListener('click', async () => {
    const novaImagem = inputEndereco.value.trim();
    
    if (!novaImagem) {
    alert('Digite um link de imagem válido.');
    return;
}

try {
    await fetch(`http://localhost:3000/cadastros/${id}`, {
        method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagem: novaImagem })
    });
    
    fotoPerfil.src = novaImagem;
    inputEndereco.value = '';
    campoEndereco.style.display = 'none';
    alert('Imagem atualizada com sucesso!');
} catch (error) {
    alert('Erro ao atualizar imagem. Verifique o link e tente novamente.');
}
});

// Mostra os dados da pessoa logada ao abrir a página
(async () => {
    const usuarios = await conexaoApi.conexaoCadastros();
    const usuario = usuarios.find(u => u.id == id);
    const dataTitulo = document.querySelector('[data-titulo]');
    if (usuario) {
        dataTitulo.textContent = `Tudo Aqui - ${usuario.nome}`
        fotoPerfil.src = usuario.imagem || '/imgs/user.png';
    nomePerfil.textContent = usuario.nome || 'Nome não informado';
}
})();


const botaoSair = document.getElementById('botao-sair');
botaoSair.addEventListener('click', deslogar);
function deslogar() {
    const resposta = confirm('Deseja realmente sair?');
    if (resposta) {
        localStorage.removeItem('logado');
        localStorage.removeItem('id');
        window.location.href = '/index.html';
    }
}