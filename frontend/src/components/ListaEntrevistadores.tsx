import { useEffect, useState } from "react";
import type { EntrevistadorLista } from "../types/entrevistador";
import CardEntrevistador from "./CardEntrevistador";
import { listarEntrevistadores } from "../services/entrevistador";

const ListaEntrevistadores = () => {
    
    const [entrevistadores, setEntrevistadores] = useState<EntrevistadorLista[]>([]); 
    const [carregando, setCarregando] = useState(true); 
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        
        listarEntrevistadores()
            .then((data) => {
                setEntrevistadores(data);
            })

            .catch((error: unknown) => {
                console.error('Erro na busca por entrevistadores: ', error);
                setErro("Não foi possível carregar entrevistadores");
            }) 

            .finally(() => {
                setCarregando(false);
            })
        
    }, []);

    if (carregando) {
        return <p className="p-4 text-center text-vinho font-semibold">Carregando entrevistadores...</p>;
    }

    if (erro) {
        return <p className="p-4 text-center text-vinho font-semibold">{erro}</p>;
    }

    if (entrevistadores.length === 0) {
        return <p className="p-4 text-center text-vinho font-semibold">Nenhum entrevistador encontrado.</p>;
    }

    else {
       
        return (

           <div className="flex flex-col items-center gap-4 w-full max-w-xl px-4">

            {entrevistadores.map((item, index) => (
                <CardEntrevistador
                    key={index}
                    nome={item.nome}
                    bio={item.bio}
                    path_foto={item.path_foto}
                />
            ))}
           </div>
        );
    }

};

export default ListaEntrevistadores;
