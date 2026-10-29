import React, { useRef, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export const Navbar: React.FC = () => {
    const {
        totalItensCarrinho,
        favoritos,
        buscaGlobal,
        setBuscaGlobal,
        aplicarCupom,
        usuarioLogado,
        logout,
        notificacao
    } = useStore();

    const navigate = useNavigate();
    // Conceito Acadêmico: useRef para foco direto no input de busca via atalho de teclado '/'
    const inputBuscaRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "/" &&
                document.activeElement?.tagName !== "INPUT" &&
                document.activeElement?.tagName !== "TEXTAREA"
            ) {
                e.preventDefault();
                inputBuscaRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Fechar o menu de usuário ao clicar fora
    useEffect(() => {
        const handleClickFora = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuUsuarioAberto(false);
            }
        };
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/produtos");
    };

    const handleLogout = () => {
        setMenuUsuarioAberto(false);
        logout();
        navigate("/home");
    };

    return (
        <header className="sticky-top mb-4 shadow-sm" style={{ zIndex: 1020 }}>
            {/* 1. Faixa Superior de Anúncios com Alto Contraste */}
            <div className="chopits-topbar py-1 px-3">
                <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-white">
                            🚚 <strong>Frete Grátis</strong> para todo o Brasil acima de R$ 99
                        </span>
                        <button
                            type="button"
                            className="btn btn-link btn-sm text-warning text-decoration-none p-0 fw-bold d-none d-md-inline"
                            style={{ fontSize: "0.8rem" }}
                            onClick={() => aplicarCupom("CHOPITS10")}
                        >
                            🎟️ Ativar Cupom 10% OFF: CHOPITS10
                        </button>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <NavLink
                            to="/sobre"
                            className="text-white text-decoration-none fw-medium opacity-90 hover-opacity-100"
                            style={{ fontSize: "0.8rem" }}
                        >
                            Sobre a Loja
                        </NavLink>
                        <NavLink
                            to="/admin"
                            className="badge bg-warning text-dark text-decoration-none px-2 py-1 fw-bold"
                            style={{ fontSize: "0.75rem" }}
                        >
                            🎓 Prática & Admin
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* 2. Header Principal Unificado do E-Commerce */}
            <nav className="navbar navbar-expand-lg navbar-dark chopits-navbar py-2 py-lg-3">
                <div className="container gap-2 gap-lg-3">
                    {/* Brand / Logo */}
                    <Link className="navbar-brand d-flex align-items-center fw-bold fs-3 m-0" to="/home">
                        <span
                            className="me-2 d-inline-flex align-items-center justify-content-center rounded-3 bg-white text-primary shadow-sm"
                            style={{ width: "42px", height: "42px", fontSize: "1.4rem" }}
                        >
                            🛍️
                        </span>
                        <div className="lh-1">
                            <span className="text-white">Chopits</span>
                            <span
                                className="d-block text-white fw-bold"
                                style={{ fontSize: "0.65rem", letterSpacing: "0.08em", opacity: 0.9 }}
                            >
                                STORE OFICIAL
                            </span>
                        </div>
                    </Link>

                    {/* Links de Navegação da Loja (Desktop) */}
                    <div className="d-none d-lg-flex align-items-center gap-1 ms-2">
                        <NavLink to="/home" className="chopits-nav-link">
                            Início
                        </NavLink>
                        <NavLink to="/produtos" className="chopits-nav-link">
                            Produtos
                        </NavLink>
                        <NavLink to="/wishlist" className="chopits-nav-link">
                            Desejos
                        </NavLink>
                    </div>

                    {/* Barra de Busca Global com atalho "/" via useRef */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="chopits-search-wrapper order-3 order-lg-2 w-100 my-2 my-lg-0 mx-lg-3"
                    >
                        <input
                            ref={inputBuscaRef}
                            type="search"
                            className="form-control chopits-search-input"
                            placeholder='Buscar produtos... (Pressione "/" para focar)'
                            value={buscaGlobal}
                            onChange={(e) => setBuscaGlobal(e.target.value)}
                        />
                        <button type="submit" className="chopits-search-btn" title="Buscar no Catálogo">
                            🔍
                        </button>
                    </form>

                    {/* Cluster de Ações: Wishlist, Carrinho e Perfil/Login */}
                    <div className="d-flex align-items-center gap-2 order-2 order-lg-3 ms-auto">
                        {/* Botão Lista de Desejos (Página Dedicada) */}
                        <Link
                            to="/wishlist"
                            className="chopits-user-btn position-relative"
                            title="Ver Minha Lista de Desejos"
                        >
                            <span style={{ fontSize: "1.05rem" }}>❤️</span>
                            <span className="d-none d-xl-inline">Desejos</span>
                            {favoritos.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white">
                                    {favoritos.length}
                                </span>
                            )}
                        </Link>

                        {/* Botão Carrinho de Compras */}
                        <Link
                            to="/carrinho"
                            className="btn btn-light text-primary fw-bold btn-sm position-relative px-3 py-2 d-flex align-items-center gap-2 shadow-sm rounded-pill"
                            title="Ver Carrinho de Compras"
                        >
                            <span style={{ fontSize: "1.05rem" }}>🛒</span>
                            <span className="d-none d-sm-inline">Carrinho</span>
                            <span className="badge rounded-pill bg-danger text-white">
                                {totalItensCarrinho}
                            </span>
                        </Link>

                        {/* Menu de Perfil & Autenticação */}
                        <div className="position-relative" ref={menuRef}>
                            {usuarioLogado ? (
                                <>
                                    <button
                                        type="button"
                                        className="chopits-user-btn"
                                        onClick={() => setMenuUsuarioAberto((prev) => !prev)}
                                        title="Minha Conta"
                                    >
                                        <span
                                            className="rounded-circle bg-white text-primary fw-bold d-inline-flex align-items-center justify-content-center"
                                            style={{ width: "24px", height: "24px", fontSize: "0.8rem" }}
                                        >
                                            {usuarioLogado.nome.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="d-none d-md-inline" style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {usuarioLogado.nome.split(" ")[0]}
                                        </span>
                                        <span style={{ fontSize: "0.7rem" }}>▼</span>
                                    </button>

                                    {menuUsuarioAberto && (
                                        <div
                                            className="dropdown-menu dropdown-menu-end show chopits-dropdown-menu position-absolute end-0 mt-2"
                                            style={{ zIndex: 1050 }}
                                        >
                                            <div className="px-3 py-2 border-bottom mb-1">
                                                <div className="fw-bold text-dark">{usuarioLogado.nome}</div>
                                                <div className="text-muted small">{usuarioLogado.email}</div>
                                                {usuarioLogado.cargo && (
                                                    <span className={`badge mt-1 ${usuarioLogado.cargo === "admin" ? "bg-danger" : "bg-primary"}`}>
                                                        {usuarioLogado.cargo.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>

                                            <Link
                                                to="/perfil"
                                                className="dropdown-item chopits-dropdown-item"
                                                onClick={() => setMenuUsuarioAberto(false)}
                                            >
                                                👤 Meu Perfil & Endereço
                                            </Link>
                                            <Link
                                                to="/perfil"
                                                className="dropdown-item chopits-dropdown-item"
                                                onClick={() => setMenuUsuarioAberto(false)}
                                            >
                                                📦 Meus Pedidos
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                className="dropdown-item chopits-dropdown-item"
                                                onClick={() => setMenuUsuarioAberto(false)}
                                            >
                                                ❤️ Lista de Desejos ({favoritos.length})
                                            </Link>

                                            {usuarioLogado.cargo === "admin" && (
                                                <>
                                                    <div className="dropdown-divider my-1"></div>
                                                    <Link
                                                        to="/admin"
                                                        className="dropdown-item chopits-dropdown-item text-primary fw-semibold"
                                                        onClick={() => setMenuUsuarioAberto(false)}
                                                    >
                                                        ⚙️ Painel do Administrador
                                                    </Link>
                                                </>
                                            )}

                                            <div className="dropdown-divider my-1"></div>
                                            <button
                                                type="button"
                                                className="dropdown-item chopits-dropdown-item text-danger"
                                                onClick={handleLogout}
                                            >
                                                🚪 Sair da Conta
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="btn btn-outline-light btn-sm fw-bold px-3 py-2 rounded-pill d-flex align-items-center gap-1 shadow-sm"
                                    style={{ borderColor: "rgba(255,255,255,0.4)" }}
                                    title="Entrar na sua conta"
                                >
                                    <span>👤</span>
                                    <span>Entrar</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Toast Global de Notificação */}
            {notificacao && (
                <div className="chopits-toast" role="status">
                    {notificacao}
                </div>
            )}
        </header>
    );
};
