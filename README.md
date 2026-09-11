# Appium + WebdriverIO Mobile Portfolio

Projeto de portfolio de automacao de testes **mobile nativo** (iOS e Android), com **WebdriverIO + Appium**, em **TypeScript**, seguindo o padrao **Page Object Model (POM)**. Complementa o [playwright-qa-portfolio](https://github.com/luizvendramini/playwright-qa-portfolio) (Web UI + API), cobrindo a camada de automacao que exige uma stack diferente: apps nativos iOS/Android.

## Por que WebdriverIO + Appium?

Testes de app nativo nao rodam em um navegador: precisam de um driver que fale o protocolo de automacao de cada plataforma (XCUITest no iOS, UiAutomator2 no Android). O **Appium** é o padrao de mercado para isso, e o **WebdriverIO** é o test runner/framework com a integracao mais madura com Appium (servico oficial `@wdio/appium-service`, suporte nativo a comandos mobile como `scrollIntoView`, `isKeyboardShown`, gestos, etc). Essa combinacao (WebdriverIO + Appium) é a mais usada hoje em automacao mobile em times de QA.

## App de demonstracao: por que nao um app proprio?

Para automacao mobile, ao contrario de web, nao da para "escrever um app do zero" com a mesma facilidade de uma mock-app HTTP (exige build nativo, assinatura, toolchain de iOS/Android). Por isso este projeto usa o **[native-demo-app](https://github.com/webdriverio/native-demo-app)**, o app oficial de demonstracao mantido pela propria equipe do WebdriverIO especificamente para ensinar/testar automacao com Appium. Ele expoe telas com os elementos nativos mais comuns de testar: login/cadastro com validacao e alerta nativo, inputs de texto, switch, dropdown, gestos de swipe e drag.

A versao do app é **fixada** (`v2.2.0`) nos workflows de CI e nos arquivos de configuracao, pelo mesmo motivo de determinismo já aplicado no [playwright-qa-portfolio](https://github.com/luizvendramini/playwright-qa-portfolio): uma nova versao do app poderia mudar elementos/telas e quebrar a suite sem nenhuma mudanca no nosso codigo.

## Por que nao rodar isso no sandbox local deste ambiente?

Automacao mobile depende de infraestrutura que simplesmente nao existe num container Linux comum: um **simulador de iOS** só roda dentro do Xcode, em macOS; um **emulador de Android** com aceleracao de hardware precisa de KVM (Linux) ou Hypervisor.Framework (macOS). Por isso, assim como no projeto Web/API, o **GitHub Actions é o ambiente real de execucao e validacao** deste projeto — e não um mero coadjuvante do CI.

## Estrutura do projeto

```
appium-webdriverio-mobile-portfolio/
├── apps/                        # apks/zips baixados em tempo de CI (nao versionados)
├── config/
│   ├── wdio.shared.conf.ts              # timeouts, framework, reporter (comum as 2 plataformas)
│   ├── wdio.shared.local.appium.conf.ts # sobe/derruba o servidor Appium local automaticamente
│   ├── wdio.android.conf.ts             # capabilities do Android (UiAutomator2)
│   └── wdio.ios.conf.ts                 # capabilities do iOS (XCUITest)
├── pages/                        # Page Objects (POM) - uma classe por tela do app
│   ├── base.page.ts
│   ├── home.page.ts
│   ├── login.page.ts
│   └── forms.page.ts
├── components/                   # elementos reutilizaveis entre telas (nao sao uma tela inteira)
│   ├── tab-bar.component.ts
│   └── native-alert.component.ts
├── tests/specs/                  # os testes em si (specs)
│   ├── navigation.spec.ts
│   ├── login.spec.ts
│   └── forms.spec.ts
├── scripts/
│   └── detect-ios-simulator.mjs  # detecta dinamicamente um simulador iOS disponivel no runner
└── .github/workflows/
    ├── android.yml
    └── ios.yml
```

### Por que `pages/` (Page Objects) e nao `screens/`

Adotei a mesma convencao de nomenclatura do [playwright-qa-portfolio](https://github.com/luizvendramini/playwright-qa-portfolio) (`pages/*.page.ts`) para manter consistencia entre os dois portfolios, mesmo sabendo que a nomenclatura mais comum no mundo mobile costuma ser "screen objects". A ideia é a mesma (uma classe encapsulando os seletores e acoes de uma tela), só muda o nome da pasta.

## Decisoes de arquitetura relevantes

- **Selectors por accessibility id (`~elementId`)**: o app usa o mesmo id como `testID` no iOS e `accessibilityLabel` no Android, entao um unico seletor funciona nas duas plataformas — evita duplicar Page Objects por plataforma.
- **Diferencas de plataforma isoladas em `components/`**: alertas nativos e o estado de um switch nativo expõem atributos diferentes em iOS/Android; essa diferenca fica encapsulada em `NativeAlert` e `FormsPage.isSwitchActive()`, para que os arquivos de spec continuem 100% agnosticos de plataforma.
- **`deviceName`/`platformVersion` via variavel de ambiente** (`config/wdio.android.conf.ts`, `config/wdio.ios.conf.ts`): o emulador Android é criado dinamicamente no CI (`reactivecircus/android-emulator-runner`) e o simulador iOS disponivel muda conforme a imagem `macos-latest` do GitHub Actions é atualizada — hardcodar esses valores quebraria a suite a cada mudanca de infraestrutura do CI, entao eles sao resolvidos em tempo de execucao (ver `scripts/detect-ios-simulator.mjs` para o caso do iOS).
- **CI sem device cloud pago**: o boilerplate oficial do WebdriverIO usa Sauce Labs (servico pago) para rodar os testes. Este projeto usa somente infraestrutura gratuita do proprio GitHub Actions (emulador Android acelerado por KVM em `ubuntu-latest`, simulador iOS nativo em `macos-latest`) — sem depender de credenciais de terceiros, o que também torna o projeto 100% reproduzivel por qualquer pessoa que der fork.

## Como rodar localmente

Pré-requisitos: Node 18+, Android SDK + um emulador criado (Android Studio) e/ou Xcode com simuladores instalados (macOS).

```bash
npm install
npx appium driver install uiautomator2   # apenas para Android
npx appium driver install xcuitest       # apenas para iOS

mkdir -p apps
# baixe os apps de demonstracao (ver Releases do native-demo-app) para apps/

npm run android   # roda a suite no Android
npm run ios       # roda a suite no iOS
npm run typecheck # checagem de tipos do projeto inteiro
```

## CI

Dois workflows independentes, cada um publicando os logs do Appium como artefato ao final:

- [`android.yml`](.github/workflows/android.yml): `ubuntu-latest`, emulador Android via KVM.
- [`ios.yml`](.github/workflows/ios.yml): `macos-latest`, simulador iOS nativo.

## Stack

- [WebdriverIO](https://webdriver.io/) + [Appium](https://appium.io/) — automacao de apps nativos iOS/Android
- TypeScript — 100% do codigo do projeto
- Page Object Model — arquitetura dos testes
- [native-demo-app](https://github.com/webdriverio/native-demo-app) — app-alvo oficial de demonstracao (WebdriverIO)
- GitHub Actions (CI) — Android via `reactivecircus/android-emulator-runner`, iOS via simulador nativo do runner `macos-latest`
