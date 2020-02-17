import "chromedriver";
import {
  Builder,
  ThenableWebDriver,
  WebElement,
  By,
  WebElementPromise,
  promise
} from "selenium-webdriver";

export class Browser {
  private driver: ThenableWebDriver;
  public constructor(private browserName: string) {
    this.driver = new Builder().forBrowser(browserName).build();
  }

  public async navigate(url: string): Promise<void> {
    await this.driver.get(url);
    //navigate().to(url);
  }

  public findElement(selector: string): WebElementPromise {
    return this.driver.findElement(By.css(selector));
  }

  public findElements(selector: string): Promise<WebElement[]> {
    return this.driver.findElements(By.css(selector));
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

var link1 = "https://getbootstrap.com/docs/4.4/examples/floating-labels/";
var link2 = "https://v4-alpha.getbootstrap.com/examples/album/";

let browser = new Browser("chrome");
browser.navigate(link1);
var elems = browser.findElements("img");

promise.filter(elems, function(elem) {
  console.log(elem);
  return elem.isDisplayed();
});