const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    for (var i = 0; i < 70; i++) {
        await page.goto(`https://www.switchup.org/coding-bootcamps-reviews?page=${i + 1}`);

        await page.waitFor(4000);

        const result = await page.evaluate(() => {
            let bootcampsArray = [];
            const container = document.querySelector("bootcamp-list");
            const shadowRoot = container.shadowRoot;

            const bootcamps = shadowRoot.querySelectorAll(".bootcamp-list__row");
            for (var bootcamp of bootcamps) {
                if (!bootcamp.innerText.includes("Featured")) {
                    bootcamp = bootcamp.innerText.replace("Learn More \n", "").split("\n");
                    for (var j in bootcamp) {
                        bootcamp[j] = bootcamp[j].replace(/,/g, "");
                    }

                    bootcamp = bootcamp.toString();
                    bootcampsArray.push(bootcamp);
                }
            }

            return bootcampsArray;

        });

        console.log(result);
        for (var bootcamp of result) {
            fs.appendFileSync('bootcamps.csv', `\n${bootcamp}`);
        }
    }

    await browser.close();
})();