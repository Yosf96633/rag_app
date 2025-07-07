export default function RegularLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
       <main className="">{children}</main>
      </body>
    </html>
  );
}
