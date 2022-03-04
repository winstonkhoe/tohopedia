/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["i.ytimg.com"],
  },
}

// module.exports = nextConfig


// module.exports = withImages()
module.exports = withPlugins([[withImages]], nextConfig)
