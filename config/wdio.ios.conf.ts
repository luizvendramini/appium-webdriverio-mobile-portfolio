import { join } from 'node:path';
import { config as sharedConfig } from './wdio.shared.local.appium.conf.js';

/**
 * `deviceName` e `platformVersion` sao lidos de variaveis de ambiente pelo
 * mesmo motivo do Android: o simulador iOS disponivel varia conforme a
 * versao do Xcode instalada na imagem do runner do GitHub Actions (ver
 * .github/workflows/ios.yml, que detecta um simulador disponivel via
 * `xcrun simctl` antes de rodar os testes) e conforme a maquina de cada dev.
 */
const DEVICE_NAME = process.env.IOS_DEVICE_NAME ?? 'iPhone 15';
const PLATFORM_VERSION = process.env.IOS_PLATFORM_VERSION ?? '17.5';

// Build do simulador baixado do release oficial do native-demo-app.
// Importante: builds de iOS desse app funcionam APENAS em simulador
// (limitacao da Apple para apps nao assinados/distribuidos pela App Store).
const APP_FILE = process.env.IOS_APP_PATH ?? join(process.cwd(), 'apps', 'ios.simulator.wdio.native.app.v2.2.0.zip');

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  specs: ['../tests/specs/**/*.spec.ts'],

  // Sobrescreve o `connectionRetryTimeout` de 120s (padrao em
  // wdio.shared.conf.ts) apenas para iOS. Precisa ficar acima dos timeouts
  // internos do Appium para o WebDriverAgent (capabilities abaixo:
  // wdaLaunchTimeout + wdaConnectionTimeout), senao o cliente desiste antes
  // do proprio Appium. O Android nao sofre desse problema (o UiAutomator2
  // so precisa instalar um apk pequeno), entao mantemos o timeout padrao la
  // e damos essa margem extra soh aqui.
  connectionRetryTimeout: 360_000,

  // Mesmo com todos os timeouts acima generosos, a criacao de sessao do
  // XCUITest as vezes ainda trava por varios minutos sem nenhum sintoma
  // novo no log (confirmado em CI, commit b865ab3: UND_ERR_HEADERS_TIMEOUT
  // apos ~7min) - isso ja nao e mais falta de timeout, e sim instabilidade
  // pontual do proprio par macOS-runner + simulador do GitHub Actions, fora
  // do nosso controle. Pra esse tipo especifico de flakiness de
  // infraestrutura (nao de teste em si - nao estamos escondendo um bug real
  // com isso), a pratica padrao e retry no nivel de spec file. Limitamos a
  // 2 tentativas extras: o suficiente pra absorver uma falha pontual de
  // ambiente, sem mascarar um problema real que se repita de forma
  // consistente. O Android nunca apresentou esse tipo de falha, entao o
  // retry fica isolado aqui.
  specFileRetries: 2,
  specFileRetriesDelay: 5,

  capabilities: [
    {
      platformName: 'iOS',
      'wdio:maxInstances': 1,
      'appium:deviceName': DEVICE_NAME,
      'appium:platformVersion': PLATFORM_VERSION,
      'appium:orientation': 'PORTRAIT',
      'appium:automationName': 'XCUITest',
      'appium:app': APP_FILE,
      'appium:newCommandTimeout': 240,
      // Margem extra alem do pre-boot feito no workflow (ver ios.yml): mesmo
      // com o simulador ja de pe, uma carga do runner mais pesada pode deixar
      // o boot mais lento que o padrao de 120s do Appium.
      'appium:simulatorStartupTimeout': 180_000,
      // Confirmado em CI (run #8, commit c959925): a criacao de sessao
      // falhou com "Could not proxy command to the remote server ...
      // ECONNREFUSED 127.0.0.1:8100" apos exatamente ~240s - o valor padrao
      // do `wdaConnectionTimeout` do driver XCUITest. Ou seja, o gargalo real
      // nao e mais o nosso `connectionRetryTimeout` (ja aumentado antes),
      // e sim os timeouts INTERNOS do proprio Appium esperando o
      // WebDriverAgent (WDA) compilar, instalar e responder dentro do
      // simulador - processo que, num simulador recem-criado rodando a
      // versao de iOS mais nova disponivel no runner (sem build de WDA em
      // cache), pode legitimamente passar dos defaults abaixo:
      //   wdaLaunchTimeout: 60s -> aqui, 240s
      //   wdaConnectionTimeout: 240s -> aqui, 300s
      // Generosos de proposito: sao apenas um teto de seguranca e nao
      // deixam uma sessao bem-sucedida mais lenta.
      'appium:wdaLaunchTimeout': 240_000,
      'appium:wdaConnectionTimeout': 300_000,
      // Sem isso, digitacao rapida em campos de texto pode perder caracteres
      // no simulador do iOS (problema conhecido do XCUITest).
      'appium:maxTypingFrequency': 30,
    },
  ],
};
