import { formatPageUrl } from './page-url.js';

/*
  acceptable options:
  firstPage
  lastPage
  urlTemplate
  tocUrl
*/

export class Toc {
  constructor(option) {
    this.firstPage = option.firstPage;
    this.lastPage = option.lastPage;
    this.totalPages = option.totalPages;
    this.urlTemplate = option.urlTemplate;
  }

  loadTocFromUrl() {
    //stab
  }

  getContentUrl(index) {
    const formatter = this.urlTemplate;
    return formatPageUrl(formatter, index);
  }

  getDisplayPageIndexes(index) {
    if (index == 0) {
      return { left: index };
    }
    if (index % 2 == 1) {
      return { left: index+1, right: index };
    }
    return { left: index, right: index-1 };
  }

  getLayoutType(index) {
    return 'double';
  }
  
}
