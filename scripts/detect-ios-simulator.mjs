// Detecta um simulador de iPhone disponivel no runner atual e expoe
// device-name / platform-version / udid como outputs do GitHub Actions.
//
// Por que isso existe: a imagem `macos-latest` do GitHub Actions muda de
// versao do Xcode (e, portanto, de versoes de iOS disponiveis) com o tempo.
// Hardcodar "iPhone 15 / iOS 17.5" no workflow quebraria a suite a cada
// atualizacao da imagem. Detectar dinamicamente o primeiro simulador de
// iPhone disponivel torna o CI resiliente a essas mudancas.
import { execSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

const raw = execSync('xcrun simctl list devices available --json').toString();
const data = JSON.parse(raw);

let found = null;

for (const [runtime, devices] of Object.entries(data.devices)) {
  if (!runtime.includes('iOS')) continue;

  const iphone = devices.find((device) => device.name.startsWith('iPhone'));
  if (!iphone) continue;

  const versionMatch = runtime.match(/iOS-(\d+)-(\d+)/);
  const platformVersion = versionMatch ? `${versionMatch[1]}.${versionMatch[2]}` : '';

  found = { name: iphone.name, platformVersion, udid: iphone.udid };
  break;
}

if (!found) {
  console.error('Nenhum simulador de iPhone disponivel foi encontrado neste runner.');
  process.exit(1);
}

console.log(`Simulador selecionado: ${found.name} (iOS ${found.platformVersion})`);

const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
  appendFileSync(githubOutput, `device-name=${found.name}\n`);
  appendFileSync(githubOutput, `platform-version=${found.platformVersion}\n`);
  appendFileSync(githubOutput, `udid=${found.udid}\n`);
}
