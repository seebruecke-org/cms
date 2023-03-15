'use strict';

/**
 * safe-harbour controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::safe-harbour.safe-harbour');