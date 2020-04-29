import commandLineArgs from "command-line-args";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { SingleBar, Presets } from "cli-progress";
import { green } from "colors";
import { safeLoad } from "js-yaml";
import { readFileSync } from "fs";
import { Config } from "./config";
import { Data } from "./data";
import { Render } from "./render";

const data = commandLineArgs([{ name: "src", alias: "s", type: String, defaultOption: true }]);

async function render() {
  const dataFile = readFileSync(data.src, "utf8");
  const jsonData = JSON.parse(dataFile);

  const configFile = readFileSync("./config/render.yml", "utf8");
  const jsonConfig = safeLoad(configFile);

  const jsonConvert = new JsonConvert();
  //jsonConvert.operationMode = OperationMode.LOGGING;
  jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null

  const bar = new SingleBar(
    {
      format: "Render Wireframe |" + green("{bar}") + "| {percentage}% || {value}/{total} Elements || ETA: {eta}s",
    },
    Presets.shades_classic
  );

  try {
    const data = jsonConvert.deserializeObject(jsonData, Data);
    bar.start(data.elements.length, 0);
    try {
      const config = jsonConvert.deserializeObject(jsonConfig, Config);
      const render = new Render(data, config, bar);
      await render.draw();
      render.export();
      //TODO: change log
      //console.log("\n> Wireframe rendered with success!");
    } catch (e) {
      console.error(<Error>e);
    }
  } catch (e) {
    console.error(<Error>e);
  }
}

render();
