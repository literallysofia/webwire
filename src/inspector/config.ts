import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("Element")
export class Element {
  @JsonProperty("type", String)
  type: string = "";

  @JsonProperty("paths", [String])
  paths: string[] = [];

  @JsonProperty("ignore", [String], true)
  ignore: string[] = [];
}

@JsonObject("Config")
export class Config {
  @JsonProperty("elements", [Element])
  elements: Element[] = [];

  @JsonProperty("keepOriginalText", Boolean)
  keepOriginalText: boolean = true;

  @JsonProperty("iconMaxWidth", Number)
  iconMaxWidth: number = 50;
}
