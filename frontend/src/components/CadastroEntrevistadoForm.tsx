
import React, { useEffect, useState } from "react";
import { X, ImagePlus } from "lucide-react";

interface EntrevistadoCreate {
  nome: string;
  funcao: string;
  bio: string;
}

interface Props {
  onCadastroSucesso?: () => void;
}

const CadastroEntrevistadoForm = ({
  onCadastroSucesso,
}: Props) => {
  

  const [dadosEntrevistado, setDadosEntrevistado] =
    useState<EntrevistadoCreate>({
      nome: "",
      funcao: "",
      bio: "",
    });

  const [foto, setFoto] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!foto) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(foto);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [foto]);

  const atualizarCampo = (
    campo: keyof EntrevistadoCreate,
    valor: string
  ) => {
    setDadosEntrevistado((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!foto) {
      alert("Selecione uma foto do entrevistado.");
      return;
    }

    const formData = new FormData();

    formData.append(
      "dados",
      JSON.stringify(dadosEntrevistado)
    );

    formData.append("arquivo", foto);

    try {
      setEnviando(true);

      const resposta = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/entrevistados`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!resposta.ok) {
        const erro = await resposta.json();

        throw new Error(
          erro.detail
            ? JSON.stringify(erro.detail)
            : "Erro ao cadastrar entrevistado."
        );
      }

      const resultado = await resposta.json();

      console.log("Entrevistado cadastrado:", resultado);

      alert("Entrevistado cadastrado com sucesso!");

      setDadosEntrevistado({
        nome: "",
        funcao: "",
        bio: "",
      });

      setFoto(null);

      onCadastroSucesso?.();

    } catch (erro) {
      console.error("Erro no cadastro:", erro);

      alert(
        erro instanceof Error
          ? erro.message
          : "Não foi possível cadastrar o entrevistado."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[1000px] flex flex-col gap-6"
      >

        <section className="flex flex-col gap-4">

          
            <>
              {/* Nome */}
              <div className="flex flex-col gap-1">
                <label className="px-2 font-semibold text-vinho text-m">
                  Nome:
                </label>

                <div className="flex items-center rounded-xl
                                border border-vinho/70 w-full
                                bg-[#E3E3E380] px-3 py-2">
                  <input
                    type="text"
                    name="nome"
                    value={dadosEntrevistado.nome}
                    onChange={(e) =>
                      atualizarCampo("nome", e.target.value)
                    }
                    required
                    maxLength={100}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Função */}
              <div className="flex flex-col gap-1">
                <label className="px-2 font-semibold text-vinho text-m">
                  Função:
                </label>

                <div className="flex items-center rounded-xl
                                border border-vinho/70 w-full
                                bg-[#E3E3E380] px-3 py-2">
                  <input
                    type="text"
                    name="funcao"
                    value={dadosEntrevistado.funcao}
                    onChange={(e) =>
                      atualizarCampo("funcao", e.target.value)
                    }
                    required
                    maxLength={100}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Biografia */}
              <div className="flex flex-col gap-1">
                <label className="px-2 font-semibold text-vinho text-m">
                  Biografia:
                </label>

                <div className="flex rounded-xl border border-vinho/70
                                w-full bg-[#E3E3E380] px-3 py-2">
                  <textarea
                    name="bio"
                    value={dadosEntrevistado.bio}
                    onChange={(e) =>
                      atualizarCampo("bio", e.target.value)
                    }
                    required
                    rows={6}
                    className="w-full bg-transparent outline-none
                               resize-y"
                  />
                </div>
              </div>

              {/* Foto */}
              <div className="flex flex-col gap-2">
                <label className="px-2 font-semibold text-vinho text-m">
                  Foto do entrevistado:
                </label>

                <div className="flex flex-col sm:flex-row
                                items-start gap-4">

                  <label
                    htmlFor="foto-entrevistado"
                    className="cursor-pointer shrink-0 flex
                               items-center gap-2 rounded-md
                               border border-vinho
                               bg-[#E3E3E380] px-4 py-2
                               text-vinho font-corpo text-sm
                               hover:bg-vinho hover:text-white
                               transition"
                  >
                    <ImagePlus size={18} />
                    Escolher foto
                  </label>

                  <span className="text-sm text-gray-500 truncate">
                    {foto?.name ?? "Nenhum arquivo"}
                  </span>

                  <input
                    id="foto-entrevistado"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) =>
                      setFoto(e.target.files?.[0] ?? null)
                    }
                  />
                </div>

                {preview && (
                  <div className="relative w-40 aspect-square
                                  overflow-hidden rounded-lg
                                  border border-vinho bg-[#E3E3E380]">

                    <img
                      src={preview}
                      alt="Prévia da foto do entrevistado"
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => setFoto(null)}
                      className="absolute top-2 right-2
                                 rounded-full p-1
                                 bg-[#E3E3E380] text-vinho
                                 hover:bg-vinho hover:text-white
                                 transition"
                      aria-label="Excluir foto"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Botão */}
              <div className="flex w-full text-brancoPapel
                              text-m font-corpo font-semibold
                              justify-center items-center">

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-35 h-7 text-center rounded
                             hover:bg-ocre-hover bg-ocre
                             justify-center items-center flex
                             disabled:opacity-50"
                >
                  {enviando ? "Enviando..." : "Cadastrar"}
                </button>
              </div>
            </>
         

        </section>
      </form>
    </div>
  );
};

export default CadastroEntrevistadoForm;
