/**
 * Full-site translation dictionary (AZ -> EN / RU)
 * Covers all public pages, customer cabinet, booking wizard, modals,
 * and Admin / Coordinator / Cashier / Volunteer panels.
 */

export const LANGUAGES = [
  { code: 'az', label: 'AZ', fullLabel: 'Azərbaycan' },
  { code: 'en', label: 'EN', fullLabel: 'English' },
  { code: 'ru', label: 'RU', fullLabel: 'Русский' },
]

// Exact phrase dictionary: [English, Russian]
export const EXACT_MAP = {
  // Brand & Header & Navigation
  'Heydər Əliyev İdman və Konsert Kompleksi': [
    'Heydar Aliyev Sports and Concert Complex',
    'Спортивно-концертный комплекс имени Гейдара Алиева',
  ],
  'Heydər Əliyev İdman və Konsert Kompleksi (HƏİKK)': [
    'Heydar Aliyev Sports and Concert Complex (HASCC)',
    'Спортивно-концертный комплекс им. Гейдара Алиева (СКК)',
  ],
  'Heydər Əliyev İdman və Konsert Kompleksi - ana səhifə': [
    'Heydar Aliyev Sports and Concert Complex - Home',
    'СКК им. Гейдара Алиева - Главная страница',
  ],
  'Heydər Əliyev Buz Arenası loqosu': [
    'Heydar Aliyev Ice Arena logo',
    'Логотип Ледовой Арены им. Гейдара Алиева',
  ],
  'HƏİKK': ['HASCC', 'СКК'],
  'BUZ ARENASI': ['ICE ARENA', 'ЛЕДОВАЯ АРЕНА'],
  'Buz Arenası': ['Ice Arena', 'Ледовая Арена'],
  'HƏİKK - Buz Arenası': ['HASCC - Ice Arena', 'СКК - Ледовая Арена'],
  'Ana səhifə': ['Home', 'Главная'],
  'Qiymətlər': ['Pricing', 'Цены'],
  'Fəaliyyətlər': ['Activities', 'Активности'],
  'Qaydalar': ['Rules', 'Правила'],
  'Qaydalar və qadağalar': ['Rules & Restrictions', 'Правила и запреты'],
  'Haqqımızda': ['About Us', 'О нас'],
  'Əlaqə': ['Contact', 'Контакты'],
  'Canlı': ['Live', 'Эфир'],
  'Canlı yayım': ['Live Stream', 'Прямой эфир'],
  'Canlı səhifə': ['Live Page', 'Страница эфира'],
  'Bilet al': ['Buy Ticket', 'Купить билет'],
  'İndi bilet al': ['Buy Ticket Now', 'Купить билет сейчас'],
  'Yeni bilet al': ['Buy New Ticket', 'Купить новый билет'],
  'Biletlərim': ['My Tickets', 'Мои билеты'],
  'Biletlərimə keç': ['Go to My Tickets', 'Перейти к моим билетам'],
  '🎫 Biletlərimə keç': ['🎫 Go to My Tickets', '🎫 Перейти к моим билетам'],
  '⛸️ Yeni bilet al': ['⛸️ Buy New Ticket', '⛸️ Купить новый билет'],
  '📡 Canlı buz statusu': ['📡 Live Ice Status', '📡 Статус льда в реальном времени'],
  '🚪 Hesabdan çıxış': ['🚪 Log Out', '🚪 Выйти из аккаунта'],
  'Hesabım': ['My Account', 'Мой аккаунт'],
  'Hesab': ['Account', 'Аккаунт'],
  'Daxil ol': ['Sign In', 'Войти'],
  'Qeydiyyat': ['Sign Up', 'Регистрация'],
  'Qeydiyyatdan keç': ['Create Account', 'Зарегистрироваться'],
  'Çıxış': ['Log Out', 'Выход'],
  'Çıxış et': ['Log Out', 'Выйти'],
  'Menyunu aç/bağla': ['Toggle menu', 'Открыть/закрыть меню'],
  'Əsas naviqasiya': ['Main navigation', 'Основная навигация'],
  'Mobil naviqasiya': ['Mobile navigation', 'Мобильная навигация'],
  'Admin Paneli': ['Admin Panel', 'Панель админа'],
  'Koordinator Paneli': ['Coordinator Panel', 'Панель координатора'],
  'Kassir Paneli': ['Cashier Panel', 'Панель кассира'],
  'Könüllü Paneli': ['Volunteer Panel', 'Панель волонтёра'],

  // Hero & HomePage
  'Nizami metrosu yaxınlığında': ['Near Nizami Metro Station', 'Рядом с метро Низами'],
  'Buz Arenası -': ['Ice Arena -', 'Ледовая Арена -'],
  'buzda sürüşün ritmini hiss et': [
    'feel the rhythm of gliding on ice',
    'почувствуй ритм скольжения по льду',
  ],
  'Beynəlxalq standartlara cavab verən buz səthimizdə açıq konkisürmə, məşğələlər və xüsusi tədbirlər. Canlı yayımı izlə, konki ölçünü rezervasiya et və vaxtını buza ayır.': [
    'Public skating, professional training, and special events on our international-standard ice rink. Watch the live stream, reserve your skate size, and enjoy your time on the ice.',
    'Массовое катание, тренировки и специальные мероприятия на льду международного стандарта. Смотрите прямой эфир, бронируйте размер коньков и проводите время на льду.',
  ],
  'm² buz səthi': ['m² ice surface', 'м² площадь льда'],
  'eyni anda giriş': ['simultaneous skaters', 'человек одновременно'],
  'gün aktiv buz': ['days of active ice', 'дней активного льда'],
  'Buz həmişə göz önündədir': [
    'The Ice Is Always in Sight',
    'Лёд всегда перед глазами',
  ],
  'Buz açıq olduğu müddətcə arenanı canlı izləyin. Hazırda buz üstündə neçə müştəri olduğunu rəqəmsal sayaçdan öyrənin.': [
    'Watch the arena live whenever the ice is open. Check the real-time digital counter to see how many skaters are currently on the ice.',
    'Следите за ареной в прямом эфире, пока лёд открыт. Узнавайте текущее количество посетителей на льду с помощью цифрового счётчика.',
  ],
  'Konki rezervasiyası': ['Skate Reservation', 'Бронирование коньков'],
  'Bilet alarkən konki ölçünü (razmer) qeyd edin - konkilar gəldiyiniz vaxt hazır olacaq.': [
    'Select your skate size when buying a ticket — your skates will be ready when you arrive.',
    'Укажите размер коньков при покупке билета — коньки будут готовы к вашему приходу.',
  ],
  'Rəqəmsal bilet': ['Digital Ticket', 'Цифровой билет'],
  'Hər biletə unikal kod və QR təyin olunur. Çeki telefonunuzdan göstərərək buza daxil olun.': [
    'Every ticket receives a unique code and QR. Simply show the voucher on your phone to enter the ice.',
    'Каждому билету присваивается уникальный код и QR. Покажите билет с телефона при входе на лёд.',
  ],
  'Canlı sayaç': ['Live Counter', 'Живой счётчик'],
  'Buz üstündəki kişi sayını real vaxtda izləyin və ən uyğun saata bilet alın.': [
    'Track the number of skaters on the ice in real time and book your ticket for the best hour.',
    'Отслеживайте количество людей на льду в реальном времени и покупайте билет на удобное время.',
  ],
  'Şəffaf qiymət siyasəti': ['Transparent Pricing Policy', 'Прозрачная ценовая политика'],
  'Endirimlər yalnız 1 saatlıq biletlər üçün keçərlidir və eyni anda yalnız bir endirim tətbiq oluna bilər.': [
    'Discounts apply only to 1-hour tickets, and only one discount can be applied at a time.',
    'Скидки действуют только на часовые билеты, и одновременно может быть применена только одна скидка.',
  ],
  'İş saatları': ['Opening Hours', 'Часы работы'],
  'Bizi nə vaxt ziyarət edə bilərsiniz': ['When You Can Visit Us', 'Когда вы можете посетить нас'],
  'İş saatları hər həftə yenilənə bilir. Xüsusi günlər haqqında Instagram səhifəmizdən məlumat alın.': [
    'Opening hours may be updated weekly. Check our Instagram page for announcements about special days.',
    'Часы работы могут обновляться каждую неделю. Информацию о специальных днях смотрите на нашей странице в Instagram.',
  ],
  'Məşğələlər və klublar': ['Training & Clubs', 'Тренировки и клубы'],
  'Peşəkar məşqçilərlə buz idmanı': [
    'Ice Sports with Professional Coaches',
    'Ледовый спорт с профессиональными тренерами',
  ],
  'Ocaq Sport Club və Tamis Sport Club ilə əməkdaşlıq - fiqurlu konkisürmə, xokkey və sürətli konkisürmə məşğələləri.': [
    'In partnership with Ocaq Sport Club and Tamis Sport Club — figure skating, ice hockey, and speed skating lessons.',
    'В сотрудничестве с Ocaq Sport Club и Tamis Sport Club — занятия по фигурному катанию, хоккею и конькобежному спорту.',
  ],
  'Bütün fəaliyyətlər': ['All Activities', 'Все активности'],
  'Qruplar üçün xüsusi təkliflərimiz də var - qrup endirimi ilə tanış olun.': [
    'We also offer special deals for groups — check out our group discount.',
    'У нас также есть специальные предложения для групп — ознакомьтесь с групповой скидкой.',
  ],

  // SafetyNotice
  'Vacib xəbərdarlıq — yaş məhdudiyyəti': [
    'Important Notice — Age Restriction',
    'Важное предупреждение — возрастное ограничение',
  ],
  '4 yaşından aşağı uşaqların Buz Meydançasına girişi qəti qadağandır!': [
    'Children under 4 years of age are strictly prohibited from entering the Ice Rink!',
    'Вход детей младше 4 лет на ледовую площадку строго запрещён!',
  ],
  'Bilet alışı zamanı hər bir iştirakçının yaşı yoxlanılır. Yaş həddinə cavab verməyən şəxslər buza buraxılmır və onlar üçün alına biletlər girişdə etibarsız sayılır.': [
    'Each participant’s age is verified during ticket purchase. Persons who do not meet the age requirement are not admitted to the ice and tickets purchased for them are considered invalid at the entrance.',
    'Возраст каждого участника проверяется при покупке билета. Лица, не соответствующие возрастному ограничению, на лёд не допускаются, а купленные для них билеты считаются недействительными на входе.',
  ],
  'Bütün qaydalar və qadağalar': ['All Rules & Restrictions', 'Все правила и запреты'],

  // LiveStream & LivePage
  'Buz Arenası - indiki an': ['Ice Arena - Right Now', 'Ледовая Арена - Сейчас'],
  'Buz aktiv olduqda arenanın canlı görüntüsü. Sayaç buz üstündəki cari müştəri sayını göstərir.': [
    'Live view of the arena when the ice is active. The counter shows the current number of skaters on the ice.',
    'Прямая трансляция арены, когда лёд открыт. Счётчик показывает текущее количество посетителей на льду.',
  ],
  'CANLI': ['LIVE', 'ЭФИР'],
  'Məlumat əlçatmazdır': ['Data unavailable', 'Данные недоступны'],
  'Canlı məlumat əlçatmazdır': ['Live data unavailable', 'Живые данные недоступны'],
  'Buz açıqdır': ['Ice is Open', 'Лёд открыт'],
  'Buz bağlıdır': ['Ice is Closed', 'Лёд закрыт'],
  'Buz Arenası - Canlı kamera': ['Ice Arena - Live Camera', 'Ледовая Арена - Живая камера'],
  'buz üstündə': ['on the ice', 'на льду'],
  'Buz arenası': ['Ice arena', 'Ледовая арена'],

  // WorkingHours & Days
  '1-ci gün': ['Monday', 'Понедельник'],
  '2-ci gün': ['Tuesday', 'Вторник'],
  '3-cü gün': ['Wednesday', 'Среда'],
  '4-cü gün': ['Thursday', 'Четверг'],
  '5-ci gün': ['Friday', 'Пятница'],
  '6-cı gün': ['Saturday', 'Суббота'],
  '7-ci gün': ['Sunday', 'Воскресенье'],
  'Bazar ertəsi': ['Monday', 'Понедельник'],
  'Çərşənbə axşamı': ['Tuesday', 'Вторник'],
  'Çərşənbə': ['Wednesday', 'Среда'],
  'Cümə axşamı': ['Thursday', 'Четверг'],
  'Cümə': ['Friday', 'Пятница'],
  'Şənbə': ['Saturday', 'Суббота'],
  'Bazar': ['Sunday', 'Воскресенье'],
  'İş saatlarını izlə': ['Follow Opening Hours', 'Следите за часами работы'],
  'Dəyişikliklər və xüsusi günlər üçün bizi': [
    'For schedule updates and special days, follow us on',
    'За изменениями расписания и специальными днями следите на нашей странице в',
  ],
  'səhifəmizdən izləyin.': ['page.', '.'],

  // PricingPage & PricingSection
  'Tariflər': ['Tariffs', 'Тарифы'],
  'Qiymət cədvəli və endirimlər': ['Price List & Discounts', 'Прайс-лист и скидки'],
  'Standart qiymətlər, aylıq paketlər və bütün endirim şərtləri bir yerdə.': [
    'Standard rates, monthly packages, and all discount terms in one place.',
    'Стандартные цены, месячные абонементы и все условия скидок в одном месте.',
  ],
  'Standart qiymətlər': ['Standard Prices', 'Стандартные цены'],
  'Konki icarəsi qiymətə daxildir': ['Skate rental is included in the price', 'Прокат коньков включён в стоимость'],
  'Müddət': ['Duration', 'Длительность'],
  'Həftəiçi': ['Weekdays', 'Будни'],
  'Həftəsonu': ['Weekends', 'Выходные'],
  '(şənbə, bazar)': ['(Sat, Sun)', '(суббота, воскресенье)'],
  '1 saat': ['1 hour', '1 час'],
  'Yarım saat': ['30 minutes', 'Полчаса (30 мин)'],
  'Aylıq abunəlik': ['Monthly Pass', 'Месячный абонемент'],
  'Aylıq abunəlik - öz konkisi': ['Monthly Pass - Own Skates', 'Месячный абонемент - свои коньки'],
  '12 giriş': ['12 entries', '12 посещений'],
  '12 giriş, hər biri 1 saat': ['12 entries, 1 hour each', '12 посещений по 1 часу'],
  'giriş, hər biri 1 saat': ['entries, 1 hour each', 'посещений по 1 часу'],
  'Şəxsi konkisi ilə gələnlər üçün. 60 AZN qənaət.': [
    'For visitors bringing their own skates. Save 60 AZN.',
    'Для посетителей со своими коньками. Экономия 60 AZN.',
  ],
  'Şəxsi konkisi ilə gələnlər üçün.': [
    'For visitors bringing their own skates.',
    'Для посетителей со своими коньками.',
  ],
  'AZN qənaət.': ['AZN saved.', 'AZN экономии.'],
  'Qayda - bir eyni zamanda': ['Rule - One Discount at a Time', 'Правило - одна скидка за раз'],
  'Bazar günü səhər': ['Sunday Morning', 'Воскресное утро'],
  'Bazar günü saat 10:00 - 12:00 arası bütün 1 saatlıq biletlərə 20% endirim.': [
    '20% discount on all 1-hour tickets on Sundays between 10:00 and 12:00.',
    'Скидка 20% на все часовые билеты по воскресеньям с 10:00 до 12:00.',
  ],
  'Tələbə endirimi': ['Student Discount', 'Студенческая скидка'],
  'Yalnız həftəiçi günlər. Tələbə bileti ilə 1 saat = 16 AZN. Yarım saatlıq paketlərə tətbiq olunmur.': [
    'Weekdays only. With a student ID, 1 hour = 16 AZN. Does not apply to 30-minute sessions.',
    'Только по будням. По студенческому билету 1 час = 16 AZN. Не распространяется на получасовые билеты.',
  ],
  'Qrup endirimi': ['Group Discount', 'Групповая скидка'],
  '10 nəfər və daha çox. Həftəiçi adam başı 16 AZN, həftəsonu 20 AZN.': [
    '10 or more people. 16 AZN per person on weekdays, 20 AZN on weekends.',
    'От 10 человек и более. В будни — 16 AZN с человека, в выходные — 20 AZN.',
  ],
  'Ailə endirimi': ['Family Discount', 'Семейная скидка'],
  'Ailə neçə nəfərdirsə, 1 nəfər pulsuzdur (2+1 və ya 3+1).': [
    '1 family member skates for free regardless of family size (2+1 or 3+1).',
    'Один член семьи проходит бесплатно (2+1 или 3+1).',
  ],
  '5+1 kampaniyası': ['5+1 Campaign', 'Кампания 5+1'],
  'Ən az 6 nəfər olduqda 1 nəfər pulsuz giriş.': [
    'With at least 6 participants, 1 person gets free admission.',
    'При группе от 6 человек 1 участник проходит бесплатно.',
  ],
  'Tətbiqdə premium paketləri olanlar üçün yalnız 1 dəfə 1 saat pulsuz giriş.': [
    'One-time 1-hour free admission for users with premium packages in the app.',
    'Однократный бесплатный вход на 1 час для владельцев премиум-пакетов в приложении.',
  ],
  'Şəhid ailələri': ['Martyrs’ Families', 'Семьи шехидов'],
  'Giriş hər zaman pulsuzdur. Şəhidlik vəsiqəsi qeydiyyat zamanı təsdiq olunmalıdır.': [
    'Admission is always free. Official certificate must be verified at registration.',
    'Вход всегда бесплатный. Удостоверение семьи шехида подтверждается при регистрации.',
  ],
  'Qazilər': ['War Veterans (Ghazis)', 'Ветераны войны (Гази)'],
  'İlk dəfə 1 saat pulsuz, 2-ci səfərdə 50% endirim (10 AZN), qalan səfərlər standart qiymət. Veteranlara şamil olunmur.': [
    'First visit 1 hour free, 2nd visit 50% off (10 AZN), subsequent visits at standard price.',
    'Первое посещение (1 час) — бесплатно, 2-е посещение — скидка 50% (10 AZN), далее — стандартный тариф.',
  ],
  'Aylıq paketlər': ['Monthly Packages', 'Месячные пакеты'],
  '12 giriş (1 saatlıq) = 180 AZN. Öz konkisi ilə = 120 AZN.': [
    '12 entries (1 hour each) = 180 AZN. With own skates = 120 AZN.',
    '12 посещений (по 1 часу) = 180 AZN. Со своими коньками = 120 AZN.',
  ],
  'Qiymətləri hesablamaq üçün bilet səhifəsindən istifadə edin.': [
    'Use the ticket booking page to calculate your exact price.',
    'Используйте страницу покупки билетов для расчёта стоимости.',
  ],

  // ActivitiesPage
  'Buzda hər kəs üçün fəaliyyət': ['Activities on Ice for Everyone', 'Активности на льду для каждого'],
  'Azad sürüşdən peşəkar məşğələlərə qədər - seçim sizindir.': [
    'From open skating to professional coaching — the choice is yours.',
    'От свободного катания до профессиональных тренировок — выбор за вами.',
  ],
  'Açıq konkisürmə': ['Public Skating', 'Массовое катание'],
  'Bütün yaş qrupları üçün azad sürüş seansları. Konki icarəsi qiymətə daxildir.': [
    'Open skating sessions for all age groups. Skate rental is included in the price.',
    'Сеансы свободного катания для всех возрастов. Прокат коньков включён в стоимость.',
  ],
  'Fiqurlu konkisürmə': ['Figure Skating', 'Фигурное катание'],
  'Peşəkar məşqçilərlə fərdi və qrup məşğələləri.': [
    'Individual and group lessons with professional coaches.',
    'Индивидуальные и групповые занятия с профессиональными тренерами.',
  ],
  'Buzüstü xokkey': ['Ice Hockey', 'Хоккей на льду'],
  'Uşaq və həvəskar xokkey komandaları üçün məşqlər və oyunlar.': [
    'Practices and matches for youth and amateur hockey teams.',
    'Тренировки и матчи для детских и любительских хоккейных команд.',
  ],
  'Doğum günləri': ['Birthday Parties', 'Дни рождения'],
  'Doğum gününüzü buz üstündə qeyd edin - xüsusi paketlər mövcuddur.': [
    'Celebrate your birthday on the ice — special packages are available.',
    'Отпразднуйте день рождения на льду — доступны специальные пакеты.',
  ],
  'Məktəb turu': ['School Trips', 'Школьные туры'],
  'Məktəb şagirdləri üçün təşkil olunan kollektiv sürüş seansları.': [
    'Organized group skating sessions for school students.',
    'Организованные коллективные сеансы катания для школьников.',
  ],
  'Ailə günləri': ['Family Days', 'Семейные дни'],
  'Ailə endirimi ilə buzdan birlikdə həzz alın - 1 nəfər pulsuzdur.': [
    'Enjoy the ice together with our family discount — 1 person skates free.',
    'Наслаждайтесь льдом всей семьёй со скидкой — 1 человек бесплатно.',
  ],
  'Məşğələ klubları': ['Training Clubs', 'Спортивные клубы'],
  'Peşəkar məşqçilərlə məşğələlər üçün klublarla birbaşa əlaqə saxlayın.': [
    'Contact the clubs directly for training sessions with professional coaches.',
    'Свяжитесь напрямую с клубами для записи на занятия с профессиональными тренерами.',
  ],
  'Buz idmanı klubu': ['Ice Sports Club', 'Клуб ледового спорта'],
  'Kampaniyalar': ['Promotions & Campaigns', 'Акции и кампании'],
  'Ailə': ['Family', 'Семья'],
  'Ailə endirimi - 1 nəfər pulsuz (2+1 / 3+1)': [
    'Family discount - 1 person free (2+1 / 3+1)',
    'Семейная скидка - 1 человек бесплатно (2+1 / 3+1)',
  ],
  '6 nəfərdən 1 nəfər pulsuz': ['1 person free in groups of 6+', '1 человек бесплатно из 6 участников'],
  'Bazar 10:00 - 12:00 arası': ['Sundays 10:00 - 12:00', 'Воскресенье с 10:00 до 12:00'],
  'Aylıq': ['Monthly', 'Месячный'],
  '12 giriş = 180 AZN, öz konkim ilə = 120 AZN': [
    '12 entries = 180 AZN, with own skates = 120 AZN',
    '12 посещений = 180 AZN, со своими коньками = 120 AZN',
  ],
  'Bütün endirimlər': ['All Discounts', 'Все скидки'],

  // AboutPage
  'Buz Arenası - paytaxtın mərkəzində, Nizami metrosunun yaxınlığında müasir buz idmanı məkanı.': [
    'Ice Arena — a modern ice sports venue in the heart of Baku, near Nizami Metro Station.',
    'Ледовая Арена — современное пространство ледового спорта в центре столицы, рядом с метро Низами.',
  ],
  'Buz arenasında konkisürənlər': ['Skaters at the ice arena', 'Конькобежцы на ледовой арене'],
  'Buz səthi - 4000 m²': ['Ice surface - 4000 m²', 'Площадь льда - 4000 м²'],
  'Heydər Əliyev İdman və Konsert Kompleksinin Buz Arenası həm peşəkar idmançılar, həm də həvəskarlar üçün nəzərdə tutulub. Buz səthimiz fiqurlu konkisürmə, buzüstü xokkey və sürətli konkisürmə üzrə məşğələlər və yarışlar keçirməyə tam uyğundur.': [
    'The Ice Arena of the Heydar Aliyev Sports and Concert Complex is designed for both professional athletes and recreational skaters. Our ice rink is fully equipped for figure skating, ice hockey, and speed skating training and competitions.',
    'Ледовая Арена Спортивно-концертного комплекса имени Гейдара Алиева предназначена как для профессиональных спортсменов, так и для любителей. Наше ледовое покрытие идеально подходит для тренировок и соревнований по фигурному катанию, хоккею и конькобежному спорту.',
  ],
  'Açıq konkisürmə seanslarında hər kəsə konki icarəyə verilir. Bilet alarkən konki razmerinizi qeyd edin - konkilər sizi gözləyəcək.': [
    'Skate rental is provided to everyone during open skating sessions. Specify your skate size when buying a ticket — your skates will be waiting for you.',
    'На сеансах массового катания всем предоставляются коньки напрокат. Укажите свой размер при покупке билета — коньки будут ждать вас.',
  ],
  'Buz açıq olduğu müddətcə arenanın canlı yayımını saytımızdan izləyə və buz üstündəki cari müştəri sayını görə bilərsiniz.': [
    'Whenever the ice is open, you can watch the live stream of the arena on our website and see the current number of skaters on the ice.',
    'Пока лёд открыт, вы можете смотреть прямую трансляцию арены на нашем сайте и видеть текущее количество посетителей на льду.',
  ],
  'Bizimlə əlaqə': ['Contact Us', 'Связаться с нами'],
  'Təhlükəsizlik': ['Safety', 'Безопасность'],
  'Buz səthinin gündəlik yoxlanışı, 4 yaşından aşağı uşaqların girişinin qəti qadağası və peşəkar nəzarət.': [
    'Daily inspection of the ice surface, strict prohibition of entry for children under 4, and professional supervision.',
    'Ежедневная проверка ледового покрытия, строгий запрет на вход детей младше 4 лет и профессиональный контроль.',
  ],
  'Keyfiyyət': ['Quality', 'Качество'],
  'Beynəlxalq standartlara uyğun buz səthi və müasir idman infrastrukturu.': [
    'International-standard ice surface and modern sports infrastructure.',
    'Ледовое покрытие международного стандарта и современная спортивная инфраструктура.',
  ],
  'İctimaiyyət': ['Community', 'Доступность'],
  'Açıq konkisürmədən peşəkar məşğələlərə qədər - buz idmanını hər kəs üçün əlçatan edirik.': [
    'From open public sessions to professional coaching — making ice sports accessible for everyone.',
    'От массового катания до профессиональных тренировок — мы делаем ледовый спорт доступным для каждого.',
  ],

  // ContactPage & Footer
  'Bizi tapmaq asandır': ['Easy to Find Us', 'Нас легко найти'],
  'Nizami metrosunun yaxınlığında, Avropa otelinin yanında.': [
    'Near Nizami Metro Station, next to the Europe Hotel.',
    'Рядом со станцией метро Низами, около отеля Europe.',
  ],
  'Ünvan': ['Address', 'Адрес'],
  'Tbilisi prospekti 12, Bakı': ['12 Tbilisi Avenue, Baku', 'проспект Тбилиси 12, Баку'],
  'Marşrut qur': ['Get Directions', 'Проложить маршрут'],
  'Google Maps-də aç': ['Open in Google Maps', 'Открыть в Google Maps'],
  'Bizə nə vaxt gələ bilərsiniz': ['When You Can Visit Us', 'Когда к нам можно прийти'],
  'İş saatları hər həftə yenilənə bilir.': ['Opening hours may be updated weekly.', 'Часы работы могут обновляться каждую неделю.'],
  'Sürətli keçidlər': ['Quick Links', 'Быстрые ссылки'],
  'Buz idmanının bütün növləri üçün müasir, beynəlxalq standartlara cavab verən buz arenası.': [
    'A modern ice arena meeting international standards for all types of ice sports.',
    'Современная ледовая арена международного стандарта для всех видов ледового спорта.',
  ],
  'Rəsmi məlumatlar': ['Official Information', 'Официальная информация'],
  'Azərbaycan Respublikasının Gənclər və İdman Nazirliyi': [
    'Ministry of Youth and Sports of the Republic of Azerbaijan',
    'Министерство молодёжи и спорта Азербайджанской Республики',
  ],
  '"Heydər Əliyev Adına İdman-Konsert Kompleksi" MMC': [
    '"Heydar Aliyev Sports and Concert Complex" LLC',
    'ООО «Спортивно-концертный комплекс имени Гейдара Алиева»',
  ],
  'Ünvan: AZ-1022 Bakı şəhəri, Tbilisi prospekti 12': [
    'Address: 12 Tbilisi Avenue, Baku AZ-1022',
    'Адрес: AZ-1022, г. Баку, проспект Тбилиси 12',
  ],
  'Ünvan:': ['Address:', 'Адрес:'],
  'AZ-1022 Bakı şəhəri, Tbilisi prospekti 12': [
    '12 Tbilisi Avenue, Baku AZ-1022',
    'AZ-1022, г. Баку, проспект Тбилиси 12',
  ],
  'Tel:': ['Phone:', 'Тел.:'],
  'Email:': ['Email:', 'Эл. почта:'],
  'Heydər Əliyev İdman və Konsert Kompleksi (HƏİKK) - Buz Arenası': [
    'Heydar Aliyev Sports and Concert Complex (HASCC) - Ice Arena',
    'Спортивно-концертный комплекс им. Гейдара Алиева (СКК) - Ледовая Арена',
  ],
  'Avtobus': ['Bus', 'Автобус'],
  'Bus': ['Bus', 'Автобус'],
  'təsdiqlənib': ['confirmed', 'подтверждено'],
  'Xoş gəldiniz,': ['Welcome,', 'Добро пожаловать,'],
  'komanda': ['team', 'команда'],
  'Qeydiyyat tarixi:': ['Registered on:', 'Дата регистрации:'],

  // RulesPage & data/rules.js
  'İstifadə şərtləri, qaydalar və qadağalar': [
    'Terms of Use, Rules & Restrictions',
    'Условия использования, правила и запреты',
  ],
  'Buz Arenasından istifadə etməzdən əvvəl aşağıdakı bəndlərlə mütləq tanış olun. Bütün qaydalar bütün iştirakçılar üçün qüvvədədir.': [
    'Please read the following clauses carefully before using the Ice Arena. All rules apply to every participant.',
    'Пожалуйста, внимательно ознакомьтесь со следующими пунктами перед посещением Ледовой Арены. Все правила обязательны для всех участников.',
  ],
  'Qaydalara əməl etmək mütləqdir': ['Compliance with the Rules is Mandatory', 'Соблюдение правил обязательно'],
  'Buz üzərində hərəkət travmatik idman növü kimi qiymətləndirilir. Yüksək sürət və buz səthinin sürüşkənliyi ucbatından zədə almaq riski mövcuddur — bu səbəbdən aşağıdakı qaydalara əməl etmək hər bir iştirakçı üçün mütləqdir.': [
    'Ice skating is considered a high-injury-risk sport. Due to high speed and the slippery ice surface, there is a risk of injury — therefore, following the rules below is mandatory for every participant.',
    'Движение по льду относится к травмоопасным видам спорта. Из-за высокой скорости и скользкой поверхности льда существует риск получения травм, поэтому соблюдение нижеуказанных правил обязательно для каждого участника.',
  ],
  'Bölmə 1': ['Section 1', 'Раздел 1'],
  'Kompleksin istifadə qaydaları və qadağaları': [
    'Complex Usage Rules & Prohibitions',
    'Правила пользования и запреты комплекса',
  ],
  'Ev heyvanları və alkoqol': ['Pets & Alcohol', 'Домашние животные и алкоголь'],
  'Kompleksin ərazisinə ev heyvanlarının gətirilməsi, spirtli içki qəbulu və ya alkoqol sərxoşluğu ilə kompleksə gəlmək qəti qadağandır. Sərxoş vəziyyətdə olan şəxslər arenaya buraxılmır.': [
    'Bringing pets onto the complex premises, consuming alcoholic beverages, or entering under the influence of alcohol is strictly prohibited. Intoxicated individuals will not be admitted.',
    'Приводить домашних животных на территорию комплекса, употреблять спиртные напитки или приходить в состоянии алкогольного опьянения строго запрещено. Лица в нетрезвом состоянии на арену не допускаются.',
  ],
  'Tütün məmulatları': ['Tobacco Products', 'Табачные изделия'],
  'Kompleks daxilində, o cümlədən buz meydançasının ətrafında siqaret, siqar, həmçinin elektron siqaretlərdən (vape) istifadə qəti qadağandır.': [
    'Smoking cigarettes, cigars, or electronic cigarettes (vapes) inside the complex and around the ice rink is strictly prohibited.',
    'Курение сигарет, сигар, а также электронных сигарет (вейпов) внутри комплекса, включая зону вокруг катка, строго запрещено.',
  ],
  'Qida və içki qəbulu': ['Food & Beverages', 'Еда и напитки'],
  'Meydançada olarkən hər hansı qida məhsulunun və içkinin qəbulu qadağandır. İstehlak məhsulları yalnız müəyyən olunmuş istirahət zonalarında qəbul edilə bilər.': [
    'Consuming any food or drinks while on the ice rink is prohibited. Food and beverages may only be consumed in designated rest areas.',
    'Употребление любой еды и напитков на ледовой площадке запрещено. Продукты питания допускаются только в специально отведённых зонах отдыха.',
  ],
  'Körpələrə nəzarət': ['Child Supervision', 'Присмотр за детьми'],
  'Körpələrin meydançadan kənar ərazilərdə, həmçinin arena daxilində nəzarətsiz buraxılması qəti qadağandır. Uşaqlar hər zaman böyüklərin nəzarəti altında olmalıdır.': [
    'Leaving young children unattended inside the arena or outside the rink area is strictly prohibited. Children must be supervised by adults at all times.',
    'Оставлять маленьких детей без присмотра внутри арены и за пределами катка строго запрещено. Дети должны всегда находиться под присмотром взрослых.',
  ],
  'Qoruyucu baş geyimi': ['Protective Headgear', 'Защитный шлем'],
  '10 yaşından aşağı uşaqların qoruyucu vasitə, yəni baş geyimi olmadan meydançaya daxil olması qəti qadağandır.': [
    'Children under 10 years of age are strictly prohibited from entering the ice rink without protective headgear (helmet).',
    'Вход детей младше 10 лет на ледовую площадку без защитного головного убора (шлема) строго запрещён.',
  ],
  'Konki ilə davranış': ['Skate Etiquette', 'Правила обращения с коньками'],
  'Konkisiz buz üzərindən keçmək, konki bağcıqlarını boş vəziyyətdə saxlamaq və ya konkini meydançadan çıxarmaq qəti qadağandır.': [
    'Walking on the ice without skates, skating with untied laces, or taking rental skates outside the rink area is strictly prohibited.',
    'Выходить на лёд без коньков, кататься с незавязанными шнурками или выносить коньки за пределы площадки строго запрещено.',
  ],
  'Təmizlik və texniki zonalar': ['Cleanliness & Technical Zones', 'Чистота и технические зоны'],
  'İstifadə edilmiş baxillərin (baxıl qutularının) yerə atılması, həmçinin texniki sahələrə və inzibati otaqlara giriş qəti qadağandır.': [
    'Throwing used shoe covers on the floor and entering technical areas or administrative rooms is strictly prohibited.',
    'Бросать использованные бахилы на пол, а также входить в технические помещения и административные кабинеты строго запрещено.',
  ],
  'Meydança girişi': ['Rink Entrance', 'Вход на площадку'],
  'Meydançanın girişində valideynlərin toplaşması və müəyyən olunmuş yerlərdən başqa ərazilərə daxil olmaq qəti qadağandır.': [
    'Crowding by parents at the rink entrance and entering areas other than designated zones is strictly prohibited.',
    'Скопление родителей у входа на каток и проход в не предназначенные для посетителей зоны строго запрещены.',
  ],
  'Alətlər və əmlaka ziyan': ['Sharp Objects & Property Damage', 'Острые предметы и порча имущества'],
  'Arena ərazisinə kəsici və ya deşici alətlərlə daxil olmaq, arena daxilindəki əşyalara və avadanlıqlara zərər vermək qəti qadağandır.': [
    'Entering the arena with sharp or piercing objects and damaging arena property or equipment is strictly prohibited.',
    'Проносить на территорию арены колющие или режущие предметы, а также наносить ущерб имуществу и оборудованию арены строго запрещено.',
  ],
  'Metal əşyalar': ['Metal Accessories', 'Металлические предметы'],
  'Buz meydançasına daxil olarkən sırğa, üzük, qolbaq, saat, boyunbağı və açar kimi metal əşyaların istifadəsi, eləcə də uşaqlar qucaqda olarkən buz üzərinə çıxmaq qəti qadağandır.': [
    'Wearing metal items such as earrings, rings, bracelets, watches, necklaces, or keys on the ice, as well as carrying children in your arms while skating, is strictly prohibited.',
    'Использование металлических предметов (серьги, кольца, браслеты, часы, цепочки, ключи) при выходе на лёд, а также выход на лёд с детьми на руках строго запрещены.',
  ],
  'İşçi heyətinə münasibət': ['Respect for Staff', 'Отношение к персоналу'],
  'İşçilərə qarşı kobud, təhqiredici və qanunsuz rəftar qəti qadağandır. Belə halda şəxs ərazidən uzaqlaşdırılır və bilet ləğv edilir.': [
    'Rude, abusive, or unlawful behavior toward staff is strictly prohibited. Offenders will be removed from the premises and their tickets cancelled.',
    'Грубое, оскорбительное и противоправное поведение по отношению к сотрудникам строго запрещено. В таком случае нарушитель удаляется с территории, а билет аннулируется.',
  ],
  'Əlavə şərtlər': ['Additional Terms', 'Дополнительные условия'],
  'Ödənişin geri qaytarılması': ['Refund Policy', 'Возврат оплаты'],
  'Sessiyanın başlanğıcından 10 dəqiqə ərzində zədə aldığınızda və ya buz üzərində hərəkət edə bilmədiyinizi bildirdiyinizdə ödəniş geri qaytarılır. Bu müddət bitdikdən sonra ödəniş geri qaytarılmır.': [
    'Refunds are only issued if you report an injury or inability to skate within 10 minutes from the start of the session. No refunds are issued after this period.',
    'Оплата возвращается только в случае получения травмы или уведомления о невозможности кататься в течение первых 10 минут сеанса. По истечении этого времени возврат не производится.',
  ],
  'Məsuliyyətin bölüşdürülməsi': ['Liability Disclaimer', 'Разграничение ответственности'],
  'Arena itirilmiş və unudulmuş əşyalara, şəxsi əşyaların şifrə təhlükəsizliyinə, habelə arena ərazisindəki kənar şəxslərin əməllərinə görə məsuliyyət daşımır.': [
    'The Arena is not responsible for lost or forgotten items, personal locker security, or the actions of third parties on the premises.',
    'Арена не несёт ответственности за утерянные и забытые вещи, сохранность паролей личных вещей, а также за действия третьих лиц на территории арены.',
  ],
  'Hərəkət istiqaməti və təlimatlar': ['Skating Direction & Instructions', 'Направление движения и инструкции'],
  'Meydançada yalnız saat əqrəbinin əksi istiqamətində irəliləmək, işçi heyətinin təlimatlarına dəqiq əməl etmək və şübhəli davranış müşahidə etdiyinizdə dərhal mühafizə xidmətinə məlumat vermək vacibdir.': [
    'Skaters must move counter-clockwise only, strictly follow staff instructions, and immediately report any suspicious behavior to security.',
    'На катке необходимо двигаться только против часовой стрелки, строго соблюдать указания персонала и незамедлительно сообщать охране о подозрительном поведении.',
  ],
  'Bölmə 2': ['Section 2', 'Раздел 2'],
  'Müştəri öhdəlikləri və təsdiq': ['Customer Obligations & Confirmation', 'Обязательства клиента и подтверждение'],
  'Aşağıdakı hər bir bəndi oxuyub onu qəbul etdiyinizi bildirin. Bilet alışı zamanı bu öhdəliklərə əməl etməyi öz üzərinizə götürürsünüz.': [
    'Please read and accept each clause below. When purchasing a ticket, you undertake to comply with these obligations.',
    'Прочитайте и отметьте согласие с каждым пунктом ниже. При покупке билета вы обязуетесь соблюдать эти правила.',
  ],
  'Kompleksin təhlükəsizlik tədbirləri, istifadə şərtləri və qayda-qanunları ilə tanış oldum və onlara əməl etməyi öhdəmə götürürəm.': [
    'I have read and agree to comply with the safety measures, terms of use, and rules of the Complex.',
    'Я ознакомился(ась) с мерами безопасности, условиями использования и правилами Комплекса и обязуюсь их соблюдать.',
  ],
  'Özümün və gətirdiyim uşaqların həyatı, sağlamlığı və təhlükəsizliyi üçün bütün məsuliyyəti daşıyıram — hətta işçi heyətinin nəzarəti olmasa belə.': [
    'I assume full responsibility for my own life, health, and safety as well as that of the children accompanying me — even without staff supervision.',
    'Я несу полную ответственность за свою жизнь, здоровье и безопасность, а также за приведённых со мной детей — даже при отсутствии контроля персонала.',
  ],
  'İstənilən halda zədə alacağı təqdirdə işçi heyətinə və kompleksə qarşı heç bir iddia və tələb qaldırmayacağam.': [
    'In the event of any injury, I will not raise any claims or demands against the staff or the Complex.',
    'В случае получения какой-либо травмы я не буду предъявлять претензий и требований к персоналу и Комплексу.',
  ],
  'Arena tərəfindən aparılan video və foto çəkilişlərinə etiraz etmirəm.': [
    'I do not object to video and photo recording conducted by the Arena.',
    'Я не возражаю против видео- и фотосъёмки, проводимой со стороны Арены.',
  ],
  'Bütün öhdəliklər təsdiqləndi': ['All obligations confirmed', 'Все обязательства подтверждены'],
  'Bilet alışı üçün bütün bəndlər təsdiq olunmalıdır': [
    'All clauses must be confirmed to purchase a ticket',
    'Для покупки билета необходимо подтвердить все пункты',
  ],
  'Təsdiq vəziyyəti yüklənir...': ['Loading confirmation status...', 'Загрузка статуса подтверждения...'],
  'Təsdiqlər hesabınızda saxlanılır.': ['Confirmations are saved to your account.', 'Подтверждения сохранены в вашем аккаунте.'],
  'Təsdiqlər bu brauzerdə saxlanılır.': ['Confirmations are saved in this browser.', 'Подтверждения сохранены в этом браузере.'],
  'Təsdiqlər bu brauzerdə saxlanıldı.': ['Confirmations saved in this browser.', 'Подтверждения сохранены в этом браузере.'],
  'Yadda saxlanılır...': ['Saving...', 'Сохранение...'],
  'Yadda saxlanıldı.': ['Saved.', 'Сохранено.'],
  'Bölmə 3': ['Section 3', 'Раздел 3'],

  // BookingPage & BookingWizard
  'Onlayn bilet': ['Online Ticket', 'Онлайн-билет'],
  'Bilet al və konki rezervasiya et': ['Buy Ticket & Reserve Skates', 'Купить билет и забронировать коньки'],
  'Tarixi seçin, iştirakçıların yaşını və konki razmerlərini qeyd edin. Sessiya avtomatik təyin olunur; konki rezervasiyasını arenaya gəldikdə “Biletlərim” bölməsindən aktivləşdirin.': [
    'Select a date and specify each participant’s age and skate size. The session is assigned automatically; activate your skate reservation from “My Tickets” when you arrive at the arena.',
    'Выберите дату, укажите возраст участников и размеры коньков. Сеанс назначается автоматически; активируйте бронь коньков в разделе «Мои билеты» по прибытии на арену.',
  ],
  '18 yaşdan kiçik şəxslər bilet ala bilməz': [
    'Persons under 18 cannot purchase tickets online',
    'Лица младше 18 лет не могут покупать билеты онлайн',
  ],
  'Hesabınızda qeyd olunan yaş 18-dən kiçikdir. Bu səbəbdən onlayn bilet satışı və konki rezervasiyası əlçatan deyil. Arenaya giriş qaydaları ilə tanış ola bilərsiniz.': [
    'The age registered on your account is under 18. Therefore, online ticket purchase and skate reservation are unavailable. You may review the arena entry rules.',
    'Возраст, указанный в вашем аккаунте, меньше 18 лет. В связи с этим онлайн-покупка билетов и бронирование коньков недоступны. Вы можете ознакомиться с правилами входа на арену.',
  ],
  '18+ yaş və şəxsiyyət vəsiqəsi tələbi': [
    '18+ Age & ID Card Requirement',
    'Требование 18+ и удостоверения личности',
  ],
  '18+ yaş və şəxsiyyət vəsiqəsi tələbi (Yalnız ilk biletdə)': [
    '18+ Age & ID Card Requirement',
    'Требование 18+ и удостоверения личности',
  ],
  '18 yaşdan kiçik şəxslərə onlayn bilet satışı qadağandır. İlk bilet alışınızda yaşınızın 18+ olduğunu və şəxsiyyət vəsiqənizi bir dəfə təsdiqləməyiniz kifayətdir; növbəti biletlərdə təkrar soruşulmayacaq.': [
    'Online ticket sales to persons under 18 are prohibited. You only need to confirm your 18+ age and ID card once on your first ticket purchase; it will not be asked again on future tickets.',
    'Онлайн-продажа билетов лицам младше 18 лет запрещена. При первой покупке билета достаточно один раз подтвердить возраст 18+ и удостоверение личности; при следующих покупках повторное подтверждение не потребуется.',
  ],
  'Sessiya': ['Session', 'Сеанс'],
  'İştirakçılar': ['Participants', 'Участники'],
  'Bilet': ['Ticket', 'Билет'],
  'Tarix seçin': ['Select Date', 'Выберите дату'],
  'Seanslar yüklənir…': ['Loading sessions…', 'Загрузка сеансов…'],
  'Yenidən cəhd et': ['Try Again', 'Повторить попытку'],
  'Bu tarix üçün seans yoxdur.': ['No sessions available for this date.', 'На эту дату сеансов нет.'],
  'Yenilə': ['Refresh', 'Обновить'],
  'Vaxt və müddət': ['Time & Duration', 'Время и длительность'],
  'Nəfər sayı': ['Number of People', 'Количество человек'],
  'Sessiya avtomatik təyin olunur': ['Session is Assigned Automatically', 'Сеанс назначается автоматически'],
  'Başlama vaxtı seçilmir. Seçdiyiniz tarix və bilet müddəti üçün arenanın aktiv sessiyası sistem tərəfindən avtomatik tapılır.': [
    'Start time is not selected manually. The system automatically finds the active arena session for your chosen date and ticket duration.',
    'Время начала не выбирается вручную. Система автоматически подбирает активный сеанс арены для выбранной даты и длительности билета.',
  ],
  'Giriş vaxtı:': ['Entry time:', 'Время входа:'],
  'Davam et': ['Continue', 'Продолжить'],
  'Geri': ['Back', 'Назад'],
  'Konki stoku yüklənir…': ['Loading skate stock…', 'Загрузка запаса коньков…'],
  'Yaş 4-dən aşağı olmamalıdır. Hər kəs üçün konki ölçüsünü (razmer) qeyd edin.': [
    'Age must not be under 4. Select a skate size for each participant.',
    'Возраст не должен быть меньше 4 лет. Укажите размер коньков для каждого участника.',
  ],
  'Ad və soyad': ['Full Name', 'Имя и фамилия'],
  'Ad və soyad yazın': ['Enter full name', 'Введите имя и фамилию'],
  'Yaş*': ['Age*', 'Возраст*'],
  'Ölçü*': ['Size*', 'Размер*'],
  'Konki razmeri*': ['Skate Size*', 'Размер коньков*'],
  'Seçin': ['Select', 'Выбрать'],
  'Yüklənir…': ['Loading…', 'Загрузка…'],
  'Əlçatmır': ['Unavailable', 'Недоступно'],
  '4 yaşından kiçik uşaqlar üçün bilet mümkün deyil.': [
    'Tickets are not available for children under 4 years old.',
    'Билеты для детей младше 4 лет недоступны.',
  ],
  'Təsdiq edirəm ki, bütün iştirakçılar 4 yaşdan böyükdür və 4 yaşından kiçik uşaqların buza girişinin qadağan olduğunu bilirəm.': [
    'I confirm that all participants are 4 years of age or older and I understand that children under 4 are prohibited from entering the ice.',
    'Подтверждаю, что все участники старше 4 лет, и мне известно, что вход детей младше 4 лет на лёд запрещён.',
  ],
  'Endirimlər avtomatik tətbiq olunur': ['Discounts Are Applied Automatically', 'Скидки применяются автоматически'],
  'Qrup (10+ nəfər) və 5+1 endirimləri seçim tələb etmir. Sistem eyni anda yalnız müştəri üçün ən sərfəli endirimi seçir.': [
    'Group (10+ people) and 5+1 discounts require no manual selection. The system automatically applies the best single discount for the customer.',
    'Групповая (10+ человек) и скидка 5+1 не требуют ручного выбора. Система автоматически выбирает наиболее выгодную скидку для клиента.',
  ],
  '6 nəfərdən başlayır': ['Starts from 6 people', 'От 6 человек'],
  '10 nəfərdən başlayır': ['Starts from 10 people', 'От 10 человек'],
  'Yalnız 1 saatlıq biletlərə': ['1-hour tickets only', 'Только для часовых билетов'],
  'Sosial güzəşt hüququnuz var?': ['Eligible for a Social Discount?', 'Есть право на социальную льготу?'],
  'Yalnız sizə aid olan güzəştləri qeyd edin. Təsdiq sənədləri girişdə tələb oluna bilər.': [
    'Select only the benefits that apply to you. Supporting documents may be requested at the entrance.',
    'Отмечайте только те льготы, которые относятся к вам. Подтверждающие документы могут потребоваться на входе.',
  ],
  'Tələbə': ['Student', 'Студент'],
  'Həftəiçi 1 saatlıq biletə 20%': ['20% off weekday 1-hour ticket', '20% на часовой билет в будни'],
  '2+ nəfər olduqda 1 nəfər pulsuz': ['1 person free for 2+ family members', '1 человек бесплатно при 2+ участниках'],
  'Premium paket — 1 saatlıq 1 pulsuz giriş': ['Premium package — 1 free 1-hour entry', 'Премиум-пакет — 1 бесплатный вход на 1 час'],
  'Qazi': ['War Veteran (Ghazi)', 'Ветеран (Гази)'],
  'İlk giriş pulsuz, 2-ci giriş 50%': ['1st entry free, 2nd entry 50% off', '1-й вход бесплатно, 2-й вход -50%'],
  'Şəhid ailəsi': ['Martyr’s Family', 'Семья шехида'],
  'Təsdiqlənmiş ailə üçün pulsuz giriş': ['Free entry for verified family', 'Бесплатный вход для подтверждённой семьи'],
  'Şəhidlik vəsiqəsi qeydiyyatda təsdiq olunub. Bu sənəd girişdə də tələb olunur.': [
    'Martyr family certificate is verified at registration and required at the entrance.',
    'Удостоверение семьи шехида подтверждено при регистрации и требуется при входе.',
  ],
  'Bu sənədki gəlişlər sayı:': ['Number of visits with this ID:', 'Количество посещений по документу:'],
  'İlk giriş (pulsuz)': ['1st visit (free)', '1-е посещение (бесплатно)'],
  '2-ci giriş (50% endirim)': ['2nd visit (50% off)', '2-е посещение (скидка 50%)'],
  '3+ (standart)': ['3+ (standard)', '3+ (стандарт)'],
  'Sifariş yekunu': ['Order Summary', 'Итог заказа'],
  'Tarix': ['Date', 'Дата'],
  'Vaxt': ['Time', 'Время'],
  'Nəfər': ['People', 'Человек'],
  'Orijinal məbləğ': ['Original Amount', 'Исходная сумма'],
  'Vahid qiymət': ['Unit Price', 'Цена за билет'],
  'Pulsuz': ['Free', 'Бесплатно'],
  'Endirim': ['Discount', 'Скидка'],
  'Hesablama': ['Breakdown', 'Расчёт'],
  'Qiymət yoxlanılır…': ['Checking price…', 'Проверка цены…'],
  'Ödəniləcək': ['Total Payable', 'К оплате'],
  'Ödəniş emal olunur…': ['Processing payment…', 'Обработка оплаты…'],
  'Pulsuz bileti al': ['Get Free Ticket', 'Получить бесплатный билет'],
  'Ödəniş et və bilet al': ['Pay & Get Ticket', 'Оплатить и получить билет'],
  'Faiz endirimləri yalnız 1 saatlıq biletlər üçün keçərlidir.': [
    'Percentage discounts apply only to 1-hour tickets.',
    'Процентные скидки действуют только на часовые билеты.',
  ],
  'Qrup və 5+1 endirimləri iştirakçı sayına görə avtomatik tətbiq olunur.': [
    'Group and 5+1 discounts are applied automatically based on participant count.',
    'Групповая скидка и акция 5+1 применяются автоматически по числу участников.',
  ],
  'Eyni anda yalnız 1 endirim tətbiq oluna bilər.': [
    'Only 1 discount can be applied at a time.',
    'Одновременно может быть применена только 1 скидка.',
  ],
  'İstifadə şərtlərini, qayda və qadağaları, habelə müştəri öhdəliklərini oxudum, onlara əməl etməyi öz üzərimə götürürəm.': [
    'I have read the terms of use, rules and restrictions, and customer obligations, and I agree to comply with them.',
    'Я прочитал(а) условия использования, правила и запреты, а также обязательства клиента и обязуюсь их соблюдать.',
  ],
  'Ətraflı oxu': ['Read More', 'Подробнее'],
  '18+ yaş və şəxsiyyət vəsiqəsinin təsdiqi': [
    '18+ Age & ID Card Confirmation',
    'Подтверждение возраста 18+ и удостоверения личности',
  ],
  '18+ yaş və şəxsiyyət vəsiqəsinin təsdiqi (Yalnız ilk biletdə)': [
    '18+ Age & ID Card Confirmation',
    'Подтверждение возраста 18+ и удостоверения личности',
  ],
  '18+ bilet alışı üçün məlumatlarınızı bir dəfə təsdiqləyin. Növbəti bilet alışlarında bu təsdiq təkrar tələb olunmayacaq.': [
    'Confirm your details once for 18+ ticket purchase. This confirmation will not be required again for future tickets.',
    'Подтвердите данные один раз для покупки билета (18+). При следующих покупках повторное подтверждение не потребуется.',
  ],
  'Doğum tarixiniz (18+ tələbi)': ['Your Date of Birth (18+ requirement)', 'Дата вашего рождения (требование 18+)'],
  'Şəxsiyyət vəsiqəsinin seriya və nömrəsi': ['ID Card Series & Number', 'Серия и номер удостоверения личности'],
  '18 yaşımdan böyük olduğumu, şəxsiyyət vəsiqəmi təqdim edəcəyimi və qeyd etdiyim məlumatların doğru olduğunu təsdiq edirəm.': [
    'I confirm that I am over 18 years old, will present my ID card, and that the information provided is accurate.',
    'Подтверждаю, что мне исполнилось 18 лет, я предъявлю удостоверение личности и указанные данные верны.',
  ],
  'Konki rezervasiyasını nə vaxt aktivləşdirməliyəm?': [
    'When Should I Activate My Skate Reservation?',
    'Когда нужно активировать бронь коньков?',
  ],
  'Konki rezervasiyası necə işləyir?': [
    'How Does Skate Reservation Work?',
    'Как работает бронирование коньков?',
  ],
  'Ödənişdən sonra biletiniz qüvvəyə minir, amma konki stoku hələ tutulmur.': [
    'After payment, your ticket becomes valid, but skate stock is not held yet.',
    'После оплаты ваш билет вступает в силу, но коньки ещё не списываются со склада.',
  ],
  'Arenaya gəldiyiniz an "Biletlərim" bölməsindən taymeri aktivləşdirin. Konkilər yalnız o zaman stokdan çıxılır.': [
    'When you arrive at the arena, activate the timer from “My Tickets”. Skates are deducted from stock only at that moment.',
    'По прибытии на арену активируйте таймер в разделе «Мои билеты». Коньки резервируются со склада только в этот момент.',
  ],
  'Taymer 10 dəqiqədir. Konki təhvil verilməzsə, stok avtomatik geri qaytarılır. Maksimum 2 aktivləşdirmə cəhdi var.': [
    'The timer runs for 10 minutes. If skates are not handed over, stock is automatically restored. Maximum 2 activation attempts allowed.',
    'Таймер рассчитан на 10 минут. Если коньки не будут выданы, запас автоматически возвращается на склад. Доступно максимум 2 попытки активации.',
  ],
  'Biletiniz hazırlanır...': ['Preparing your ticket...', 'Ваш билет подготавливается...'],
  'Rəqəmsal bilet / Digital Ticket': ['Digital Ticket', 'Цифровой билет'],
  'Təsdiqləndi': ['Confirmed', 'Подтверждено'],
  'Ödəniş təsdiqləndi': ['Payment confirmed', 'Оплата подтверждена'],
  'Pulsuz giriş': ['Free admission', 'Бесплатный вход'],
  'İştirakçılar və konki razmerləri': ['Participants & Skate Sizes', 'Участники и размеры коньков'],
  'Giriş üçün bu çeki girişdə işçiyə göstərin. QR kod yalnız bir dəfə skan edilir.': [
    'Show this voucher to the staff at the entrance. The QR code can only be scanned once.',
    'Покажите этот билет сотруднику на входе. QR-код сканируется только один раз.',
  ],
  'Çap et': ['Print', 'Печать'],

  // PaymentModal
  'Təhlükəsiz ödəniş': ['Secure Payment', 'Безопасная оплата'],
  'Ödənişi tamamlayın': ['Complete Payment', 'Завершите оплату'],
  '. Bu demo ödənişdir — real kart məlumatı daxil etməyin.': [
    '. This is a demo payment — do not enter real card details.',
    '. Это демо-оплата — не вводите данные реальной карты.',
  ],
  'Ödəniləcək məbləğ:': ['Amount due:', 'Сумма к оплате:'],
  'Kart sahibi': ['Cardholder', 'Владелец карты'],
  'Kart nömrəsi': ['Card Number', 'Номер карты'],
  'Kart sahibinin adı': ['Cardholder Name', 'Имя владельца карты'],
  'Son istifadə': ['Expiry Date', 'Срок действия'],
  'Demo kartı doldur': ['Autofill Demo Card', 'Заполнить демо-карту'],
  'Ödəniş qaydaları': ['Payment Rules', 'Правила оплаты'],
  'Ödəniş yoxlanılır…': ['Verifying payment…', 'Проверка оплаты…'],
  'Ləğv et': ['Cancel', 'Отмена'],
  'Bağla': ['Close', 'Закрыть'],

  // AuthModal (Login / Register / Forgot Password)
  'Şəxsi kabinet': ['Personal Cabinet', 'Личный кабинет'],
  'Hesabınıza daxil olun': ['Sign In to Your Account', 'Войдите в свой аккаунт'],
  'Yeni hesab yaradın': ['Create a New Account', 'Создать новый аккаунт'],
  'Şifrənin bərpası': ['Password Recovery', 'Восстановление пароля'],
  'Bilet və konki rezervasiyası üçün hesabınız təsdiqlənəcək.': [
    'Your account will be used for ticket booking and skate reservation.',
    'Ваш аккаунт будет использоваться для покупки билетов и бронирования коньков.',
  ],
  'Gmail ünvanınıza və ya telefon nömrənizə gələn təsdiq kodu ilə şifrənizi yeniləyin.': [
    'Reset your password using the verification code sent to your Gmail address or phone number.',
    'Обновите пароль с помощью кода подтверждения, отправленного на ваш Gmail или номер телефона.',
  ],
  'İstifadəçi adı': ['Username', 'Имя пользователя'],
  'Şifrə': ['Password', 'Пароль'],
  'Şifrə (min. 6 simvol)': ['Password (min. 6 characters)', 'Пароль (мин. 6 символов)'],
  'Şifrəmi unutdum?': ['Forgot password?', 'Забыли пароль?'],
  'Yoxlanılır…': ['Checking…', 'Проверка…'],
  'Ad': ['First Name', 'Имя'],
  'Soyad': ['Last Name', 'Фамилия'],
  'Gmail / E-poçt': ['Gmail / Email', 'Gmail / Эл. почта'],
  'Doğum tarixi': ['Date of Birth', 'Дата рождения'],
  'Telefon nömrəsi': ['Phone Number', 'Номер телефона'],
  'Qeydiyyat aparılır…': ['Registering…', 'Регистрация…'],
  'Bərpa üsulunu seçin': ['Select Recovery Method', 'Выберите способ восстановления'],
  '✉️ Gmail / E-poçt ilə': ['✉️ Via Gmail / Email', '✉️ Через Gmail / Почту'],
  '📱 Telefon nömrəsi ilə': ['📱 Via Phone Number', '📱 По номеру телефона'],
  'Gmail / E-poçt ünvanınız': ['Your Gmail / Email Address', 'Ваш адрес Gmail / Эл. почты'],
  'Qeydiyyatda olan telefon nömrəniz': ['Your Registered Phone Number', 'Зарегистрированный номер телефона'],
  'Göndərilir…': ['Sending…', 'Отправка…'],
  'Gmail-ə təsdiq kodu göndər': ['Send Verification Code to Gmail', 'Отправить код на Gmail'],
  'Nömrəyə SMS kod göndər': ['Send SMS Code to Phone', 'Отправить SMS-код на номер'],
  '← Giriş ekranına qayıt': ['← Back to Sign In', '← Вернуться ко входу'],
  'Gələn mesaj kodu:': ['Received code:', 'Полученный код:'],
  'Kodu daxil et': ['Autofill Code', 'Вставить код'],
  '6 rəqəmli təsdiq kodu': ['6-Digit Verification Code', '6-значный код подтверждения'],
  'Yeni şifrə (min. 6 simvol)': ['New Password (min. 6 characters)', 'Новый пароль (мин. 6 символов)'],
  'Yeni şifrə': ['New Password', 'Новый пароль'],
  'Yeni şifrənin təkrarı': ['Confirm New Password', 'Повторите новый пароль'],
  'Yenilənir…': ['Updating…', 'Обновление…'],
  'Şifrəni yenilə və daxil ol': ['Reset Password & Sign In', 'Обновить пароль и войти'],
  '← Yenidən kod göndər': ['← Resend Code', '← Отправить код повторно'],
  'Girişə qayıt': ['Back to Sign In', 'Вернуться ко входу'],
  'Demo ilə daxil ol →': ['Sign in with Demo →', 'Войти через демо →'],

  // AccountPage (/hesabim)
  'İstifadəçi məlumatlarınızı, doğum tarixinizi, təhlükəsizlik şifrənizi və görünüş seçimlərinizi buradan idarə edin.': [
    'Manage your profile details, date of birth, security password, and display preferences here.',
    'Управляйте личными данными, датой рождения, паролем безопасности и настройками отображения сайта.',
  ],
  'Hesab məlumatları yüklənir...': ['Loading account details...', 'Загрузка данных аккаунта...'],
  'Müştəri hesabı': ['Customer Account', 'Аккаунт клиента'],
  '18+ Yetkin': ['18+ Adult', '18+ Взрослый'],
  '18 yaşdan kiçik': ['Under 18', 'Младше 18 лет'],
  'İstifadəçi adı:': ['Username:', 'Имя пользователя:'],
  'Gmail / E-poçt:': ['Gmail / Email:', 'Gmail / Почта:'],
  'Doğum tarixi:': ['Date of Birth:', 'Дата рождения:'],
  '✓ Kopyalandı': ['✓ Copied', '✓ Скопировано'],
  'Kopyalamaq üçün üzərinə klikləyin': ['Click to copy', 'Нажмите, чтобы скопировать'],
  'Aktiv bilet': ['Active Tickets', 'Активные билеты'],
  'İstifadə olunub': ['Used', 'Использовано'],
  'Cəmi bilet': ['Total Tickets', 'Всего билетов'],
  'Profil məlumatları': ['Profile Information', 'Данные профиля'],
  'Şəxsi məlumatlarım': ['My Personal Details', 'Мои личные данные'],
  'İstifadəçi adı (Username)': ['Username', 'Имя пользователя (Username)'],
  'Üzərinə basdıqda kopyalanır (dəyişdirilmir).': [
    'Click to copy (cannot be changed).',
    'Нажмите для копирования (не изменяется).',
  ],
  'Gmail / E-poçt ünvanı': ['Gmail / Email Address', 'Адрес Gmail / Эл. почты'],
  'Adınız': ['Your first name', 'Ваше имя'],
  'Soyadınız': ['Your last name', 'Ваша фамилия'],
  'Bilet qaydaları və yaş kateqoriyası üçün istifadə olunur.': [
    'Used for ticket rules and age verification.',
    'Используется для правил покупки билетов и возрастной категории.',
  ],
  'Məlumatları yadda saxla': ['Save Changes', 'Сохранить данные'],
  'Profil məlumatlarınız uğurla yeniləndi.': [
    'Your profile details have been updated successfully.',
    'Данные вашего профиля успешно обновлены.',
  ],
  'Şifrəni dəyişdir': ['Change Password', 'Изменить пароль'],
  'Şifrələri gizlət': ['Hide Passwords', 'Скрыть пароли'],
  'Şifrələri göstər': ['Show Passwords', 'Показать пароли'],
  'Cari şifrə': ['Current Password', 'Текущий пароль'],
  'Hazırkı şifrənizi daxil edin': ['Enter your current password', 'Введите текущий пароль'],
  'Ən azı 6 simvol': ['At least 6 characters', 'Минимум 6 символов'],
  'Yeni şifrəni təkrar yazın': ['Re-enter new password', 'Повторите новый пароль'],
  'Şifrəni yenilə': ['Update Password', 'Обновить пароль'],
  'Yenilənir...': ['Updating...', 'Обновление...'],
  'Görünüş və Effektlər': ['Appearance & Effects', 'Внешний вид и эффекты'],
  'Sayt tənzimləmələri': ['Site Settings', 'Настройки сайта'],
  'Sayt dili': ['Site Language', 'Язык сайта'],
  'İnterfeys dilini seçin (Azərbaycan, İngilis və ya Rus dili).': [
    'Choose the interface language (Azerbaijani, English, or Russian).',
    'Выберите язык интерфейса (азербайджанский, английский или русский).',
  ],
  'Qar animasiyası': ['Snowfall Animation', 'Анимация снега'],
  'Açıq': ['On', 'Вкл'],
  'Bağlı': ['Off', 'Выкл'],
  'Sayt boyu arxa planda yağan qar dənəcikləri effektini istədiyiniz vaxt aça və ya bağlaya bilərsiniz.': [
    'You can turn the background snowfall effect on or off across the website at any time.',
    'Вы можете в любой момент включить или выключить эффект падающего снега на фоне сайта.',
  ],
  'Qar effektini aç': ['Turn On Snow', 'Включить снег'],
  'Qar effektini bağla': ['Turn Off Snow', 'Выключить снег'],
  'Doğrulama və Qaydalar': ['Verification & Rules', 'Верификация и правила'],
  'Hesab təsdiq statusu': ['Account Verification Status', 'Статус подтверждения аккаунта'],
  'Doğum tarixi və yaş təsdiqi': ['Date of Birth & Age Verification', 'Дата рождения и подтверждение возраста'],
  'Doğum tarixi hələ daxil edilməyib': ['Date of birth not entered yet', 'Дата рождения ещё не указана'],
  'Təsdiqlənib': ['Verified', 'Подтверждено'],
  'Gözləyir': ['Pending', 'Ожидает'],
  'Şəxsiyyət vəsiqəsi': ['ID Card', 'Удостоверение личности'],
  'Onlayn bilet alışı üçün vəsiqə təsdiqi': ['ID verification for online ticket purchase', 'Подтверждение документа для онлайн-билетов'],
  'Təsdiqlənməyib': ['Not Verified', 'Не подтверждено'],
  'Təsdiqlə': ['Confirm', 'Подтвердить'],
  'Arena təhlükəsizlik qaydaları': ['Arena Safety Rules', 'Правила безопасности арены'],
  'Qaydalarla tanış olub təsdiqləyə bilərsiniz': ['Review and accept the arena rules', 'Ознакомьтесь и подтвердите правила арены'],
  'Qaydalara bax': ['View Rules', 'Смотреть правила'],
  'Sürətli əməliyyatlar': ['Quick Actions', 'Быстрые действия'],
  'Qeyd edilməyib': ['Not specified', 'Не указано'],

  // MyTicketsPage (/biletlerim)
  'Müştəri paneli': ['Customer Panel', 'Панель клиента'],
  'Keçmiş və aktiv biletləriniz, QR kodlarınız və konki rezervasiyasının əl ilə aktivləşdirilməsi.': [
    'Your active and past tickets, QR codes, and manual skate reservation activation.',
    'Ваши активные и прошлые билеты, QR-коды и ручная активация брони коньков.',
  ],
  'Aktiv biletlər': ['Active Tickets', 'Активные билеты'],
  'Keçmiş biletlər': ['Past Tickets', 'Прошлые билеты'],
  'Hamısı': ['All', 'Все'],
  'Biletlər yüklənir…': ['Loading tickets…', 'Загрузка билетов…'],
  'Bu bölmədə bilet yoxdur': ['No tickets in this section', 'В этом разделе нет билетов'],
  'Yeni bilet aldıqdan sonra o, avtomatik olaraq burada görünəcək.': [
    'Once you purchase a new ticket, it will automatically appear here.',
    'После покупки нового билета он автоматически появится здесь.',
  ],
  'Kassa bileti': ['POS Ticket', 'Кассовый билет'],
  'İştirakçı': ['Participants', 'Участники'],
  'Konki razmeri': ['Skate Size', 'Размер коньков'],
  'Aktivləşdirmə cəhdi': ['Activation Attempts', 'Попытки активации'],
  'Konki rezervasiyası aktivdir': ['Skate Reservation is Active', 'Бронь коньков активна'],
  'Könüllü heyəti konkilərinizi hazırlayır. Taymer bitərsə stok avtomatik geri qaytarılır.': [
    'The volunteer team is preparing your skates. If the timer expires, stock is automatically returned.',
    'Команда волонтёров готовит ваши коньки. Если таймер истечёт, запас автоматически вернётся на склад.',
  ],
  'Konki təhvil verilib. Bu bilet üçün aktivləşdirmə artıq bağlıdır.': [
    'Skates have been handed over. Activation is now closed for this ticket.',
    'Коньки выданы. Активация для этого билета закрыта.',
  ],
  'Aktivləşdirilir…': ['Activating…', 'Активация…'],
  'Rezervasiyanı aktivləşdirmək üçün arenaya yaxınlaşdıqda düyməni basın.': [
    'Press the button when you arrive at the arena to activate your skate reservation.',
    'Нажмите кнопку при подходе к арене, чтобы активировать бронь коньков.',
  ],
  'Bu bilet üçün 2 aktivləşdirmə cəhdi istifadə olunub.': [
    'All 2 activation attempts for this ticket have been used.',
    'Для этого билета использованы все 2 попытки активации.',
  ],
  'Konki rezervasiyası aktivləşdirildi. Könüllü heyəti konkilərinizi hazırlayacaq.': [
    'Skate reservation activated. The volunteer team will prepare your skates.',
    'Бронь коньков активирована. Волонтёры подготовят ваши коньки.',
  ],

  // Admin & Staff Layout + Sidebar + Staff Navbar
  'İdarəetmə paneli': ['Management Panel', 'Панель управления'],
  'İdarəetmə mərkəzi': ['Control Center', 'Центр управления'],
  'Canlı sistem': ['Live System', 'Система активна'],
  'Administrator': ['Administrator', 'Администратор'],
  'Koordinator': ['Coordinator', 'Координатор'],
  'Kassir': ['Cashier', 'Кассир'],
  'Könüllü': ['Volunteer', 'Волонтёр'],
  'İstifadəçi': ['User', 'Пользователь'],
  'Administrasiya': ['Administration', 'Администрация'],
  'Canlı analitika': ['Live Analytics', 'Живая аналитика'],
  'Əməkdaşlar': ['Staff Members', 'Сотрудники'],
  'Rol yüksəltmə': ['Role Management', 'Управление ролями'],
  'Sessiyalar': ['Sessions', 'Сеансы'],
  'Bilet limitləri': ['Ticket Limits', 'Лимиты билетов'],
  'Konki anbarı': ['Skate Inventory', 'Склад коньков'],
  'Stok və zədə': ['Stock & Damage', 'Запас и списание'],
  'Maliyyə': ['Finance', 'Финансы'],
  'Onlayn ödənişlər': ['Online Payments', 'Онлайн-платежи'],
  'Smenlər və könüllülər': ['Shifts & Volunteers', 'Смены и волонтёры'],
  'Könüllü smenləri': ['Volunteer Shifts', 'Смены волонтёров'],
  'Canlı stansiyalar': ['Live Stations', 'Активные позиции'],
  'Smen planlayıcısı': ['Shift Planner', 'Планировщик смен'],
  'Günlük slotlar': ['Daily Slots', 'Дневные слоты'],
  'Konki təhvili': ['Skate Handover', 'Выдача коньков'],
  'Rezervasiyalar': ['Reservations', 'Бронирования'],
  'Ölçü üzrə canlı': ['Live by Size', 'Запас по размерам'],
  'Mənim smenlərim': ['My Shifts', 'Мои смены'],
  'Smen seçimi': ['Shift Selection', 'Выбор смены'],
  'Əməliyyatlar': ['Operations', 'Операции'],
  'Kassir POS': ['Cashier POS', 'Касса POS'],
  'Yerində satış': ['On-site Sales', 'Продажа на месте'],
  'Turniket': ['Turnstile', 'Турникет'],
  'QR doğrulama': ['QR Verification', 'Проверка QR'],
  'Kassa QR': ['Cashier QR', 'Касса QR'],
  'Bilet məlumatları': ['Ticket Details', 'Данные билета'],
  'Buzdakı müştərilər': ['Skaters on Ice', 'Клиенты на льду'],
  'Giriş və çıxış saatları': ['Entry & Exit Times', 'Время входа и выхода'],
  'Smenlər': ['Shifts', 'Смены'],
  'Anbar': ['Inventory', 'Склад'],

  // AdminDashboardPage
  'Günlük gəlir, seans doluluğu, ödəniş vəziyyəti və anbar siqnalları bir ekranda.': [
    'Daily revenue, session occupancy, payment status, and inventory alerts on one screen.',
    'Дневная выручка, заполняемость сеансов, статус платежей и сигналы склада на одном экране.',
  ],
  'Bugünkü gəlir': ['Today’s Revenue', 'Выручка за сегодня'],
  'Seans doluluğu': ['Session Occupancy', 'Заполняемость сеансов'],
  'Bugünkü rezervasiya': ['Today’s Reservations', 'Бронирования сегодня'],
  'Diqqət tələb edən ölçü': ['Sizes needing attention', 'Размеры, требующие внимания'],
  'Onlayn gəlir': ['Online Revenue', 'Онлайн-выручка'],
  'Ödəniş gateway': ['Payment gateway', 'Платёжный шлюз'],
  'Kassir gəliri': ['Cashier Revenue', 'Выручка кассы'],
  'POS satışları': ['POS sales', 'Продажи POS'],
  'Gözləyən ödəniş': ['Pending Payments', 'Ожидающие платежи'],
  'Giriş qeydə alınıb': ['Checked-In Tickets', 'Подтверждённые входы'],
  'Turniket QR scan': ['Turnstile QR scan', 'Сканирование на турникете'],
  'Bu günün seansları': ['Today’s Sessions', 'Сеансы на сегодня'],
  'Bu gün üçün seans yoxdur.': ['No sessions for today.', 'На сегодня сеансов нет.'],
  'Blok': ['Blocked', 'Блок'],
  'Aktiv': ['Active', 'Активен'],
  'Son 7 gün gəliri': ['Last 7 Days Revenue', 'Выручка за последние 7 дней'],
  'Anbar xəbərdarlıqları': ['Inventory Alerts', 'Предупреждения склада'],
  'Bütün ölçülərdə stok normaldır.': ['Stock levels are normal across all sizes.', 'Запас во всех размерах в норме.'],
  'Kritik': ['Critical', 'Критический'],
  'Azalır': ['Low', 'Мало'],
  'Zədəli': ['Damaged', 'Повреждено'],

  // StaffManagementPage & StaffCreateForm
  'Əməkdaş idarəetməsi': ['Staff Management', 'Управление персоналом'],
  'Könüllü, kassir və koordinatorlar': ['Volunteers, Cashiers & Coordinators', 'Волонтёры, кассиры и координаторы'],
  'Limitsiz əməkdaş hesabı yaradın və mövcud əməkdaşın rolunu bir kliklə yüksəldin. Bütün dəyişikliklər dərhal JWT səlahiyyətlərinə tətbiq olunur.': [
    'Create unlimited staff accounts and upgrade existing staff roles with one click. All changes take effect immediately.',
    'Создавайте неограниченное количество аккаунтов сотрудников и меняйте их роли в один клик. Все изменения применяются мгновенно.',
  ],
  'Formanı bağla': ['Close Form', 'Закрыть форму'],
  '+ Yeni əməkdaş': ['+ New Staff Member', '+ Новый сотрудник'],
  'aktiv əməkdaş': ['active staff', 'активных сотрудников'],
  'Ad, istifadəçi adı və ya e-poçt...': ['Name, username, or email...', 'Имя, логин или эл. почта...'],
  'Yüklənir...': ['Loading...', 'Загрузка...'],
  'Əməkdaş tapılmadı.': ['No staff members found.', 'Сотрудники не найдены.'],
  'Əməkdaş rolu': ['Staff Role', 'Роль сотрудника'],
  'Yeni əməkdaş hesabı': ['New Staff Account', 'Новый аккаунт сотрудника'],
  'Hesab yaradıldıqdan sonra rolu istənilən vaxt yüksəldə bilərsiniz.': [
    'You can change or upgrade the staff member’s role at any time after creation.',
    'После создания аккаунта вы сможете изменить роль сотрудника в любое время.',
  ],
  'E-poçt': ['Email', 'Эл. почта'],
  'Telefon': ['Phone', 'Телефон'],
  'Yaradılır...': ['Creating...', 'Создание...'],
  'Hesabı yarat': ['Create Account', 'Создать аккаунт'],

  // SessionManagementPage
  'Seans idarəetməsi': ['Session Management', 'Управление сеансами'],
  'İş saatları və bilet limitləri': ['Operating Hours & Ticket Limits', 'Часы работы и лимиты билетов'],
  'Günlük sessiyaları yaradın, limitləri yeniləyin, texniki fasilə üçün bloklayın.': [
    'Create daily sessions, update ticket limits, or block sessions for technical maintenance.',
    'Создавайте дневные сеансы, обновляйте лимиты билетов или блокируйте сеансы на технический перерыв.',
  ],
  '+ Yeni sessiya': ['+ New Session', '+ Новый сеанс'],
  'Sessiyanı yenilə': ['Update Session', 'Обновить сеанс'],
  'Yeni sessiya': ['New Session', 'Новый сеанс'],
  'Başlama': ['Start Time', 'Начало'],
  'Bitmə': ['End Time', 'Окончание'],
  'Bilet limiti': ['Ticket Limit', 'Лимит билетов'],
  'Saxlanılır...': ['Saving...', 'Сохранение...'],
  'Yarat': ['Create', 'Создать'],
  'Bu tarix üçün sessiya yoxdur.': ['No sessions for this date.', 'На эту дату сеансов нет.'],
  'Bloklanıb': ['Blocked', 'Заблокирован'],
  'Satış açıq': ['Sales Open', 'Продажа открыта'],
  'Satış bağlı': ['Sales Closed', 'Продажа закрыта'],
  'Düzəliş': ['Edit', 'Изменить'],
  'Bloku aç': ['Unblock', 'Разблокировать'],
  'Blokla': ['Block', 'Блокировать'],
  'Sil': ['Delete', 'Удалить'],

  // SkateInventoryPage & VolunteerInventoryPage
  'Konki stok və icarə': ['Skate Stock & Rental', 'Запас и прокат коньков'],
  'İnventar idarəetməsi': ['Inventory Management', 'Управление инвентарём'],
  'Razmerlər üzrə canlı stok, yeni partiya və zədələnmiş konkilərin inventardan çıxarılması.': [
    'Live stock by size, adding new batches, and writing off damaged skates from inventory.',
    'Живой остаток по размерам, добавление новых партий и списание повреждённых коньков.',
  ],
  '+ Yeni ölçü': ['+ New Size', '+ Новый размер'],
  'Yeni ölçü əlavə et': ['Add New Skate Size', 'Добавить новый размер'],
  'Ölçü': ['Size', 'Размер'],
  'İlkin say': ['Initial Quantity', 'Начальное количество'],
  'Əlavə olunur...': ['Adding...', 'Добавление...'],
  'Əlavə et': ['Add', 'Добавить'],
  'İnventar boşdur.': ['Inventory is empty.', 'Инвентарь пуст.'],
  'Razmer': ['Size', 'Размер'],
  'Tənzimlənən razmer': ['Adjustable size', 'Регулируемый размер'],
  'Bitib': ['Out of Stock', 'Нет в наличии'],
  'Stokda': ['In Stock', 'В наличии'],
  'Ümumi': ['Total', 'Всего'],
  'Boşda': ['Available', 'Доступно'],
  'İstifadədə': ['In Use', 'В прокате'],
  '+ Stok': ['+ Stock', '+ Запас'],
  'Zədəli sil': ['Write Off Damaged', 'Списать брак'],
  'Könüllü iş masası': ['Volunteer Desk', 'Рабочий стол волонтёра'],
  'Ölçülər üzrə ümumi stok, hazırda istifadədə olan və zədəli konkilərin canlı görünüşü.': [
    'Live view of total stock by size, skates currently in use, and damaged pairs.',
    'Живой обзор общего запаса по размерам, коньков в прокате и повреждённых пар.',
  ],
  'Ümumi stok': ['Total Stock', 'Общий запас'],
  'Bütün ölçülər': ['All sizes', 'Все размеры'],
  'Təhvile hazır': ['Ready for handover', 'Готовы к выдаче'],
  'Aktiv rezervasiyalarda': ['In active reservations', 'В активных бронях'],
  'Anbardan çıxarılıb': ['Written off from stock', 'Списано со склада'],
  'Anbarda konki qeydə alınmayıb.': ['No skates registered in inventory.', 'На складе нет зарегистрированных коньков.'],
  'Konki ölçüsü': ['Skate Size', 'Размер коньков'],

  // FinancePage & PaymentCard
  'Maliyyə və audit': ['Finance & Audit', 'Финансы и аудит'],
  'Ödəniş monitorinqi': ['Payment Monitoring', 'Мониторинг платежей'],
  'Onlayn gateway və kassir POS tranzaksiyalarını izləyin, statusları idarə edin.': [
    'Track online gateway and cashier POS transactions and manage payment statuses.',
    'Отслеживайте транзакции онлайн-шлюза и кассы POS, управляйте статусами платежей.',
  ],
  'Gözləyən': ['Pending', 'Ожидающие'],
  'Uğurlu': ['Successful', 'Успешные'],
  'Uğursuz': ['Failed', 'Неудачные'],
  'Manual yoxlama': ['Manual review', 'Ручная проверка'],
  'Uğurlu ödəniş': ['Successful Payments', 'Успешные платежи'],
  'Ümumi tranzaksiya': ['Total transactions', 'Всего транзакций'],
  'Bütün kanallar': ['All Channels', 'Все каналы'],
  'Onlayn': ['Online', 'Онлайн'],
  'Referans, istifadəçi...': ['Reference, username...', 'Референс, пользователь...'],
  'Ödənişlər yüklənir...': ['Loading payments...', 'Загрузка платежей...'],
  'Bu filtr üzrə ödəniş tapılmadı.': ['No payments found for this filter.', 'По этому фильтру платежи не найдены.'],
  'Nağd': ['Cash', 'Наличные'],
  'Kart': ['Card', 'Карта'],
  'Müştəri': ['Customer', 'Клиент'],
  'Uğursuz et': ['Mark Failed', 'Отклонить'],

  // CashierPosPage
  'Yerində bilet satışı': ['On-Site Ticket Sales', 'Продажа билетов на кассе'],
  'Nağd və ya kart ödənişi ilə daxili bilet satışı, gün sonu kassasiya hesabatı.': [
    'In-person ticket sales via cash or card, plus end-of-day cashier reporting.',
    'Продажа билетов на месте наличными или картой, а также кассовый отчёт за день.',
  ],
  'Kassa yekunu': ['Cashier Total', 'Итого по кассе'],
  'Gün sonu kassa': ['End-of-day cash', 'Наличные за день'],
  'Yeni satış': ['New Sale', 'Новая продажа'],
  'Sessiya seçin': ['Select Session', 'Выберите сеанс'],
  'Bu sessiya bloklanıb.': ['This session is blocked.', 'Этот сеанс заблокирован.'],
  'Bilet sayı': ['Ticket Quantity', 'Количество билетов'],
  '30 dəqiqə': ['30 minutes', '30 минут'],
  '60 dəqiqə': ['60 minutes', '60 минут'],
  'Ödəniş üsulu': ['Payment Method', 'Способ оплаты'],
  'Müştəri adı (istəyə bağlı)': ['Customer Name (optional)', 'Имя клиента (необязательно)'],
  'Ad, soyad': ['Full name', 'Имя, фамилия'],
  'Satış aparılır...': ['Processing sale...', 'Оформление продажи...'],
  'Satışı tamamla': ['Complete Sale', 'Завершить продажу'],
  'Satış qəbzi': ['Sales Receipt', 'Кассовый чек'],
  'Yekun': ['Total', 'Итого'],
  'Ödəniş': ['Payment', 'Оплата'],
  'Gün sonu hesabatı': ['End-of-Day Report', 'Отчёт за день'],
  'Bu gün üçün POS satışı yoxdur.': ['No POS sales recorded for today.', 'За сегодня продаж через POS нет.'],

  // VerificationPage (Turniket QR & Kassa QR) + QrCameraScanner
  'Kassa QR yoxlanışı': ['Cashier QR Check', 'Проверка QR на кассе'],
  'Turniket QR nəzarəti': ['Turnstile QR Control', 'Контроль QR на турникете'],
  'Kassa QR skan': ['Cashier QR Scan', 'Сканирование QR на кассе'],
  'Turniket QR skan': ['Turnstile QR Scan', 'Сканирование QR на турникете'],
  'Müştəri biletindəki QR kodu açır, kassadakı əməkdaş və ya könüllü burada skan edir. Bilet hələ təsdiqlənməyibsə biletin şəkli, neçə nəfərlik olduğu, seçilmiş konki razmerləri və bütün bilet məlumatları açılır.': [
    'The customer shows the QR code on their ticket and the cashier or volunteer scans it here. If the ticket is valid, the visual digital ticket, participant count, selected skate sizes, and full details open on screen.',
    'Клиент показывает QR-код билета, а кассир или волонтёр сканирует его здесь. Открывается карточка билета, количество участников, выбранные размеры коньков и кнопка выдачи коньков.',
  ],
  'Müştəri buza daxil olarkən QR kod burada skan edilir. Bilet təsdiqlənməyibsə dərhal təsdiqlənir, müştəri buza buraxılır və “Buzdakı müştərilər” siyahısına düşür.': [
    'Scan the customer’s QR code here when entering the ice. The ticket is immediately confirmed, the customer is admitted to the ice, and added to the “Skaters on Ice” list.',
    'При входе клиента на лёд отсканируйте QR-код здесь. Билет сразу подтверждается, клиент допускается на лёд и добавляется в список «Клиенты на льду».',
  ],
  'Bilet / QR kodu skan edin': ['Scan Ticket / QR Code', 'Отсканируйте билет / QR-код'],
  'Məsələn: SAV-ABC-1234 və ya POS-XXXXXXXXXXXX': [
    'E.g.: SAV-ABC-1234 or POS-XXXXXXXXXXXX',
    'Например: SAV-ABC-1234 или POS-XXXXXXXXXXXX',
  ],
  'QR yoxlanılır...': ['Checking QR...', 'Проверка QR...'],
  'QR kodu skan et və bileti aç': ['Scan QR Code & Open Ticket', 'Сканировать QR и открыть билет'],
  'QR kodu skan et və təsdiqlə': ['Scan QR Code & Confirm Entry', 'Сканировать QR и подтвердить вход'],
  'Kassa QR bölməsi bileti yoxlayır və şəklini açır.': [
    'Cashier QR verifies the ticket and opens its full digital card.',
    'Раздел «Касса QR» проверяет билет и открывает его полную карточку.',
  ],
  'Hər bilet yalnız bir dəfə təsdiqlənir.': [
    'Each ticket can only be confirmed once.',
    'Каждый билет подтверждается только один раз.',
  ],
  'Kamera ilə QR skan': ['Camera QR Scanner', 'Сканирование QR камерой'],
  'Kameranı aç': ['Open Camera', 'Включить камеру'],
  'Dayandır': ['Stop', 'Остановить'],
  'Kameranı açıb biletin QR kodunu çərçivəyə yaxınlaşdırın. Kamera olmadıqda kodu yuxarıdaki sahəyə əl ilə daxil edin.': [
    'Open the camera and hold the ticket QR code inside the frame. If no camera is available, enter the code manually above.',
    'Включите камеру и поднесите QR-код билета к рамке. При отсутствии камеры введите код вручную в поле выше.',
  ],
  'Kassa QR skan gözləyir': ['Waiting for Cashier QR Scan', 'Ожидание сканирования QR на кассе'],
  'Turniket QR skan gözləyir': ['Waiting for Turnstile QR Scan', 'Ожидание сканирования QR на турникете'],
  'Müştərinin biletindəki QR kodu skan edin — biletin şəkli və bütün detalları burada açılacaq.': [
    'Scan the QR code on the customer’s ticket — the visual ticket and all details will open here.',
    'Отсканируйте QR-код на билете клиента — здесь откроется карточка билета и все его детали.',
  ],
  'Son skanlar': ['Recent Scans', 'Последние сканирования'],
  'Təsdiqləndi — Buza buraxın': ['Confirmed — Admit to Ice', 'Подтверждено — Пропустите на лёд'],
  'Konki təhvil verildi': ['Skates Handed Over', 'Коньки выданы'],
  '⛸ Konki təhvil verildi': ['⛸ Skates Handed Over', '⛸ Коньки выданы'],
  '⛸ Konki təhvil verildi (Stokdan çıx)': [
    '⛸ Skates Handed Over (Deduct from Stock)',
    '⛸ Коньки выданы (Списать со склада)',
  ],
  'Təhvil qeyd edilir…': ['Recording handover…', 'Регистрация выдачи…'],
  'Təsdiqlənməyib — Etibarlı bilet': ['Unconfirmed — Valid Ticket', 'Не подтверждён — Действительный билет'],
  'Bu QR bilet istifadə olunub': ['This QR Ticket Has Already Been Used', 'Этот QR-билет уже использован'],
  'Konki artıq təhvil verilib': ['Skates Already Handed Over', 'Коньки уже выданы'],
  'Əvvəlcə Kassa QR və ya Turniketdə skan edin': [
    'Scan at Cashier QR or Turnstile first',
    'Сначала отсканируйте на Кассе QR или Турникете',
  ],
  'Ödəniş gözləyir': ['Payment Pending', 'Ожидает оплаты'],
  'Ləğv edilib': ['Cancelled', 'Отменён'],
  'Vaxtı keçib': ['Expired', 'Просрочен'],
  'Vaxtı bitib': ['Expired', 'Время истекло'],
  'Stok yoxdur': ['Out of Stock', 'Нет в наличии'],
  'Tapılmadı': ['Not Found', 'Не найден'],
  'Bilet tapılmadı': ['Ticket Not Found', 'Билет не найден'],
  'Kassa QR xəbərdarlığı': ['Cashier QR Alert', 'Предупреждение Кассы QR'],
  'Turniket xəbərdarlığı': ['Turnstile Alert', 'Предупреждение Турникета'],
  'Bu bilet daha əvvəl Turniketdə skan edilərək təsdiqlənib. Eyni QR bilet ikinci dəfə təsdiqlənə bilməz.': [
    'This ticket was already scanned and confirmed at the Turnstile. The same QR ticket cannot be confirmed a second time.',
    'Этот билет уже был отсканирован и подтверждён на Турникете. Повторное подтверждение одного и того же QR-билета невозможно.',
  ],
  'Turniket giriş təsdiqi': ['Turnstile Entry Confirmation', 'Подтверждение входа на турникете'],
  'Bilet təsdiqləndi — Müştərini buza buraxa bilərsiniz': [
    'Ticket Confirmed — You May Admit the Customer to the Ice',
    'Билет подтверждён — Вы можете пропустить клиента на лёд',
  ],
  'Buza daxil olduğu saat': ['Ice Entry Time', 'Время входа на лёд'],
  'Buzdan çıxmalı olduğu saat': ['Scheduled Ice Exit Time', 'Время выхода со льда'],
  'Aktiv vaxt': ['Active Time', 'Активное время'],
  'Bilet Kassa QR-da təsdiqləndi — Etibarlıdır': [
    'Ticket Verified at Cashier QR — Valid',
    'Билет подтверждён на Кассе QR — Действителен',
  ],
  'Bilet təsdiqləndi və konki təhvil verildi (stokdan çıxıldı)': [
    'Ticket Verified & Skates Handed Over (Deducted from Stock)',
    'Билет подтверждён и коньки выданы (списаны со склада)',
  ],
  'Müştəriyə konki təhvil verilib və uyğun ölçü stokdan çıxılıb.': [
    'Skates have been handed over to the customer and deducted from inventory.',
    'Коньки выданы клиенту, соответствующий размер списан со склада.',
  ],
  'Aşağıda seçilmiş konki razmerləri göstərilir. Konkini müştəriyə təhvil verdikdə “Konki təhvil verildi” düyməsini basın (həmin anda stokdan çıxılacaq).': [
    'Selected skate sizes are shown below. When handing the skates to the customer, click “Skates Handed Over” (stock will be deducted immediately).',
    'Ниже указаны выбранные размеры коньков. При передаче коньков клиенту нажмите кнопку «Коньки выданы» (в этот момент они спишутся со склада).',
  ],
  'Rəqəmsal bilet / Onlayn sifariş': ['Digital Ticket / Online Order', 'Цифровой билет / Онлайн-заказ'],
  'Rəqəmsal bilet / Kassa (POS) bileti': ['Digital Ticket / POS Ticket', 'Цифровой билет / Кассовый билет (POS)'],
  'Bilet üzrə nəfər sayı': ['Participants on Ticket', 'Количество человек по билету'],
  'Seçilmiş konki razmerləri': ['Selected Skate Sizes', 'Выбранные размеры коньков'],
  'Razmer qeyd edilməyib': ['No size specified', 'Размер не указан'],
  'POS bilet (konki ayrıca seçilir)': ['POS ticket (skates selected separately)', 'Билет POS (коньки подбираются отдельно)'],
  'Sessiya tarixi': ['Session Date', 'Дата сеанса'],
  'Sessiya saatı': ['Session Hours', 'Время сеанса'],
  'Bilet müddəti': ['Ticket Duration', 'Длительность билета'],
  'Ödəniş məbləği': ['Payment Amount', 'Сумма оплаты'],
  'Bilet növü': ['Ticket Type', 'Тип билета'],
  'Böyük bilet': ['Adult Ticket', 'Взрослый билет'],
  'Uşaq bileti': ['Child Ticket', 'Детский билет'],
  'Yaş qeyd edilməyib': ['Age not specified', 'Возраст не указан'],
  'Təhvil verilib': ['Handed Over', 'Выдано'],
  'Alınma tarixi və referans': ['Purchase Date & Reference', 'Дата покупки и референс'],
  'Turniket təsdiq vəziyyəti': ['Turnstile Status', 'Статус турникета'],
  'Hələ təsdiqlənməyib': ['Not confirmed yet', 'Ещё не подтверждён'],
  'Konki təhvil vəziyyəti': ['Skate Handover Status', 'Статус выдачи коньков'],
  'Konki təhvil verilib': ['Skates handed over', 'Коньки выданы'],
  'Stokdan çıxılıb (Təhvil gözləyir)': ['Deducted from stock (Awaiting handover)', 'Списано со склада (ожидает выдачи)'],
  'Təhvil verilməyib': ['Not handed over yet', 'Ещё не выданы'],
  '✓ Bu bilet üzrə konki təhvil verilib və stokdan çıxılıb.': [
    '✓ Skates for this ticket have been handed over and deducted from stock.',
    '✓ Коньки по этому билету выданы и списаны со склада.',
  ],

  // ActiveGuestsPage
  'Canlı buz nəzarəti': ['Live Ice Control', 'Живой контроль льда'],
  'Kassada təsdiqlənən biletlər əvvəlcə “Aktiv bilet” sayına düşür. Müştəri Turniketdə QR oxudub təsdiq aldıqda isə “Aktiv bilet” sayından azalır və “Buzdakı müştəri sayı”na əlavə olunur.': [
    'Tickets scanned at the Cashier first appear under “Active Tickets”. Once the customer scans their QR at the Turnstile, they move from “Active Tickets” to “Skaters on Ice”.',
    'Билеты, проверенные на кассе, сначала попадают в «Активные билеты». Когда клиент сканирует QR на турникете, билет переходит в список «Клиенты на льду».',
  ],
  'Kassada təsdiqlənib (Turniket gözləyir)': ['Verified at Cashier (Awaiting Turnstile)', 'Проверено на кассе (ожидает турникет)'],
  'Buzdakı müştəri sayı': ['Skaters on Ice Count', 'Количество клиентов на льду'],
  'Turniketdə təsdiqlənib buzda olanlar': ['Confirmed at Turnstile & currently on ice', 'Подтверждены на турникете и находятся на льду'],
  'Ən tez çıxış vaxtı': ['Earliest Exit Time', 'Ближайшее время выхода'],
  'Buzdan çıxmağa qalan ən qısa müddət': ['Shortest remaining time on ice', 'Наименьшее оставшееся время на льду'],
  'Aktiv biletlər — Kassada təsdiqlənənlər (Turniket gözləyir)': [
    'Active Tickets — Verified at Cashier (Awaiting Turnstile)',
    'Активные билеты — Проверены на кассе (ожидают турникет)',
  ],
  'Bu biletlər Kassa QR-da skan edilib. Turniketdə oxudulan kimi buradan çıxıb aşağıdakı “Buzdakı müştərilər” siyahısına düşəcək.': [
    'These tickets were scanned at Cashier QR. As soon as they are scanned at the Turnstile, they will move to the “Skaters on Ice” list below.',
    'Эти билеты были отсканированы на Кассе QR. Как только их отсканируют на Турникете, они перейдут в список «Клиенты на льду» ниже.',
  ],
  'Fərdi (1 nəfər)': ['Individual (1 person)', 'Индивидуальный (1 чел.)'],
  'Kassa təsdiqi:': ['Cashier check:', 'Проверка кассы:'],
  'Buzdakı müştərilərin siyahısı': ['List of Skaters Currently on Ice', 'Список клиентов на льду'],
  'Turniketdə QR-ı təsdiqlənib 1 saat və ya yarım saat vaxtı aktiv olan müştərilər sıra ilə (qrup olaraq gələliblərin hamısının Ad Soyadı, buza daxil olduğu saat və buzdan çıxmalı olduğu saat)': [
    'Customers confirmed at the Turnstile with active 1-hour or 30-minute sessions in order (showing full names of all group members, entry time, and scheduled exit time)',
    'Клиенты, прошедшие через турникет с активным сеансом 1 час или 30 минут (ФИО всех участников группы, время входа на лёд и время выхода со льда)',
  ],
  'Hazırda buzda aktiv müştəri yoxdur': ['No active skaters on the ice right now', 'Сейчас на льду нет активных клиентов'],
  'Turniket bölməsində müştərinin QR bileti skan edildikdə dərhal bu siyahıya düşəcək.': [
    'As soon as a customer’s QR ticket is scanned at the Turnstile, they will appear in this list.',
    'Как только QR-билет клиента будет отсканирован на турникете, он сразу появится в этом списке.',
  ],
  'Müştəri / Qrup üzvləri (Ad Soyad)': ['Customer / Group Members (Full Name)', 'Клиент / Участники группы (ФИО)'],
  'Müddət / Konki': ['Duration / Skates', 'Длительность / Коньки'],
  'Qalan vaxt': ['Remaining Time', 'Оставшееся время'],
  '(Qrup olaraq gəliblər)': ['(Arrived as a group)', '(Пришли группой)'],

  // VolunteerReservationsPage
  'Müştəri taymeri aktivləşdirən kimi tələb aşağıdakı canlı siqnal bölməsində görünür. Lazımi ölçünü götürüb “Konki hazırdır” düyməsini basın, sonra təhvili qeyd edin.': [
    'As soon as a customer activates their timer, the request appears in the live signal section below. Grab the required size, click “Skates Ready”, and then record the handover.',
    'Как только клиент активирует таймер, запрос появляется в разделе «Живой сигнал» ниже. Подготовьте нужный размер, нажмите «Коньки готовы», а затем отметьте выдачу.',
  ],
  'Canlı tələb': ['Live Requests', 'Активные запросы'],
  'Taymeri aktiv olan': ['Active timer', 'С активным таймером'],
  'Təhvil gözləyir': ['Awaiting Handover', 'Ожидают выдачи'],
  'Konki hələ götürülməyib': ['Skates not picked up yet', 'Коньки ещё не взяты'],
  'Hazırlanır': ['Preparing', 'Готовятся'],
  'Təhvilə hazır': ['Ready for handover', 'Готовы к выдаче'],
  'Bu günün qeydləri': ['Today’s records', 'Записи за сегодня'],
  'Canlı siqnal': ['Live Signal', 'Живой сигнал'],
  '10 dəqiqəlik taymer bitərsə konki stoku avtomatik geri qaytarılır.': [
    'If the 10-minute timer expires, skate stock is automatically returned to inventory.',
    'Если 10-минутный таймер истечёт, коньки автоматически возвращаются на склад.',
  ],
  'Hazırda canlı tələb yoxdur': ['No live requests right now', 'Сейчас нет активных запросов'],
  'Müştəri “Biletlərim” bölməsindən rezervasiyanı aktivləşdirəndə burada görünəcək.': [
    'Requests will appear here when a customer activates their reservation from “My Tickets”.',
    'Запросы появятся здесь, когда клиент активирует бронь в разделе «Мои билеты».',
  ],
  'Taymer bitdi, stok geri qaytarılır': ['Timer expired, returning stock', 'Таймер истёк, запас возвращается'],
  'Təhvil verilənə qədər taymer davam edir': ['Timer runs until skates are handed over', 'Таймер идёт до момента выдачи коньков'],
  'Qeyd edilir...': ['Recording...', 'Сохранение...'],
  'Konki hazırdır': ['Skates Ready', 'Коньки готовы'],
  'Təhvil ver': ['Hand Over', 'Выдать коньки'],
  'Növbəti rezervasiyalar': ['Upcoming Reservations', 'Следующие бронирования'],
  'Taymer hələ aktivləşdirilməyib. Müştəri arenaya gəldikdə canlı siqnala keçəcək.': [
    'Timer not activated yet. Will move to Live Signal when the customer arrives.',
    'Таймер ещё не активирован. Перейдёт в «Живой сигнал», когда клиент придёт на арену.',
  ],
  'Müştəri, kod və ya ölçü...': ['Customer, code, or size...', 'Клиент, код или размер...'],
  'Gözləyən rezervasiya tapılmadı.': ['No upcoming reservations found.', 'Ожидающих бронирований не найдено.'],
  'Konki verilib': ['Skates Handed Out', 'Коньки выданы'],
  'Tamamlandı': ['Completed', 'Завершено'],
  'Canlı siqnalda': ['In Live Signal', 'В живом сигнале'],
  'Taymer gözləyir': ['Waiting for Timer', 'Ожидает таймера'],
  'Yeni konki tələbi': ['New Skate Request', 'Новый запрос коньков'],
  'Konki hazırlanır': ['Preparing Skates', 'Коньки готовятся'],

  // ShiftOverviewPage, ShiftSlotPlannerPage, VolunteerShiftsPage & Stations
  'Günün smenləri və stansiyalar': ['Daily Shifts & Stations', 'Смены дня и позиции'],
  'Admin, koordinator və kassir üçün vahid mənzərə: hər smen üzrə könüllü sayı, stansiya bölgüsü və canlı smen statusu.': [
    'Unified view for admin, coordinator, and cashier: volunteer count per shift, station assignments, and live shift status.',
    'Единый обзор для админа, координатора и кассира: количество волонтёров по сменам, распределение по позициям и статус смены.',
  ],
  'Smen tarixi': ['Shift Date', 'Дата смены'],
  'Plan tarixi': ['Plan Date', 'Дата плана'],
  'Ümumi könüllü': ['Total Volunteers', 'Всего волонтёров'],
  'Smendə': ['On Duty', 'На смене'],
  'Smen təyin edilib': ['Station Assigned', 'Назначены на позицию'],
  'Təyinat gözləyən': ['Awaiting Assignment', 'Ожидают назначения'],
  'Stansiyalar üzrə ümumi bölgü': ['Overall Station Distribution', 'Общее распределение по позициям'],
  'Bu tarix üçün smen slotu yoxdur.': ['No shift slots for this date.', 'На эту дату слотов смен нет.'],
  'Deaktiv': ['Inactive', 'Неактивен'],
  'Bu smen üçün könüllü seçilməyib.': ['No volunteers signed up for this shift.', 'На эту смену волонтёры не записались.'],
  'Stansiya seç': ['Select Station', 'Выбрать позицию'],
  'Başqa smenə keçir': ['Move to Another Shift', 'Перевести на другую смену'],
  'Yalnız baxış': ['View Only', 'Только просмотр'],
  'Kassa / Telefon': ['Cashier / Phone', 'Касса / Телефон'],
  'Sektor': ['Sector', 'Сектор'],
  'Mikrafon': ['Microphone', 'Микрофон'],
  'Buz': ['Ice Rink', 'Лёд'],
  'Təyin edilməyib': ['Unassigned', 'Не назначено'],
  'Gözlənilir': ['Upcoming', 'Ожидается'],
  'Naməlum': ['Unknown', 'Неизвестно'],
  'Koordinator planlaması': ['Coordinator Planning', 'Планирование координатора'],
  'Günlük smen slotları': ['Daily Shift Slots', 'Дневные слоты смен'],
  'Hər gün üçün könüllü smen intervallarını əlavə edin, redaktə edin və ya deaktiv edin. Dəyişikliklər könüllülərin seçim ekranına dərhal yansıyır.': [
    'Add, edit, or deactivate volunteer shift intervals for each day. Changes are immediately reflected on the volunteer selection screen.',
    'Добавляйте, редактируйте или отключайте интервалы волонтёрских смен на каждый день. Изменения сразу отображаются на экране выбора волонтёров.',
  ],
  'Smeni redaktə et': ['Edit Shift Slot', 'Редактировать смену'],
  'Yeni smen slotu': ['New Shift Slot', 'Новый слот смены'],
  'Aktiv (könüllülər seçə bilər)': ['Active (volunteers can select)', 'Активен (волонтёры могут выбирать)'],
  'Slot əlavə et': ['Add Slot', 'Добавить слот'],
  'Bu tarix üçün slot yoxdur. Soldakı formadan əlavə edin.': [
    'No shift slots for this date. Add one using the form on the left.',
    'На эту дату слотов нет. Добавьте слот через форму слева.',
  ],
  'Redaktə': ['Edit', 'Изменить'],
  'Deaktiv et': ['Deactivate', 'Отключить'],
  'Aktivləşdir': ['Activate', 'Активировать'],
  'Gün üzrə mövcud könüllü smenlərini görün və özünüzə uyğun intervalı seçin. Koordinator sonradan stansiya təyin edəcək.': [
    'View available volunteer shifts for the day and select the interval that suits you. The coordinator will assign your station.',
    'Просматривайте доступные смены на выбранный день и записывайтесь на удобный интервал. Координатор назначит вам позицию.',
  ],
  'Mövcud smenlər': ['Available Shifts', 'Доступные смены'],
  'Bu tarix üçün aktiv smen yoxdur.': ['No active shifts for this date.', 'На эту дату активных смен нет.'],
  'Seçilib': ['Selected', 'Выбрано'],
  'Seçilir...': ['Selecting...', 'Выбор...'],
  'Smeni seç': ['Select Shift', 'Выбрать смену'],
  'Bütün seçilmiş smenlər və koordinatorun stansiya təyinatları': [
    'All your selected shifts and station assignments from the coordinator',
    'Все выбранные вами смены и назначения позиций от координатора',
  ],
  'Hələ smen seçməmisiniz.': ['You have not selected any shifts yet.', 'Вы ещё не выбрали ни одной смены.'],
  'Seçdiyiniz bu smen ləğv edilmişdir.': ['This shift you selected has been cancelled.', 'Выбранная вами смена была отменена.'],
}

// Month & Day replacements for date strings
const MONTHS_EN = {
  yanvar: 'January',
  fevral: 'February',
  mart: 'March',
  aprel: 'April',
  may: 'May',
  iyun: 'June',
  iyul: 'July',
  avqust: 'August',
  sentyabr: 'September',
  oktyabr: 'October',
  noyabr: 'November',
  dekabr: 'December',
}

const MONTHS_RU = {
  yanvar: 'января',
  fevral: 'февраля',
  mart: 'марта',
  aprel: 'апреля',
  may: 'мая',
  iyun: 'июня',
  iyul: 'июля',
  avqust: 'августа',
  sentyabr: 'сентября',
  oktyabr: 'октября',
  noyabr: 'ноября',
  dekabr: 'декабря',
}

// Parameterized pattern rules for dynamic strings
const PATTERNS = [
  {
    re: /^Xoş gəldiniz,\s*(.+)$/,
    en: (_, u) => `Welcome, ${u}`,
    ru: (_, u) => `Добро пожаловать, ${u}`,
  },
  {
    re: /^Biletlərim\s*\((\d+)\)$/,
    en: (_, n) => `My Tickets (${n})`,
    ru: (_, n) => `Мои билеты (${n})`,
  },
  {
    re: /^Cari hesablanmış yaş:\s*(\d+)\s*yaş$/,
    en: (_, n) => `Calculated current age: ${n} years old`,
    ru: (_, n) => `Текущий расчётный возраст: ${n} лет`,
  },
  {
    re: /^(\d+)\s*yaş$/,
    en: (_, n) => `${n} yrs`,
    ru: (_, n) => `${n} лет`,
  },
  {
    re: /^Qeydiyyat tarixi:\s*(.+)$/,
    en: (_, d) => `Registered on: ${d}`,
    ru: (_, d) => `Дата регистрации: ${d}`,
  },
  {
    re: /^Təsdiqlənib\s*\((.+)\)$/,
    en: (_, d) => `Verified (${d})`,
    ru: (_, d) => `Подтверждено (${d})`,
  },
  {
    re: /^(\d+)\s*öhdəlik qəbul edilib$/,
    en: (_, n) => `${n} obligations accepted`,
    ru: (_, n) => `Принято обязательств: ${n}`,
  },
  {
    re: /^(\d+)\/(\d+)\s*təsdiqlənib$/,
    en: (_, a, b) => `${a}/${b} confirmed`,
    ru: (_, a, b) => `${a}/${b} подтверждено`,
  },
  {
    re: /^Avtobus\s+(.+)$/,
    en: (_, b) => `Bus ${b}`,
    ru: (_, b) => `Автобус ${b}`,
  },
  {
    re: /^Bus\s+(.+)$/,
    en: (_, b) => `Bus ${b}`,
    ru: (_, b) => `Автобус ${b}`,
  },
  {
    re: /^Tel:\s*(.+)$/,
    en: (_, p) => `Phone: ${p}`,
    ru: (_, p) => `Тел.: ${p}`,
  },
  {
    re: /^Email:\s*(.+)$/,
    en: (_, e) => `Email: ${e}`,
    ru: (_, e) => `Эл. почта: ${e}`,
  },
  {
    re: /^©\s*(\d+)\s*Heydər Əliyev İdman və Konsert Kompleksi \(HƏİKK\) - Buz Arenası$/,
    en: (_, y) => `© ${y} Heydar Aliyev Sports and Concert Complex (HASCC) - Ice Arena`,
    ru: (_, y) => `© ${y} Спортивно-концертный комплекс им. Гейдара Алиева (СКК) - Ледовая Арена`,
  },
  {
    re: /^Konki rezervasiyasını aktivləşdir\s*\((\d+)\s*cəhd qalıb\)$/,
    en: (_, n) => `Activate Skate Reservation (${n} attempts left)`,
    ru: (_, n) => `Активировать бронь коньков (осталось попыток: ${n})`,
  },
  {
    re: /^Alınma:\s*(.+)$/,
    en: (_, d) => `Purchased: ${d}`,
    ru: (_, d) => `Куплено: ${d}`,
  },
  {
    re: /^Etibarlıq:\s*(.+)-dək$/,
    en: (_, d) => `Valid until: ${d}`,
    ru: (_, d) => `Действителен до: ${d}`,
  },
  {
    re: /^İştirakçılar\s*\((\d+)\s*nəfər\)$/,
    en: (_, n) => `Participants (${n} people)`,
    ru: (_, n) => `Участники (${n} чел.)`,
  },
  {
    re: /^İştirakçılar və seçilmiş konki razmerləri\s*\((\d+)\s*nəfər\)$/,
    en: (_, n) => `Participants & Selected Skate Sizes (${n} people)`,
    ru: (_, n) => `Участники и выбранные размеры коньков (${n} чел.)`,
  },
  {
    re: /^(\d+)\s*nəfərlik bilet$/,
    en: (_, n) => `Ticket for ${n} ${Number(n) === 1 ? 'person' : 'people'}`,
    ru: (_, n) => `Билет на ${n} чел.`,
  },
  {
    re: /^([\d-]+)\s*razmer$/,
    en: (_, n) => `Size ${n}`,
    ru: (_, n) => `Размер ${n}`,
  },
  {
    re: /^Konki razmeri:\s*(.+)$/,
    en: (_, s) => `Skate size: ${s}`,
    ru: (_, s) => `Размер коньков: ${s}`,
  },
  {
    re: /^([\d-]+)\s*ölçü$/,
    en: (_, n) => `Size ${n}`,
    ru: (_, n) => `Размер ${n}`,
  },
  {
    re: /^Konki:\s*(.+)\s*ölçü$/,
    en: (_, s) => `Skates: size ${s}`,
    ru: (_, s) => `Коньки: размер ${s}`,
  },
  {
    re: /^(\d+)\s*dəq qalıb$/,
    en: (_, n) => `${n} min left`,
    ru: (_, n) => `Осталось ${n} мин`,
  },
  {
    re: /^(\d+)\s*saat\s*(\d+)\s*dəq qalıb$/,
    en: (_, h, m) => `${h} hr ${m} min left`,
    ru: (_, h, m) => `Осталось ${h} ч ${m} мин`,
  },
  {
    re: /^1 saat \(60 dəq\)$/,
    en: () => '1 hour (60 min)',
    ru: () => '1 час (60 мин)',
  },
  {
    re: /^Yarım saat \(30 dəq\)$/,
    en: () => '30 minutes',
    ru: () => 'Полчаса (30 мин)',
  },
  {
    re: /^Ümumi:\s*(.+)\s*nəfər$/,
    en: (_, n) => `Total: ${n} people`,
    ru: (_, n) => `Всего: ${n} чел.`,
  },
  {
    re: /^1 qrup\s*\((\d+)\s*nəfər\)$/,
    en: (_, n) => `1 group (${n} people)`,
    ru: (_, n) => `1 группа (${n} чел.)`,
  },
  {
    re: /^(\d+)\s*qrup\s*\((\d+)\s*nəfər\)\s*·\s*(\d+)\s*fərdi\s*\((\d+)\s*nəfər\)$/,
    en: (_, g, gp, s, sp) => `${g} groups (${gp} people) · ${s} individual (${sp})`,
    ru: (_, g, gp, s, sp) => `${g} групп (${gp} чел.) · ${s} инд. (${sp} чел.)`,
  },
  {
    re: /^(\d+)\s*qrup\s*\((\d+)\s*nəfər\)$/,
    en: (_, g, gp) => `${g} groups (${gp} people)`,
    ru: (_, g, gp) => `${g} групп (${gp} чел.)`,
  },
  {
    re: /^(\d+)\s*fərdi\s*\((\d+)\s*nəfər\)$/,
    en: (_, s, sp) => `${s} individual (${sp} people)`,
    ru: (_, s, sp) => `${s} инд. (${sp} чел.)`,
  },
  {
    re: /^0 bilet$/,
    en: () => '0 tickets',
    ru: () => '0 билетов',
  },
  {
    re: /^0 müştəri$/,
    en: () => '0 customers',
    ru: () => '0 клиентов',
  },
  {
    re: /^(\d+)\s*bilet$/,
    en: (_, n) => `${n} tickets`,
    ru: (_, n) => `${n} билетов`,
  },
  {
    re: /^(\d+)\s*əməliyyat$/,
    en: (_, n) => `${n} transactions`,
    ru: (_, n) => `${n} операций`,
  },
  {
    re: /^(\d+)\s*tranzaksiya$/,
    en: (_, n) => `${n} transactions`,
    ru: (_, n) => `${n} транзакций`,
  },
  {
    re: /^(\d+)\s*aktiv seans$/,
    en: (_, n) => `${n} active sessions`,
    ru: (_, n) => `${n} активных сеансов`,
  },
  {
    re: /^(\d+)\s*seans$/,
    en: (_, n) => `${n} sessions`,
    ru: (_, n) => `${n} сеансов`,
  },
  {
    re: /^(\d+)\s*sessiya$/,
    en: (_, n) => `${n} sessions`,
    ru: (_, n) => `${n} сеансов`,
  },
  {
    re: /^(\d+)\s*əməkdaş$/,
    en: (_, n) => `${n} staff members`,
    ru: (_, n) => `${n} сотрудников`,
  },
  {
    re: /^(\d+)\s*təsdiqlənmiş$/,
    en: (_, n) => `${n} confirmed`,
    ru: (_, n) => `${n} подтверждено`,
  },
  {
    re: /^(\d+)\s*uğursuz$/,
    en: (_, n) => `${n} failed`,
    ru: (_, n) => `${n} неудачных`,
  },
  {
    re: /^([\d.]+)%\s*doluluq$/,
    en: (_, p) => `${p}% occupancy`,
    ru: (_, p) => `${p}% заполняемость`,
  },
  {
    re: /^Boşda:\s*(\d+)\s*·\s*Zədəli:\s*(\d+)$/,
    en: (_, a, d) => `Available: ${a} · Damaged: ${d}`,
    ru: (_, a, d) => `Доступно: ${a} · Повреждено: ${d}`,
  },
  {
    re: /^İstifadədə:\s*(\d+)\s*·\s*Mövcudluq:\s*(\d+)%$/,
    en: (_, u, r) => `In use: ${u} · Availability: ${r}%`,
    ru: (_, u, r) => `В прокате: ${u} · Доступность: ${r}%`,
  },
  {
    re: /^Qalıq:\s*(\d+)\s*·\s*Doluluq:\s*([\d.]+)%$/,
    en: (_, a, r) => `Remaining: ${a} · Occupancy: ${r}%`,
    ru: (_, a, r) => `Остаток: ${a} · Заполняемость: ${r}%`,
  },
  {
    re: /^(\d+)\s*rezervasiya\s*·\s*(\d+)\s*bilet$/,
    en: (_, r, t) => `${r} reservations · ${t} tickets`,
    ru: (_, r, t) => `${r} броней · ${t} билетов`,
  },
  {
    re: /^(\d+)\s*aktiv$/,
    en: (_, n) => `${n} active`,
    ru: (_, n) => `${n} активных`,
  },
  {
    re: /^(\d+)\s*interval$/,
    en: (_, n) => `${n} slots`,
    ru: (_, n) => `${n} интервалов`,
  },
  {
    re: /^(\d+)\s*könüllü seçib$/,
    en: (_, n) => `${n} volunteers selected`,
    ru: (_, n) => `Выбрали волонтёров: ${n}`,
  },
  {
    re: /^(\d+)\s*könüllü\s*·\s*(\d+)\s*smendə\s*·\s*(\d+)\s*təyinat gözləyir$/,
    en: (_, t, o, u) => `${t} volunteers · ${o} on duty · ${u} unassigned`,
    ru: (_, t, o, u) => `${t} волонтёров · ${o} на смене · ${u} ждут назначения`,
  },
  {
    re: /^Təyin edən:\s*(.+)$/,
    en: (_, u) => `Assigned by: ${u}`,
    ru: (_, u) => `Назначил: ${u}`,
  },
  {
    re: /^Təsdiqləyən:\s*(.+)$/,
    en: (_, u) => `Verified by: ${u}`,
    ru: (_, u) => `Подтвердил: ${u}`,
  },
  {
    re: /^(.+)\s+ödə və bileti al$/,
    en: (_, p) => `Pay ${p} & Get Ticket`,
    ru: (_, p) => `Оплатить ${p} и получить билет`,
  },
  {
    re: /^([\d-]+)\s*—\s*(\d+)\s*ədəd$/,
    en: (_, s, c) => `${s} — ${c} available`,
    ru: (_, s, c) => `${s} — ${c} шт.`,
  },
  {
    re: /^([\d-]+)\s*—\s*bitib$/,
    en: (_, s) => `${s} — out of stock`,
    ru: (_, s) => `${s} — нет в наличии`,
  },
  {
    re: /^(\d+)\s*nəfər pulsuz$/,
    en: (_, n) => `${n} person free`,
    ru: (_, n) => `${n} чел. бесплатно`,
  },
  {
    re: /^20% endirim\s*\((\d+)\s*nəfər\)$/,
    en: (_, n) => `20% off (${n} people)`,
    ru: (_, n) => `Скидка 20% (${n} чел.)`,
  },
]

export function translateString(raw, lang) {
  if (!raw || lang === 'az') return raw
  const idx = lang === 'en' ? 0 : 1

  const trimmed = raw.trim()
  if (!trimmed) return raw

  // 1. Direct exact lookup
  const exact = EXACT_MAP[trimmed]
  if (exact && exact[idx]) {
    const leading = raw.match(/^\s*/)?.[0] || ''
    const trailing = raw.match(/\s*$/)?.[0] || ''
    return `${leading}${exact[idx]}${trailing}`
  }

  // 2. Pattern lookup
  for (const rule of PATTERNS) {
    const match = trimmed.match(rule.re)
    if (match) {
      const fn = lang === 'en' ? rule.en : rule.ru
      const translated = fn(...match)
      const leading = raw.match(/^\s*/)?.[0] || ''
      const trailing = raw.match(/\s*$/)?.[0] || ''
      return `${leading}${translated}${trailing}`
    }
  }

  // 3. Date / Month & age inline replacements (e.g. "25 iyul 2006 (20 yaş)")
  let out = trimmed
  let changed = false
  const monthMap = lang === 'en' ? MONTHS_EN : MONTHS_RU
  out = out.replace(
    /\b(yanvar|fevral|mart|aprel|may|iyun|iyul|avqust|sentyabr|oktyabr|noyabr|dekabr)\b/gi,
    (m) => {
      const replacement = monthMap[m.toLowerCase()]
      if (replacement) {
        changed = true
        return replacement
      }
      return m
    }
  )
  out = out.replace(/\((\d+)\s*yaş\)/g, (_, n) => {
    changed = true
    return lang === 'en' ? `(${n} yrs)` : `(${n} лет)`
  })

  if (changed) {
    const leading = raw.match(/^\s*/)?.[0] || ''
    const trailing = raw.match(/\s*$/)?.[0] || ''
    return `${leading}${out}${trailing}`
  }

  return raw
}
