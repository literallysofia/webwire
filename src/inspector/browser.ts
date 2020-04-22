import "chromedriver";
import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { CSS } from "./config";
import { conditions } from "./utils";

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
      "const styleElement = document.createElement('style');styleElement.setAttribute('id','style-tag');const styleTagCSSes = document.createTextNode('*,:after,:before{transition:none!important;transform:none!important;animation: none !important;}');styleElement.appendChild(styleTagCSSes);document.head.appendChild(styleElement);" +
      "if (typeof window.jQuery !== 'undefined') {window.jQuery(() => {window.jQuery.support.transition = false;if (typeof window.jQuery.fx !== 'undefined') {window.jQuery.fx.off = true;}});}";
    await this.driver.executeScript(script);
  }

  findElement(selector: string): WebElementPromise {
    return this.driver.findElement(By.tagName(selector));
  }

  async findElements(selector: string): Promise<WebElement[]> {
    return this.driver.findElements(By.xpath(selector));
  }

  async setSVGDimensions() {
    const svgs = await this.findElements("//*[name()='svg']");
    for (let svg of svgs) {
      const rect = await svg.getRect();
      const scriptH = `arguments[0].setAttribute('heigth', '${rect.height}')`;
      const scriptW = `arguments[0].setAttribute('width', '${rect.width}')`;
      await this.driver.executeScript(scriptH, svg);
      await this.driver.executeScript(scriptW, svg);
    }
  }

  async validateCSS(elem: WebElement, css: CSS[]): Promise<boolean> {
    let results: boolean[] = [];
    for (let c of css) {
      const propertyValue = parseInt(await elem.getCssValue(c.property), 10);
      if (!isNaN(propertyValue) && conditions.has(c.condition)) {
        results.push(conditions.get(c.condition)?.call(this, propertyValue, c.value));
      } else results.push(false);
    }
    if (!results.includes(false) || results.length === 0) return true;
    else return false;
  }

  async evalExpression(elem: WebElement, exp: string): Promise<string | number> {
    const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
    const awaitifyExpression = (exp: string) => exp.replace(/(css\.[a-zA-Z_])/g, 'await $1')
    const cssProxy = new Proxy({}, { get(_, prop: string) { 
      const cssValue = elem.getCssValue(prop.replace(/_/g, "-"))
      return cssValue.then((v: string) => {
        // console.log(`Element Property ${prop}, Selenium gives ${v} and parsed is ${parseInt(v, 10)}\n`)
        return isNaN(parseInt(v, 10)) ? v : parseInt(v, 10)
      })
    }})

    return new AsyncFunction('css', `return ${awaitifyExpression(exp)}`)(cssProxy)
  }

  async setDataType(elems: WebElement[], type: string, css: CSS[]) {
    for (let elem of elems) {
      const displayed = await elem.isDisplayed();
      const tag = await elem.getTagName();
      const cssValidated = await this.validateCSS(elem, css);

      console.log(await this.evalExpression(elem, 'css.width > 50'));

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

  async clearCookies(url?: string) {
    if (url) {
      const currentUrl = await this.driver.getCurrentUrl();
      await this.navigate(url);
      await this.driver.manage().deleteAllCookies();
      await this.navigate(currentUrl);
    } else {
      await this.driver.manage().deleteAllCookies();
    }
  }

  async close() {
    await this.driver.quit();
  }
}
