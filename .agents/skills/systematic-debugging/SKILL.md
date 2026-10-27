---
name: systematic-debugging
description: Método rigoroso e estruturado para diagnóstico e correção de bugs sem tentativa e erro cega.
---

# 🔍 Systematic Debugging Guidelines

1. **Leitura Completa do Stack Trace:** Antes de alterar código, inspecione a mensagem exata de erro, arquivo, linha e coluna.
2. **Isolamento de Causa Raiz:** Diferencie sintomas de causas fundamentais.
3. **Validação Contínua:** Após qualquer ajuste, execute sempre:
   ```bash
   npm run build
   npm run lint
   ```
4. **Resiliência a Falhas:** Todo consumo de APIs REST deve prever estados de `loading`, `error` e contingência (*offline fallback*).
