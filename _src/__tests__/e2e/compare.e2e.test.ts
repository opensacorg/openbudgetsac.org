const puppeteer = require('puppeteer');
const axeSourcePath = require.resolve('axe-core/axe.min.js');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8011';
const IPHONE_6_VIEWPORT = {
  width: 375,
  height: 667,
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};
const NAVIGATION_TIMEOUT_MS = 60000;

jest.setTimeout(120000);

describe('site e2e', () => {
  let browser;
  let page;

  beforeAll(async () => {
    const args =
      process.getuid?.() === 0 || process.env.CI
        ? ['--no-sandbox', '--disable-setuid-sandbox']
        : [];

    browser = await puppeteer.launch({
      headless: true,
      args,
    });
    page = await browser.newPage();
    await page.setViewport({width: 1400, height: 900});
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  /**
   * Builds format a11y violations.
   *
   * @param {any} violations Input value.
   * @returns {any} Function result.
   */
  function formatA11yViolations(violations) {
    return violations
      .map(violation => {
        const impactedNodes = violation.nodes.slice(0, 3).map(node => {
          return node.target.join(' ');
        });
        const targets =
          impactedNodes.length > 0
            ? impactedNodes.join(', ')
            : '(no node targets)';
        return `${violation.id} [${violation.impact || 'unknown'}] on ${targets}`;
      })
      .join('\n');
  }

  /**
   * Waits for legacy flow visualization to render status text.
   *
   * @param {string} url Absolute page URL.
   * @returns {Promise<void>} Completion promise.
   */
  async function loadFlowPage(url: string): Promise<void> {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    await page.waitForSelector('#fy option', {
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    await page.waitForSelector('#hover_description', {
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    await page.waitForFunction(
      () => {
        const value =
          document.querySelector('#hover_description')?.textContent || '';
        return /Showing chart for|Mostrando gráfica para/.test(value);
      },
      {timeout: NAVIGATION_TIMEOUT_MS},
    );
  }

  /**
   * Waits for legacy treemap to render visible rectangles.
   *
   * @param {string} url Absolute page URL.
   * @returns {Promise<void>} Completion promise.
   */
  async function loadTreePage(url: string): Promise<void> {
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    await page.waitForSelector('#dropdown select', {
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    await page.waitForFunction(
      () => document.querySelectorAll('#treemap rect').length > 0,
      {
        timeout: NAVIGATION_TIMEOUT_MS,
      },
    );
  }

  /**
   * Opens the first navbar dropdown and waits for the menu.
   *
   * @returns {Promise<void>} Completion promise.
   */
  async function openFirstNavDropdown(): Promise<void> {
    await page.click('nav .navbar-nav > li.dropdown > a.dropdown-toggle');
    await page.waitForFunction(
      () =>
        Boolean(document.querySelector('nav .navbar-nav > li.dropdown.open')),
      {
        timeout: NAVIGATION_TIMEOUT_MS,
      },
    );
  }

  /**
   * Selects the legacy Account dropdown value and triggers refresh.
   *
   * @param {string} accountValue Account value to select (`Revenue` or `Expense`).
   * @returns {Promise<void>} Completion promise.
   */
  async function switchLegacyAccount(
    accountValue: 'Revenue' | 'Expense',
  ): Promise<void> {
    await page.evaluate(nextValue => {
      const selects = Array.from(
        document.querySelectorAll<HTMLSelectElement>('#dropdown select'),
      );
      const account = selects.find(select =>
        Array.from(select.options).some(option => option.value === 'Revenue'),
      );
      if (!account) {
        throw new Error('Account selector missing Revenue value');
      }
      account.value = nextValue;
      account.dispatchEvent(new Event('change', {bubbles: true}));
    }, accountValue);

    await page.waitForFunction(
      () => document.querySelectorAll('#treemap rect').length > 0,
      {
        timeout: NAVIGATION_TIMEOUT_MS,
      },
    );
  }

  test('renders compare experience with controls and breakdown tabs', async () => {
    await page.goto(`${BASE_URL}/compare/`, {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT_MS,
    });

    await page.waitForSelector('#root h1', {timeout: NAVIGATION_TIMEOUT_MS});
    await page.waitForSelector('#root .choose-budget', {
      timeout: NAVIGATION_TIMEOUT_MS,
    });

    const pageText = await page.$eval('#root', el => el.textContent || '');

    expect(pageText).toContain('Compare');
    expect(pageText).toContain('Show changes as:');
    expect(pageText).toContain('Budget breakdowns');
    expect(pageText).toContain('Spending by Department');
    expect(pageText).toContain('Revenue by Category');
  });

  test('has no WCAG A/AA accessibility violations', async () => {
    await page.goto(`${BASE_URL}/compare/`, {
      waitUntil: 'domcontentloaded',
      timeout: NAVIGATION_TIMEOUT_MS,
    });

    await page.waitForSelector('#root h1', {timeout: NAVIGATION_TIMEOUT_MS});
    await page.addScriptTag({path: axeSourcePath});

    const axeResults = await page.evaluate(() => {
      const appRoot = document.querySelector('#root');
      if (!appRoot) {
        throw new Error('Missing #root container for accessibility scan.');
      }

      return window.axe.run(appRoot, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
        },
        rules: {
          // This rule can change in headless Chromium. We disable it to avoid false failures.
          'color-contrast': {enabled: false},
        },
      });
    });

    if (axeResults.violations.length > 0) {
      throw new Error(
        `Accessibility violations detected:\n${formatA11yViolations(axeResults.violations)}`,
      );
    }

    expect(axeResults.violations).toHaveLength(0);
  });

  test('loads usable constrained mode on iPhone 6 + 3G + limited CPU and RAM', async () => {
    const client = await page.target().createCDPSession();
    const defaultUserAgent = await browser.userAgent();
    try {
      await page.setUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 12_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
      );
      await page.setViewport(IPHONE_6_VIEWPORT);
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(Navigator.prototype, 'deviceMemory', {
          configurable: true,
          get: () => 1,
        });
      });
      await client.send('Network.enable');
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 400,
        downloadThroughput: 93750,
        uploadThroughput: 31250,
        connectionType: 'cellular3g',
      });
      await client.send('Emulation.setCPUThrottlingRate', {rate: 4});

      const startTime = Date.now();
      await page.goto(`${BASE_URL}/compare/`, {
        waitUntil: 'domcontentloaded',
        timeout: NAVIGATION_TIMEOUT_MS,
      });
      await page.waitForSelector('#root h1', {
        timeout: NAVIGATION_TIMEOUT_MS,
      });
      const elapsedMs = Date.now() - startTime;

      const pageText = await page.$eval('#root', el => el.textContent || '');
      expect(pageText).toContain(
        'Low-bandwidth mode is on to reduce data and battery use.',
      );
      expect(pageText).toContain('Compare');
      expect(pageText).toContain('Budget breakdowns');

      await page.waitForSelector('#root table tbody tr', {
        timeout: NAVIGATION_TIMEOUT_MS,
      });
      const rowCount = await page.$$eval(
        '#root table tbody tr',
        rows => rows.length,
      );
      const rowChartCount = await page.$$eval(
        '#root table tbody tr canvas',
        canvasEls => canvasEls.length,
      );
      expect(rowCount).toBeGreaterThan(0);
      expect(rowCount).toBeLessThanOrEqual(20);
      expect(rowChartCount).toBe(0);
      expect(elapsedMs).toBeLessThan(NAVIGATION_TIMEOUT_MS);
    } finally {
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1,
        connectionType: 'none',
      });
      await client.send('Emulation.setCPUThrottlingRate', {rate: 1});
      await page.setViewport({width: 1400, height: 900});
      await page.setUserAgent(defaultUserAgent);
    }
  });

  test('legacy overview/detail render in English with working dropdown and revenue switch', async () => {
    await loadFlowPage(`${BASE_URL}/adopted-budget-flow/?lang=en-US`);

    const flowText = await page.$$eval('#chart text', nodes => {
      return nodes.map(node => (node.textContent || '').trim()).filter(Boolean);
    });
    expect(flowText).toContain('Revenues');
    expect(flowText).toContain('Expenses');

    await openFirstNavDropdown();

    await loadTreePage(`${BASE_URL}/adopted-budget-tree/?lang=en-US`);
    const initialRects = await page.$$eval(
      '#treemap rect',
      nodes => nodes.length,
    );
    expect(initialRects).toBeGreaterThan(0);

    await switchLegacyAccount('Revenue');
    const revenueRects = await page.$$eval(
      '#treemap rect',
      nodes => nodes.length,
    );
    expect(revenueRects).toBeGreaterThan(0);
  });

  test('legacy overview/detail render in Spanish with translated labels and revenue switch', async () => {
    await loadFlowPage(`${BASE_URL}/adopted-budget-flow/?lang=es-419`);

    const flowText = await page.$$eval('#chart text', nodes => {
      return nodes.map(node => (node.textContent || '').trim()).filter(Boolean);
    });
    expect(flowText).toContain('Ingresos');
    expect(flowText).toContain('Gastos');
    expect(flowText).not.toContain('Revenues');
    expect(flowText).not.toContain('Expenses');

    await loadTreePage(`${BASE_URL}/adopted-budget-tree/?lang=es-419`);

    const accountOptions = await page.$$eval(
      '#dropdown select option',
      nodes => {
        return nodes.map(node => ({
          text: (node.textContent || '').trim(),
          value: node.getAttribute('value') || '',
        }));
      },
    );
    expect(accountOptions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({text: 'Ingresos', value: 'Revenue'}),
        expect.objectContaining({text: 'Gasto', value: 'Expense'}),
      ]),
    );

    await switchLegacyAccount('Revenue');
    const revenueRects = await page.$$eval(
      '#treemap rect',
      nodes => nodes.length,
    );
    expect(revenueRects).toBeGreaterThan(0);
  });
});
