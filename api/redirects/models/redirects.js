require('isomorphic-fetch');

const { VERCEL_PRODUCTION_WEBHOOK } = process.env;

async function triggerDeployment() {
  await fetch(VERCEL_PRODUCTION_WEBHOOK, {
    method: 'post',
  });
}

module.exports = {
  lifecycles: {
    async afterCreate() {
      await triggerDeployment();
    },

    async afterUpdate() {
      await triggerDeployment();
    },

    async afterDelete() {
      await triggerDeployment();
    },
  },
};
