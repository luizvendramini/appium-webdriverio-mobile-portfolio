import TabBar from '../../components/tab-bar.component.js';
import HomePage from '../../pages/home.page.js';
import LoginPage from '../../pages/login.page.js';
import FormsPage from '../../pages/forms.page.js';

describe('Navegacao entre telas pela tab bar,', () => {
  beforeEach(async () => {
    await TabBar.waitUntilShown();
  });

  it('deve exibir a tela de Login ao tocar na aba Login', async () => {
    await TabBar.openLogin();
    await expect(LoginPage.root).toBeDisplayed();
  });

  it('deve exibir a tela de Forms ao tocar na aba Forms', async () => {
    await TabBar.openForms();
    await expect(FormsPage.root).toBeDisplayed();
  });

  it('deve voltar para a Home ao tocar na aba Home', async () => {
    await TabBar.openForms();
    await TabBar.openHome();
    await expect(HomePage.root).toBeDisplayed();
  });
});
