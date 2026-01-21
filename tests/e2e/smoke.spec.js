const { test, expect } = require('@playwright/test');

function collectBrowserErrors(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(new Error(message.text()));
    }
  });
  page.on('pageerror', (error) => {
    errors.push(error);
  });
  return errors;
}

async function readDayValue(page) {
  const dayRow = page
    .locator('#screen-hub .panel p')
    .filter({ hasText: 'Day:' })
    .first();
  const text = await dayRow.textContent();
  const match = text ? text.match(/Day:\s*(\d+)/) : null;
  if (!match) {
    throw new Error('Unable to parse Day value from Hub panel.');
  }
  return Number(match[1]);
}

test('advance day persists after reload', async ({ page }) => {
  const errors = collectBrowserErrors(page);

  await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });

  const startingDay = await readDayValue(page);

  await page.locator('[data-action="advance-day"]').click();

  await expect
    .poll(() => readDayValue(page))
    .toBe(startingDay + 1);

  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect
    .poll(() => readDayValue(page))
    .toBe(startingDay + 1);

  expect(errors).toEqual([]);
});
