export default class extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });
    this.state = 250;
  }

  method () {
    return 150 + this.state;
  }

  template () {
    return `
      <style>
        @import url('pkg/src/inner/Component.css');
      </style>
      <div>${this.method()}</div>
    `;
  }

  connectedCallback () {
    this.shadowRoot.innerHTML = this.template();
  }
}
