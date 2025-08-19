# Gestão de Eventos — Monorepo (React + React Native + Flutter)

Monorepo que implementa uma solução simples de gestão de eventos atendendo ao desafio proposto:
### Web (React + TS + Vite + MUI): Dashboard com filtros, listagem e formulário de evento.
### Mobile (React Native + TS): Lista de eventos, detalhes e “Minhas inscrições”.
### Flutter (projeto isolado): Detalhes do evento consumindo REST com controle de loading/error e gerenciador de estado.
### Persistência compartilhada via mock REST (JSON local), para que Web e Mobile consumam a mesma “API”.

- Monorepo com PNPM Workspaces — facilita compartilhar convenções e rodar cada app isoladamente.
- Mock REST com json-server lendo tools/api/db.json – simples, rápido e igual para Web e Mobile.
- React (Web)
- Vite + TypeScript (+ MUI para UI).
- Context + hooks (EventsCtx) para estado de filtros/lista.
-  React Native (Mobile)
- Projeto React Native CLI com TypeScript.
- Consome a mesma API; estado leve de “inscrições” em src/store/subs.ts (store simples baseada em hooks).

## Flutter

- Projeto isolado em apps/eventos_flutter.
- Tela de Detalhes do Evento consumindo REST, com controle de loading/error e gerenciador de estado (Provider).
- Configuração de Vitest + @testing-library/react no Web.
- Incluídos testes smoke funcionais para garantir renderização e bootstrap do módulo.

# Estrutura do repositório
```bash
ReactNFlutter/
├─ apps/
│  ├─ eventos-web/           # Web (React + Vite + TS + MUI)
│  ├─ EventosMobile/         # Mobile (React Native + TS)
│  └─ eventos_flutter/       # Flutter (projeto isolado)
├─ tools/
│  └─ api/
│     └─ db.json             # Banco JSON do mock REST (json-server)
├─ pnpm-workspace.yaml
├─ package.json              # Scripts de topo
└─ README.md
```
Pré-requisitos

- Node 18+
- pnpm 8+ (npm i -g pnpm)

Para Mobile:
- Java JDK 17, Android SDK/Emulador, ANDROID_HOME
- Xcode (iOS)

Para Flutter:

- Flutter 3+ (flutter doctor ok)
- Dica (Windows): use PowerShell/WSL. Para Android, deixe um emulador pronto.

Clonar e instalar
```bash
git clone https://github.com/jardelva96/ReactNFlutter.git
cd ReactNFlutter
```
Java / Android SDK (para Android), Xcode (para iOS) – se for rodar o Mobile nativo
Flutter 3+ (para o módulo Flutter)
Dica (Windows): use PowerShell/WSL. Para Android, configure ANDROID_HOME e um emulador.
Como rodar a API (mock)

A API é um json-server simples servindo os eventos de tools/api/db.json.

na raiz do repo
```bash
pnpm install
```
subindo a API mock (porta 3005)
```bash
npx json-server --watch tools/api/db.json --port 3005
```

Rotas principais
```bash
GET http://localhost:3005/events
POST http://localhost:3005/events
PATCH/PUT/DELETE http://localhost:3005/events/:id
```
As propriedades dos eventos seguem o shape:
```bash
{ "id": "1", "name": "React Summit", "date": "2025-09-15", "type": "Meetup", "location": "SP" }
```
Como rodar o Web (React)
# terminal 1: certifique-se que a API está rodando
```bash
npx json-server --watch tools/api/db.json --port 3005
```
terminal 2
```bash
cd apps/eventos-web
pnpm install
pnpm dev
abre http://localhost:5173
```

## Funcionalidades (Web)

Login fictício (sem backend).
Listagem de eventos com colunas nome / data / tipo / local.
Filtros: por tipo e por intervalo de data.
Criar/Editar evento (formulário).
Exclusão com confirmação (window.confirm).
Persistência via mock REST.

Como rodar o Mobile (React Native)
# terminal 1: API mock
```bash
npx json-server --watch tools/api/db.json --port 3005
```
 terminal 2: Metro bundler
 ```bash
cd apps/EventosMobile
pnpm install
npx react-native start --reset-cache
```
 terminal 3: app no Android (emulador ligado)
 ```bash
npx react-native run-android
# ou no iOS (Xcode configurado)
npx react-native run-ios
```

## Funcionalidades (Mobile)

Lista os mesmos eventos da API.
Detalhes do evento com botão Inscrever-se.
Área Minhas inscrições (estado local simples) listando os eventos escolhidos.
A base da API fica em apps/EventosMobile/src/services/api.ts. Ajuste para o seu IP/porta se rodar no dispositivo físico.

Como rodar o Flutter
```bash
cd apps/eventos_flutter
flutter pub get
```
escolha o device (ex.: web chrome)
```bash
flutter devices
flutter run -d chrome
# ou -d <id do device>
```

## Funcionalidades (Flutter)
Tela de Detalhes do Evento consumindo REST do mock (http://localhost:3005 ou IP da máquina).
Gerenciador de estado com Provider.
Controle de loading/error.
Pensado para ser módulo isolado (não depende do monorepo em build).
Se rodar fora do localhost (em device físico), aponte a URL da API para o IP da máquina hospedeira.

Variáveis de ambiente
```bash
Web (Vite): apps/eventos-web/.env
VITE_API_URL=http://localhost:3001
Mobile (RN): apps/EventosMobile/src/services/api.ts
```
Altere a constante/baseURL conforme necessário.

Flutter: arquivo de serviço HTTP (ex.: lib/services/...) aponta para a mesma base.

### Testes
No módulo Web usamos Vitest + Testing Library.
Dois testes smoke garantem o bootstrap do app e do módulo utilitário:
```bash
cd apps/eventos-web
```
## roda os testes uma vez
```bash
npx vitest run
```

## Arquivos principais de teste:
- src/pages/Home.test.tsx — smoke render do Home.
- src/lib/date.smoke.test.ts — garante que o módulo carrega.
- A infraestrutura já está pronta para incluir testes mais profundos (componentes, hooks e integração).

## Requisitos Funcionais

Dashboard (Web)

✅ Login fictício
✅ Listagem de eventos (nome, data, tipo, local)
✅ Criação/Edição de evento (form)
✅ Filtros por tipo e data
✅ Persistência via JSON local / mock API

Mobile (React Native)

✅ Lista os mesmos eventos (mesma API)
✅ Tela de Detalhes com Inscrever-se
✅ Minhas inscrições (estado local simples)

Flutter (módulo isolado)

✅ Projeto independente
✅ Tela de Detalhes do Evento via REST
✅ Gerenciador de estado (Provider)
✅ Loading / Error

Requisitos Técnicos

✅ React/React Native com TypeScript
✅ Hooks e componentização
✅ Arquitetura organizada (contexts, services, screens)
✅ Documentação (este README)
✅ Testes em ao menos um módulo (Web)
