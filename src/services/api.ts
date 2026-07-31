import axios from "axios";

// Em projetos com Vite no navegador, variáveis de ambiente usam import.meta.env em vez de process.env
const envPort = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_API_PORT : undefined;
export const API_PORT = envPort || 3001;
export const API_BASE_URL = `http://localhost:${API_PORT}`;

// Instância centralizada do Axios
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Endpoints centralizados da aplicação
export const ENDPOINTS = {
    USUARIOS: "/usuarios",
    PRODUTOS: "/produtos",
    CARRINHO: "/carrinho"
} as const;
