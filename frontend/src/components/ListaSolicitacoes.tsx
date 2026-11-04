//import { useEffect, useState } from "react";
import type { SolicitacaoLista } from "../types/solicitacao";
import CardSolicitacao from "./CardSolicitacao";
//import { listarSolicitacoes } from "../services/solicitacoes";


const ListaSolicitacoes = () => {
  const solicitacoes: SolicitacaoLista[] = [
    {
        id: 1,
        nome: "Solicitação de acesso ao acervo",
        entrevistado: "Maria da Silva",
        data: "2026-10-15",
        path_termo: "/arquivos/termo-1.pdf",
        status: "aprovada",
    },
    {
        id: 2,
        nome: "Solicitação de entrevista",
        entrevistado: "João Santos",
        data: "2026-10-20",
        path_termo: "/arquivos/termo-2.pdf",
        status: "pendente",
    },
    {
        id: 3,
        nome: "Acesso a documentos históricos",
        entrevistado: "Ana Oliveira",
        data: "2026-10-25",
        path_termo: "/arquivos/termo-3.pdf",
        status: "recusada",
    },
    {
        id: 4,
        nome: "Solicitação de consulta",
        entrevistado: "Pedro Costa",
        data: "2026-11-01",
        path_termo: "/arquivos/termo-4.pdf",
        status: "aprovada",
    },
  ];
  
  return (
    <div className="flex flex-col items-center gap-1 w-full pb-2">
      {solicitacoes.map((item) => (
        <CardSolicitacao
          key={item.id}
          id={item.id}
          nome={item.nome}
          entrevistado={item.entrevistado}
          data={item.data}
          path_termo={item.path_termo}
          status={item.status}
        />
      ))}
    </div>
  );
};

export default ListaSolicitacoes;

/*const [solicitacoes, setSolicitacoes] = useState<SolicitacaoLista[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    listarSolicitacoes()
      .then((data) => {
        setSolicitacoes(data);
      })
      .catch((error: unknown) => {
        console.error("Erro na busca por solicitações: ", error);
        setErro("Não foi possível carregar solicitações.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return <p className="p-4 text-center text-vinho font-semibold">Carregando solicitações...</p>;
  }

  if (erro) {
    return <p className="p-4 text-center text-vinho font-semibold">{erro}</p>;
  }

  if (solicitacoes.length === 0) {
    return <p className="p-4 text-center text-vinho font-semibold">Nenhum solicitação encontrada.</p>;
  }
*/

