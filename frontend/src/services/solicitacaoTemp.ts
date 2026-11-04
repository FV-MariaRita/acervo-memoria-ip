import type { Solicitacao, SolicitacaoCreate } from "../types/solicitacao";

const STORAGE_KEY = "solicitacoes"; 

export function recuperarSolicitacoes(): Solicitacao[] {

    const dados = localStorage.getItem(STORAGE_KEY);

    return dados ? JSON.parse(dados): [];
}


export function salvarSolicitacoes(solicitacoes: Solicitacao[]) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(solicitacoes)
    );
}

//função so pra simular o tempo de atuação da API
function esperar() {
    return new Promise(resolve => setTimeout(resolve, 500));
}


export async function criarSolicitacao(
    entrevistaId: number,
    dados: SolicitacaoCreate
): Promise<Solicitacao> {

    await esperar();

    const solicitacoes = recuperarSolicitacoes();

    const cpf = dados.solicitante.cpf.replace(/\D/g, "");

    const solicitacaoExistente = solicitacoes.find(
        solicitacao =>
            solicitacao.solicitante.cpf.replace(/\D/g, "") === cpf
    );

    const solicitante = solicitacaoExistente
        ? solicitacaoExistente.solicitante
        : {
            id: Date.now(),
            ...dados.solicitante,
            cpf
        };

    const novaSolicitacao: Solicitacao = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        data: new Date().toISOString(),
        entrevista_id: entrevistaId,
        solicitante,
        mensagem: dados.mensagem || undefined,
        path_termo: undefined,
        status: "aguardando_assinatura"
    };

    solicitacoes.push(novaSolicitacao);

    salvarSolicitacoes(solicitacoes);

    return novaSolicitacao;
}


export async function buscarSolicitacao(
    id: number
): Promise<Solicitacao | undefined> {

    await esperar();

    const solicitacoes = recuperarSolicitacoes();

    return solicitacoes.find(
        solicitacao => solicitacao.id === id
    );
}


export async function enviarTermoAssinado(
    id: number,
    arquivo: File
): Promise<Solicitacao> {

    await esperar();

    if (arquivo.type !== "application/pdf") {
        throw new Error("O arquivo precisa estar no formato PDF.");
    }

    const solicitacoes = recuperarSolicitacoes();

    const indice = solicitacoes.findIndex(
        solicitacao => solicitacao.id === id
    );

    if (indice === -1) {
        throw new Error("Solicitação não encontrada.");
    }

    const solicitacao = solicitacoes[indice];

    if (solicitacao.status !== "aguardando_assinatura") {
        throw new Error("Esta solicitação não está aguardando assinatura.");
    }

    // Simula o caminho do arquivo salvo no servidor
    solicitacao.path_termo = `documentos/${id}/${arquivo.name}`;

    solicitacao.status = "pendente";

    solicitacoes[indice] = solicitacao;

    salvarSolicitacoes(solicitacoes);

    return solicitacao;
}

export async function listarSolicitacoes(): Promise<Solicitacao[]> {

    await esperar();

    return recuperarSolicitacoes();
}