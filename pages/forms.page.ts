import BasePage from './base.page.js';

/**
 * Tela "Forms": campos de input, switch e botoes que abrem alerta nativo.
 * Cobre interacoes tipicas de automacao mobile que nao existem no mundo web
 * (switch nativo, teclado nativo, alerta de sistema).
 */
class FormsPage extends BasePage {
  constructor() {
    super('~Forms-screen');
  }

  get textInput() {
    return $('~text-input');
  }

  get textInputResult() {
    return $('~input-text-result');
  }

  private get switchElement() {
    return $('~switch');
  }

  async typeText(text: string): Promise<void> {
    await this.textInput.setValue(text);
  }

  async tapOnTextInputResult(): Promise<void> {
    // Usado para tirar o foco do campo de texto e fechar o teclado nativo
    // (mesma limitacao do XCUITest mencionada em LoginPage).
    await this.textInputResult.click();
  }

  async toggleSwitch(): Promise<void> {
    await this.switchElement.click();
  }

  /**
   * O atributo que representa "ligado/desligado" difere por plataforma:
   * Android expoe `checked` como string "true"/"false", iOS expoe o texto
   * do elemento como "1"/"0". Encapsular essa diferenca aqui mantem os
   * testes (specs) 100% agnosticos de plataforma.
   */
  async isSwitchActive(): Promise<boolean> {
    if (driver.isAndroid) {
      return (await this.switchElement.getAttribute('checked')) === 'true';
    }
    return (await this.switchElement.getText()) === '1';
  }
}

export default new FormsPage();
