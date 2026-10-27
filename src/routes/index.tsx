import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Produtos } from "../pages/Produtos";
import { ProdutoDetalhe } from "../pages/ProdutoDetalhe";
import { Carrinho } from "../pages/Carrinho";
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

                {/* Rodapé Institucional do Marketplace */}
                <footer className="bg-white border-top py-4 mt-auto">
                    <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3 small text-muted">
                        <div>
                            <strong className="text-dark">🛍️ Chopits Marketplace Oficial</strong> — Desenvolvido por Daniel Satel Pereira (4º Semestre ADS)
                        </div>
                        <div className="d-flex gap-3">
                            <Link to="/home" className="text-decoration-none text-muted">Vitrine</Link>
                            <Link to="/produtos" className="text-decoration-none text-muted">Catálogo</Link>
                            <Link to="/carrinho" className="text-decoration-none text-muted">Carrinho</Link>
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