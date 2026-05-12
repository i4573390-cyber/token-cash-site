import "./globals.css";

export const metadata = {
  title: "Token Cash — обмен криптовалют в России",
  description:
    "Token Cash — обмен криптовалюты и наличных в офисах по городам России: USDT, BTC, ETH, BNB, SOL, USDC и RUB через персонального менеджера.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
