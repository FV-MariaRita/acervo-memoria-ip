import { useEffect, useState } from "react";
import type { EntrevistadoLista } from "../types/entrevistado";
import CardEntrevistado from "./CardEntrevistado";
import { listarEntrevistados } from "../services/entrevistados";

import { Link } from "react-router-dom";

const ListaEntrevistados = () => {
    
    const [entrevistados, setEntrevistados] = useState<EntrevistadoLista[]>([]); 
    const [carregando, setCarregando] = useState(true); 
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        
        listarEntrevistados()
            .then((data) => {
                setEntrevistados(data);
            })

            .catch((error: unknown) => {
                console.error('Erro na busca por entrevistados: ', error);
                setErro("Não foi possível carregar entrevistados");
            }) 

            .finally(() => {
                setCarregando(false);
            })
        
    }, []);

    if (carregando) {
        return <p className="p-4 text-center text-vinho font-semibold">Carregando entrevistados...</p>;
    }

    if (erro) {
        return <p className="p-4 text-center text-vinho font-semibold">{erro}</p>;
    }

    if (entrevistados.length === 0) {
        return <p className="p-4 text-center text-vinho font-semibold">Nenhum entrevistado encontrado.</p>;
    }

    else {
       
        return (

           <div className="flex flex-col items-center gap-4 w-full max-w-xl px-4">

            {entrevistados.map((item) => (

                <Link to={`/entrevistados/${item.id}`} className="w-full">

                    <CardEntrevistado 
                        key={item.id}
                        id={item.id}
                        nome={item.nome}
                        path_foto={item.path_foto}
                        funcao={item.funcao}
                    />
                </Link>
                
            ))}
           </div>
        );
    }

    return null; 
};

export default ListaEntrevistados;



/*
DADOS LOCAIS PARA EFEITO DE TESTE

    import rataoImg from "../images/ratao.jpg";
    import elisangelaImg from "../images/elisangela.jpg";
    import patriciaImg from "../images/patricia.jpg";
    import ripperImg from "../images/ripper.jpg";   
    
    --> colocar esse código dentro do useEffect

    const dados: EntrevistadoLista[] = [
            {
                nome: "Ratão Diniz",
                path_foto: rataoImg, 
                funcao: "Fotógrafo",
            },
            {
                nome: "Elisângela Leite",
                path_foto: elisangelaImg, 
                funcao: "Fotógrafa",
            }, 
            {
                nome: "Patrícia Dias",
                path_foto: patriciaImg,
                funcao: "Fotógrafa",
            },
            {
                nome: "João Ripper",
                path_foto: ripperImg, 
                funcao: "Fotógrafo",
            }
        ];  

        setEntrevistados(dados); 
*/