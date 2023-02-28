'use strict';

/**
 * safe-harbour router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::safe-harbour.safe-harbour');