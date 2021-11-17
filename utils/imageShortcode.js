const Image = require("@11ty/eleventy-img");

module.exports = async function imageShortcode(
  src,
  alt,
  sizes = "100vw",
  widths = [1000, 800, 600, 250],
  attributes = {}
) {
  let metadata = await Image(src, {
    widths,
    formats: ["avif", "webp", "jpeg", "png"],
    outputDir: "./dist/static/images",
    urlPath: "/static/images",
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
    ...attributes,
  };

  return Image.generateHTML(metadata, imageAttributes, {
    whitespaceMode: "inline",
  });
};
