import BasePage from './base.page.js';

interface Credentials {
  username: string;
  password: string;
}

/**
 * Tela de Login / Sign up do app de demonstracao.
 *
 * Os seletores usam `~` (accessibility id), a estrategia recomendada pelo
 * Appium para apps React Native/Expo: o proprio app expoe o mesmo id tanto
 * como `testID` (iOS) quanto como `accessibilityLabel` (Android), entao um
 * unico seletor funciona nas duas plataformas sem `if (driver.isIOS)`.
 */
class LoginPage extends BasePage {
  constructor() {
    super('~Login-screen');
  }

  private get loginTab() {
    return $('~button-login-container');
  }

  private get signUpTab() {
    return $('~button-sign-up-container');
  }

  private get loginButton() {
    return $('~button-LOGIN');
  }

  private get signUpButton() {
    return $('~button-SIGN UP');
  }

  private get emailInput() {
    return $('~input-email');
  }

  private get passwordInput() {
    return $('~input-password');
  }

  private get repeatPasswordInput() {
    return $('~input-repeat-password');
  }

  async openLoginTab(): Promise<void> {
    await this.loginTab.click();
  }

  async openSignUpTab(): Promise<void> {
    await this.signUpTab.click();
  }

  /**
   * No iOS, o teclado as vezes cobre o botao de submit e nao ha uma forma
   * confiavel de escondê-lo via `driver.hideKeyboard()` (limitacao conhecida
   * do XCUITest). A solucao mais estavel e tocar fora do campo de texto,
   * dentro da propria tela.
   */
  private async dismissKeyboardIfNeeded(): Promise<void> {
    if (await driver.isKeyboardShown()) {
      await this.root.click();
    }
  }

  async submitLogin({ username, password }: Credentials): Promise<void> {
    await this.emailInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.dismissKeyboardIfNeeded();

    await this.loginButton.scrollIntoView({ scrollableElement: await this.root });
    await this.loginButton.click();
  }

  async submitSignUp({ username, password }: Credentials): Promise<void> {
    await this.emailInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.repeatPasswordInput.setValue(password);
    await this.dismissKeyboardIfNeeded();

    await this.signUpButton.scrollIntoView({ scrollableElement: await this.root });
    await this.signUpButton.click();
  }
}

export default new LoginPage();
