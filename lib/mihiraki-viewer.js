export class MihirakiViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const viewerBody = document.createElement('div');
    viewerBody.textContent = 'VIEWER';

    this.shadowRoot.append(viewerBody);
  }
}
