import React from "react";
import { useParams, Link } from "react-router-dom";

export const Sobre: React.FC = () => {
    const { parametro } = useParams<{ parametro?: string }>();

    return (
        <div className="py-2">
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                    <h2 className="fw-bold text-primary mb-3">ℹ️ Sobre o Projeto Chopits</h2>
                    <p className="lead text-secondary">
                        O Chopits é um e-commerce desenvolvido como projeto prático acadêmico do 4º semestre de análise e desenvolvimento de sistemas.
                    </p>

                    {parametro ? (
                        <div className="alert alert-info d-flex align-items-center gap-2 my-3">
                            <span>🔍</span>
                            <div>
                                <strong>Parâmetro Dinâmico Detectado:</strong> <code>{parametro}</code>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-light border my-3">
                            💡 <em>Dica: Você pode testar passar parâmetros na URL como <code>/sobre/equipe</code>, <code>/sobre/arquitetura</code> ou <code>/sobre/historia</code>.</em>
                        </div>
                    )}

                    <hr className="my-4" />

                    <h4 className="fw-semibold text-dark mb-3">🎯 Objetivos e Recursos Principais</h4>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="p-3 border rounded bg-light">
                                <h6 className="fw-bold text-dark">⚡ Tipagem Estática & Componentização</h6>
                                <p className="small text-muted mb-0">
                                    Construído com React 19 e TypeScript para prevenir erros de runtime e garantir contratos claros de interfaces.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-3 border rounded bg-light">
                                <h6 className="fw-bold text-dark">📡 API Mockada com JSON-Server</h6>
                                <p className="small text-muted mb-0">
                                    Simulação completa de backend REST para persistência e operações CRUD de dados.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-3 border rounded bg-light">
                                <h6 className="fw-bold text-dark">🧭 Roteamento com React Router DOM v7</h6>
                                <p className="small text-muted mb-0">
                                    Navegação em Single Page Application (SPA) com parâmetros dinâmicos e suporte a tratamento de 404.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-3 border rounded bg-light">
                                <h6 className="fw-bold text-dark">📚 Documentação Técnica</h6>
                                <p className="small text-muted mb-0">
                                    Consulte a pasta <code>docs/</code> para ver o comparativo de stacks e o guia de transição para API REST.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-top d-flex gap-2">
                        <Link to="/home" className="btn btn-primary">
                            Voltar para a Home
                        </Link>
                        <Link to="/produtos" className="btn btn-outline-secondary">
                            Ver Produtos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
