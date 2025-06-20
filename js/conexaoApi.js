async function conexaoProdutos() {
    const conexao = await fetch('http://localhost:3000/produtos');
    const conexaoConvertida = await conexao.json();
    return conexaoConvertida;
}

async function conexaoCadastros() {
    const conexao = await fetch('http://localhost:3000/cadastros');
    const conexaoConvertida = await conexao.json();
    return conexaoConvertida;
}

async function cadastrarDados(dados) {
    const conexao = await fetch('http://localhost:3000/cadastros', {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });
    const resposta = await conexao.json();
    return resposta;
}

async function anunciarProdutos(idDono, titulo, preco, imagem){
    const conexao = await fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify({
            idDono: idDono,
            titulo: titulo,
            preco: preco,
            imagem: imagem
        })
    });
    const conexaoConvertida = await conexao.json();
    return conexaoConvertida;
}


async function buscarProduto(termoBusca) {
    const conexao = await fetch(`http://localhost:3000/produtos?q=${termoBusca}`);
    const conexaoConvertida = await conexao.json();
    
    return conexaoConvertida;
}

export const conexaoApi = {
    conexaoProdutos,
    conexaoCadastros,
    cadastrarDados,
    anunciarProdutos,
    buscarProduto
}