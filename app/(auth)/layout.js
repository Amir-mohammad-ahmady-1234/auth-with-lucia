import "../globals.css";

export const metadata = {
  title: "Next Auth",
  description: "Next.js Authentication",
};

export default function AuthRootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header id="auth-header">
          <p>welcome back!</p>

          <form>
            <button>logout</button>
          </form>
        </header>
        {children}
      </body>
    </html>
  );
}
