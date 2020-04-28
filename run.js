const execSync = require("child_process").execSync;
const fs = require("fs");
const colors = require("colors");
const stdio = { stdio: "inherit" };
const del = require("del");

function run() {
  try {
    //del.sync("./generated");

    let input = fs.readFileSync("./sites.txt", "utf-8");
    const urls = input.split("\n");

    execSync("npm run build", stdio);
    urls.forEach((url) => {
      execSync("npm run inspector " + url, stdio);
      execSync("npm run render", stdio);
    });
    console.log(colors.green("\nGeneration complete!\n") + `+ generated wireframes for ${urls.length} websites\n`);
  } catch (e) {
    console.error("> " + e.name + "! " + e.message);
  }
}

run();
