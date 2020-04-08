import "chromedriver";
import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise } from "selenium-webdriver";
import { ElementType } from "./utils";

export class Browser {
  private driver: ThenableWebDriver;

  constructor(browserName: string) {
    this.driver = new Builder().forBrowser(browserName).build();
  }

  async navigate(url: string): Promise<void> {
    await this.driver.get(url);
    await this.driver
      .manage()
      .window()
      .maximize();

    //remove css and jquery animations
    var script =
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

  async setDataType(elems: WebElement[], type: string, iconMinWidth: number): Promise<void> {
    for (let elem of elems) {
      let displayed = await elem.isDisplayed();
      let rect = await elem.getRect();
      if (type === ElementType.Icon && rect.width > iconMinWidth) return;
      if (displayed || type === ElementType.Checkbox || type === ElementType.Radio) {
        let script = "arguments[0].setAttribute('data-type', '" + type + "')";
        this.driver.executeScript(script, elem);
      }
    }
  }

  async removeDataType(elems: WebElement[]): Promise<void> {
    for (let elem of elems) {
      let script = "arguments[0].removeAttribute('data-type')";
      await this.driver.executeScript(script, elem);
    }
  }

  async getSVG(elem: WebElement): Promise<string> {
    var script = "return arguments[0].outerHTML";
    return await this.driver.executeScript(script, elem);
  }

  async clearCookies(url?: string): Promise<void> {
    if (url) {
      const currentUrl = await this.driver.getCurrentUrl();
      await this.navigate(url);
      await this.driver.manage().deleteAllCookies();
      await this.navigate(currentUrl);
    } else {
      await this.driver.manage().deleteAllCookies();
    }
  }

  async close(): Promise<void> {
    await this.driver.quit();
  }
}
