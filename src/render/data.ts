import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("UIElement")
export class UIElement {
  @JsonProperty("name", String)
  name: string = "";

  @JsonProperty("height", Number)
  height: number = 0;

  @JsonProperty("width", Number)
  width: number = 0;

  @JsonProperty("x", Number)
  x: number = 0;

  @JsonProperty("y", Number)
  y: number = 0;

  @JsonProperty("fsize", Number, true)
  fsize: number = 0;

  @JsonProperty("lheight", Number, true)
  lheight: number = 0;

  @JsonProperty("align", String, true)
  align: string = "";

  @JsonProperty("content", String, true)
  content: string = "";

  @JsonProperty("nlines", Number, true)
  nlines: number = 1;

  @JsonProperty("svg", String, true)
  svg: string = "";
}

@JsonObject("Size")
export class Size {
  @JsonProperty("height", Number)
  height: number = 0;

  @JsonProperty("width", Number)
  width: number = 0;
}

@JsonObject("Data")
export class Data {
  @JsonProperty("id", Number)
  id: number = 0;

  @JsonProperty("size", Size)
  size: Size = {
    height: 0,
    width: 0,
  };

  @JsonProperty("elements", [UIElement])
  elements: UIElement[] = [];
}
