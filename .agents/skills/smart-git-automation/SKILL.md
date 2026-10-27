---
name: smart-git-automation
description: Padrões de automação Git, branch strategy e mensagens de commit para o Chopits.
---

# 🐙 Smart Git Automation Guidelines

1. **Estratégia de Branches:**
   - `pratica-academica`: Preserva intacta a entrega da disciplina para o professor.
   - `main`: Branch oficial do produto e portfólio.
2. **Padrão de Mensagens (Conventional Commits):**
   - `feat(loja): adiciona modal de detalhes do produto`
   - `feat(admin): adiciona reajuste de precos em lote com snapshot`
   - `fix(carrinho): corrige calculo do frete com cupom`
   - `docs(academico): documenta conceitos de hooks e ciclo de vida`
   - `style(tema): atualiza paleta tech violet e emerald mint`
3. **Segurança:** Nunca execute comandos destrutivos (`git reset --hard` ou `git push -f`) sem instrução expressa.
