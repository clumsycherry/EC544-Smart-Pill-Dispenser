## Medication Table

|**Id** | **Patient Id** | **Name** | **Indication** | **Dosage_mg** | **Doses** | **Frequency** | **Remaining Doses** | **Restrictions** | **Progress Variables** |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 23 | Tylenol | Headache | 250 | 2  | bd | 10 | [1,4] | [2, 4] |
| 2 | 23 | Mircette | Weight | 50 | 1 | od | 28 | [3] | [1, 2, 3] |
| 3 | 23 | Seratonin | Depression| 75 | 2  |  tds | 45 | [1, 5] | [3] |

## Restrictions Table

| **Id** | **Restriction**|
|:--------:|:---------------:|
|1| Take with food |
|2| Take before food |
|3| Take after food |
|4| Avoid alcohol |
|5| Avoid fiber |

## Progress Variables

| **Id** | **Variable**| **Dates**|
|:--------:|:---------------:|:---------:|
|1| Dizziness | [1/3, 1/9] |
|2| Nausea | [1/5, 1/6, 1/7, 1/9] |
|3| Sadness | [1/3, 1/9] |
|4| Anger | (NULL) |

## Patients Table

| **Id** | **Name**|
|:--------:|:---------------:|
|23| John Snow |
|24| Bellatrix Lestrange |


*Note:
- Arrays are LONGTEXT datatypes, but in JSON format
- [List of Medical Abbreviations](https://en.wikipedia.org/wiki/List_of_medical_abbreviations:_Latin_abbreviations)
