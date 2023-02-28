'use strict';

/**
 * algolia controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::algolia.algolia');