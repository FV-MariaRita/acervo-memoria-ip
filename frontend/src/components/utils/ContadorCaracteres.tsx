interface ContadorProps {
    valor: string
    limite: number 
    limiteAmarelo?: number
}

const ContadorCaracteres = ({valor, limite, limiteAmarelo = .9}: ContadorProps ) => {

    const quantidade = valor.length; 
    const percentual = quantidade / limite; 

    const estiloContador = 
        percentual >= limiteAmarelo
            ? "text-ocre"
            : "text-grafite" 
    
    
    return (
        <p className={`text-sm text-right text-grafite-80 ${estiloContador}`}>
            {quantidade} / {limite} caracteres
        </p>
    )        

}


export default ContadorCaracteres;