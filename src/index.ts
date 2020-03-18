import commandLineArgs from "command-line-args";
import { Browser } from "./browser";
import { Inspector } from "./inspector";

const website = commandLineArgs([{ name: "src", alias: "s", type: String, defaultOption: true }]);

const browser = new Browser("chrome");
browser.navigate(website.src);
const inspector = new Inspector(browser);

async function test() {
  /*   for (let tag of website.tags) {
    await inspector.fetchData(tag);
  }
  inspector.export(); */
  await inspector.normalize();
}

test();
