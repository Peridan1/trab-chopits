import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Produtos } from "../pages/Produtos";
import { ProdutoDetalhe } from "../pages/ProdutoDetalhe";
import { Carrinho } from "../pages/Carrinho";
import { Wishlist } from "../pages/Wishlist";
import { Perfil } from "../pages/Perfil";
import { Usuarios } from "../pages/Usuarios";
import { Admin } from "../pages/Admin";
import { Sobre } from "../pages/Sobre";

export const Rotas = () => {
    return (
        <BrowserRouter>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="container pb-5 flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/produtos" element={<Produtos />} />
                        <Route path="/produtos/:parametro" element={<Produtos />} />
                        <Route path="/produto/:id" element={<ProdutoDetalhe />} />
                        <Route path="/carrinho" element={<Carrinho />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/usuarios" element={<Usuarios />} />
                        <Route path="/sobre" element={<Sobre />} />
                        <Route path="/sobre/:parametro" element={<Sobre />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/login/:parametro" element={<Login />} />
                        <Route
                            path="*"
                            element={
                                <div className="text-center py-5">
                                    <h1 className="display-1 text-danger fw-bold">404</h1>
                                    <p className="lead text-muted">Página não encontrada!</p>
                                    <Link to="/home" className="btn chopits-btn-primary mt-3 px-4">
                                        Voltar para a Vitrine Chopits
                                    </Link>
                                </div>
                            }
                        />
                    </Routes>
                </main>

                {/* Rodapé Institucional do E-Commerce */}
                <footer className="bg-white border-top py-4 mt-auto">
                    <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3 small text-muted">
                        <div>
                            <strong className="text-dark">🛍️ Chopits Store — E-commerce Oficial</strong> — Desenvolvido por Daniel Satel Pereira (6º Semestre SI)
                        </div>
                        <div className="d-flex flex-wrap gap-3">
                            <Link to="/home" className="text-decoration-none text-muted">Início</Link>
                            <Link to="/produtos" className="text-decoration-none text-muted">Catálogo</Link>
                            <Link to="/wishlist" className="text-decoration-none text-muted">Desejos</Link>
                            <Link to="/carrinho" className="text-decoration-none text-muted">Carrinho</Link>
                            <Link to="/perfil" className="text-decoration-none text-muted">Meu Perfil</Link>
                            <Link to="/admin" className="text-decoration-none text-primary fw-semibold">
                                🎓 Painel Admin & Prática Professor
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </BrowserRouter>
    );
};