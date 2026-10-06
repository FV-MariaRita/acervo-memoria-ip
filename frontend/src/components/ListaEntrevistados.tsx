import { useEffect, useState } from "react";
import { listarEntrevistados } from "../services/entrevistados";
import type { EntrevistadoLista } from "../types/entrevistado";
import CardEntrevistado from "./CardEntrevistado";



const ListaEntrevistados = () => {
    
    const [entrevistados, setEntrevistados] = useState<EntrevistadoLista[]>([]); 

    useEffect(() => {
        
        listarEntrevistados()
            .then((data) => {
                setEntrevistados(data);
            })

            .catch((error) => {
                console.error('Erro na busca por entrevistados: ', error);
            });
        
    }, []);

    if (entrevistados.length !== 0) {
       
        return (

           <div className="flex flex-col items-center gap-4 w-full max-w-xl px-4">

            {entrevistados.map((item) => (

                <CardEntrevistado 
                    key={item.nome}
                    nome={item.nome}
                    path_foto={item.path_foto}
                    funcao={item.funcao}
                />
            ))}
           </div>
        );
    }

    return null; 
};

export default ListaEntrevistados;



/*
DADOS LOCAIS PARA EFEITO DE TESTE 
--> colocar esse código dentro do useEffect

        const dados: EntrevistadoLista[] = [
            {
                nome: "Ratão Diniz",
                path_foto: "/src/images/ratao.jpg", 
                funcao: "Fotógrafo",
            },
            {
                nome: "Elisângela Leite",
                path_foto: "/src/images/elisangela.jpg", 
                funcao: "Fotógrafa",
            }, 
            {
                nome: "Patrícia Dias",
                path_foto: "/src/images/patricia.jpg",
                funcao: "Fotógrafa",
            },
            {
                nome: "João Ripper",
                path_foto: "/src/images/ripper.jpg", 
                funcao: "Fotógrafo",
            }
        ];  

        setEntrevistados(dados);

*/