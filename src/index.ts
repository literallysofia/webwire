import commandLineArgs from "command-line-args";
import yaml from "js-yaml";
import fs from "fs";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { Browser } from "./browser";
import { Config } from "./config";
import { Inspector } from "./inspector";

const website = commandLineArgs([{ name: "src", alias: "s", type: String, defaultOption: true }]);
const browser = new Browser("chrome");

async function generateData(): Promise<void> {
  var configFile = fs.readFileSync("./config.yml", "utf8");
  var jsonConfig = yaml.safeLoad(configFile);

  var jsonConvert: JsonConvert = new JsonConvert();
  jsonConvert.operationMode = OperationMode.LOGGING;
  jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null

  var config: Config;
  try {
    config = jsonConvert.deserializeObject(jsonConfig, Config);
    const inspector = new Inspector(browser, config);
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
