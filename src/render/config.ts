import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("Config")
export class Config {
  @JsonProperty("fonts", [String])
  fonts: string[] = [];

  @JsonProperty("keepOriginalText", Boolean)
  keepOriginalText: boolean = true;

  @JsonProperty("randomOffset", Number)
  randomOffset: number = 0;

  @JsonProperty("options")
  options = { roughness: 1, bowing: 5, strokeWidth: 1.5, hachureGap: 4 };

  fontFamily: string = "";

  setFontFamily() {
    var index = Math.floor(Math.random() * Math.floor(this.fonts.length));
    this.fontFamily = this.fonts[index];
  }
}
