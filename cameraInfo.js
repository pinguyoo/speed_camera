const fetch = require('node-fetch');
const geoParser = require('./geoParser');
const isInRange = require('./rangeCheck');

/*
 * params: address
 * return: camera information list which near the address
 */

module.exports = function getCameraInfo(addressString) {
    return new Promise((resolve, reject) => {
        let result = {};
        let address = addressString.split(',');
        let departure = address[0];
        let destination = address[1];
        const coordinate = geoParser(departure, destination);
        coordinate.then((center) => {
            const URL = 'https://od.moi.gov.tw/api/v1/rest/datastore/A01010000C-000674-011';
            console.log(center);
            fetch(URL, { method: 'GET', cache: 'no-cache' })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    let records = data.result.records;
                    let cameras = [];
                    for (let i = 0; i < records.length; i++) {
                        if (isInRange(center, records[i], Math.floor(center.distance)) && records[i].CityName.substr(0, 2) === '國道' ) {
                            cameras.push(records[i]);
                        }
                    }
                    resolve({ cameras: cameras, address: addressString, center: center });
                })
                .catch(function (err) {

                })
        });
    })
};