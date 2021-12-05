from numpy.core.records import record
import pandas as pd
import random
import json

tmp = 0
unknown_tree = set()
def common_name_to_continent2(val):
    global tmp
    global unknown_tree
    continent = ""
    if "REDBUD CRABAPPLE" in val or "KATSURA" in val or "RANCHO SARGENT CHERRY" in val or "SIBERIAN" in val or "PERSIAN" in val or "JAPANESE" in val\
        or "MAGNOLIA" in val or "KOTO" in val or "KOBUS" in val or "PAPERBARK MAPLE" in val or "FERNLEAF COPPER BEECH" in val or "KWANZAN" in val\
        or "AKEBONO" in val or "HORSECHESTNUT" in val or "SHIROFUGEN" in val or "SHIROTAE" in val or "CHINESE" in val or "KOUSA" in val or "PISSARD PLUM" in val\
        or "AUTUMN GOLD GINKGO" in val or "GOLD RUSH DAWN REDWOOD" in val or "INGES RUBY VASE IRONWOOD" in val or "AUTUMN GOLD GINKGO" in val\
        or "PINK PERFECTION CHERRY" in val or "ZELKOVA" in val or "AUTUMN HIGAN CHERRY" in val or "COLUMNAR SARGENT CHERRY" in val or "TCHONOSKI CRABAPPLE" in val\
        or "YOSHINO CHERRY" in val or "SARATOGA GINKGO" in val or "KASHMIR CEDAR" in val or "SNOW GOOSE CHERRY" in val:
        # print("gg as")
        continent = "Asia"
    elif "NORWAY" in val or "DAWYCK'S BEECH" in val or "NIGHT PURPLE LEAF PLUM" in val or "EUROPEAN" in val or "SCHUBERT CHOKECHERRY" in val\
        or "TREE LILAC" in val or "PANACEK" in val or "FLOWERING ASH" in val or "GOLDEN DAWYCK BEECH" in val or "GOLDEN WHITEBEAM" in val\
        or "HORNBEAM" in val or "CONQUEST MAPLE" in val or "EVELYN HEDGE MAPLE" in val or "PRINCETON GOLD MAPLE" in val or "QUEEN ELIZABETH MAPLE" in val\
        or "HUNGARIAN OAK" in val or "PURPLE PLUM" in val or "RED CAUCASIAN MAPLE" in val or "YRAMIDAL ENGLISH OAK" in val or "LEPRECHAUN ASH" in val\
        or "MAJESTIC WHITEBEAM" in val or "SWEETHEART CHERRY" in val or "PARKWAY MAPLE" in val or "UTUMN SPLENDOR CHESTNUT" in val or "SKYROCKET ENGLISH OAK" in val\
        or "GOLDEN ASH" in val or "PURPLE LIKIANG SPRUCE" in val or "LITTLE LEAF LINDEN" in val or "BAUMANN'S SEEDLESS HORSECHESTN" in val or "GOLDEN CAUCASIAN MAPLE" in val\
        or "CHANCELLOR LINDEN" in val or "SKYMASTER ENGLISH OA" in val or "DEGROOT LINDEN" in val:
        # print("gg eu")
        continent = "Europe"
    elif "SUNSET MAPLE" in val or "BRANDON ELM" in val or "BLOODGOOD PLANE TREE" in val or "FREEMAN'S S.S. MAPLE" in val or "ARMSTRONG" in val \
        or "APPLE SERVICEBERRY" in val or "SERVICEBERRY" in val or "RED MAPLE" in val or "HYBRID CATALPA" in val or "AUTUMN APPLAUSE ASH" in val or "BOWHALL" in val\
        or "PIN OAK" in val or "EASTERN REDBUD" in val or "WHITE BEAM MOUNTAIN ASH" in val or "BAILEY SELECT CHOKECHERRY" in val or "TRICOLOR BEECH" in val\
        or "PRAIRIE SENTINEL HACKBERRY" in val or "PURPLE HAZE PLUM" in val or "PEAR" in val or "RED JEWEL CRABAPPLE" in val or "GINGER GOLD APPLE" in val\
        or "RED SHINE MAPLE" in val or "FERNLEAF BEECH" in val or "HAWTHORN" in val or "VENUS DOGWOOD" in val or "ROUND LEAF BEECH" in val\
        or "BLACKGUM" in val or "ASPEN" in val or "EDDIES WHITE WONDER DOGWOOD" in val or "BEECH" in val or "MOUNTAIN ASH" in val or "CRIMSON SPIRE OAK" in val\
        or "WEEPING MULBERRY" in val or "GOLDEN RAINDROPS CRABAPPLE" in val or "GOLDEN CATALPA" in val or "PURPLE ROBE LOCUST" in val or "REGAL PRINCE OAK" in val\
        or "SCARLET MAPLE FRANK JR" in val or "PINK DOGWOOD" in val or "WILD CHERRY" in val or "COMMON APPLE" in val or "WORPLESDON SWEETGUM" in val\
        or "MODESTO ASH" in val or "BIG LEAF LINDEN" in val or "AUTUMN GOLD ASH" in val or "BERGESON ASH" in val or "HAZELNUT" in val or "WEEPING NOOTKA CYPRESS" in val\
        or "EML" in val or "CRABAPPLE" in val or "LUE NOOTKA CYPRESS" in val or "FALL GOLD BLACK ASH" in val or "FLOWERING DOGWOOD" in val or "GOLD LEAF BLACK LOCUST" in val\
        or "PURPLE CATALPA" in val or "PATMORE ASH" in val or "PIONEER ELM" in val or "GREEN COLUMN BLACK MAPLE" in val or "SUMMIT ASH" in val or "JONAGOLD APPLE" in val\
        or "NORTHERN GEM ASH" in val or "STRIPED-BARK MAPLE" in val or "UTUMN PURPLE ASH" in val or "GOLDEN DESERT ASH" in val or "HIMALAYAN WHITE PINE" in val\
        or "VARIEGATED SYCAMORE MAPLE" in val or "ANDERWOLFS PINE" in val or "ARNOLD TULIPTREE" in val or "RAYWOOD ASH" in val or "HARLEQUIN AH" in val\
        or "ACCOLADE CHERRY" in val or "PYRAMID BLACK LOCUST" in val:
        # print("gg na")
        continent = "North America"
    elif "HONEYLOCUST" in val or "CARPATHIAN WALNUT" in val:
        continent = "South America"
        # print("gg sa")
    elif "GLOBE OR MOPHEAD ACACIA" in val:
        continent = "Africa"
    else:
        # tmp += 1
        unknown_tree.add(val)
        # print(unknown_tree, len(unknown_tree))
    return continent


if __name__ == "__main__":
    stree_tree_file_path = "../data/whole_data.csv"
    df = pd.read_csv(stree_tree_file_path)
    df["CONTINENT"] = df["COMMON_NAME"].map(common_name_to_continent2)
    # df.to_csv("../data/whole_data_with_continent.csv")
    
    json_data = df.to_dict(orient="records")


        # "DATE_PLANTED",
        # "TREE_ID",
        # "CIVIC_NUMBER",
        # "STD_STREET",
        # "GENUS_NAME",
        # "SPECIES_NAME",
        # "CULTIVAR_NAME",
        # "COMMON_NAME",
        # "ASSIGNED",
        # "ROOT_BARRIER",
        # "PLANT_AREA",
        # "ON_STREET_BLOCK",
        # "ON_STREET",
        # "NEIGHBOURHOOD_NAME",
        # "STREET_SIDE_NAME",
        # "HEIGHT_RANGE_ID",
        # "DIAMETER",
        # "CURB",
        # "Geom",

    json_data = [{
        "tree_id": v["TREE_ID"],
        "continent": v["CONTINENT"],
        "date": v["DATE_PLANTED"],
        "civic_number": v["CIVIC_NUMBER"],
        "std_street": v["STD_STREET"],
        "common_name": v["COMMON_NAME"],
        "genus_name": v["GENUS_NAME"],
        "assigned": v["ASSIGNED"],
        "root_barrier": v["ROOT_BARRIER"],
        "plant_area": v["PLANT_AREA"],
        "on_street_block": v["ON_STREET_BLOCK"],
        "on_street": v["ON_STREET"],
        "neighbourhood_name": v["NEIGHBOURHOOD_NAME"],
        "street_side_name": v["STREET_SIDE_NAME"],
        "height_range_id": v["HEIGHT_RANGE_ID"],
        "diameter": v["DIAMETER"],
        "curb": v["CURB"],
        "Geom": v["Geom"]
        # "coordinates": [v["Geom"]["coordinates"][0], v["Geom"]["coordinates"][1]]
    } for v in json_data]
    # print(json_data[0]["Geom"]["coordinates"])
    # exit()
    for d in json_data:
        tmp = d["date"].split("-")
        d["year"] = int(tmp[0])
        d["month"] = int(tmp[1])
        d["date"] = int(tmp[2])   
        tmp = json.loads(d["Geom"])
        d["coordinate"] = tmp["coordinates"]
    
    with open('whole_data.json', 'w') as fp:
        json.dump(json_data, fp)

    # print(json_data)

    # df.to_csv("../data/street-trees_with_DATE_with_continent_test.csv")
