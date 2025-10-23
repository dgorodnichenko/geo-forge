import mercantile
import json
from shapely.geometry import box, mapping
import requests
import sys

def get_bbox_for_city(city_name):
    url = f"https://nominatim.openstreetmap.org/search"
    params = {
        "q": city_name,
        "format": "json",
        "limit": 1
    }
    headers = {"User-Agent": "quadkey-generator"}
    response = requests.get(url, params=params, headers=headers)
    data = response.json()
    
    if not data:
        raise ValueError(f"The city '{city_name}' not found")
    
    bbox = data[0]["boundingbox"]
    south, north, west, east = map(float, bbox)
    return west, south, east, north


def generate_quadkeys(city_name, zoom_level=14):
    bbox = get_bbox_for_city(city_name)
    tiles = list(mercantile.tiles(*bbox, zooms=zoom_level))

    features = []
    for tile in tiles:
        quadkey = mercantile.quadkey(tile)
        bounds = mercantile.bounds(tile)
        polygon = box(bounds.west, bounds.south, bounds.east, bounds.north)
        feature = {
            "type": "Feature",
            "geometry": mapping(polygon),
            "properties": {"quadkey": quadkey}
        }
        features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    filename = f"{city_name.lower()}_quadkeys_zoom{zoom_level}.geojson"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(1)
    
    city = sys.argv[1]
    zoom = int(sys.argv[2]) if len(sys.argv) > 2 else 14
    generate_quadkeys(city, zoom)