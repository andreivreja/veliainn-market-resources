<p align="center"><a href="https://veliainn.com"><img src="https://veliainn.com/images/logo_light.svg" width="260px" height="130px"></a></p>

# 

If you're looking for a [bdo boss timer](https://veliainn.com/boss) and other tools, check out [veliainn.com](https://veliainn.com)

If you're here for dev related stuff, read below.

Wanna chat? Join the Discord!

[![Discord](https://img.shields.io/discord/617215495032012822?color=5965f1&label=&logo=discord&logoColor=%23ffffff&style=for-the-badge)](https://discord.gg/JFf6r9e)

# Resources for BDO's Market API

## Item Database
> [data/items.json](data/items.json)

> [data/items_all.json](data/items_all.json)

*Updated daily around 6pm UTC*

Compared to the web app API, the in-game API contains limited information. The `data/items.json` list/database aims to make it easier to get the relevant item data for your project.

### Format

JSON object, with item ids as keys

```json
{
    "10010": {
        "id": 10010,
        "locale_default": "us",
        "locale_name": {
            "us": "Kzarka Longsword",
            "de": "Langschwert: Kzarka",
            "fr": "Épée longue de Kzarka",
            "ru": "Меч Кзарки",
            "es": "Espada larga de Kzarka",
            "sp": "Espada Larga de Kzarka",
            "pt": "Espada Longa Kzarka",
            "jp": "クザカソード",
            "kr": "크자카 장검",
            "cn": "科扎卡长剑",
            "tw": "克價卡長劍",
            "th": "ดาบยาวคจาคาร์",
            "tr": "Kzarka Uzun Kılıç",
            "id": "Kzarka Longsword"
        },
        "grade": 3,
        "category_primary": 1,
        "category_secondary": 1
    }
}
```

## Categories
> [data/categories.json](data/categories.json)

List of category/subcategory names.
