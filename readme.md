# Airport US Web Map Application

**Author:** Micah Roberton

The webpage for the map can be accessed here: https://micahroberton.github.io/Airport-US-Web-Map-Application/

This map uses Leaflet to show airports across the United States. Airports with control towers will be labeled as blue buildings while ones without will just show up as planes. The map is cloropleth meaning that the more airports a state has the more red it will be. States with few airports will be yellow. This is done using a function that checks the CNTL_TWR variable in each airport in our geoJSON.

Libraries: Leaflet,cloudflare,googleapis,

This data is acquired from Mike Bostock of D3.
