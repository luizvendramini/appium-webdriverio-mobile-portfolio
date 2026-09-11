import TabBar from '../../components/tab-bar.component.js';
import FormsPage from '../../pages/forms.page.js';

describe('Elementos da tela Forms,', () => {
  beforeEach(async () => {
    await TabBar.waitUntilShown();
    await TabBar.openForms();
    await FormsPage.waitForIsShown(true);
  });

  it('deve refletir o texto digitado no resultado exibido na tela', async () => {
    const text = 'Portfolio de automacao mobile';

    await FormsPage.typeText(text);
    await expect(FormsPage.textInputResult).toHaveText(expect.stringContaining(text));

    // O app nao fecha/reabre entre os testes, entao o teclado pode continuar
    // visivel do teste anterior. Tocar no resultado tira o foco do campo de
    // texto sem depender de `driver.hideKeyboard()` (ver LoginPage para o
    // motivo dessa limitacao no iOS).
    if (await driver.isKeyboardShown()) {
      await FormsPage.tapOnTextInputResult();
    }
  });

  it('deve alternar o estado do switch ao tocar nele', async () => {
    await expect(await FormsPage.isSwitchActive()).toBe(false);

    await FormsPage.toggleSwitch();
    await expect(await FormsPage.isSwitchActive()).toBe(true);

    await FormsPage.toggleSwitch();
    await expect(await FormsPage.isSwitchActive()).toBe(false);
  });
});
