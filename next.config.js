/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AUTH0_BASE_URL: process.env.AUTH0_BASE_URL
    // Add more environment variables as needed
  }
}

module.exports = nextConfig
