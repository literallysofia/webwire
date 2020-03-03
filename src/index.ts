import { Browser } from "./browser";
import { Inspector } from "./inspector";

const commandLineArgs = require("command-line-args");

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
  for (let tag of website.tags) {
    let groups = await inspector.fetchElements(tag);
    await inspector.addGroups(groups);
    //let obj = await inspector.getElements(tag);
    //await inspector.addElements(obj);
  }
  inspector.export();
}

test();
