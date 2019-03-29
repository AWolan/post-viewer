import { by, ElementFinder, Key } from 'protractor';

export class PostEditPage {
  constructor(private element: ElementFinder) {}
  
  getTitleInput() {
    return this.element.element(by.css('.title > textarea'));
  }
  
  getBodyInput() {
    return this.element.element(by.css('.body > textarea'));
  }
  
  getText(input: ElementFinder) {
    return input.getAttribute('value') as Promise<string>;
  }
  
  getTitleText() {
    return this.getText(this.getTitleInput());
  }
  
  getBodyText() {
    return this.getText(this.getBodyInput());
  }
    
  setText(input: ElementFinder, text: string, append?: boolean) {
    const inputs: any = [];
    if (!append) {
      inputs.push(Key.chord(Key.CONTROL, "a"));
    }
    inputs.push(text);
    input.sendKeys(...inputs);
  }
  
  getSaveButton() {
    return this.element.element(by.css('.save'));
  }
  
  getCloseButton() {
    return this.element.element(by.css('.close'));
  }
}
