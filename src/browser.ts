import "chromedriver";
import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise } from "selenium-webdriver";

export class Browser {
  private driver: ThenableWebDriver;

  public constructor(browserName: string) {
    this.driver = new Builder().forBrowser(browserName).build();
  }

  public async navigate(url: string): Promise<void> {
    await this.driver.get(url);
    await this.driver
      .manage()
      .window()
      .maximize();
  }

  public findElement(selector: string): WebElementPromise {
    return this.driver.findElement(By.css(selector));
  }

  public async findElements(selector: string): Promise<WebElement[]> {
    return this.driver.findElements(By.xpath(selector));
  }

  public setDataType(elems: WebElement[], type: string) {
    for (let elem of elems) {
      var script = "arguments[0].setAttribute('data-type', '" + type + "')";
      this.driver.executeScript(script, elem);
    }
  }

  public removeDataType(elems: WebElement[]) {
    for (let elem of elems) {
      var script = "arguments[0].removeAttribute('data-type')";
      this.driver.executeScript(script, elem);
    }
  }

  public async clearCookies(url?: string): Promise<void> {
    if (url) {
      const currentUrl = await this.driver.getCurrentUrl();
      await this.navigate(url);
      await this.driver.manage().deleteAllCookies();
      await this.navigate(currentUrl);
    } else {
      await this.driver.manage().deleteAllCookies();
    }
  }

  public async close(): Promise<void> {
    await this.driver.quit();
  }
}
