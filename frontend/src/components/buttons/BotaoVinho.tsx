import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type VarianteBotao = "preenchido" | "borda"; 

interface BotaoPropsBase {
    children: ReactNode;
    variante?: VarianteBotao;
}

//botão comum ou submit 
interface PropsTipo extends BotaoPropsBase {
    tipo?: "button" | "submit" | "reset";
    onClick?: () => void;
    to?: never;
    disabled?: boolean
}

interface PropsLink extends BotaoPropsBase {
    tipo: "link";
    to: string;
    onCLick?: () => void;
}

type BotaoProps = PropsTipo | PropsLink;

const BotaoVinho = (props: BotaoProps) => {

    const {children, variante = "preenchido"} = props;

    const estiloBase = `
        w-64 min-h-12 h-auto px-4 py-2
        flex items-center justify-center text-center
        whitespace-normal break-words
        rounded-xl font-title tracking-wide font-light
        text-base transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
    `; 

    const estilosVariante = {
        preenchido: `
            bg-vinho text-branco hover:bg-vinho-hover
        `,
        borda: `
            border-2 border-vinho text-vinho 
            hover:bg-vinho/20
        `
    }

    const classes = `${estiloBase} ${estilosVariante[variante]}`; 

    if (props.tipo == "link") {

        return (
            <Link
                to={props.to}
                onClick={props.onCLick}
                className={classes}
            >
                {children}
            </Link>
        )
    }

    return (
        <button
            type={props.tipo ?? "button"}
            onClick={props.onClick}
            className={classes}
            disabled={props.disabled}
        >
            {children}
        </button>
    )
}

export default BotaoVinho; 

