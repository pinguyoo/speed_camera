const fetch = require('node-fetch');
const distanceCalculate = require('./distanceCalculate');

/*
 * params: address
 * return: latitude and longitude of the center location between departure and destination
 */

module.exports = function parse(departure, destination) {
    return new Promise((resolve, reject) => {
        const departureUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + encodeURIComponent(departure) + '&types=address&language=zh-TW&key=AIzaSyC57k-Y-1nHz_scIJ6PXEVmn1_wyDkD1x8';
        const destinationUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + encodeURIComponent(destination) + '&types=address&language=zh-TW&key=AIzaSyC57k-Y-1nHz_scIJ6PXEVmn1_wyDkD1x8';
        const urls = [departureUrl, destinationUrl];
        Promise.all(urls.map(url => fetch(url, { method: 'GET', cache: 'no-cache' }).then(response => response.json())))
        .then(datas => {
            const departureAddress = encodeURIComponent(datas[0].predictions[0].description);
            const destinationAddress = encodeURIComponent(datas[1].predictions[0].description);
            const departureGeoUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + departureAddress + '&sensor=false&key=AIzaSyC57k-Y-1nHz_scIJ6PXEVmn1_wyDkD1x8';
            const destinationGeoUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destinationAddress + '&sensor=false&key=AIzaSyC57k-Y-1nHz_scIJ6PXEVmn1_wyDkD1x8';
            let geoUrls = [departureGeoUrl, destinationGeoUrl];
            Promise.all(geoUrls.map(geoUrl => fetch(geoUrl, { method: 'GET', cache: 'no-cache' }).then(response => response.json())))
            .then((locations) => {
                let departureLocation = locations[0].results[0].geometry.location;
                let destinationLocation = locations[1].results[0].geometry.location;
                let centerLatitude = (Math.abs(destinationLocation.lat + departureLocation.lat)) / 2;
                let centerLongitude = (Math.abs(destinationLocation.lng + departureLocation.lng)) / 2;
                
                resolve({ lat: Math.floor(centerLatitude * 100000) / 100000, lng: Math.floor(centerLongitude * 100000) / 100000, distance: distanceCalculate(departureLocation, destinationLocation) / 2 });
            })
        });
    });
};