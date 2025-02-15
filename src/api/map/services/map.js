'use strict';

/**
 * map service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::map.map');
