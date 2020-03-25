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

@JsonObject("WordsPerTitle")
export class WordsPerTitle {
  @JsonProperty("min", Number)
  min: number = 1;

  @JsonProperty("max", Number)
  max: number = 2;
}

@JsonObject("Config")
export class Config {
  @JsonProperty("elements", [XElement])
  elements: XElement[] = [];

  @JsonProperty("fonts", [String])
  fonts: string[] = [];

  @JsonProperty("wordsPerTitle", WordsPerTitle)
  wordsPerTitle: WordsPerTitle = { min: 1, max: 6 };

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

  getTitleText(): string {
    var lorem = new LoremIpsum({
      wordsPerSentence: {
        max: this.wordsPerTitle.max,
        min: this.wordsPerTitle.min
      }
    });
    return lorem.generateSentences(1).slice(0, -1);
  }
}

/* const options = {
  roughness: Math.random() + 0.5,
  bowing: Math.random() * 5,
  //strokeWidth: Math.random() * 4 + 1,
  strokeWidth: 1.5,
  hachureGap: Math.random() * 4
}; */
