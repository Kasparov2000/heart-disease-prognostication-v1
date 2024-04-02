/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.NEXT_PUBLIC_CONVEX_URL]
    }
};

export default nextConfig;
