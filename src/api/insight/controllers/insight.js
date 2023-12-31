// @ts-nocheck
'use strict';
/**
 *  [collection-name] controller
 */
const { createCoreController } = require('@strapi/strapi').factories;
module.exports = createCoreController('api::insight.insight', ({ strapi }) => ({
  async find(ctx) {
    // Calling the default core action
    const { data, meta } = await super.find(ctx);
    const query = strapi.query('api::insight.insight');
    await Promise.all(
      data.map(async (item, index) => {
        // map through the data in recommended-reads
        // use the individual item SLUGS to query the individual items
        // populate the response with `createdBy` and `updatedBy`
        const foundItem = await query.findOne({
          where: {
            slug: item.slug,
          },
          populate: ['coverImage', 'createdBy', 'updatedBy'],
        });
      })
    );
    return { data, meta };
  },
  async findOne(ctx) {
    // Get the SLUG from the request
    // use it to fetch data that matches SLUG
    // Finally, populate response with `createdBy` and `updatedBy`
    const { slug } = ctx.params;
    const entity = await strapi.query('api::insight.insight').findOne({
      where: { slug },
      populate: ['coverImage', 'createdBy', 'updatedBy'],
    });

    // Sanitize entity
    const sanitizedEntity = await this.sanitizeOutput(entity);

    return this.transformResponse(sanitizedEntity)
  }
}));
