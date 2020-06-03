const puppeteer = require('puppeteer');
const rmdir = require('rimraf');
const tempy = require('tempy');

class CookieReader {
  async open({
    tmpdir = tempy.directory(),
    chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  }) {
    this.child = require('child_process').execFile(chromePath, [
      '--remote-debugging-port=9222',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${tmpdir}`,
    ]);

    this.child.stderr.on('data', data => {
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
    this.browser = await puppeteer.connect({ browserWSEndpoint });
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

module.exports = CookieReader;
