import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  modularizeImports: {
    "@spencer516/drama-led-messages": {
      transform: "@spencer516/drama-led-messages/{{member}}",
    },
  },
};

export default nextConfig;
