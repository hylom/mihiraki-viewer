export function singlePageViewer() {
  const wrap = document.createElement('div');
  wrap.id = 'single-page-viewer';
  wrap.setAttribute('class', 'pages single hidden');

  const pageDiv = document.createElement('div');
  pageDiv.setAttribute('class', 'page');
  const page = document.createElement('img');
  page.id = 'single-page';
  pageDiv.appendChild(page);
  wrap.appendChild(pageDiv);
  return wrap;
}

export function doublePageViewer() {
  const wrap = document.createElement('div');
  wrap.id = 'double-page-viewer';
  wrap.setAttribute('class', 'pages double hidden');

  // left page
  const leftPageDiv = document.createElement('div');
  leftPageDiv.setAttribute('class', 'page');
  const leftPage = document.createElement('img');
  leftPage.id = 'left-page';
  leftPageDiv.appendChild(leftPage);

  // right page
  const rightPageDiv = document.createElement('div');
  rightPageDiv.setAttribute('class', 'page');
  const rightPage = document.createElement('img');
  rightPage.id = 'right-page';
  rightPageDiv.appendChild(rightPage);

  wrap.appendChild(leftPageDiv);
  wrap.appendChild(rightPageDiv);
  return wrap;
}
