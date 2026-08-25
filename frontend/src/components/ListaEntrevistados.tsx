import { useEffect, useState } from "react";
import CardEntrevistado from "./CardEntrevistado";

interface Entrevistado {
    id: number; 
    nome: string; 
    foto: string;
    ocupacao: string; 
    detalhes: string;
    dataNasc: string;
}

const ListaEntrevistados = () => {
    const [entrevistados, setEntrevistados] = useState<Entrevistado[]>([]); 

    useEffect(() => {
        fetch('url')
            .then((response) => response.json())
            .then((data) => {
                setEntrevistados(data);
            })

            .catch((error) => {
                console.error('Erro na busca por entrevistados: ', error);
            });
        
    }, []);

    if (entrevistados.length !== 0) {
        return (
           <div className="flex flex-col gap-4 w-full max-w-xl px-4 justify-items-center">

            {entrevistados.map((item) => (

                <CardEntrevistado 
                    key={item.id}
                    nome={item.nome}
                    foto={item.foto}
                    ocupacao={item.ocupacao}
                    detalhes={item.detalhes}
                    dataNasc={item.dataNasc}
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

        const dados: Entrevistado[] = [
            {
                id: 1,
                nome: "Maria Rita",
                foto: "/src/images/maria.jpeg", 
                ocupacao: "Estudante de BCC",
                detalhes: "USP ICMC",
                dataNasc: "13/12/2007"
            },
            {
                id: 2,
                nome: "Anna Waldheim",
                foto: "/src/images/anna.jpeg", 
                ocupacao: "Estudante de BCC",
                detalhes: "UFRJ",
                dataNasc: "07/01/2008"
            }, 
            {
                id: 3,
                nome: "Victor Hugo Adão",
                foto: "/src/images/victor.jpeg",
                ocupacao: "Estudante de BCC",
                detalhes: "USP ICMC",
                dataNasc: "07/11/2006"
            },
            {
                id: 4,
                nome: "João Ripper",
                foto: "/src/images/ripper.jpg", 
                ocupacao: "Fotógrafo",
                detalhes: "Pedagogia do Bem Querer",
                dataNasc: "06/05/1953"
            }
        ];  

        setEntrevistados(dados);

*/