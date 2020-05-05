import { JsonObject, JsonProperty } from "json2typescript";
import { random, Options } from "./utils";

@JsonObject("Interval")
export class Interval {
  @JsonProperty("value", Number, true)
  value: number = 0;

  @JsonProperty("min", Number)
  min: number = 0;

  @JsonProperty("max", Number)
  max: number = 0;

  setRandomValue() {
    this.value = parseFloat(random(this.min, this.max).toFixed(1));
  }
}

@JsonObject("Config")
export class Config {
  @JsonProperty("fonts", [String])
  fonts: string[] = [];

  @JsonProperty("textBlockStyles", [String])
  textBlockStyles: string[] = [];

  @JsonProperty("keepOriginalText", Boolean)
  keepOriginalText: boolean = true;

  @JsonProperty("randomOffset", Interval)
  randomOffset: Interval = new Interval();

  @JsonProperty("roughness", Interval)
  roughness: Interval = new Interval();

  @JsonProperty("bowing", Interval)
  bowing: Interval = new Interval();

  @JsonProperty("strokeWidth", Interval)
  strokeWidth: Interval = new Interval();

  fontFamily: string = "";

  textBlockStyle: string = "";

  setRandomFontFamily() {
    var index = Math.floor(Math.random() * Math.floor(this.fonts.length));
    this.fontFamily = this.fonts[index];
  }

  setRandomTBStyle() {
    var index = Math.floor(Math.random() * Math.floor(this.textBlockStyles.length));
    this.textBlockStyle = this.textBlockStyles[index];
  }

  init(options: Options) {
    if (options.randomOffset !== undefined) this.randomOffset.value = options.randomOffset;
    else this.randomOffset.setRandomValue();

    if (options.keepOriginalText !== undefined) this.keepOriginalText = options.keepOriginalText;

    if (options.roughness !== undefined) this.roughness.value = options.roughness;
    else this.roughness.setRandomValue();

    if (options.bowing !== undefined) this.bowing.value = options.bowing;
    else this.bowing.setRandomValue();

    if (options.strokeWidth !== undefined) this.strokeWidth.value = options.strokeWidth;
    else this.strokeWidth.setRandomValue();

    if (options.font !== undefined) this.fontFamily = options.font;
    else this.setRandomFontFamily();

    if (options.textBlock !== undefined) this.textBlockStyle = options.textBlock;
    else this.setRandomTBStyle();
  }
}
