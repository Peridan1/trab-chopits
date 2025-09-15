import { useParams } from "react-router-dom";

export const Sobre = () => {
    const { parametro } = useParams<{ parametro: string }>();

    return (
        <>
            <h1>Sobre selecionado: {parametro}</h1>
        </>
    );
};
