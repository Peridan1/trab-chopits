import React, { useState } from "react";
import type { Produto } from "../../types";

interface BulkPriceModalProps {
    aberto: boolean;
    aoFechar: () => void;
    produtos: Produto[];
    aoAplicar: (percentual: number, categoriaAlvo: string) => Promise<void>;
}

export const BulkPriceModal: React.FC<BulkPriceModalProps> = ({
    aberto,
    aoFechar,
    produtos,
    aoAplicar
}) => {
    const [percentualStr, setPercentualStr] = useState<string>("-10");
    const [categoriaAlvo, setCategoriaAlvo] = useState<string>("todas");
    const [aplicando, setAplicando] = useState<boolean>(false);

    if (!aberto) return null;

    const percentual = parseFloat(percentualStr) || 0;
    const produtosAlvo = produtos.filter(
        (p) => categoriaAlvo === "todas" || p.categoria === categoriaAlvo
    );

    const produtoExemplo = produtosAlvo[0] || produtos[0];
    const precoAntigo = produtoExemplo?.preco || 100;
    const precoNovo = Math.max(1, Number((precoAntigo * (1 + percentual / 100)).toFixed(2)));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (percentual === 0) return;
        setAplicando(true);
        try {
            await aoAplicar(percentual, categoriaAlvo);
            aoFechar();
        } finally {
            setAplicando(false);
        }
    };

    const ATALHOS = [
        { label: "-20% (Mega Promo)", val: -20 },
        { label: "-15%", val: -15 },
        { label: "-10%", val: -10 },
        { label: "-5%", val: -5 },
        { label: "+5%", val: 5 },
        { label: "+10%", val: 10 }
    ];

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", zIndex: 1060, backdropFilter: "blur(4px)" }}
            onClick={aoFechar}
        >
            <div
                className="card border-0 shadow-lg rounded-4 p-4 w-100"
                style={{ maxWidth: "480px" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <span
                            className="rounded-3 d-inline-flex align-items-center justify-content-center fs-5"
                            style={{ width: "40px", height: "40px", backgroundColor: "#eef2ff" }}
                        >
                            🏷️
                        </span>
                        <div>
                            <h5 className="fw-bold m-0">Reajuste & Promoção em Massa</h5>
                            <small className="text-muted">
                                Grava snapshot automático para reversão em 1 clique
                            </small>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={aoFechar}
                        aria-label="Fechar"
                    />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-uppercase text-muted">
                            Aplicar em qual departamento:
                        </label>
                        <select
                            className="form-select"
                            value={categoriaAlvo}
                            onChange={(e) => setCategoriaAlvo(e.target.value)}
                        >
                            <option value="todas">
                                Todos os Produtos ({produtos.length} itens)
                            </option>
                            <option value="eletronicos">Somente Eletrônicos</option>
                            <option value="games">Somente Games & Setup</option>
                            <option value="acessorios">Somente Acessórios</option>
                            <option value="moda">Somente Moda Tech</option>
                            <option value="casa">Somente Casa & Office</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold text-uppercase text-muted">
                            Percentual de Ajuste (%):
                        </label>
                        <div className="input-group">
                            <input
                                type="number"
                                step="0.5"
                                className="form-control fw-bold"
                                value={percentualStr}
                                onChange={(e) => setPercentualStr(e.target.value)}
                                placeholder="Ex: -10 para desconto ou 5 para aumento"
                                required
                            />
                            <span className="input-group-text fw-bold">%</span>
                        </div>
                    </div>

                    {/* Botões Rápidos */}
                    <div className="mb-3">
                        <span className="text-muted small fw-semibold d-block mb-1">
                            Atalhos rápidos:
                        </span>
                        <div className="d-flex flex-wrap gap-1">
                            {ATALHOS.map((item) => (
                                <button
                                    key={item.label}
                                    type="button"
                                    className={`btn btn-sm rounded-pill px-3 ${
                                        percentual === item.val
                                            ? "chopits-btn-primary"
                                            : item.val < 0
                                            ? "btn-outline-danger"
                                            : "btn-outline-success"
                                    }`}
                                    onClick={() => setPercentualStr(String(item.val))}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview ao Vivo */}
                    {produtoExemplo && (
                        <div className="p-3 rounded-3 bg-light border mb-4">
                            <div className="small text-muted fw-semibold mb-1">
                                🔎 Simulação ao vivo ({produtosAlvo.length} produtos afetados):
                            </div>
                            <div className="small text-dark fw-medium mb-1">
                                Exemplo: <strong>{produtoExemplo.nome}</strong>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted text-decoration-line-through small">
                                    R$ {precoAntigo.toFixed(2).replace(".", ",")}
                                </span>
                                <span>→</span>
                                <span
                                    className={`fw-bold fs-5 ${
                                        percentual < 0 ? "text-danger" : "text-success"
                                    }`}
                                >
                                    R$ {precoNovo.toFixed(2).replace(".", ",")}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-light px-3"
                            onClick={aoFechar}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn chopits-btn-primary px-4"
                            disabled={aplicando || percentual === 0}
                        >
                            {aplicando ? "Aplicando..." : "Confirmar Reajuste em Lote"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

