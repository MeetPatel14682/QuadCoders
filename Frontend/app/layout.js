import "./globals.css";
import Navbar from "@/Frontend/component/Navbar.js";

export const metadata = {
  title: "My App",
  description: "Next.js App with TailwindCSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen flex-col">
          {/* Navbar stays on top */}
          <Navbar />

          {/* Main content pushed below navbar */}
          <main className="flex-1 pt-18 px-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
