/**
 * Barra de navegacao inferior do app, presente em todas as telas.
 * Nao e um Page Object (nao representa uma tela inteira), e sim um
 * componente reutilizavel entre specs - por isso vive em `components/`
 * e nao em `pages/`.
 */
class TabBar {
  async openHome(): Promise<void> {
    await $('~Home').click();
  }

  async openLogin(): Promise<void> {
    await $('~Login').click();
  }

  async openForms(): Promise<void> {
    await $('~Forms').click();
  }

  async waitUntilShown(): Promise<boolean | void> {
    // Esse e o primeiro ponto de sincronizacao logo apos o app abrir "frio"
    // (cold start): o bundle JS do Expo ainda precisa carregar e renderizar,
    // o que pode levar bem mais tempo num emulador de CI do que numa
    // interacao normal em qualquer outro ponto da suite - por isso usamos
    // aqui o mesmo timeout global generoso (`waitforTimeout` no
    // wdio.shared.conf.ts) em vez de um valor mais curto e arbitrario, que
    // deixava esse primeiro passo mais propenso a flakiness que o resto da
    // suite.
    return $('~Home').waitForDisplayed();
  }
}

export default new TabBar();
