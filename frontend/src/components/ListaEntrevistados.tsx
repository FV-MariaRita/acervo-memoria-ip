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

           <div className="flex flex-col items-center gap-4 w-full max-w-xl px-4">

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
                nome: "Ratão Diniz",
                foto: "/src/images/ratao.jpg", 
                ocupacao: "Fotógrafo",
                detalhes: "EFP 2004",
                dataNasc: "xx/xx/xxxx"
            },
            {
                id: 2,
                nome: "Elisângela Leite",
                foto: "/src/images/elisangela.jpg", 
                ocupacao: "Fotógrafa",
                detalhes: "EFP 2007",
                dataNasc: "24/03/1974"
            }, 
            {
                id: 3,
                nome: "Patrícia Dias",
                foto: "/src/images/patricia.jpg",
                ocupacao: "Fotógrafa",
                detalhes: "EFP 2023",
                dataNasc: "25/06/1976"
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