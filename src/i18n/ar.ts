import { calendarHighlightsAr } from "@/data/calendar-highlights.ar";
import { milestonesAr } from "@/data/milestones.ar";
import type { Dictionary } from "./types";

const hijriMonths: Record<string, string> = {
  Muharam: "محرم",
  Safar: "صفر",
  Rabiulawal: "ربيع الأول",
  Rabiulakhir: "ربيع الآخر",
  Jumadilawal: "جمادى الأولى",
  Jumadilakhir: "جمادى الآخرة",
  Rajab: "رجب",
  Syakban: "شعبان",
  Ramadan: "رمضان",
  Syawal: "شوال",
  Zulkaidah: "ذو القعدة",
  Zulhijah: "ذو الحجة",
};

const gregorianMonths: Record<string, string> = {
  Januari: "يناير",
  Februari: "فبراير",
  Maret: "مارس",
  April: "أبريل",
  Mei: "مايو",
  Juni: "يونيو",
  Juli: "يوليو",
  Agustus: "أغسطس",
  September: "سبتمبر",
  Oktober: "أكتوبر",
  November: "نوفمبر",
  Desember: "ديسمبر",
};

const gregorianMonthList = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export const ar: Dictionary = {
  lang: "ar",
  dir: "rtl",
  locale: "ar-EG-u-nu-latn",
  meta: {
    title: "تنوير والذكرى الـ114 للمحمدية — معًا نوحّد الأمة",
    description:
      "موقع تفاعلي لتنوير والذكرى الـ114 لجمعية المحمدية. بالو، 19–21 نوفمبر 2026م | 10–12 جمادى الآخرة 1448هـ. مسار 114 عامًا، وتقويم KHGT، وأخبار رسمية، وخريطة عالمية.",
    tagline: "معًا نوحّد الأمة",
  },
  common: {
    source: "المصدر",
    read: "اقرأ",
    open: "افتح",
    verified: "موثّق",
    language: "اللغة",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    skipToContent: "تجاوز إلى المحتوى",
    skipIntro: "تخطي المقدمة",
  },
  nav: {
    links: [
      { href: "#jelajah", label: "استكشف" },
      { href: "#sejarah", label: "التاريخ" },
      { href: "#layanan", label: "الخدمات" },
      { href: "#peta", label: "الخريطة" },
    ],
    cta: "استكشف المسار",
    menuOpen: "افتح القائمة",
    menuClose: "أغلق القائمة",
    language: "اللغة",
    themeLight: "الوضع الفاتح",
    themeDark: "الوضع الداكن",
    themeToggle: "تغيير المظهر",
  },
  hero: {
    edition: "الإصدار 114 · بالو 2026",
    eventLine: "تنوير والذكرى الـ114 للمحمدية",
    dateLine: "19–21 نوفمبر 2026 · 10–12 جمادى الآخرة 1448هـ",
    eyebrow: "تنوير والذكرى الـ114 للمحمدية",
    titleLine1: "معًا",
    titleLine2: "نوحّد الأمة",
    subtitle: "تنوير والذكرى الـ114 لجمعية المحمدية",
    intro:
      "على مدى 114 عامًا نمت المحمدية من كاومان لتصبح شجرة وارفة تظلّل الأمة. تصفّح مسارها، ثم افتح ثلاثة اتجاهات: التاريخ والخدمات والخريطة.",
    ctaPrimary: "استكشف 114 عامًا",
    ctaSecondary: "افتح الخدمات",
    share: "شارك",
    shareText:
      "تنوير والذكرى الـ114 لجمعية المحمدية — معًا نوحّد الأمة. بالو، 19–21 نوفمبر 2026.",
    languageLine: "اقرأ باللغة",
    plate: {
      identity: "الهوية الرسمية",
      city: "بالو 2026",
      logoAlt:
        "الشعار الرسمي لتنوير والذكرى الـ114 لجمعية المحمدية — معًا نوحّد الأمة، بالو 19–21 نوفمبر 2026",
      caption: "الشعار الرسمي · تنوير والذكرى الـ114",
      statLeft: "الجذر 1912",
      statCenter: "الظلة 2026",
      statRight: "114 عامًا",
      stampTop: "114",
      stampBottom: "عامًا",
    },
  },
  countdown: {
    beforeLabel: "نحو تنوير والذكرى",
    duringLabel: "تنوير والذكرى جاريان",
    miladLabel: "نحو الذكرى الـ114",
    doneLabel: "انقضت الذكرى الـ114",
    beforeNote: "بالو · 19–21 نوفمبر 2026",
    duringNote: "بالو · 19–21 نوفمبر 2026",
    miladNote: "18 نوفمبر 2026",
    doneNote: "شكرًا لك على الاستكشاف",
    wita: "WITA",
    days: "أيام",
    hours: "ساعات",
    minutes: "دقائق",
    seconds: "ثوانٍ",
  },
  gates: {
    eyebrow: "فهرس الاستكشاف",
    title: "شجرة واحدة، ثلاثة اتجاهات",
    description:
      "اختر الجزء الذي تريد فتحه. كل اتجاه يقود إلى جزء من الشجرة نفسها.",
    open: "افتح",
    items: [
      {
        number: "01",
        label: "الجذر",
        title: "مسار 114 عامًا",
        description:
          "من كاومان عام 1912 إلى بالو عام 2026، في ستة فصول مترابطة.",
        href: "#sejarah",
        accent: "teal",
      },
      {
        number: "02",
        label: "الساق",
        title: "خدمات المحمدية",
        description:
          "تقويم KHGT والأخبار الرسمية في مكتب خدمات واحد.",
        href: "#layanan",
        accent: "navy",
      },
      {
        number: "03",
        label: "الظلة",
        title: "الانتشار العالمي",
        description:
          "خريطة 29 قيادة فرع خاص للمحمدية في أنحاء العالم.",
        href: "#peta",
        accent: "gold",
      },
    ],
  },
  tree: {
    eyebrow: "شجرة واحدة",
    titleLine1: "تنمو من",
    titleLine2: "الجذر نفسه.",
    description:
      "الجذر يحفظ التاريخ. الساق تحمل الخدمات. الظلة تحتضن الانتشار العالمي. هذه الفروع الثلاثة هي ثلاثة اتجاهات يمكنك فتحها.",
    legend: [
      {
        number: "01",
        label: "الجذر",
        title: "مسار 114 عامًا",
        description: "تاريخ طويل من كاومان إلى بالو.",
        href: "#sejarah",
        accent: "teal",
      },
      {
        number: "02",
        label: "الساق",
        title: "خدمات المحمدية",
        description: "التقويم والأخبار.",
        href: "#layanan",
        accent: "navy",
      },
      {
        number: "03",
        label: "الظلة",
        title: "الانتشار العالمي",
        description: "29 قيادة فرع خاص في خمس مناطق.",
        href: "#peta",
        accent: "gold",
      },
    ],
    annotations: {
      kanopi: "الظلة — الخريطة العالمية",
      akar: "الجذر — التاريخ",
      batang: "الساق — الخدمات",
    },
    stampTop: "114",
    stampBottom: "عامًا",
    caption:
      "رُسمت الشجرة بخوارزمية استعمار الفضاء (Runions وآخرون، 2007)، وأُعيد تنفيذها لهذا المشروع.",
  },
  about: {
    eyebrow: "عن الذكرى",
    title: "تنمو من ورقة واحدة",
    description:
      "يجمع شعار تنوير والذكرى الـ114 بين أوراق المورينغا والرقم 114. والمورينغا ليست زينة فقط: فهي تنمو في بالو وتتحمل الظروف وتقدّم المنفعة.",
    paragraphs: [
      "يدعو شعار «معًا نوحّد الأمة» إلى التجمع الموجه نحو العدل والازدهار والرفاه والأخلاق والعلم والتقنية، ويرتبط بسورة الحجرات الآيتين 10 و13.",
      "وفي إطار البرنامج، غرس المنظمون 114 شجرة مورينغا في بالو. يلتقي الرقم 114 بالجذر والساق والظلة: مسيرة طويلة تظل راسخة في المنفعة.",
    ],
    facts: [
      { label: "المدينة المستضيفة", value: "بالو، سولاويسي الوسطى" },
      { label: "التاريخ", value: "19–21 نوفمبر 2026" },
      { label: "الهجري", value: "10–12 جمادى الآخرة 1448هـ" },
      { label: "الرمز", value: "ورقة المورينغا والرقم 114" },
    ],
    quote:
      "اختيرت المورينغا لأنها قوية وبسيطة ونافعة. تنمو في بالو وتصبح رمزًا للصمود.",
    link: "اقرأ معنى الشعار",
  },
  agenda: {
    eyebrow: "الأجندة",
    title: "ثلاث علامات زمنية",
    description:
      "تواريخ الفعالية والتاريخ التاريخي والاتجاه التالي. التفاصيل تتبع تعميم PP المحمدية رقم 19/EDR/I.0/B/2026.",
    items: [
      {
        date: "19–21 نوفمبر 2026",
        title: "تنوير والذكرى الـ114",
        description:
          "بالو، سولاويسي الوسطى. البرنامج الرئيسي لتنوير والذكرى، الموافق 10–12 جمادى الآخرة 1448هـ.",
        tag: "بالو",
      },
      {
        date: "18 نوفمبر 2026",
        title: "الذكرى الـ114 للمحمدية",
        description:
          "الذكرى التاريخية، إحياءً لتأسيس المحمدية في 18 نوفمبر 1912 / 8 ذي الحجة 1330هـ.",
        tag: "الذكرى",
      },
      {
        date: "2027",
        title: "المؤتمر الـ49",
        description:
          "ميدان، سومطرة الشمالية. تنوير 2026 منصة تقييم واستعداد قبل المؤتمر.",
        tag: "2027",
      },
    ],
    button: "افتح التعميم",
  },
  history: {
    eyebrow: "الجذر",
    title: "مسار 114 عامًا",
    description:
      "من غرفة معيشة في كاومان إلى ظلة تظلّل بالو. تتتبع هذه الفصول الستة جذر المحمدية وساقها وظلتها، مع مصادر رسمية في كل خطوة.",
    mapEyebrow: "خريطة الرحلة",
    source: "المصدر",
    verified: "موثّق",
    ctaEyebrow: "من الجذر إلى الأمام",
    ctaTitle: "لهذه الشجرة ساق تحمل الخدمات.",
    ctaDescription:
      "افتح تقويم KHGT وأخبار المحمدية الرسمية في قسم الخدمات.",
    ctaButton: "افتح الخدمات",
    chapters: milestonesAr,
  },
  services: {
    eyebrow: "الساق",
    title: "خدمات المحمدية",
    description:
      "خدمتان تحملان الشجرة: تقويم KHGT الرسمي وأحدث أخبار المحمدية.",
    calendarTitle: "التقويم الهجري العالمي الموحد",
    calendarDescription:
      "تُزامن بيانات التقويم من KHGT. عرض الشهر والأيام المميزة ومحول الميلادي–الهجري يستخدم نسخة رسمية، لا مكتبة عامة.",
    highlightsTitle: "علامات الذكرى",
    highlightsLink: "افتح KHGT",
    kabarTitle: "أخبار المحمدية الرسمية",
    kabarDescription:
      "تُجلب من القناة الرسمية للمحمدية، مع تخزين مؤقت لساعة ونسخة احتياطية. تبقى المقالات الكاملة في المصدر الأصلي.",
    sourceTitle: "ملاحظات المصادر",
    sourceDescription:
      "التقويم من KHGT؛ والأخبار من القناة الرسمية للمحمدية. وإذا تعذر تحميل البيانات الرسمية، تعرض الصفحة آخر نسخة محفوظة ورابطًا إلى المصدر.",
  },
  calendar: {
    locale: "ar-EG-u-nu-latn",
    hijriTab: "هجري KHGT",
    masehiTab: "ميلادي",
    fullCalendar: "اعرض التقويم الكامل على KHGT",
    prev: "الشهر السابق",
    next: "الشهر التالي",
    specialDays: "أيام مميزة",
    noSpecial: "لا توجد أيام مميزة في هذا الشهر.",
    converter: "محول التاريخ",
    masehiLabel: "التاريخ الميلادي",
    masehiButton: "ابحث عن الهجري",
    hijriMonthLabel: "الشهر الهجري",
    hijriDayLabel: "اليوم",
    hijriYearLabel: "السنة",
    hijriButton: "ابحث عن الميلادي",
    placeholder: "اختر تاريخًا لعرض المقابل الميلادي–الهجري.",
    notFound: "التاريخ غير موجود في نسخة KHGT لعام 2026.",
    source: "المصدر",
    snapshot: "نسخة",
    disclaimer: "هذا التقويم ليس بديلًا عن تقويم KHGT الرسمي.",
    weekdays: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
    hijriMonths,
    gregorianMonths,
    gregorianMonthList,
    eventNames: {
      "Ayyamul Bidh": "أيام البيض",
      "Hari Tasua": "تاسوعاء",
      "Hari Asyuro": "عاشوراء",
      "Hari Tahun baru Islam (Hijriah)": "رأس السنة الهجرية",
      "Hari Tahun Baru Islam (Hijriah)": "رأس السنة الهجرية",
    },
    miladLabel: "الذكرى",
  },
  kabar: {
    eyebrow: "الأخبار",
    title: "أخبار من المحمدية",
    description:
      "أحدث الأخبار من القناة الرسمية للمحمدية. ملخصات قصيرة مع روابط إلى المصدر الأصلي.",
    all: "اعرض كل الأخبار",
    source: "المصدر",
    sourceNote: "تُحدّث البيانات تلقائيًا مع تخزين مؤقت لساعة.",
    originalNote:
      "العناوين والملخصات من المصدر الرسمي؛ النص الأصلي بالإندونيسية.",
    empty:
      "الأخبار الرسمية غير متاحة حاليًا. افتح muhammadiyah.or.id مباشرة.",
    read: "اقرأ على muhammadiyah.or.id",
    tabs: {
      latest: "الأحدث",
      milad: "الذكرى وتنوير",
    },
  },
  map: {
    eyebrow: "الظلة",
    title: "المحمدية في العالم",
    description:
      "لم تنمُ المحمدية في إندونيسيا وحدها. تنتشر 29 قيادة فرع خاص في أفريقيا وآسيا وأوروبا والأمريكيتين وأوقيانوسيا.",
    count: "29 قيادة فرع خاص",
    note: "تستخدم خريطة العالم بيانات Natural Earth. النقاط تشير إلى مدن مقر PCIM؛ والحدود للاسترشاد فقط.",
    source: "المصدر",
    aria: "خريطة عالمية تبرز الدول الـ29 لـ PCIM المحمدية.",
    countryList: "دول PCIM",
    cityLabel: "المدينة",
    regions: {
      africa: "أفريقيا",
      asia: "آسيا",
      europe: "أوروبا",
      americas: "الأمريكيتان",
      oceania: "أوقيانوسيا",
    },
  },
  footer: {
    tagline:
      "شجرة واحدة، ثلاثة اتجاهات: التاريخ والخدمات والخريطة. عمل مستقل لمشاركة في مسابقة موقع إلكتروني.",
    explore: "استكشف",
    sources: "المصادر الرسمية",
    event: "الذكرى الـ114",
    eventLines: [
      "بالو، سولاويسي الوسطى",
      "19–21 نوفمبر 2026",
      "10–12 جمادى الآخرة 1448هـ",
    ],
    credit:
      "الشعار والهوية البصرية ملك PP المحمدية. وخطا El Messiri وFamiljen Grotesk مرخصان بموجب OFL.",
    copyright: "© 2026 ذكرى 114 — عمل مستقل لمسابقة موقع إلكتروني.",
    dataNote:
      "بيانات التقويم: KHGT. بيانات الأخبار: muhammadiyah.or.id. تُراجع قبل النشر.",
    language: "اللغة",
  },
  notFound: {
    title: "هذا الباب ليس على الشجرة بعد.",
    description:
      "عد إلى الصفحة الرئيسية، أو استكشف مسار 114 عامًا، أو افتح خدمات المحمدية.",
    home: "عد إلى الذكرى",
    history: "مسار 114 عامًا",
    services: "الخدمات",
  },
  highlights: calendarHighlightsAr,
};
