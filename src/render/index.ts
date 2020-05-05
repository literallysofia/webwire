import commandLineArgs from "command-line-args";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { SingleBar, Presets } from "cli-progress";
import { green } from "colors";
import { safeLoad } from "js-yaml";
import { readFileSync } from "fs";
import { Config } from "./config";
import { Data } from "./data";
import { Render } from "./render";

const args = commandLineArgs([
  { name: "src", type: String },
  { name: "font", alias: "f", type: String },
  { name: "realtext", alias: "t", type: Boolean },
  { name: "random", type: Number },
  { name: "roughness", alias: "r", type: Number },
  { name: "bowing", alias: "b", type: Number },
  { name: "stroke", alias: "s", type: Number },
  { name: "hachure", alias: "h", type: Number },
]);

function configOverride(config: Config) {
  if (args.font !== undefined) config.fontFamily = args.font;
  if (args.realtext !== undefined) config.keepOriginalText = args.realtext;
  if (args.random !== undefined) config.randomOffset = args.random;
  if (args.roughness !== undefined) config.roughness = args.roughness;
  if (args.bowing !== undefined) config.bowing = args.bowing;
  if (args.stroke !== undefined) config.strokeWidth = args.stroke;
  if (args.hachure !== undefined) config.hachureGap = args.hachure;
}

async function render() {
  const dataFile = readFileSync(args.src, "utf8");
  const jsonData = JSON.parse(dataFile);

  const configFile = readFileSync("./config/render.yml", "utf8");
  const jsonConfig = safeLoad(configFile);

  const jsonConvert = new JsonConvert();
  //jsonConvert.operationMode = OperationMode.LOGGING;
  jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null

  console.log(args.src, args.font, args.realtext, args.random, args.roughness, args.bowing, args.stroke, args.hachure);

  try {
    const data = jsonConvert.deserializeObject(jsonData, Data);
    try {
      const config = jsonConvert.deserializeObject(jsonConfig, Config);
      configOverride(config);
      const bar = new SingleBar(
        {
          format: "Render Wireframe |" + green("{bar}") + "| {percentage}% || {value}/{total} Elements || ETA: {eta}s",
        },
        Presets.shades_classic
      );
      const render = new Render(data, config, bar);
      await render.draw();
      await render.export();
    } catch (e) {
      console.error(<Error>e);
    }
  } catch (e) {
    console.error(<Error>e);
  }
}

render();
