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

  @JsonProperty("align", String, true)
  align: string = "left";

  @JsonProperty("nlines", Number, true)
  nlines: number = 0;
}
