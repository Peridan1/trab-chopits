# 🔄 Documentação de Transição: Dados Hardcoded -> API REST (JSON-Server)

Esta documentação explica a evolução técnica ocorrida na página de **Usuários** (`src/pages/Usuarios/index.tsx`), mostrando a transição de um array estático *hardcoded* para a integração assíncrona dinâmica utilizando **Axios** e **JSON-Server**.

---

## 1. Abordagem Inicial (Hardcoded)

Na versão inicial desenvolvida em sala de aula/projeto inicial, os dados de usuários eram declarados diretamente como uma constante no código-fonte:

```tsx
// Código legado em src/pages/Usuarios/index.tsx
const usuarios = [
    {
        "id": 1,
        "nome": "Felipe",
        "email": "espetinho@gmail.com",
    },
    {
        "id": 2,
        "nome": "Claudio",
        "email": "claudio@gmail.com"
    },
    {
        "id": 3,
        "nome": "Daniel",
        "email": "Daniel@gmail.com"
    }
]
```

### Limitações da abordagem estática:
1. **Sem Persistência Real:** Alterações (como adicionar, editar ou excluir) eram perdidas assim que a página atualizava.
2. **Incompatível com Backend:** Não havia consumo HTTP de rotas RESTful.
3. **Ausência de Estados de Carregamento:** A interface não tratava carregamento (`loading`) nem erros de conexão HTTP.

---

A nova versão consome dinamicamente os endpoints REST fornecidos pelo `json-server`:
- `http://localhost:3001/usuarios`
- `http://localhost:3001/produtos`
- `http://localhost:3001/carrinho`

O arquivo `jsonserver/dados.json` atua como um banco de dados NoSQL/JSON persistente, registrando automaticamente no disco todas as operações de criação (POST), alteração (PUT) e exclusão (DELETE) efetuadas pela aplicação React.

### Estrutura do Código Refatorado:

```tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Usuario {
    id: number;
    nome: string;
    email: string;
}

const API_URL = "http://localhost:3001/usuarios";

export const Usuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 1. GET: Buscar Usuários da API
    const carregarUsuarios = async () => {
        try {
            const resposta = await axios.get<Usuario[]>(API_URL);
            setUsuarios(resposta.data);
        } catch (erro) {
            console.error("Erro na API:", erro);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    // 2. POST: Criar Usuário
    const criarUsuario = async (novoUsuario: { nome: string; email: string }) => {
        const resposta = await axios.post<Usuario>(API_URL, novoUsuario);
        setUsuarios(prev => [...prev, resposta.data]);
    };

    // 3. PUT: Editar Usuário
    const editarUsuario = async (id: number, dadosAtualizados: { nome: string; email: string }) => {
        await axios.put(`${API_URL}/${id}`, dadosAtualizados);
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ...dadosAtualizados } : u));
    };

    // 4. DELETE: Excluir Usuário
    const excluirUsuario = async (id: number) => {
        await axios.delete(`${API_URL}/${id}`);
        setUsuarios(prev => prev.filter(u => u.id !== id));
    };
    
    // Renderização do JSX...
}
```

---

## 3. Principais Benefícios da Transição

| Funcionalidade | Hardcoded (Anterior) | API REST (Atual) |
| :--- | :--- | :--- |
| **Persistência** | Memória temporária da sessão | Arquivo `jsonserver/dados.json` |
| **Mapeamento HTTP** | Nenhum | GET, POST, PUT, DELETE |
| **Experiência de Usuário (UX)** | Estática | Modais de Cadastro/Edição, Spinners de Loading e Alertas |
| **Tratamento de Erros** | Inexistente | Fallback com estado local se o servidor estiver offline |

---

*Documentação elaborada para acompanhamento técnico e acadêmico do projeto Chopits.*
