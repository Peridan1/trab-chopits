import React, { useEffect, useState } from "react";
import { api, ENDPOINTS } from "../../services/api";
import type { Usuario } from "../../types";

export const Usuarios: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    // Estado do formulário (Criar / Editar)
    const [nomeInput, setNomeInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [modalAberto, setModalAberto] = useState(false);

    // Carregar usuários da API
    const carregarUsuarios = async () => {
        setLoading(true);
        setErro(null);
        try {
            const resposta = await api.get<Usuario[]>(ENDPOINTS.USUARIOS);
            setUsuarios(resposta.data);
        } catch (err: unknown) {
            console.error("Erro ao buscar usuários do json-server:", err);
            setErro("Não foi possível conectar ao json-server. Exibindo dados de contingência.");
            setUsuarios([
                { id: 1, nome: "Felipe", email: "espetinho@gmail.com" },
                { id: 2, nome: "Claudio", email: "claudio@gmail.com" },
                { id: 3, nome: "Daniel", email: "daniel@gmail.com" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const abrirModalCriar = () => {
        setEditandoId(null);
        setNomeInput("");
        setEmailInput("");
        setModalAberto(true);
    };

    const abrirModalEditar = (user: Usuario) => {
        setEditandoId(user.id);
        setNomeInput(user.nome);
        setEmailInput(user.email);
        setModalAberto(true);
    };

    const salvarUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nomeInput.trim() || !emailInput.trim()) return;

        try {
            if (editandoId !== null) {
                const usuarioAtualizado = { nome: nomeInput, email: emailInput };
                await api.put(`${ENDPOINTS.USUARIOS}/${editandoId}`, usuarioAtualizado);
                setUsuarios(prev =>
                    prev.map(u => (u.id === editandoId ? { ...u, ...usuarioAtualizado } : u))
                );
            } else {
                const novoUsuario = { nome: nomeInput, email: emailInput };
                const resposta = await api.post<Usuario>(ENDPOINTS.USUARIOS, novoUsuario);
                setUsuarios(prev => [...prev, resposta.data]);
            }
            setModalAberto(false);
            setNomeInput("");
            setEmailInput("");
            setEditandoId(null);
        } catch (err) {
            console.error("Erro ao salvar usuário:", err);
            if (editandoId !== null) {
                setUsuarios(prev =>
                    prev.map(u => (u.id === editandoId ? { ...u, nome: nomeInput, email: emailInput } : u))
                );
            } else {
                const novoId = usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
                setUsuarios(prev => [...prev, { id: novoId, nome: nomeInput, email: emailInput }]);
            }
            setModalAberto(false);
        }
    };

    const excluirUsuario = async (id: number) => {
        try {
            await api.delete(`${ENDPOINTS.USUARIOS}/${id}`);
            setUsuarios(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            console.error("Erro ao excluir usuário:", err);
            setUsuarios(prev => prev.filter(u => u.id !== id));
        }
    };

    return (
        <div className="py-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Gerenciamento de Usuários</h2>
                    <p className="text-muted mb-0">
                        Consumo limpo via cliente centralizado <code>api</code> (axios)
                    </p>
                </div>
                <button className="btn btn-success d-flex align-items-center gap-2" onClick={abrirModalCriar}>
                    <span>➕</span> Novo Usuário
                </button>
            </div>

            {erro && (
                <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
                    ⚠️ {erro}
                </div>
            )}

            {/* Modal para Cadastro/Edição */}
            {modalAberto && (
                <div className="card shadow-sm border-primary mb-4">
                    <div className="card-header bg-primary text-white fw-semibold">
                        {editandoId !== null ? "✏️ Editar Usuário" : "👤 Cadastrar Novo Usuário"}
                    </div>
                    <div className="card-body">
                        <form onSubmit={salvarUsuario}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label font-semibold">Nome:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ex: Maria Silva"
                                        value={nomeInput}
                                        onChange={e => setNomeInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label font-semibold">E-mail:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Ex: maria@exemplo.com"
                                        value={emailInput}
                                        onChange={e => setEmailInput(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-3 d-flex gap-2 justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setModalAberto(false)}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editandoId !== null ? "Salvar Alterações" : "Cadastrar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabela de Usuários */}
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </div>
                            <p className="mt-2 text-muted">Carregando usuários...</p>
                        </div>
                    ) : usuarios.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            Nenhum usuário cadastrado.
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">E-mail</th>
                                        <th scope="col" className="text-end pe-4">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((usuario) => (
                                        <tr key={usuario.id}>
                                            <th scope="row">#{usuario.id}</th>
                                            <td className="fw-medium">{usuario.nome}</td>
                                            <td className="text-muted">{usuario.email}</td>
                                            <td className="text-end pe-4">
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    type="button"
                                                    onClick={() => abrirModalEditar(usuario)}
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    type="button"
                                                    onClick={() => excluirUsuario(usuario.id)}
                                                >
                                                    🗑️ Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};