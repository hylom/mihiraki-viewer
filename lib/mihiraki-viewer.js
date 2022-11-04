import { singlePageViewer, doublePageViewer } from './html.js';
import { formatPageUrl } from './page-url.js';

const css = `
* { margin: 0; padding: 0; }
.viewer-root {
  height: 100vh;
  background: white;
  padding: 4px;
  box-sizing: border-box;
}
.hidden { display: none; }
.pages {
  height: 100%;
  padding: 0;
  margin: 0 auto;
  width: max-content;
}
.page { height: 100%;}
.page img { height: 100%; }

.pages.double {
  display: flex;
}
`;

export class MihirakiViewer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = css;
    
    const viewerBody = document.createElement('div');
    viewerBody.setAttribute('class', 'viewer-root');
    //viewerBody.textContent = 'VIEWER';

    viewerBody.appendChild(singlePageViewer());
    viewerBody.appendChild(doublePageViewer());

    this.shadowRoot.append(style);
    this.shadowRoot.append(viewerBody);
  }

  // attributes
  static get observedAttributes() {
    return ['layout', 'src', 'first-page', 'last-page', 'current-page',];
  }

  _attrGet(name, defaultValue) {
    if (this.hasAttribute(name)) {
      return this.getAttribute(name);
    }
    return defaultValue;
  }

  get layout() {  return this._attrGet('layout', 'rtol'); }
  get src() {  return this._attrGet('src', ''); }
  get firstPage() { return this._attrGet('first-page', 0); }
  get lastPage() { return this._attrGet('last-page', 0); }
  get currentPage() {  return this._attrGet('current-page', 0); }
  set currentPage(val) { this.setAttribute('current-page', val); }
  
  showPage() {
    const singlePageMode = false;

    if (singlePageMode) {
      this.showSinglePage();
    } else {
      this.showDoublePage();
    }
  }

  showSinglePage() {
    const url = this._getImageUrlByPage(this.currentPage);
    this.shadowRoot.getElementById('single-page').setAttribute('src', url);
    this.shadowRoot.getElementById('single-page-viewer').classList.remove('hidden');
    this.shadowRoot.getElementById('double-page-viewer').classList.add('hidden');
  }

  showDoublePage() {
    const leftPage = this._getLeftPage();
    const rightPage = this._getRightPage();
    const leftPageUrl = this._getImageUrlByPage(this._getLeftPage);
    const rightPageUrl = this._getImageUrlByPage(this._getRightPage);
    
    this.shadowRoot.getElementById('left-page').setAttribute('src', leftPageUrl);
    this.shadowRoot.getElementById('right-page').setAttribute('src', rightPageUrl);
    this.shadowRoot.getElementById('single-page-viewer').classList.add('hidden');
    this.shadowRoot.getElementById('double-page-viewer').classList.remove('hidden');
  }

  _getLeftPage() {
    return 2;
  }

  _getRightPage() {
    return 1;
  }

  attributeChangedCallback(name, oldValue, newValue) {}
  connectedCallback() {
    this.showPage();
  }

  disconnectedCallback() {}
  adoptedCallback() {}

  _getImageUrlByPage(page) {
    const formatter = this.src;
    return formatPageUrl(formatter, page);
  }
}
