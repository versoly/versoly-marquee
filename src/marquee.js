export const Marquee = function (elem, options = {}) {
  let loop = options.loop ?? true,
    duration = options.duration || 5, // seconds
    direction = options.direction || "ltr", // 'ltr', 'rtl', 'ttb', 'btt'
    pauseable = options.pauseable ?? true,
    iterations = options.iterations ?? 1,
    milestone = 0,
    marqueeElem = null,
    elemSize = null,
    self = this,
    ltrCond = 0,
    loopCnt = 0,
    start = 0,
    elemOffsetSize = 0,
    paused = false,
    process = null;

  const isVertical = direction.includes("tt");
  const translate = isVertical ? "Y" : "X";
  const sizeName = isVertical ? "height" : "width";
  const capitalizedSizeName = isVertical ? "Height" : "Width";
  const offsetSizeName = "offset" + capitalizedSizeName;

  let distancePerIteration = 10 / (duration * 1000);

  const constructor = function (elem) {
    const elemHTML = elem.innerHTML;
    const elemNode = elem.childNodes[1] || elem;
    elemOffsetSize = elem[offsetSizeName];
    elemSize = elemNode[offsetSizeName];

    if (elemSize === 0) {
      return;
    }

    const elemCount = Math.ceil((elemOffsetSize + 1) / elemSize) + 3;

    marqueeElem = "<div>" + elemHTML + "</div>";
    elem.innerHTML = marqueeElem;
    marqueeElem = elem.getElementsByTagName("div")[0];

    elem.style.overflow = "clip";

    marqueeElem.style[sizeName] = elemSize * elemCount + "px";
    marqueeElem.style.whiteSpace = "nowrap";
    marqueeElem.style.position = "relative";
    marqueeElem.style.display = "flex";
    marqueeElem.style.flexDirection = isVertical ? "column" : "row";

    if (iterations) {
      for (let i = 0; i < elemCount - 1; i++) {
        marqueeElem.innerHTML += elemHTML;
        marqueeElem.children[i].style["min-" + sizeName] = elemSize + "px";
      }

      marqueeElem.style[sizeName] = elemCount * elemSize;

      if (direction === "ltr" || direction === "ttb") {
        start = -elemSize;
      }
    } else {
      ltrCond = elemOffsetSize;

      if (direction === "rtl" || direction === "btt") {
        milestone = ltrCond;
      }
    }

    if (direction === "ltr" || direction === "ttb") {
      milestone = -elemSize;
    } else if (direction === "rtl" || direction === "btt") {
      distancePerIteration = -distancePerIteration;
    }

    self.init();

    return marqueeElem;
  };

  this.init = function () {
    process = setInterval(self.play, 10);

    if (pauseable) {
      elem.addEventListener("mouseenter", () => (paused = true));
      elem.addEventListener("mouseleave", () => (paused = false));
    }
  };

  this.play = function () {
    if (paused) {
      return;
    }

    marqueeElem.style.transform = `translate${translate}(${start}px)`;
    start += distancePerIteration * elemSize;

    if (start > ltrCond || start < -elemSize) {
      start = milestone;
      loopCnt++;

      if (loop !== true && loopCnt >= iterations) {
        marqueeElem.style.transform = "";
      }
    }
  };

  this.end = function () {
    clearInterval(process);
  };

  constructor(elem);
};
