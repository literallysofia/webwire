import { JsonConvert, OperationMode, ValueCheckingMode, JsonObject, JsonProperty } from "json2typescript";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { green } from "colors";
import del from "del";

@JsonObject("Designer")
export class Designer {
  @JsonProperty("id", String)
  id: string = "";

  @JsonProperty("keepOriginalText", Boolean, true)
  keepOriginalText: boolean = true;

  @JsonProperty("randomOffset", Number, true)
  randomOffset: number = 0;

  @JsonProperty("strokeWidth", Number, true)
  strokeWidth: Number = 1;
}

@JsonObject("Website")
export class Website {
  static _id: number = 1;
  id: number;

  @JsonProperty("url", String)
  url: string = "";

  @JsonProperty("designers", [String], true)
  designers: string[] = [];

  @JsonProperty("sketches", Number)
  sketches: number = 1;

  constructor() {
    this.id = Website._id++;
  }
}

@JsonObject("Data")
export class Data {
  @JsonProperty("randomSeed", Number)
  randomSeed: number = 0;

  @JsonProperty("designers", [Designer])
  designers: Designer[] = [];

  @JsonProperty("websites", [Website])
  websites: Website[] = [];
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
    execSync("npm run build", { stdio: "inherit" });

    let counter = 0;
    data.websites.forEach((website) => {
      execSync(`npm run inspector -- --id ${website.id} --src ${website.url}`, { stdio: "inherit" });
      execSync(`npm run render -- --src ./generated/data/data_${website.id}.json -s ${website.sketches}`, { stdio: "inherit" });
      counter += website.sketches;
    });

    console.log(green("\nGeneration complete!\n") + `+ generated a total of ${counter} wireframes for ${data.websites.length} different websites\n`);
  } catch (e) {
    console.error(<Error>e);
  }
}

run();
