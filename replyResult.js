const cameraInfo = require('./cameraInfo');
//const snapToRoad = require('./snapToRoad');

/*
 * params: address
 * return: camera info in need
 */

module.exports = function getResult(request) {
    return new Promise((resolve, reject) => {
        let address = request.address.split(',');
        let departure = address[0];
        let destination = address[1];

        let camerasInRange = cameraInfo(request.address);
        camerasInRange.then((data) => {
            let cameras = data.cameras;
            cameras = cameras.filter((camera) => { return camera.CityName === request.region && camera.CityName.substr(0, 2) === '國道' });
            let locationUrl = 'https://maps.googleapis.com/maps/api/staticmap?center=' + data.center.lat + ',' + data.center.lng + '&zoom=8&size=600x300&maptype=roadmap%20';
            for (let i = 0; i < cameras.length; i++) {
                let camera = { lat: cameras[i].Latitude, lng: cameras[i].Longitude };
                locationUrl += '&markers=color:blue%7Clabel:S%7C' + camera.lat + ',' + camera.lng;
            }
            locationUrl += '&key=' + process.env.STATICMAPKEY;
            locationResult = { uri: locationUrl, cameras: cameras };
            resolve(locationResult);
        });
    })
    
}