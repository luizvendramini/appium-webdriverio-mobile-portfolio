/**
 * Alertas nativos do sistema operacional (nao sao elementos do app, e sim
 * do proprio SO), por isso a arvore de elementos e completamente diferente
 * entre Android e iOS - este componente esconde essa diferenca do resto
 * da suite.
 */
const ANDROID_SELECTORS = {
  title: '*//android.widget.TextView[@resource-id="com.wdiodemoapp:id/alert_title"]',
  message: '*//android.widget.TextView[@resource-id="android:id/message"]',
  button: (text: string) => `*//android.widget.Button[@text="${text.toUpperCase()}"]`,
};

const IOS_ALERT_SELECTOR = "-ios predicate string:type == 'XCUIElementTypeAlert'";

class NativeAlert {
  async waitForIsShown(isShown = true): Promise<boolean | void> {
    const selector = driver.isAndroid ? ANDROID_SELECTORS.title : IOS_ALERT_SELECTOR;
    // Mesmo problema que ja corrigimos em TabBar.waitUntilShown(): esse
    // timeout fixo de 11s era mais curto que o timeout global da suite
    // (45s, em wdio.shared.conf.ts) e, sob a carga de um emulador/simulador
    // de CI, o alerta nativo (que so aparece depois do clique em LOGIN/SIGN
    // UP) as vezes demora mais que isso pra renderizar ou fechar -
    // confirmado em CI: "deve logar com sucesso" falhou com "element ...
    // still not existing after 11000ms" mesmo com o app e as credenciais
    // corretos. Herdar o timeout global deixa esse ponto de sincronizacao
    // tao resiliente quanto o resto da suite, sem deixar uma execucao
    // bem-sucedida mais lenta - o timeout e so um teto de seguranca.
    return $(selector).waitForExist({ reverse: !isShown });
  }

  async text(): Promise<string> {
    if (driver.isIOS) {
      return $(IOS_ALERT_SELECTOR).getText();
    }
    const title = await $(ANDROID_SELECTORS.title).getText();
    const message = await $(ANDROID_SELECTORS.message).getText();
    return `${title}\n${message}`;
  }

  async tapButton(buttonText: string): Promise<void> {
    // No iOS os botoes do alerta tem accessibility id igual ao texto exibido.
    // No Android, o texto do botao vem sempre em maiusculas.
    const selector = driver.isAndroid ? ANDROID_SELECTORS.button(buttonText) : `~${buttonText}`;
    await $(selector).click();
  }
}

export default new NativeAlert();
