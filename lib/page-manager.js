import { formatPageUrl } from './page-url.js';

/*
  acceptable options:
  firstPage
  lastPage
  urlTemplate
  tocUrl
*/

export class PageManager {
  static RTL = 'rtl';
  static LTR = 'ltr';
  constructor(option = {}) {
    console.log(option);
    this.parseToc(option);
    console.log(this);
    this.ready = Promise.resolve();
  }

  loadTocFromUrl(url) {
    this.ready = fetch(url)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText, { cause: res });
        }
        return res.json();
      }).then(toc => {
        return this.parseToc(toc);
      });
  }

  parseToc(toc) {
    if (Number.isInteger(toc.firstPage)) {
      this.firstPage = toc.firstPage;
    } else {
      this.firstPage = 1;
    }
    if (Number.isInteger(toc.totalPages)) {
      this.lastPage = this.firstPage + toc.totalPages - 1;
    }

    if (Number.isInteger(toc.lastPage)) {
      this.lastPage = toc.lastPage;
    }

    if (Number.isInteger(toc.startIndex)) {
      this.startIndex = toc.startIndex;
    } else {
      this.startIndex = 0;
    }
    
    this.urlTemplate = toc.src;
    this.pagingDirection = PageManager.RTL;
  }

  pageNumberToIndex(pageNumber) {
    return pageNumber + this.startIndex - 1;
  }

  getContentUrl(page) {
    const i = this.pageNumberToIndex(page);
    const formatter = this.urlTemplate;
    return formatPageUrl(formatter, i);
  }

  getDisplayPageNumbers(page) {
    if (page == 1) {
      return { left: page };
    }
    if (page % 2 == 0) {
      return { left: page+1, right: page };
    }
    return { left: page, right: page-1 };
  }

  getLayoutType(page) {
    return 'double';
  }

  getLeftPageNumber(pageNumber) {
    // left page = next page when page direction is R to L
    const p = pageNumber % 2 == 0 ? pageNumber + 2 : pageNumber + 1;
    if (p > this.lastPage) {
      return this.lastPage;
    }
    return p;
  }

  getRightPageNumber(pageNumber) {
    // right page = previous page when page direction is R to L
    if (pageNumber == this.firstPage) {
      return pageNumber;
    }
    if (pageNumber % 2 == 0) {
      return pageNumber - 1;
    }
    return pageNumber - 2;
  }
}
