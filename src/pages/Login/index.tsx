import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
    const { parametro } = useParams<{ parametro?: string }>();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [logado, setLogado] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && senha.trim()) {
            setLogado(true);
            setTimeout(() => {
                navigate("/home");
            }, 1500);
        }
    };

    return (
        <div className="py-4 d-flex justify-content-center">
            <div className="card shadow-sm border-0 col-12 col-md-6 col-lg-5">
                <div className="card-body p-4">
                    <div className="text-center mb-4">
                        <div className="display-4 mb-2">🔐</div>
                        <h3 className="fw-bold">Acesse sua conta</h3>
                        <p className="text-muted small">
                            {parametro ? `Redirecionado via parâmetro: "${parametro}"` : "Entre com suas credenciais para continuar"}
                        </p>
                    </div>

                    {logado ? (
                        <div className="alert alert-success text-center py-3" role="alert">
                            ✅ Login efetuado com sucesso! Redirecionando...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">E-mail</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="seu.email@exemplo.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">Senha</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="••••••••"
                                    value={senha}
                                    onChange={e => setSenha(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                                Entrar na Plataforma
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};