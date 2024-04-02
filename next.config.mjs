/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.CONVEX_DEPLOYMENT]
    }
};

export default nextConfig;
