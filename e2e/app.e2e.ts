import { SynthPage } from './app.po';

describe('synth App', function() {
  let page: SynthPage;

  beforeEach(() => {
    page = new SynthPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('synth works!');
  });
});
