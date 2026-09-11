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
    return $('~Home').waitForDisplayed({ timeout: 20_000 });
  }
}

export default new TabBar();
