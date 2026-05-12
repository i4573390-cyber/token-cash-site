"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

const TELEGRAM_URL = "https://t.me/TokenCashExchange";
const TELEGRAM_HANDLE = "@TokenCashExchange";
const LOGO_SRC = "/logo.webp";

const countries = [
  { ru: "Россия", en: "Russia", code: "RU", fiat: "RUB", markup: 1.027 },
];

const exchangeCities = [
  { ru: "Архангельск", en: "Arkhangelsk" },
  { ru: "Балашиха", en: "Balashikha" },
  { ru: "Барнаул", en: "Barnaul" },
  { ru: "Белгород", en: "Belgorod" },
  { ru: "Брянск", en: "Bryansk" },
  { ru: "Владивосток", en: "Vladivostok" },
  { ru: "Волгоград", en: "Volgograd" },
  { ru: "Воронеж", en: "Voronezh" },
  { ru: "Екатеринбург", en: "Yekaterinburg" },
  { ru: "Иваново", en: "Ivanovo" },
  { ru: "Ижевск", en: "Izhevsk" },
  { ru: "Иркутск", en: "Irkutsk" },
  { ru: "Казань", en: "Kazan" },
  { ru: "Калининград", en: "Kaliningrad" },
  { ru: "Кемерово", en: "Kemerovo" },
  { ru: "Киров", en: "Kirov" },
  { ru: "Краснодар", en: "Krasnodar" },
  { ru: "Красноярск", en: "Krasnoyarsk" },
  { ru: "Курск", en: "Kursk" },
  { ru: "Липецк", en: "Lipetsk" },
  { ru: "Магнитогорск", en: "Magnitogorsk" },
  { ru: "Махачкала", en: "Makhachkala" },
  { ru: "Москва", en: "Moscow" },
  { ru: "Набережные Челны", en: "Naberezhnye Chelny" },
  { ru: "Нижний Новгород", en: "Nizhny Novgorod" },
  { ru: "Нижний Тагил", en: "Nizhny Tagil" },
  { ru: "Новосибирск", en: "Novosibirsk" },
  { ru: "Омск", en: "Omsk" },
  { ru: "Оренбург", en: "Orenburg" },
  { ru: "Пенза", en: "Penza" },
  { ru: "Пермь", en: "Perm" },
  { ru: "Ростов-на-Дону", en: "Rostov-on-Don" },
  { ru: "Самара", en: "Samara" },
  { ru: "Санкт-Петербург", en: "Saint Petersburg" },
  { ru: "Саратов", en: "Saratov" },
  { ru: "Севастополь", en: "Sevastopol" },
  { ru: "Сочи", en: "Sochi" },
  { ru: "Ставрополь", en: "Stavropol" },
  { ru: "Сургут", en: "Surgut" },
  { ru: "Тверь", en: "Tver" },
  { ru: "Тольятти", en: "Tolyatti" },
  { ru: "Томск", en: "Tomsk" },
  { ru: "Тула", en: "Tula" },
  { ru: "Тюмень", en: "Tyumen" },
  { ru: "Ульяновск", en: "Ulyanovsk" },
  { ru: "Уфа", en: "Ufa" },
  { ru: "Хабаровск", en: "Khabarovsk" },
  { ru: "Чебоксары", en: "Cheboksary" },
  { ru: "Челябинск", en: "Chelyabinsk" },
  { ru: "Ярославль", en: "Yaroslavl" },
];

const countryCities = {
  RU: exchangeCities.map((city) => city.ru),
};

const countryCitiesEn = {
  RU: exchangeCities.map((city) => city.en),
};

const activeMapCountries = [
  { code: "RU", names: ["Russia", "Russian Federation"] },
];

const crypto = ["USDT", "BTC", "ETH", "BNB", "SOL", "USDC"];
const fiat = ["RUB", "USD", "EUR", "KZT", "TRY", "AED", "THB"];
const currencies = [...crypto, ...fiat];

const fallbackUsdRates = {
  USDT: 1,
  USDC: 1,
  USD: 1,
  BTC: 68000,
  ETH: 3200,
  BNB: 580,
  SOL: 145,
  AED: 0.272,
  AMD: 0.00258,
  BYN: 0.305,
  IDR: 0.000061,
  INR: 0.012,
  KGS: 0.0114,
  EUR: 1.08,
  KZT: 0.0021,
  RUB: 0.0108,
  TRY: 0.031,
  THB: 0.0275,
  UZS: 0.000079,
};

const cryptoPriceIds = {
  USDT: "tether",
  USDC: "usd-coin",
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
};

const cryptoIds = Object.values(cryptoPriceIds).join(",");

async function fetchMarketUsdRates() {
  try {
    const [fiatResponse, cryptoResponse] = await Promise.all([
      fetch("https://open.er-api.com/v6/latest/USD"),
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd`),
    ]);

    if (!fiatResponse.ok || !cryptoResponse.ok) {
      console.warn("Rate API request failed. Fallback rates are used.");
      return fallbackUsdRates;
    }

    const fiatData = await fiatResponse.json();
    const cryptoData = await cryptoResponse.json();
    const nextRates = { ...fallbackUsdRates };

    fiat.forEach((code) => {
      const usdToFiatRate = fiatData?.rates?.[code];
      if (usdToFiatRate) nextRates[code] = 1 / usdToFiatRate;
    });

    crypto.forEach((code) => {
      const coinId = cryptoPriceIds[code];
      const priceUsd = cryptoData?.[coinId]?.usd;
      if (priceUsd) nextRates[code] = priceUsd;
    });

    return nextRates;
  } catch (error) {
    console.warn("Rate API unavailable. Fallback rates are used.", error);
    return fallbackUsdRates;
  }
}

const content = {
  ru: {
    nav: ["Обмен", "Как проходит", "Города", "Преимущества", "Отзывы", "FAQ"],
    links: ["#exchange", "#steps", "#countries", "#benefits", "#reviews", "#faq"],
    contact: "Контакты",
    title: "Обмен криптовалют в офисе",
    subtitle: "Лучшие курсы для новых и постоянных клиентов. Обмен криптовалюты за наличные в офисах Token Cash по городам России.",
    start: "Совершить обмен",
    tg: "Написать в Telegram",
    formSmall: "Заявка на обмен",
    formTitle: "Оформить сделку",
    country: "Город обмена",
    give: "Вы отдаёте",
    receive: "Вы получаете",
    submit: "Зафиксировать курс",
    stepsTitle: "Как проходит обмен",
    benefitsTitle: "Почему выбирают Token Cash",
    countriesTitle: "Города Token Cash в России",
    countriesText: "Token Cash работает в России. Выберите город, направление обмена и свяжитесь с менеджером для согласования курса и времени визита в офис.",
    countryList: "Города присутствия",
    reviewsTitle: "Отзывы клиентов",
    faqTitle: "Вопросы и ответы",
    finalTitle: "Готовы совершить обмен?",
    finalText: "Напишите менеджеру Token Cash — согласуем город, сумму, направление и удобное время визита в офис.",
    steps: [
      ["01", "Оставьте заявку", "Выберите город, направление обмена и сумму. Затем напишите менеджеру в Telegram."],
      ["02", "Подтвердите условия", "Менеджер согласует курс, доступность направления и удобное время визита."],
      ["03", "Приезжайте в офис", "Адрес и детали визита отправляются после подтверждения заявки."],
      ["04", "Проведите обмен", "Сделка завершается на месте: наличные или криптовалюта передаются после проверки."],
    ],
    benefits: [
      ["🏢", "Офисная сделка", "Сделка проходит в офисе после согласования курса и времени визита."],
      ["✓", "Без предоплаты", "Не просим отправлять средства заранее. Условия подтверждает менеджер."],
      ["🔒", "Конфиденциально", "Минимум лишних действий и персональное сопровождение сделки."],
      ["⏱️", "Быстро", "Заявка обрабатывается менеджером, сделка проводится в согласованное время."],
      ["₿", "Наличные и крипта", "Работаем с USDT, BTC, ETH, BNB, SOL, USDC и локальными валютами."],
      ["☕️", "Комфортный офис", "Кассовая зона, зона ожидания, переговорная и отдельная coffee-зона."],
    ],
    reviews: [
      ["Алексей", "Менеджер быстро согласовал курс, приехал в офис и провёл обмен без лишних вопросов."],
      ["Марина", "Понравилось, что сделка проходила на месте. Никакой предоплаты, всё подтвердили заранее."],
      ["Дмитрий", "Обменял USDT на наличные. Офис аккуратный, деньги получил после проверки."],
      ["Игорь", "Нужна была крупная сумма наличными. Всё заранее согласовали, сделка прошла быстро."],
      ["Анна", "Удобно: сначала условия в Telegram, потом визит в офис на готовую сделку."],
      ["Руслан", "Курс подтвердили до визита, на месте ничего не меняли."],
      ["Екатерина", "Офис аккуратный, есть зона ожидания, процесс объяснили простыми словами."],
      ["Сергей", "Менял крипту на наличные. Быстро, конфиденциально, без лишней бюрократии."],
    ],
    faq: [
      ["Нужно ли отправлять деньги заранее?", "Нет. Условия подтверждаются менеджером, обмен проводится в согласованном формате."],
      ["Как фиксируется курс?", "Курс подтверждается менеджером перед визитом. Финальные условия зависят от суммы, города и направления."],
      ["Где находится офис?", "Точный адрес отправляется в Telegram после согласования заявки и времени визита."],
      ["Какие города доступны?", "Token Cash работает в городах России из списка на сайте. Выберите нужный город и напишите менеджеру для согласования деталей визита."],
      ["Какие валюты поддерживаются?", "Фиат: RUB, USD, EUR, KZT, TRY, AED, THB. Крипта: USDT, BTC, ETH, BNB, SOL, USDC."],
    ],
  },
  en: {
    nav: ["Exchange", "Process", "Cities", "Benefits", "Reviews", "FAQ"],
    links: ["#exchange", "#steps", "#countries", "#benefits", "#reviews", "#faq"],
    contact: "Contacts",
    title: "Crypto exchange in office",
    subtitle: "Best rates for new and returning clients. Crypto exchange for cash in Token Cash offices across Russian cities.",
    start: "Start exchange",
    tg: "Message Telegram",
    formSmall: "Exchange request",
    formTitle: "Create request",
    country: "Exchange city",
    give: "You send",
    receive: "You receive",
    submit: "Lock the rate",
    stepsTitle: "How exchange works",
    benefitsTitle: "Why choose Token Cash",
    countriesTitle: "Token Cash cities in Russia",
    countriesText: "Token Cash operates in Russia. Select a city, exchange direction and contact a manager to confirm the rate and office visit time.",
    countryList: "Available cities",
    reviewsTitle: "Client reviews",
    faqTitle: "Questions and answers",
    finalTitle: "Ready to exchange?",
    finalText: "Contact Token Cash manager — we will confirm city, amount, direction and office visit time.",
    steps: [
      ["01", "Submit request", "Choose city, exchange direction and amount. Then contact a manager on Telegram."],
      ["02", "Confirm terms", "Manager confirms rate, availability and convenient visit time."],
      ["03", "Visit office", "Office address and visit details are sent after confirmation."],
      ["04", "Complete exchange", "The transaction is completed in office after verification."],
    ],
    benefits: [
      ["🏢", "Office transaction", "The transaction is completed in office after rate and visit time are confirmed."],
      ["✓", "No prepayment", "We do not ask you to send funds before conditions are agreed."],
      ["🔒", "Private", "Minimum extra steps and personal transaction support."],
      ["⏱️", "Fast", "Your request is processed by a manager and completed at the agreed time."],
      ["₿", "Cash and crypto", "We support USDT, BTC, ETH, BNB, SOL, USDC and local currencies."],
      ["☕️", "Comfortable office", "Cashier area, waiting zone, meeting room and separate coffee zone."],
    ],
    reviews: [
      ["Alex", "Manager confirmed the rate quickly. I visited the office and completed the exchange without unnecessary steps."],
      ["Marina", "I liked that the deal was done in office. No prepayment, details confirmed in Telegram."],
      ["Dmitry", "Exchanged USDT to cash. Clean office, clear process, received cash after verification."],
      ["Igor", "Needed a larger cash amount. Everything was agreed in advance and done quickly."],
      ["Anna", "Convenient: first terms in Telegram, then visit the office for a prepared transaction."],
      ["Ruslan", "The rate was confirmed before the visit and did not change on site."],
      ["Ekaterina", "The office is neat and comfortable. The manager explained the process clearly."],
      ["Sergey", "Exchanged crypto to cash. Fast, private and without unnecessary bureaucracy."],
    ],
    faq: [
      ["Do I need to send funds in advance?", "No. Terms are confirmed by a manager and exchange is completed as agreed."],
      ["How is the rate fixed?", "The rate is confirmed before the visit. Final terms depend on amount, city and exchange direction."],
      ["Where is the office located?", "The exact address is sent in Telegram after request and visit time are confirmed."],
      ["Which cities are available?", "Token Cash operates in Russian cities listed on the website. Select your city and contact a manager to confirm visit details."],
      ["Which currencies are supported?", "Fiat: RUB, USD, EUR, KZT, TRY, AED, THB. Crypto: USDT, BTC, ETH, BNB, SOL, USDC."],
    ],
  },
};

const trustBadges = {
  ru: [
    ["✓", "Без предоплаты"],
    ["🏢", "Сделка в офисе"],
    ["🔒", "Конфиденциально"],
  ],
  en: [
    ["✓", "No prepayment"],
    ["🏢", "Office transaction"],
    ["🔒", "Private"],
  ],
};

const processIcons = ["✍️", "📈", "🏢", "💸"];

function formatCityCount(count, lang) {
  if (lang !== "ru") return `${count} ${count === 1 ? "city" : "cities"}`;
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (lastDigit === 1 && lastTwoDigits !== 11) return `${count} город`;
  if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) return `${count} города`;
  return `${count} городов`;
}

function TelegramIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.8 4.2c.3-1.3-.9-2.2-2.1-1.7L3.4 8.8c-1.4.5-1.3 2.4.1 2.8l4.1 1.2 1.6 5.1c.4 1.2 1.9 1.5 2.7.6l2.3-2.7 4.3 3.1c1.1.8 2.6.2 2.9-1.1l.4-13.6ZM8.4 11.8l8.9-5.5-6.8 7.1-.3 3.2-1.1-3.6-.7-1.2Z" />
    </svg>
  );
}

function BrandLogo({ variant = "header" }) {
  const sizes = {
    header: "w-24 sm:w-28 lg:w-32",
    hero: "w-[220px] sm:w-[300px] lg:w-[380px]",
  };

  return (
    <img
      src={LOGO_SRC}
      alt="Token Cash"
      className={`${sizes[variant]} h-auto object-contain`}
      loading={variant === "hero" ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

function LogoMark() {
  return <BrandLogo variant="header" />;
}

function LangSwitch({ lang, setLang }) {
  return (
    <div className="flex rounded-full border border-white/10 bg-white/[.045] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
      {[
        ["ru", "RU"],
        ["en", "EN"],
      ].map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setLang(key)}
          className={`rounded-full px-4 py-2 text-sm font-black transition ${
            lang === key
              ? "bg-gradient-to-r from-violet-500 via-violet-400 to-cyan-300 text-white shadow-[0_0_28px_rgba(139,92,246,.45)]"
              : "text-zinc-400 hover:bg-white/[.06] hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function TetherOrb() {
  return (
    <div className="relative mx-auto h-[400px] w-[400px] sm:h-[500px] sm:w-[500px] lg:h-[620px] lg:w-[620px]">
      <div className="absolute inset-[-10%] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,.20)_0%,rgba(34,211,238,.13)_34%,rgba(0,0,0,0)_72%)] blur-3xl" />

      <motion.div className="absolute inset-0" animate={{ y: [0, -7, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
        <img
          src="/eth.webp"
          alt="Ethereum coin"
          className="absolute left-[50%] top-[34%] z-20 h-auto w-[150px] -translate-x-1/2 -translate-y-1/2 select-none object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,.42)] pointer-events-none sm:w-[190px] lg:w-[245px]"
          loading="eager"
          decoding="async"
          draggable="false"
        />

        <img
          src="/btc.webp"
          alt="Bitcoin coin"
          className="absolute left-[32%] top-[55%] z-20 h-auto w-[165px] -translate-x-1/2 -translate-y-1/2 select-none object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,.42)] pointer-events-none sm:w-[210px] lg:w-[270px]"
          loading="eager"
          decoding="async"
          draggable="false"
        />

        <img
          src="/tether.webp"
          alt="Tether coin"
          className="absolute left-[61%] top-[60%] z-30 h-auto w-[250px] -translate-x-1/2 -translate-y-1/2 select-none object-contain drop-shadow-[0_34px_90px_rgba(139,92,246,.28)] pointer-events-none sm:w-[330px] lg:w-[430px]"
          loading="eager"
          decoding="async"
          draggable="false"
        />

        <div className="absolute left-[32%] top-[62%] z-10 h-[28px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/35 blur-2xl sm:w-[200px] lg:w-[260px]" />
        <div className="absolute left-[50%] top-[40%] z-10 h-[26px] w-[145px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 blur-2xl sm:w-[185px] lg:w-[230px]" />
        <div className="absolute left-[61%] top-[68%] z-10 h-[38px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 blur-2xl sm:w-[330px] lg:w-[420px]" />
      </motion.div>
    </div>
  );
}

function RotatingOrb() {
  return (
    <div className="relative mx-auto flex h-[320px] w-full max-w-[420px] items-center justify-center sm:h-[430px] sm:max-w-[520px] lg:h-[540px] lg:max-w-[620px]">
      <TetherOrb />
    </div>
  );
}

function CustomSelect({ value, options, onChange, name, openName, setOpenName, className = "" }) {
  const open = openName === name;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpenName(open ? null : name)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/25 p-2 text-left text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.07)] transition hover:border-violet-300/35 hover:bg-white/[.06]"
      >
        <span>{value}</span>
        <span className={`text-zinc-400 transition ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="mt-2 max-h-[230px] overflow-y-auto rounded-2xl border border-white/10 bg-[#12101c]/95 p-2 shadow-[0_18px_50px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl [scrollbar-width:thin] [scrollbar-color:rgba(139,92,246,.7)_rgba(255,255,255,.06)]">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpenName(null);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                option === value
                  ? "bg-gradient-to-r from-violet-500/75 to-cyan-300/50 text-white"
                  : "text-zinc-300 hover:bg-white/[.06] hover:text-white"
              }`}
            >
              <span>{option}</span>
              {option === value && <span className="text-xs text-white/80">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function ExchangeForm({ t, lang }) {
  const moscowIndex = exchangeCities.findIndex((city) => city.ru === "Москва");
  const [cityIndex, setCityIndex] = useState(moscowIndex >= 0 ? moscowIndex : 0);
  const [cityOpen, setCityOpen] = useState(false);
  const [give, setGive] = useState("USDT");
  const [receive, setReceive] = useState("RUB");
  const [amount, setAmount] = useState("1000");
  const [marketUsdRates, setMarketUsdRates] = useState(fallbackUsdRates);
  const [selectOpen, setSelectOpen] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function updateRates() {
      const nextRates = await fetchMarketUsdRates();
      if (isMounted) setMarketUsdRates(nextRates);
    }

    updateRates();
    const timer = setInterval(updateRates, 60000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const selectedCity = exchangeCities[cityIndex] || exchangeCities[0];
  const markup = countries[0]?.markup || 1;
  const numericAmount = Number(String(amount).replace(",", ".")) || 0;
  const marketRate = marketUsdRates[give] && marketUsdRates[receive] ? marketUsdRates[give] / marketUsdRates[receive] : 0;
  const clientRate = marketRate * markup;
  const result = numericAmount * clientRate;
  const formatted = result > 0 ? result.toLocaleString(lang === "ru" ? "ru-RU" : "en-US", { maximumFractionDigits: result > 100 ? 2 : 6 }) : "—";

  return (
    <div className="relative overflow-visible rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.025)_45%,rgba(34,211,238,.035))] p-4 shadow-[0_28px_90px_rgba(0,0,0,.36),inset_0_1px_0_rgba(255,255,255,.10),inset_0_-18px_40px_rgba(0,0,0,.22)] backdrop-blur-xl sm:p-5">
      <div className="relative z-10 mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-zinc-400">{t.formSmall}</div>
          <div className="text-xl font-bold text-white">{t.formTitle}</div>
        </div>
        <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">LIVE</div>
      </div>

      <label className="relative z-10 mb-2 block text-xs text-zinc-500">{t.country}</label>
      <div className="relative z-30 mb-4">
        <button
          type="button"
          onClick={() => setCityOpen((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[.055] px-4 py-3 text-left text-white shadow-[inset_0_1px_0_rgba(255,255,255,.10),inset_0_-10px_22px_rgba(0,0,0,.18)] outline-none backdrop-blur-xl transition hover:border-violet-300/30"
        >
          <span className="font-semibold">
            {lang === "ru" ? selectedCity.ru : selectedCity.en}
          </span>
          <span className={`text-zinc-300 transition ${cityOpen ? "rotate-180" : ""}`}>⌄</span>
        </button>

        {cityOpen && (
          <>
            <button type="button" aria-label="Close city select" onClick={() => setCityOpen(false)} className="fixed inset-0 z-40 cursor-default bg-transparent" />
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-[320px] overflow-y-auto rounded-2xl border border-white/10 bg-[#14101f]/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,.48),inset_0_1px_0_rgba(255,255,255,.10)] backdrop-blur-2xl [scrollbar-width:thin] [scrollbar-color:rgba(139,92,246,.65)_rgba(255,255,255,.06)]">
              {exchangeCities.map((city, index) => (
                <button
                  key={city.ru}
                  type="button"
                  onClick={() => {
                    setCityIndex(index);
                    setCityOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition ${
                    index === cityIndex ? "bg-gradient-to-r from-violet-500/35 to-cyan-300/15 text-white" : "text-zinc-300 hover:bg-white/[.06] hover:text-white"
                  }`}
                >
                  <span className="font-bold">{lang === "ru" ? city.ru : city.en}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs text-zinc-500">{t.give}</label>
          <div className="rounded-2xl border border-white/10 bg-white/[.045] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.08),inset_0_-10px_22px_rgba(0,0,0,.18)] backdrop-blur-xl">
            <input className="w-full bg-transparent text-xl font-semibold text-white outline-none" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
            <CustomSelect
              className="mt-3"
              name="give"
              value={give}
              options={currencies}
              onChange={setGive}
              openName={selectOpen}
              setOpenName={setSelectOpen}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs text-zinc-500">{t.receive}</label>
          <div className="rounded-2xl border border-white/10 bg-white/[.045] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.08),inset_0_-10px_22px_rgba(0,0,0,.18)] backdrop-blur-xl">
            <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xl font-semibold text-white">{formatted}</div>
            <CustomSelect
              className="mt-3"
              name="receive"
              value={receive}
              options={currencies}
              onChange={setReceive}
              openName={selectOpen}
              setOpenName={setSelectOpen}
            />
          </div>
        </div>
      </div>

      <a href={TELEGRAM_URL} className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-violet-400 to-cyan-300 px-5 py-4 font-bold text-white shadow-[0_0_40px_rgba(139,92,246,.35)] transition hover:brightness-110">
        {t.submit} <span>→</span>
      </a>

      <div className="relative z-10 mt-4 grid gap-3 sm:grid-cols-3">
        {trustBadges[lang].map(([icon, label]) => (
          <div key={label} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.045] px-3 py-3 text-sm font-bold text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_14px_34px_rgba(0,0,0,.18)] backdrop-blur-xl">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs text-violet-100">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DottedWorldMap({ lang, onCountrySelect, selectedCountryCode }) {
  const [mapSvg, setMapSvg] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMap() {
      try {
        const response = await fetch("/world-map.svg");
        const svgText = await response.text();

        const activeSelector = activeMapCountries
          .flatMap((country) => [
            `#${country.code}`,
            `#${country.code} path`,
            `[id="${country.code}"]`,
            `[id="${country.code}"] path`,
            ...country.names.flatMap((name) => [
              `[name="${name}"]`,
              `[name="${name}"] path`,
              `[class="${name}"]`,
              `[class="${name}"] path`,
            ]),
          ])
          .join(", ");

        const styledSvg = svgText
          .replace(/<svg/i, '<svg class="h-full w-full"')
          .replace(
            /<\/svg>/i,
            `<style>
              path {
                fill: rgba(255,255,255,.12);
                stroke: rgba(255,255,255,.10);
                stroke-width: .45;
                transition: fill .25s ease, stroke .25s ease, filter .25s ease;
              }

              ${activeSelector} {
                fill: rgba(34,211,238,.42) !important;
                stroke: rgba(103,232,249,.62) !important;
                filter: drop-shadow(0 0 8px rgba(34,211,238,.42));
              }

              ${activeSelector}:hover {
                fill: rgba(139,92,246,.55) !important;
                stroke: rgba(255,255,255,.72) !important;
              }

              .token-map-marker {
                pointer-events: auto;
                cursor: pointer;
              }

              .token-map-marker-glow {
                fill: rgba(139,92,246,.24);
                filter: blur(6px);
              }

              .token-map-marker-outer {
                fill: rgba(255,255,255,.95);
                filter: drop-shadow(0 0 8px rgba(255,255,255,.55));
              }

              .token-map-marker-inner {
                fill: rgba(139,92,246,.95);
              }

              .token-map-marker-label {
                fill: rgba(255,255,255,.86);
                font-size: 20px;
                font-weight: 700;
                text-anchor: middle;
                paint-order: stroke;
                stroke: rgba(0,0,0,.62);
                stroke-width: 5px;
                stroke-linejoin: round;
                pointer-events: none;
              }
            </style></svg>`
          );

        if (isMounted) setMapSvg(styledSvg);
      } catch (error) {
        console.error("Failed to load world map", error);
      }
    }

    loadMap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!mapSvg || !mapRef.current) return;

    const svg = mapRef.current.querySelector("svg");
    if (!svg) return;

    svg.querySelectorAll(".token-map-marker").forEach((marker) => marker.remove());

    activeMapCountries.forEach((country) => {
      const selectors = country.names
        .flatMap((name) => [
          `#${country.code}`,
          `#${country.code} path`,
          `[id="${country.code}"]`,
          `[id="${country.code}"] path`,
          `[name="${name}"]`,
          `[name="${name}"] path`,
          `[class="${name}"]`,
          `[class="${name}"] path`,
        ])
        .join(", ");

      const elements = Array.from(svg.querySelectorAll(selectors));
      if (!elements.length) return;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      elements.forEach((element) => {
        if (typeof element.getBBox !== "function") return;

        const box = element.getBBox();
        if (!box.width || !box.height) return;

        minX = Math.min(minX, box.x);
        minY = Math.min(minY, box.y);
        maxX = Math.max(maxX, box.x + box.width);
        maxY = Math.max(maxY, box.y + box.height);
      });

      if (!Number.isFinite(minX) || !Number.isFinite(minY)) return;

      const centerX = minX + (maxX - minX) / 2;
      const centerY = minY + (maxY - minY) / 2;

      const label = lang === "ru" ? countries.find((item) => item.code === country.code)?.ru || country.code : countries.find((item) => item.code === country.code)?.en || country.code;

      const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
      marker.setAttribute("class", "token-map-marker");
      marker.setAttribute("transform", `translate(${centerX} ${centerY})`);
      marker.setAttribute("role", "button");
      marker.setAttribute("tabindex", "0");
      marker.setAttribute("aria-label", label);

      const openCountry = () => {
        onCountrySelect?.(country.code);

        setTimeout(() => {
          const countryList = document.getElementById("country-list");

          if (countryList) {
            countryList.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 80);
      };

      marker.addEventListener("click", openCountry);
      marker.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openCountry();
        }
      });

      marker.innerHTML = `
        <circle class="token-map-marker-glow" r="18"></circle>
        <circle class="token-map-marker-outer" r="9"></circle>
        <circle class="token-map-marker-inner" r="4"></circle>
        <text class="token-map-marker-label" x="0" y="28">${label}</text>
      `;

      svg.appendChild(marker);
    });
  }, [mapSvg, lang, onCountrySelect, selectedCountryCode]);

  return (
    <div className="relative -mx-3 min-h-[470px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.02)_50%,rgba(139,92,246,.04))] shadow-[0_24px_80px_rgba(0,0,0,.30),inset_0_1px_0_rgba(255,255,255,.10),inset_0_-18px_36px_rgba(0,0,0,.22)] backdrop-blur-xl sm:mx-0 sm:min-h-[600px] lg:min-h-[660px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_26%_18%,rgba(139,92,246,.18),transparent_30%),radial-gradient(circle_at_76%_72%,rgba(34,211,238,.12),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/22 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={mapRef}
          className="relative h-full w-full translate-x-[-32%] translate-y-[2%] scale-[2.35] opacity-90 mix-blend-screen sm:translate-x-0 sm:translate-y-0 sm:scale-[1.40] lg:scale-[1.32] [&_svg]:h-full [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: mapSvg }}
          aria-label="Token Cash coverage map"
        />
      </div>
    </div>
  );
}

export default function TokenCashLanding() {
  const [lang, setLang] = useState("ru");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCountryCode, setOpenCountryCode] = useState("RU");

  const t = content[lang];
  const navLinks = t.nav.map((label, i) => [t.links[i], label]);

  const countryCards = useMemo(
    () =>
      countries.map((c) => ({
        ...c,
        cities: lang === "ru" ? countryCities[c.code] || [] : countryCitiesEn[c.code] || countryCities[c.code] || [],
      })),
    [lang]
  );

  return (
    <div className="min-h-screen bg-[#07070B] text-white selection:bg-violet-400 selection:text-black">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(139,92,246,.30),transparent_32%),radial-gradient(circle_at_15%_25%,rgba(57,215,182,.10),transparent_25%),linear-gradient(180deg,#07070B,#0d0915_48%,#050507)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07070B]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-6 py-4 sm:px-12">
          <LogoMark />

          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[.035] p-1.5 text-sm font-semibold text-zinc-200 lg:flex">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="rounded-full px-4 py-2.5 transition hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-violet-500 hover:via-violet-400 hover:to-cyan-300 hover:text-white">
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <LangSwitch lang={lang} setLang={setLang} />
            <a href={TELEGRAM_URL} className="rounded-full border border-violet-300/40 bg-violet-500/15 px-5 py-3 text-sm font-black text-white transition hover:bg-gradient-to-r hover:from-violet-500 hover:to-cyan-300">
              {t.contact}
            </a>
          </div>

          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="rounded-xl border border-white/10 p-2 lg:hidden">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-black/90 px-4 py-4 lg:hidden">
            <div className="grid gap-2">
              {navLinks.map(([href, label]) => (
                <a key={href} href={href} className="rounded-xl bg-white/[.05] px-4 py-3">
                  {label}
                </a>
              ))}
              <LangSwitch lang={lang} setLang={setLang} />
              <a href={TELEGRAM_URL} className="rounded-xl bg-violet-500 px-4 py-3 text-center font-bold">
                {t.contact}
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[680px] max-w-7xl items-start gap-10 px-4 pb-8 pt-20 sm:px-5 sm:pb-10 sm:pt-24 lg:grid-cols-[1fr_.95fr] lg:pt-24">
          <div>
            <div className="flex w-full max-w-[720px] items-center justify-center py-0 sm:justify-start">
              <BrandLogo variant="hero" />
            </div>

            <h1 className="sr-only">{t.title}</h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">{t.subtitle}</p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a href="#exchange" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-violet-400 to-cyan-300 px-7 py-4 font-bold text-white shadow-[0_0_45px_rgba(139,92,246,.35)]">
                {t.start} →
              </a>

              <a href={TELEGRAM_URL} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-7 py-4 font-bold text-white hover:bg-white/5">
                <TelegramIcon /> {t.tg}
              </a>
            </div>
          </div>

          <RotatingOrb />
        </section>

        <section id="exchange" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-5 sm:py-20 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t.formTitle}</h2>
            <p className="mt-5 max-w-xl text-zinc-400">{t.subtitle}</p>
          </div>
          <ExchangeForm t={t} lang={lang} />
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-14">
          <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025)_48%,rgba(139,92,246,.04))] p-7 shadow-[0_24px_80px_rgba(0,0,0,.30),inset_0_1px_0_rgba(255,255,255,.10),inset_0_-18px_38px_rgba(0,0,0,.22)] backdrop-blur-xl sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,.16),transparent_34%),radial-gradient(circle_at_90%_90%,rgba(34,211,238,.10),transparent_32%)]" />

              <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs font-black uppercase tracking-[.16em] text-violet-200">{lang === "ru" ? "Индивидуальный курс" : "Custom rate"}</div>

                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{lang === "ru" ? "Почему курс выгоднее" : "Why the rate is better"}</h2>

                <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
                  {lang === "ru"
                    ? "Мы не показываем один общий курс для всех. Итоговые условия согласуются с менеджером и зависят от города, суммы, направления обмена и доступной ликвидности."
                    : "We do not show one fixed rate for everyone. Final terms are confirmed with a manager and depend on the city, amount, exchange direction, and available liquidity."}
                </p>

                <div className="mt-7 grid gap-3">
                  {[
                    lang === "ru" ? ["Город и валюта", "Учитываем город, локальную валюту и доступность выдачи."] : ["City and currency", "We factor in the city, local currency, and payout availability."],
                    lang === "ru" ? ["Сумма обмена", "Для крупных сумм возможны индивидуальные условия."] : ["Exchange amount", "Large amounts may qualify for custom terms."],
                    lang === "ru" ? ["Направление сделки", "Crypto → Cash, Cash → Crypto или Crypto → Crypto рассчитываются отдельно."] : ["Exchange direction", "Crypto → Cash, Cash → Crypto, and Crypto → Crypto are calculated separately."],
                  ].map(([title, text]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.06)]">
                      <div className="font-black text-white">{title}</div>
                      <div className="mt-1 text-sm leading-6 text-zinc-400">{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025)_48%,rgba(34,211,238,.035))] p-7 shadow-[0_24px_80px_rgba(0,0,0,.30),inset_0_1px_0_rgba(255,255,255,.10),inset_0_-18px_38px_rgba(0,0,0,.22)] backdrop-blur-xl sm:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,.10),transparent_24%),radial-gradient(circle_at_85%_80%,rgba(34,211,238,.12),transparent_34%)]" />

              <div className="relative z-10">
                <div className="mb-4 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-black uppercase tracking-[.16em] text-cyan-100">{lang === "ru" ? "Направления" : "Directions"}</div>

                <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{lang === "ru" ? "Доступные направления обмена" : "Available exchange directions"}</h2>

                <p className="mt-4 max-w-2xl leading-7 text-zinc-400">{lang === "ru" ? "Поддерживаем основные направления обмена для криптовалюты, наличных и популярных стейблкоинов." : "We support key exchange directions for crypto, cash, and popular stablecoins."}</p>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Crypto → Cash", lang === "ru" ? "Получение наличных после перевода криптовалюты." : "Receive cash after sending crypto."],
                    ["Cash → Crypto", lang === "ru" ? "Покупка криптовалюты за наличные." : "Buy crypto with cash."],
                    ["Crypto → Crypto", lang === "ru" ? "Обмен между популярными монетами и сетями." : "Swap between popular coins and networks."],
                    ["USDT / BTC / ETH / USDC", lang === "ru" ? "Основные активы для быстрых сделок." : "Main assets for fast transactions."],
                  ].map(([title, text]) => (
                    <div key={title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition hover:-translate-y-1 hover:border-violet-300/30 hover:bg-violet-500/10">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(139,92,246,.14),transparent_32%)] opacity-0 transition group-hover:opacity-100" />
                      <div className="relative z-10">
                        <div className="text-lg font-black text-white">{title}</div>
                        <div className="mt-3 text-sm leading-6 text-zinc-400">{text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="steps" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-20">
          <div className="mb-12">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t.stepsTitle}</h2>
          </div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-[52px] hidden h-[2px] lg:block">
              <div className="h-full w-full bg-gradient-to-r from-violet-500/0 via-violet-400/70 to-cyan-300/0 blur-[1px]" />
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {t.steps.map(([num, title, text], index) => (
                <div key={num} className="group relative min-h-[270px] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.08),rgba(255,255,255,.025)_45%,rgba(34,211,238,.035))] p-6 shadow-[0_28px_80px_rgba(0,0,0,.34),inset_0_1px_0_rgba(255,255,255,.10),inset_0_-18px_40px_rgba(0,0,0,.22)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-300/35">
                  <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_20%_12%,rgba(255,255,255,.12),transparent_22%),radial-gradient(circle_at_top_left,rgba(139,92,246,.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,.12),transparent_32%)] opacity-90" />

                  <div className="relative z-10">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-violet-300/25 bg-gradient-to-br from-violet-500/25 to-cyan-300/15 text-xl shadow-[0_0_25px_rgba(139,92,246,.18)]">{processIcons[index]}</div>

                      <div className="relative hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[.04] text-sm font-black text-white lg:flex">{num}</div>

                      <div className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs font-black text-zinc-300 lg:hidden">{num}</div>
                    </div>

                    <h3 className="text-2xl font-black leading-tight text-white">{title}</h3>
                    <p className="mt-4 text-sm leading-7 text-zinc-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="countries" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-20">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.02)_48%,rgba(34,211,238,.035))] p-5 shadow-[0_30px_100px_rgba(0,0,0,.34),inset_0_1px_0_rgba(255,255,255,.10),inset_0_-24px_48px_rgba(0,0,0,.24)] backdrop-blur-xl sm:p-10">
            <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t.countriesTitle}</h2>
                <p className="mt-4 max-w-2xl text-zinc-400">{t.countriesText}</p>
              </div>

              <a href="#exchange" className="inline-flex w-fit items-center gap-2 rounded-2xl bg-violet-500 px-6 py-4 font-bold">
                {t.start} →
              </a>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.65fr_.75fr]">
              <DottedWorldMap lang={lang} onCountrySelect={setOpenCountryCode} selectedCountryCode={openCountryCode} />

              <div id="country-list">
                <div className="mb-4 text-sm font-bold uppercase tracking-[.18em] text-zinc-500">{t.countryList}</div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {countryCards.map((c) => (
                    <details
                      key={c.code}
                      open={openCountryCode === c.code}
                      onToggle={(event) => {
                        if (event.currentTarget.open) {
                          setOpenCountryCode(c.code);
                        } else if (openCountryCode === c.code) {
                          setOpenCountryCode(null);
                        }
                      }}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[.045] shadow-[0_16px_38px_rgba(0,0,0,.18),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-xl transition hover:border-violet-300/25"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                        <span className="font-semibold">{lang === "ru" ? c.ru : c.en}</span>
                        <span className="ml-auto rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-200">{c.fiat}</span>
                        <span className="text-sm text-zinc-400 transition group-open:rotate-180">⌄</span>
                      </summary>

                      {c.cities.length > 0 ? (
                        <div className="border-t border-white/10 px-4 pb-4 pt-3">
                          <div className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-zinc-500">{formatCityCount(c.cities.length, lang)}</div>

                          <div className="grid max-h-[280px] gap-2 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(139,92,246,.65)_rgba(255,255,255,.06)]">
                            {c.cities.map((city) => (
                              <a key={city} href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-zinc-300 transition hover:border-violet-300/35 hover:bg-violet-500/10 hover:text-white">
                                {city}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="border-t border-white/10 px-4 pb-4 pt-3 text-sm text-zinc-500">{lang === "ru" ? "Список городов скоро будет добавлен" : "City list will be added soon"}</div>
                      )}
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-20">
          <h2 className="text-center text-4xl font-black tracking-tight sm:text-5xl">{t.benefitsTitle}</h2>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {t.benefits.map(([icon, title, text]) => (
              <div key={title} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025)_46%,rgba(34,211,238,.035))] p-7 shadow-[0_24px_70px_rgba(0,0,0,.30),inset_0_1px_0_rgba(255,255,255,.10),inset_0_-16px_34px_rgba(0,0,0,.22)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-violet-300/30">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/25 bg-violet-500/10 text-xl">{icon}</div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="reviews" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-20">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t.reviewsTitle}</h2>

            <div className="flex gap-2">
              <button type="button" onClick={() => document.querySelector("#reviews-track")?.scrollBy({ left: -440, behavior: "smooth" })} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[.06] text-white">
                ←
              </button>

              <button type="button" onClick={() => document.querySelector("#reviews-track")?.scrollBy({ left: 440, behavior: "smooth" })} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[.06] text-white">
                →
              </button>
            </div>
          </div>

          <div id="reviews-track" className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {t.reviews.map(([name, text], i) => (
              <div key={name} className="relative min-h-[260px] w-[82vw] shrink-0 snap-center overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.075),rgba(255,255,255,.025)_46%,rgba(139,92,246,.04))] p-7 shadow-[0_24px_80px_rgba(0,0,0,.32),inset_0_1px_0_rgba(255,255,255,.10),inset_0_-16px_34px_rgba(0,0,0,.22)] backdrop-blur-xl sm:w-[420px]">
                <div className="mb-5 flex items-center justify-between">
                  <div className="text-yellow-300">★★★★★</div>
                  <div className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-200">0{i + 1}</div>
                </div>

                <p className="min-h-[112px] leading-7 text-zinc-300">“{text}”</p>
                <div className="mt-6 font-black text-white">{name}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-5 sm:py-20 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t.faqTitle}</h2>
            <p className="mt-5 text-zinc-400">Telegram: {TELEGRAM_HANDLE}</p>
          </div>

          <div className="divide-y divide-white/10 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.02)_50%,rgba(34,211,238,.035))] shadow-[0_24px_80px_rgba(0,0,0,.32),inset_0_1px_0_rgba(255,255,255,.10),inset_0_-18px_38px_rgba(0,0,0,.22)] backdrop-blur-xl">
            {t.faq.map(([q, a]) => (
              <details key={q} className="group p-6 transition hover:bg-white/[.025]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                  {q}
                  <span className="text-violet-300 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-zinc-400">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-20">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-violet-300/20 bg-[linear-gradient(145deg,rgba(139,92,246,.16),rgba(255,255,255,.035)_42%,rgba(34,211,238,.10))] p-8 text-center shadow-[0_34px_110px_rgba(0,0,0,.36),0_0_70px_rgba(139,92,246,.18),inset_0_1px_0_rgba(255,255,255,.12),inset_0_-22px_44px_rgba(0,0,0,.20)] backdrop-blur-xl sm:p-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,.16),transparent_30%),radial-gradient(circle_at_85%_90%,rgba(34,211,238,.14),transparent_34%)]" />

            <div className="relative z-10">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t.finalTitle}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-zinc-300">{t.finalText}</p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <a href={TELEGRAM_URL} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-violet-400 to-cyan-300 px-7 py-4 font-bold text-white shadow-[0_0_42px_rgba(139,92,246,.32)] transition hover:brightness-110">
                  <TelegramIcon /> {TELEGRAM_HANDLE}
                </a>

                <a href="#exchange" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-7 py-4 font-bold text-white transition hover:bg-white/[.06]">
                  {t.start}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <a href={TELEGRAM_URL} className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500 text-white shadow-[0_0_45px_rgba(139,92,246,.5)]">
        <TelegramIcon className="h-7 w-7" />
      </a>

      <footer className="relative z-10 border-t border-white/10 px-4 py-10 sm:px-5">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <LogoMark />
          <div className="text-sm text-zinc-500">© Token Cash Crypto Exchange. {TELEGRAM_HANDLE}</div>
        </div>
      </footer>
    </div>
  );
}
