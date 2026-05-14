import "./globals.css";

export const metadata = {
  title: "Token Cash — обмен криптовалют и наличных",
  description:
    "Token Cash — быстрый обмен криптовалюты и наличных: USDT, BTC, ETH, BNB, SOL, USDC, RUB, USD и EUR через персонального менеджера.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
