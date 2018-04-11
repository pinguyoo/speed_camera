const fetch = require('node-fetch');
const direction = require('./roadDirection');

module.exports = function snapToRoad(departure, destination) {
    return new Promise((resolve, reject) => {
        const routes = direction(departure, destination);
        routes.then((data) => {
            const URL = 'https://roads.googleapis.com/v1/snapToRoads?path=' + data + '&interpolate=true&key=AIzaSyC57k-Y-1nHz_scIJ6PXEVmn1_wyDkD1x8';
            fetch(URL, { method: 'GET', cache: 'no-cache' })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    const result = data.snappedPoints;
                    let locations = [];
                    for (let i = 0; i < result.length; i++) {
                        let location = result[i].location;
                        locations.push({ lat: location.latitude, lng: location.longitude });
                    }
                    resolve(locations);
                })
                .catch((err) => {

                })
        })
    });
};