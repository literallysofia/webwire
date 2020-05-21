import "chromedriver";
import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";

export class Browser {
  private driver: ThenableWebDriver;

  constructor(browser: string, headless: boolean, height: number, width: number) {
    let options = new Options();
    if (headless) options.headless();
    options.windowSize({ width: width, height: height });

    this.driver = new Builder()
      .forBrowser(browser)
      .setChromeOptions(options)
      .build();
  }

  async navigate(url: string) {
    await this.driver.get(url);

    //remove css and jquery animations
    const script =
      "const styleElement = document.createElement('style');styleElement.setAttribute('id','style-tag');const styleTagCSSes = document.createTextNode('*,:after,:before{transition:none!important;animation: none !important;}');styleElement.appendChild(styleTagCSSes);document.head.appendChild(styleElement);" +
      "if (typeof window.jQuery !== 'undefined') {window.jQuery(() => {window.jQuery.support.transition = false;if (typeof window.jQuery.fx !== 'undefined') {window.jQuery.fx.off = true;}});}";
    await this.driver.executeScript(script);
  }

  async findElement(selector: string): Promise<WebElement> {
    return await this.driver.findElement(By.tagName(selector));
  }

  async findElements(selector: string): Promise<WebElement[]> {
    return await this.driver.findElements(By.xpath(selector));
  }

  async setSVGDimensions() {
    const svgs = await this.findElements("//*[name()='svg']");
    for (let svg of svgs) {
      const rect = await svg.getRect();
      const scriptH = `arguments[0].setAttribute('height', '${rect.height}')`;
      const scriptW = `arguments[0].setAttribute('width', '${rect.width}')`;
      await this.driver.executeScript(scriptH, svg);
      await this.driver.executeScript(scriptW, svg);
    }
  }

  async evalExpression(elem: WebElement, exp: string): Promise<boolean> {
    const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor;
    const awaitifyExpression = (exp: string) => exp.replace(/(css\.[a-zA-Z_])/g, "await $1");

    const cssProxy = new Proxy(
      {},
      {
        async get(_, prop: string) {
          const cssValue = await elem.getCssValue(prop.replace(/_/g, "-"));
          //console.log(`Element Property ${prop}, Selenium gives ${cssValue} and parsed is ${parseInt(cssValue, 10)}\n`);
          return isNaN(parseInt(cssValue, 10)) ? cssValue : parseInt(cssValue, 10);
        },
      }
    );

    return new AsyncFunction("css", `return ${awaitifyExpression(exp)}`)(cssProxy);
  }

  async setDataType(elems: WebElement[], type: string, css: string) {
    for (let elem of elems) {
      const displayed = await elem.isDisplayed();
      const tag = await elem.getTagName();

      let cssValidated: boolean;
      if (css === "") cssValidated = true;
      else cssValidated = await this.evalExpression(elem, css);
      //console.log(cssValidated);

      if ((displayed && cssValidated) || (tag === "input" && cssValidated)) {
        const script = `arguments[0].setAttribute('data-type', '${type}')`;
        await this.driver.executeScript(script, elem);
      }
    }
  }

  async removeDataType(elems: WebElement[]) {
    for (let elem of elems) {
      const script = "arguments[0].removeAttribute('data-type')";
      await this.driver.executeScript(script, elem);
    }
  }

  async getSVG(elem: WebElement): Promise<string> {
    const script = "return arguments[0].outerHTML";
    return await this.driver.executeScript(script, elem);
  }

  async getDocumentHeight(): Promise<number> {
    const script =
      "const body = document.body; const html = document.documentElement; return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);";
    return await this.driver.executeScript(script);
  }

  async getDocumentWidth(): Promise<number> {
    const script =
      "const body = document.body; const html = document.documentElement; return Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);";
    return await this.driver.executeScript(script);
  }

  async close() {
    await this.driver.quit();
  }
}
