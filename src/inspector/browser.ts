import "chromedriver";
import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise } from "selenium-webdriver";

export class Browser {
  private driver: ThenableWebDriver;

  constructor(browserName: string) {
    this.driver = new Builder().forBrowser(browserName).build();
  }

  async navigate(url: string) {
    await this.driver.get(url);
    await this.driver
      .manage()
      .window()
      .maximize();

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

  async setDataType(elems: WebElement[], type: string) {
    for (let elem of elems) {
      const displayed = await elem.isDisplayed();
      const tag = await elem.getTagName();
      if (displayed || tag === "input") {
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
