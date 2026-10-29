import React from "react";

export interface ConfirmModalConfig {
    aberto: boolean;
    titulo: string;
    mensagem: string;
    textoConfirmar?: string;
    variante?: "danger" | "warning" | "primary";
    aoConfirmar: () => void;
}

interface AdminConfirmModalProps {
    config: ConfirmModalConfig;
    aoFechar: () => void;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
    config,
    aoFechar
}) => {
    if (!config.aberto) return null;

    const btnClass =
        config.variante === "danger"
            ? "btn-danger"
            : config.variante === "warning"
            ? "btn-warning text-dark"
            : "chopits-btn-primary";

    const icone =
        config.variante === "danger"
            ? "🗑️"
            : config.variante === "warning"
            ? "⚠️"
            : "ℹ️";

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", zIndex: 1070, backdropFilter: "blur(4px)" }}
            onClick={aoFechar}
        >
            <div
                className="card border-0 shadow-lg rounded-4 p-4 w-100 text-center"
                style={{ maxWidth: "420px" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="fs-1 mb-2">{icone}</div>
                <h5 className="fw-bold mb-2">{config.titulo}</h5>
                <p className="text-muted small mb-4">{config.mensagem}</p>

                <div className="d-flex justify-content-center gap-2">
                    <button
                        type="button"
                        className="btn btn-light px-4"
                        onClick={aoFechar}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className={`btn ${btnClass} px-4 fw-semibold`}
                        onClick={() => {
                            config.aoConfirmar();
                            aoFechar();
                        }}
                    >
                        {config.textoConfirmar || "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

