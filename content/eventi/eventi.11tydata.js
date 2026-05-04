module.exports = {
  layout: "layouts/detail.njk",
  type: "evento",
  eleventyComputed: {
    permalink: (data) =>
      data.attivo === false ? false : `/eventi/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: (data) => data.attivo === false
  }
};
