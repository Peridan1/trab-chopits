import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
    const [tarefa, setTarefa] = useState("");
    const [lista, setLista] = useState<string[]>([]);

    const adicionarTarefa = (e: React.FormEvent) => {
        e.preventDefault();
        if (tarefa.trim() === "") return;
        setLista([...lista, tarefa.trim()]);
        setTarefa("");
    };

    const removerTarefa = (indexParaRemover: number) => {
        setLista(lista.filter((_, index) => index !== indexParaRemover));
    };

    useEffect(() => {
        const listaSalva = localStorage.getItem("minhasTarefas");
        if (listaSalva) {
            try {
                setLista(JSON.parse(listaSalva));
            } catch (err) {
                console.error("Erro ao carregar tarefas salvas:", err);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("minhasTarefas", JSON.stringify(lista));
    }, [lista]);

    return (
        <div className="py-2">
            {/* Banner de Boas-vindas */}
            <div className="p-5 mb-4 bg-light rounded-3 border shadow-sm">
                <div className="container-fluid py-2">
                    <h1 className="display-5 fw-bold text-primary">Bem-vindo ao Chopits! 🛍️</h1>
                    <p className="col-md-9 fs-5 text-secondary">
                        Plataforma de e-commerce desenvolvida como projeto acadêmico do 4º semestre.
                        Focada em interatividade, componentização moderna e tipagem estática com TypeScript.
                    </p>
                    <div className="d-flex gap-3 mt-4">
                        <Link to="/produtos" className="btn btn-primary btn-lg px-4">
                            Explorar Produtos
                        </Link>
                        <Link to="/usuarios" className="btn btn-outline-secondary btn-lg px-4">
                            Gerenciar Usuários
                        </Link>
                    </div>
                </div>
            </div>

            {/* Grid de Seções */}
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <div className="card h-100 shadow-sm border-0 bg-white">
                        <div className="card-body p-4">
                            <h3 className="card-title fw-bold text-dark mb-3">📌 Lista de Lembretes & Tarefas</h3>
                            <p className="text-muted">
                                Funcionalidade interativa com persistência no <code>localStorage</code> do navegador.
                            </p>
                            
                            <form onSubmit={adicionarTarefa} className="d-flex gap-2 mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={tarefa}
                                    onChange={(e) => setTarefa(e.target.value)}
                                    placeholder="Digite um novo lembrete ou tarefa..."
                                />
                                <button type="submit" className="btn btn-success px-4">
                                    Adicionar
                                </button>
                            </form>

                            {lista.length === 0 ? (
                                <p className="text-muted fst-italic">Nenhum lembrete cadastrado ainda.</p>
                            ) : (
                                <ul className="list-group list-group-flush border-top pt-2">
                                    {lista.map((item, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item d-flex justify-content-between align-items-center px-0 py-2"
                                        >
                                            <span>• {item}</span>
                                            <button
                                                className="btn btn-sm btn-outline-danger border-0"
                                                onClick={() => removerTarefa(index)}
                                                title="Excluir item"
                                            >
                                                ❌
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card h-100 shadow-sm border-0 bg-white">
                        <div className="card-body p-4 d-flex flex-column justify-content-between">
                            <div>
                                <h3 className="card-title fw-bold text-dark mb-3">🚀 Stack Tecnológica</h3>
                                <ul className="list-unstyled text-secondary">
                                    <li className="mb-2">⚡ <strong>Vite:</strong> Build tool de alta performance</li>
                                    <li className="mb-2">⚛️ <strong>React 19:</strong> Biblioteca para interfaces reativas</li>
                                    <li className="mb-2">🔷 <strong>TypeScript:</strong> Tipagem estática robusta</li>
                                    <li className="mb-2">🌐 <strong>React Router DOM v7:</strong> Roteamento SPA</li>
                                    <li className="mb-2">🎨 <strong>Bootstrap 5:</strong> UI responsiva e moderna</li>
                                    <li className="mb-2">📡 <strong>JSON-Server & Axios:</strong> API REST mockada</li>
                                </ul>
                            </div>
                            <div className="pt-3 border-top">
                                <Link to="/sobre" className="btn btn-outline-primary w-100">
                                    Saiba mais sobre a arquitetura
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
