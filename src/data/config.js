export const SITE = {
  name: 'Heydər Əliyev İdman və Konsert Kompleksi',
  arena: 'Buz Arenası',
  address: 'Tbilisi prospekti 12, Bakı',
  metro: 'Nizami metrosu yaxınlığında',
  // Rəsmi məlumatlar (Footer)
  official: {
    founder: 'Azərbaycan Respublikasının Gənclər və İdman Nazirliyi',
    company: '"Heydər Əliyev Adına İdman-Konsert Kompleksi" MMC',
    legalAddress: 'AZ-1022 Bakı şəhəri, Tbilisi prospekti 12',
    phone: '+994(12) 599 9 599',
    phoneHref: 'tel:+994125999599',
    email: 'info@haikk.az',
  },
  // Buz Arenasının dəqiq koordinatları (WGS84)
  coords: { lat: 40.39203940151111, lng: 49.82498717479567 },
  coordsLabel: '40.39204, 49.82499',
  buses: ['2', '65', '79'],
  instagram: 'https://www.instagram.com/buzarena',
  instagramHandle: '@buzarena',
  tiktok: 'https://www.tiktok.com/@buzarena',
  tiktokHandle: '@buzarena',
  email: 'info@haikk.az',
  phone: '+994 12 599 95 99',
  phone2: '+994 50 700 26 89',
  phone2Href: 'tel:+994507002689',
  clubs: [
    { name: 'Ocaq Sport Club', phone: '+994 70 879 93 69' },
    { name: 'Tamis Sport Club', phone: '+994 50 393 30 48' },
  ],
  // Həftənin günləri üzrə iş saatları (hər gün ayrıca blok kimi göstərilir)
  workingHours: [
    { day: '1-ci gün', ranges: ['10:30 - 13:45', '18:45 - 21:30'] },
    { day: '2-ci gün', ranges: ['10:30 - 13:45', '18:45 - 21:30'] },
    { day: '3-cü gün', ranges: ['10:30 - 13:45', '18:45 - 21:30'] },
    { day: '4-cü gün', ranges: ['10:00 - 13:45', '18:45 - 21:30'] },
    { day: '5-ci gün', ranges: ['10:00 - 13:45', '18:45 - 21:30'] },
    { day: '6-cı gün', ranges: ['10:45 - 22:00'] },
    { day: '7-ci gün', ranges: ['10:00 - 22:00'] },
  ],
  safetyUnder4:
    '4 yaşından aşağı uşaqların Buz Meydançasına girişi qəti qadağandır!',
  // Google Maps embed - sadəcə dəqiq koordinatlarla (API açarı tələb olunmur)
  mapEmbed:
    'https://www.google.com/maps?q=40.39203940151111%2C49.82498717479567&hl=az&z=17&output=embed',
  // Xəritədə aç / marşrut düymələri üçün
  mapLink:
    'https://www.google.com/maps/search/?api=1&query=40.39203940151111%2C49.82498717479567',
  directionsLink:
    'https://www.google.com/maps/dir/?api=1&destination=40.39203940151111%2C49.82498717479567',
}

export const RESERVATION = {
  initialMinutes: 10,
  extensionMinutes: 10,
  maxExtensions: 2,
}

export const RULES = [
  'Faiz endirimləri yalnız 1 saatlıq biletlər üçün keçərlidir.',
  'Qrup və 5+1 endirimləri iştirakçı sayına görə avtomatik tətbiq olunur.',
  'Eyni anda yalnız 1 endirim tətbiq oluna bilər.',
  '4 yaşından aşağı uşaqların Buz Meydançasına girişi qəti qadağandır!',
]