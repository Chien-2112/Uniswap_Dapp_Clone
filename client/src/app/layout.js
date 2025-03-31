import { SwapTokenContextProvider } from "../Context/SwapContext.js";
import NavBar from "../Components/NavBar/NavBar.jsx";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SwapTokenContextProvider>
          <NavBar />
          {children}
        </SwapTokenContextProvider>
      </body>
    </html>
  );
}