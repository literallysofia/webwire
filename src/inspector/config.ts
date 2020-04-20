import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("CSS")
export class CSS {
  @JsonProperty("property", String)
  property: string = "";

  @JsonProperty("condition", String)
  condition: string = "";

  @JsonProperty("value", Number)
  value: number = 0;
}

@JsonObject("Element")
class Element {
  @JsonProperty("type", String)
  type: string = "";

  @JsonProperty("paths", [String])
  paths: string[] = [];

  @JsonProperty("ignore", [String], true)
  ignore: string[] = [];

  @JsonProperty("css", [CSS], true)
  css: CSS[] = [];
}

@JsonObject("Config")
export class Config {
  @JsonProperty("elements", [Element])
  elements: Element[] = [];

  @JsonProperty("keepOriginalText", Boolean)
  keepOriginalText: boolean = true;
}
