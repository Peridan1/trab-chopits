import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import type { EnderecoUsuario } from "../../types";

export const Perfil: React.FC = () => {
    const { usuarioLogado, atualizarPerfil, logout, exibirNotificacao } = useStore();
    const navigate = useNavigate();

    const [abaAtiva, setAbaAtiva] = useState<"dados" | "endereco" | "pedidos">("dados");

    // Estados locais para edição dos dados
    const [nome, setNome] = useState(usuarioLogado?.nome || "");
    const [email, setEmail] = useState(usuarioLogado?.email || "");
    const [telefone, setTelefone] = useState(usuarioLogado?.telefone || "");

    // Estados locais para edição do endereço
    const [endereco, setEndereco] = useState<EnderecoUsuario>(
        usuarioLogado?.endereco || {
            cep: "01310-100",
            logradouro: "Av. Paulista",
            numero: "1000",
            bairro: "Bela Vista",
            cidade: "São Paulo",
            uf: "SP"
        }
    );

    if (!usuarioLogado) {
        return (
            <div className="py-5 text-center">
                <div className="card border-0 shadow-sm rounded-4 p-5 col-md-8 col-lg-6 mx-auto">
                    <div className="display-4 mb-3">👤</div>
                    <h3 className="fw-bold mb-2">Acesso ao Perfil</h3>
                    <p className="text-muted mb-4">
                        Você precisa estar conectado na sua conta para visualizar seu perfil, histórico de pedidos e endereços de entrega.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/login" className="btn chopits-btn-primary px-4 py-2">
                            Fazer Login
                        </Link>
                        <Link to="/home" className="btn btn-outline-secondary px-4 py-2">
                            Voltar para a Loja
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleSalvarDados = async (e: React.FormEvent) => {
        e.preventDefault();
        await atualizarPerfil({ nome, email, telefone });
    };

    const handleSalvarEndereco = async (e: React.FormEvent) => {
        e.preventDefault();
        await atualizarPerfil({ endereco });
    };

    const handleLogout = () => {
        logout();
        navigate("/home");
    };

    const pedidos = usuarioLogado.pedidos || [];

    return (
        <div className="py-3">
            {/* Header do Perfil */}
            <div className="chopits-profile-card p-4 mb-4 shadow-sm">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                            style={{ width: "64px", height: "64px", fontSize: "1.8rem" }}
                        >
                            {usuarioLogado.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="d-flex align-items-center gap-2">
                                <h3 className="fw-bold m-0">{usuarioLogado.nome}</h3>
                                {usuarioLogado.cargo && (
                                    <span
                                        className={`badge ${
                                            usuarioLogado.cargo === "admin"
                                                ? "bg-danger"
                                                : "bg-success"
                                        }`}
                                    >
                                        {usuarioLogado.cargo.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <p className="text-muted small m-0 mt-1">{usuarioLogado.email}</p>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        {usuarioLogado.cargo === "admin" && (
                            <Link to="/admin" className="btn btn-outline-primary btn-sm px-3 fw-semibold">
                                ⚙️ Painel Admin
                            </Link>
                        )}
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm px-3 fw-semibold"
                            onClick={handleLogout}
                        >
                            🚪 Sair da Conta
                        </button>
                    </div>
                </div>
            </div>

            {/* Abas de Navegação */}
            <ul className="nav nav-pills mb-4 gap-2">
                <li className="nav-item">
                    <button
                        type="button"
                        className={`nav-link fw-semibold px-4 py-2 ${
                            abaAtiva === "dados" ? "active bg-primary text-white" : "bg-white text-dark border"
                        }`}
                        onClick={() => setAbaAtiva("dados")}
                    >
                        👤 Dados Pessoais
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        type="button"
                        className={`nav-link fw-semibold px-4 py-2 ${
                            abaAtiva === "endereco" ? "active bg-primary text-white" : "bg-white text-dark border"
                        }`}
                        onClick={() => setAbaAtiva("endereco")}
                    >
                        📍 Endereço de Entrega
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        type="button"
                        className={`nav-link fw-semibold px-4 py-2 position-relative ${
                            abaAtiva === "pedidos" ? "active bg-primary text-white" : "bg-white text-dark border"
                        }`}
                        onClick={() => setAbaAtiva("pedidos")}
                    >
                        📦 Meus Pedidos
                        {pedidos.length > 0 && (
                            <span className="badge rounded-pill bg-danger ms-2">
                                {pedidos.length}
                            </span>
                        )}
                    </button>
                </li>
            </ul>

            {/* Conteúdo da Aba 1: Dados Pessoais */}
            {abaAtiva === "dados" && (
                <div className="card border-0 shadow-sm rounded-4 p-4">
                    <h5 className="fw-bold mb-3">Informações Pessoais</h5>
                    <form onSubmit={handleSalvarDados}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Nome Completo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">E-mail</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Telefone de Contato</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="(11) 98765-4321"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Nível de Acesso (Cargo)</label>
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={usuarioLogado.cargo || "cliente"}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <button type="submit" className="btn chopits-btn-primary px-4 py-2">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Conteúdo da Aba 2: Endereço de Entrega */}
            {abaAtiva === "endereco" && (
                <div className="card border-0 shadow-sm rounded-4 p-4">
                    <h5 className="fw-bold mb-3">Endereço Principal para Entrega</h5>
                    <form onSubmit={handleSalvarEndereco}>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-semibold">CEP</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={endereco.cep}
                                    onChange={(e) =>
                                        setEndereco({ ...endereco, cep: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">Logradouro / Rua</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={endereco.logradouro}
                                    onChange={(e) =>
                                        setEndereco({ ...endereco, logradouro: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-semibold">Número</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={endereco.numero}
                                    onChange={(e) =>
                                        setEndereco({ ...endereco, numero: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-semibold">Bairro</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={endereco.bairro}
                                    onChange={(e) =>
                                        setEndereco({ ...endereco, bairro: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="col-md-5">
                                <label className="form-label fw-semibold">Cidade</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={endereco.cidade}
                                    onChange={(e) =>
                                        setEndereco({ ...endereco, cidade: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-semibold">Estado (UF)</label>
                                <input
                                    type="text"
                                    className="form-control text-uppercase"
                                    maxLength={2}
                                    value={endereco.uf}
                                    onChange={(e) =>
                                        setEndereco({ ...endereco, uf: e.target.value.toUpperCase() })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <button type="submit" className="btn chopits-btn-primary px-4 py-2">
                                Salvar Endereço
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Conteúdo da Aba 3: Meus Pedidos */}
            {abaAtiva === "pedidos" && (
                <div>
                    {pedidos.length === 0 ? (
                        <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-3">
                            <div className="display-4 mb-3">🛍️</div>
                            <h4 className="fw-bold mb-2">Nenhum pedido realizado ainda</h4>
                            <p className="text-muted col-md-6 mx-auto mb-4">
                                Você ainda não possui pedidos registrados. Aproveite nossos cupons e ofertas relâmpago para comprar seu primeiro produto!
                            </p>
                            <div>
                                <Link to="/produtos" className="btn chopits-btn-primary px-4 py-2">
                                    Ir às Compras →
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-3">
                            {pedidos.map((pedido) => (
                                <div key={pedido.id} className="chopits-order-card p-4">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3 gap-2">
                                        <div>
                                            <span className="fw-bold fs-5 text-primary">
                                                Pedido {pedido.id}
                                            </span>
                                            <div className="text-muted small mt-1">
                                                Realizado em: {pedido.data} • Pagamento via {pedido.metodoPagamento.toUpperCase()}
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            <span
                                                className={`badge px-3 py-2 ${
                                                    pedido.status === "Entregue"
                                                        ? "bg-success"
                                                        : pedido.status === "Em Transporte"
                                                        ? "bg-info text-dark"
                                                        : "bg-warning text-dark"
                                                }`}
                                            >
                                                {pedido.status === "Entregue" && "✅ "}
                                                {pedido.status === "Em Transporte" && "🚚 "}
                                                {pedido.status === "Processando" && "⏳ "}
                                                {pedido.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Itens do Pedido */}
                                    <div className="mb-3">
                                        {pedido.itens.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="d-flex justify-content-between align-items-center py-2 border-bottom border-light"
                                            >
                                                <div className="d-flex align-items-center gap-3">
                                                    <span style={{ fontSize: "1.5rem" }}>
                                                        {item.imagem || "📦"}
                                                    </span>
                                                    <div>
                                                        <div className="fw-semibold text-dark">
                                                            {item.nome}
                                                        </div>
                                                        <small className="text-muted">
                                                            Qtd: {item.quantidade} • R$ {item.preco.toFixed(2).replace(".", ",")} cada
                                                        </small>
                                                    </div>
                                                </div>
                                                <span className="fw-bold">
                                                    R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Rodapé do Card do Pedido */}
                                    <div className="d-flex flex-wrap justify-content-between align-items-center pt-2 gap-2">
                                        <div className="small">
                                            <span className="text-muted">Código de Rastreamento: </span>
                                            <code className="text-primary fw-bold me-2">
                                                {pedido.codigoRastreio}
                                            </code>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-link p-0 text-decoration-none"
                                                onClick={() => {
                                                    navigator.clipboard?.writeText(pedido.codigoRastreio);
                                                    exibirNotificacao("Código copiado para a área de transferência!");
                                                }}
                                            >
                                                📋 Copiar
                                            </button>
                                        </div>

                                        <div className="text-end">
                                            <span className="text-muted small me-2">Total Pago:</span>
                                            <span className="fs-5 fw-bold text-success">
                                                R$ {pedido.total.toFixed(2).replace(".", ",")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

