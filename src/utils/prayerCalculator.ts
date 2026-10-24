import { PrayerTime } from '../types';

export interface CityLocation {
  name: string;
  lat: number;
  lng: number;
  timezone: number; // e.g. 7 for WIB, 8 for WITA
  qibla: number;
  province: string;
}

export const CITIES_DATA: Record<string, CityLocation> = {
  "Bandung": {
    name: "Bandung",
    lat: -6.9175,
    lng: 107.6191,
    timezone: 7,
    qibla: 295.1,
    province: "Jawa Barat"
  },
  "Depok": {
    name: "Depok",
    lat: -6.4025,
    lng: 106.7942,
    timezone: 7,
    qibla: 295.2,
    province: "Jawa Barat"
  },
  "Jakarta Pusat": {
    name: "Jakarta Pusat",
    lat: -6.1805,
    lng: 106.8284,
    timezone: 7,
    qibla: 295.2,
    province: "DKI Jakarta"
  },
  "Jakarta Selatan": {
    name: "Jakarta Selatan",
    lat: -6.2615,
    lng: 106.8106,
    timezone: 7,
    qibla: 295.2,
    province: "DKI Jakarta"
  },
  "Makassar": {
    name: "Makassar",
    lat: -5.1477,
    lng: 119.4327,
    timezone: 8,
    qibla: 292.5,
    province: "Sulawesi Selatan"
  },
  "Medan": {
    name: "Medan",
    lat: 3.5952,
    lng: 98.6722,
    timezone: 7,
    qibla: 292.8,
    province: "Sumatera Utara"
  },
  "Palembang": {
    name: "Palembang",
    lat: -2.9909,
    lng: 104.7566,
    timezone: 7,
    qibla: 294.8,
    province: "Sumatera Selatan"
  },
  "Surabaya": {
    name: "Surabaya",
    lat: -7.2575,
    lng: 112.7521,
    timezone: 7,
    qibla: 294.0,
    province: "Jawa Timur"
  },
  "Yogyakarta": {
    name: "Yogyakarta",
    lat: -7.7956,
    lng: 110.3695,
    timezone: 7,
    qibla: 294.5,
    province: "DI Yogyakarta"
  }
};

// Math helpers
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/**
 * Calculates accurate Qibla direction in degrees from true North
 */
export function calculateQibla(lat: number, lng: number): number {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  const phiK = rad(kaabaLat);
  const lambdaK = rad(kaabaLng);
  const phi = rad(lat);
  const lambda = rad(lng);

  const deltaLambda = lambdaK - lambda;
  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);
  let qibla = deg(Math.atan2(y, x));
  if (qibla < 0) qibla += 360;
  return Math.round(qibla * 10) / 10;
}

/**
 * Calculate distance between two GPS coordinates in kilometers (Haversine formula)
 */
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius km
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the closest city in our registry based on device coordinates
 */
export function findNearestCity(userLat: number, userLng: number): { city: string; distanceKm: number } {
  let closestCity = "Jakarta Pusat";
  let minDistance = Infinity;

  for (const [cityName, cityData] of Object.entries(CITIES_DATA)) {
    const dist = getDistanceKm(userLat, userLng, cityData.lat, cityData.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = cityName;
    }
  }

  return { city: closestCity, distanceKm: Math.round(minDistance * 10) / 10 };
}

/**
 * Converts Julian Day to Sun Position (Declination and Equation of Time)
 */
function getSunPosition(jd: number) {
  const d = jd - 2451545.0;
  const g = 357.529 + 0.98560028 * d;
  const q = 280.459 + 0.98564736 * d;
  const L = (q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g))) % 360;
  const e = 23.439 - 0.00000036 * d;
  const ra = deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15;
  const d_ra = ((ra % 24) + 24) % 24;
  const decl = deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L))));
  const eqt = (q / 15 - d_ra) * 60;
  return { decl, eqt };
}

function getJulianDay(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

/**
 * Calculates prayer times according to standard Indonesian Ministry of Religious Affairs (Kemenag)
 * Fajr = 20 deg, Isha = 18 deg, Asr = Shafi'i (1), Ihtiyath = 2 mins
 */
export function calculatePrayerTimes(
  lat: number,
  lng: number,
  timezone: number,
  date: Date = new Date()
): { name: string; time: string; minutes: number }[] {
  const jd = getJulianDay(date);
  const { decl, eqt } = getSunPosition(jd);

  // Solar noon (Dzuhur) in hours
  // Dzuhur includes +2 minutes safety buffer (ihtiyath)
  const noon = 12 + timezone - lng / 15 - eqt / 60;
  const dhuhrHour = noon + 2 / 60;

  // Hour angle helper
  const hourAngle = (alpha: number) => {
    const top = -Math.sin(rad(alpha)) - Math.sin(rad(lat)) * Math.sin(rad(decl));
    const bottom = Math.cos(rad(lat)) * Math.cos(rad(decl));
    const val = top / bottom;
    if (val > 1 || val < -1) return null;
    return deg(Math.acos(val)) / 15;
  };

  // Fajr (Subuh): -20 degrees
  const fajrAngle = hourAngle(20);
  const subuhHour = fajrAngle !== null ? noon - fajrAngle + 2 / 60 : dhuhrHour - 7.5;

  // Sunrise (Terbit): -0.833 degrees
  const sunriseAngle = hourAngle(0.833);
  const terbitHour = sunriseAngle !== null ? noon - sunriseAngle : dhuhrHour - 6.2;

  // Asr: shadow length = 1 + tan|lat - decl|
  const asrAngleVal = deg(Math.atan(1 / (1 + Math.tan(rad(Math.abs(lat - decl))))));
  const asrAngle = hourAngle(-asrAngleVal);
  const asharHour = asrAngle !== null ? noon + asrAngle + 2 / 60 : dhuhrHour + 3.3;

  // Sunset (Maghrib): -0.833 degrees
  const maghribHour = sunriseAngle !== null ? noon + sunriseAngle + 2 / 60 : dhuhrHour + 6.0;

  // Isha: -18 degrees
  const ishaAngle = hourAngle(18);
  const isyaHour = ishaAngle !== null ? noon + ishaAngle + 2 / 60 : dhuhrHour + 7.2;

  // Imsak: 10 minutes before Subuh
  const imsakHour = subuhHour - 10 / 60;

  const formatHours = (h: number) => {
    let totalMinutes = Math.round(h * 60);
    // Wrap around 24 hours
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    return { timeStr, minutes: totalMinutes };
  };

  const imsak = formatHours(imsakHour);
  const subuh = formatHours(subuhHour);
  const terbit = formatHours(terbitHour);
  const dzuhur = formatHours(dhuhrHour);
  const ashar = formatHours(asharHour);
  const maghrib = formatHours(maghribHour);
  const isya = formatHours(isyaHour);

  return [
    { name: "Imsak", time: imsak.timeStr, minutes: imsak.minutes },
    { name: "Subuh", time: subuh.timeStr, minutes: subuh.minutes },
    { name: "Terbit", time: terbit.timeStr, minutes: terbit.minutes },
    { name: "Dzuhur", time: dzuhur.timeStr, minutes: dzuhur.minutes },
    { name: "Ashar", time: ashar.timeStr, minutes: ashar.minutes },
    { name: "Maghrib", time: maghrib.timeStr, minutes: maghrib.minutes },
    { name: "Isya", time: isya.timeStr, minutes: isya.minutes },
  ];
}

/**
 * Format Gregorian date into Indonesian format
 * Example: "Sabtu, 24 Oktober 2026"
 */
export function formatIndonesianDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Converts date to Islamic (Hijri) calendar
 * Example: "13 Jumadil Awwal 1448 H"
 */
export function getHijriDate(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formatted = formatter.format(date);
    // Ensure "H" suffix if not present
    if (formatted && !formatted.includes('H')) {
      return `${formatted} H`;
    }
    return formatted;
  } catch (e) {
    // Fallback Islamic calculation
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    let m = month + 1;
    let y = year;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
    
    const epochAstro = 1948084;
    const shift1 = 8.01 / 60;
    let z = jd - epochAstro;
    const cyc = Math.floor(z / 10631);
    z = z - 10631 * cyc;
    const j = Math.floor((z - shift1) / 354.36667);
    const iy = 30 * cyc + j;
    z = z - Math.floor(j * 354.36667 + shift1);
    let im = Math.floor((z + 28.5001) / 29.5);
    if (im === 13) im = 12;
    const id = z - Math.floor(29.5001 * im - 29);

    const hijriMonthsIndo = [
      "Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir",
      "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban",
      "Ramadhan", "Syawwal", "Dzulqa'dah", "Dzulhijjah"
    ];

    const monthName = hijriMonthsIndo[Math.max(0, Math.min(11, im - 1))] || "Jumadil Awwal";
    return `${Math.max(1, Math.floor(id))} ${monthName} ${iy} H`;
  }
}

export interface PrayerStatusResult {
  prayerTimes: PrayerTime[];
  nextPrayerName: string;
  nextPrayerTime: string;
  isTomorrow: boolean;
  countdownText: string;
  secondsRemaining: number;
}

/**
 * Analyzes the list of prayer times against device's current time:
 * - Marks passed prayers with passed = true
 * - Sets isNext = true on the exact NEXT prayer (highlighted in ORANGE)
 * - Computes real-time countdown to the exact second
 */
export function evaluatePrayerSchedule(
  rawTimes: { name: string; time: string; minutes: number }[],
  currentTime: Date = new Date()
): PrayerStatusResult {
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();
  const nowTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

  let nextIndex = -1;
  let isTomorrow = false;

  // Convert each prayer time string HH:MM to total seconds
  const prayerSeconds = rawTimes.map((item) => {
    const [h, m] = item.time.split(':').map(Number);
    return h * 3600 + m * 60;
  });

  // Find the first prayer whose time is strictly after nowTotalSeconds
  for (let i = 0; i < prayerSeconds.length; i++) {
    if (prayerSeconds[i] > nowTotalSeconds) {
      nextIndex = i;
      break;
    }
  }

  // If nowTotalSeconds is after all prayers today (e.g. after Isya),
  // the next prayer is Subuh (or Imsak) tomorrow!
  if (nextIndex === -1) {
    nextIndex = 1; // Subuh tomorrow is the primary next fardhu prayer
    isTomorrow = true;
  }

  // Calculate remaining seconds
  let secondsRemaining = 0;
  if (!isTomorrow) {
    secondsRemaining = prayerSeconds[nextIndex] - nowTotalSeconds;
  } else {
    // Seconds until midnight + seconds from midnight to tomorrow's prayer
    const secondsUntilMidnight = 86400 - nowTotalSeconds;
    secondsRemaining = secondsUntilMidnight + prayerSeconds[nextIndex];
  }

  // Format countdown string HH:MM:SS
  const remHours = Math.floor(secondsRemaining / 3600);
  const remMinutes = Math.floor((secondsRemaining % 3600) / 60);
  const remSecs = secondsRemaining % 60;
  const countdownText = `${remHours.toString().padStart(2, '0')}:${remMinutes
    .toString()
    .padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;

  const updatedTimes: PrayerTime[] = rawTimes.map((item, idx) => {
    let isNext = false;
    let passed = false;

    if (!isTomorrow) {
      if (idx === nextIndex) {
        isNext = true;
      } else if (idx < nextIndex) {
        passed = true;
      }
    } else {
      // Past Isya: All today's prayers are passed
      passed = true;
      // Mark Subuh (besok) as next
      if (idx === nextIndex) {
        isNext = true;
      }
    }

    return {
      name: item.name,
      time: item.time,
      passed,
      isNext
    };
  });

  const nextPrayerName = rawTimes[nextIndex]?.name || 'Subuh';
  const nextPrayerTime = rawTimes[nextIndex]?.time || '04:30';

  return {
    prayerTimes: updatedTimes,
    nextPrayerName,
    nextPrayerTime,
    isTomorrow,
    countdownText,
    secondsRemaining
  };
}
