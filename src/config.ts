import { JsonObject, JsonProperty } from "json2typescript";
import { LoremIpsum } from "lorem-ipsum";

@JsonObject("XElement")
export class XElement {
  @JsonProperty("type", String)
  type: string = "";

  @JsonProperty("paths", [String])
  paths: string[] = [];

  @JsonProperty("ignore", [String], true)
  ignore: string[] = [];
}

@JsonObject("Config")
export class Config {
  @JsonProperty("elements", [XElement])
  elements: XElement[] = [];

  @JsonProperty("fonts", [String])
  fonts: string[] = [];

  @JsonProperty("keepOriginalText", Boolean)
  keepOriginalText: boolean = true;

  @JsonProperty("randomize", Boolean)
  randomize: boolean = false;

  @JsonProperty("randomOffset", Number)
  randomOffset: number = 1;

  @JsonProperty("options")
  options = { roughness: 1, bowing: 5, strokeWidth: 1.5, hachureGap: 4 };

  fontFamily: string = "";

  setFontFamily() {
    var index = Math.floor(Math.random() * Math.floor(this.fonts.length));
    this.fontFamily = this.fonts[index];
  }

  getRandomSentence(): string {
    var lorem = new LoremIpsum({
      wordsPerSentence: {
        max: 15,
        min: 1
      }
    });
    return lorem.generateSentences(1);
  }
}

/* const options = {
  roughness: Math.random() + 0.5,
  bowing: Math.random() * 5,
  //strokeWidth: Math.random() * 4 + 1,
  strokeWidth: 1.5,
  hachureGap: Math.random() * 4
}; */
