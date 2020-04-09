import commandLineArgs from "command-line-args";
import yaml from "js-yaml";
import fs from "fs";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { Browser } from "./browser";
import { Config } from "./config";
import { Inspector } from "./inspector";

import cliProgress, { SingleBar } from "cli-progress";
import colors from "colors";

const website = commandLineArgs([{ name: "src", alias: "s", type: String, defaultOption: true }]);
const browser = new Browser("chrome");

async function generateData() {
  var configFile = fs.readFileSync("./config.yml", "utf8");
  var jsonConfig = yaml.safeLoad(configFile);

  var jsonConvert: JsonConvert = new JsonConvert();
  //jsonConvert.operationMode = OperationMode.LOGGING;
  jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null

  var nBar = new SingleBar(
    {
      format:
        "Page Normalization |" +
        colors.cyan("{bar}") +
        "| {percentage}% || {value}/{total} Web Elements || ETA: {eta}s",
    },
    cliProgress.Presets.shades_classic
  );

  var fBar = new SingleBar(
    {
      format:
        "Element Extraction |" +
        colors.magenta("{bar}") +
        "| {percentage}% || {value}/{total} Web Elements || ETA: {eta}s",
    },
    cliProgress.Presets.shades_classic
  );

  var config: Config;
  try {
    config = jsonConvert.deserializeObject(jsonConfig, Config);
    nBar.start(config.elements.length, 0);

    const inspector = new Inspector(browser, config, nBar, fBar);
    await inspector.normalize();
    await inspector.fetch();
    inspector.export();
  } catch (e) {
    console.log(<Error>e);
  }
}

async function inspect() {
  await browser.navigate(website.src);
  await generateData();
  browser.close();
}

inspect();
