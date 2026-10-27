import React, { useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export const Navbar: React.FC = () => {
    const {
        totalItensCarrinho,
        favoritos,
        buscaGlobal,
        setBuscaGlobal,
        aplicarCupom,
        notificacao
    } = useStore();

    const navigate = useNavigate();
    // Conceito Acadêmico: useRef para foco direto no input de busca via atalho de teclado '/'
    const inputBuscaRef = useRef<HTMLInputElement>(null);

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

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/produtos");
    };

    return (
        <>
            {/* Topbar de Avisos & Atalho Acadêmico */}
            <div className="chopits-topbar py-1">
                <div className="container d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="d-flex align-items-center gap-3">
                        <span>🚚 <strong>Frete Grátis</strong> acima de R$ 99 ou com cupom</span>
                        <button
                            type="button"
                            className="btn btn-link btn-sm text-warning text-decoration-none p-0 fw-semibold"
                            style={{ fontSize: "0.78rem" }}
                            onClick={() => aplicarCupom("CHOPITS10")}
                        >
                            🎟️ Ativar Cupom 10% OFF (CHOPITS10)
                        </button>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <NavLink
                            to="/sobre"
                            className="text-white text-opacity-75 text-decoration-none"
                        >
                            Sobre
                        </NavLink>
                        <NavLink
                            to="/admin"
                            className="badge bg-warning text-dark text-decoration-none px-2 py-1"
                        >
                            🎓 Admin & Prática Professor
                        </NavLink>
                    </div>
                </div>
            </div>

            {/* Navbar Principal do Marketplace */}
            <nav className="navbar navbar-expand-lg navbar-dark chopits-navbar sticky-top py-3 mb-4">
                <div className="container gap-3">
                    {/* Logo Chopits */}
                    <Link className="navbar-brand d-flex align-items-center fw-bold fs-3 m-0" to="/home">
                        <span
                            className="me-2 d-inline-flex align-items-center justify-content-center rounded-3 bg-white text-primary shadow-sm"
                            style={{ width: "40px", height: "40px", fontSize: "1.35rem" }}
                        >
                            🛍️
                        </span>
                        <div className="lh-1">
                            <span>Chopits</span>
                            <span
                                className="d-block fw-normal text-white text-opacity-75"
                                style={{ fontSize: "0.68rem", letterSpacing: "0.06em" }}
                            >
                                MARKETPLACE OFICIAL
                            </span>
                        </div>
                    </Link>

                    {/* Barra de Busca Global com useRef */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="chopits-search-wrapper order-3 order-lg-2 w-100 my-2 my-lg-0"
                    >
                        <input
                            ref={inputBuscaRef}
                            type="search"
                            className="form-control chopits-search-input"
                            placeholder='Buscar no Chopits (Pressione "/" para focar)...'
                            value={buscaGlobal}
                            onChange={(e) => setBuscaGlobal(e.target.value)}
                        />
                        <button type="submit" className="chopits-search-btn" title="Buscar">
                            🔍
                        </button>
                    </form>

                    {/* Ações Rápidas: Catálogo, Lista de Desejos, Carrinho e Login */}
                    <div className="d-flex align-items-center gap-2 order-2 order-lg-3 ms-auto">
                        <NavLink
                            to="/produtos"
                            className={({ isActive }) =>
                                `btn btn-sm ${
                                    isActive ? "btn-light text-primary fw-bold" : "btn-outline-light"
                                } px-3 d-none d-sm-inline-flex align-items-center gap-1`
                            }
                        >
                            📦 Catálogo
                        </NavLink>

                        {/* Lista de Desejos (Wishlist localStorage) */}
                        <Link
                            to="/home#wishlist"
                            className="btn btn-outline-light btn-sm position-relative px-2"
                            title="Minha Lista de Desejos (localStorage)"
                        >
                            ❤️
                            {favoritos.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {favoritos.length}
                                </span>
                            )}
                        </Link>

                        {/* Carrinho de Compras */}
                        <Link
                            to="/carrinho"
                            className="btn btn-light text-primary fw-bold btn-sm position-relative px-3 d-flex align-items-center gap-1 shadow-sm"
                        >
                            <span>🛒</span>
                            <span className="d-none d-md-inline">Carrinho</span>
                            <span className="badge rounded-pill bg-danger ms-1">
                                {totalItensCarrinho}
                            </span>
                        </Link>

                        <Link
                            to="/login"
                            className="btn btn-outline-light btn-sm px-2"
                            title="Entrar na conta"
                        >
                            👤
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Toast Global de Feedback Imediato */}
            {notificacao && (
                <div className="chopits-toast" role="status">
                    {notificacao}
                </div>
            )}
        </>
    );
};
