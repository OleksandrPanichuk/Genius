/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions:true
  },
  images: {
    domains: ["oaidalleapiprodscus.blob.core.windows.net",
      "cdn.openai.com", "googleusercontent.com", "pbxt.replicate.delivery"
    ]
  }
}

module.exports = nextConfig
