exports.closestLocation = (targetLocation, locationData) => {
    return locationData.reduce(function(prev, curr) {
        var prevDistance = locationDistance(targetLocation , prev),
            currDistance = locationDistance(targetLocation , curr);
        return (prevDistance < currDistance) ? prev : curr;
    });
}

function locationDistance(location1, location2) {
    const [lng1, lat1] = location1.geometry.coordinates;
    const [lng2, lat2] = location2.geometry.coordinates;

    var dx = lat1 - lat2,
        dy = lng1 - lng2;

    return vectorDistance(dx, dy);
}

function vectorDistance(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
}


