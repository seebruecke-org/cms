module.exports = [
  {
    name: 'strapi::compression',
    config: {
      br: false,
      gzip: true,
    },
  },
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
