const fs = require("fs").promises;
const path = require("path");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");

module.exports = async () => {
  const css = await fs.readFile(
    path.join(__dirname, "..", "src", "static", "css", "main.css")
  );

  const result = await postcss([autoprefixer]).process(css, {
    from: path.join(__dirname, "..", "src", "static", "css", "main.css"),
    to: path.join(__dirname, "..", "dist", "static", "css", "dist.css"),
  });

  await fs.mkdir(path.join(__dirname, "..", "dist", "static", "css"), {
    recursive: true,
  });
  return fs.writeFile(
    path.join(__dirname, "..", "dist", "static", "css", "dist.css"),
    result.css
  );
};
