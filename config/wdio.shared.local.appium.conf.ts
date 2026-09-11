import { config as sharedConfig } from './wdio.shared.conf.js';

/**
 * Configuracao compartilhada por quem roda os testes com um servidor Appium
 * local (tanto localmente na maquina do dev quanto no CI): o servico
 * `appium` do WebdriverIO sobe/derruba o servidor Appium automaticamente
 * antes/depois da suite, entao nao e preciso rodar `appium server` manualmente
 * em outro terminal - nem localmente, nem no workflow de CI.
 */
export const config: Omit<WebdriverIO.Config, 'capabilities'> = {
  ...sharedConfig,

  services: [
    [
      'appium',
      {
        args: {
          // Necessario para o Appium executar comandos adb locais
          // (ex.: instalar o apk) e baixar o Chromedriver certo automaticamente.
          relaxedSecurity: true,
        },
        logPath: './logs',
      },
    ],
  ],

  before: async () => {
    // So se aplica ao Android: reduz o timeout padrao da estrategia de
    // localizacao UiSelector (10s -> 3s), assim um elemento que realmente
    // nao existe falha rapido em vez de segurar a suite inteira.
    if (driver.isAndroid) {
      await driver.updateSettings({ waitForSelectorTimeout: 3_000 });
    }
  },
};
