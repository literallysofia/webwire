import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import yaml from "js-yaml";
import fs from "fs";
import { Config } from "./config";
import { Data } from "./data";
import { Render } from "./render";
import cliProgress, { SingleBar } from "cli-progress";
import colors from "colors";

async function render() {
  var dataFile = fs.readFileSync("./generated/data.json", "utf8");
  var jsonData = JSON.parse(dataFile);

  var configFile = fs.readFileSync("./config.yml", "utf8");
  var jsonConfig = yaml.safeLoad(configFile);

  var jsonConvert: JsonConvert = new JsonConvert();
  //jsonConvert.operationMode = OperationMode.LOGGING;
  jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null

  var bar = new SingleBar(
    {
      format:
        "Render Wireframe |" + colors.green("{bar}") + "| {percentage}% || {value}/{total} Elements || ETA: {eta}s",
    },
    cliProgress.Presets.shades_classic
  );

  var data: Data;
  try {
    data = jsonConvert.deserializeObject(jsonData, Data);
    bar.start(data.elements.length, 0);
    var config: Config;
    try {
      config = jsonConvert.deserializeObject(jsonConfig, Config);
      const render = new Render(data, config, bar);
      await render.draw();
      render.export();
      console.log("\n> Wireframe rendered with success!");
    } catch (e) {
      console.log(<Error>e);
    }
  } catch (e) {
    console.log(<Error>e);
  }
}

render();
