import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("Window")
class Window {
  @JsonProperty("height", Number)
  height: number = 1080;

  @JsonProperty("width", Number)
  width: number = 1920;
}

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

  @JsonProperty("browser", String)
  browser: string = "chrome";

  @JsonProperty("headless", Boolean)
  headless: boolean = true;

  @JsonProperty("window", Window)
  window: Window = new Window();
}
