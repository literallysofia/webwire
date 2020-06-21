import commandLineArgs from "command-line-args";
import { JsonConvert, ValueCheckingMode } from "json2typescript";
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
  { name: "textblock", alias: "t", type: String },
  { name: "realtext", type: Boolean },
  { name: "dummytext", type: Boolean },
  { name: "random", type: Number },
  { name: "roughness", alias: "r", type: Number },
  { name: "bowing", alias: "b", type: Number },
  { name: "stroke", alias: "s", type: Number },
]);

async function render() {
  const dataFile = readFileSync(args.src, "utf8");
  const jsonData = JSON.parse(dataFile);

  const configFile = readFileSync("./config/render.yml", "utf8");
  const jsonConfig = safeLoad(configFile);

  const jsonConvert = new JsonConvert();
  jsonConvert.ignorePrimitiveChecks = false;
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

  try {
    const data = jsonConvert.deserializeObject(jsonData, Data);
    try {
      const config = jsonConvert.deserializeObject(jsonConfig, Config);
      config.init({
        font: args.font,
        textBlock: args.textblock,
        randomOffset: args.random,
        keepOriginalText: args.realtext ? true : args.dummytext ? false : undefined,
        roughness: args.roughness,
        bowing: args.bowing,
        strokeWidth: args.stroke,
      });

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
