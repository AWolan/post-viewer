import { browser, by, element, ExpectedConditions as EC, ElementFinder } from 'protractor';

import { PostPage } from './post.po';
import { PostEditPage } from './post-edit.po';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }
  
  waitForUserLoadingStart() {
    const condition = EC.presenceOf(this.getUserLoading());
    browser.wait(condition, 2000); 
  }
  
  waitForUserLoadingFinish() {
    const condition = EC.not(EC.presenceOf(this.getUserLoading()));
    browser.wait(condition, 2000); 
  }
  
  getUserLoading() {
    return element(by.css('.users .loading'));
  }
  
  waitForPostLoadingFinish() {
    const condition = EC.not(EC.presenceOf(this.getPostLoading()));
    browser.wait(condition, 5000); 
  }
  
  getPostLoading() {
    return element(by.css('.posts .loading'));
  }
  
  getUsers() {
    return element.all(by.css('.user'));
  }
  
  getUser(i: number) {
    return this.getUsers().get(i);
  }
  
  getPosts() {
    return element.all(by.css('.post'));
  }
  
  getPost(i: number) {
    return this.getPosts().get(i);
  }
  
  getPostPage(el: ElementFinder) {
    return new PostPage(el);
  }
  
  waitForPostEditorOpen() {
    const condition = EC.presenceOf(element(by.css('.post-edit')));
    browser.wait(condition, 5000); 
  }
  
  waitForPostEditorClose() {
    const condition = EC.not(EC.presenceOf(element(by.css('.post-edit'))));
    browser.wait(condition, 5000); 
  }
  
  getPostEditorPage() {
    const el = element(by.css('.post-edit'));
    return new PostEditPage(el);
  }
  
  waitForPostEditSuccess() {
    const condition = EC.not(EC.presenceOf(element(by.css('.updating'))));
    browser.wait(condition, 5000); 
  }
}
