import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { ProductCard } from "../../components/ProductCard";

export const Produtos: React.FC = () => {
    const { parametro } = useParams<{ parametro?: string }>();
    const { produtos, buscaGlobal, setBuscaGlobal, loading } = useStore();

    const [categoriaFiltro, setCategoriaFiltro] = useState<string>(parametro || "todas");
    const [ordenacao, setOrdenacao] = useState<"relevancia" | "vendidos" | "menor_preco" | "maior_preco">("relevancia");
    const [apenasFreteGratis, setApenasFreteGratis] = useState<boolean>(false);
    const [apenasRelampago, setApenasRelampago] = useState<boolean>(parametro === "ofertas");

    useEffect(() => {
        if (parametro === "ofertas") {
            setCategoriaFiltro("todas");
            setApenasRelampago(true);
        } else if (parametro) {
            setCategoriaFiltro(parametro.toLowerCase());
            setApenasRelampago(false);
        } else {
            setCategoriaFiltro("todas");
        }
    }, [parametro]);

    const produtosFiltradosEOrdenados = useMemo(() => {
        const filtrados = produtos.filter((p) => {
            const matchCat =
                categoriaFiltro === "todas" ||
                categoriaFiltro === "ofertas" ||
                p.categoria.toLowerCase() === categoriaFiltro ||
                String(p.id) === categoriaFiltro;

            const termo = buscaGlobal.trim().toLowerCase();
            const matchBusca =
                !termo ||
                p.nome.toLowerCase().includes(termo) ||
                p.descricao.toLowerCase().includes(termo) ||
                p.categoria.toLowerCase().includes(termo);

            const matchFrete = !apenasFreteGratis || Boolean(p.freteGratis);
            const matchFlash = !apenasRelampago || Boolean(p.ofertaRelampago);

            return matchCat && matchBusca && matchFrete && matchFlash;
        });

        return [...filtrados].sort((a, b) => {
            if (ordenacao === "vendidos") return (b.vendidos || 0) - (a.vendidos || 0);
            if (ordenacao === "menor_preco") return a.preco - b.preco;
            if (ordenacao === "maior_preco") return b.preco - a.preco;
            return 0;
        });
    }, [produtos, categoriaFiltro, buscaGlobal, apenasFreteGratis, apenasRelampago, ordenacao]);

    return (
        <div className="py-2">
            {/* Cabeçalho do Catálogo */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <div>
                    <h3 className="fw-bold m-0">📦 Catálogo Oficial Chopits</h3>
                    <p className="text-muted small m-0">
                        {parametro ? (
                            <>
                                Rota dinâmica ativa: <code>/produtos/{parametro}</code>
                            </>
                        ) : (
                            "Explore todos os departamentos com garantia e envio rápido"
                        )}
                    </p>
                </div>

                <Link to="/admin" className="btn btn-outline-primary btn-sm">
                    ➕ Cadastrar / Gerenciar Produtos
                </Link>
            </div>

            {/* Barra de Filtros e Ordenação Estilo Marketplace */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
                <div className="row g-3 align-items-center">
                    {/* Filtro de Categoria */}
                    <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted mb-1">
                            Departamento:
                        </label>
                        <select
                            className="form-select form-select-sm"
                            value={categoriaFiltro}
                            onChange={(e) => setCategoriaFiltro(e.target.value)}
                        >
                            <option value="todas">Todos os Departamentos</option>
                            <option value="eletronicos">🎧 Eletrônicos</option>
                            <option value="games">⌨️ Games & Setup</option>
                            <option value="acessorios">🎒 Acessórios</option>
                            <option value="moda">👕 Moda Tech</option>
                            <option value="casa">💡 Casa & Office</option>
                        </select>
                    </div>

                    {/* Ordenação */}
                    <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted mb-1">
                            Ordenar por:
                        </label>
                        <select
                            className="form-select form-select-sm"
                            value={ordenacao}
                            onChange={(e) =>
                                setOrdenacao(
                                    e.target.value as
                                        | "relevancia"
                                        | "vendidos"
                                        | "menor_preco"
                                        | "maior_preco"
                                )
                            }
                        >
                            <option value="relevancia">✨ Mais Relevantes</option>
                            <option value="vendidos">🔥 Mais Vendidos</option>
                            <option value="menor_preco">💲 Menor Preço</option>
                            <option value="maior_preco">💎 Maior Preço</option>
                        </select>
                    </div>

                    {/* Checkboxes Rápidos */}
                    <div className="col-md-4 d-flex flex-wrap gap-3 pt-md-3">
                        <div className="form-check m-0">
                            <input
                                id="filtroFrete"
                                type="checkbox"
                                className="form-check-input"
                                checked={apenasFreteGratis}
                                onChange={(e) => setApenasFreteGratis(e.target.checked)}
                            />
                            <label htmlFor="filtroFrete" className="form-check-label small fw-semibold">
                                🚚 Frete Grátis
                            </label>
                        </div>

                        <div className="form-check m-0">
                            <input
                                id="filtroRelampago"
                                type="checkbox"
                                className="form-check-input"
                                checked={apenasRelampago}
                                onChange={(e) => setApenasRelampago(e.target.checked)}
                            />
                            <label htmlFor="filtroRelampago" className="form-check-label small fw-semibold text-danger">
                                ⚡ Ofertas Relâmpago
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grade de Produtos */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                </div>
            ) : produtosFiltradosEOrdenados.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                    <div className="display-4 mb-2">🔍</div>
                    <h5 className="fw-bold">Nenhum produto corresponde aos filtros selecionados</h5>
                    <p className="text-muted small">
                        Experimente remover alguns filtros para ver todas as opções disponíveis.
                    </p>
                    <div>
                        <button
                            type="button"
                            className="btn chopits-btn-primary btn-sm px-4"
                            onClick={() => {
                                setCategoriaFiltro("todas");
                                setApenasFreteGratis(false);
                                setApenasRelampago(false);
                                setBuscaGlobal("");
                            }}
                        >
                            Limpar Todos os Filtros
                        </button>
                    </div>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                    {produtosFiltradosEOrdenados.map((produto) => (
                        <div className="col" key={produto.id}>
                            <ProductCard
                                produto={produto}
                                mostrarBarraRelampago={apenasRelampago}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
