/**
 * Kompleksin istifadə şərtləri, qaydaları, qadağaları və
 * müştəri öhdəlikləri — saytın "Qaydalar" bölməsinin mənbəyi.
 */

// Travmatik idman növü xəbərdarlığı (bölmənin girişində)
export const TRAUMA_NOTE =
  'Buz üzərində hərəkət travmatik idman növü kimi qiymətləndirilir. ' +
  'Yüksək sürət və buz səthinin sürüşkənliyi ucbatından zədə almaq riski mövcuddur ' +
  '— bu səbəbdən aşağıdakı qaydalara əməl etmək hər bir iştirakçı üçün mütləqdir.'

// Qaydalar və qadağalar (peşəkar dildə)
export const ARENA_RULES = [
  {
    id: 1,
    title: 'Ev heyvanları və alkoqol',
    body: 'Kompleksin ərazisinə ev heyvanlarının gətirilməsi, spirtli içki qəbulu və ya alkoqol sərxoşluğu ilə kompleksə gəlmək qəti qadağandır. Sərxoş vəziyyətdə olan şəxslər arenaya buraxılmır.',
  },
  {
    id: 2,
    title: 'Tütün məmulatları',
    body: 'Kompleks daxilində, o cümlədən buz meydançasının ətrafında siqaret, siqar, həmçinin elektron siqaretlərdən (vape) istifadə qəti qadağandır.',
  },
  {
    id: 3,
    title: 'Qida və içki qəbulu',
    body: 'Meydançada olarkən hər hansı qida məhsulunun və içkinin qəbulu qadağandır. İstehlak məhsulları yalnız müəyyən olunmuş istirahət zonalarında qəbul edilə bilər.',
  },
  {
    id: 4,
    title: 'Körpələrə nəzarət',
    body: 'Körpələrin meydançadan kənar ərazilərdə, həmçinin arena daxilində nəzarətsiz buraxılması qəti qadağandır. Uşaqlar hər zaman böyüklərin nəzarəti altında olmalıdır.',
  },
  {
    id: 5,
    title: 'Qoruyucu baş geyimi',
    body: '10 yaşından aşağı uşaqların qoruyucu vasitə, yəni baş geyimi olmadan meydançaya daxil olması qəti qadağandır.',
  },
  {
    id: 6,
    title: 'Konki ilə davranış',
    body: 'Konkisiz buz üzərindən keçmək, konki bağcıqlarını boş vəziyyətdə saxlamaq və ya konkini meydançadan çıxarmaq qəti qadağandır.',
  },
  {
    id: 7,
    title: 'Təmizlik və texniki zonalar',
    body: 'İstifadə edilmiş baxillərin (baxıl qutularının) yerə atılması, həmçinin texniki sahələrə və inzibati otaqlara giriş qəti qadağandır.',
  },
  {
    id: 8,
    title: 'Meydança girişi',
    body: 'Meydançanın girişində valideynlərin toplaşması və müəyyən olunmuş yerlərdən başqa ərazilərə daxil olmaq qəti qadağandır.',
  },
  {
    id: 9,
    title: 'Alətlər və əmlaka ziyan',
    body: 'Arena ərazisinə kəsici və ya deşici alətlərlə daxil olmaq, arena daxilindəki əşyalara və avadanlıqlara zərər vermək qəti qadağandır.',
  },
  {
    id: 10,
    title: 'Metal əşyalar',
    body: 'Buz meydançasına daxil olarkən sırğa, üzük, qolbaq, saat, boyunbağı və açar kimi metal əşyaların istifadəsi, eləcə də uşaqlar qucaqda olarkən buz üzərinə çıxmaq qəti qadağandır.',
  },
  {
    id: 11,
    title: 'İşçi heyətinə münasibət',
    body: 'İşçilərə qarşı kobud, təhqiredici və qanunsuz rəftar qəti qadağandır. Belə halda şəxs ərazidən uzaqlaşdırılır və bilet ləğv edilir.',
  },
]

// Əlavə şərtlər və vacib tövsiyələr
export const EXTRA_TERMS = [
  {
    title: 'Ödənişin geri qaytarılması',
    body: 'Sessiyanın başlanğıcından 10 dəqiqə ərzində zədə aldığınızda və ya buz üzərində hərəkət edə bilmədiyinizi bildirdiyinizdə ödəniş geri qaytarılır. Bu müddət bitdikdən sonra ödəniş geri qaytarılmır.',
  },
  {
    title: 'Məsuliyyətin bölüşdürülməsi',
    body: 'Arena itirilmiş və unudulmuş əşyalara, şəxsi əşyaların şifrə təhlükəsizliyinə, habelə arena ərazisindəki kənar şəxslərin əməllərinə görə məsuliyyət daşımır.',
  },
  {
    title: 'Hərəkət istiqaməti və təlimatlar',
    body: 'Meydançada yalnız saat əqrəbinin əksi istiqamətində irəliləmək, işçi heyətinin təlimatlarına dəqiq əməl etmək və şübhəli davranış müşahidə etdiyinizdə dərhal mühafizə xidmətinə məlumat vermək vacibdir.',
  },
]

// Müştəri öhdəlikləri (təsdiq bölməsi)
export const OBLIGATIONS = [
  {
    id: 'rules',
    text: 'Kompleksin təhlükəsizlik tədbirləri, istifadə şərtləri və qayda-qanunları ilə tanış oldum və onlara əməl etməyi öhdəmə götürürəm.',
  },
  {
    id: 'responsibility',
    text: 'Özümün və gətirdiyim uşaqların həyatı, sağlamlığı və təhlükəsizliyi üçün bütün məsuliyyəti daşıyıram — hətta işçi heyətinin nəzarəti olmasa belə.',
  },
  {
    id: 'noClaim',
    text: 'İstənilən halda zədə alacağı təqdirdə işçi heyətinə və kompleksə qarşı heç bir iddia və tələb qaldırmayacağam.',
  },
  {
    id: 'media',
    text: 'Arena tərəfindən aparılan video və foto çəkilişlərinə etiraz etmirəm.',
  },
]
