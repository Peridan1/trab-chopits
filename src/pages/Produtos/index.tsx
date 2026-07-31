import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api, ENDPOINTS } from "../../services/api";
import type { Produto, ItemCarrinho } from "../../types";

export const Produtos: React.FC = () => {
    const { parametro } = useParams<{ parametro?: string }>();
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    // Filtros
    const [busca, setBusca] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState(parametro || "todas");

    // Modal de Cadastro de Produto
    const [modalAberto, setModalAberto] = useState(false);
    const [nomeInput, setNomeInput] = useState("");
    const [categoriaInput, setCategoriaInput] = useState("eletronicos");
    const [precoInput, setPrecoInput] = useState("");
    const [imagemInput, setImagemInput] = useState("📦");
    const [descricaoInput, setDescricaoInput] = useState("");
    const [estoqueInput, setEstoqueInput] = useState("10");

    // Carregar Produtos da API (dados.json)
    const carregarDados = async () => {
        setLoading(true);
        setErro(null);
        try {
            const [respProdutos, respCarrinho] = await Promise.allSettled([
                api.get<Produto[]>(ENDPOINTS.PRODUTOS),
                api.get<ItemCarrinho[]>(ENDPOINTS.CARRINHO)
            ]);

            if (respProdutos.status === "fulfilled") {
                setProdutos(respProdutos.value.data);
            }
            if (respCarrinho.status === "fulfilled") {
                setCarrinho(respCarrinho.value.data);
            }
        } catch (err: unknown) {
            console.error("Erro ao carregar produtos:", err);
            setErro("Não foi possível conectar ao json-server. Exibindo dados locais.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    // Adicionar Produto ao Carrinho na API (POST /carrinho)
    const adicionarAoCarrinho = async (produto: Produto) => {
        const itemExistente = carrinho.find(c => c.produtoId === produto.id);

        try {
            if (itemExistente && itemExistente.id) {
                const novaQtd = itemExistente.quantidade + 1;
                await api.put(`${ENDPOINTS.CARRINHO}/${itemExistente.id}`, {
                    ...itemExistente,
                    quantidade: novaQtd
                });
                setCarrinho(prev =>
                    prev.map(c => c.id === itemExistente.id ? { ...c, quantidade: novaQtd } : c)
                );
            } else {
                const novoItem: ItemCarrinho = {
                    produtoId: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    quantidade: 1
                };
                const resp = await api.post<ItemCarrinho>(ENDPOINTS.CARRINHO, novoItem);
                setCarrinho(prev => [...prev, resp.data]);
            }
            alert(`" ${produto.nome} " foi adicionado ao seu carrinho! 🛒`);
        } catch (err) {
            console.error("Erro ao adicionar no carrinho:", err);
            setCarrinho(prev => [...prev, { produtoId: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 }]);
        }
    };

    // Criar Novo Produto no Catálogo (POST /produtos)
    const salvarNovoProduto = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nomeInput.trim() || !precoInput) return;

        const novoProdutoData = {
            nome: nomeInput.trim(),
            categoria: categoriaInput,
            preco: parseFloat(precoInput),
            imagem: imagemInput || "📦",
            descricao: descricaoInput.trim() || "Produto sem descrição.",
            estoque: parseInt(estoqueInput, 10) || 10
        };

        try {
            const resp = await api.post<Produto>(ENDPOINTS.PRODUTOS, novoProdutoData);
            setProdutos(prev => [...prev, resp.data]);
            setModalAberto(false);
            limparFormulario();
        } catch (err) {
            console.error("Erro ao criar produto:", err);
            const novoId = produtos.length ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
            setProdutos(prev => [...prev, { id: novoId, ...novoProdutoData }]);
            setModalAberto(false);
            limparFormulario();
        }
    };

    // Excluir Produto (DELETE /produtos/:id)
    const excluirProduto = async (id: number) => {
        if (!window.confirm("Deseja realmente remover este produto do banco de dados (dados.json)?")) return;
        try {
            await api.delete(`${ENDPOINTS.PRODUTOS}/${id}`);
            setProdutos(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error("Erro ao excluir produto:", err);
            setProdutos(prev => prev.filter(p => p.id !== id));
        }
    };

    const limparFormulario = () => {
        setNomeInput("");
        setCategoriaInput("eletronicos");
        setPrecoInput("");
        setImagemInput("📦");
        setDescricaoInput("");
        setEstoqueInput("10");
    };

    const totalItensCarrinho = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    const produtosFiltrados = produtos.filter(p => {
        const atendeCategoria =
            categoriaFiltro === "todas" ||
            p.categoria.toLowerCase() === categoriaFiltro.toLowerCase() ||
            (parametro && p.id.toString() === parametro);
        
        const atendeBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) ||
                            p.descricao.toLowerCase().includes(busca.toLowerCase());

        return atendeCategoria && atendeBusca;
    });

    return (
        <div className="py-2">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">Catálogo de Produtos Chopits</h2>
                    <p className="text-muted mb-0">
                        Consumo refatorado via cliente centralizado <code>api</code>
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-success btn-sm" onClick={() => setModalAberto(!modalAberto)}>
                        ➕ Novo Produto
                    </button>
                    <span className="badge bg-primary fs-6 p-2">
                        🛒 Carrinho API: {totalItensCarrinho} {totalItensCarrinho === 1 ? "item" : "itens"}
                    </span>
                </div>
            </div>

            {erro && (
                <div className="alert alert-warning mb-4" role="alert">
                    ⚠️ {erro}
                </div>
            )}

            {/* Modal para Cadastro de Produto */}
            {modalAberto && (
                <div className="card shadow-sm border-success mb-4">
                    <div className="card-header bg-success text-white fw-semibold">
                        🛍️ Cadastrar Novo Produto
                    </div>
                    <div className="card-body">
                        <form onSubmit={salvarNovoProduto}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Nome do Produto:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ex: Mouse Sem Fio Ergológico"
                                        value={nomeInput}
                                        onChange={e => setNomeInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Categoria:</label>
                                    <select
                                        className="form-select"
                                        value={categoriaInput}
                                        onChange={e => setCategoriaInput(e.target.value)}
                                    >
                                        <option value="eletronicos">Eletrônicos</option>
                                        <option value="acessorios">Acessórios</option>
                                        <option value="moda">Moda</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Preço (R$):</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        placeholder="99.90"
                                        value={precoInput}
                                        onChange={e => setPrecoInput(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label fw-semibold">Ícone / Emoji:</label>
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={imagemInput}
                                        onChange={e => setImagemInput(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label fw-semibold">Estoque:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={estoqueInput}
                                        onChange={e => setEstoqueInput(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <label className="form-label fw-semibold">Descrição:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Detalhes e especificações..."
                                        value={descricaoInput}
                                        onChange={e => setDescricaoInput(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-3 d-flex gap-2 justify-content-end">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalAberto(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-success">
                                    Salvar no Banco
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Barra de Filtros */}
            <div className="card p-3 mb-4 shadow-sm bg-light">
                <div className="row g-3">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nome ou descrição..."
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={categoriaFiltro}
                            onChange={e => setCategoriaFiltro(e.target.value)}
                        >
                            <option value="todas">Todas as Categorias</option>
                            <option value="eletronicos">Eletrônicos</option>
                            <option value="acessorios">Acessórios</option>
                            <option value="moda">Moda</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Loading ou Grid */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p className="mt-2 text-muted">Carregando catálogo...</p>
                </div>
            ) : produtosFiltrados.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    Nenhum produto encontrado para os filtros selecionados.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {produtosFiltrados.map((produto) => (
                        <div className="col" key={produto.id}>
                            <div className="card h-100 shadow-sm border-0 position-relative">
                                <button
                                    className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 text-danger rounded-circle shadow-sm"
                                    onClick={() => excluirProduto(produto.id)}
                                    title="Excluir produto"
                                >
                                    🗑️
                                </button>

                                <div className="card-body p-4 d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="display-3 text-center mb-3 p-3 bg-light rounded">
                                            {produto.imagem}
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="badge bg-secondary text-uppercase fs-7">
                                                {produto.categoria}
                                            </span>
                                            <span className="fs-5 fw-bold text-success">
                                                R$ {produto.preco.toFixed(2)}
                                            </span>
                                        </div>
                                        <h5 className="card-title fw-bold text-dark">{produto.nome}</h5>
                                        <p className="card-text text-muted small">{produto.descricao}</p>
                                        {produto.estoque !== undefined && (
                                            <p className="small text-secondary mb-0">
                                                📦 Estoque: <strong>{produto.estoque} unidades</strong>
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-2 border-top">
                                        <button
                                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                            onClick={() => adicionarAoCarrinho(produto)}
                                        >
                                            <span>🛒</span> Adicionar ao Carrinho
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};