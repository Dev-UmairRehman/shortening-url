import "./globals.css";

export const metadata = {
  title: "Shorty — custom URL shortener",
  description: "Create your own short links with custom names.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
