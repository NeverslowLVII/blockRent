/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Désactiver la vérification ESLint lors du build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 