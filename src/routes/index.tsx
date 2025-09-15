import { BrowserRouter, Routes, Route,/*Router*/ } from 'react-router-dom'

import { Home } from './../pages/Home'
import { Login } from './../pages/Login'
import { Produtos } from '../pages/Produtos'
import { Usuarios } from '../pages/Usuarios'
import { Sobre } from '../pages/Sobre'

export const Rotas = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/sobre/:parametro' element={<Sobre />} />
                <Route path='/produtos/:parametro' element={<Produtos />} />
                <Route path='/login/:parametro' element={<Login />} />
                <Route path='/usuarios' element={<Usuarios />} />
                <Route path='*' element={<h1>404</h1>} />
            </Routes>
        </BrowserRouter>
    )
}