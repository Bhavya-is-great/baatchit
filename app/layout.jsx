import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/helpers/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BaatChit",
  description: "Yee Baatchit ai hai joo ki ai fiesta ko aukad dikahne aaya h",
  other: {
    "google-site-verification": "eSUH1fKpE_6vhXKn4WmTTQ8qP-7vVrIvfkUnbgkgyZE",
  },

};

export default function RootLayout({ children }) {
  return (
    <html data-theme="dark" lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider>
          {children}
        </UserProvider>
        <script src="https://js.puter.com/v2/"></script>
      </body>
    </html>
  );
}
