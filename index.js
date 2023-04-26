const { chromium } = require('playwright');

(async () => {

    const browser = await chromium.launch({
        headless: false
    });

    const context = await browser.newContext({
        recordVideo: {
            dir: './videos'
        }
    });

    const page = await context.newPage();
    await page.goto('https://dev.to');

    await page.type('#header-search input[type=text]', 'playwright');
    await page.waitForTimeout(1000);
    await page.click('#header-search button[type=submit]');

    await page.waitForSelector('#articles-list article');

    const links = await page.evaluate(() => {
        const items = document.querySelectorAll('article.crayons-story h3 a');

        const links = [];
        for (let item of items) {
            links.push(item.href);
        }
        return links;
    });

    for (let link of links) {
        await page.goto(link);

        const h1Text = await page.evaluate(() => document.querySelector('h1').innerText);
        console.log(h1Text);

        await page.waitForTimeout(1000);
    }

    await context.close();
    await browser.close();

})();