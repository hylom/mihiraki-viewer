var P = Object.defineProperty;
var b = (r, e, t) => e in r ? P(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var c = (r, e, t) => (b(r, typeof e != "symbol" ? e + "" : e, t), t);
function w() {
  const r = document.createElement("div");
  r.id = "single-page-viewer", r.setAttribute("class", "pages single hidden");
  const e = document.createElement("div");
  e.setAttribute("class", "page");
  const t = document.createElement("img");
  return t.id = "single-page", e.appendChild(t), r.appendChild(e), r;
}
function v(r) {
  function e(a) {
    a.left && (l.src = a.left), a.right && (h.src = a.right);
  }
  function t(a) {
    typeof a.left != "undefined" && !a.left && (l.src = ""), typeof a.right != "undefined" && !a.right && (h.src = "");
  }
  function i(a, f) {
    const m = new CustomEvent(f);
    s.dispatchEvent(m);
  }
  const s = document.createElement("div");
  s.id = "double-page-viewer", s.setAttribute("class", "pages double hidden");
  const n = document.createElement("div");
  n.setAttribute("class", "page left");
  const d = document.createElement("div");
  d.setAttribute("class", "flipper left"), n.appendChild(d), d.addEventListener("click", (a) => i(a, "flip-left"));
  const l = document.createElement("img");
  l.id = "left-page", n.appendChild(l);
  const o = document.createElement("div");
  o.setAttribute("class", "page right");
  const u = document.createElement("div");
  u.setAttribute("class", "flipper right"), o.appendChild(u), u.addEventListener("click", (a) => i(a, "flip-right"));
  const h = document.createElement("img");
  return h.id = "right-page", o.appendChild(h), s.appendChild(n), s.appendChild(o), s.setContentUrl = e, s.showContent = t, s;
}
function C(r, e) {
  const t = /\%(\d*)d/, i = t.exec(r);
  if (!i)
    return r;
  let s = e;
  if (i[1] && i[1].startsWith("0")) {
    const n = Number(i[1]);
    s = E(n, "0", e);
  }
  return r.replace(t, s);
}
function E(r, e, t) {
  const i = `${t}`, s = r - i.len;
  return s > 0 ? `${e.repeat(s)}${i}` : i;
}
const p = class {
  constructor(e = {}) {
    console.log(e), this.parseToc(e), console.log(this), this.ready = Promise.resolve();
  }
  loadTocFromUrl(e) {
    this.ready = fetch(e).then((t) => {
      if (!t.ok)
        throw Error(t.statusText, { cause: t });
      return t.json();
    }).then((t) => this.parseToc(t));
  }
  parseToc(e) {
    Number.isInteger(e.firstPage) ? this.firstPage = e.firstPage : this.firstPage = 1, Number.isInteger(e.totalPages) && (this.lastPage = this.firstPage + e.totalPages - 1), Number.isInteger(e.lastPage) && (this.lastPage = e.lastPage), Number.isInteger(e.startIndex) ? this.startIndex = e.startIndex : this.startIndex = 0, this.urlTemplate = e.src, this.pagingDirection = p.RTL;
  }
  pageNumberToIndex(e) {
    return e + this.startIndex - 1;
  }
  getContentUrl(e) {
    const t = this.pageNumberToIndex(e), i = this.urlTemplate;
    return C(i, t);
  }
  getDisplayPageNumbers(e) {
    return e == 1 ? { left: e } : e % 2 == 0 ? { left: e + 1, right: e } : { left: e, right: e - 1 };
  }
  getLayoutType(e) {
    return "double";
  }
  getLeftPageNumber(e) {
    const t = e % 2 == 0 ? e + 2 : e + 1;
    return t > this.lastPage ? this.lastPage : t;
  }
  getRightPageNumber(e) {
    return e == this.firstPage ? e : e % 2 == 0 ? e - 1 : e - 2;
  }
};
let g = p;
c(g, "RTL", "rtl"), c(g, "LTR", "ltr");
const x = `
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
class y extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
    const e = document.createElement("style");
    e.textContent = x;
    const t = document.createElement("div");
    t.setAttribute("class", "viewer-root"), this.singlePageViewer = w(), this.doublePageViewer = v(), t.appendChild(this.singlePageViewer), t.appendChild(this.doublePageViewer), this.doublePageViewer.addEventListener("flip-left", (i) => {
      this.flipLeft();
    }), this.doublePageViewer.addEventListener("flip-right", (i) => {
      this.flipRight();
    }), this.shadowRoot.append(e), this.shadowRoot.append(t);
  }
  _getAttr(e, t) {
    return this.hasAttribute(e) ? this.getAttribute(e) : t;
  }
  _getNumberAttr(e, t) {
    if (this.hasAttribute(e)) {
      const i = Number(this.getAttribute(e));
      if (!isNaN(i))
        return i;
    }
    return t;
  }
  static get observedAttributes() {
    return ["layout", "src", "first-page", "last-page", "current-page", "toc"];
  }
  get layout() {
    return this._getAttr("layout", "rtol");
  }
  get src() {
    return this._getAttr("src", "");
  }
  get totalPages() {
    return this._getNumberAttr("total-pages", void 0);
  }
  get firstPage() {
    return this._getNumberAttr("first-page", void 0);
  }
  get startIndex() {
    return this._getNumberAttr("start-index", 0);
  }
  get lastPage() {
    return this._getNumberAttr("last-page", void 0);
  }
  get currentPage() {
    return this._getNumberAttr("current-page", 1);
  }
  set currentPage(e) {
    this.setAttribute("current-page", e);
  }
  get toc() {
    return this._getAttr("toc", void 0);
  }
  updatePageManager() {
    if (this.toc)
      this.pageManager = new g(), this.pageManager.loadTocFromUrl(this.toc);
    else {
      const e = {
        firstPage: this.firstPage,
        lastPage: this.lastPage,
        totalPages: this.totalPages,
        src: this.src
      };
      this.pageManager = new g(e);
    }
  }
  showPage() {
    console.log(`showPage: ${this.currentPage}`), this.pageManager.ready.then(() => {
      this.showDoublePage();
    });
  }
  flipLeft() {
    console.log("flip-left"), this.currentPage = this.pageManager.getLeftPageNumber(this.currentPage), this.showPage();
  }
  flipRight() {
    console.log("flip-right"), this.currentPage = this.pageManager.getRightPageNumber(this.currentPage), this.showPage();
  }
  showSinglePage() {
    const e = this.pageManager.getContentUrl(this.currentPage);
    this.shadowRoot.getElementById("single-page").setAttribute("src", e), this.shadowRoot.getElementById("single-page-viewer").classList.remove("hidden"), this.shadowRoot.getElementById("double-page-viewer").classList.add("hidden");
  }
  showDoublePage() {
    const e = this.pageManager.getDisplayPageNumbers(this.currentPage);
    if (typeof e.left != "undefined") {
      const t = this.pageManager.getContentUrl(e.left);
      this.doublePageViewer.setContentUrl({ left: t });
    } else
      this.doublePageViewer.showContent({ left: !1 });
    if (typeof e.right != "undefined") {
      const t = this.pageManager.getContentUrl(e.right);
      this.doublePageViewer.setContentUrl({ right: t });
    } else
      this.doublePageViewer.showContent({ right: !1 });
    this.shadowRoot.getElementById("single-page-viewer").classList.add("hidden"), this.shadowRoot.getElementById("double-page-viewer").classList.remove("hidden");
  }
  attributeChangedCallback(e, t, i) {
  }
  connectedCallback() {
    this.updatePageManager(), this.showPage();
  }
  disconnectedCallback() {
  }
  adoptedCallback() {
  }
}
function A() {
  customElements.define("mihiraki-viewer", y);
}
A();
