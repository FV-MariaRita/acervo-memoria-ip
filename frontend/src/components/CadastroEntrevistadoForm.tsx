import React, { useEffect, useState } from "react";
import type { EntrevistadoCreate } from "../types/entrevistado";
import { ImagePlus, X } from "lucide-react";
import BotaoOcre from "./buttons/BotaoOcre";
import ContadorCaracteres from "./utils/ContadorCaracteres";

export interface dadosEntrevistadoForm {
  dados: EntrevistadoCreate;
  foto: File;
}

interface Props {
  bloqueado?: boolean;
  confirmado?: boolean;
  onConfirmarDados: (payload: dadosEntrevistadoForm) => void;
}

const CadastroEntrevistadoForm = ({bloqueado = false, confirmado = false, onConfirmarDados}: Props) => {

  const [dadosEntrevistado, setDadosEntrevistado] = useState<EntrevistadoCreate>({
    nome: "",
    funcao: "",
    bio: "",
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  useEffect(() => {

    if (!foto) {
      setPreviewFoto(null);
      return;
    }

    const url = URL.createObjectURL(foto);
    setPreviewFoto(url);

    return () => URL.revokeObjectURL(url);
  }, [foto]);

  const atualizarCampo = (campo: keyof EntrevistadoCreate, valor: string) => {

    setDadosEntrevistado((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!foto) {
      alert("Selecione uma foto do entrevistado.");
      return;
    }

    onConfirmarDados({dados: dadosEntrevistado, foto});
  };

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col items-center px-4">

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
        <fieldset
          disabled={bloqueado}
          className={`flex flex-col gap-4 transition-opacity ${
            bloqueado ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {/*nome*/}
          <div className="flex flex-col gap-1">
            <label className="px-2 font-semibold text-vinho text-md">
              Nome:
            </label>

            <div className="flex items-center rounded-xl border bg-[#E3E3E380] border-vinho/70 w-full px-3 py-2">
              <input
                type="text"
                name="nome"
                value={dadosEntrevistado.nome}
                onChange={(e) => atualizarCampo("nome", e.target.value)}
                required
                maxLength={100}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/*função*/}
          <div className="flex flex-col gap-1">

            <label className="px-2 font-semibold text-vinho text-m">
              Função:
            </label>

            <div className="flex items-center rounded-xl border bg-[#E3E3E380] border-vinho/70 w-full px-3 py-2">
              <input
                type="text"
                name="funcao"
                value={dadosEntrevistado.funcao}
                onChange={(e) => atualizarCampo("funcao", e.target.value)}
                required
                maxLength={30}
                className="w-full bg-transparent outline-none"
              />
            </div>

            <div className="flex justify-end px-2">
              <ContadorCaracteres valor={dadosEntrevistado.funcao} limite={30} />
            </div>
          </div>

          {/*bio*/}
          <div className="flex flex-col gap-1">

            <label className="px-2 font-semibold text-vinho text-m">
              Biografia:
            </label>
            
            <div className="flex rounded-xl border border-vinho/70 w-full bg-[#E3E3E380] px-3 py-2">
              <textarea
                name="bio"
                value={dadosEntrevistado.bio}
                onChange={(e) => atualizarCampo("bio", e.target.value)}
                required
                rows={6}
                maxLength={300}
                className="w-full bg-transparent outline-none resize-y"
              />
            </div>
            <div className="flex flex-col justify-end px-2">
              <ContadorCaracteres valor={dadosEntrevistado.bio} limite={300} />
            </div>
          </div>

          {/*foto*/}
          <div className="flex flex-col gap-2">
            <label className="px-2 font-semibold text-vinho text-m">
              Foto do entrevistado:
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label
                htmlFor="foto-entrevistado"
                className="cursor-pointer shrink-0 flex items-center gap-2 rounded-md border border-vinho bg-[#E3E3E380] px-4 py-2 text-vinho font-corpo text-sm hover:bg-vinho hover:text-white transition"
              >
                <ImagePlus size={18} />
                Escolher foto
              </label>

              <span className="text-sm text-gray-500 truncate">
                {foto?.name ?? "Nenhum arquivo enviado"}
              </span>

              <input
                id="foto-entrevistado"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {previewFoto && (
            <div className="relative w-40 aspect-square overflow-hidden rounded-lg border border-vinho bg-[#E3E3E380]">
              <img
                src={previewFoto}
                alt={`Prévia da foto de ${dadosEntrevistado.nome}`}
                className="w-full h-full object-cover"
              />

              {!bloqueado && (
                <button
                  type="button"
                  onClick={() => setFoto(null)}
                  className="absolute top-2 right-2 rounded-full p-1 bg-[#E3E3E380] text-vinho hover:bg-vinho hover:text-white transition"
                  aria-label="Excluir foto"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          )}

          {!bloqueado && (
            <div className="flex w-full text-brancoPapel text-m font-corpo font-semibold justify-center items-center mt-2">

              <BotaoOcre tipo="submit">
                {confirmado ? "Atualizar e continuar" : "Continuar"}
              </BotaoOcre>
            </div>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default CadastroEntrevistadoForm;