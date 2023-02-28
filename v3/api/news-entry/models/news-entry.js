/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable camelcase */

const pick = require('lodash.pick');

const attributes = [
  'id',
  'title',
  'updated_at',
  'content',
];

module.exports = {
  lifecycles: {
    async afterCreate(data) {
      try {
        const { objectID } = await strapi.services.algolia.save({
          ...pick(data, attributes),
          contentType: 'news-entry',
        });

        if (objectID) {
          data.algolia_id = objectID;
        }
      } catch (err) {
        console.log('Could not create entry in algolia', err.message);
      }
    },

    async afterUpdate(data) {
      const { algolia_id } = data;

      if (algolia_id) {
        const picked = pick(data, attributes);
        picked.objectID = algolia_id;

        try {
          const { objectID } = await strapi.services.algolia.update(picked);

          if (objectID) {
            data.algolia_id = objectID;
          }
        } catch (err) {
          console.log('Could not update entry in algolia', err.message);
        }
      } else {
        try {
          const picked = pick(data, attributes);
          const { objectID } = await strapi.services.algolia.save({
            ...picked,
            contentType: 'news-entry',
          });

          if (objectID) {
            data.algolia_id = objectID;
          }
        } catch (err) {
          console.log('Could not create entry in algolia', err.message);
        }
      }
    },

    async afterDelete(data) {
      const { algolia_id } = data;

      try {
        if (algolia_id) {
          await strapi.services.algolia.delete([algolia_id]);
        }
      } catch (err) {
        console.log('Could not delete entry in algolia', err.message);
      }
    },
  },
};
