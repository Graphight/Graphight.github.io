---
layout: article
---

2025-12-10 - Tom Marsh

---

# Bundle your column names

I have spent a fair amount of time *"productionising"* my own and other people's machine learning prototyping code. 
One simple tool I do not see used enough is a mechanism or system to store your column names.
Strings are terrible identifiers in code because they have no type safety, no refactoring support, and no autocomplete.
It might seem incredibly obvious, but, using something like Python's `dataclass` structure to convert them to class attributes, you get all three. 

## The problem

Imagine if you will, your source system uses camel case names like `tempAir`.
Your database lowercases it to `tempair` (looking at your AWS Glue).
Your data warehouse wants `temp_air`.
Now scale this to datasets with hundreds of columns, or pipelines that craft new dozens of additional features. 
How many places will have hardcoded strings? 
What happens when upstream changes break your workflows?
How maintainable is your codebase?

## Example

By having a single source of truth, we are able to define all commonly used column names in one location and update them as necessary.
Even with modern IDEs and coding assistants finding all relevant uses of a string (and not comments) can be arduous. 
I am still much more comfortable with this approach as I can be confident all references will get the new definitions.

My basic project structure generally looks like:
```
.
├── Dockerfile
├── project_name
│    ├── __init__.py
│    ├── constants.py
│    ├── data_processing.py
│    ├── evaluation.py
│    ├── modelling.py
│    ├── main.py
├── pyproject.toml
├── README.md
└── uv.lock
```

Today we are concerned with the `./project_name/constants.py` file as this will contain our bundling system.
I have chosen to use Python's built-in [dataclass](https://docs.python.org/3/library/dataclasses.html), however, you could achieve an almost identical system with an `Enum`.

Here is an extremely simplified example:
```python
from dataclasses import dataclass
from typing import List


@dataclass
class Columns:

    # Time and location
    local_datetime: str = "local_datetime"
    season: str = "season"

    # Environmental sensors
    temp_air: str = "tempAir" # mask a camel case name
    wind_speed: str = "wind_speed"

    # Aggregated features (prefog window)
    temp_air_mean: str = "tempAir_mean"
    temp_air_range: str = "tempAir_range"
    temp_air_std: str = "tempAir_std"
    wind_speed_max: str = "wind_speed_max"
    wind_speed_mean: str = "wind_speed_mean"
    wind_speed_std: str = "wind_speed_std"
    
    # ML related
    label: str = "label"
    prediction: str = "prediction"

    @classmethod
    def fetch_inputs(cls) -> List[str]:
        return [
            cls.local_datetime,
            cls.season,
            cls.temp_air,
            cls.wind_speed,
        ]
    
    @classmethod
    def fetch_numerical(cls) -> List[str]:
        return [
            cls.temp_air,
            cls.temp_air_mean,
            cls.temp_air_range,
            cls.temp_air_std,
            cls.wind_speed,
            cls.wind_speed_max,
            cls.wind_speed_mean,
            cls.wind_speed_std,
        ]
    
    @classmethod
    def fetch_categorical(cls) -> List[str]:
        return [
            cls.season,
        ]
    
    @classmethod
    def fetch_features(cls) -> List[str]:
        return cls.fetch_numerical() + cls.fetch_categorical()
        
```

You can arrange the columns in whichever way you see fit within the dataclass, however, I find it useful to separate "raw" columns that are present in your initial dataset from "derived" columns done throughout your processing pipelines.
The class methods are utilities to make your life easier when using this dataclass throughout the codebase.
I often find myself using something like `df = pd.read_parquet(file, engine="pyarrow", columns=Columns.fetch_inputs())` to make sure I am only pulling in specific columns and not wasting resources reading superfluous information.

We also have the ability to individually call out the numerical or categorical features, for example:
```python
from project_name.constants import Columns


for col in Columns.fetch_categorical():
    df[col] = df[col].astype("str").astype("category")

# OR 

for col in Columns.fetch_numerical():
    df[col] = df[col].astype(float).fillna("-inf")
```

## Utility in practice

For an example of where a system like this shines we can look to Microsoft's [LightGBM](https://github.com/microsoft/LightGBM).
This lightweight machine learning framework has proven time and time again to be a reliable workhorse in industry for me when working with structured datasets. 
If you are using their native `Dataset` implementation (I recommend this over the `sklearn` style of `X = df[feats].values`) then having these bundled columns simplifies the process heavily.

```python
import lightgbm as lgb

from project_name.constants import Columns


d_train = lgb.Dataset(
    df_train[Columns.fetch_features()],
    label=df_train[Columns.label],
    categorical_feature=Columns.fetch_categorical()
)

df_test[Columns.prediction] = model.predict(df_test[Columns.fetch_features()])
```

## Disclaimer

Let me be clear, I am not suggesting you use this during early stage prototyping and exploratory data analysis (EDA) when you want to be moving quickly. 
During those stages it is perfectly fine (in my opinion) to be messy as this will limit your attachment to the code, making you more likely to cut ties and delete large swathes if the path is not looking optimal. 

I am also not suggesting you include all the columns in your project in this bundle, only those that reoccur. 
If you are creating a transient column that is only used once to spike something or as an intermediary to create a more useful column or aggregation then do not clutter your bundle. 
In the least dogmatic way possible, this whole mechanism is just applying the *"Don't Repeat Yourself"* (DRY) principle.

This advice is also not sacred knowledge, that should be faithfully followed in everything you code.
It is merely a technique that I have found success with and haven't seen written down in many places so want to get it out there.

---

There is not much more to be said about this topic.
It is an incredibly simple yet powerful tool to make your life easier. 
Thank you for your time. 
