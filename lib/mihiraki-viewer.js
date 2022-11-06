import { singlePageViewer, doublePageViewer } from './html.js';
import { Toc } from './toc.js';

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
.page {
  height: 100%;
  position: relative;
}
.page img { height: 100%; }

.pages.double {
  display: flex;
}

.flipper {
  background: gray;
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  opacity: 50%;
  cursor: pointer;
}

.flipper.left { left: 0; }
.flipper.right { right: 0; }
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

    this.singlePageViewer = singlePageViewer();
    this.doublePageViewer = doublePageViewer();
    viewerBody.appendChild(this.singlePageViewer);
    viewerBody.appendChild(this.doublePageViewer);
    this.doublePageViewer.addEventListener('flip-left', ev => {
      this.flipLeft();
    });

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

  _attrGetNumber(name, defaultValue) {
    if (this.hasAttribute(name)) {
      const v = Number(this.getAttribute(name));
      if (!isNaN(v)) {
        return v;
      }
    }
    return defaultValue;
  }

  get layout() {  return this._attrGet('layout', 'rtol'); }
  get src() {  return this._attrGet('src', ''); }
  get totalPages() {  return this._attrGet('total-pages', undefined); }
  get firstPage() { return this._attrGet('first-page', undefined); }
  get lastPage() { return this._attrGet('last-page', undefined); }
  get currentPage() {  return this._attrGetNumber('current-page', 1); }
  set currentPage(val) { this.setAttribute('current-page', val); }
  
  updateToc() {
    const tocData = {
      firstPage: this.firstPage,
      lastPage: this.lastPage,
      totalPages: this.totalPages,
      urlTemplate: this.src,
    };
    this.toc = new Toc(tocData);
    
  }
  
  showPage() {
    const singlePageMode = false;
    if (singlePageMode) {
      this.showSinglePage();
    } else {
      this.showDoublePage();
    }
  }

  flipLeft() {
    console.log('flip-left');
    this.currentPage = this.currentPage + 1;
    console.log(this.currentPage);
    this.showPage();
  }

  showSinglePage() {
    const url = this.toc.getContentUrl(this.currentPage);
    this.shadowRoot.getElementById('single-page').setAttribute('src', url);
    this.shadowRoot.getElementById('single-page-viewer').classList.remove('hidden');
    this.shadowRoot.getElementById('double-page-viewer').classList.add('hidden');
  }

  showDoublePage() {
    const index = (this.currentPage > 0) ? this.currentPage - 1 : 0;
    const indexes = this.toc.getDisplayPageIndexes(index);
    if (typeof indexes.left !== 'undefined') {
      const url = this.toc.getContentUrl(indexes.left);
      this.doublePageViewer.setContentUrl({left: url});
    } else {
      this.doublePageViewer.showContent({left: false});
    }

    if (typeof indexes.right !== 'undefined') {
      const url = this.toc.getContentUrl(indexes.right);
      this.doublePageViewer.setContentUrl({right: url});
    } else {
      this.doublePageViewer.showContent({right: false});
    }
    
    this.shadowRoot.getElementById('single-page-viewer').classList.add('hidden');
    this.shadowRoot.getElementById('double-page-viewer').classList.remove('hidden');
  }

  attributeChangedCallback(name, oldValue, newValue) {}
  connectedCallback() {
    this.updateToc();
    this.showPage();
  }

  disconnectedCallback() {}
  adoptedCallback() {}

}
