import type { EntrevistadorLista } from "../types/entrevistador";

const CardEntrevistador = ({ nome, bio, path_foto }: EntrevistadorLista) => {

  return (

    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-6 w-full max-w-2xl">
      <img
        src={path_foto}
        alt={nome}
        className="rounded-2xl object-cover w-32 h-40 sm:w-36 sm:h-48 shrink-0 border border-solid"
      />

      <div className="flex flex-col gap-2 w-full text-center sm:text-left">
        <h3 className="font-semibold text-lg text-grafite">{nome}</h3>
        <p className="text-sm font-corpo text-grafite text-left leading-relaxed">
          {bio}
        </p>
      </div>
    </div>
  );
};

export default CardEntrevistador;