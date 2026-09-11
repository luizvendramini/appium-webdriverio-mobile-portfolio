import TabBar from '../../components/tab-bar.component.js';
import LoginPage from '../../pages/login.page.js';
import NativeAlert from '../../components/native-alert.component.js';

// Massa de dados centralizada: o formulario valida formato de e-mail e
// senha com 8+ caracteres, entao qualquer valor usado nos testes precisa
// respeitar essas regras para chegar ao alerta de sucesso.
const VALID_CREDENTIALS = {
  username: 'qa.portfolio@webdriver.io',
  password: 'Test1234!',
};

describe('Login e Sign up,', () => {
  beforeEach(async () => {
    await TabBar.waitUntilShown();
    await TabBar.openLogin();
    await LoginPage.waitForIsShown(true);
  });

  it('deve logar com sucesso com credenciais validas', async () => {
    await LoginPage.openLoginTab();
    await LoginPage.submitLogin(VALID_CREDENTIALS);

    await NativeAlert.waitForIsShown();
    await expect(await NativeAlert.text()).toContain('Success');

    await NativeAlert.tapButton('OK');
    await NativeAlert.waitForIsShown(false);
  });

  it('deve cadastrar com sucesso com credenciais validas', async () => {
    await LoginPage.openSignUpTab();
    await LoginPage.submitSignUp(VALID_CREDENTIALS);

    await NativeAlert.waitForIsShown();
    await expect(await NativeAlert.text()).toContain('Signed Up');

    await NativeAlert.tapButton('OK');
    await NativeAlert.waitForIsShown(false);
  });
});
