module.exports = {
  layout: "layouts/detail.njk",
  type: "viaggio",
  eleventyComputed: {
    permalink: (data) =>
      data.attivo === false ? false : `/viaggi/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: (data) => data.attivo === false
  }
};
