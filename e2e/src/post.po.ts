import { by, ElementFinder, ElementArrayFinder } from 'protractor';

export class PostPage {
  constructor(private element: ElementFinder | ElementArrayFinder) {}
  
  getTitleText() {
    return this.element.element(by.css('.title')).getText() as Promise<string>;
  }
  
  getBodyText() {
    return this.element.element(by.css('.body')).getText() as Promise<string>;
  }
}
