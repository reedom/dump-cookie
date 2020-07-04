import puppeteer, { Browser, Page } from 'puppeteer';
import rmdir from 'rimraf';
import tempy from 'tempy';
import { ChildProcess, execFile } from 'child_process';

export default class CookieReader {
  private child: ChildProcess | null = null;
  private browser: Browser | null = null;
  private page: Page | null = null;

  async open({
    tmpdir = tempy.directory(),
    chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }) {
    this.child = execFile(chromePath, [
      '--remote-debugging-port=9222',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${tmpdir}`,
      '--window-size=1200,768',
    ]);

    this.child.stderr!.on('data', data => {
      const m = data.toString().match(/(\bws:.*)/);
      if (m) {
        this._connectPuppeteer(m[1]);
      }
    });

    this.child.on('close', () => {
      rmdir(tmpdir, err => {
        if (err) console.error(`failed to remove temp dir "${tmpdir}"`);
      });
    });
  }

  async _connectPuppeteer(browserWSEndpoint) {
    this.browser = await puppeteer.connect({ browserWSEndpoint, defaultViewport: null });
    this.page = await this.browser.newPage();
  }

  async readCookies() {
    if (!this.page) {
      throw new Error('Puppeteer page is not opening');
    }
    return await this.page.cookies();
  }

  async close() {
    try {
      this.page && await this.page.close();
    } catch (_) {}
    this.page = null;

    try {
      this.browser && await this.browser.close();
    } catch (_) {}
    this.browser = null;

    try {
      this.child && this.child.kill('SIGHUP');
    } catch (_) {}
    this.child = null;
  }
}
