const distanceCalculate = require('./distanceCalculate');

/*
 * params: center location, target location, range distance
 * return: is target location is in the range of circle with center: center location, radius: distance 
 */

module.exports = function check(center, target, distance) {
    let targetFormat = { lat: target.Latitude, lng: target.Longitude };
    let diff = distanceCalculate(center, targetFormat);
    if(diff <= distance) {
        return true;
    }
    return false;
};