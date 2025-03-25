/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["assets.aceternity.com"],
    },
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,
//     webpack: (config, { isServer }) => {
//         if (!isServer) {
//             config.resolve.fallback = {
//                 ...config.resolve.fallback,
//                 fs: false,
//                 net: false,
//                 tls: false,
//             };
//         }
//         return config;
//     },
//     images: {
//         domains: ["assets.aceternity.com"],
//     },
// };

// export default nextConfig;
