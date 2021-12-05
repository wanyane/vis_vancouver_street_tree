import pandas as pd


stree_tree_file_path = "../data/street-trees_refined.csv"
csv_data = pd.read_csv(stree_tree_file_path)
csv_data = csv_data.loc[
    csv_data["DATE_PLANTED"].notnull(),
    [
        "DATE_PLANTED",
        "TREE_ID",
        "CIVIC_NUMBER",
        "STD_STREET",
        "GENUS_NAME",
        "SPECIES_NAME",
        "CULTIVAR_NAME",
        "COMMON_NAME",
        "ASSIGNED",
        "ROOT_BARRIER",
        "PLANT_AREA",
        "ON_STREET_BLOCK",
        "ON_STREET",
        "NEIGHBOURHOOD_NAME",
        "STREET_SIDE_NAME",
        "HEIGHT_RANGE_ID",
        "DIAMETER",
        "CURB",
        "Geom",
    ],
]

df = csv_data.dropna()


# csv_data = csv_data.tail(60)
df = df.sort_values(by="DATE_PLANTED")

df = df[(df["DATE_PLANTED"] > "1990-01-01")]
df.to_csv("../data/whole_data.csv")
exit()
# df = df.sample(n=60).sort_values(by="DATE_PLANTED")
# df = df.groupby(pd.DatetimeIndex(df.DATE_PLANTED).to_period("Y")).sample(n=2)
# df.to_csv("../data/street-trees_with_DATE_from_2011.csv")

# print(len(df))
