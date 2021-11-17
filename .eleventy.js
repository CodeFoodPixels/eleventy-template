const markdownIt = require("markdown-it");
const markdownItLinkAttributes = require("markdown-it-link-attributes");
const slugify = require("slugify");
const nunjucksDate = require("nunjucks-date-filter");

const siteData = require("./src/_data/site.js");

const postcss = require("./utils/postcss.js");
const minifycss = require("./utils/minifycss.js");
const imageShortcode = require("./utils/imageShortcode.js");

module.exports = function (eleventyConfig) {
  const slug = (input) => {
    const options = {
      replacement: "-",
      remove: /[&,+()$~%.'":*!?<>{}]/g,
      lower: true,
    };
    return slugify(input, options);
  };

  eleventyConfig.addFilter("slug", slug);

  // Markdown config
  const markdownLib = markdownIt({ html: true }).use(markdownItLinkAttributes, {
    pattern: new RegExp(`^(?!(${siteData.url}|#|\/)).*$`),
    attrs: {
      target: "_blank",
      rel: "external noopener noreferrer",
    },
  });

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  // Build processes
  eleventyConfig.on("beforeBuild", postcss);
  eleventyConfig.addTransform("minifycss", minifycss);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/service-worker.js");
  eleventyConfig.addPassthroughCopy("src/static");
  eleventyConfig.addPassthroughCopy("src/_redirects");
  eleventyConfig.addPassthroughCopy({ "src/favicons/*": "/" });

  // Watch targets
  eleventyConfig.addWatchTarget("src/static/css/");

  eleventyConfig.addNunjucksFilter("date", nunjucksDate);

  eleventyConfig.addFilter("w3DateFilter", (value) => {
    const dateObject = new Date(value);
    return dateObject.toISOString();
  });

  eleventyConfig.addFilter("md", (content = "") => {
    return markdownLib.render(content);
  });

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk",
  };
};
