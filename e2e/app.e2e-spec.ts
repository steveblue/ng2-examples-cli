import { NgExamplesCliPage } from './app.po';

describe('ng-examples-cli App', function() {
  let page: NgExamplesCliPage;

  beforeEach(() => {
    page = new NgExamplesCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
