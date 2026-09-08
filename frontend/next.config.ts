import type { NextConfig } from "next";

const nextConfig: NextConfig = {

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
