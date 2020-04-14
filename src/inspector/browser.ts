import "chromedriver";
import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise } from "selenium-webdriver";
import { ElementType } from "./utils";

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

  async setDataType(elems: WebElement[], type: string, iconMaxWidth: number) {
    for (let elem of elems) {
      const isElement = await this.isElement(elem, type, iconMaxWidth);
      if (isElement) {
        const script = "arguments[0].setAttribute('data-type', '" + type + "')";
        await this.driver.executeScript(script, elem);
      }
    }
  }

  private async isElement(elem: WebElement, type: string, iconMaxWidth: number): Promise<boolean> {
    const displayed = await elem.isDisplayed();

    if (type === ElementType.Checkbox || type === ElementType.Radio) return true;
    else if (type === ElementType.Container) {
      const isContainer = await this.isContainer(elem);
      if (isContainer) return true;
      else return false;
    } else if (type === ElementType.Icon) {
      const isIcon = await this.isIcon(elem, iconMaxWidth);
      if (isIcon) return true;
      else return false;
    } else if (displayed) return true;
    else return false;
  }

  private async isIcon(elem: WebElement, iconMaxWidth: number): Promise<boolean> {
    const rect = await elem.getRect();
    if (rect.width <= iconMaxWidth) return true;
    else return false;
  }

  private async isContainer(elem: WebElement): Promise<boolean> {
    const borderBottom = parseInt(await elem.getCssValue("border-bottom-width"), 10);
    const borderLeft = parseInt(await elem.getCssValue("border-left-width"), 10);
    const borderRight = parseInt(await elem.getCssValue("border-right-width"), 10);
    const borderTop = parseInt(await elem.getCssValue("border-top-width"), 10);
    if (borderBottom > 0 || borderLeft > 0 || borderRight > 0 || borderTop > 0) return true;
    else return false;
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
