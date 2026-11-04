import type { SolicitacaoLista} from "../types/solicitacao";
import { apiFetch } from "./api";

// public

export function listarSolicitacoes(): Promise<SolicitacaoLista[]> {
    return (
        apiFetch<SolicitacaoLista[]>("/solicitacoes")
    );
}
