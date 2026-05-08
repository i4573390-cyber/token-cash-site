# Token Cash Site

Next.js проект для деплоя на Vercel.

## Запуск локально

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Файлы в public

- `public/logo.webp` — логотип Token Cash. Уже добавлен.
- `public/world-map.svg` — карта мира. В архиве лежит временная заглушка. Замени её на скачанную SVG-карту SimpleMaps с тем же именем `world-map.svg`.
- `public/tether.webp` — можно добавить позже, если захочешь заменить CSS-монету на готовую 3D-картинку.

## Важно по карте

Код подсвечивает страны по ISO-кодам: `AM`, `BY`, `IN`, `ID`, `KZ`, `KG`, `AE`, `RU`, `TH`, `UZ`.
Если в твоём SVG у стран есть `id="RU"`, `id="KZ"` и т.д., подсветка заработает автоматически.
