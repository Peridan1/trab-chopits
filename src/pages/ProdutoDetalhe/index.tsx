import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { ProductCard } from "../../components/ProductCard";

export const ProdutoDetalhe: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { produtos, adicionarAoCarrinho, favoritos, alternarFavorito } = useStore();

    const produto = produtos.find((p) => p.id === Number(id));
    const [variacaoSelecionada, setVariacaoSelecionada] = useState<string>(
        produto?.variacoes?.[0] || "Padrão"
    );
    const [quantidade, setQuantidade] = useState<number>(1);
    const [cep, setCep] = useState<string>("");
    const [freteCalculado, setFreteCalculado] = useState<string | null>(null);

    if (!produto) {
        return (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4">
                <div className="display-3 mb-3">📦</div>
                <h3 className="fw-bold">Produto não encontrado</h3>
                <p className="text-muted">O item que você procura não está disponível no momento.</p>
                <div>
                    <Link to="/produtos" className="btn chopits-btn-primary px-4">
                        Voltar para o Catálogo
                    </Link>
                </div>
            </div>
        );
    }

    const isFavorito = favoritos.includes(produto.id);
    const percentualDesconto =
        produto.precoOriginal && produto.precoOriginal > produto.preco
            ? Math.round(((produto.precoOriginal - produto.preco) / produto.precoOriginal) * 100)
            : 0;

    const simularFrete = (e: React.FormEvent) => {
        e.preventDefault();
        if (cep.replace(/\D/g, "").length < 8) {
            setFreteCalculado("⚠️ Digite um CEP válido com 8 dígitos.");
            return;
        }
        setFreteCalculado(
            produto.freteGratis
                ? "🚚 Frete Grátis Expresso Chopits — Chega em até 2 dias úteis!"
                : "🚚 Envio Expresso Chopits: R$ 14,90 — Chega em até 3 dias úteis."
        );
    };

    const handleComprarAgora = async () => {
        await adicionarAoCarrinho(produto, variacaoSelecionada, quantidade);
        navigate("/carrinho");
    };

    const relacionados = produtos
        .filter((p) => p.id !== produto.id && p.categoria === produto.categoria)
        .slice(0, 4);

    return (
        <div className="py-2">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-3">
                <ol className="breadcrumb small m-0">
                    <li className="breadcrumb-item">
                        <Link to="/home" className="text-decoration-none">Chopits</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/produtos/${produto.categoria}`} className="text-decoration-none text-capitalize">
                            {produto.categoria}
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {produto.nome}
                    </li>
                </ol>
            </nav>

            {/* Card Principal do Produto */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <div className="row g-4">
                    {/* Coluna da Imagem */}
                    <div className="col-md-5">
                        <div
                            className="rounded-4 d-flex align-items-center justify-content-center position-relative"
                            style={{
                                background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
                                minHeight: "340px",
                                fontSize: "7.5rem"
                            }}
                        >
                            {percentualDesconto > 0 && (
                                <span className="chopits-discount-badge fs-6 px-3 py-1">
                                    -{percentualDesconto}% OFF
                                </span>
                            )}
                            <span>{produto.imagem}</span>
                        </div>
                    </div>

                    {/* Coluna de Informações & Compra */}
                    <div className="col-md-7 d-flex flex-column justify-content-between">
                        <div>
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                                {produto.lojaOficial && (
                                    <span className="chopits-badge-oficial">✓ Loja Oficial Chopits</span>
                                )}
                                {produto.freteGratis && (
                                    <span className="chopits-badge-frete">🚚 Frete Grátis</span>
                                )}
                                {produto.ofertaRelampago && (
                                    <span className="badge bg-danger">⚡ Oferta Relâmpago</span>
                                )}
                            </div>

                            <h2 className="fw-bold mb-2">{produto.nome}</h2>

                            {/* Rating & Vendidos */}
                            <div className="d-flex flex-wrap align-items-center gap-3 text-muted small mb-3 pb-3 border-bottom">
                                <span>
                                    ⭐ <strong className="text-dark">{(produto.avaliacao || 4.9).toFixed(1)}</strong> de 5.0
                                </span>
                                <span>•</span>
                                <span>
                                    <strong>{produto.vendidos || 120}</strong> vendidos
                                </span>
                                <span>•</span>
                                <span className="text-success fw-semibold">
                                    ✓ Em estoque ({produto.estoque || 10} un.)
                                </span>
                            </div>

                            {/* Bloco de Preço */}
                            <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                                {produto.precoOriginal && produto.precoOriginal > produto.preco && (
                                    <div className="text-muted text-decoration-line-through small">
                                        De: R$ {produto.precoOriginal.toFixed(2).replace(".", ",")}
                                    </div>
                                )}
                                <div className="d-flex align-items-baseline gap-3">
                                    <span className="display-6 fw-bold text-primary">
                                        R$ {produto.preco.toFixed(2).replace(".", ",")}
                                    </span>
                                    <span className="badge bg-success bg-opacity-10 text-success border border-success-subtle">
                                        ✓ 5% de Desconto no PIX
                                    </span>
                                </div>
                                <div className="text-muted small mt-1">
                                    Em até <strong>10x de R$ {(produto.preco / 10).toFixed(2).replace(".", ",")}</strong> sem juros no cartão ou 5% extra no PIX
                                </div>
                            </div>

                            <p className="text-secondary mb-3">{produto.descricao}</p>

                            {/* Seletor de Variações */}
                            {produto.variacoes && produto.variacoes.length > 0 && (
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-uppercase text-muted">
                                        Escolha a Variação:
                                    </label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {produto.variacoes.map((v) => (
                                            <button
                                                key={v}
                                                type="button"
                                                className={`btn btn-sm rounded-pill px-3 ${
                                                    variacaoSelecionada === v
                                                        ? "chopits-btn-primary"
                                                        : "btn-outline-secondary"
                                                }`}
                                                onClick={() => setVariacaoSelecionada(v)}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Seletor de Quantidade & Simulador de CEP */}
                            <div className="row g-3 align-items-end mb-4">
                                <div className="col-sm-4">
                                    <label className="form-label small fw-bold text-uppercase text-muted">
                                        Quantidade:
                                    </label>
                                    <div className="input-group input-group-sm" style={{ maxWidth: "130px" }}>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                                        >
                                            -
                                        </button>
                                        <span className="form-control text-center fw-bold">
                                            {quantidade}
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setQuantidade((q) => q + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="col-sm-8">
                                    <form onSubmit={simularFrete} className="d-flex gap-2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Calcular frete (Digite seu CEP)"
                                            value={cep}
                                            onChange={(e) => setCep(e.target.value)}
                                            maxLength={9}
                                        />
                                        <button type="submit" className="btn btn-outline-primary btn-sm px-3">
                                            Calcular
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {freteCalculado && (
                                <div className="alert alert-success py-2 small mb-3">
                                    {freteCalculado}
                                </div>
                            )}
                        </div>

                        {/* Botões de Ação */}
                        <div className="d-flex flex-wrap gap-2 pt-3 border-top">
                            <button
                                type="button"
                                className="btn btn-outline-primary px-4 py-2 fw-semibold flex-grow-1"
                                onClick={() => adicionarAoCarrinho(produto, variacaoSelecionada, quantidade)}
                            >
                                🛒 Adicionar ao Carrinho
                            </button>
                            <button
                                type="button"
                                className="btn chopits-btn-primary px-4 py-2 fw-bold flex-grow-1"
                                onClick={handleComprarAgora}
                            >
                                ⚡ Comprar Agora
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-danger px-3 py-2"
                                onClick={() => alternarFavorito(produto.id)}
                                title="Salvar na Lista de Desejos"
                            >
                                {isFavorito ? "❤️ Salvo" : "🤍 Favoritar"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Avaliações do Produto */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                <h5 className="fw-bold mb-3">⭐ Avaliações de Clientes Verificados</h5>
                {produto.avaliacoes && produto.avaliacoes.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                        {produto.avaliacoes.map((av) => (
                            <div key={av.id} className="border-bottom pb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <strong className="small">{av.usuario}</strong>
                                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>{av.data}</span>
                                </div>
                                <div className="text-warning small mb-1">
                                    {"⭐".repeat(av.nota)}
                                </div>
                                <p className="text-secondary small m-0">{av.comentario}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted small m-0">
                        Este produto possui nota média <strong>{(produto.avaliacao || 4.8).toFixed(1)} ⭐</strong> com base nas avaliações verificadas da Chopits.
                    </p>
                )}
            </div>

            {/* Produtos Relacionados */}
            {relacionados.length > 0 && (
                <div>
                    <h5 className="fw-bold mb-3">🛍️ Quem viu este produto também comprou</h5>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
                        {relacionados.map((item) => (
                            <div className="col" key={item.id}>
                                <ProductCard produto={item} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

