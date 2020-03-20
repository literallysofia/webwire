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

  @JsonProperty("nLines", Number, true)
  nLines: number = 0;
}