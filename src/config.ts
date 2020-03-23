import { JsonObject, JsonProperty } from "json2typescript";

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

  @JsonProperty("titles", [String])
  titles: string[] = [];

  @JsonProperty("randomize", Boolean)
  randomize: boolean = false;

  @JsonProperty("randomOffset", Number)
  randomOffset: number = 1;

  @JsonProperty("options")
  options: any = undefined;

  fontFamily: string = "";

  setFontFamily() {
    var index = Math.floor(Math.random() * Math.floor(this.fonts.length - 1));
    this.fontFamily = this.fonts[index];
  }

  getRandomTitle(): string {
    var index = Math.floor(Math.random() * Math.floor(this.titles.length));
    return this.titles[index];
  }
}

/* const options = {
  roughness: Math.random() + 0.5,
  bowing: Math.random() * 5,
  //strokeWidth: Math.random() * 4 + 1,
  strokeWidth: 1.5,
  hachureGap: Math.random() * 4
}; */
