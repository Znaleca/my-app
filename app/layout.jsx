import { Quicksand } from "next/font/google";
import "../assets/styles/globals.css";

// Configure the Quicksand font with a variable for Tailwind to use
const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  // Include multiple weights so bold/extra-bold buttons look correct
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "from lanz",
  description: "invitation for valentines",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        // 1. quicksand.variable: defines the CSS variable (--font-quicksand)
        // 2. quicksand.className: applies the font to the body immediately
        className={`${quicksand.variable} ${quicksand.className} antialiased bg-white dark:bg-black`}
      >
        {children}
      </body>
    </html>
  );
}