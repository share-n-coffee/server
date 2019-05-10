const config = require('../server/config/config');

describe('Initial tests', () => {
  it('config test', () => {
    expect(config).toBeTruthy();
  });
});
