import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"]
  },
  {
    rules: {
      // localStorage/session hydration on mount legitimately sets state from an effect
      "react-hooks/set-state-in-effect": "warn"
    }
  }
];

export default config;
