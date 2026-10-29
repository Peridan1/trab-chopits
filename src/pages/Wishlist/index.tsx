import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";

export const Wishlist: React.FC = () => {
    const {
        produtos,
        favoritos,
        alternarFavorito,
        adicionarAoCarrinho,
        limparFavoritos,
        exibirNotificacao
    } = useStore();

    const produtosFavoritos = useMemo(() => {
        return produtos.filter((p) => favoritos.includes(p.id));
    }, [produtos, favoritos]);

    const handleAdicionarTodos = async () => {
        if (produtosFavoritos.length === 0) return;
        for (const produto of produtosFavoritos) {
            await adicionarAoCarrinho(produto);
        }
        exibirNotificacao(`🎉 ${produtosFavoritos.length} itens da lista foram adicionados ao carrinho!`);
    };

    return (
        <div className="py-2">
            {/* Cabeçalho da Lista de Desejos */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <h2 className="fw-bold m-0 d-flex align-items-center gap-2">
                        <span>❤️</span> Minha Lista de Desejos
                    </h2>
                    <p className="text-muted small m-0 mt-1">
                        {produtosFavoritos.length === 1
                            ? "1 item salvo para você comprar quando quiser"
                            : `${produtosFavoritos.length} itens salvos no seu navegador (localStorage)`}
                    </p>
                </div>

                {produtosFavoritos.length > 0 && (
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-primary fw-semibold btn-sm px-3 d-flex align-items-center gap-1 shadow-sm"
                            onClick={handleAdicionarTodos}
                        >
                            <span>🛒</span> Adicionar Todos ao Carrinho
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm px-3"
                            onClick={limparFavoritos}
                            title="Limpar todos os favoritos"
                        >
                            🗑️ Limpar Lista
                        </button>
                    </div>
                )}
            </div>

            {/* Conteúdo: Lista ou Estado Vazio */}
            {produtosFavoritos.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4">
                    <div className="display-3 mb-3">🤍</div>
                    <h3 className="fw-bold mb-2">Sua lista de desejos está vazia</h3>
                    <p className="text-muted col-md-6 mx-auto mb-4">
                        Nenhum produto foi favoritado ainda. Navegue pela nossa loja oficial e clique no coração ❤️ em qualquer produto para salvá-lo aqui.
                    </p>
                    <div>
                        <Link to="/produtos" className="btn chopits-btn-primary px-4 py-2">
                            Explorar Catálogo de Produtos →
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {produtosFavoritos.map((produto) => {
                        const desconto =
                            produto.precoOriginal && produto.precoOriginal > produto.preco
                                ? Math.round(((produto.precoOriginal - produto.preco) / produto.precoOriginal) * 100)
                                : 0;

                        return (
                            <div className="col" key={produto.id}>
                                <div className="chopits-product-card h-100 d-flex flex-column p-3">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <span className="badge bg-light text-primary border">
                                            {produto.categoria.toUpperCase()}
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger border-0 py-0 px-2"
                                            onClick={() => alternarFavorito(produto.id)}
                                            title="Remover dos favoritos"
                                        >
                                            ✕ Remover
                                        </button>
                                    </div>

                                    {/* Thumbnail */}
                                    <Link
                                        to={`/produto/${produto.id}`}
                                        className="chopits-card-thumb mb-3 text-decoration-none"
                                    >
                                        <span>{produto.imagem}</span>
                                    </Link>

                                    <div className="d-flex flex-column flex-grow-1">
                                        <Link
                                            to={`/produto/${produto.id}`}
                                            className="text-decoration-none text-dark fw-bold mb-1"
                                            style={{ fontSize: "1rem" }}
                                        >
                                            {produto.nome}
                                        </Link>

                                        <p className="text-muted small mb-3" style={{ fontSize: "0.85rem" }}>
                                            {produto.descricao}
                                        </p>

                                        <div className="mt-auto">
                                            {/* Preços */}
                                            <div className="d-flex align-items-baseline gap-2 mb-3">
                                                <span className="chopits-price-current">
                                                    R$ {produto.preco.toFixed(2).replace(".", ",")}
                                                </span>
                                                {desconto > 0 && produto.precoOriginal && (
                                                    <>
                                                        <span className="text-muted text-decoration-line-through small">
                                                            R$ {produto.precoOriginal.toFixed(2).replace(".", ",")}
                                                        </span>
                                                        <span className="badge bg-danger">
                                                            -{desconto}% OFF
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Ações */}
                                            <div className="d-grid gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary fw-semibold btn-sm py-2 d-flex align-items-center justify-content-center gap-2"
                                                    onClick={() => adicionarAoCarrinho(produto)}
                                                >
                                                    <span>🛒</span> Adicionar ao Carrinho
                                                </button>
                                                <Link
                                                    to={`/produto/${produto.id}`}
                                                    className="btn btn-outline-secondary btn-sm"
                                                >
                                                    Ver Detalhes do Produto
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
