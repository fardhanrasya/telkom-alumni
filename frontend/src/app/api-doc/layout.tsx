import "../globals.css";

export const metadata = {
  title: "API Documentation",
  description: "Swagger UI for Telkom Alumni API",
};

export default function ApiDocLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
