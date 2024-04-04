/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [process.env.NEXT_PUBLIC_CONVEX_URL, 'fast-dragon-500.convex.cloud']
    }
};

export default nextConfig;
