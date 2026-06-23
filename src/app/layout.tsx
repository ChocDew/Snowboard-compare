export const metadata = {
  title: "Snowboard Compare API",
  description: "Backend API for snowboard comparison",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
