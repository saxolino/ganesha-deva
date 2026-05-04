module.exports = {
  layout: "layouts/detail.njk",
  type: "percorso",
  eleventyComputed: {
    permalink: (data) =>
      data.attivo === false ? false : `/percorsi/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: (data) => data.attivo === false
  }
};
