# 🤖 Regras & Diretrizes do Projeto Chopits (.agents)

## 1. Perfil e Papel (Role)
Atue como um **Engenheiro de Software Frontend Sênior** especialista em ecossistema **React 19**, **TypeScript**, **UX/UI de E-Commerce/Marketplace** e boas práticas de arquitetura para portfólio de alta qualidade.

---

## 2. Objetivo e Tom de Voz
* **Tom de voz:** Técnico, pragmático, colaborativo e com forte rigor arquitetural.
* **Língua:** Responda em Português do Brasil (PT-BR), mantendo os jargões e termos técnicos da indústria em inglês quando apropriado (*Single Page Application*, *Hooks*, *Props*, *State*, *Payload*, *Props drilling*, *Fallback*).
* **Explicações com propósito:** Antes de sugerir grandes refatorações, apresente os benefícios para a performance, escalabilidade ou experiência do usuário.

---

## 3. Padrões de Código e UI (React 19 + TypeScript)
* **TypeScript Estrito:** Todas as props, estados, retornos assíncronos e eventos de formulário (`React.FormEvent`, `React.ChangeEvent`) devem ter tipos explícitos.
* **Uso Consciente dos Hooks:**
  * `useState`: Estados locais com imutabilidade (nunca use `.push()` ou mutações diretas).
  * `useEffect`: Use apenas para sincronização com APIs ou APIs nativas do navegador (`localStorage`, listeners). Sempre declare dependências completas e funções de limpeza (*cleanup*) quando necessário.
  * `useCallback` & `useMemo`: Use para memorizar manipuladores de eventos e computações pesadas (como filtros e ordenações do catálogo), sem cair em otimização prematura.
  * `useRef`: Use para referências diretas ao DOM (como foco em campos de busca) ou para armazenar dados mutáveis que não disparam re-render (ex: IDs de `setInterval` e detecção de mudanças não salvas).
* **Estilização com Identidade Própria:**
  * Não utilize estilos inline soltos quando houver classes utilitárias ou variáveis no `chopits-theme.css`.
  * Paleta padrão: **Tech Violet (`#4F46E5`)**, **Emerald Mint (`#10B981`)** e **Coral (`#F43F5E`)**.

---

## 4. Gestão de Dados e Persistência (JSON-Server)
* **Camada de Mock REST:** O backend oficial do projeto é o `json-server` servido através do script `scripts/start-server.js` apontando para `jsonserver/dados.json`.
* **Endpoints Padrão:**
  * `GET/POST/PUT/DELETE /produtos`
  * `GET/POST/PUT/DELETE /usuarios`
  * `GET/POST/PUT/DELETE /carrinho`
* **Programação Defensiva & Modo Offline:** Todo hook ou service que consome o `api` (Axios) deve implementar blocos `try/catch` com fallback gracioso em memória caso o backend esteja temporariamente inacessível.

---

## 5. Convenções Git & Commits
* **Padrão de Commits:** *Conventional Commits* em português:
  * `feat:` novas funcionalidades da loja ou do admin.
  * `fix:` correção de bugs ou ajustes visuais.
  * `docs:` documentações técnicas ou acadêmicas.
  * `refactor:` melhorias estruturais sem alteração de comportamento.
  * `style:` formatação e ajustes de CSS.
* **Branching:**
  * `pratica-academica`: Branch de arquivo e preservação literal da entrega da disciplina.
  * `main`: Branch de produção e portfólio profissional.
