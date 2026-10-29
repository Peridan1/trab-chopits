export interface EnderecoUsuario {
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
}

export interface PedidoHistorico {
    id: string;
    data: string;
    itens: ItemCarrinho[];
    total: number;
    status: "Processando" | "Em Transporte" | "Entregue";
    codigoRastreio: string;
    enderecoEntrega: string;
    metodoPagamento: "pix" | "cartao";
}

export interface Usuario {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
    cargo?: "cliente" | "vendedor" | "admin";
    endereco?: EnderecoUsuario;
    pedidos?: PedidoHistorico[];
}

export interface AvaliacaoProduto {
    id: number;
    usuario: string;
    nota: number; // 1 a 5
    comentario: string;
    data: string;
}

export interface Produto {
    id: number;
    nome: string;
    categoria: string;
    preco: number;
    precoOriginal?: number;
    imagem: string;
    descricao: string;
    estoque?: number;
    vendidos?: number;
    avaliacao?: number;
    freteGratis?: boolean;
    ofertaRelampago?: boolean;
    lojaOficial?: boolean;
    variacoes?: string[];
    avaliacoes?: AvaliacaoProduto[];
}

export interface ItemCarrinho {
    id?: number;
    produtoId: number;
    nome: string;
    preco: number;
    precoOriginal?: number;
    imagem?: string;
    quantidade: number;
    selecionado?: boolean;
    variacaoEscolhida?: string;
}

export interface Cupom {
    codigo: string;
    descontoPercentual?: number;
    descontoFixo?: number;
    freteGratis?: boolean;
    descricao: string;
    minimoCompra?: number;
}

export interface HomeBannerConfig {
    badgeTexto: string;
    badgeDestaque: string;
    titulo: string;
    subtitulo: string;
    textoBotaoPrimario: string;
    linkBotaoPrimario: string;
    exibirOfertasRelampago: boolean;
    tituloSecaoDescobertas: string;
}
