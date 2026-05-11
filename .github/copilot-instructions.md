# Instruções de Desenvolvimento - Vida Simples

## Sobre o Projeto

**Vida Simples** é um app web responsivo de organização pessoal e financeira, com foco em rotina, tarefas, hábitos, foco, calendário e dinheiro. O projeto prioriza simplicidade, leveza e acessibilidade, especialmente para pessoas com TDAH, ansiedade ou sobrecarga mental.

---

## Modo TDAH.Simples (Prioridade Central)

Este é o coração do projeto. Ao desenvolver qualquer funcionalidade, sempre pergunte: "Isso respeita o Modo TDAH.Simples?"

### Princípios:
- **Uma ação por vez** - evitar múltiplas opções simultâneas
- **Textos curtos** - frases simples e diretas
- **Menos estímulos visuais** - cards grandes, espaçamento amplo
- **Botões claros** - ações óbvias, sem ambiguidade
- **Cards grandes** - fácil de clicar, fácil de ler
- **Linguagem humana** - tom conversacional e acolhedor
- **Tarefas divididas em passos pequenos** - decomposição natural
- **Organização por período** - manhã, tarde, noite
- **Foco em começar, não em perfeição** - validar, não bloquear

---

## Identidade Visual

### Paleta de Cores
```
Roxo principal:      #7B5CFA
Roxo escuro:         #523CAD
Lilás suave:         #DCCFFF
Fundo claro:         #F8F5FF
Branco:              #FFFFFF
Rosa suave:          #F4C6F7
Verde sucesso:       #7BCFA6
Amarelo alerta:      #FFD166
Vermelho atraso:     #EF767A
Texto principal:     #1F2933
Texto secundário:    #6B7280
```

### Estilo Visual
- **Inspiração**: céu calmo, nuvens suaves, leveza e acolhimento
- **Abordagem**: moderno, limpo e adulto (não infantilizar)
- **Elementos**: cards arredondados, sombras suaves, gradientes sutis
- **Composição**: poucos elementos por tela, respiração visual
- **Fonte**: Lexend (principal)

---

## Tom de Voz

**Humano, simples, curto e acolhedor.**

### Exemplos de Mensagens
- "Hoje, vamos focar em uma coisa por vez."
- "Boa. Essa parte já foi."
- "Vamos começar pequeno."
- "Você não precisa resolver tudo agora."
- "Seu dinheiro livre está estimado aqui."
- "Essa tarefa parece grande. Vamos dividir?"

---

## Estrutura do App

### Abas Principais (Manter)
1. **Hoje** - ações imediatas do dia
2. **Rotina** - hábitos e tarefas recorrentes
3. **Dinheiro** - gestão financeira simplificada
4. **Foco** - blocos de concentração
5. **Perfil** - configurações e dados do usuário

### Preparação Futura
- Login e autenticação
- Banco de dados
- Sistema de assinatura
- Sincronização entre dispositivos

---

## Regras de Desenvolvimento

### ❌ Não Fazer
- Transformar o app em planilha
- Criar telas complexas
- Adicionar gráficos pesados
- Usar linguagem bancária fria
- Sobrecarregar visualmente

### ✅ Sempre Fazer
- Priorizar experiência mobile
- Manter responsividade em todas as resoluções
- Evitar quebrar funcionalidades existentes
- Reutilizar componentes existentes
- Preservar simplicidade extrema
- Priorizar clareza cognitiva (UX antes de recursos)

---

## Checklist para Alterações

Antes de fazer commit, valide:

- [ ] Mantém responsividade (mobile-first)
- [ ] Não quebra funcionalidades existentes
- [ ] Reutiliza componentes existentes
- [ ] Preserva a extrema simplicidade
- [ ] Linguagem é humana e acolhedora
- [ ] Segue a paleta de cores definida
- [ ] Respeita o Modo TDAH.Simples
- [ ] Usa Lexend como fonte
- [ ] Layout é limpo com poucos elementos
- [ ] Cards/componentes têm bordas arredondadas e sombras suaves

---

## Stack Técnico

- **Linguagem Principal**: TypeScript (96.6%)
- **Estilos**: CSS (2.9%)
- **Scripts**: JavaScript (0.5%)

Manter o TypeScript como linguagem principal para type-safety e melhor DX.

---

## Princípio Guia

> "Simplicidade extrema é uma feature, não uma limitação."

Toda decisão deve passar por: Isso torna o app mais simples ou mais complexo? Se torna mais complexo, há uma razão que justifica?
