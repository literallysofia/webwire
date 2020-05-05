import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("Config")
export class Config {
  @JsonProperty("fonts", [String])
  fonts: string[] = [];

  @JsonProperty("keepOriginalText", Boolean)
  keepOriginalText: boolean = true;

  @JsonProperty("randomOffset", Number)
  randomOffset: number = 0;

  @JsonProperty("roughness", Number)
  roughness: number = 1;

  @JsonProperty("bowing", Number)
  bowing: number = 5;

  @JsonProperty("strokeWidth", Number)
  strokeWidth: number = 1.5;

  @JsonProperty("hachureGap", Number)
  hachureGap: number = 4;

  fontFamily: string = "";

  setRandomFontFamily() {
    var index = Math.floor(Math.random() * Math.floor(this.fonts.length));
    this.fontFamily = this.fonts[index];
  }
}
