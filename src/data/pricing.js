export const PRICING = {
  currency: 'AZN',
  standard: {
    weekday: { hour: 20, half: 15 },
    weekend: { hour: 25, half: 20 },
  },
  monthly: {
    entries: 12,
    duration: 'hour',
    standard: 180,
    ownSkates: 120,
  },
  rules: {
    sundayMorning: {
      windows: ['10:00', '12:00'],
      percent: 20,
      description: 'Bazar günü 10:00 - 12:00 arası 20% endirim',
    },
    student: {
      percent: 20,
      days: ['weekday'],
      duration: 'hour',
      description: 'Tələbə endirimi - yalnız həftəiçi, 1 saat (20% endirim)',
    },
    group: {
      minPeople: 10,
      percent: 20,
      duration: 'hour',
      description:
        'Qrup endirimi - 10 nəfərdən çox olduqda, adam başı 20% endirim (1 saat)',
    },
    family: {
      description:
        'Ailə endirimi - ailə neçə nəfərdirsə, 1 nəfər pulsuzdur (2+1 / 3+1)',
    },
    fivePlusOne: {
      minPeople: 6,
      description: '5+1 kampaniyası - ən az 6 nəfər olduqda 1 nəfər pulsuzdur',
    },
    push30: {
      description: 'PUSH30 - tətbiqdə premium paketlər üçün 1 dəfə 1 saat pulsuz giriş',
    },
    shaheed: {
      description:
        'Şəhid ailələri üçün giriş hər zaman pulsuzdur (şəhidlik vəsiqəsi qeydiyyatda təsdiq olunmalıdır)',
    },
    qazi: {
      description:
        'Qazilər: ilk dəfə 1 saat pulsuz, 2-ci dəfə 50% endirim (10 AZN), qalan səfərlər standart qiymət',
    },
    monthly:
      'Aylıq abunəlik: 12 giriş (1 saatlıq) = 180 AZN, öz konkim ilə = 120 AZN',
  },
}