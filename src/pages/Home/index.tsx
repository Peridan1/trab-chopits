import { useState, useEffect } from "react";

export const Home = () => {
    const [tarefa, setTarefa] = useState("");
    const [lista, setLista] = useState<string[]>([]);

    const adicionarTarefa = () => {
        if (tarefa.trim() === "") return;
        setLista([...lista, tarefa]);
        setTarefa("");
    };

    useEffect(() => {
        const listaSalva = localStorage.getItem("minhasTarefas");
        if (listaSalva) {
            setLista(JSON.parse(listaSalva));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("minhasTarefas", JSON.stringify(lista));
    }, [lista]);
    return (
        <>
            <h1>Home</h1>

            <input
                type="text"
                value={tarefa}
                onChange={(e) => setTarefa(e.target.value)}
                placeholder="Digite uma tarefa"
            />
            <button onClick={adicionarTarefa}>Adicionar</button>

            <ul>
                {lista.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </>
    );
};
