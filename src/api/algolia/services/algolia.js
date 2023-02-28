'use strict';

/**
 * algolia service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::algolia.algolia');