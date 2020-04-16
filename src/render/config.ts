import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("Config")
export class Config {
  @JsonProperty("fonts", [String])
  fonts: string[] = [];

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
}

/* const options = {
  roughness: Math.random() + 0.5,
  bowing: Math.random() * 5,
  //strokeWidth: Math.random() * 4 + 1,
  strokeWidth: 1.5,
  hachureGap: Math.random() * 4
}; */
