/*
 * return: distance between two locations
 */

module.exports = function calculate(location1, location2) {
    let latitude_diff = 110.574 * (location1.lat - location2.lat);
    let longitude_distance = 111.320 * Math.cos(((parseInt(location1.lat) + parseInt(location2.lat)) / 2)  *  Math.PI / 180);
    let longitude_diff = longitude_distance * (location1.lng - location2.lng);
    return Math.sqrt(Math.pow(latitude_diff, 2) + Math.pow(longitude_diff, 2));
};