

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


export function doublePageViewer(param) {
  // sub-functions
  function setContentUrl(option) {
    if (option.left) {
      leftPage.src = option.left;
    }
    if (option.right) {
      rightPage.src = option.right;
    }
  }

  function showContent(option) {
    if (typeof option.left !== 'undefined' && !option.left) {
      leftPage.src = '';
    }
    if (typeof option.right !== 'undefined' && !option.right) {
      rightPage.src = '';
    }
  }

  function dispatchCustomEvent(event, eventName) {
    const customEvent = new CustomEvent(eventName);
    wrap.dispatchEvent(customEvent);
  }

  const wrap = document.createElement('div');
  wrap.id = 'double-page-viewer';
  wrap.setAttribute('class', 'pages double hidden');

  // left page
  const leftPageDiv = document.createElement('div');
  leftPageDiv.setAttribute('class', 'page left');

  const leftFlipper = document.createElement('div');
  leftFlipper.setAttribute('class', 'flipper left');
  leftPageDiv.appendChild(leftFlipper);
  leftFlipper.addEventListener('click', ev => dispatchCustomEvent(ev, 'flip-left'));
  
  const leftPage = document.createElement('img');
  leftPage.id = 'left-page';
  leftPageDiv.appendChild(leftPage);

  // right page
  const rightPageDiv = document.createElement('div');
  rightPageDiv.setAttribute('class', 'page right');

  const rightFlipper = document.createElement('div');
  rightFlipper.setAttribute('class', 'flipper right');
  rightPageDiv.appendChild(rightFlipper);
  rightFlipper.addEventListener('click', ev => dispatchCustomEvent(ev, 'flip-right'));

  const rightPage = document.createElement('img');
  rightPage.id = 'right-page';
  rightPageDiv.appendChild(rightPage);

  wrap.appendChild(leftPageDiv);
  wrap.appendChild(rightPageDiv);
  wrap.setContentUrl = setContentUrl;
  wrap.showContent = showContent;

  return wrap;
}
