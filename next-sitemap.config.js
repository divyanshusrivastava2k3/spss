/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXTAUTH_URL || 'https://ngo-website.com',
  generateRobotsTxt: true, // (optional)
  // ...other options
};
