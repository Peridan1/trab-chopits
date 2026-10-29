import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore, CUPONS_DISPONIVEIS } from "../../context/StoreContext";
import { ProductCard } from "../../components/ProductCard";

const CATEGORIAS_VITRINE = [
    { id: "todas", nome: "Tudo", icone: "🛍️" },
    { id: "eletronicos", nome: "Eletrônicos", icone: "🎧" },
    { id: "games", nome: "Games & Setup", icone: "⌨️" },
    { id: "acessorios", nome: "Acessórios", icone: "🎒" },
    { id: "moda", nome: "Moda Tech", icone: "👕" },
    { id: "casa", nome: "Casa & Office", icone: "💡" },
    { id: "frete_gratis", nome: "Frete Grátis", icone: "🚚" }
];

export const Home: React.FC = () => {
    const {
        produtos,
        favoritos,
        cupomAtivo,
        aplicarCupom,
        buscaGlobal,
        setBuscaGlobal,
        homeBannerConfig,
        loading,
        erroApi
    } = useStore();

    const [categoriaAtiva, setCategoriaAtiva] = useState<string>("todas");

    // Cronômetro regressivo de Oferta Relâmpago (2h 45m 30s = 9930 segundos)
    const [segundosRestantes, setSegundosRestantes] = useState<number>(9930);
    // Conceito Acadêmico: useRef para armazenar o ID do timer sem causar re-render
    const timerIdRef = useRef<number | null>(null);

    useEffect(() => {
        timerIdRef.current = window.setInterval(() => {
            setSegundosRestantes((prev) => (prev > 0 ? prev - 1 : 9930));
        }, 1000);

        return () => {
            if (timerIdRef.current) {
                clearInterval(timerIdRef.current);
            }
        };
    }, []);

    const formatarTempo = (totalSegundos: number) => {
        const horas = String(Math.floor(totalSegundos / 3600)).padStart(2, "0");
        const minutos = String(Math.floor((totalSegundos % 3600) / 60)).padStart(2, "0");
        const segundos = String(totalSegundos % 60).padStart(2, "0");
        return { horas, minutos, segundos };
    };

    const tempo = formatarTempo(segundosRestantes);

    // Ofertas Relâmpago
    const produtosRelampago = useMemo(() => {
        return produtos.filter((p) => p.ofertaRelampago).slice(0, 4);
    }, [produtos]);

    // Produtos filtrados na vitrine "Descobertas do Dia"
    const produtosDescobertas = useMemo(() => {
        return produtos.filter((p) => {
            const matchCategoria =
                categoriaAtiva === "todas"
                    ? true
                    : categoriaAtiva === "frete_gratis"
                    ? Boolean(p.freteGratis)
                    : p.categoria === categoriaAtiva;

            const termo = buscaGlobal.trim().toLowerCase();
            const matchBusca =
                !termo ||
                p.nome.toLowerCase().includes(termo) ||
                p.descricao.toLowerCase().includes(termo) ||
                p.categoria.toLowerCase().includes(termo);

            return matchCategoria && matchBusca;
        });
    }, [produtos, categoriaAtiva, buscaGlobal]);

    // Lista de Desejos (Produtos favoritados no localStorage)
    const produtosFavoritos = useMemo(() => {
        return produtos.filter((p) => favoritos.includes(p.id));
    }, [produtos, favoritos]);

    return (
        <div className="pb-4">
            {erroApi && (
                <div className="alert alert-info py-2 small mb-3 d-flex align-items-center justify-content-between">
                    <span>ℹ️ {erroApi}</span>
                    <Link to="/admin" className="btn btn-sm btn-outline-primary py-0">
                        Ver Painel Admin
                    </Link>
                </div>
            )}

            {/* 1. HERO GRID: Banner Principal + Central de Cupons */}
            <div className="row g-3 mb-4">
                <div className="col-lg-8">
                    <div className="chopits-hero-banner h-100 p-4 p-md-5 d-flex flex-column justify-content-between">
                        <div>
                            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-15 mb-3 small fw-semibold">
                                <span>{homeBannerConfig.badgeTexto}</span>
                                <span className="badge bg-success">{homeBannerConfig.badgeDestaque}</span>
                            </div>
                            <h1 className="display-6 fw-bold mb-2">
                                {homeBannerConfig.titulo}
                            </h1>
                            <p className="text-white text-opacity-85 mb-4 col-md-10">
                                {homeBannerConfig.subtitulo}
                            </p>
                        </div>

                        <div className="d-flex flex-wrap align-items-center gap-3">
                            <Link
                                to={homeBannerConfig.linkBotaoPrimario || "/produtos"}
                                className="btn btn-light text-primary fw-bold px-4 py-2 rounded-pill shadow-sm"
                            >
                                {homeBannerConfig.textoBotaoPrimario}
                            </Link>
                            {homeBannerConfig.exibirOfertasRelampago && (
                                <a
                                    href="#ofertas-relampago"
                                    className="btn btn-outline-light px-4 py-2 rounded-pill fw-semibold"
                                >
                                    ⚡ Ver Ofertas Relâmpago
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Coluna Lateral: Cupons Ativáveis com 1 Clique */}
                <div className="col-lg-4 d-flex flex-column gap-3">
                    {CUPONS_DISPONIVEIS.slice(0, 2).map((cupom) => {
                        const isAtivo = cupomAtivo?.codigo === cupom.codigo;
                        return (
                            <div
                                key={cupom.codigo}
                                className="chopits-coupon-card p-3 flex-grow-1 d-flex flex-column justify-content-between shadow-sm"
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                        <span className="badge bg-primary bg-opacity-10 text-primary mb-1">
                                            🎟️ CUPOM EXCLUSIVO
                                        </span>
                                        <h5 className="fw-bold mb-1 text-dark">{cupom.codigo}</h5>
                                        <p className="text-muted small mb-2">{cupom.descricao}</p>
                                    </div>
                                    <span className="fs-3">
                                        {cupom.freteGratis ? "🚚" : "💸"}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                                    <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                        {cupom.minimoCompra
                                            ? `Mínimo R$ ${cupom.minimoCompra}`
                                            : "Sem valor mínimo"}
                                    </span>
                                    <button
                                        type="button"
                                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                                            isAtivo ? "btn-success" : "chopits-btn-primary"
                                        }`}
                                        onClick={() => aplicarCupom(cupom.codigo)}
                                    >
                                        {isAtivo ? "✓ Cupom Ativo" : "Resgatar Cupom"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. NAVEGAÇÃO RÁPIDA POR CATEGORIAS (PÍLULAS CIRCULARES) */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                    <h6 className="fw-bold m-0 text-uppercase text-muted" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>
                        Navegar por Categorias
                    </h6>
                    {categoriaAtiva !== "todas" && (
                        <button
                            type="button"
                            className="btn btn-link btn-sm p-0 text-decoration-none"
                            onClick={() => setCategoriaAtiva("todas")}
                        >
                            Limpar filtro ✕
                        </button>
                    )}
                </div>
                <div className="row row-cols-3 row-cols-sm-4 row-cols-lg-7 g-2">
                    {CATEGORIAS_VITRINE.map((cat) => (
                        <div className="col" key={cat.id}>
                            <div
                                role="button"
                                tabIndex={0}
                                className={`chopits-cat-btn h-100 ${
                                    categoriaAtiva === cat.id ? "active" : ""
                                }`}
                                onClick={() => setCategoriaAtiva(cat.id)}
                                onKeyDown={(e) => e.key === "Enter" && setCategoriaAtiva(cat.id)}
                            >
                                <div className="chopits-cat-icon">{cat.icone}</div>
                                <div className="fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>
                                    {cat.nome}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. SEÇÃO OFERTAS RELÂMPAGO (FLASH DEALS COM CRONÔMETRO) */}
            {homeBannerConfig.exibirOfertasRelampago && (
                <section id="ofertas-relampago" className="mb-5">
                    <div className="chopits-flash-header p-3 mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                        <div className="d-flex flex-wrap align-items-center gap-3">
                            <h4 className="fw-bold m-0 text-danger d-flex align-items-center gap-2">
                                <span>⚡</span> OFERTAS RELÂMPAGO
                            </h4>
                            <div className="d-flex align-items-center gap-1">
                                <span className="text-muted small me-1 fw-medium">Termina em:</span>
                                <span className="chopits-timer-box">{tempo.horas}</span>
                                <span className="fw-bold text-danger">:</span>
                                <span className="chopits-timer-box">{tempo.minutos}</span>
                                <span className="fw-bold text-danger">:</span>
                                <span className="chopits-timer-box">{tempo.segundos}</span>
                            </div>
                        </div>

                        <Link
                            to="/produtos/ofertas"
                            className="text-danger fw-semibold text-decoration-none small"
                        >
                            Ver todas as ofertas →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status" />
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
                            {produtosRelampago.map((produto) => (
                                <div className="col" key={produto.id}>
                                    <ProductCard produto={produto} mostrarBarraRelampago />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* 4. VITRINE PRINCIPAL: DESCOBERTAS DO DIA */}
            <section className="mb-5">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <div>
                        <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
                            <span>✨</span> {homeBannerConfig.tituloSecaoDescobertas}
                            {categoriaAtiva !== "todas" && (
                                <span className="badge bg-primary rounded-pill fs-6">
                                    {CATEGORIAS_VITRINE.find((c) => c.id === categoriaAtiva)?.nome}
                                </span>
                            )}
                        </h4>
                        <p className="text-muted small m-0">
                            Produtos selecionados com garantia oficial Chopits e entrega rápida
                        </p>
                    </div>

                    {buscaGlobal && (
                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-secondary">
                                Filtrando por: "{buscaGlobal}"
                            </span>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary py-0"
                                onClick={() => setBuscaGlobal("")}
                            >
                                Limpar busca
                            </button>
                        </div>
                    )}
                </div>

                {produtosDescobertas.length === 0 ? (
                    <div className="card border-0 shadow-sm p-5 text-center">
                        <div className="display-4 mb-2">🔍</div>
                        <h5 className="fw-bold">Nenhum produto encontrado para este filtro</h5>
                        <p className="text-muted small">
                            Tente selecionar outra categoria ou limpar o termo de pesquisa.
                        </p>
                        <div>
                            <button
                                type="button"
                                className="btn chopits-btn-primary btn-sm px-4"
                                onClick={() => {
                                    setCategoriaAtiva("todas");
                                    setBuscaGlobal("");
                                }}
                            >
                                Mostrar Todos os Produtos
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                        {produtosDescobertas.map((produto) => (
                            <div className="col" key={produto.id}>
                                <ProductCard produto={produto} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 5. LISTA DE DESEJOS (WISHLIST PERSISTIDA NO LOCALSTORAGE) */}
            <section id="wishlist" className="pt-2">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-header bg-white border-bottom p-3 d-flex flex-wrap justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                <span>❤️</span> Minha Lista de Desejos (Favoritos)
                                <span className="badge bg-danger rounded-pill">
                                    {produtosFavoritos.length}
                                </span>
                            </h5>
                            <small className="text-muted">
                                Sincronizada automaticamente com o <code>localStorage</code> do seu navegador
                            </small>
                        </div>
                        <Link to="/carrinho" className="btn btn-outline-primary btn-sm">
                            Ir para o Carrinho 🛒
                        </Link>
                    </div>

                    <div className="card-body p-3">
                        {produtosFavoritos.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <p className="mb-1">Você ainda não favoritou nenhum produto.</p>
                                <small>
                                    Clique no ícone 🤍 no canto superior esquerdo de qualquer produto para salvá-lo aqui!
                                </small>
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
                                {produtosFavoritos.map((produto) => (
                                    <div className="col" key={produto.id}>
                                        <ProductCard produto={produto} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
