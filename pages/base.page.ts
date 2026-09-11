/**
 * Classe base para todas as "telas" (Page Objects) do app.
 *
 * Cada tela nativa tem um elemento raiz identificavel por accessibility id
 * (ex.: "Login-screen"). Centralizar o `waitForIsShown` aqui evita repetir
 * essa logica em cada Page Object e garante um comportamento consistente
 * de espera em toda a suite.
 */
export default abstract class BasePage {
  protected constructor(private readonly rootSelector: string) {}

  get root() {
    return $(this.rootSelector);
  }

  async waitForIsShown(isShown = true): Promise<boolean | void> {
    return this.root.waitForDisplayed({ reverse: !isShown });
  }
}
