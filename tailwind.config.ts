import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        muted: "#5b6677",
        line: "#e5ebf2",
        soft: "#f5f8fb",
        brand: {
          blue: "#075df5",
          navy: "#0044ba",
          black: "#090c12"
        }
      },
      boxShadow: {
        premium: "0 18px 60px rgba(9, 12, 18, 0.1)",
        card: "0 10px 32px rgba(7, 17, 31, 0.08)"
      },
      borderRadius: {
        card: "8px"
      }
    }
  },
  plugins: []
};

export default config;
