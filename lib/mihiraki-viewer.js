import { singlePageViewer, doublePageViewer } from './html.js';
import { PageManager } from './page-manager.js';

const css = `
* { margin: 0; padding: 0; }
.hidden { display: none; }

.viewer-root {
  max-height: 100vh;
  background: white;
  box-sizing: border-box;
}

.pages {
  max-height: 100%;
  padding: 0;
  margin: 0 auto;
}
.pages.double {
  display: flex;
}

.page {
  flex: 1 1;
  max-height: 100vh;
  position: relative;
}
.page.left { text-align: right; }
.page.right { text-align: left; }
.page img {
  max-height: 100%;
  max-width: 100%;
}

.flipper {
  background: white;
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  opacity: 0;
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
    this.doublePageViewer.addEventListener('flip-right', ev => {
      this.flipRight();
    });

    this.shadowRoot.append(style);
    this.shadowRoot.append(viewerBody);
  }

  // attributes
  _getAttr(name, defaultValue) {
    if (this.hasAttribute(name)) {
      return this.getAttribute(name);
    }
    return defaultValue;
  }

  _getNumberAttr(name, defaultValue) {
    if (this.hasAttribute(name)) {
      const v = Number(this.getAttribute(name));
      if (!isNaN(v)) {
        return v;
      }
    }
    return defaultValue;
  }

  static get observedAttributes() {
    return ['layout', 'src', 'first-page', 'last-page', 'current-page', 'toc',];
  }

  get layout() {  return this._getAttr('layout', 'rtol'); }
  get src() {  return this._getAttr('src', ''); }
  get totalPages() {  return this._getNumberAttr('total-pages', undefined); }
  get firstPage() { return this._getNumberAttr('first-page', undefined); }
  get startIndex() { return this._getNumberAttr('start-index', 0); }
  get lastPage() { return this._getNumberAttr('last-page', undefined); }
  get currentPage() {  return this._getNumberAttr('current-page', 1); }
  set currentPage(val) { this.setAttribute('current-page', val); }
  get toc() { return this._getAttr('toc', undefined); }

  updatePageManager() {
    if (this.toc) {
      this.pageManager = new PageManager();
      this.pageManager.loadTocFromUrl(this.toc);
    } else {
      const tocData = {
        firstPage: this.firstPage,
        lastPage: this.lastPage,
        totalPages: this.totalPages,
        src: this.src,
      };
      this.pageManager = new PageManager(tocData);
    }
  }
  
  showPage() {
    const singlePageMode = false;
    console.log(`showPage: ${this.currentPage}`);
    this.pageManager.ready.then(() => {
      if (singlePageMode) {
        this.showSinglePage();
      } else {
        this.showDoublePage();
      }
    });
  }
                               

  flipLeft() {
    // nextSpread
    console.log(`flip-left`);
    this.currentPage = this.pageManager.getLeftPageNumber(this.currentPage);
    this.showPage();
  }

  flipRight() {
    console.log('flip-right');
    this.currentPage = this.pageManager.getRightPageNumber(this.currentPage);
    this.showPage();
  }

  showSinglePage() {
    const url = this.pageManager.getContentUrl(this.currentPage);
    this.shadowRoot.getElementById('single-page').setAttribute('src', url);
    this.shadowRoot.getElementById('single-page-viewer').classList.remove('hidden');
    this.shadowRoot.getElementById('double-page-viewer').classList.add('hidden');
  }

  showDoublePage() {
    const pages = this.pageManager.getDisplayPageNumbers(this.currentPage);
    if (typeof pages.left !== 'undefined') {
      const url = this.pageManager.getContentUrl(pages.left);
      this.doublePageViewer.setContentUrl({left: url});
    } else {
      this.doublePageViewer.showContent({left: false});
    }

    if (typeof pages.right !== 'undefined') {
      const url = this.pageManager.getContentUrl(pages.right);
      this.doublePageViewer.setContentUrl({right: url});
    } else {
      this.doublePageViewer.showContent({right: false});
    }
    
    this.shadowRoot.getElementById('single-page-viewer').classList.add('hidden');
    this.shadowRoot.getElementById('double-page-viewer').classList.remove('hidden');
  }

  attributeChangedCallback(name, oldValue, newValue) {}
  connectedCallback() {
    this.updatePageManager();
    this.showPage();
  }

  disconnectedCallback() {}
  adoptedCallback() {}

}
