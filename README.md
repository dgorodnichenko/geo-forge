# Geospatial Data Processing Backend

A NestJS-based backend service for processing geospatial data, specializing in file format conversion, road geometry extraction and quadkey generation.

---

## Features

- **KMZ to GeoJSON Conversion** – Convert KMZ files to GeoJSON format for easier processing and visualization
- **Road Geometry Extraction** – Extract road coordinates and geometry data from geospatial files
- **Quadkey Generation** –Generate quadkeys for geospatial indexing using integrated Python scripts
- **Validation** – using `class-validator` and `class-transformer`  

---

## Tech Stack

- [NestJS](https://nestjs.com/)  
- [Scripting](https://www.python.org) 
- [TypeScript](https://www.typescriptlang.org/)  
---

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js
- npm or yarn
- Python
- pip (Python package manager)

---

## Installation


Clone the repo and install dependencies:

```bash
git clone <repository-url>
cd project-directory
npm install
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the app
For development use the following command:
```bash
npm run start:dev
```
For production use the following commands:
```
npm run build
npm run start:prod
```

## API usage
Base URL:
```bash
http://localhost:3000
```

### Endpoints
1. Convert KMZ files to GeoJSON format

#### Endpoint: `POST /conversion/kmz-to-geojson`
#### URL:
```bash
http://localhost:3000/conversion/kmz-to-geojson
```

#### Request:
Content-Type: multipart/form-data  
Body: KMZ file upload

#### Example response:
```bash
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-55.892154, -27.395646, 0],
            [-55.90495, -27.39405, 0],
            [-55.90361, -27.384005, 0],
            [-55.892154, -27.395646, 0]
          ]
        ]
      },
      "properties": {
        "name": "Chacras 32-33",
        "description": "Chacras 32-33...",
        "stroke": "#0288d1",
        "stroke-opacity": 1,
        "fill": "#0288d1"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-55.891296, -27.366541, 0]
      },
      "properties": {
        "name": "Sede Central",
        "icon": "images/icon-1.png"
      }
    }
  ]
}
```
#### 2. Road Geometry Extraction
Extracts road geometry between two points
#### Endpoint: `POST /road-geometry/calculate`
#### URL:
```bash
http://localhost:3000/road-geometry/calculate
```
#### Headers:
```bash
Content-Type: application/json
```
#### Request body:
```bash
{
    "startLat": 40.720879615197745,
    "startLng": -74.0812911143682,
    "endLat": 40.719451964779815,
    "endLng": -74.07779577565537
}
```

#### Example response:
```bash
{
    "success": true
    "data": 
        [
            40.7208803,
            -74.0813521
        ],
        [
            40.72083642727272,
            -74.0812453878788
        ],
        [
            40.720792554545454,
            -74.08113867575759
        ],
        [
            40.72074868181818,
            -74.08103196363636
        ],
        [
            40.720704809090904,
            -74.08092525151515
        ],
      "count": 5  
}
```
#### Example error response
```bash
{
    "message": [
        "startLat must not be less than -90"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

#### 3. Quadkey Generation
Generates quadkeys for geospatial indexing using integrated Python scripts.
#### Endpoint: `POST /quadkeys/generate`
#### URL:
```bash
http://localhost:3000/quadkeys/generate
```

#### Headers:
```bash
Content-Type: application/json
```

#### Request body example:
```bash
{
    "city": "New York",
    "zoom": 10
}
```

#### Example response:
```bash
{
    "success": true,
    "data": {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [
                                -74.1796875,
                                40.71395582628604
                            ],
                            [
                                -74.1796875,
                                40.97989806962013
                            ],
                            [
                                -74.53125,
                                40.97989806962013
                            ],
                            [
                                -74.53125,
                                40.71395582628604
                            ],
                            [
                                -74.1796875,
                                40.71395582628604
                            ]
                        ]
                    ]
                },
                "properties": {
                    "quadkey": "0320101100"
                }
            }
        ]
}
```

#### Example response:
The API uses standard HTTP status codes:

- 200: Success
- 400: Bad Request (invalid input)
- 500: Internal Server Error
