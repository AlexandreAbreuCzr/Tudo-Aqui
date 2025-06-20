import { conexaoApi } from "./conexaoApi.js";

document.addEventListener('DOMContentLoaded', () => {
    const logado = localStorage.getItem('logado') === 'true';
  
    if (logado) {
      window.location.href = '/Tudo-Aqui/index.html';
    }
  });

const form = document.querySelector('[data-form]');
const erro = document.querySelector('[data-erro]');

form.addEventListener('submit', verificarValores);

async function verificarValores(event) {
    event.preventDefault();

    const nomeForm = document.getElementById('nome').value;
    const emailForm = document.getElementById('email').value;
    const nascimentoForm = document.getElementById('nascimento').value;
    const senhaForm = document.getElementById('senha').value;
    const confSenhaForm = document.getElementById('confSenha').value;
    const hoje = new Date();
    const data = new Date(nascimentoForm);
    const cadastros = await conexaoApi.conexaoCadastros();
    const emailExiste = cadastros.some(cadastro => cadastro.email === emailForm);

    // Verifica tamanho do nome
    if (nomeForm.length > 30) {
        erro.textContent = 'O Nome deve conter no máximo 30 caracteres';
        return;
    }

    if(emailExiste){
        erro.textContent = 'O Email Já está sendo usado';
        return;
    }

    if(nascimentoForm > hoje){
        erro.textContent = 'Você é um viajante do tempo?';
        return;
    }

    if (!temMaisDe16Anos(nascimentoForm)) {
        erro.textContent = 'Você precisa ter mais de 16 anos para se cadastrar.';
        return;
    }
    

    // Verifica se senhas conferem
    if (senhaForm !== confSenhaForm) {
        erro.textContent = 'As senhas não conferem';
        return;
    }

    erro.textContent = ''; // limpa erros anteriores

    await adicionarValores(nomeForm, emailForm, nascimentoForm, senhaForm);
}

async function adicionarValores(nome, email, nascimento, senha) {
    // Exemplo de envio com sua API (ajuste se necessário)
    await conexaoApi.cadastrarDados({
        nome,
        email,
        nascimento,
        senha,
        imagem: "/Tudo-Aqui/imgs/user.png"
    });

    alert('Cadastro enviado com sucesso!');
    form.reset();
}


function temMaisDe16Anos(dataNascimentoString) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimentoString);
  
    // Calcula a diferença de anos
    let idade = hoje.getFullYear() - nascimento.getFullYear();
  
    // Ajusta se ainda não fez aniversário esse ano
    const mesHoje = hoje.getMonth();
    const diaHoje = hoje.getDate();
  
    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();
  
    if (mesHoje < mesNascimento || (mesHoje === mesNascimento && diaHoje < diaNascimento)) {
      idade--;
    }
  
    return idade >= 16;
  }
  