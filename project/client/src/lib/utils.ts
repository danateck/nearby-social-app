export function formatTime(timestamp?: number) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString();
}

export function distanceInMeters(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371e3;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return Math.round(R * y);
}
