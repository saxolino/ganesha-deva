module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("data/blog.json");

  const sortByDate = (a, b) => new Date(a.data.date || 0) - new Date(b.data.date || 0);

  eleventyConfig.addCollection("eventi", (api) =>
    api.getFilteredByGlob("content/eventi/*.md")
      .filter((i) => i.data.attivo !== false)
      .sort(sortByDate)
  );
  eleventyConfig.addCollection("viaggi", (api) =>
    api.getFilteredByGlob("content/viaggi/*.md")
      .filter((i) => i.data.attivo !== false)
      .sort(sortByDate)
  );
  eleventyConfig.addCollection("percorsi", (api) =>
    api.getFilteredByGlob("content/percorsi/*.md")
      .filter((i) => i.data.attivo !== false)
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || "", "it"))
  );

  eleventyConfig.addFilter("dateIso", (d) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    return date.toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("dateIt", (d) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
    return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
  });

  eleventyConfig.addFilter("dateBadge", (d) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    const months = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
    return `${String(date.getDate()).padStart(2, "0")} ${months[date.getMonth()]}`;
  });

  eleventyConfig.addFilter("head", (arr, n) => Array.isArray(arr) ? arr.slice(0, n) : []);

  eleventyConfig.addFilter("excludeSlug", (arr, slug) =>
    Array.isArray(arr) ? arr.filter((i) => i.fileSlug !== slug) : []
  );

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
