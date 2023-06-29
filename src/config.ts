export const environment = process.env.NODE_ENV || 'development';
export const isDev = environment === 'development';

export const INFINITE_SCROLL = 2;
export const title = 'Community';
export const description = 
  'Community is a website to share your experience';

export const port = process.env.PORT || 3000;
export const domain = 'community.v1.vercel.app'
export const productionUrl = `https://${domain}`;
export const url = isDev ? `https://${port}` : productionUrl;
export const instagram = 'https://instagram.com/rahmadnastion';
export const author = 'Rahmad Nasution';
export const copyright = `Copyright 2023 ${author}`;