import { join } from 'node:path';
import { config as sharedConfig } from './wdio.shared.local.appium.conf.js';

/**
 * `deviceName` e `platformVersion` sao lidos de variaveis de ambiente, com
 * um fallback para uso local. Isso evita hardcodar um emulador especifico:
 * no CI, o emulador e criado dinamicamente pelo `android-emulator-runner`
 * (ver .github/workflows/android.yml) e pode mudar de versao com o tempo;
 * localmente, cada desenvolvedor tem seus proprios AVDs configurados.
 */
const DEVICE_NAME = process.env.ANDROID_DEVICE_NAME ?? 'Android Emulator';
const PLATFORM_VERSION = process.env.ANDROID_PLATFORM_VERSION ?? '14.0';

// Nome do apk baixado do release oficial do native-demo-app (ver README:
// "App de demonstracao" para o link e a justificativa da versao fixada).
const APP_FILE = process.env.ANDROID_APP_PATH ?? join(process.cwd(), 'apps', 'android.wdio.native.app.v2.2.0.apk');

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  specs: ['../tests/specs/**/*.spec.ts'],

  capabilities: [
    {
      platformName: 'Android',
      'wdio:maxInstances': 1,
      'appium:deviceName': DEVICE_NAME,
      'appium:platformVersion': PLATFORM_VERSION,
      'appium:orientation': 'PORTRAIT',
      'appium:automationName': 'UiAutomator2',
      'appium:app': APP_FILE,
      'appium:appWaitActivity': 'com.wdiodemoapp.MainActivity',
      'appium:newCommandTimeout': 240,
    },
  ],
};
