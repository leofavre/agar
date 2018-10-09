import Component from './Component.js';
window.customElements.define('custom-element', Component);

describe('Component', () => {
  describe('#method', () => {
    it('Should return 400.', () => {
      const comp = document.createElement('custom-element');
      expect(comp.method()).to.equal(400);
    });
  });
});
