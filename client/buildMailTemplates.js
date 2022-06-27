const chokidar = require("chokidar");
const mjml2html = require("mjml");
const fs = require("fs");
const glob = require("glob");

const GLOB = "../api/templates/emails/**/*.mjml";

let firstRun = true;

if (process.argv.includes("--watch")) {
  chokidar.watch(GLOB).on("all", (event, path) => {
    console.log(event, path);
    // Skipping partials as they are not valid mjml
    if (!isPartial(path)) {
      renderSingleMjmlFile(path);
    } else {
      if (firstRun) {
        firstRun = false;
      } else {
        renderAllMjmlFiles();
      }
    }
  });
} else {
  renderAllMjmlFiles();
}

function isPartial(path) {
  return path.indexOf("partials") >= 0;
}

function renderAllMjmlFiles() {
  glob(GLOB, null, function(er, files) {
    if (!er) {
      files.forEach(path => {
        renderSingleMjmlFile(path);
      });
    }
  });
}

function renderSingleMjmlFile(path) {
  if (isPartial(path)) return;
  const mjml = fs.readFileSync(path, "utf8");
  const result = mjml2html(mjml, { filePath: path });
  const folder = result.json.absoluteFilePath;
  const fileName = path
    .split("/")
    .pop()
    .replace(".mjml", "");
  const twigPath = folder + "/" + fileName + ".html.twig";
  fs.writeFileSync(twigPath, result.html);
  console.log("New HTML created ->", twigPath);
}
