import puppeteer from 'puppeteer';

export const searchGoogleMaps = async function (query) {
    try {
        const browser = await puppeteer.launch({
            headless : false,
            defaultViewport : false,
        });
        const page = await browser.newPage();

        // Navigate the page to a URL.
        await page.goto(`https://www.google.com/maps/search/${query.split(" ").join("+")}`);

        const siteAddressClass = await page.$$('.CsEnBe');
        const siteDetailsClass = await page.$$('.W4Efsd');

        let result = {}
        let results = [];

        for (let i = 0; i < siteAddressClass.length; i++) {
            try {
                const evalutionResult = await page.evaluate(el => el.querySelector("div > div > div").textContent, siteAddressClass[i]);

                if (i === 0) {
                    result.address = evalutionResult
                }

                if (i === 1) {
                    result.website = evalutionResult
                }

                if (i === 2) {
                    result.phoneNumber = evalutionResult
                }

                if (i === 3) {
                    result.metaData = evalutionResult
                }
            } catch (error) {
                continue;
            }

        }

        for (let i = 0; i < siteDetailsClass.length; i++) {
            try {
                const evalutionResult = await page.evaluate(el => el.querySelector("div").textContent, siteDetailsClass[i])

                if (i % 2) {
                    results.push(evalutionResult);
                }
            } catch (error) {

                continue;
            }
        }

        browser.close()

        if (Object.keys(result).length) {
            return result;
        }

        if (results.length) {
            return results;
        }


    } catch (error) {
        error
    }
}
