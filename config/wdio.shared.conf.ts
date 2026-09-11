/**
 * Configuracao base, compartilhada entre Android e iOS.
 *
 * Os campos `specs` e `capabilities` sao apenas placeholders aqui: cada
 * plataforma (wdio.android.conf.ts / wdio.ios.conf.ts) sobrescreve os
 * valores reais, evitando duplicar o restante da configuracao (timeouts,
 * reporter, framework) em dois arquivos.
 */
export const config: WebdriverIO.Config = {
  specs: [],
  capabilities: [],

  logLevel: 'info',

  // Testes de automacao mobile via Appium tendem a ser mais lentos que
  // testes web (boot de app, animacoes nativas, gestos) - os timeouts
  // abaixo sao propositalmente maiores que o padrao do WebdriverIO.
  waitforTimeout: 45_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,

  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 3 * 60 * 1000,
  },
};
