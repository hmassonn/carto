function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
  
haversineDistance = (coord1, coord2) => {
    const R = 6371; // Rayon de la Terre en kilomètres

    const lat1 = toRadians(coord1.y);
    const lon1 = toRadians(coord1.x);
    const lat2 = toRadians(coord2.y);
    const lon2 = toRadians(coord2.x);
  
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
    return distance;
}

module.exports = haversineDistance;
