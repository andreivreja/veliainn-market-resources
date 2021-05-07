const fs = require("fs");
const htmlEntities = require("html-entities");
const fetch = require("node-fetch");

if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (str, newStr) {
        if (Object.prototype.toString.call(str).toLowerCase() === "[object regexp]")
            return this.replace(str, newStr);

        return this.replace(new RegExp(str, "g"), newStr);
    };
}

const benchmark = (timeStart) => {
    const diff = process.hrtime(timeStart);
    return (diff[0] * 1e9 + diff[1]) * 1e-6;
};

process.on('unhandledRejection', up => {
    console.error(up);
    process.exit(1);
})


const db = {};
db[45868] = {
    id: 45868,
    locale_default: "us",
    locale_name: {
        us: "Signature Classic Box",
    },
    grade: 4,
    category_primary: 55,
    category_secondary: 5
};
db[601251] = {
    id: 601251,
    locale_default: "us",
    locale_name: {
        us: "Value Pack (30 Days)",
    },
    grade: 3,
    category_primary: 55,
    category_secondary: 6
};

const locales = [
    "us",
    "de",
    "fr",
    "ru",
    "es",
    "sp",
    "pt",
    "jp",
    "kr",
    "cn",
    "tw",
    "th",
    "tr",
    "id"
];
let totalDone = 0;

const scrape = async (locale) => {
    console.log(`${locale} - starting...`);

    const timeStart = process.hrtime();
    let input = await fetch(`https://bdocodex.com/query.php?a=items&l=${locale}&_=${Date.now()}`).then((r) => r.text());
    input = input.replaceAll("﻿", "").replaceAll("\\r\\n", "");
    let data = JSON.parse(input);
    data = data.aaData;

    Object.values(data).forEach((item) => {
        const item_id = parseInt(item[0]);
        const item_name = htmlEntities.decode(item[2].replace(/(<([^>]+)>)/gi, ""));
        const item_grade = parseInt(item[5]);

        if (!db[item_id]) {
            db[item_id] = {
                id: item_id,
                locale_default: locale,
                locale_name: {},
                grade: item_grade,
            };

            db[item_id]["locale_name"][locale] = item_name;
        } else {
            db[item_id]["locale_name"][locale] = item_name;
        }
    });

    console.log(`${locale} - finished in ${benchmark(timeStart)}ms`);

    totalDone++;
    if (locales.length > totalDone) {
        scrape(locales[totalDone]);
    } else {
        initCategories();
    }
};

console.log("Getting data from bdocodex.com");
scrape(locales[0]);

const regions = [
    "na",
    "eu",
    "sea",
    "console_eu",
    "console_na",
    "console_asia",
    "mena",
    "sa",
    "kr",
    "ru",
    "jp",
    "th",
    "tw"
];
const regionLinks = {
    eu: "https://eu-trade.naeu.playblackdesert.com/Trademarket/GetWorldMarketList",
    na: "https://na-trade.naeu.playblackdesert.com/Trademarket/GetWorldMarketList",
    sea: "https://trade.sea.playblackdesert.com/Trademarket/GetWorldMarketList",
    console_eu: "https://eu-trade.console.playblackdesert.com/Trademarket/GetWorldMarketList",
    console_na: "https://na-trade.console.playblackdesert.com/Trademarket/GetWorldMarketList",
    console_asia: "https://asia-trade.console.playblackdesert.com/Trademarket/GetWorldMarketList",
    mena: "https://trade.tr.playblackdesert.com/Trademarket/GetWorldMarketList",
    sa: "https://blackdesert-tradeweb.playredfox.com/Trademarket/GetWorldMarketList",
    kr: "https://trade.kr.playblackdesert.com/Trademarket/GetWorldMarketList",
    ru: "https://trade.ru.playblackdesert.com/Trademarket/GetWorldMarketList",
    jp: "https://trade.jp.playblackdesert.com/Trademarket/GetWorldMarketList",
    th: "https://trade.th.playblackdesert.com/Trademarket/GetWorldMarketList",
    tw: "https://trade.tw.playblackdesert.com/Trademarket/GetWorldMarketList"
};

const scrapeCategories = async (region, category, subcategories) => {
    let marketUrl = regionLinks[region];

    let result = await Promise.all(
        subcategories.map((c) => {
            return fetch(marketUrl, {
                method: "post",
                body: JSON.stringify({
                    keyType: "0",
                    mainCategory: category,
                    subCategory: c
                }),
                headers: {
                    "Content-Type": "application/json",
                    "user-agent": "BlackDesert"
                },
            })
                .then((response) => {
                    if (!response.ok)
                        throw { message: "maintenanceMaybe", statusCode: response.status };

                    return response.json();
                })
                .then((v) => {
                    if (v.resultCode === 0)
                        return {
                            category,
                            sub_category: c,
                            data: v.resultMsg
                        };
                    else
                        throw { message: "maintenanceMaybe", statusCode: "_" + v.resultCode };
                });
        })
    );

    result.forEach((categoryData) => {
        let items = categoryData.data.split("|");
        items.forEach((item) => {
            let itemData = item.split("-");
            if (itemData.length === 0) return;

            if (db[itemData[0]]) {
                db[itemData[0]].category_primary = categoryData.category;
                db[itemData[0]].category_secondary = categoryData.sub_category;
            }
        });
    });
};

const subCategoryArray = (num) => Array.from(Array(num).keys(), (n) => n + 1);

const initCategories = async () => {
    console.log("Getting data from market API");

    for (let i = 0; i < regions.length; i++) {
        console.log(`${regions[i]} - starting...`);

        const timeStart = process.hrtime();
        await scrapeCategories(regions[i], 1, subCategoryArray(15));
        await scrapeCategories(regions[i], 5, subCategoryArray(14));
        await scrapeCategories(regions[i], 10, subCategoryArray(21));
        await scrapeCategories(regions[i], 15, subCategoryArray(6));
        await scrapeCategories(regions[i], 20, subCategoryArray(4));
        await scrapeCategories(regions[i], 25, subCategoryArray(8));
        await scrapeCategories(regions[i], 30, subCategoryArray(2));
        await scrapeCategories(regions[i], 35, subCategoryArray(8));
        await scrapeCategories(regions[i], 40, subCategoryArray(10));
        await scrapeCategories(regions[i], 45, subCategoryArray(4));
        await scrapeCategories(regions[i], 50, subCategoryArray(7));
        await scrapeCategories(regions[i], 55, subCategoryArray(8));
        await scrapeCategories(regions[i], 60, subCategoryArray(8));
        await scrapeCategories(regions[i], 65, subCategoryArray(13));
        await scrapeCategories(regions[i], 70, subCategoryArray(9));
        await scrapeCategories(regions[i], 75, subCategoryArray(6));
        await scrapeCategories(regions[i], 80, subCategoryArray(9));

        console.log(`${regions[i]} - finished in ${benchmark(timeStart)}ms`);
    }

    Object.keys(db).forEach((itemKey) => {
        const item = db[itemKey];

        if (!item.category_primary) delete db[itemKey];
    });

    fs.writeFileSync("./data/items.json", JSON.stringify(db, null, "\t"));
};