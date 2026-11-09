// ==============================================================================
// BUILD-TIME SECURITY ISOLATION GUARD
// Asserts that no private keys, database service credentials, or AI secret keys
// leak into static client bundles via accidental NEXT_PUBLIC_ prefixes.
// ==============================================================================
const publicEnvKeys = Object.keys(process.env).filter((key) =>
  key.startsWith('NEXT_PUBLIC_')
);

for (const key of publicEnvKeys) {
  const value = process.env[key] || '';
  const containsSecretName = /service_role|secret|private|sk_live|sk_test|ai_api_key|gemini_api_key|groq_api_key/i.test(key);
  const containsSecretValue = /service_role|secret|sk_live_|sk_test_|gsk_|AIzaSy/i.test(value);

  if (containsSecretName || containsSecretValue) {
    console.error(`\x1b[31m[CRITICAL SECURITY ALERT] Build-Time leakage detected in environment variable "${key}". Private keys must NEVER be prefixed with NEXT_PUBLIC_.\x1b[0m`);
    throw new Error(
      `[SECURITY BUILD GUARD] Build process aborted to protect private secrets from client exposure via "${key}".`
    );
  }
}

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://graph.instagram.com https://*.cdninstagram.com https://*.googleusercontent.com https://*.supabase.co; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com; frame-src 'self' https://www.google.com https://www.google.com.br https://open.spotify.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'graph.instagram.com',
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

