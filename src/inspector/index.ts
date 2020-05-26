import commandLineArgs from "command-line-args";
import { safeLoad } from "js-yaml";
import { readFileSync } from "fs";
import { JsonConvert, ValueCheckingMode } from "json2typescript";
import { SingleBar, Presets } from "cli-progress";
import { cyan, magenta } from "colors";
import { Browser } from "./browser";
import { Config } from "./config";
import { Inspector } from "./inspector";

const website = commandLineArgs([
  { name: "id", type: Number },
  { name: "src", type: String },
]);

async function inspect() {
  const configFile = readFileSync("./config/inspector.yml", "utf8");
  const jsonConfig = safeLoad(configFile);

  const jsonConvert = new JsonConvert();
  jsonConvert.ignorePrimitiveChecks = false;
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

  const nBar = new SingleBar(
    {
      format: "Page Normalization |" + cyan("{bar}") + "| {percentage}% || {value}/{total} Web Elements || ETA: {eta}s",
    },
    Presets.shades_classic
  );

  const fBar = new SingleBar(
    {
      format: "Element Extraction |" + magenta("{bar}") + "| {percentage}% || {value}/{total} Web Elements || ETA: {eta}s",
    },
    Presets.shades_classic
  );

  try {
    const config = jsonConvert.deserializeObject(jsonConfig, Config);
    const browser = new Browser(config.browser, config.headless, config.window.height, config.window.width);
    await browser.navigate(website.src);

    nBar.start(config.elements.length, 0);

    const inspector = new Inspector(browser, config, { id: website.id, url: website.src }, [nBar, fBar]);
    await inspector.normalize();
    await inspector.fetch();
    inspector.export();
    await browser.close();
  } catch (e) {
    console.error(<Error>e);
  }
}

inspect();
