const execSync = require("child_process").execSync;
const fs = require("fs");
const stdio = { stdio: "inherit" };

function run() {
  let input;
  try {
    input = fs.readFileSync("./sites.txt", "utf-8");
    const urls = input.split("\n");

    execSync("npm run build", stdio);
    urls.forEach((url) => {
      execSync("npm run inspector " + url, stdio);
      execSync("npm run render", stdio);
    });
    console.log("\n> Wireframes generated with success!");
  } catch (e) {
    console.error("> " + e.name + "! " + e.message);
  }
}

run();
