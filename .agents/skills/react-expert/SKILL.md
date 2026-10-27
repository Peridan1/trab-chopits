---
name: react-expert
description: Boas práticas avançadas para desenvolvimento em React 19 e TypeScript no ecossistema Chopits.
---

# ⚛️ React 19 & TypeScript Expert Guidelines

## 1. Princípios de Componentização
- Crie componentes com **Responsabilidade Única (SRP)**.
- Mantenha componentes de apresentação (`components/`) desacoplados de regras pesadas de negócio, utilizando o `useStore()` (`StoreContext.tsx`) para consumir o estado compartilhado.
- Declare interfaces TypeScript explícitas para todas as props (`interface NomeComponenteProps`).

## 2. Padrões de Estado & Imutabilidade
- Nunca mute arrays ou objetos diretamente:
  ```ts
  // ❌ Incorreto
  lista.push(novoItem);
  setLista(lista);

  // ✅ Correto
  setLista(prev => [...prev, novoItem]);
  ```
- Use funções de atualização funcionais (`setEstado(prev => ...)`) quando o novo estado depender do estado anterior, prevenindo condições de corrida (*race conditions*).

## 3. Otimizações de Renderização
- Aplique `useMemo` em operações de filtro e ordenação sobre o array de produtos.
- Aplique `useCallback` em manipuladores passados para componentes filhos em listas longas.
- Evite aninhar definições de componentes dentro de outros componentes para não quebrar a reconciliação do React.
