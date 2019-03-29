import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
import { by } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  const changeWhitespaces = (text: string) => {
    return text.replace(/\s/g, ' ');
  };
  
  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should load 10 users', async () => {
    await page.waitForUserLoadingFinish();
    const users = await page.getUsers();
    
    expect(await users.length).toBe(10);
  });

  it('should start loading posts on user click', async () => {
    await page.waitForUserLoadingFinish();
    const users = await page.getUsers();
    users[1].click()
    const loading = await page.getPostLoading();
    
    expect(await loading.getText()).toEqual('Loading');
  });

  it('should load 10 posts on user click', async () => {
    await page.waitForUserLoadingFinish();
    const user = await page.getUser(1);
    await user.click();
    await page.waitForPostLoadingFinish();
    const posts = await page.getPosts();
    
    expect(await posts.length).toBe(10);
  });

  it('should open editor on post click', async () => {
    await page.waitForUserLoadingFinish();
    const user = await page.getUser(1);
    await user.click();
    await page.waitForPostLoadingFinish();
    const post = await page.getPost(2);
    await post.click();
    await page.waitForPostEditorOpen();
    const postPage = await page.getPostPage(post);
    const postEditorPage = await page.getPostEditorPage();
      
    const postEditorTitle = changeWhitespaces(await postEditorPage.getTitleText());
    const postEditorBody = changeWhitespaces(await postEditorPage.getBodyText());
    const postTitle = changeWhitespaces(await postPage.getTitleText());
    const postBody = changeWhitespaces(await postPage.getBodyText());
    
    expect(postEditorTitle).toBe(postTitle);
    expect(postEditorBody).toBe(postBody);
  });

  it('should close editor without saving changes on close button click', async () => {
    await page.waitForUserLoadingFinish();
    const user = await page.getUser(1);
    await user.click();
    await page.waitForPostLoadingFinish();
    const post = await page.getPost(2);
    await post.click();
    await page.waitForPostEditorOpen();
    
      
    const title = 'New title';
    const body = 'New body';
    const postEditorPage = await page.getPostEditorPage();
    const titleInput = await postEditorPage.getTitleInput();
    const bodyInput = await postEditorPage.getBodyInput();
    await postEditorPage.setText(titleInput, title);
    await postEditorPage.setText(bodyInput, body);
      
    await postEditorPage.getCloseButton().click();
    await page.waitForPostEditorClose();
    
    const postPage = await page.getPostPage(post);
    const postTitle = changeWhitespaces(await postPage.getTitleText());
    const postBody = changeWhitespaces(await postPage.getBodyText());
    
    expect(postTitle).not.toBe(title);
    expect(postBody).not.toBe(body);
  });

  it('should close editor and save changes on save button click', async () => {
    await page.waitForUserLoadingFinish();
    const user = await page.getUser(1);
    await user.click();
    await page.waitForPostLoadingFinish();
    const post = await page.getPost(2);
    await post.click();
    await page.waitForPostEditorOpen();
      
    const title = 'New title';
    const body = 'New body';
    const postEditorPage = await page.getPostEditorPage();
    const titleInput = await postEditorPage.getTitleInput();
    const bodyInput = await postEditorPage.getBodyInput();
    await postEditorPage.setText(titleInput, title);
    await postEditorPage.setText(bodyInput, body);
      
    await postEditorPage.getSaveButton().click();
    await page.waitForPostEditSuccess();
    
    const postPage = await page.getPostPage(post);
    const postTitle = changeWhitespaces(await postPage.getTitleText());
    const postBody = changeWhitespaces(await postPage.getBodyText());
    
    expect(postTitle).toBe(title);
    expect(postBody).toBe(body);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
