import { GalleryAppPage } from './app.po';

describe('gallery-app App', () => {
  let page: GalleryAppPage;

  beforeEach(() => {
    page = new GalleryAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
