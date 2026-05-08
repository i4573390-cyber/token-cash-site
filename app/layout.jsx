import "./globals.css";

export const metadata = {
  title: "Token Cash — обмен криптовалют по всему Миру",
  description:
    "Token Cash — обмен криптовалют и наличных по всему Миру: USDT, BTC, ETH, BNB, SOL, USDC и локальные валюты через персонального менеджера.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
