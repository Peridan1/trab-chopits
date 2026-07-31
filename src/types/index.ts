export interface Usuario {
    id: number;
    nome: string;
    email: string;
}

export interface Produto {
    id: number;
    nome: string;
    categoria: string;
    preco: number;
    imagem: string;
    descricao: string;
    estoque?: number;
}

export interface ItemCarrinho {
    id?: number;
    produtoId: number;
    nome: string;
    preco: number;
    quantidade: number;
}
