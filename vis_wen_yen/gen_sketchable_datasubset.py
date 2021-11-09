import pandas as pd


def common_name_to_continent(val):
    if val == "REDBUD CRABAPPLE":
        continent = "Asia"
    elif val == "PACIFIC SUNSET MAPLE":
        continent = "North America"
    elif val == "SILVER VARIEGATED NORWAY MAPLE":
        continent = "Europe"
    elif val == "DAWYCK'S BEECH":
        continent = "Europe"
    elif val == "BRANDON ELM":
        continent = "North America"
    elif val == "NIGHT PURPLE LEAF PLUM":
        continent = "Europe"
    elif val == "BLOODGOOD PLANE TREE":
        continent = "North America"
    elif val == "FREEMAN'S S.S. MAPLE":
        continent = "North America"
    elif val == "ARMSTRONG RED MAPLE":
        continent = "North America"
    elif val == "PYRAMIDAL EUROPEAN HORNBEAM":
        continent = "Europe"
    elif val == "KATSURA TREE":
        continent = "Asia"
    elif val == "SCHUBERT CHOKECHERRY":
        continent = "Europe"
    elif val == "RANCHO SARGENT CHERRY":
        continent = "Asia"
    elif val == "SIBERIAN ELM":
        continent = "Asia"
    elif val == "APPLE SERVICEBERRY":
        continent = "North America"
    elif val == "SERVICEBERRY":
        continent = "North America"
    elif val == "VANESSA PERSIAN IRONWOOD":
        continent = "Asia"
    elif val == "AKEBONO FLOWERING CHERRY":
        continent = "North America"
    elif val == "TREE LILAC":
        continent = "Europe"
    elif val == "RED MAPLE":
        continent = "North America"
    elif val == "HYBRID CATALPA":
        continent = "North America"
    elif val == "KOTO NO IKO JAPANESE MAPLE":
        continent = "Asia"
    elif val == "EUROPEAN BEECH":
        continent = "Europe"
    elif val == "KOBUS MAGNOLIA":
        continent = "Asia"
    elif val == "AUTUMN APPLAUSE ASH":
        continent = "North America"
    elif val == "MAGNOLIA 'GALAXY'":
        continent = "Asia"
    elif val == "BOWHALL RED MAPLE":
        continent = "North America"
    elif "PIN OAK" in val:
        continent = "North America"
    elif val == "PAPERBARK MAPLE":
        continent = "Asia"
    elif val == "EASTERN REDBUD":
        continent = "North America"
    elif val == "RED FOX KATSURA":
        continent = "Asia"
    elif val == "COLUMNAR NORWAY MAPLE":
        continent = "Europe"
    elif val == "WHITE BEAM MOUNTAIN ASH":
        continent = "North America"
    elif val == "FERNLEAF COPPER BEECH":
        continent = "Asia"
    elif val == "BAILEY SELECT CHOKECHERRY":
        continent = "North America"
    elif val == "KWANZAN FLOWERING CHERRY":
        continent = "Asia"
    elif val == "PANACEK MAPLE":
        continent = "Europe"
    else:
        return val

    return continent


if __name__ == "__main__":
    stree_tree_file_path = "../data/street-trees_with_DATE_test.csv"
    df = pd.read_csv(stree_tree_file_path)
    df["CONTINENT"] = df["COMMON_NAME"].map(common_name_to_continent)
    df.to_csv("../data/street-trees_with_DATE_with_continent_test.csv")
