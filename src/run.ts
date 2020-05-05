import { JsonConvert, OperationMode, ValueCheckingMode, JsonObject, JsonProperty } from "json2typescript";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { green } from "colors";
import del from "del";

@JsonObject("Style")
class Style {
  @JsonProperty("name", String)
  name: string = "";

  @JsonProperty("font", String, true)
  font: string | undefined = undefined;

  @JsonProperty("keepOriginalText", Boolean, true)
  keepOriginalText: boolean | undefined = undefined;

  @JsonProperty("randomOffset", Number, true)
  randomOffset: number | undefined = undefined;

  @JsonProperty("roughness", Number, true)
  roughness: number | undefined = undefined;

  @JsonProperty("bowing", Number, true)
  bowing: number | undefined = undefined;

  @JsonProperty("strokeWidth", Number, true)
  strokeWidth: Number | undefined = undefined;

  @JsonProperty("hachureGap", Number, true)
  hachureGap: number | undefined = undefined;
}

@JsonObject("Website")
class Website {
  static _id: number = 1;
  id: number;

  @JsonProperty("url", String)
  url: string = "";

  @JsonProperty("styles", [String], true)
  styles: string[] = [];

  @JsonProperty("draws", Number)
  draws: number = 1;

  constructor() {
    this.id = Website._id++;
  }
}

@JsonObject("Data")
class Data {
  @JsonProperty("randomSeed", Number)
  randomSeed: number = 0;

  @JsonProperty("styles", [Style])
  styles: Style[] = [];

  @JsonProperty("websites", [Website])
  websites: Website[] = [];
}

function renderScript(id: number, style: Style | undefined): string {
  let script = `npm run render -- --src ./generated/data/data_${id}.json`;

  if (style) {
    if (style.font !== undefined) script += ` -f ${style.font}`;
    if (style.keepOriginalText !== undefined) script += ` -t`;
    if (style.randomOffset !== undefined) script += ` --random ${style.randomOffset}`;
    if (style.roughness !== undefined) script += ` -r ${style.roughness}`;
    if (style.bowing !== undefined) script += ` -b ${style.bowing}`;
    if (style.strokeWidth !== undefined) script += ` -s ${style.strokeWidth}`;
    if (style.hachureGap !== undefined) script += ` -h ${style.hachureGap}`;
  }

  return script;
}

function run() {
  try {
    del.sync("./generated");

    const mainFile = readFileSync("./main.json", "utf8");
    const jsonData = JSON.parse(mainFile);

    const jsonConvert = new JsonConvert();
    //jsonConvert.operationMode = OperationMode.LOGGING;
    jsonConvert.ignorePrimitiveChecks = false;
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;

    const data = jsonConvert.deserializeObject(jsonData, Data);

    let counter = 0;
    data.websites.forEach((website) => {
      execSync(`npm run inspector -- --id ${website.id} --src ${website.url}`, { stdio: "inherit" });

      for (let i = 0; i < website.draws; i++) {
        let style: Style | undefined;

        if (website.styles.length > 0) {
          const index = Math.floor(Math.random() * Math.floor(website.styles.length));
          const styleName = website.styles[index];
          style = data.styles.find((s) => s.name === styleName);
        }

        const script = renderScript(website.id, style);
        execSync(script, { stdio: "inherit" });
      }

      counter += website.draws;
    });

    console.log(green("\nGeneration complete!\n") + `+ generated a total of ${counter} wireframes for ${data.websites.length} different websites\n`);
  } catch (e) {
    console.error(<Error>e);
  }
}

run();
