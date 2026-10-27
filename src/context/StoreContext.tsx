/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { api, ENDPOINTS } from "../services/api";
import type { Produto, ItemCarrinho, Cupom, HomeBannerConfig } from "../types";

export const DEFAULT_HOME_BANNER_CONFIG: HomeBannerConfig = {
    badgeTexto: "✨ MEGA FESTIVAL CHOPITS 2026",
    badgeDestaque: "FRETE GRÁTIS",
    titulo: "Tecnologia & Estilo com Identidade Própria",
    subtitulo:
        "Descontos reais de até 40% OFF em ofertas relâmpago, envio expresso garantido e cupons exclusivos em todos os pedidos.",
    textoBotaoPrimario: "Explorar Todo o Catálogo →",
    linkBotaoPrimario: "/produtos",
    exibirOfertasRelampago: true,
    tituloSecaoDescobertas: "Descobertas do Dia"
};

const PRODUTOS_FALLBACK: Produto[] = [
    {
        id: 1,
        nome: "Fone de Ouvido Bluetooth ANC Pro Max",
        categoria: "eletronicos",
        preco: 249.9,
        precoOriginal: 399.9,
        imagem: "🎧",
        descricao: "Cancelamento ativo de ruído híbrido (ANC), áudio espacial de alta fidelidade e bateria de 35h.",
        estoque: 15,
        vendidos: 1420,
        avaliacao: 4.9,
        freteGratis: true,
        ofertaRelampago: true,
        lojaOficial: true,
        variacoes: ["Preto Matte", "Prata Lunar", "Roxo Chopits"]
    },
    {
        id: 2,
        nome: "Smartwatch Ultra AMOLED GPS 5ATM",
        categoria: "eletronicos",
        preco: 329.9,
        precoOriginal: 499.9,
        imagem: "⌚",
        descricao: "Tela AMOLED de 1.95 polegadas, GPS integrado, monitoramento de SpO2 e resistência 5ATM.",
        estoque: 8,
        vendidos: 890,
        avaliacao: 4.8,
        freteGratis: true,
        ofertaRelampago: true,
        lojaOficial: true,
        variacoes: ["Pulseira Preta", "Pulseira Verde Menta", "Titânio"]
    },
    {
        id: 3,
        nome: "Mochila Executiva Impermeável Anti-Furto 15.6\"",
        categoria: "acessorios",
        preco: 149.9,
        precoOriginal: 229.9,
        imagem: "🎒",
        descricao: "Compartimento acolchoado para notebook, saída USB integrada e tecido impermeável.",
        estoque: 22,
        vendidos: 2150,
        avaliacao: 4.9,
        freteGratis: true,
        ofertaRelampago: false,
        lojaOficial: true,
        variacoes: ["Cinza Espacial", "Preto Urbano", "Azul Marinho"]
    },
    {
        id: 4,
        nome: "Camiseta Tech Modal Anti-Odor & Não Amassa",
        categoria: "moda",
        preco: 79.9,
        precoOriginal: 129.9,
        imagem: "👕",
        descricao: "Malha tecnológica respirável: não precisa passar, não acumula odores e proteção UV50+.",
        estoque: 50,
        vendidos: 3410,
        avaliacao: 4.9,
        freteGratis: true,
        ofertaRelampago: true,
        lojaOficial: false,
        variacoes: ["P - Preta", "M - Preta", "G - Preta", "G - Branca"]
    },
    {
        id: 5,
        nome: "Teclado Mecânico Gamer Wireless RGB Hot-Swap",
        categoria: "games",
        preco: 289.9,
        precoOriginal: 419.9,
        imagem: "⌨️",
        descricao: "Formato 75% Tri-Mode (Bluetooth, 2.4GHz e USB-C), switches táteis pré-lubrificados ABNT2.",
        estoque: 12,
        vendidos: 640,
        avaliacao: 5.0,
        freteGratis: true,
        ofertaRelampago: true,
        lojaOficial: true,
        variacoes: ["Switch Red", "Switch Brown", "Switch Blue"]
    },
    {
        id: 6,
        nome: "Óculos de Sol Polarizado UV400 Acetato Italiano",
        categoria: "acessorios",
        preco: 119.9,
        precoOriginal: 179.9,
        imagem: "🕶️",
        descricao: "Proteção UV400 completa com lentes antirreflexo e armação leve em acetato.",
        estoque: 25,
        vendidos: 510,
        avaliacao: 4.7,
        freteGratis: false,
        ofertaRelampago: false,
        lojaOficial: false,
        variacoes: ["Lente Preta", "Lente Espelhada", "Tartaruga"]
    },
    {
        id: 7,
        nome: "Mouse Gamer Ultraleve 26.000 DPI Sem Fio",
        categoria: "games",
        preco: 199.9,
        precoOriginal: 299.9,
        imagem: "🖱️",
        descricao: "Apenas 54g, sensor óptico PAW3395 e switches ópticos de 80 milhões de cliques.",
        estoque: 18,
        vendidos: 975,
        avaliacao: 4.9,
        freteGratis: true,
        ofertaRelampago: false,
        lojaOficial: true,
        variacoes: ["Branco Gelo", "Preto Stealth", "Violeta Neon"]
    },
    {
        id: 8,
        nome: "Luminária de Monitor LED Barra Assimétrica USB-C",
        categoria: "casa",
        preco: 134.9,
        precoOriginal: 199.0,
        imagem: "💡",
        descricao: "Ilumina a bancada sem reflexo na tela. Controle touch e 3 temperaturas de cor.",
        estoque: 14,
        vendidos: 1180,
        avaliacao: 4.8,
        freteGratis: true,
        ofertaRelampago: false,
        lojaOficial: false,
        variacoes: ["Preto Fosco", "Alumínio Prata"]
    }
];

export const CUPONS_DISPONIVEIS: Cupom[] = [
    {
        codigo: "CHOPITS10",
        descontoPercentual: 10,
        descricao: "10% OFF em toda a loja (Boas-vindas Chopits)",
        minimoCompra: 50
    },
    {
        codigo: "CHOPITS25",
        descontoFixo: 25,
        descricao: "R$ 25,00 OFF para compras acima de R$ 200",
        minimoCompra: 200
    },
    {
        codigo: "FRETEGRATIS",
        freteGratis: true,
        descricao: "Frete Grátis Expresso sem valor mínimo",
        minimoCompra: 0
    }
];

interface SnapshotPreco {
    dataHora: string;
    precos: Record<number, { preco: number; precoOriginal?: number }>;
}

interface StoreContextType {
    produtos: Produto[];
    carrinho: ItemCarrinho[];
    favoritos: number[];
    cupomAtivo: Cupom | null;
    buscaGlobal: string;
    setBuscaGlobal: React.Dispatch<React.SetStateAction<string>>;
    loading: boolean;
    erroApi: string | null;
    fonteDados: "api" | "local";
    notificacao: string | null;
    totalItensCarrinho: number;
    homeBannerConfig: HomeBannerConfig;
    dataSnapshotPrecos: string | null;
    recarregarDados: () => Promise<void>;
    adicionarAoCarrinho: (produto: Produto, variacao?: string, qtd?: number) => Promise<void>;
    atualizarQuantidadeCarrinho: (itemId: number, novaQtd: number) => Promise<void>;
    alternarSelecaoItemCarrinho: (itemId: number) => void;
    selecionarTodosCarrinho: (selecionar: boolean) => void;
    removerDoCarrinho: (itemId: number) => Promise<void>;
    limparItensSelecionadosCarrinho: () => Promise<void>;
    alternarFavorito: (produtoId: number) => void;
    aplicarCupom: (codigo: string) => boolean;
    removerCupom: () => void;
    cadastrarNovoProduto: (novo: Omit<Produto, "id">) => Promise<void>;
    atualizarProdutoCatalogo: (id: number, parcial: Partial<Produto>) => Promise<void>;
    excluirProdutoCatalogo: (id: number) => Promise<void>;
    reajustarPrecosEmMassa: (percentual: number, categoriaAlvo: string) => Promise<void>;
    reverterPrecosSnapshot: () => Promise<void>;
    salvarHomeBannerConfig: (novaConfig: HomeBannerConfig) => void;
    exibirNotificacao: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erroApi, setErroApi] = useState<string | null>(null);
    const [fonteDados, setFonteDados] = useState<"api" | "local">("api");
    const [buscaGlobal, setBuscaGlobal] = useState<string>("");
    const [cupomAtivo, setCupomAtivo] = useState<Cupom | null>(null);
    const [notificacao, setNotificacao] = useState<string | null>(null);

    // Configuração da Vitrine da Home editável pelo Admin
    const [homeBannerConfig, setHomeBannerConfig] = useState<HomeBannerConfig>(() => {
        try {
            const salvo = localStorage.getItem("chopits_home_config");
            return salvo ? { ...DEFAULT_HOME_BANNER_CONFIG, ...JSON.parse(salvo) } : DEFAULT_HOME_BANNER_CONFIG;
        } catch {
            return DEFAULT_HOME_BANNER_CONFIG;
        }
    });

    // Snapshot de Preços para reversão em 1 clique (inspirado na Peixaria Brisamar)
    const [snapshotPrecos, setSnapshotPrecos] = useState<SnapshotPreco | null>(() => {
        try {
            const salvo = localStorage.getItem("chopits_price_snapshot");
            return salvo ? JSON.parse(salvo) : null;
        } catch {
            return null;
        }
    });

    // Lista de Desejos no localStorage
    const [favoritos, setFavoritos] = useState<number[]>(() => {
        try {
            const salvo = localStorage.getItem("chopits_favoritos");
            return salvo ? JSON.parse(salvo) : [1, 5];
        } catch {
            return [1, 5];
        }
    });

    useEffect(() => {
        localStorage.setItem("chopits_favoritos", JSON.stringify(favoritos));
    }, [favoritos]);

    const exibirNotificacao = useCallback((msg: string) => {
        setNotificacao(msg);
        setTimeout(() => {
            setNotificacao(prev => (prev === msg ? null : prev));
        }, 3200);
    }, []);

    const recarregarDados = useCallback(async () => {
        setLoading(true);
        setErroApi(null);
        try {
            const [respProdutos, respCarrinho] = await Promise.all([
                api.get<Produto[]>(ENDPOINTS.PRODUTOS),
                api.get<ItemCarrinho[]>(ENDPOINTS.CARRINHO)
            ]);
            setProdutos(respProdutos.data);
            setCarrinho(
                respCarrinho.data.map(item => ({
                    ...item,
                    selecionado: item.selecionado ?? true
                }))
            );
            setFonteDados("api");
        } catch (err: unknown) {
            console.warn("Usando catálogo local de fallback (API offline):", err);
            const msg = err instanceof Error ? err.message : "Backend indisponível";
            setErroApi(`Modo Contingência Local Ativo (${msg}).`);
            setProdutos(PRODUTOS_FALLBACK);
            setFonteDados("local");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        recarregarDados();
    }, [recarregarDados]);

    const alternarFavorito = useCallback((produtoId: number) => {
        setFavoritos(prev => {
            const jaExiste = prev.includes(produtoId);
            if (jaExiste) {
                exibirNotificacao("💔 Produto removido da sua Lista de Desejos.");
                return prev.filter(id => id !== produtoId);
            } else {
                exibirNotificacao("❤️ Produto salvo na sua Lista de Desejos (localStorage)!");
                return [...prev, produtoId];
            }
        });
    }, [exibirNotificacao]);

    const adicionarAoCarrinho = useCallback(async (produto: Produto, variacao?: string, qtd: number = 1) => {
        const variacaoFinal = variacao || (produto.variacoes?.[0] ?? "Padrão");
        const itemExistente = carrinho.find(
            c => c.produtoId === produto.id && (c.variacaoEscolhida || "Padrão") === variacaoFinal
        );

        try {
            if (itemExistente && itemExistente.id) {
                const novaQtd = itemExistente.quantidade + qtd;
                const atualizado: ItemCarrinho = {
                    ...itemExistente,
                    quantidade: novaQtd,
                    selecionado: true
                };
                await api.put(`${ENDPOINTS.CARRINHO}/${itemExistente.id}`, atualizado);
                setCarrinho(prev => prev.map(c => (c.id === itemExistente.id ? atualizado : c)));
            } else {
                const novoItem: ItemCarrinho = {
                    produtoId: produto.id,
                    nome: produto.nome,
                    preco: produto.preco,
                    precoOriginal: produto.precoOriginal,
                    imagem: produto.imagem,
                    quantidade: qtd,
                    selecionado: true,
                    variacaoEscolhida: variacaoFinal
                };
                const resp = await api.post<ItemCarrinho>(ENDPOINTS.CARRINHO, novoItem);
                setCarrinho(prev => [...prev, { ...resp.data, selecionado: true }]);
            }
        } catch {
            if (itemExistente) {
                setCarrinho(prev =>
                    prev.map(c =>
                        c.produtoId === produto.id ? { ...c, quantidade: c.quantidade + qtd } : c
                    )
                );
            } else {
                const novoId = carrinho.length ? Math.max(...carrinho.map(c => c.id || 0)) + 1 : 1;
                setCarrinho(prev => [
                    ...prev,
                    {
                        id: novoId,
                        produtoId: produto.id,
                        nome: produto.nome,
                        preco: produto.preco,
                        precoOriginal: produto.precoOriginal,
                        imagem: produto.imagem,
                        quantidade: qtd,
                        selecionado: true,
                        variacaoEscolhida: variacaoFinal
                    }
                ]);
            }
        }
        exibirNotificacao(`🛒 "${produto.nome}" adicionado ao carrinho!`);
    }, [carrinho, exibirNotificacao]);

    const atualizarQuantidadeCarrinho = useCallback(async (itemId: number, novaQtd: number) => {
        if (novaQtd < 1) return;
        const item = carrinho.find(c => c.id === itemId);
        if (!item) return;

        const atualizado = { ...item, quantidade: novaQtd };
        setCarrinho(prev => prev.map(c => (c.id === itemId ? atualizado : c)));

        try {
            await api.put(`${ENDPOINTS.CARRINHO}/${itemId}`, atualizado);
        } catch {
            // Mantém estado local atualizado
        }
    }, [carrinho]);

    const alternarSelecaoItemCarrinho = useCallback((itemId: number) => {
        setCarrinho(prev =>
            prev.map(c => (c.id === itemId ? { ...c, selecionado: !c.selecionado } : c))
        );
    }, []);

    const selecionarTodosCarrinho = useCallback((selecionar: boolean) => {
        setCarrinho(prev => prev.map(c => ({ ...c, selecionado: selecionar })));
    }, []);

    const removerDoCarrinho = useCallback(async (itemId: number) => {
        setCarrinho(prev => prev.filter(c => c.id !== itemId));
        try {
            await api.delete(`${ENDPOINTS.CARRINHO}/${itemId}`);
        } catch {
            // Mantém estado local atualizado
        }
        exibirNotificacao("🗑️ Item removido do carrinho.");
    }, [exibirNotificacao]);

    const limparItensSelecionadosCarrinho = useCallback(async () => {
        const selecionados = carrinho.filter(c => c.selecionado);
        setCarrinho(prev => prev.filter(c => !c.selecionado));
        for (const item of selecionados) {
            if (item.id) {
                try {
                    await api.delete(`${ENDPOINTS.CARRINHO}/${item.id}`);
                } catch {
                    // Ignora erro offline
                }
            }
        }
    }, [carrinho]);

    const aplicarCupom = useCallback((codigo: string): boolean => {
        const limpo = codigo.trim().toUpperCase();
        const encontrado = CUPONS_DISPONIVEIS.find(c => c.codigo === limpo);
        if (!encontrado) {
            exibirNotificacao("⚠️ Cupom inválido ou expirado.");
            return false;
        }
        setCupomAtivo(encontrado);
        exibirNotificacao(`🎟️ Cupom ${encontrado.codigo} aplicado: ${encontrado.descricao}!`);
        return true;
    }, [exibirNotificacao]);

    const removerCupom = useCallback(() => {
        setCupomAtivo(null);
        exibirNotificacao("Cupom removido.");
    }, [exibirNotificacao]);

    const cadastrarNovoProduto = useCallback(async (novo: Omit<Produto, "id">) => {
        try {
            const resp = await api.post<Produto>(ENDPOINTS.PRODUTOS, novo);
            setProdutos(prev => [...prev, resp.data]);
            exibirNotificacao(`✅ Produto "${novo.nome}" cadastrado na API!`);
        } catch {
            const novoId = produtos.length ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
            setProdutos(prev => [...prev, { ...novo, id: novoId }]);
            exibirNotificacao(`✅ Produto "${novo.nome}" cadastrado (modo local)!`);
        }
    }, [produtos, exibirNotificacao]);

    const atualizarProdutoCatalogo = useCallback(async (id: number, parcial: Partial<Produto>) => {
        const atual = produtos.find(p => p.id === id);
        if (!atual) return;
        const atualizado: Produto = { ...atual, ...parcial };

        setProdutos(prev => prev.map(p => (p.id === id ? atualizado : p)));

        try {
            await api.put(`${ENDPOINTS.PRODUTOS}/${id}`, atualizado);
        } catch {
            // Mantém em memória caso offline
        }
        exibirNotificacao(`💾 Produto "${atualizado.nome}" atualizado com sucesso!`);
    }, [produtos, exibirNotificacao]);

    const excluirProdutoCatalogo = useCallback(async (id: number) => {
        setProdutos(prev => prev.filter(p => p.id !== id));
        try {
            await api.delete(`${ENDPOINTS.PRODUTOS}/${id}`);
        } catch {
            // Ignora offline
        }
        exibirNotificacao("🗑️ Produto removido do catálogo.");
    }, [exibirNotificacao]);

    // Reajuste de preços em massa com gravação automática de Snapshot antes da alteração
    const reajustarPrecosEmMassa = useCallback(async (percentual: number, categoriaAlvo: string) => {
        if (!percentual) return;

        // 1. Grava Snapshot dos preços atuais antes de alterar
        const mapaSnapshot: Record<number, { preco: number; precoOriginal?: number }> = {};
        produtos.forEach(p => {
            mapaSnapshot[p.id] = { preco: p.preco, precoOriginal: p.precoOriginal };
        });
        const novoSnapshot: SnapshotPreco = {
            dataHora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            precos: mapaSnapshot
        };
        setSnapshotPrecos(novoSnapshot);
        localStorage.setItem("chopits_price_snapshot", JSON.stringify(novoSnapshot));

        // 2. Calcula os novos preços nos produtos da categoria alvo
        const fator = 1 + percentual / 100;
        const novosProdutos = produtos.map(p => {
            const deveAlterar = categoriaAlvo === "todas" || p.categoria === categoriaAlvo;
            if (!deveAlterar) return p;

            const novoPreco = Math.max(1, Number((p.preco * fator).toFixed(2)));
            const precoOrig =
                percentual < 0 && (!p.precoOriginal || p.precoOriginal < p.preco)
                    ? p.preco
                    : p.precoOriginal;

            return {
                ...p,
                preco: novoPreco,
                precoOriginal: precoOrig
            };
        });

        setProdutos(novosProdutos);

        // 3. Persiste no JSON-Server para os itens afetados
        const afetados = novosProdutos.filter(
            p => categoriaAlvo === "todas" || p.categoria === categoriaAlvo
        );
        for (const prod of afetados) {
            try {
                await api.put(`${ENDPOINTS.PRODUTOS}/${prod.id}`, prod);
            } catch {
                // Ignora se offline
            }
        }

        const sinal = percentual > 0 ? `+${percentual}%` : `${percentual}%`;
        exibirNotificacao(`🏷️ Reajuste em massa (${sinal}) aplicado em ${afetados.length} produtos!`);
    }, [produtos, exibirNotificacao]);

    const reverterPrecosSnapshot = useCallback(async () => {
        if (!snapshotPrecos) {
            exibirNotificacao("⚠️ Nenhum snapshot de preços anterior encontrado.");
            return;
        }

        const restaurados = produtos.map(p => {
            const registro = snapshotPrecos.precos[p.id];
            if (!registro) return p;
            return {
                ...p,
                preco: registro.preco,
                precoOriginal: registro.precoOriginal
            };
        });

        setProdutos(restaurados);

        for (const prod of restaurados) {
            try {
                await api.put(`${ENDPOINTS.PRODUTOS}/${prod.id}`, prod);
            } catch {
                // Ignora se offline
            }
        }

        exibirNotificacao(`⏪ Preços revertidos para o snapshot das ${snapshotPrecos.dataHora}!`);
    }, [produtos, snapshotPrecos, exibirNotificacao]);

    const salvarHomeBannerConfig = useCallback((novaConfig: HomeBannerConfig) => {
        setHomeBannerConfig(novaConfig);
        localStorage.setItem("chopits_home_config", JSON.stringify(novaConfig));
        exibirNotificacao("🎨 Configuração de Banners da Vitrine salva e publicada na Home!");
    }, [exibirNotificacao]);

    const totalItensCarrinho = useMemo(() => {
        return carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    }, [carrinho]);

    return (
        <StoreContext.Provider
            value={{
                produtos,
                carrinho,
                favoritos,
                cupomAtivo,
                buscaGlobal,
                setBuscaGlobal,
                loading,
                erroApi,
                fonteDados,
                notificacao,
                totalItensCarrinho,
                homeBannerConfig,
                dataSnapshotPrecos: snapshotPrecos?.dataHora ?? null,
                recarregarDados,
                adicionarAoCarrinho,
                atualizarQuantidadeCarrinho,
                alternarSelecaoItemCarrinho,
                selecionarTodosCarrinho,
                removerDoCarrinho,
                limparItensSelecionadosCarrinho,
                alternarFavorito,
                aplicarCupom,
                removerCupom,
                cadastrarNovoProduto,
                atualizarProdutoCatalogo,
                excluirProdutoCatalogo,
                reajustarPrecosEmMassa,
                reverterPrecosSnapshot,
                salvarHomeBannerConfig,
                exibirNotificacao
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = (): StoreContextType => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error("useStore deve ser utilizado dentro de um StoreProvider");
    }
    return context;
};
