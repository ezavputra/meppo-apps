// Import Linking from react-native
const { Linking } = require('react-native');

// Function to open an external link
export const openExternalLink = url => {
  return Linking.openURL(url)
    .then(() => {
      console.log('Link opened successfully');
    })
    .catch(err => {
      console.error('Error opening external link:', err);
      throw err; // Rethrow the error for the calling code to handle
    });
};

// Function to format WiFi data
export const formatWifiData = wifiData => {
  // Split the WiFi data into parts and filter out empty parts
  const dataParts = wifiData.split(';').filter(part => part.trim() !== '');

  // Format each part as key-value pairs and join them with newline
  const formattedData = dataParts.map(part => {
    const [key, value] = part.split(':');
    return `${key}: ${value}`;
  });

  return formattedData.join('\n');
};

// Function to get the country of origin from a barcode
export const getCountryOfOriginFromBarcode = barcode => {
  // Extract the first three digits of the barcode as the prefix
  const prefix = parseInt(barcode.substring(0, 3), 10);

  // Define ranges for country codes and their corresponding countries
  const countryRanges = {
    '000-019': 'United States and Canada',
    '020-029': 'Restricted distribution',
    '030-039': 'United States drugs (National Drug Code)',
    '040-049':
      'Used to issue restricted circulation numbers within a geographic region',
    '050-059': 'Reserved for future use',
    '060-099': 'United States and Canada',
    '100-139': 'United States',
    '200-299': 'Restricted distribution',
    '300-379': 'France and Monaco',
    380: 'Bulgaria',
    383: 'Slovenia',
    385: 'Croatia',
    387: 'Bosnia and Herzegovina',
    389: 'Montenegro',
    '400-440': 'Germany',
    '450-459': 'Japan',
    '460-469': 'Russia',
    470: 'Kyrgyzstan',
    471: 'Taiwan',
    474: 'Estonia',
    475: 'Latvia',
    476: 'Azerbaijan',
    477: 'Lithuania',
    478: 'Uzbekistan',
    479: 'Sri Lanka',
    480: 'Philippines',
    481: 'Belarus',
    482: 'Ukraine',
    484: 'Moldova',
    485: 'Armenia',
    486: 'Georgia',
    487: 'Kazakhstan',
    488: 'Tajikistan',
    489: 'Hong Kong',
    '490-499': 'Japan',
    '500-509': 'United Kingdom',
    '520-521': 'Greece',
    528: 'Lebanon',
    529: 'Cyprus',
    530: 'Albania',
    531: 'Macedonia',
    535: 'Malta',
    539: 'Ireland',
    '540-549': 'Belgium and Luxembourg',
    560: 'Portugal',
    569: 'Iceland',
    '570-579': 'Denmark, Faroe Islands, and Greenland',
    590: 'Poland',
    594: 'Romania',
    599: 'Hungary',
    '600-601': 'South Africa',
    603: 'Ghana',
    604: 'Senegal',
    608: 'Bahrain',
    609: 'Mauritius',
    611: 'Morocco',
    613: 'Algeria',
    615: 'Nigeria',
    616: 'Kenya',
    618: 'Côte d’Ivoire',
    619: 'Tunisia',
    621: 'Syria',
    622: 'Egypt',
    624: 'Libya',
    625: 'Jordan',
    626: 'Iran',
    627: 'Kuwait',
    628: 'Saudi Arabia',
    629: 'United Arab Emirates',
    '640-649': 'Finland',
    '690-695': 'China',
    '700-709': 'Norway',
    729: 'Israel',
    '730-739': 'Sweden',
    740: 'Guatemala',
    741: 'El Salvador',
    742: 'Honduras',
    743: 'Nicaragua',
    744: 'Costa Rica',
    750: 'Mexico',
    '754-755': 'Canada',
    759: 'Venezuela',
    '760-769': 'Switzerland and Liechtenstein',
    '770-771': 'Colombia',
    773: 'Uruguay',
    775: 'Peru',
    777: 'Bolivia',
    779: 'Argentina',
    780: 'Chile',
    784: 'Paraguay',
    785: 'Peru',
    786: 'Ecuador',
    '789-790': 'Brazil',
    '800-839': 'Italy, San Marino, and Vatican City',
    '840-849': 'Spain and Andorra',
    850: 'Cuba',
    858: 'Slovakia',
    859: 'Czech Republic',
    860: 'Serbia',
    865: 'Mongolia',
    867: 'North Korea',
    '868-869': 'Turkey',
    '870-879': 'Netherlands',
    880: 'South Korea',
    884: 'Cambodia',
    885: 'Thailand',
    888: 'Singapore',
    890: 'India',
    893: 'Vietnam',
    896: 'Pakistan',
    899: 'Indonesia',
    '900-919': 'Austria',
    '930-939': 'Australia',
    '940-949': 'New Zealand',
    955: 'Malaysia',
    958: 'Macau',
    '960-969': 'GS1 Global Office: GTIN-8 allocations',
    977: 'Serial publications (ISSN)',
    '978-979': 'Bookland (ISBN)',
    980: 'Refund receipts',
    '981-984': 'GS1 coupon identification for common currency areas',
    '990-999': 'Coupon identification',
  };

  // Iterate through the country ranges to find the matching range
  for (const range in countryRanges) {
    const [start, end] = range.split('-').map(Number);

    // Check if the prefix falls within the current range
    if (prefix >= start && prefix <= end) {
      return countryRanges[range];
    }
  }

  // If no matching range is found, return a default message
  return 'Country not specified';
};