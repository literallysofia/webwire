import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("IElement")
export class IElement {
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

  @JsonProperty("lineHeight", Number, true)
  lineHeight: number = 0;

  @JsonProperty("align", String, true)
  align: string = "";

  @JsonProperty("text", String, true)
  text: string = "";

  @JsonProperty("nlines", Number, true)
  nlines: number = 0;
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
  @JsonProperty("size", Size)
  size: Size = {
    height: 0,
    width: 0
  };

  @JsonProperty("elements", [IElement])
  elements: IElement[] = [];
}
