# GEOTAM

The purpose of this open-source hackathon is to develop proof of concept methods to estimate the turnover of business locations in the UK.

## XYZ-MAPP

A private [XYZ-MAPP](https://github.com/GEOLYTIX/xyz) instance was deployed to vercel to address this challenge.

XYZ is an open source interface for spatial data. 

The data itself was loaded into a [serverless postgis database hosted on neon](https://neon.tech/docs/introduction/serverless).

The workspace with all the layer configurations is hosted through github pages from the [GEOLYTIX/mapp repository](https://github.com/GEOLYTIX/mapp/tree/main/geotam).

The application can be accessed through the vercel.app domain:

https://geotam.vercel.app/

Registration is required which will need to be approved by an administrator.

## Geofencing

The Flood Impact layer allows the user to create a new impact location by drawing a polygon geometry. The location's geometry will be used to query the Modelled Results layer and present the results in a table view.

The impact table view presents the estimated impact for a select number of days in regards to the selected seasonality. The seasonality [month] and the number of days can be adjusted in the dataview toolbar.

The affected business locations for the flood zone are presented in the mapview.

![image](https://github.com/user-attachments/assets/a0d0a7ca-be68-4d35-a2e5-b75b32a00d17)

## OpenLocal VOA data

We did not use the OpenLocal dataset which was provided. The dataset has been added as reference layer to the mapp instance. The problem with VOA data is a high number of duplicate geometries. Sometimes this is the result of indivudal car parking spaces registered as [business] point locations. One of our team members is based in the area (Cheadle Hulme). After removing ~77% of duplicates from the OpenLocal we reviewed this location and decided that the data quality is not good enough to include this in our model.

At GEOLYTIX we have had problems with VOA datasets in the past and decided to build a model on our own retail universe datasets. These datasets are regularly updated and provide us with more confidence in the model results.

![image](https://github.com/user-attachments/assets/097294a9-c93a-4b31-ab0b-7d29eda624be)

## Demand surfaces

Modelled on OA geometries, demand surfaces are a seamless estimate of categorized spending in regards to transactional data (credit cards), demographics, and store[brand] properties.

A gravity model was created to process our retail universe data and assign spend from the demand surfaces to qualifying locations in the project area.

The Modelled Results layer allows the user to investigate individual locations in regards to their fascia and spend breakdown.

It is possible for locations to serve multiple demand surfaces. A NISA convenience store for example would primarily serve the Food-to-Go demand and Groceries to a lesser extent.

The Flood Impact locations will query this layer to create summarise statistics on the estimated impact to money spend at these locations.

Additional weight was added to groceries since we have floor space data available for retailers. A superstore for example will exceed a Tesco express by a magnitude in grocery spend.

![image](https://github.com/user-attachments/assets/b3ede2ea-0c22-4571-a51c-ed8812b6b511)

## Seasonality

We addded a seasonality index to the estimated impact assessment. A flood event such as we are currently experiencing will have a far greater economic impact in the runup to Christmas than in January or February.

![image](https://github.com/user-attachments/assets/67548a16-c6d0-45c1-bc4f-f8558553e6a1)

## Limitations

Stores near the edge of the bounding zone should be competing with stores outside the project area.

We do not have a complete picture in regards to manufacturing and the time restrictions did not allow for these locations to be regarded in the model.

GEOLYTIX do however have worker datasets and footfall surfaces which would allow us to implement these in future models.

## Reference datasets

We have included the OA layer with detailed demographic information as well as our Retail Places, Grocery, and Small Area Footfall data for 2023 as reference in the Mapp instance.

## Confidence

We are confident in our approach to estimate retail impact from demand surfaces since we have experienced smaller flood events in the past which were represented in the statistical output provided to our clients.

