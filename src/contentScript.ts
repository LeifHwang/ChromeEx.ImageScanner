(function () {
  const containerId = 'ext_image_scanner_images_viewer';

  const exist = document.getElementById(containerId);
  if (exist) {
    console.log('Image_scanner has already been opened!');
    return;
  }

  const validImgDoms: HTMLElement[] = [];
  for (const img of document.getElementsByTagName('img')) {
    if (img.src) {
      validImgDoms.push(img);
    }
  }

  if (!validImgDoms.length) {
    console.log('Image_scanner got none images on the current page');
    return;
  }

  // render sub doms
  const imgCloner = document.createElement('div');
  imgCloner.classList.add('view-img');
  imgCloner.appendChild(validImgDoms[0].cloneNode());

  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close-button');

  const preBtn = document.createElement('span');
  preBtn.classList.add('view-button', 'previous', 'first');

  const nextBtn = document.createElement('span');
  nextBtn.classList.add('view-button', 'next');
  nextBtn.classList.toggle('last', validImgDoms.length === 1);

  const pageIndex = document.createElement('span');
  pageIndex.innerText = '1';
  const pageCount = document.createElement('b');
  pageCount.innerText = validImgDoms.length.toString();

  const pageInfo = document.createElement('div');
  pageInfo.classList.add('page');
  pageInfo.append(pageIndex, '/', pageCount);

  // append container
  const container = document.createElement('div');
  container.id = containerId;
  container.classList.add('all-pic-viewer-container');
  container.append(closeBtn, imgCloner, preBtn, nextBtn, pageInfo);

  document.body.appendChild(container);

  // event handlers
  closeBtn.onclick = () => document.body.removeChild(container);

  let imgIdx = 0;
  let scale = 1;

  preBtn.onclick = () => {
    if (imgIdx === 0) return;

    imgCloner.replaceChildren(validImgDoms[--imgIdx].cloneNode());

    pageIndex.innerText = (imgIdx + 1).toString();

    preBtn.classList.toggle('first', imgIdx === 0);
    nextBtn.classList.toggle('last', imgIdx === validImgDoms.length - 1);

    scale = 1;
  };
  nextBtn.onclick = () => {
    if (imgIdx === validImgDoms.length - 1) return;

    imgCloner.replaceChildren(validImgDoms[++imgIdx].cloneNode());

    pageIndex.innerText = (imgIdx + 1).toString();

    preBtn.classList.toggle('first', imgIdx === 0);
    nextBtn.classList.toggle('last', imgIdx === validImgDoms.length - 1);

    scale = 1;
  };

  imgCloner.addEventListener('click', () => nextBtn.click());

  // hot key
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft') {
      preBtn.click();
    }
    if (ev.code === 'ArrowRight') {
      nextBtn.click();
    }
  });

  // zoom image by wheel
  function zoom(ev: WheelEvent) {
    ev.preventDefault();

    if (ev.deltaY < 0) {
      if (scale <= 0.3) return;

      scale -= 0.05;
    } else {
      if (scale >= 3) return;

      scale += 0.05;
    }

    const el = ev.target as HTMLElement;
    el.style.transform = `scale(${scale})`;
  }

  new MutationObserver((m) => {
    const el = m[0].addedNodes[0] as HTMLElement;
    el.addEventListener('wheel', zoom);

    m.forEach(({ addedNodes, removedNodes }) => {
      addedNodes.forEach((n) => (n as HTMLElement).addEventListener('wheel', zoom));
      removedNodes.forEach((n) => (n as HTMLElement).removeEventListener('wheel', zoom));
    });
  }).observe(imgCloner, { childList: true });
})();
