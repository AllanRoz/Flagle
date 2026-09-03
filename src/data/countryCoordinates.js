/**
 * Country Coordinates (Latitude & Longitude) and Distance/Compass Utils
 * Provides coordinates for world countries and geographic calculation functions
 */

export const CONTINENT_CENTROIDS = {
  'Africa': [1.6508, 17.4818],
  'Asia': [34.0479, 100.6197],
  'Europe': [54.5260, 15.2551],
  'North America': [54.5260, -105.2551],
  'South America': [-8.7832, -55.4915],
  'Oceania': [-22.7359, 140.0188],
};

// Key country coordinates [lat, lon]
export const COUNTRY_COORDINATES = {
  // Europe
  'AL': [41.1533, 20.1683],
  'AD': [42.5063, 1.5218],
  'AT': [47.5162, 14.5501],
  'BY': [53.7098, 27.9534],
  'BE': [50.5039, 4.4699],
  'BA': [43.9159, 17.6791],
  'BG': [42.7339, 25.4858],
  'HR': [45.1, 15.2],
  'CY': [35.1264, 33.4299],
  'CZ': [49.8175, 15.473],
  'DK': [56.2639, 9.5018],
  'EE': [58.5953, 25.0136],
  'FI': [61.9241, 25.7482],
  'FR': [46.2276, 2.2137],
  'DE': [51.1657, 10.4515],
  'GR': [39.0742, 21.8243],
  'HU': [47.1625, 19.5033],
  'IS': [64.9631, -19.0208],
  'IE': [53.1424, -7.6921],
  'IT': [41.8719, 12.5674],
  'XK': [42.6026, 20.903],
  'LV': [56.8796, 24.6032],
  'LI': [47.166, 9.5554],
  'LT': [55.1694, 23.8813],
  'LU': [49.8153, 6.1296],
  'MT': [35.9375, 14.3754],
  'MD': [47.4116, 28.3699],
  'MC': [43.7384, 7.4246],
  'ME': [42.7087, 19.3744],
  'NL': [52.1326, 5.2913],
  'MK': [41.6086, 21.7453],
  'NO': [60.472, 8.4689],
  'PL': [51.9194, 19.1451],
  'PT': [39.3999, -8.2245],
  'RO': [45.9432, 24.9668],
  'RU': [61.524, 105.3188],
  'SM': [43.9424, 12.4578],
  'RS': [44.0165, 21.0059],
  'SK': [48.669, 19.699],
  'SI': [46.1512, 14.9955],
  'ES': [40.4637, -3.7492],
  'SE': [60.1282, 18.6435],
  'CH': [46.8182, 8.2275],
  'UA': [48.3794, 31.1656],
  'GB': [55.3781, -3.436],
  'VA': [41.9029, 12.4534],
  'FO': [61.8926, -6.9118],
  'GI': [36.1408, -5.3536],
  'IM': [54.2361, -4.5481],
  'JE': [49.2144, -2.1313],
  'GG': [49.4482, -2.5895],
  'AX': [60.1785, 19.9156],
  'SJ': [77.5536, 23.6703],

  // Asia
  'AF': [33.9391, 67.71],
  'AM': [40.0691, 45.0382],
  'AZ': [40.1431, 47.5769],
  'BH': [26.0667, 50.5577],
  'BD': [23.685, 90.3563],
  'BT': [27.5142, 90.4336],
  'BN': [4.5353, 114.7277],
  'KH': [12.5657, 104.991],
  'CN': [35.8617, 104.1954],
  'GE': [42.3154, 43.3569],
  'IN': [20.5937, 78.9629],
  'ID': [-0.7893, 113.9213],
  'IR': [32.4279, 53.688],
  'IQ': [33.2232, 43.6793],
  'IL': [31.0461, 34.8516],
  'JP': [36.2048, 138.2529],
  'JO': [30.5852, 36.2384],
  'KZ': [48.0196, 66.9237],
  'KW': [29.3117, 47.4818],
  'KG': [41.2044, 74.7661],
  'LA': [19.8563, 102.4955],
  'LB': [33.8547, 35.8623],
  'MY': [4.2105, 101.9758],
  'MV': [3.2028, 73.2207],
  'MN': [46.8625, 103.8467],
  'MM': [21.9162, 95.956],
  'NP': [28.3949, 84.124],
  'KP': [40.3399, 127.5101],
  'OM': [21.5126, 55.9233],
  'PK': [30.3753, 69.3451],
  'PS': [31.9522, 35.2332],
  'PH': [12.8797, 121.774],
  'QA': [25.3548, 51.1839],
  'SA': [23.8859, 45.0792],
  'SG': [1.3521, 103.8198],
  'KR': [35.9078, 127.7669],
  'LK': [7.8731, 80.7718],
  'SY': [34.8021, 38.9968],
  'TW': [23.6978, 120.9605],
  'TJ': [38.861, 71.2761],
  'TH': [15.87, 100.9925],
  'TL': [-8.8742, 125.7275],
  'TR': [38.9637, 35.2433],
  'TM': [38.9697, 59.5563],
  'AE': [23.4241, 53.8478],
  'UZ': [41.3775, 64.5853],
  'VN': [14.0583, 108.2772],
  'YE': [15.5527, 48.5164],
  'HK': [22.3193, 114.1694],
  'MO': [22.1987, 113.5439],

  // Africa
  'DZ': [28.0339, 1.6596],
  'AO': [-11.2027, 17.8739],
  'BJ': [9.3077, 2.3158],
  'BW': [-22.3285, 24.6849],
  'BF': [12.2383, -1.5616],
  'BI': [-3.3731, 29.9189],
  'CV': [16.5388, -23.0418],
  'CM': [7.3697, 12.3547],
  'CF': [6.6111, 20.9394],
  'TD': [15.4542, 18.7322],
  'KM': [-11.875, 43.8722],
  'CD': [-4.0383, 21.7587],
  'CG': [-0.228, 15.8277],
  'CI': [7.54, -5.5471],
  'DJ': [11.8251, 42.5903],
  'EG': [26.8206, 30.8025],
  'GQ': [1.6508, 10.2679],
  'ER': [15.1794, 39.7823],
  'SZ': [-26.5225, 31.4659],
  'ET': [9.145, 40.4897],
  'GA': [-0.8037, 11.6094],
  'GM': [13.4432, -15.3101],
  'GH': [7.9465, -1.0232],
  'GN': [9.9456, -9.6966],
  'GW': [11.8037, -15.1804],
  'KE': [-0.0236, 37.9062],
  'LS': [-29.6099, 28.2336],
  'LR': [6.4281, -9.4295],
  'LY': [26.3351, 17.2283],
  'MG': [-18.7669, 46.8691],
  'MW': [-13.2543, 34.3015],
  'ML': [17.5707, -3.9962],
  'MR': [21.0079, -10.9408],
  'MU': [-20.3484, 57.5522],
  'MA': [31.7917, -7.0926],
  'MZ': [-18.6657, 35.5296],
  'NA': [-22.9576, 18.4904],
  'NE': [17.6078, 8.0817],
  'NG': [9.082, 8.6753],
  'RW': [-1.9403, 29.8739],
  'ST': [0.1864, 6.6131],
  'SN': [14.4974, -14.4524],
  'SC': [-4.6796, 55.492],
  'SL': [8.4606, -11.7799],
  'SO': [5.1521, 46.1996],
  'ZA': [-30.5595, 22.9375],
  'SS': [6.877, 31.307],
  'SD': [12.8628, 30.2176],
  'TZ': [-6.369, 34.8888],
  'TG': [8.6195, 0.8248],
  'TN': [33.8869, 9.5375],
  'UG': [1.3733, 32.2903],
  'ZM': [-13.1339, 27.8493],
  'ZW': [-19.0154, 29.1549],

  // North America
  'AG': [17.0608, -61.7964],
  'BS': [25.0343, -77.3963],
  'BB': [13.1939, -59.5432],
  'BZ': [17.1899, -88.4976],
  'CA': [56.1304, -106.3468],
  'CR': [9.7489, -83.7534],
  'CU': [21.5218, -77.7812],
  'DM': [15.415, -61.371],
  'DO': [18.7357, -70.1627],
  'SV': [13.7942, -88.8965],
  'GD': [12.1165, -61.679],
  'GT': [15.7835, -90.2308],
  'HT': [18.9712, -72.2852],
  'HN': [15.2, -86.2419],
  'JM': [18.1096, -77.2975],
  'MX': [23.6345, -102.5528],
  'NI': [12.8654, -85.2072],
  'PA': [8.538, -80.7821],
  'KN': [17.3578, -62.783],
  'LC': [13.9094, -60.9789],
  'VC': [12.9843, -61.2872],
  'TT': [10.6918, -61.2225],
  'US': [37.0902, -95.7129],
  'PR': [18.2208, -66.5901],
  'GL': [71.7069, -42.6043],
  'BM': [32.3078, -64.7505],
  'KY': [19.5135, -80.567],
  'CW': [12.1696, -68.99],
  'AW': [12.5211, -69.9683],
  'SX': [18.0425, -63.0548],

  // South America
  'AR': [-38.4161, -63.6167],
  'BO': [-16.2902, -63.5887],
  'BR': [-14.235, -51.9253],
  'CL': [-35.6751, -71.543],
  'CO': [4.5709, -74.2973],
  'EC': [-1.8312, -78.1834],
  'GY': [4.8604, -58.9302],
  'PY': [-23.4425, -58.4438],
  'PE': [-9.19, -75.0152],
  'SR': [3.9193, -56.0278],
  'UY': [-32.5228, -55.7658],
  'VE': [6.4238, -66.5897],
  'GF': [3.9339, -53.1258],
  'FK': [-51.7963, -59.5236],

  // Oceania
  'AU': [-25.2744, 133.7751],
  'FJ': [-17.7134, 178.065],
  'KI': [-3.3704, -168.734],
  'MH': [7.1315, 171.1845],
  'FM': [7.4256, 150.5508],
  'NR': [-0.5228, 166.9315],
  'NZ': [-40.9006, 174.886],
  'PW': [7.515, 134.5825],
  'PG': [-6.315, 143.9555],
  'WS': [-13.759, -172.1046],
  'SB': [-9.6457, 160.1562],
  'TO': [-21.179, -175.1982],
  'TV': [-7.1095, 177.6493],
  'VU': [-15.3767, 166.9592],
  'NC': [-20.9043, 165.618],
  'PF': [-17.6797, -149.4068],
  'GU': [13.4443, 144.7937],
};

/**
 * Gets coordinates for a country code, falling back to continent centroid
 */
export function getCountryCoordinates(country) {
  if (!country) return null;
  if (COUNTRY_COORDINATES[country.code]) {
    return COUNTRY_COORDINATES[country.code];
  }
  if (country.continent && CONTINENT_CENTROIDS[country.continent]) {
    return CONTINENT_CENTROIDS[country.continent];
  }
  return null;
}

/**
 * Calculates distance between two lat/long points in km (Haversine Formula)
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Calculates bearing and returns 8-compass direction arrow
 */
export function calculateCompassBearing(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));

  const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;

  // 8 cardinal directions
  const directions = [
    { label: 'N', arrow: '⬆️' },
    { label: 'NE', arrow: '↗️' },
    { label: 'E', arrow: '➡️' },
    { label: 'SE', arrow: '↘️' },
    { label: 'S', arrow: '⬇️' },
    { label: 'SW', arrow: '↙️' },
    { label: 'W', arrow: '⬅️' },
    { label: 'NW', arrow: '↖️' },
  ];

  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Gets geographic comparison between a guessed country and target country
 */
export function getCountryComparison(guessedCountry, targetCountry) {
  if (!guessedCountry || !targetCountry) return null;

  const sameContinent = guessedCountry.continent === targetCountry.continent;
  const c1 = getCountryCoordinates(guessedCountry);
  const c2 = getCountryCoordinates(targetCountry);

  let distanceKm = null;
  let direction = null;

  if (c1 && c2) {
    distanceKm = calculateDistanceKm(c1[0], c1[1], c2[0], c2[1]);
    direction = calculateCompassBearing(c1[0], c1[1], c2[0], c2[1]);
  }

  return {
    sameContinent,
    guessedContinent: guessedCountry.continent,
    targetContinent: targetCountry.continent,
    distanceKm,
    direction,
  };
}
