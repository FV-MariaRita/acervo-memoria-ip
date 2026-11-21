import { useEffect, useState } from "react";
import type {EntrevistadorLista, EntrevistadorUpdate} from "../types/entrevistador";

import CardEntrevistador from "./CardEntrevistador";
import {atualizarEntrevistador, listarEntrevistadores, excluirEntrevistador} from "../services/entrevistador";

interface ListaEntrevistadoresProps {
  modoEdicao?: boolean;
}

const ListaEntrevistadores = ({modoEdicao = false}: ListaEntrevistadoresProps) => {

  const [entrevistadores, setEntrevistadores] = useState<EntrevistadorLista[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {

    listarEntrevistadores()
      .then(setEntrevistadores)
      .catch((error: unknown) => {
        console.error("Erro na busca por entrevistadores:", error);
        setErro("Não foi possível carregar entrevistadores");
      })
      .finally(() => setCarregando(false));

  }, []);

  const editarEntrevistador = async (id: number, dados: EntrevistadorUpdate, foto: File | null) => {

    await atualizarEntrevistador(id, dados, foto);

    const atualizados = await listarEntrevistadores();
    setEntrevistadores(atualizados);
  };

  const excluir = async (id: number) => {
    await excluirEntrevistador(id);

    setEntrevistadores((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  if (carregando) {

    return (
      <p className="p-4 text-center text-vinho font-semibold">
        Carregando entrevistadores...
      </p>
    );
  }

  if (erro) {
    return (
      <p className="p-4 text-center text-vinho font-semibold">
        {erro}
      </p>
    );
  }

  if (entrevistadores.length === 0) {
    return (
      <p className="p-4 text-center text-vinho font-semibold">
        Nenhum entrevistador encontrado.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto px-4 pb-4">
      {entrevistadores.map((item) => (
        <CardEntrevistador
          key={item.id}
          {...item}
          modoEdicao={modoEdicao}
          onSalvar={editarEntrevistador}
          onExcluir={excluir}
        />
      ))}
    </div>
  );
};

export default ListaEntrevistadores;