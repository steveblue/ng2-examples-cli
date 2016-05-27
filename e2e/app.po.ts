export class SynthPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('synth-app h1')).getText();
  }
}
