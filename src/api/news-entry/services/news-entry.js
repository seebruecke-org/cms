'use strict';

/**
 * news-entry service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::news-entry.news-entry');