const fetch = require('node-fetch');

/*
 * params: origin and destination
 * return: every step in each direction route
 */

module.exports = function(departure, destination) {
    return new Promise((resolve, reject) => {
        const URL = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + encodeURIComponent(departure) + '&destination=' + encodeURIComponent(destination) + '&key=AIzaSyC57k-Y-1nHz_scIJ6PXEVmn1_wyDkD1x8';
        fetch(URL, { method: 'GET', cache: 'no-cache' })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const result = data.routes[0].legs[0];
                const steps = result.steps;
                let routes = '';
                routes += result.start_location.lat + ',' + result.start_location.lng + '|';
                for (let i = 0; i < steps.length; i++) {
                    routes = routes + steps[i].end_location.lat + ',' + steps[i].end_location.lng + '|' ;
                }
                resolve(routes.substring(0, routes.length - 1));
            })
            .catch((err) => {

            })
    });
};