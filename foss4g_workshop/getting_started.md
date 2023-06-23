# Getting started

Git and Node.js must be installed on your locale to get started.


## Clone the repository

You will only require the main branch unless you want to dig into the XYZ development legacy.

```console
git clone https://github.com/GEOLYTIX/xyz --branch main --single-branch xyz-main
```


## Install node modules

Step into the repository root and run the npm install command to install all node module dependencies.

```console
npm install
```


## Build the library

The mapp and ui library must be build. Esbuild will be installed from npm in the previous step. The build script is defined as _build in the package.json and can be executed with npm.

```console
npm run _build
```


## Hello OSM!

[Express.js](https://expressjs.com/) will be installed by npm as a development dependency. You can now run a zero config instance by loading the express.js script in your node runtime.

```console
node express.js
```

The default port is 3000. You can access the mapp interface in your browser on `localhost:3000`.

You can prefix the node runtime command with environment variables like so.

```console
PORT=3001 DIR="/hello" TITLE="Hello OSM!" node express.js
```

The test instance is now accessible on `localhost:3001/hello`. The `TITLE` environment variable value will provided to the application view.

The express.js script will look for an `.env` file and assign the environment variables from this file to the node process.


## VSCODE

Personally I work almost exclusively with [VSCODE](https://code.visualstudio.com/). You can open the cloned repository folder in VSCODE and create a launch file to customize run and debug. Chose the node.js debugger for your launch.json.

You can copy following configurations into your launch.json

```json
{
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "workshop",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "express.js",
            "env": {
                "TITLE": "Hello FOSS4G!"
            }
        }
    ]
}
```

You should now be able to launch the zero config default workspace with the vscode debugger.


## Workspace

The workspace is a JSON object which can be stored as a file in the public directory. Create a workspace.json file in the public directory and reference this file in `WORKSPACE` environment variable.

```json
"WORKSPACE": "file:/public/workspace.json",
```

We add a UK locale to the workspace with just the masked extent, a starting view, and the OSM tile layer added.

```json
{
    "locales": {
        "workshop": {
            "layers": {
                "OSM": {
                    "display": true,
                    "format": "tiles",
                    "URI": "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    "attribution": {
                        "© OpenStreetMap": "http://www.openstreetmap.org/copyright"
                    }
                }
            }
        }
    }
}
```

_Did you notice a change to the zero config default workspace?_


## Locale

The locale is a first tier reference in your workspace. The mapview must be initialised with a locale which defines the viewport and layers available to the mapview.

Let's set an initial view on Prizren.

```json
"view": {
    "lat": 42.215,
    "lng": 20.734,
    "z": 12
},
```

We can limit the zoom extent of the mapview.

```json
"minZoom": 9,
"maxZoom": 18,
```

We can also limit the extent and mask the outside area.

```json
"extent": {
    "north": 43.4,
    "east": 22,
    "south": 41.7,
    "west": 19.8,
    "mask": true
},
```


## NEON

This can be done with any database accessible by a connection string from a cloud function. We recommend NEON since it is [free](https://neon.tech/docs/introduction/free-tier).

Open a SQL editor and create the PostGIS extension for your database.

```SQL
CREATE EXTENSION POSTGIS;
```

You can now create a table to use for your first spatial layer.

```sql
CREATE TABLE IF NOT EXISTS scratch
(
   id SERIAL,
   char_field character varying,
   textarea text,
   numeric_field numeric,
   integer_field integer,
   json_field json,
   bool_field boolean,
   datetime_integer integer,
   images text[] DEFAULT '{}'::text[],
   documents text[] DEFAULT '{}'::text[],
   geom_3857 geometry
);

CREATE INDEX IF NOT EXISTS scratch_geom_3857
   ON scratch USING gist (geom_3857);
```

You can copy the connection string from the Neon dashboard. Extend the connection string with `?sslmode=require` and store the string as value for the `DBS_NEON` key in your env.

```json
"DBS_NEON": "postgres://dbauszus-glx:***@ep-curly-base-242741.eu-central-1.aws.neon.tech/workshop?sslmode=require"
```


## Layer

Add a layer config for this layer to your locale.

```json
{
    "display": true,
    "format": "geojson",
    "dbs": "NEON",
    "table": "scratch",
    "geom": "geom_3857",
    "srid": "3857",
    "qID": "id",
    "draw": {
        "polygon": true,
        "circle": true,
        "rectangle": true,
        "line": true,
        "point": true
    },
    "deleteLocation": true,
    "infoj": [
        {
            "type": "geometry",
            "display": true,
            "field": "geom_3857",
            "fieldfx": "ST_asGeoJSON(geom_3857)",
            "dependents": [
                "pin"
            ],
            "edit": {
                "geometry": true,
                "snap": true
            }
        },
        {
            "type": "pin",
            "label": "ST_PointOnSurface",
            "field": "pin",
            "fieldfx": "ARRAY[ST_X(ST_PointOnSurface(geom_3857)),ST_Y(ST_PointOnSurface(geom_3857))]"
        },
        {
            "title": "ID",
            "field": "id",
            "inline": true
        },
        {
            "title": "char_field",
            "field": "char_field",
            "edit": true
        },
        {
            "title": "textarea",
            "field": "textarea",
            "type": "textarea",
            "edit": true
        }
    ]
}
```

The `draw` config defines the geometry types you are able to draw as new locations to the layer.

The `infoj` array defines the property entries for locations on the scratch layer.


## VERCEL

In order to deploy your application as a serveless function you will need to create a free Vercel hoppy account.

Install the [vercel-cli](https://vercel.com/docs/cli) on your machine.

```console
npm i -g vercel
```

Next create a vercel manifest file called `vercel.json` in your application root.

```JSON
{
    "version": 2,
    "build": {
        "env": {
            "NODE_ENV": "production"
        }
    },
    "functions": {
        "api/api.js": {
            "includeFiles": "public/**"
        }
    },
    "trailingSlash": false,
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "no-cache"
                },
                {
                    "key": "Access-Control-Allow-Headers",
                    "value": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
                },
                {
                    "key": "X-Frame-Options",
                    "value": "DENY"
                },
                {
                    "key": "X-Content-Type-Options",
                    "value": "nosniff"
                },
                {
                    "key": "X-XSS-Protection",
                    "value": "1; mode=block"
                },
                {
                    "key": "Content-Security-Policy",
                    "value": "default-src 'self'; base-uri 'self'; object-src 'self' geolytix.github.io; connect-src 'self' geolytix.github.io *.maptiler.com *.mapbox.com www.google-analytics.com api.github.com; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self' geolytix.github.io www.google.com www.gstatic.com; form-action 'self'; style-src 'self' 'unsafe-inline' geolytix.github.io unpkg.com cdn.jsdelivr.net fonts.googleapis.com; font-src 'self' geolytix.github.io unpkg.com cdn.jsdelivr.net fonts.gstatic.com; script-src 'self' 'unsafe-inline' geolytix.github.io unpkg.com cdn.skypack.dev api.mapbox.com www.google.com www.gstatic.com cdn.jsdelivr.net www.google-analytics.com www.googletagmanager.com blob:; img-src 'self' geolytix.github.io api.ordnancesurvey.co.uk *.tile.openstreetmap.org api.mapbox.com res.cloudinary.com *.global.ssl.fastly.net raw.githubusercontent.com cdn.jsdelivr.net gitcdn.xyz data:; media-src 'self' res.cloudinary.com;"
                }
            ]
        }
    ],
    "rewrites": [
        {
            "source": "/public/(.*)",
            "destination": "/$1"
        },
        {
            "source": "/api/query/:_template?",
            "destination": "/api/api.js"
        },
        {
            "source": "/api/module/:module?",
            "destination": "/api/api.js"
        },
        {
            "source": "/api/location/:method?",
            "destination": "/api/api.js"
        },
        {
            "source": "/api/user/:method?/:key?",
            "destination": "/api/api.js"
        },
        {
            "source": "/api/workspace/:key?",
            "destination": "/api/api.js"
        },
        {
            "source": "/api/layer/:format?/:z?/:x?/:y?",
            "destination": "/api/api.js"
        },
        {
            "source": "/api/provider/:provider?",
            "destination": "/api/api.js"
        },
        {
            "source": "/api/(.*)",
            "destination": "/api/api.js"
        },
        {
            "source": "/view/:_template?",
            "destination": "/api/api.js"
        },
        {
            "source": "/",
            "destination": "/api/api.js"
        }
    ],
    "env": {
        "TITLE": "Hello FOSS4G!",
        "WORKSPACE": "file:/public/workspace.json",
        "DBS_NEON": "postgres://dbauszus-glx:***@ep-curly-base-242741.eu-central-1.aws.neon.tech/workshop?sslmode=require"
    }
}
```

You can now deploy the application to vercel from the vscode terminal.

```console
vercel --force --prod

Vercel CLI 30.2.2
? Set up and deploy “~/Git/xyz_dev”? [Y/n] y
? Which scope do you want to deploy to? dbauszus
? Link to existing project? [y/N] n
? What’s your project’s name? foss4g-workshop
? In which directory is your code located? ./
Local settings detected in vercel.json:
No framework detected. Default Project Settings:
- Build Command: `npm run vercel-build` or `npm run build`
- Development Command: None
- Install Command: `yarn install`, `pnpm install`, or `npm install`
- Output Directory: `public` if it exists, or `.`
? Want to modify these settings? [y/N] n
🔗  Linked to dbauszus/foss4g-workshop (created .vercel)
🔍  Inspect: https://vercel.com/dbauszus/foss4g-workshop/ED915CBWX6NqrfUBtoPaYbGUygiT [3s]
✅  Production: https://foss4g-workshop.vercel.app [1m]
```

You should be able to follow the link to access the application in the web.