
import { useEffect, useMemo, useState } from "react";
import { X, ImagePlus, GripVertical } from "lucide-react";

interface Props {
  titulo: string;
  fotos: File[];
  onChange: (fotos: File[]) => void;
}

const GridFotos = ({ titulo, fotos, onChange }: Props) => {
  const [arrastando, setArrastando] = useState<number | null>(null);

  const previews = useMemo(
    () => fotos.map((foto) => URL.createObjectURL(foto)),
    [fotos]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const adicionarFotos = (arquivos: FileList | null) => {
    if (!arquivos) return;

    const novasFotos = Array.from(arquivos).filter((arquivo) =>
      arquivo.type.startsWith("image/")
    );

    onChange([...fotos, ...novasFotos]);
  };

  const excluirFoto = (index: number) => {
    onChange(fotos.filter((_, i) => i !== index));
  };

  const reordenarFotos = (destino: number) => {
    if (arrastando === null || arrastando === destino) return;

    const novasFotos = [...fotos];
    const [fotoMovida] = novasFotos.splice(arrastando, 1);
    novasFotos.splice(destino, 0, fotoMovida);

    onChange(novasFotos);
    setArrastando(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-vinho text-base font-semibold">
        {titulo}
      </label>

      {/* Adicionar fotos */}
      <label
        className="flex w-fit cursor-pointer items-center gap-2
                   rounded-md border border-vinho
                   bg-[#E3E3E380] px-4 py-2
                   text-vinho text-sm font-corpo
                   hover:bg-vinho hover:text-white transition"
      >
        <ImagePlus size={16} />
        Adicionar fotos

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            adicionarFotos(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {/* Grid de fotos */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto, index) => (
            <div
              key={`${foto.name}-${foto.size}-${foto.lastModified}-${index}`}
              draggable
              onDragStart={() => setArrastando(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => reordenarFotos(index)}
              onDragEnd={() => setArrastando(null)}
              className={`relative overflow-hidden rounded-lg
                          border border-vinho bg-[#E3E3E380]
                          cursor-grab active:cursor-grabbing
                          ${arrastando === index ? "opacity-40" : ""}`}
            >
              {/* Foto */}
              <img
                src={previews[index]}
                alt={`Foto ${index + 1}: ${foto.name}`}
                className="w-full aspect-square object-cover"
              />

              {/* Ordem e indicador de arrastar */}
              <div className="absolute top-2 left-2 flex items-center
                              gap-1 rounded-md bg-[#E3E3E380]
                              px-2 py-1 text-vinho text-sm font-semibold">
                <GripVertical size={16} />
                {index + 1}
              </div>

              {/* Excluir */}
              <button
                type="button"
                onClick={() => excluirFoto(index)}
                className="absolute top-2 right-2 flex items-center
                           justify-center rounded-full
                           bg-[#E3E3E380] text-vinho
                           hover:bg-vinho hover:text-white
                           transition p-1"
                aria-label={`Excluir ${foto.name}`}
              >
                <X size={18} />
              </button>

              {/* Nome */}
              <div className="bg-[#E3E3E380] px-2 py-2">
                <p className="truncate text-sm text-vinho">
                  {foto.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GridFotos;
