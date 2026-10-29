import React, { useMemo } from "react";
import type { Produto } from "../../types";

interface ChopitsKPIsProps {
    produtos: Produto[];
}

export const ChopitsKPIs: React.FC<ChopitsKPIsProps> = ({ produtos }) => {
    // Conceito Acadêmico: useMemo inspirado no ProductKPIs da Peixaria Brisamar
    const stats = useMemo(() => {
        const total = produtos.length;
        const emOfertaRelampago = produtos.filter((p) => p.ofertaRelampago).length;
        const comFreteGratis = produtos.filter((p) => p.freteGratis).length;
        const estoqueTotal = produtos.reduce((acc, p) => acc + (p.estoque ?? 0), 0);
        const categoriasUnicas = new Set(produtos.map((p) => p.categoria)).size;

        return {
            total,
            emOfertaRelampago,
            comFreteGratis,
            estoqueTotal,
            categoriasUnicas
        };
    }, [produtos]);

    return (
        <div className="row row-cols-2 row-cols-lg-4 g-3 mb-4">
            {/* 1. Total de Produtos */}
            <div className="col">
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center fs-3"
                            style={{
                                width: "52px",
                                height: "52px",
                                backgroundColor: "#eef2ff",
                                color: "#4f46e5"
                            }}
                        >
                            📦
                        </div>
                        <div>
                            <span
                                className="text-muted fw-bold text-uppercase d-block"
                                style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                            >
                                Total de Itens
                            </span>
                            <div className="fs-3 fw-bold text-dark lh-1 my-1">
                                {stats.total}
                            </div>
                            <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                                Em {stats.categoriasUnicas} departamentos
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Ofertas Relâmpago */}
            <div className="col">
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center fs-3"
                            style={{
                                width: "52px",
                                height: "52px",
                                backgroundColor: "#ffe4e6",
                                color: "#f43f5e"
                            }}
                        >
                            ⚡
                        </div>
                        <div>
                            <span
                                className="text-muted fw-bold text-uppercase d-block"
                                style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                            >
                                Flash Deals Ativos
                            </span>
                            <div className="fs-3 fw-bold text-danger lh-1 my-1">
                                {stats.emOfertaRelampago}
                            </div>
                            <span className="text-danger" style={{ fontSize: "0.72rem" }}>
                                Destaques com cronômetro
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Frete Grátis */}
            <div className="col">
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center fs-3"
                            style={{
                                width: "52px",
                                height: "52px",
                                backgroundColor: "#d1fae5",
                                color: "#059669"
                            }}
                        >
                            🚚
                        </div>
                        <div>
                            <span
                                className="text-muted fw-bold text-uppercase d-block"
                                style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                            >
                                Com Frete Grátis
                            </span>
                            <div className="fs-3 fw-bold text-success lh-1 my-1">
                                {stats.comFreteGratis}
                            </div>
                            <span className="text-success" style={{ fontSize: "0.72rem" }}>
                                Envio Expresso Chopits
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Unidades em Estoque */}
            <div className="col">
                <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                    <div className="d-flex align-items-center gap-3">
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center fs-3"
                            style={{
                                width: "52px",
                                height: "52px",
                                backgroundColor: "#fef3c7",
                                color: "#d97706"
                            }}
                        >
                            📊
                        </div>
                        <div>
                            <span
                                className="text-muted fw-bold text-uppercase d-block"
                                style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                            >
                                Estoque Total
                            </span>
                            <div className="fs-3 fw-bold text-dark lh-1 my-1">
                                {stats.estoqueTotal}
                            </div>
                            <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                                Unidades disponíveis
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

