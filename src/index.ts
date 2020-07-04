import CookieReader from './CookieReader';
import tempy from 'tempy';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const tmpdir = tempy.directory();

  const cookieReader = new CookieReader();
  await cookieReader.open({ tmpdir, chromePath: CHROME });

  process.on('SIGINT', sigHandler);
  process.on('SIGTERM', sigHandler);

  async function sigHandler() {
    const cookies = await cookieReader.readCookies();
    console.log(JSON.stringify(cookies));
    await cookieReader.close();
  }

  console.error('Press CTRL-C to close the browser and dump cookies');
})();
