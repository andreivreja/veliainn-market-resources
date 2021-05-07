# Resources for BDO's Market API

## Item Database

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

A list of category/subcategory names can be found at https://developers.veliainn.com
