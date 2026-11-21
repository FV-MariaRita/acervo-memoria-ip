import { useEffect, useState } from "react";
import type {EntrevistadorLista, EntrevistadorUpdate,} from "../types/entrevistador";

import { Save, X, ImagePlus, Pencil } from "lucide-react";

interface CardEntrevistadorProps extends EntrevistadorLista {
  modoEdicao?: boolean;
  onSalvar?: (id: number, dados: EntrevistadorUpdate, foto: File | null) => Promise<void>;
  onExcluir?: (id: number) => Promise<void>;
}

const CardEntrevistador = ({id, nome, bio, path_foto, modoEdicao = false, onSalvar, onExcluir}: CardEntrevistadorProps) => {

  const [editando, setEditando] = useState(false);

  const [nomeEditado, setNomeEditado] = useState(nome);
  const [bioEditada, setBioEditada] = useState(bio);
  const [fotoEditada, setFotoEditada] = useState<File | null>(null);

  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  
  useEffect(() => {
    setNomeEditado(nome);
    setBioEditada(bio);
  }, [nome, bio]);

 
  const [preview, setPreview] = useState(path_foto);

  useEffect(() => {
    if (!fotoEditada) {
      setPreview(path_foto);
      return;
    }

    const urlFoto = URL.createObjectURL(fotoEditada);
    setPreview(urlFoto);

    return () => URL.revokeObjectURL(urlFoto);
  }, [fotoEditada, path_foto]);

  const cancelar = () => {
    setNomeEditado(nome);
    setBioEditada(bio);
    setFotoEditada(null);
    setEditando(false);
  };

  const salvarEdicao = async () => {
    if (!onSalvar)
      return;

    try {
      setSalvando(true);

      await onSalvar(
        id,
        {
          nome: nomeEditado.trim(),
          bio: bioEditada.trim(),
        },
        fotoEditada
      );

      setFotoEditada(null);
      setEditando(false);

    } catch (erro) {
      console.error("Erro ao atualizar entrevistador:", erro);
      alert("Não foi possível atualizar os dados do entrevistador.");
    } finally {
      setSalvando(false);
    }
  };

  const excluirEntrevistador = async () => {
    if (!onExcluir) 
      return;

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o entrevistador ${nome}?`
    );

    if (!confirmar) return;

    try {
      setExcluindo(true);
      await onExcluir(id);

    } catch (erro) {
      console.error("Erro ao excluir entrevistador:", erro);
      alert("Não foi possível excluir o entrevistador.");
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-6 w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">

        <div className="flex flex-col items-center gap-2 shrink-0">
          <img
            src={preview}
            alt={nomeEditado}
            className="rounded-2xl object-cover w-32 h-40 sm:w-36 sm:h-48"
          />

          {editando && (
            <>
              <label
                htmlFor={`foto-${id}`}
                className="cursor-pointer flex items-center gap-2 text-sm text-vinho hover:text-ocre transition"
              >
                <ImagePlus size={16} />
                Alterar foto
              </label>

              <input
                id={`foto-${id}`}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  setFotoEditada(e.target.files?.[0] ?? null);
                }}
              />
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full text-center sm:text-left">

          {editando ? (
            <>
              <input
                type="text"
                value={nomeEditado}
                onChange={(e) => setNomeEditado(e.target.value)}
                maxLength={100}
                className="w-full rounded-lg border-2 border-vinho/70 bg-white/50 px-3 py-1 font-semibold text-lg text-grafite"
              />

              <textarea
                value={bioEditada}
                onChange={(e) => setBioEditada(e.target.value)}
                rows={5}
                className="w-full text-justify rounded-lg border border-vinho/70 bg-white/50 px-3 py-2 text-sm text-grafite resize-y"
              />
            </>
          ) : (
            <>
              <h3 className="font-semibold text-lg text-grafite">
                {nome}
              </h3>

              <p className="text-sm font-corpo text-grafite text-justify leading-relaxed">
                {bio}
              </p>
            </>
          )}
        </div>
      </div>

      {modoEdicao && (
        <div className="flex flex-wrap justify-between items-center gap-2 w-full">

          {editando ? (
            <>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={salvarEdicao}
                  disabled={
                    salvando ||
                    excluindo ||
                    !nomeEditado.trim() ||
                    !bioEditada.trim()
                  }
                  className="flex items-center gap-2 rounded-lg bg-ocre px-2 py-1 text-white hover:bg-ocre-hover disabled:opacity-50"
                >
                  <Save size={16} />
                  {salvando ? "Salvando..." : "Salvar"}
                </button>

                <button
                  type="button"
                  onClick={cancelar}
                  disabled={salvando || excluindo}
                  className="flex items-center gap-2 rounded-lg border border-vinho px-2 py-1 text-vinho hover:bg-vinho/10"
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditando(true)}
              disabled={excluindo}
              className="flex items-center gap-2 rounded-lg bg-ocre px-2 py-1 text-white hover:bg-ocre-hover disabled:opacity-50"
            >
              <Pencil size={16} />
              Editar
            </button>
          )}

          <button
            type="button"
            onClick={excluirEntrevistador}
            disabled={salvando || excluindo}
            className="flex items-center gap-2 rounded-lg bg-vinho px-2 py-1 text-white hover:bg-vinho-hover disabled:opacity-50"
          >
            <X size={16} />
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>

        </div>
      )}
    </div>
  );
};

export default CardEntrevistador;