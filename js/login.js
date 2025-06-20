import { conexaoApi } from "./conexaoApi.js";

const form = document.querySelector('[data-form]');
const erro = document.querySelector('[data-erro]');

document.addEventListener('DOMContentLoaded', () => {
  const logado = localStorage.getItem('logado') === 'true';

  if (logado) {
    window.location.href = '/index.html';
  }
});

form.addEventListener('submit', verificarLogin);

async function verificarLogin(event) {
  event.preventDefault();

  const emailForm = document.getElementById('email').value;
  const senhaForm = document.getElementById('senha').value;

  const cadastros = await conexaoApi.conexaoCadastros();

  // Procura usuário com esse e-mail
  const usuario = cadastros.find(cadastro => cadastro.email === emailForm);

  if (!usuario) {
    erro.textContent = 'E-mail não encontrado';
    return;
  }

  if (usuario.senha !== senhaForm) {
    erro.textContent = 'Senha incorreta';
    return;
  }

  erro.textContent = '';
  alert('Login bem-sucedido!');

  // Depois que validar o login com sucesso:
  localStorage.setItem('logado', 'true');
  localStorage.setItem('id', usuario.id); // salva só o ID do usuário
  window.location.href = '/index.html';
  // Aqui você pode redirecionar, salvar login no localStorage etc.
  // window.location.href = "pagina-logada.html";
}
