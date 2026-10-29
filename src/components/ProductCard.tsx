import React from "react";
import { Link } from "react-router-dom";
import type { Produto } from "../types";
import { useStore } from "../context/StoreContext";

interface ProductCardProps {
    produto: Produto;
    mostrarBarraRelampago?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    produto,
    mostrarBarraRelampago = false
}) => {
    const { adicionarAoCarrinho, favoritos, alternarFavorito } = useStore();
    const isFavorito = favoritos.includes(produto.id);

    const percentualDesconto =
        produto.precoOriginal && produto.precoOriginal > produto.preco
            ? Math.round(((produto.precoOriginal - produto.preco) / produto.precoOriginal) * 100)
            : 0;

    const formatarVendidos = (qtd?: number) => {
        if (!qtd) return "Novo";
        if (qtd >= 1000) {
            return `${(qtd / 1000).toFixed(1).replace(".", ",")} mil vendidos`;
        }
        return `${qtd} vendidos`;
    };

    // Progresso visual para Ofertas Relâmpago
    const percentualVendidoRelampago = Math.min(
        92,
        Math.max(45, Math.round(100 - (produto.estoque || 10) * 2.2))
    );

    return (
        <div className="chopits-product-card h-100 d-flex flex-column">
            {/* Botão Favoritar (Lista de Desejos localStorage) */}
            <button
                type="button"
                className="chopits-wishlist-btn"
                title={isFavorito ? "Remover da Lista de Desejos" : "Salvar na Lista de Desejos"}
                onClick={(e) => {
                    e.preventDefault();
                    alternarFavorito(produto.id);
                }}
            >
                <span>{isFavorito ? "❤️" : "🤍"}</span>
            </button>

            {/* Badge de % de Desconto */}
            {percentualDesconto > 0 && (
                <span className="chopits-discount-badge">-{percentualDesconto}% OFF</span>
            )}

            {/* Thumbnail clicável para Detalhes do Produto */}
            <Link to={`/produto/${produto.id}`} className="chopits-card-thumb">
                <span>{produto.imagem}</span>
            </Link>

            <div className="p-3 d-flex flex-column flex-grow-1">
                {/* Selos Loja Oficial & Frete Grátis */}
                <div className="d-flex flex-wrap gap-1 mb-2">
                    {produto.lojaOficial && (
                        <span className="chopits-badge-oficial">✓ Oficial</span>
                    )}
                    {produto.freteGratis && (
                        <span className="chopits-badge-frete">🚚 Frete Grátis</span>
                    )}
                    {produto.ofertaRelampago && !mostrarBarraRelampago && (
                        <span className="badge bg-danger bg-opacity-10 text-danger border border-danger-subtle" style={{ fontSize: "0.66rem" }}>
                            ⚡ Relâmpago
                        </span>
                    )}
                </div>

                {/* Título do Produto */}
                <Link
                    to={`/produto/${produto.id}`}
                    className="text-decoration-none text-dark fw-semibold mb-1"
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: "0.94rem",
                        minHeight: "2.7rem"
                    }}
                >
                    {produto.nome}
                </Link>

                {/* Preço De / Por */}
                <div className="mt-auto pt-2">
                    {produto.precoOriginal && produto.precoOriginal > produto.preco && (
                        <div className="text-muted text-decoration-line-through" style={{ fontSize: "0.78rem" }}>
                            R$ {produto.precoOriginal.toFixed(2).replace(".", ",")}
                        </div>
                    )}
                    <div className="d-flex align-items-baseline justify-content-between">
                        <span className="chopits-price-current">
                            R$ {produto.preco.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="text-muted" style={{ fontSize: "0.73rem" }}>
                            em até 6x s/ juros
                        </span>
                    </div>

                    {/* Avaliações e Quantidade Vendida */}
                    <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top text-muted" style={{ fontSize: "0.76rem" }}>
                        <span>
                            ⭐ <strong className="text-dark">{(produto.avaliacao || 4.8).toFixed(1)}</strong>
                        </span>
                        <span>{formatarVendidos(produto.vendidos)}</span>
                    </div>

                    {/* Barra de Progresso de Oferta Relâmpago */}
                    {mostrarBarraRelampago && (
                        <div className="chopits-flash-bar mt-2">
                            <div
                                className="chopits-flash-bar-fill"
                                style={{ width: `${percentualVendidoRelampago}%` }}
                            />
                            <div className="chopits-flash-bar-label">
                                🔥 {percentualVendidoRelampago}% VENDIDO
                            </div>
                        </div>
                    )}

                    {/* Ações do Card */}
                    <div className="d-flex gap-2 mt-3">
                        <button
                            type="button"
                            className="btn chopits-btn-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-2"
                            onClick={() => adicionarAoCarrinho(produto)}
                        >
                            <span>🛒</span> Adicionar
                        </button>
                        <Link
                            to={`/produto/${produto.id}`}
                            className="btn btn-outline-secondary btn-sm px-2 d-flex align-items-center"
                            title="Ver Detalhes"
                        >
                            👁️
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

