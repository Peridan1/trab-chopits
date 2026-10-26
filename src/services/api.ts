import axios from "axios";

// Validação estrita de variáveis de ambiente - Abordagem Fail-Fast
const envBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!envBaseUrl || typeof envBaseUrl !== "string" || envBaseUrl.trim() === "") {
    throw new Error(
        "❌ [Configuração Obrigatória Ausente]: A variável de ambiente 'VITE_API_BASE_URL' não foi configurada! " +
        "Defina VITE_API_BASE_URL no seu arquivo .env (ex: VITE_API_BASE_URL=http://localhost:3002 ou VITE_API_BASE_URL=/api)."
    );
}

export const API_BASE_URL = envBaseUrl.trim();

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
