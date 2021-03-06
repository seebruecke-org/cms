/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */

const pick = require('lodash.pick');
const slugify = require('slugify');

const attributes = [
  'id',
  'title',
  'slug',
  'updated_at',
  'content',
];

const createSlug = (text) => slugify(text, {
  lower: true,
  strict: true,
  locale: 'de',
});

const createPageSlug = async ({
  title, parent, campaign, slug,
}) => {
  let newSlug = slug || createSlug(title);
  const pagesBySlug = await strapi.query('page').find({ slug: newSlug });
  const pageCount = pagesBySlug.length;

  const areParentsEqual = (pages, pageParent) => !!pages.find((page) => page.parent === pageParent);

  const areCampaignsEqual = (pages, pageCampaign) => !!pages.find((page) => page.campaign === pageCampaign);

  if ((!slug && pageCount > 0) || (slug && pageCount > 1)) {
    // we need to check, whether pages with the same slug also have
    // the same parent or the same campaign
    if (areParentsEqual(pagesBySlug, parent) || areCampaignsEqual(pagesBySlug, campaign)) {
      newSlug += `-${pageCount}`;
    }
  }

  return newSlug;
};

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      const {
        title, parent, campaign, slug,
      } = data;
      data.slug = await createPageSlug({
        title, parent, campaign, slug,
      });
    },

    async afterCreate(data) {
      const { id } = data;

      try {
        const { objectID } = await strapi.services.algolia.save({
          ...pick(data, attributes),
          contentType: 'page',
        });

        if (objectID) {
          await strapi.query('page').update({ id }, { algolia_id: objectID });
        }
      } catch (err) {
        console.log('Could not create entry in algolia', err.message);
      }
    },

    async beforeUpdate(params, data) {
      const {
        title, parent, campaign, slug,
      } = data;

      // Otherwise is a "draft -> publish" event
      if (title) {
        data.slug = await createPageSlug({ title, parent, campaign, slug });
      }
    },

    async afterUpdate(data) {
      const {
        algolia_id,
        id,
        published_at,
      } = data;

      // Draft pages shouldn't be pushed into algolia
      if (!published_at) {
        return;
      }

      if (algolia_id) {
        const picked = pick(data, attributes);
        picked.objectID = algolia_id;

        try {
          const { objectID } = await strapi.services.algolia.update({
            ...picked,
          });

          if (objectID) {
            await strapi.query('page').update({ id }, { algolia_id: objectID });
          }
        } catch (err) {
          console.log('Could not update entry in algolia', err.message);
        }
      } else {
        try {
          const { objectID } = await strapi.services.algolia.save({
            ...pick(data, attributes),
            contentType: 'page',
          });

          if (objectID) {
            await strapi.query('page').update({ id }, { algolia_id: objectID });
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
