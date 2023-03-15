'use strict';

/**
 * safe-harbour service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::safe-harbour.safe-harbour');