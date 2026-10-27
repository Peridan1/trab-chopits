import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore, CUPONS_DISPONIVEIS } from "../../context/StoreContext";

export const Carrinho: React.FC = () => {
    const {
        carrinho,
        cupomAtivo,
        aplicarCupom,
        removerCupom,
        atualizarQuantidadeCarrinho,
        alternarSelecaoItemCarrinho,
        selecionarTodosCarrinho,
        removerDoCarrinho,
        limparItensSelecionadosCarrinho
    } = useStore();

    const [codigoInput, setCodigoInput] = useState("");
    const [metodoPagamento, setMetodoPagamento] = useState<"pix" | "cartao">("pix");
    const [pedidoFinalizado, setPedidoFinalizado] = useState(false);

    const itensSelecionados = useMemo(
        () => carrinho.filter((item) => item.selecionado),
        [carrinho]
    );

    const todosSelecionados =
        carrinho.length > 0 && carrinho.every((item) => item.selecionado);

    const subtotal = useMemo(() => {
        return itensSelecionados.reduce(
            (acc, item) => acc + item.preco * item.quantidade,
            0
        );
    }, [itensSelecionados]);

    const freteBase = itensSelecionados.length === 0 ? 0 : subtotal >= 199 ? 0 : 18.9;
    const freteFinal = cupomAtivo?.freteGratis ? 0 : freteBase;

    const descontoCupom = useMemo(() => {
        if (!cupomAtivo || subtotal === 0) return 0;
        if (cupomAtivo.minimoCompra && subtotal < cupomAtivo.minimoCompra) return 0;
        if (cupomAtivo.descontoPercentual) {
            return (subtotal * cupomAtivo.descontoPercentual) / 100;
        }
        if (cupomAtivo.descontoFixo) {
            return Math.min(subtotal, cupomAtivo.descontoFixo);
        }
        return 0;
    }, [cupomAtivo, subtotal]);

    const descontoPix = metodoPagamento === "pix" ? Math.max(0, (subtotal - descontoCupom) * 0.05) : 0;

    const totalFinal = Math.max(
        0,
        subtotal + freteFinal - descontoCupom - descontoPix
    );

    const handleAplicarCupomForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!codigoInput.trim()) return;
        if (aplicarCupom(codigoInput)) {
            setCodigoInput("");
        }
    };

    const handleFinalizarPedido = async () => {
        if (itensSelecionados.length === 0) return;
        await limparItensSelecionadosCarrinho();
        setPedidoFinalizado(true);
    };

    if (pedidoFinalizado) {
        return (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center my-4">
                <div className="display-3 mb-3">🎉</div>
                <h2 className="fw-bold text-success mb-2">Pedido Confirmado com Sucesso!</h2>
                <p className="text-muted col-md-7 mx-auto mb-4">
                    Seu pedido já está sendo preparado para envio pelo Centro de Distribuição Chopits.
                    Você receberá o código de rastreamento por e-mail.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/home" className="btn chopits-btn-primary px-4 py-2">
                        Voltar para a Vitrine
                    </Link>
                    <Link to="/produtos" className="btn btn-outline-secondary px-4 py-2">
                        Continuar Comprando
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold m-0">🛒 Meu Carrinho Chopits</h3>
                    <p className="text-muted small m-0">
                        Selecione os itens desejados, aplique cupons e finalize seu pedido com segurança
                    </p>
                </div>
                <Link to="/produtos" className="btn btn-outline-primary btn-sm">
                    + Adicionar mais produtos
                </Link>
            </div>

            {carrinho.length === 0 ? (
                <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
                    <div className="display-3 mb-3">🛍️</div>
                    <h4 className="fw-bold">Seu carrinho está vazio</h4>
                    <p className="text-muted small mb-4">
                        Aproveite as Ofertas Relâmpago de hoje e garanta frete grátis com cupom!
                    </p>
                    <div>
                        <Link to="/home" className="btn chopits-btn-primary px-4 py-2">
                            Explorar Ofertas do Dia
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {/* Lista de Itens com Seleção estilo Shopee */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
                            <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                                <div className="form-check m-0">
                                    <input
                                        id="chkTodos"
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={todosSelecionados}
                                        onChange={(e) => selecionarTodosCarrinho(e.target.checked)}
                                    />
                                    <label htmlFor="chkTodos" className="form-check-label fw-semibold small">
                                        Selecionar Todos ({carrinho.length} produtos)
                                    </label>
                                </div>
                                <span className="badge bg-primary bg-opacity-10 text-primary">
                                    ✓ Loja Oficial Chopits
                                </span>
                            </div>

                            <div className="list-group list-group-flush">
                                {carrinho.map((item) => (
                                    <div
                                        key={item.id || item.produtoId}
                                        className="list-group-item p-3 d-flex flex-wrap align-items-center justify-content-between gap-3"
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <input
                                                type="checkbox"
                                                className="form-check-input mt-0"
                                                checked={Boolean(item.selecionado)}
                                                onChange={() =>
                                                    item.id && alternarSelecaoItemCarrinho(item.id)
                                                }
                                            />
                                            <Link
                                                to={`/produto/${item.produtoId}`}
                                                className="rounded-3 bg-light d-flex align-items-center justify-content-center text-decoration-none"
                                                style={{ width: "64px", height: "64px", fontSize: "2.1rem" }}
                                            >
                                                {item.imagem || "📦"}
                                            </Link>
                                            <div>
                                                <Link
                                                    to={`/produto/${item.produtoId}`}
                                                    className="fw-bold text-dark text-decoration-none d-block"
                                                >
                                                    {item.nome}
                                                </Link>
                                                {item.variacaoEscolhida && (
                                                    <span className="badge bg-light text-secondary border mt-1">
                                                        Variação: {item.variacaoEscolhida}
                                                    </span>
                                                )}
                                                <div className="text-primary fw-bold mt-1">
                                                    R$ {item.preco.toFixed(2).replace(".", ",")}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-3 ms-auto">
                                            <div className="input-group input-group-sm" style={{ width: "110px" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() =>
                                                        item.id &&
                                                        atualizarQuantidadeCarrinho(
                                                            item.id,
                                                            item.quantidade - 1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <span className="form-control text-center fw-semibold">
                                                    {item.quantidade}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() =>
                                                        item.id &&
                                                        atualizarQuantidadeCarrinho(
                                                            item.id,
                                                            item.quantidade + 1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div className="text-end" style={{ minWidth: "95px" }}>
                                                <div className="small text-muted">Subtotal</div>
                                                <div className="fw-bold">
                                                    R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => item.id && removerDoCarrinho(item.id)}
                                                title="Remover item"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita: Cupons, Moedas & Resumo do Checkout */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-3">🎟️ Cupom & Vantagens Chopits</h5>

                            {/* Input de Cupom */}
                            <form onSubmit={handleAplicarCupomForm} className="d-flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm text-uppercase"
                                    placeholder="Código (ex: CHOPITS10)"
                                    value={codigoInput}
                                    onChange={(e) => setCodigoInput(e.target.value)}
                                />
                                <button type="submit" className="btn chopits-btn-primary btn-sm px-3">
                                    Aplicar
                                </button>
                            </form>

                            {/* Atalhos de Cupons */}
                            <div className="d-flex flex-wrap gap-1 mb-3">
                                {CUPONS_DISPONIVEIS.map((c) => (
                                    <button
                                        key={c.codigo}
                                        type="button"
                                        className={`badge border-0 py-1 px-2 ${
                                            cupomAtivo?.codigo === c.codigo
                                                ? "bg-success text-white"
                                                : "bg-light text-primary"
                                        }`}
                                        onClick={() => aplicarCupom(c.codigo)}
                                    >
                                        {c.codigo}
                                    </button>
                                ))}
                                {cupomAtivo && (
                                    <button
                                        type="button"
                                        className="badge bg-danger border-0 py-1 px-2"
                                        onClick={removerCupom}
                                    >
                                        Remover ✕
                                    </button>
                                )}
                            </div>

                            {/* Método de Pagamento */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-uppercase text-muted">
                                    Forma de Pagamento:
                                </label>
                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className={`btn btn-sm flex-grow-1 ${
                                            metodoPagamento === "pix"
                                                ? "chopits-btn-primary"
                                                : "btn-outline-secondary"
                                        }`}
                                        onClick={() => setMetodoPagamento("pix")}
                                    >
                                        💠 PIX (-5% OFF)
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn btn-sm flex-grow-1 ${
                                            metodoPagamento === "cartao"
                                                ? "chopits-btn-primary"
                                                : "btn-outline-secondary"
                                        }`}
                                        onClick={() => setMetodoPagamento("cartao")}
                                    >
                                        💳 Cartão (até 10x)
                                    </button>
                                </div>
                            </div>

                            <hr />

                            {/* Detalhamento de Valores */}
                            <div className="d-flex justify-content-between small mb-2">
                                <span className="text-muted">
                                    Produtos selecionados ({itensSelecionados.length}):
                                </span>
                                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                            </div>

                            <div className="d-flex justify-content-between small mb-2">
                                <span className="text-muted">Frete Expresso:</span>
                                {freteFinal === 0 ? (
                                    <span className="text-success fw-bold">GRÁTIS</span>
                                ) : (
                                    <span>R$ {freteFinal.toFixed(2).replace(".", ",")}</span>
                                )}
                            </div>

                            {descontoCupom > 0 && (
                                <div className="d-flex justify-content-between small text-success mb-2">
                                    <span>Desconto Cupom ({cupomAtivo?.codigo}):</span>
                                    <span>- R$ {descontoCupom.toFixed(2).replace(".", ",")}</span>
                                </div>
                            )}

                            {descontoPix > 0 && (
                                <div className="d-flex justify-content-between small text-success mb-2">
                                    <span>Desconto 5% no PIX:</span>
                                    <span>- R$ {descontoPix.toFixed(2).replace(".", ",")}</span>
                                </div>
                            )}

                            <div className="d-flex justify-content-between align-items-baseline border-top pt-3 mt-2 mb-3">
                                <span className="fw-bold">Total a Pagar:</span>
                                <span className="fs-4 fw-bold text-primary">
                                    R$ {totalFinal.toFixed(2).replace(".", ",")}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="btn chopits-btn-primary w-100 py-2 fw-bold"
                                disabled={itensSelecionados.length === 0}
                                onClick={handleFinalizarPedido}
                            >
                                Finalizar Compra ({itensSelecionados.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

