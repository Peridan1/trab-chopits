import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

export const Login: React.FC = () => {
    const { parametro } = useParams<{ parametro?: string }>();
    const navigate = useNavigate();
    const { login, usuarioLogado, logout } = useStore();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [mensagemFeedback, setMensagemFeedback] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setCarregando(true);
        const resultado = await login(email, senha);
        setCarregando(false);

        if (resultado.sucesso) {
            setMensagemFeedback(`✅ ${resultado.mensagem}`);
            setTimeout(() => {
                navigate("/perfil");
            }, 800);
        }
    };

    const handleAcessoRapido = async (emailRapido: string) => {
        setEmail(emailRapido);
        setSenha("123456");
        setCarregando(true);
        const resultado = await login(emailRapido, "123456");
        setCarregando(false);

        if (resultado.sucesso) {
            setMensagemFeedback(`✅ Conectado como ${resultado.usuario?.nome}!`);
            setTimeout(() => {
                navigate("/perfil");
            }, 800);
        }
    };

    // Caso o usuário já esteja autenticado
    if (usuarioLogado) {
        return (
            <div className="py-5 d-flex justify-content-center">
                <div className="card shadow-sm border-0 col-12 col-md-6 col-lg-5 rounded-4 p-4 text-center">
                    <div className="display-4 mb-3">👋</div>
                    <h3 className="fw-bold mb-1">Você já está conectado!</h3>
                    <p className="text-muted mb-3">
                        Sessão ativa como <strong>{usuarioLogado.nome}</strong> ({usuarioLogado.email})
                    </p>
                    <div className="mb-4">
                        <span className={`badge ${usuarioLogado.cargo === "admin" ? "bg-danger" : "bg-success"} px-3 py-2`}>
                            CARGO: {usuarioLogado.cargo?.toUpperCase()}
                        </span>
                    </div>

                    <div className="d-grid gap-2">
                        <Link to="/perfil" className="btn chopits-btn-primary py-2">
                            👤 Acessar Meu Perfil & Pedidos
                        </Link>
                        <Link to="/home" className="btn btn-outline-secondary py-2">
                            Ir para a Vitrine da Loja
                        </Link>
                        <button
                            type="button"
                            className="btn btn-link text-danger text-decoration-none mt-2"
                            onClick={logout}
                        >
                            🚪 Trocar de Conta (Sair)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-4 d-flex justify-content-center">
            <div className="card shadow-sm border-0 col-12 col-md-7 col-lg-5 rounded-4">
                <div className="card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                        <div className="display-4 mb-2">🔐</div>
                        <h3 className="fw-bold">Acesse sua Conta</h3>
                        <p className="text-muted small">
                            {parametro
                                ? `Redirecionado via parâmetro acadêmico: "${parametro}"`
                                : "Entre com seu e-mail para acompanhar pedidos e gerenciar sua conta"}
                        </p>
                    </div>

                    {mensagemFeedback && (
                        <div className="alert alert-success text-center py-2 mb-3" role="alert">
                            {mensagemFeedback}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">E-mail</label>
                            <input
                                type="email"
                                className="form-control py-2"
                                placeholder="seu.email@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Senha</label>
                            <input
                                type="password"
                                className="form-control py-2"
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn chopits-btn-primary w-100 py-2 fw-semibold rounded-3 mb-4"
                            disabled={carregando}
                        >
                            {carregando ? "Autenticando..." : "Entrar na Chopits Store"}
                        </button>
                    </form>

                    {/* Atalhos Rápidos para Demonstração de Portfólio */}
                    <div className="border-top pt-4">
                        <div className="text-center text-muted small fw-semibold mb-3 text-uppercase">
                            ⚡ Acesso Rápido para Avaliação / Portfólio
                        </div>
                        <div className="d-grid gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm text-start py-2 d-flex align-items-center justify-content-between"
                                onClick={() => handleAcessoRapido("daniel@gmail.com")}
                            >
                                <span>👑 <strong>Daniel Satel Pereira</strong> (Admin Geral)</span>
                                <span className="badge bg-danger">ADMIN</span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm text-start py-2 d-flex align-items-center justify-content-between"
                                onClick={() => handleAcessoRapido("espetinho@gmail.com")}
                            >
                                <span>🛍️ <strong>Felipe</strong> (Cliente com Pedidos)</span>
                                <span className="badge bg-success">CLIENTE</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
