
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'cluster-map',
style: 'mapbox://styles/mapbox/light-v11',
center: [-103.5917, 40.6699],
zoom: 3
});
map.addControl(new mapboxgl.NavigationControl(),'bottom-right');
 
map.on('load', () => {
map.addSource('campground', {
type: 'geojson',
data: campground,
cluster: true,
clusterMaxZoom: 14,  
clusterRadius: 50  
});
 
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'campground',
filter: ['has', 'point_count'],
paint: {
 
'circle-color': [
'step',
['get', 'point_count'],
'#5465ff',
10,
'#fec89a',
30,
'#e8e8e4'
],
'circle-radius': [
'step',
['get', 'point_count'],
15,
10,
20,
30,
25
]
}
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'campground',
filter: ['has', 'point_count'],
layout: {
'text-field': ['get', 'point_count_abbreviated'],
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'campground',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#11b4da',
'circle-radius': 4,
'circle-stroke-width': 1,
'circle-stroke-color': '#fff'
}
});
 
// inspect a cluster on click
map.on('click', 'clusters', (e) => {
const features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
const clusterId = features[0].properties.cluster_id;
map.getSource('campground').getClusterExpansionZoom(
clusterId,
(err, zoom) => {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 
 
map.on('click', 'unclustered-point', (e) => {
    const { popUpMarkup } = e.features[0].properties;
    console.log(campground)
const coordinates = e.features[0].geometry.coordinates.slice();
 
 
 
while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML(popUpMarkup)
.addTo(map);
});
 
map.on('mouseenter', 'clusters', () => {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', () => {
map.getCanvas().style.cursor = '';
});
});
 