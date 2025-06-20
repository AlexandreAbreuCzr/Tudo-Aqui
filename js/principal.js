import { conexaoApi } from "./conexaoApi.js";

const entrar = document.querySelector('[data-entrar]');
const formBusca = document.querySelector('[data-formPesquisa]');

formBusca.addEventListener('submit', function(evento){
    evento.preventDefault(); // impede recarregamento

    const dadosBusca = document.querySelector('[data-pesquisa]').value.trim();

    if (dadosBusca) {
        // redireciona com o termo na URL
        window.location.href = `/Paginas/busca.html?busca=${encodeURIComponent(dadosBusca)}`;
    }
});

async function mudaFoto() {
    const logado = localStorage.getItem('logado');

    if (logado === 'true') {
        const id = localStorage.getItem('id');
        const usuarios = await conexaoApi.conexaoCadastros();
        const usuario = usuarios.find(u => u.id == id);

        if (usuario && entrar) {
            entrar.innerHTML = `<img src="${usuario.imagem}" alt="${usuario.nome}" style="width: 40px; height: 40px; border-radius: 50%;"> ${usuario.nome}`;
            entrar.href = "/Paginas/voce.html";
        }
    }
}

mudaFoto();
