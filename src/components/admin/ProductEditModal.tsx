import React, { useState, useEffect } from "react";
import type { Produto } from "../../types";

interface ProductEditModalProps {
    aberto: boolean;
    modo: "criar" | "editar";
    produtoInicial?: Produto | null;
    aoFechar: () => void;
    aoSalvar: (dados: Omit<Produto, "id">, idExistente?: number) => Promise<void>;
}

const ICONES_SUGERIDOS = ["🎧", "⌚", "🎒", "👕", "⌨️", "🕶️", "🖱️", "💡", "📱", "💻", "🎮", "👟"];

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
    aberto,
    modo,
    produtoInicial,
    aoFechar,
    aoSalvar
}) => {
    const [nome, setNome] = useState("");
    const [categoria, setCategoria] = useState("eletronicos");
    const [preco, setPreco] = useState("");
    const [precoOriginal, setPrecoOriginal] = useState("");
    const [imagem, setImagem] = useState("🎧");
    const [estoque, setEstoque] = useState("15");
    const [descricao, setDescricao] = useState("");
    const [variacoesTexto, setVariacoesTexto] = useState("Padrão, Edição Especial");
    const [freteGratis, setFreteGratis] = useState(true);
    const [ofertaRelampago, setOfertaRelampago] = useState(false);
    const [lojaOficial, setLojaOficial] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (modo === "editar" && produtoInicial) {
            setNome(produtoInicial.nome);
            setCategoria(produtoInicial.categoria);
            setPreco(String(produtoInicial.preco));
            setPrecoOriginal(produtoInicial.precoOriginal ? String(produtoInicial.precoOriginal) : "");
            setImagem(produtoInicial.imagem || "📦");
            setEstoque(String(produtoInicial.estoque ?? 10));
            setDescricao(produtoInicial.descricao || "");
            setVariacoesTexto(
                produtoInicial.variacoes && produtoInicial.variacoes.length > 0
                    ? produtoInicial.variacoes.join(", ")
                    : "Padrão"
            );
            setFreteGratis(Boolean(produtoInicial.freteGratis));
            setOfertaRelampago(Boolean(produtoInicial.ofertaRelampago));
            setLojaOficial(produtoInicial.lojaOficial ?? true);
        } else {
            setNome("");
            setCategoria("eletronicos");
            setPreco("");
            setPrecoOriginal("");
            setImagem("🎧");
            setEstoque("15");
            setDescricao("");
            setVariacoesTexto("Preto Matte, Prata Lunar");
            setFreteGratis(true);
            setOfertaRelampago(false);
            setLojaOficial(true);
        }
    }, [modo, produtoInicial, aberto]);

    if (!aberto) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome.trim() || !preco) return;

        setSalvando(true);
        try {
            const precoNum = Number(preco);
            const variacoesArray = variacoesTexto
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);

            await aoSalvar(
                {
                    nome: nome.trim(),
                    categoria,
                    preco: precoNum,
                    precoOriginal: precoOriginal ? Number(precoOriginal) : Number((precoNum * 1.25).toFixed(2)),
                    imagem: imagem || "📦",
                    descricao: descricao.trim() || "Produto oficial com garantia Chopits.",
                    estoque: Number(estoque) || 0,
                    vendidos: produtoInicial?.vendidos ?? 1,
                    avaliacao: produtoInicial?.avaliacao ?? 5.0,
                    freteGratis,
                    ofertaRelampago,
                    lojaOficial,
                    variacoes: variacoesArray.length > 0 ? variacoesArray : ["Padrão"],
                    avaliacoes: produtoInicial?.avaliacoes
                },
                modo === "editar" && produtoInicial ? produtoInicial.id : undefined
            );
            aoFechar();
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", zIndex: 1060, backdropFilter: "blur(4px)" }}
            onClick={aoFechar}
        >
            <div
                className="card border-0 shadow-lg rounded-4 p-4 w-100"
                style={{ maxWidth: "600px", maxHeight: "92vh", overflowY: "auto" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <div>
                        <h5 className="fw-bold m-0">
                            {modo === "editar" ? "✏️ Editar Produto do Catálogo" : "➕ Cadastrar Novo Produto"}
                        </h5>
                        <small className="text-muted">
                            {modo === "editar"
                                ? `Editando ID #${produtoInicial?.id} via PUT /produtos/${produtoInicial?.id}`
                                : "Persistência via POST /produtos no JSON-Server"}
                        </small>
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
                        <label className="form-label small fw-bold">Nome do Produto</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex: Headset Gamer Sem Fio 7.1"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>

                    <div className="row g-2 mb-3">
                        <div className="col-md-5">
                            <label className="form-label small fw-bold">Departamento</label>
                            <select
                                className="form-select"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                            >
                                <option value="eletronicos">🎧 Eletrônicos</option>
                                <option value="games">⌨️ Games & Setup</option>
                                <option value="acessorios">🎒 Acessórios</option>
                                <option value="moda">👕 Moda Tech</option>
                                <option value="casa">💡 Casa & Office</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label small fw-bold">Estoque (Unid.)</label>
                            <input
                                type="number"
                                min={0}
                                className="form-control"
                                value={estoque}
                                onChange={(e) => setEstoque(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label small fw-bold">Ícone / Emoji</label>
                            <input
                                type="text"
                                className="form-control text-center fs-5"
                                value={imagem}
                                onChange={(e) => setImagem(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Seletor Rápido de Ícones */}
                    <div className="mb-3">
                        <span className="text-muted small d-block mb-1">Ícones sugeridos:</span>
                        <div className="d-flex flex-wrap gap-1">
                            {ICONES_SUGERIDOS.map((ic) => (
                                <button
                                    key={ic}
                                    type="button"
                                    className={`btn btn-sm ${
                                        imagem === ic ? "btn-primary" : "btn-outline-secondary"
                                    }`}
                                    onClick={() => setImagem(ic)}
                                >
                                    {ic}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="row g-2 mb-3">
                        <div className="col-6">
                            <label className="form-label small fw-bold">Preço Promocional (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control fw-bold text-primary"
                                placeholder="249.90"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-6">
                            <label className="form-label small fw-bold">Preço Original De: (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                placeholder="349.90 (Para badge % OFF)"
                                value={precoOriginal}
                                onChange={(e) => setPrecoOriginal(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold">
                            Variações Disponíveis (separadas por vírgula)
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ex: Preto, Branco, Roxo Chopits"
                            value={variacoesTexto}
                            onChange={(e) => setVariacoesTexto(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold">Descrição Detalhada</label>
                        <textarea
                            className="form-control"
                            rows={2}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Principais benefícios e especificações..."
                        />
                    </div>

                    <div className="p-3 rounded-3 bg-light border d-flex flex-wrap gap-4 mb-4">
                        <div className="form-check m-0">
                            <input
                                id="modalFrete"
                                type="checkbox"
                                className="form-check-input"
                                checked={freteGratis}
                                onChange={(e) => setFreteGratis(e.target.checked)}
                            />
                            <label htmlFor="modalFrete" className="form-check-label small fw-semibold">
                                🚚 Frete Grátis
                            </label>
                        </div>

                        <div className="form-check m-0">
                            <input
                                id="modalFlash"
                                type="checkbox"
                                className="form-check-input"
                                checked={ofertaRelampago}
                                onChange={(e) => setOfertaRelampago(e.target.checked)}
                            />
                            <label htmlFor="modalFlash" className="form-check-label small fw-semibold text-danger">
                                ⚡ Oferta Relâmpago
                            </label>
                        </div>

                        <div className="form-check m-0">
                            <input
                                id="modalOficial"
                                type="checkbox"
                                className="form-check-input"
                                checked={lojaOficial}
                                onChange={(e) => setLojaOficial(e.target.checked)}
                            />
                            <label htmlFor="modalOficial" className="form-check-label small fw-semibold text-primary">
                                ✓ Selo Loja Oficial
                            </label>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-light px-3" onClick={aoFechar}>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn chopits-btn-primary px-4"
                            disabled={salvando}
                        >
                            {salvando
                                ? "Salvando..."
                                : modo === "editar"
                                ? "Salvar Alterações"
                                : "Publicar Produto"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

