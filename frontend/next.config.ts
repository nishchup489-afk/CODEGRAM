import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    // The maintenance page is a static file in public/, so it cannot read
    // NEXT_PUBLIC_* at runtime. Posting to this same-origin path instead means
    // no hardcoded backend host in the HTML and no CORS preflight.
    async rewrites() {
        const backendUrl =
            process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL

        if (!backendUrl) {
            return []
        }

        return [
            {
                source: "/api/early-access",
                destination: `${backendUrl.replace(/\/$/, "")}/api/v1/early-access`,
            },
        ]
    },

    async redirects() {
        return [
            {
                source: "/data-deletation",
                destination: "/data-deletion",
                permanent: true,
            },
        ]
    },

    images: {

        remotePatterns: [

            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },

            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },

            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },

            {
                protocol: 'https',
                hostname: 'imgs.search.brave.com',
            },
        
                
            { 
                protocol: "https", 
                hostname: "res.cloudinary.com" 
            },

        ]
                
          

    },

};

export default nextConfig;
