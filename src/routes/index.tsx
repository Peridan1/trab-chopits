import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

import { Home } from './../pages/Home';
import { Login } from './../pages/Login';
import { Produtos } from '../pages/Produtos';
import { Usuarios } from '../pages/Usuarios';
import { Sobre } from '../pages/Sobre';

export const Rotas = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <main className="container pb-5">
                <Routes>
                    <Route path='/' element={<Navigate to="/home" replace />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/sobre' element={<Sobre />} />
                    <Route path='/sobre/:parametro' element={<Sobre />} />
                    <Route path='/produtos' element={<Produtos />} />
                    <Route path='/produtos/:parametro' element={<Produtos />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/login/:parametro' element={<Login />} />
                    <Route path='/usuarios' element={<Usuarios />} />
                    <Route
                        path='*'
                        element={
                            <div className="text-center py-5">
                                <h1 className="display-1 text-danger fw-bold">404</h1>
                                <p className="lead text-muted">Página não encontrada!</p>
                                <Link to="/home" className="btn btn-primary mt-3">
                                    Voltar para a Página Inicial
                                </Link>
                            </div>
                        }
                    />
                </Routes>
            </main>
        </BrowserRouter>
    );
};