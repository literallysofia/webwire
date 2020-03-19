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
  }

  findElement(selector: string): WebElementPromise {
    return this.driver.findElement(By.css(selector));
  }

  async findElements(selector: string): Promise<WebElement[]> {
    return this.driver.findElements(By.xpath(selector));
  }

  async setDataType(elems: WebElement[], type: string): Promise<void> {
    for (let elem of elems) {
      var displayed = await elem.isDisplayed();
      var script = "arguments[0].setAttribute('data-type', '" + type + "')";

      if (displayed || type === ElementType.Checkbox || type === ElementType.Radio) {
        this.driver.executeScript(script, elem);
      }
    }
  }

  removeDataType(elems: WebElement[]) {
    for (let elem of elems) {
      var script = "arguments[0].removeAttribute('data-type')";
      this.driver.executeScript(script, elem);
    }
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
