import commandLineArgs from "command-line-args";
import { Browser } from "./browser";
import { Inspector } from "./inspector";

const website = commandLineArgs([
  { name: "url", alias: "u", type: String },
  {
    name: "tags",
    alias: "t",
    type: String,
    multiple: true,
    defaultOption: true
  }
]);

const browser = new Browser("chrome");
browser.navigate(website.url);
const inspector = new Inspector(browser);

async function test() {
  /*   for (let tag of website.tags) {
    await inspector.fetchData(tag);
  }
  inspector.export(); */
  await inspector.normalize();
}

test();
