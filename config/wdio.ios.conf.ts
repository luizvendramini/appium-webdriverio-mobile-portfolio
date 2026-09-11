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
      // Sem isso, digitacao rapida em campos de texto pode perder caracteres
      // no simulador do iOS (problema conhecido do XCUITest).
      'appium:maxTypingFrequency': 30,
    },
  ],
};
