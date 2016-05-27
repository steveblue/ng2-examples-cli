import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { SynthAppComponent } from '../app/synth.component';

beforeEachProviders(() => [SynthAppComponent]);

describe('App: Synth', () => {
  it('should create the app',
      inject([SynthAppComponent], (app: SynthAppComponent) => {
    expect(app).toBeTruthy();
  }));
});
