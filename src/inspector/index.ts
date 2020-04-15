import commandLineArgs from "command-line-args";
import yaml from "js-yaml";
import { readFileSync } from "fs";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { SingleBar, Presets } from "cli-progress";
import colors from "colors";
import { Browser } from "./browser";
import { Config } from "./config";
import { Inspector } from "./inspector";

const website = commandLineArgs([{ name: "src", alias: "s", type: String, defaultOption: true }]);
const browser = new Browser("chrome");

async function generateData() {
  const configFile = readFileSync("./config/inspector.yml", "utf8");
  const jsonConfig = yaml.safeLoad(configFile);

  const jsonConvert = new JsonConvert();
  //jsonConvert.operationMode = OperationMode.LOGGING;
  jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null

  const nBar = new SingleBar(
    {
      format:
        "Page Normalization |" + colors.cyan("{bar}") + "| {percentage}% || {value}/{total} Web Elements || ETA: {eta}s"
    },
    Presets.shades_classic
  );

  const fBar = new SingleBar(
    {
      format:
        "Element Extraction |" +
        colors.magenta("{bar}") +
        "| {percentage}% || {value}/{total} Web Elements || ETA: {eta}s"
    },
    Presets.shades_classic
  );

  try {
    const config = jsonConvert.deserializeObject(jsonConfig, Config);
    nBar.start(config.elements.length, 0);

    const inspector = new Inspector(browser, config, nBar, fBar);
    await inspector.normalize();
    await inspector.fetch();
    inspector.export();
  } catch (e) {
    console.error(<Error>e);
  }
}

async function inspect() {
  await browser.navigate(website.src);
  await generateData();
  browser.close();
}

inspect();
