import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore, DEFAULT_HOME_BANNER_CONFIG } from "../../context/StoreContext";
import type { Produto, HomeBannerConfig } from "../../types";
import { Usuarios } from "../Usuarios";
import { ChopitsKPIs } from "../../components/admin/ChopitsKPIs";
import { BulkPriceModal } from "../../components/admin/BulkPriceModal";
import { ProductEditModal } from "../../components/admin/ProductEditModal";
import { AdminConfirmModal, type ConfirmModalConfig } from "../../components/admin/AdminConfirmModal";

type AbaAdmin = "produtos" | "vitrine" | "usuarios" | "exercicios";

export const Admin: React.FC = () => {
    const {
        produtos,
        fonteDados,
        homeBannerConfig,
        dataSnapshotPrecos,
        recarregarDados,
        cadastrarNovoProduto,
        atualizarProdutoCatalogo,
        excluirProdutoCatalogo,
        reajustarPrecosEmMassa,
        reverterPrecosSnapshot,
        salvarHomeBannerConfig
    } = useStore();

    const [abaAtiva, setAbaAtiva] = useState<AbaAdmin>("produtos");

    // ── Estados da Aba 1: Catálogo, Filtros, Paginação e Edição Inline ──
    const [buscaAdmin, setBuscaAdmin] = useState("");
    const [categoriaAdmin, setCategoriaAdmin] = useState("todas");
    const [statusFiltro, setStatusFiltro] = useState<"todos" | "relampago" | "frete_gratis" | "estoque_baixo">("todos");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(6);
    const [precosInline, setPrecosInline] = useState<Record<number, string>>({});

    // Modais do Catálogo
    const [modalProdutoAberto, setModalProdutoAberto] = useState(false);
    const [modoModalProduto, setModoModalProduto] = useState<"criar" | "editar">("criar");
    const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
    const [modalMassaAberto, setModalMassaAberto] = useState(false);
    const [confirmModal, setConfirmModal] = useState<ConfirmModalConfig>({
        aberto: false,
        titulo: "",
        mensagem: "",
        aoConfirmar: () => {}
    });

    // ── Estados da Aba 2: Gerenciador de Banners da Home (Conceito Peixaria Brisamar) ──
    const [rascunhoBanner, setRascunhoBanner] = useState<HomeBannerConfig>(homeBannerConfig);
    // Conceito Acadêmico: useRef para guardar snapshot salvo e detectar alterações não salvas
    const configSalvaRef = useRef<string>(JSON.stringify(homeBannerConfig));
    const barraTopoSalvarRef = useRef<HTMLDivElement>(null);
    const [mostrarBarraFlutuante, setMostrarBarraFlutuante] = useState(false);

    useEffect(() => {
        setRascunhoBanner(homeBannerConfig);
        configSalvaRef.current = JSON.stringify(homeBannerConfig);
    }, [homeBannerConfig]);

    const temAlteracoesNaoSalvas =
        abaAtiva === "vitrine" &&
        JSON.stringify(rascunhoBanner) !== configSalvaRef.current;

    // Alerta nativo do navegador ao tentar fechar a aba com alterações pendentes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (temAlteracoesNaoSalvas) {
                e.preventDefault();
                e.returnValue = "Você possui alterações não salvas na vitrine.";
                return e.returnValue;
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [temAlteracoesNaoSalvas]);

    // IntersectionObserver com useRef para exibir botão flutuante de salvar ao rolar a página
    useEffect(() => {
        if (abaAtiva !== "vitrine") {
            setMostrarBarraFlutuante(false);
            return;
        }
        const el = barraTopoSalvarRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setMostrarBarraFlutuante(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [abaAtiva]);

    // Interceptador de troca de aba quando há alterações não salvas
    const handleTrocarAba = (novaAba: AbaAdmin) => {
        if (novaAba === abaAtiva) return;
        if (temAlteracoesNaoSalvas) {
            setConfirmModal({
                aberto: true,
                titulo: "Alterações Não Salvas na Vitrine",
                mensagem:
                    "Você alterou os textos/banners da Home mas ainda não salvou. Deseja descartar as modificações e trocar de aba?",
                textoConfirmar: "Descartar e Trocar",
                variante: "warning",
                aoConfirmar: () => {
                    setRascunhoBanner(homeBannerConfig);
                    setAbaAtiva(novaAba);
                }
            });
        } else {
            setAbaAtiva(novaAba);
        }
    };

    // ── Estados da Aba 4: Exercício Original do Professor (localStorage 'minhasTarefas') ──
    const [tarefa, setTarefa] = useState("");
    const [listaTarefas, setListaTarefas] = useState<string[]>(() => {
        try {
            const salva = localStorage.getItem("minhasTarefas");
            return salva
                ? JSON.parse(salva)
                : ["Revisar Hooks (useState, useEffect, useRef, useMemo)", "Testar CRUD no JSON-Server"];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("minhasTarefas", JSON.stringify(listaTarefas));
    }, [listaTarefas]);

    // ── Filtro e Paginação de Produtos (Aba 1) ──
    const produtosFiltrados = useMemo(() => {
        return produtos.filter((p) => {
            const termo = buscaAdmin.trim().toLowerCase();
            const matchBusca =
                !termo ||
                p.nome.toLowerCase().includes(termo) ||
                p.descricao.toLowerCase().includes(termo);
            const matchCat = categoriaAdmin === "todas" || p.categoria === categoriaAdmin;
            const matchStatus =
                statusFiltro === "todos" ||
                (statusFiltro === "relampago" && Boolean(p.ofertaRelampago)) ||
                (statusFiltro === "frete_gratis" && Boolean(p.freteGratis)) ||
                (statusFiltro === "estoque_baixo" && (p.estoque ?? 0) <= 12);

            return matchBusca && matchCat && matchStatus;
        });
    }, [produtos, buscaAdmin, categoriaAdmin, statusFiltro]);

    const totalPaginas = Math.max(1, Math.ceil(produtosFiltrados.length / itensPorPagina));
    const indiceInicial = (paginaAtual - 1) * itensPorPagina;
    const produtosPaginados = produtosFiltrados.slice(
        indiceInicial,
        indiceInicial + itensPorPagina
    );

    const abrirModalNovoProduto = () => {
        setModoModalProduto("criar");
        setProdutoEditando(null);
        setModalProdutoAberto(true);
    };

    const abrirModalEditarProduto = (prod: Produto) => {
        setModoModalProduto("editar");
        setProdutoEditando(prod);
        setModalProdutoAberto(true);
    };

    const handleSalvarModalProduto = async (dados: Omit<Produto, "id">, idExistente?: number) => {
        if (idExistente !== undefined) {
            await atualizarProdutoCatalogo(idExistente, dados);
        } else {
            await cadastrarNovoProduto(dados);
        }
    };

    const handleSalvarPrecoInline = async (prod: Produto) => {
        const valorDigitado = precosInline[prod.id];
        if (valorDigitado === undefined) return;
        const novoPreco = parseFloat(valorDigitado);
        if (isNaN(novoPreco) || novoPreco <= 0) return;

        await atualizarProdutoCatalogo(prod.id, { preco: Number(novoPreco.toFixed(2)) });
        setPrecosInline((prev) => {
            const copia = { ...prev };
            delete copia[prod.id];
            return copia;
        });
    };

    const confirmarExclusaoProduto = (prod: Produto) => {
        setConfirmModal({
            aberto: true,
            titulo: "Excluir Produto do Catálogo?",
            mensagem: `Tem certeza que deseja remover "${prod.nome}" (ID #${prod.id})? Esta ação enviará um DELETE para a API.`,
            textoConfirmar: "Sim, Excluir",
            variante: "danger",
            aoConfirmar: () => excluirProdutoCatalogo(prod.id)
        });
    };

    const confirmarReversaoSnapshot = () => {
        setConfirmModal({
            aberto: true,
            titulo: "Reverter Preços para o Snapshot?",
            mensagem: `Deseja restaurar todos os preços gravados no snapshot das ${dataSnapshotPrecos}?`,
            textoConfirmar: "Sim, Restaurar Preços",
            variante: "warning",
            aoConfirmar: () => reverterPrecosSnapshot()
        });
    };

    const adicionarTarefa = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tarefa.trim()) return;
        setListaTarefas([...listaTarefas, tarefa.trim()]);
        setTarefa("");
    };

    return (
        <div className="py-2">
            {/* ── 1. HEADER DO PAINEL ADMIN (Estilo Peixaria Brisamar) ── */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div
                    className="p-4 text-white d-flex flex-wrap justify-content-between align-items-center gap-3"
                    style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)" }}
                >
                    <div>
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                            <span className="badge bg-warning text-dark">
                                🎓 BACKOFFICE & PRÁTICA ACADÊMICA
                            </span>

                            {/* Status Badge da Fonte de Dados (API vs Fallback Local) */}
                            {fonteDados === "api" ? (
                                <span
                                    className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-1"
                                    style={{
                                        backgroundColor: "rgba(16, 185, 129, 0.2)",
                                        border: "1px solid rgba(52, 211, 153, 0.5)",
                                        color: "#6ee7b7"
                                    }}
                                >
                                    <span>🟢</span> JSON-Server Conectado (API REST)
                                </span>
                            ) : (
                                <span
                                    className="badge rounded-pill d-inline-flex align-items-center gap-1 px-3 py-1"
                                    style={{
                                        backgroundColor: "rgba(245, 158, 11, 0.2)",
                                        border: "1px solid rgba(251, 191, 36, 0.5)",
                                        color: "#fde68a"
                                    }}
                                >
                                    <span>🟡</span> Contingência Local (`dados.json` Fallback)
                                </span>
                            )}
                        </div>

                        <h3 className="fw-bold m-0">Painel de Administração Chopits</h3>
                        <p className="text-white-50 small mb-0 mt-1">
                            Gestão de catálogo em tempo real, reajuste em massa com snapshot, editor de vitrine e laboratório de Hooks.
                        </p>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-light"
                            onClick={recarregarDados}
                            title="Sincronizar com o JSON-Server"
                        >
                            🔄 Sincronizar API
                        </button>
                        <Link to="/home" className="btn btn-sm btn-light text-primary fw-bold">
                            🛍️ Ver Vitrine da Loja
                        </Link>
                    </div>
                </div>

                {/* Abas de Navegação com Interceptador de Alterações Não Salvas */}
                <div className="card-footer bg-white border-top px-4 py-2 d-flex flex-wrap gap-2">
                    <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                            abaAtiva === "produtos" ? "chopits-btn-primary" : "btn-light"
                        }`}
                        onClick={() => handleTrocarAba("produtos")}
                    >
                        📦 Catálogo & Preços ({produtos.length})
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 fw-semibold position-relative ${
                            abaAtiva === "vitrine" ? "chopits-btn-primary" : "btn-light"
                        }`}
                        onClick={() => handleTrocarAba("vitrine")}
                    >
                        🎨 Banners & Vitrine Home
                        {temAlteracoesNaoSalvas && (
                            <span
                                className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"
                                title="Alterações não salvas"
                            />
                        )}
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                            abaAtiva === "usuarios" ? "chopits-btn-primary" : "btn-light"
                        }`}
                        onClick={() => handleTrocarAba("usuarios")}
                    >
                        👤 CRUD de Usuários (API)
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                            abaAtiva === "exercicios" ? "chopits-btn-primary" : "btn-light"
                        }`}
                        onClick={() => handleTrocarAba("exercicios")}
                    >
                        📌 Exercícios do Professor
                    </button>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                ABA 1: CATÁLOGO, KPIS, REAJUSTE EM MASSA E EDIÇÃO INLINE
               ════════════════════════════════════════════════════════════════ */}
            {abaAtiva === "produtos" && (
                <div>
                    {/* 1. Cards de KPIs com useMemo */}
                    <ChopitsKPIs produtos={produtos} />

                    {/* 2. Barra de Busca, Filtros e Ações em Massa */}
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <div className="row g-2 align-items-center mb-3">
                            <div className="col-md-4">
                                <input
                                    type="search"
                                    className="form-control form-control-sm"
                                    placeholder="🔍 Buscar produto por nome ou descrição..."
                                    value={buscaAdmin}
                                    onChange={(e) => {
                                        setBuscaAdmin(e.target.value);
                                        setPaginaAtual(1);
                                    }}
                                />
                            </div>

                            <div className="col-sm-6 col-md-3">
                                <select
                                    className="form-select form-select-sm"
                                    value={categoriaAdmin}
                                    onChange={(e) => {
                                        setCategoriaAdmin(e.target.value);
                                        setPaginaAtual(1);
                                    }}
                                >
                                    <option value="todas">Todas as Categorias</option>
                                    <option value="eletronicos">🎧 Eletrônicos</option>
                                    <option value="games">⌨️ Games & Setup</option>
                                    <option value="acessorios">🎒 Acessórios</option>
                                    <option value="moda">👕 Moda Tech</option>
                                    <option value="casa">💡 Casa & Office</option>
                                </select>
                            </div>

                            <div className="col-sm-6 col-md-3">
                                <select
                                    className="form-select form-select-sm"
                                    value={statusFiltro}
                                    onChange={(e) => {
                                        setStatusFiltro(
                                            e.target.value as
                                                | "todos"
                                                | "relampago"
                                                | "frete_gratis"
                                                | "estoque_baixo"
                                        );
                                        setPaginaAtual(1);
                                    }}
                                >
                                    <option value="todos">Todos os Status</option>
                                    <option value="relampago">⚡ Em Oferta Relâmpago</option>
                                    <option value="frete_gratis">🚚 Com Frete Grátis</option>
                                    <option value="estoque_baixo">⚠️ Estoque Baixo (≤ 12)</option>
                                </select>
                            </div>

                            <div className="col-md-2">
                                <button
                                    type="button"
                                    className="btn btn-success btn-sm w-100 fw-bold py-2"
                                    onClick={abrirModalNovoProduto}
                                >
                                    ➕ Novo Produto
                                </button>
                            </div>
                        </div>

                        {/* Linha de Ações em Lote (Inspirada na Peixaria Brisamar) */}
                        <div className="pt-3 border-top d-flex flex-wrap justify-content-between align-items-center gap-2 small">
                            <div className="d-flex flex-wrap align-items-center gap-2">
                                <span className="text-muted">
                                    Exibindo <strong>{produtosPaginados.length}</strong> de{" "}
                                    <strong>{produtosFiltrados.length}</strong> produtos:
                                </span>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary rounded-pill fw-semibold"
                                    onClick={() => setModalMassaAberto(true)}
                                >
                                    🏷️ Reajuste de Preços em Massa (%)
                                </button>

                                {dataSnapshotPrecos && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning text-dark rounded-pill fw-semibold"
                                        onClick={confirmarReversaoSnapshot}
                                    >
                                        ⏪ Reverter Preços (Snapshot {dataSnapshotPrecos})
                                    </button>
                                )}
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted">Itens por página:</span>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: "72px" }}
                                    value={itensPorPagina}
                                    onChange={(e) => {
                                        setItensPorPagina(Number(e.target.value));
                                        setPaginaAtual(1);
                                    }}
                                >
                                    <option value={6}>6</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Tabela Avançada com Edição Inline e Switches de 1 Clique */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light small text-uppercase text-muted">
                                    <tr>
                                        <th className="ps-4">Produto</th>
                                        <th>Departamento</th>
                                        <th>Preço Rápido (R$)</th>
                                        <th className="text-center">⚡ Flash Sale</th>
                                        <th className="text-center">🚚 Frete Grátis</th>
                                        <th className="text-center">Estoque</th>
                                        <th className="text-end pe-4">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtosPaginados.map((p) => {
                                        const precoEditado = precosInline[p.id];
                                        const foiModificadoInline =
                                            precoEditado !== undefined &&
                                            Number(precoEditado) !== p.preco;

                                        return (
                                            <tr key={p.id}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <span
                                                            className="rounded-3 bg-light d-inline-flex align-items-center justify-content-center fs-4"
                                                            style={{ width: "44px", height: "44px" }}
                                                        >
                                                            {p.imagem}
                                                        </span>
                                                        <div>
                                                            <div className="fw-bold text-dark small">
                                                                {p.nome}
                                                            </div>
                                                            <span className="text-muted" style={{ fontSize: "0.73rem" }}>
                                                                ID #{p.id} • ⭐ {(p.avaliacao || 4.8).toFixed(1)} • {p.vendidos || 0} vendidos
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="badge bg-light text-dark border text-capitalize">
                                                        {p.categoria}
                                                    </span>
                                                </td>

                                                {/* Edição Rápida de Preço Inline */}
                                                <td style={{ minWidth: "165px" }}>
                                                    <div className="input-group input-group-sm" style={{ maxWidth: "150px" }}>
                                                        <span className="input-group-text">R$</span>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            className="form-control fw-bold text-primary"
                                                            value={
                                                                precoEditado !== undefined
                                                                    ? precoEditado
                                                                    : p.preco
                                                            }
                                                            onChange={(e) =>
                                                                setPrecosInline((prev) => ({
                                                                    ...prev,
                                                                    [p.id]: e.target.value
                                                                }))
                                                            }
                                                        />
                                                        {foiModificadoInline && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-success"
                                                                title="Salvar novo preço"
                                                                onClick={() => handleSalvarPrecoInline(p)}
                                                            >
                                                                💾
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Toggle 1-Clique Oferta Relâmpago */}
                                                <td className="text-center">
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm rounded-pill px-3 ${
                                                            p.ofertaRelampago
                                                                ? "btn-danger"
                                                                : "btn-outline-secondary"
                                                        }`}
                                                        onClick={() =>
                                                            atualizarProdutoCatalogo(p.id, {
                                                                ofertaRelampago: !p.ofertaRelampago
                                                            })
                                                        }
                                                    >
                                                        {p.ofertaRelampago ? "⚡ Ativo" : "Inativo"}
                                                    </button>
                                                </td>

                                                {/* Toggle 1-Clique Frete Grátis */}
                                                <td className="text-center">
                                                    <button
                                                        type="button"
                                                        className={`btn btn-sm rounded-pill px-3 ${
                                                            p.freteGratis
                                                                ? "btn-success"
                                                                : "btn-outline-secondary"
                                                        }`}
                                                        onClick={() =>
                                                            atualizarProdutoCatalogo(p.id, {
                                                                freteGratis: !p.freteGratis
                                                            })
                                                        }
                                                    >
                                                        {p.freteGratis ? "🚚 Grátis" : "Padrão"}
                                                    </button>
                                                </td>

                                                <td className="text-center">
                                                    <span
                                                        className={`badge ${
                                                            (p.estoque ?? 0) <= 10
                                                                ? "bg-warning text-dark"
                                                                : "bg-light text-dark border"
                                                        }`}
                                                    >
                                                        {p.estoque ?? 0} un.
                                                    </span>
                                                </td>

                                                <td className="text-end pe-4">
                                                    <div className="d-inline-flex gap-1">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="Editar detalhes completos"
                                                            onClick={() => abrirModalEditarProduto(p)}
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            title="Excluir produto"
                                                            onClick={() => confirmarExclusaoProduto(p)}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Rodapé de Paginação */}
                        {totalPaginas > 1 && (
                            <div className="card-footer bg-white border-top p-3 d-flex justify-content-between align-items-center">
                                <span className="small text-muted">
                                    Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
                                </span>
                                <div className="btn-group btn-group-sm">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        disabled={paginaAtual === 1}
                                        onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                                    >
                                        ← Anterior
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        disabled={paginaAtual === totalPaginas}
                                        onClick={() =>
                                            setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
                                        }
                                    >
                                        Próxima →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                ABA 2: GERENCIADOR DE BANNERS DA VITRINE (useRef + IntersectionObserver)
               ════════════════════════════════════════════════════════════════ */}
            {abaAtiva === "vitrine" && (
                <div>
                    {/* Barra de Topo Observada pelo IntersectionObserver (useRef) */}
                    <div
                        ref={barraTopoSalvarRef}
                        className="card border-0 shadow-sm rounded-4 p-3 mb-4 d-flex flex-row flex-wrap justify-content-between align-items-center gap-2"
                    >
                        <div>
                            <h5 className="fw-bold m-0">🎨 Personalização da Vitrine (Home)</h5>
                            <small className="text-muted">
                                Edite os textos do Hero Banner principal. O detector via <code>useRef</code> avisa se houver mudanças não salvas!
                            </small>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setRascunhoBanner(DEFAULT_HOME_BANNER_CONFIG)}
                            >
                                Restaurar Padrão
                            </button>
                            <button
                                type="button"
                                className="btn chopits-btn-primary btn-sm px-4"
                                disabled={!temAlteracoesNaoSalvas}
                                onClick={() => salvarHomeBannerConfig(rascunhoBanner)}
                            >
                                {temAlteracoesNaoSalvas
                                    ? "💾 Salvar Alterações na Vitrine"
                                    : "✓ Vitrine Sincronizada"}
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Formulário do Banner */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm rounded-4 p-4">
                                <h6 className="fw-bold text-uppercase text-muted mb-3">
                                    Textos & Chamadas do Hero Banner
                                </h6>

                                <div className="row g-2 mb-3">
                                    <div className="col-8">
                                        <label className="form-label small fw-semibold">
                                            Selo Superior (Badge)
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={rascunhoBanner.badgeTexto}
                                            onChange={(e) =>
                                                setRascunhoBanner({
                                                    ...rascunhoBanner,
                                                    badgeTexto: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-4">
                                        <label className="form-label small fw-semibold">
                                            Tag Destaque
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={rascunhoBanner.badgeDestaque}
                                            onChange={(e) =>
                                                setRascunhoBanner({
                                                    ...rascunhoBanner,
                                                    badgeDestaque: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">
                                        Título Principal (Headline)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control fw-bold"
                                        value={rascunhoBanner.titulo}
                                        onChange={(e) =>
                                            setRascunhoBanner({
                                                ...rascunhoBanner,
                                                titulo: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold">
                                        Subtítulo Promocional
                                    </label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        value={rascunhoBanner.subtitulo}
                                        onChange={(e) =>
                                            setRascunhoBanner({
                                                ...rascunhoBanner,
                                                subtitulo: e.target.value
                                            })
                                        }
                                    />
                                </div>

                                <div className="row g-2 mb-3">
                                    <div className="col-6">
                                        <label className="form-label small fw-semibold">
                                            Texto do Botão Principal
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={rascunhoBanner.textoBotaoPrimario}
                                            onChange={(e) =>
                                                setRascunhoBanner({
                                                    ...rascunhoBanner,
                                                    textoBotaoPrimario: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-semibold">
                                            Título da Vitrine Principal
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={rascunhoBanner.tituloSecaoDescobertas}
                                            onChange={(e) =>
                                                setRascunhoBanner({
                                                    ...rascunhoBanner,
                                                    tituloSecaoDescobertas: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="form-check form-switch p-3 rounded-3 bg-light border">
                                    <input
                                        id="switchRelampagoHome"
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={rascunhoBanner.exibirOfertasRelampago}
                                        onChange={(e) =>
                                            setRascunhoBanner({
                                                ...rascunhoBanner,
                                                exibirOfertasRelampago: e.target.checked
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor="switchRelampagoHome"
                                        className="form-check-label fw-semibold small ms-2"
                                    >
                                        ⚡ Exibir Seção de Ofertas Relâmpago (Com Cronômetro) na Home
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Preview ao Vivo do Banner */}
                        <div className="col-lg-6">
                            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fw-bold text-uppercase text-muted m-0">
                                        👁️ Pré-visualização em Tempo Real
                                    </h6>
                                    {temAlteracoesNaoSalvas && (
                                        <span className="badge bg-warning text-dark">
                                            ● Rascunho não salvo
                                        </span>
                                    )}
                                </div>

                                <div className="chopits-hero-banner p-4 d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="chopits-hero-badge">
                                            <span>{rascunhoBanner.badgeTexto}</span>
                                            <span className="badge-highlight">
                                                {rascunhoBanner.badgeDestaque}
                                            </span>
                                        </div>
                                        <h3 className="fw-bold mb-2 text-white">{rascunhoBanner.titulo}</h3>
                                        <p className="text-white small mb-4" style={{ opacity: 0.95 }}>
                                            {rascunhoBanner.subtitulo}
                                        </p>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="btn btn-light text-primary fw-bold btn-sm px-3 rounded-pill">
                                            {rascunhoBanner.textoBotaoPrimario}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Barra Flutuante de Salvar (IntersectionObserver) */}
                    {mostrarBarraFlutuante && temAlteracoesNaoSalvas && (
                        <div
                            className="position-fixed bottom-0 start-50 translate-middle-x mb-3 p-3 rounded-pill shadow-lg bg-dark text-white d-flex align-items-center gap-3"
                            style={{ zIndex: 1050 }}
                        >
                            <span className="small">⚠️ Você tem alterações não salvas no banner!</span>
                            <button
                                type="button"
                                className="btn btn-warning btn-sm rounded-pill fw-bold px-3"
                                onClick={() => salvarHomeBannerConfig(rascunhoBanner)}
                            >
                                💾 Salvar Agora
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                ABA 3: CRUD DE USUÁRIOS ORIGINAL DO PROFESSOR
               ════════════════════════════════════════════════════════════════ */}
            {abaAtiva === "usuarios" && (
                <div className="card border-0 shadow-sm rounded-4 p-4">
                    <Usuarios />
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════
                ABA 4: LABORATÓRIO DE EXERCÍCIOS ORIGINAIS (LOCALSTORAGE & ROTAS)
               ════════════════════════════════════════════════════════════════ */}
            {abaAtiva === "exercicios" && (
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <h5 className="fw-bold mb-2">
                                📌 Exercício Original: Lista de Tarefas (`localStorage`)
                            </h5>
                            <p className="text-muted small mb-3">
                                Preservação literal da atividade de sala de aula com <code>useState</code> e{" "}
                                <code>useEffect</code> sincronizando a chave <code>minhasTarefas</code>.
                            </p>
                            <form onSubmit={adicionarTarefa} className="d-flex gap-2 mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Digite uma tarefa acadêmica..."
                                    value={tarefa}
                                    onChange={(e) => setTarefa(e.target.value)}
                                />
                                <button type="submit" className="btn chopits-btn-primary">
                                    Adicionar
                                </button>
                            </form>
                            <ul className="list-group">
                                {listaTarefas.map((item, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <span>{item}</span>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                setListaTarefas(
                                                    listaTarefas.filter((_, i) => i !== index)
                                                )
                                            }
                                        >
                                            Excluir
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                            <h5 className="fw-bold mb-2">
                                🧭 Demonstração de Parâmetros Dinâmicos (`useParams`)
                            </h5>
                            <p className="text-muted small mb-3">
                                Atalhos diretos para testar o roteamento dinâmico do React Router DOM v7 exigido na disciplina:
                            </p>
                            <div className="d-flex flex-column gap-2">
                                <Link to="/produtos/eletronicos" className="btn btn-outline-primary text-start">
                                    🔗 <code>/produtos/eletronicos</code> — Filtra catálogo por parâmetro de rota
                                </Link>
                                <Link to="/produtos/ofertas" className="btn btn-outline-danger text-start">
                                    🔗 <code>/produtos/ofertas</code> — Filtra Ofertas Relâmpago
                                </Link>
                                <Link to="/sobre/arquitetura-react" className="btn btn-outline-secondary text-start">
                                    🔗 <code>/sobre/arquitetura-react</code> — Parâmetro na página Sobre
                                </Link>
                                <Link to="/login/checkout-redirect" className="btn btn-outline-secondary text-start">
                                    🔗 <code>/login/checkout-redirect</code> — Parâmetro na página Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modais Globais do Admin */}
            <ProductEditModal
                aberto={modalProdutoAberto}
                modo={modoModalProduto}
                produtoInicial={produtoEditando}
                aoFechar={() => setModalProdutoAberto(false)}
                aoSalvar={handleSalvarModalProduto}
            />

            <BulkPriceModal
                aberto={modalMassaAberto}
                aoFechar={() => setModalMassaAberto(false)}
                produtos={produtos}
                aoAplicar={reajustarPrecosEmMassa}
            />

            <AdminConfirmModal
                config={confirmModal}
                aoFechar={() => setConfirmModal((prev) => ({ ...prev, aberto: false }))}
            />
        </div>
    );
};
