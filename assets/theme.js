var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj)) throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// js/common/actions/confirm-button.js
var ConfirmButton = class extends HTMLButtonElement {
  constructor() {
    super();
    this.addEventListener("click", (event) => {
      if (
        !window.confirm(
          this.getAttribute("data-message") ??
            "Once confirmed, this action cannot be undone."
        )
      ) {
        event.preventDefault();
      }
    });
  }
};
if (!window.customElements.get("confirm-button")) {
  window.customElements.define("confirm-button", ConfirmButton, {
    extends: "button",
  });
}

// js/common/actions/copy-button.js
var _copyToClipboard, copyToClipboard_fn;
var CopyButton = class extends HTMLButtonElement {
  constructor() {
    super();
    __privateAdd(this, _copyToClipboard);
    this.addEventListener(
      "click",
      __privateMethod(this, _copyToClipboard, copyToClipboard_fn)
    );
  }
};
_copyToClipboard = new WeakSet();
copyToClipboard_fn = async function () {
  if (!navigator.clipboard) {
    return;
  }
  await navigator.clipboard.writeText(this.getAttribute("data-text") ?? "");
  if (this.hasAttribute("data-success-message")) {
    const originalMessage = this.textContent;
    this.textContent = this.getAttribute("data-success-message");
    setTimeout(() => {
      this.textContent = originalMessage;
    }, 1500);
  }
};
if (!window.customElements.get("copy-button")) {
  window.customElements.define("copy-button", CopyButton, {
    extends: "button",
  });
}

// js/common/actions/share-button.js
var _showSystemShare, showSystemShare_fn;
var ShareButton = class extends HTMLButtonElement {
  constructor() {
    super();
    __privateAdd(this, _showSystemShare);
    if (navigator.share) {
      this.hidden = false;
      this.addEventListener(
        "click",
        __privateMethod(this, _showSystemShare, showSystemShare_fn)
      );
    }
  }
};
_showSystemShare = new WeakSet();
showSystemShare_fn = function () {
  navigator.share({
    title: this.hasAttribute("share-title")
      ? this.getAttribute("share-title")
      : document.title,
    url: this.hasAttribute("share-url")
      ? this.getAttribute("share-url")
      : window.location.href,
  });
};
if (!window.customElements.get("share-button")) {
  window.customElements.define("share-button", ShareButton, {
    extends: "button",
  });
}

// js/common/animation/marquee-text.js
import { inView, animate } from "vendor";
var _direction,
  direction_get,
  _scroller,
  scroller_get,
  _initialize,
  initialize_fn;
var MarqueeText = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _direction);
    __privateAdd(this, _scroller);
    __privateAdd(this, _initialize);
    inView(this, __privateMethod(this, _initialize, initialize_fn).bind(this), {
      margin: "400px",
    });
  }
};
_direction = new WeakSet();
direction_get = function () {
  return this.getAttribute("direction") === "right" ? 1 : -1;
};
_scroller = new WeakSet();
scroller_get = function () {
  return this.shadowRoot.querySelector('[part="scroller"]');
};
_initialize = new WeakSet();
initialize_fn = function () {
  this.attachShadow({ mode: "open" }).appendChild(
    document.createRange().createContextualFragment(`
      <slot part="scroller"></slot>
    `)
  );
  const fragment = document.createDocumentFragment();
  for (let i = 1; i <= 5; ++i) {
    const node = this.firstElementChild.cloneNode(true);
    node.setAttribute("aria-hidden", "true");
    node.style.cssText = `position: absolute; inset-inline-start: ${
      100 * i * -__privateGet(this, _direction, direction_get)
    }%;`;
    fragment.appendChild(node);
  }
  this.append(fragment);
  animate(
    __privateGet(this, _scroller, scroller_get),
    {
      transform: [
        "translateX(0)",
        `translateX(calc(var(--transform-logical-flip) * ${
          __privateGet(this, _direction, direction_get) * 100
        }%))`,
      ],
    },
    {
      duration:
        (1 / parseFloat(this.getAttribute("speed"))) *
        (__privateGet(this, _scroller, scroller_get).clientWidth / 300),
      easing: "linear",
      repeat: Infinity,
    }
  );
};
if (!window.customElements.get("marquee-text")) {
  window.customElements.define("marquee-text", MarqueeText);
}

// js/common/behavior/gesture-area.js
var _domElement,
  _thresholdDistance,
  _thresholdTime,
  _signal,
  _firstClientX,
  _tracking,
  _start,
  _touchStart,
  touchStart_fn,
  _preventTouch,
  preventTouch_fn,
  _gestureStart,
  gestureStart_fn,
  _gestureMove,
  gestureMove_fn,
  _gestureEnd,
  gestureEnd_fn;
var GestureArea = class {
  constructor(
    domElement,
    { thresholdDistance = 80, thresholdTime = 500, signal = null } = {}
  ) {
    __privateAdd(this, _touchStart);
    __privateAdd(this, _preventTouch);
    __privateAdd(this, _gestureStart);
    __privateAdd(this, _gestureMove);
    __privateAdd(this, _gestureEnd);
    __privateAdd(this, _domElement, void 0);
    __privateAdd(this, _thresholdDistance, void 0);
    __privateAdd(this, _thresholdTime, void 0);
    __privateAdd(this, _signal, void 0);
    __privateAdd(this, _firstClientX, void 0);
    __privateAdd(this, _tracking, false);
    __privateAdd(this, _start, {});
    __privateSet(this, _domElement, domElement);
    __privateSet(this, _thresholdDistance, thresholdDistance);
    __privateSet(this, _thresholdTime, thresholdTime);
    __privateSet(this, _signal, signal ?? new AbortController().signal);
    __privateGet(this, _domElement).addEventListener(
      "touchstart",
      __privateMethod(this, _touchStart, touchStart_fn).bind(this),
      { passive: true, signal: __privateGet(this, _signal) }
    );
    __privateGet(this, _domElement).addEventListener(
      "touchmove",
      __privateMethod(this, _preventTouch, preventTouch_fn).bind(this),
      { passive: false, signal: __privateGet(this, _signal) }
    );
    __privateGet(this, _domElement).addEventListener(
      "pointerdown",
      __privateMethod(this, _gestureStart, gestureStart_fn).bind(this),
      { signal: __privateGet(this, _signal) }
    );
    __privateGet(this, _domElement).addEventListener(
      "pointermove",
      __privateMethod(this, _gestureMove, gestureMove_fn).bind(this),
      { passive: false, signal: __privateGet(this, _signal) }
    );
    __privateGet(this, _domElement).addEventListener(
      "pointerup",
      __privateMethod(this, _gestureEnd, gestureEnd_fn).bind(this),
      { signal: __privateGet(this, _signal) }
    );
    __privateGet(this, _domElement).addEventListener(
      "pointerleave",
      __privateMethod(this, _gestureEnd, gestureEnd_fn).bind(this),
      { signal: __privateGet(this, _signal) }
    );
    __privateGet(this, _domElement).addEventListener(
      "pointercancel",
      __privateMethod(this, _gestureEnd, gestureEnd_fn).bind(this),
      { signal: __privateGet(this, _signal) }
    );
  }
};
_domElement = new WeakMap();
_thresholdDistance = new WeakMap();
_thresholdTime = new WeakMap();
_signal = new WeakMap();
_firstClientX = new WeakMap();
_tracking = new WeakMap();
_start = new WeakMap();
_touchStart = new WeakSet();
touchStart_fn = function (event) {
  __privateSet(this, _firstClientX, event.touches[0].clientX);
};
_preventTouch = new WeakSet();
preventTouch_fn = function (event) {
  if (
    Math.abs(event.touches[0].clientX - __privateGet(this, _firstClientX)) > 10
  ) {
    event.preventDefault();
  }
};
_gestureStart = new WeakSet();
gestureStart_fn = function (event) {
  __privateSet(this, _tracking, true);
  __privateSet(this, _start, {
    time: /* @__PURE__ */ new Date().getTime(),
    x: event.clientX,
    y: event.clientY,
  });
};
_gestureMove = new WeakSet();
gestureMove_fn = function (event) {
  if (__privateGet(this, _tracking)) {
    event.preventDefault();
  }
};
_gestureEnd = new WeakSet();
gestureEnd_fn = function (event) {
  if (!__privateGet(this, _tracking)) {
    return;
  }
  __privateSet(this, _tracking, false);
  const now = /* @__PURE__ */ new Date().getTime(),
    deltaTime = now - __privateGet(this, _start).time,
    deltaX = event.clientX - __privateGet(this, _start).x,
    deltaY = event.clientY - __privateGet(this, _start).y;
  if (deltaTime > __privateGet(this, _thresholdTime)) {
    return;
  }
  let matchedEvent;
  if (deltaX === 0 && deltaY === 0) {
    matchedEvent = "tap";
  } else if (
    deltaX > __privateGet(this, _thresholdDistance) &&
    Math.abs(deltaY) < __privateGet(this, _thresholdDistance)
  ) {
    matchedEvent = "swiperight";
  } else if (
    -deltaX > __privateGet(this, _thresholdDistance) &&
    Math.abs(deltaY) < __privateGet(this, _thresholdDistance)
  ) {
    matchedEvent = "swipeleft";
  } else if (
    deltaY > __privateGet(this, _thresholdDistance) &&
    Math.abs(deltaX) < __privateGet(this, _thresholdDistance)
  ) {
    matchedEvent = "swipedown";
  } else if (
    -deltaY > __privateGet(this, _thresholdDistance) &&
    Math.abs(deltaX) < __privateGet(this, _thresholdDistance)
  ) {
    matchedEvent = "swipeup";
  }
  if (matchedEvent) {
    __privateGet(this, _domElement).dispatchEvent(
      new CustomEvent(matchedEvent, {
        bubbles: true,
        composed: true,
        detail: { originalEvent: event },
      })
    );
  }
};

// js/common/utilities/country-selector.js
var _onCountryChangedListener, _onCountryChanged, onCountryChanged_fn;
var CountrySelector = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onCountryChanged);
    __privateAdd(
      this,
      _onCountryChangedListener,
      __privateMethod(this, _onCountryChanged, onCountryChanged_fn).bind(this)
    );
  }
  connectedCallback() {
    this.countryElement = this.querySelector('[name="address[country]"]');
    this.provinceElement = this.querySelector('[name="address[province]"]');
    this.countryElement.addEventListener(
      "change",
      __privateGet(this, _onCountryChangedListener)
    );
    if (this.hasAttribute("country") && this.getAttribute("country") !== "") {
      this.countryElement.selectedIndex = Math.max(
        0,
        Array.from(this.countryElement.options).findIndex(
          (option) => option.textContent === this.getAttribute("country")
        )
      );
    }
    this.countryElement.dispatchEvent(new Event("change"));
  }
  disconnectedCallback() {
    this.countryElement.removeEventListener(
      "change",
      __privateGet(this, _onCountryChangedListener)
    );
  }
};
_onCountryChangedListener = new WeakMap();
_onCountryChanged = new WeakSet();
onCountryChanged_fn = function () {
  const option = this.countryElement.options[this.countryElement.selectedIndex],
    provinces = JSON.parse(option.getAttribute("data-provinces"));
  this.provinceElement.parentElement.hidden = provinces.length === 0;
  if (provinces.length === 0) {
    return;
  }
  this.provinceElement.innerHTML = "";
  provinces.forEach((data) => {
    const selected =
      data[1] === this.getAttribute("province") ||
      data[0] === this.getAttribute("province");
    this.provinceElement.options.add(
      new Option(data[1], data[0], selected, selected)
    );
  });
};
if (!window.customElements.get("country-selector")) {
  window.customElements.define("country-selector", CountrySelector);
}

// js/common/utilities/format-money.js
function formatMoney(cents, format = "") {
  if (typeof cents === "string") {
    cents = cents.replace(".", "");
  }
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
    formatString = format || window.themeVariables.settings.moneyFormat;
  function defaultTo(value2, defaultValue) {
    return value2 == null || value2 !== value2 ? defaultValue : value2;
  }
  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultTo(precision, 2);
    thousands = defaultTo(thousands, ",");
    decimal = defaultTo(decimal, ".");
    if (isNaN(number) || number == null) {
      return 0;
    }
    number = (number / 100).toFixed(precision);
    let parts = number.split("."),
      dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        "$1" + thousands
      ),
      centsAmount = parts[1] ? decimal + parts[1] : "";
    return dollarsAmount + centsAmount;
  }
  let value = "";
  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_space_separator":
      value = formatWithDelimiters(cents, 2, " ", ".");
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_with_apostrophe_separator":
      value = formatWithDelimiters(cents, 2, "'", ".");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
    case "amount_no_decimals_with_space_separator":
      value = formatWithDelimiters(cents, 0, " ");
      break;
    case "amount_no_decimals_with_apostrophe_separator":
      value = formatWithDelimiters(cents, 0, "'");
      break;
    default:
      value = formatWithDelimiters(cents, 2);
      break;
  }
  if (formatString.indexOf("with_comma_separator") !== -1) {
    return formatString.replace(placeholderRegex, value);
  } else {
    return formatString.replace(placeholderRegex, value);
  }
}

// js/common/utilities/cached-fetch.js
var cachedMap = /* @__PURE__ */ new Map();
function cachedFetch(url, options) {
  const cacheKey = url;
  if (cachedMap.has(cacheKey)) {
    return Promise.resolve(new Response(new Blob([cachedMap.get(cacheKey)])));
  }
  return fetch(url, options).then((response) => {
    if (response.status === 200) {
      const contentType = response.headers.get("Content-Type");
      if (
        contentType &&
        (contentType.match(/application\/json/i) ||
          contentType.match(/text\//i))
      ) {
        response
          .clone()
          .text()
          .then((content) => {
            cachedMap.set(cacheKey, content);
          });
      }
    }
    return response;
  });
}

// js/common/utilities/extract-section-id.js
function extractSectionId(element) {
  element = element.classList.contains("shopify-section")
    ? element
    : element.closest(".shopify-section");
  return element.id.replace("shopify-section-", "");
}

// js/common/utilities/dom.js
function throttle(callback) {
  let requestId = null,
    lastArgs;
  const later = (context) => () => {
    requestId = null;
    callback.apply(context, lastArgs);
  };
  const throttled = (...args) => {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };
  throttled.cancel = () => {
    cancelAnimationFrame(requestId);
    requestId = null;
  };
  return throttled;
}
function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
function waitForEvent(element, eventName) {
  return new Promise((resolve) => {
    const done = (event) => {
      if (event.target === element) {
        element.removeEventListener(eventName, done);
        resolve(event);
      }
    };
    element.addEventListener(eventName, done);
  });
}

// js/common/utilities/media.js
function videoLoaded(videoOrArray) {
  if (!videoOrArray) {
    return Promise.resolve();
  }
  videoOrArray =
    videoOrArray instanceof Element ? [videoOrArray] : Array.from(videoOrArray);
  return Promise.all(
    videoOrArray.map((video) => {
      return new Promise((resolve) => {
        if (
          (video.tagName === "VIDEO" &&
            video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) ||
          !video.offsetParent ||
          video.parentNode.hasAttribute("suspended")
        ) {
          resolve();
        } else {
          video.oncanplay = () => resolve();
        }
      });
    })
  );
}
function imageLoaded(imageOrArray) {
  if (!imageOrArray) {
    return Promise.resolve();
  }
  imageOrArray =
    imageOrArray instanceof Element ? [imageOrArray] : Array.from(imageOrArray);
  return Promise.all(
    imageOrArray.map((image) => {
      return new Promise((resolve) => {
        if (
          (image.tagName === "IMG" && image.complete) ||
          !image.offsetParent
        ) {
          resolve();
        } else {
          image.onload = () => resolve();
        }
      });
    })
  );
}
function generateSrcset(imageObjectOrString, widths = []) {
  let imageUrl, maxWidth;
  if (typeof imageObjectOrString === "string") {
    imageUrl = new URL(
      imageObjectOrString.startsWith("//")
        ? `https:${imageObjectOrString}`
        : imageObjectOrString
    );
    maxWidth = parseInt(imageUrl.searchParams.get("width"));
  } else {
    imageUrl = new URL(imageObjectOrString["src"]);
    maxWidth = imageObjectOrString["width"];
  }
  return widths
    .filter((width) => width <= maxWidth)
    .map((width) => {
      imageUrl.searchParams.set("width", width.toString());
      return `${imageUrl.href} ${width}w`;
    })
    .join(", ");
}
function createMediaImg(media, widths = [], attributes = {}) {
  const image = new Image(
      media["preview_image"]["width"],
      media["preview_image"]["height"]
    ),
    featuredMediaUrl = new URL(media["preview_image"]["src"]);
  for (const attributeKey in attributes) {
    image.setAttribute(attributeKey, attributes[attributeKey]);
  }
  image.alt = media["alt"] || "";
  image.src = featuredMediaUrl.href;
  image.srcset = generateSrcset(media["preview_image"], widths);
  return image;
}

// js/common/utilities/media-query.js
function matchesMediaQuery(breakpointName) {
  if (!window.themeVariables.mediaQueries.hasOwnProperty(breakpointName)) {
    throw `Media query ${breakpointName} does not exist`;
  }
  return window.matchMedia(window.themeVariables.mediaQueries[breakpointName])
    .matches;
}
function mediaQueryListener(breakpointName, func) {
  if (!window.themeVariables.mediaQueries.hasOwnProperty(breakpointName)) {
    throw `Media query ${breakpointName} does not exist`;
  }
  return window
    .matchMedia(window.themeVariables.mediaQueries[breakpointName])
    .addEventListener("change", func);
}

// js/common/utilities/player.js
var _callback,
  _duration,
  _remainingTime,
  _startTime,
  _timer,
  _state,
  _onVisibilityChangeListener,
  _mustResumeOnVisibility,
  _onVisibilityChange,
  onVisibilityChange_fn;
var Player = class extends EventTarget {
  constructor(durationInSec, stopOnVisibility = true) {
    super();
    __privateAdd(this, _onVisibilityChange);
    __privateAdd(this, _callback, void 0);
    __privateAdd(this, _duration, void 0);
    __privateAdd(this, _remainingTime, void 0);
    __privateAdd(this, _startTime, void 0);
    __privateAdd(this, _timer, void 0);
    __privateAdd(this, _state, "paused");
    __privateAdd(
      this,
      _onVisibilityChangeListener,
      __privateMethod(this, _onVisibilityChange, onVisibilityChange_fn).bind(
        this
      )
    );
    __privateAdd(this, _mustResumeOnVisibility, true);
    __privateSet(this, _callback, () =>
      this.dispatchEvent(new CustomEvent("player:end"))
    );
    __privateSet(
      this,
      _duration,
      __privateSet(this, _remainingTime, durationInSec * 1e3)
    );
    if (stopOnVisibility) {
      document.addEventListener(
        "visibilitychange",
        __privateGet(this, _onVisibilityChangeListener)
      );
    }
  }
  pause() {
    if (__privateGet(this, _state) !== "started") {
      return;
    }
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _state, "paused");
    __privateSet(
      this,
      _remainingTime,
      __privateGet(this, _remainingTime) -
        (/* @__PURE__ */ new Date().getTime() - __privateGet(this, _startTime))
    );
    this.dispatchEvent(new CustomEvent("player:pause"));
  }
  resume(restartTimer = false) {
    if (__privateGet(this, _state) !== "stopped") {
      if (restartTimer) {
        this.start();
      } else {
        clearTimeout(__privateGet(this, _timer));
        __privateSet(this, _startTime, /* @__PURE__ */ new Date().getTime());
        __privateSet(this, _state, "started");
        __privateSet(
          this,
          _timer,
          setTimeout(
            __privateGet(this, _callback),
            __privateGet(this, _remainingTime)
          )
        );
        this.dispatchEvent(new CustomEvent("player:resume"));
      }
    }
  }
  start() {
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _startTime, /* @__PURE__ */ new Date().getTime());
    __privateSet(this, _state, "started");
    __privateSet(this, _remainingTime, __privateGet(this, _duration));
    __privateSet(
      this,
      _timer,
      setTimeout(
        __privateGet(this, _callback),
        __privateGet(this, _remainingTime)
      )
    );
    this.dispatchEvent(new CustomEvent("player:start"));
  }
  stop() {
    clearTimeout(__privateGet(this, _timer));
    __privateSet(this, _state, "stopped");
    this.dispatchEvent(new CustomEvent("player:stop"));
  }
};
_callback = new WeakMap();
_duration = new WeakMap();
_remainingTime = new WeakMap();
_startTime = new WeakMap();
_timer = new WeakMap();
_state = new WeakMap();
_onVisibilityChangeListener = new WeakMap();
_mustResumeOnVisibility = new WeakMap();
_onVisibilityChange = new WeakSet();
onVisibilityChange_fn = function () {
  if (document.visibilityState === "hidden") {
    __privateSet(
      this,
      _mustResumeOnVisibility,
      __privateGet(this, _state) === "started"
    );
    this.pause();
    this.dispatchEvent(new CustomEvent("player:visibility-pause"));
  } else if (
    document.visibilityState === "visible" &&
    __privateGet(this, _mustResumeOnVisibility)
  ) {
    this.resume();
    this.dispatchEvent(new CustomEvent("player:visibility-resume"));
  }
};

// js/common/utilities/qr-code.js
var QrCode = class extends HTMLElement {
  connectedCallback() {
    new window.QRCode(this, {
      text: this.getAttribute("identifier"),
      width: this.hasAttribute("width")
        ? parseInt(this.getAttribute("width"))
        : 200,
      height: this.hasAttribute("height")
        ? parseInt(this.getAttribute("height"))
        : 200,
    });
  }
};
if (!window.customElements.get("qr-code")) {
  window.customElements.define("qr-code", QrCode);
}

// js/common/behavior/height-observer.js
var _updateCustomProperties, updateCustomProperties_fn;
var HeightObserver = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _updateCustomProperties);
    if (window.ResizeObserver) {
      new ResizeObserver(
        throttle(
          __privateMethod(
            this,
            _updateCustomProperties,
            updateCustomProperties_fn
          ).bind(this)
        )
      ).observe(this);
    }
  }
  connectedCallback() {
    if (!window.ResizeObserver) {
      document.documentElement.style.setProperty(
        `--${this.getAttribute("variable")}-height`,
        `${this.clientHeight.toFixed(2)}px`
      );
    }
  }
};
_updateCustomProperties = new WeakSet();
updateCustomProperties_fn = function (entries) {
  entries.forEach((entry) => {
    if (entry.target === this) {
      const height = entry.borderBoxSize
        ? entry.borderBoxSize.length > 0
          ? entry.borderBoxSize[0].blockSize
          : entry.borderBoxSize.blockSize
        : entry.target.clientHeight;
      document.documentElement.style.setProperty(
        `--${this.getAttribute("variable")}-height`,
        `${height.toFixed(2)}px`
      );
    }
  });
};
if (!window.customElements.get("height-observer")) {
  window.customElements.define("height-observer", HeightObserver);
}

// js/common/behavior/loading-bar.js
import { animate as animate2 } from "vendor";
var _onLoadingStart, onLoadingStart_fn, _onLoadingEnd, onLoadingEnd_fn;
var LoadingBar = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _onLoadingStart);
    __privateAdd(this, _onLoadingEnd);
    document.addEventListener(
      "theme:loading:start",
      __privateMethod(this, _onLoadingStart, onLoadingStart_fn).bind(this)
    );
    document.addEventListener(
      "theme:loading:end",
      __privateMethod(this, _onLoadingEnd, onLoadingEnd_fn).bind(this)
    );
  }
};
_onLoadingStart = new WeakSet();
onLoadingStart_fn = function () {
  animate2(
    this,
    { opacity: [0, 1], transform: ["scaleX(0)", "scaleX(0.4)"] },
    { duration: 0.25 }
  );
};
_onLoadingEnd = new WeakSet();
onLoadingEnd_fn = async function () {
  await animate2(this, { transform: [null, "scaleX(1)"] }, { duration: 0.25 })
    .finished;
  animate2(this, { opacity: 0 }, { duration: 0.25 });
};
if (!window.customElements.get("loading-bar")) {
  window.customElements.define("loading-bar", LoadingBar);
}

// js/common/behavior/safe-sticky.js
import { inView as inView2 } from "vendor";
var _resizeObserver,
  _checkPositionListener,
  _initialTop,
  _lastKnownY,
  _currentTop,
  _position,
  _recalculateStyles,
  recalculateStyles_fn,
  _checkPosition,
  checkPosition_fn;
var SafeSticky = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _recalculateStyles);
    __privateAdd(this, _checkPosition);
    __privateAdd(
      this,
      _resizeObserver,
      new ResizeObserver(
        __privateMethod(this, _recalculateStyles, recalculateStyles_fn).bind(
          this
        )
      )
    );
    __privateAdd(
      this,
      _checkPositionListener,
      throttle(
        __privateMethod(this, _checkPosition, checkPosition_fn).bind(this)
      )
    );
    __privateAdd(this, _initialTop, 0);
    __privateAdd(this, _lastKnownY, 0);
    /* we could initialize it to window.scrollY but this avoids a costly reflow */
    __privateAdd(this, _currentTop, 0);
    __privateAdd(this, _position, "relative");
  }
  connectedCallback() {
    inView2(
      this,
      () => {
        window.addEventListener(
          "scroll",
          __privateGet(this, _checkPositionListener)
        );
        __privateGet(this, _resizeObserver).observe(this);
        return () => {
          window.removeEventListener(
            "scroll",
            __privateGet(this, _checkPositionListener)
          );
          __privateGet(this, _resizeObserver).unobserve(this);
        };
      },
      { margin: "500px" }
    );
  }
  disconnectedCallback() {
    window.removeEventListener(
      "scroll",
      __privateGet(this, _checkPositionListener)
    );
    __privateGet(this, _resizeObserver).unobserve(this);
  }
};
_resizeObserver = new WeakMap();
_checkPositionListener = new WeakMap();
_initialTop = new WeakMap();
_lastKnownY = new WeakMap();
_currentTop = new WeakMap();
_position = new WeakMap();
_recalculateStyles = new WeakSet();
recalculateStyles_fn = function () {
  this.style.removeProperty("top");
  const computedStyles = getComputedStyle(this);
  __privateSet(this, _initialTop, parseInt(computedStyles.top));
  __privateSet(this, _position, computedStyles.position);
  __privateMethod(this, _checkPosition, checkPosition_fn).call(this);
};
_checkPosition = new WeakSet();
checkPosition_fn = function () {
  if (__privateGet(this, _position) !== "sticky") {
    return this.style.removeProperty("top");
  }
  let bounds = this.getBoundingClientRect(),
    maxTop =
      bounds.top +
      window.scrollY -
      this.offsetTop +
      __privateGet(this, _initialTop),
    minTop = this.clientHeight - window.innerHeight + 20;
  if (window.scrollY < __privateGet(this, _lastKnownY)) {
    __privateSet(
      this,
      _currentTop,
      __privateGet(this, _currentTop) -
        (window.scrollY - __privateGet(this, _lastKnownY))
    );
  } else {
    __privateSet(
      this,
      _currentTop,
      __privateGet(this, _currentTop) +
        (__privateGet(this, _lastKnownY) - window.scrollY)
    );
  }
  __privateSet(
    this,
    _currentTop,
    Math.min(
      Math.max(__privateGet(this, _currentTop), -minTop),
      maxTop,
      __privateGet(this, _initialTop)
    )
  );
  __privateSet(this, _lastKnownY, window.scrollY);
  this.style.top = `${Math.round(__privateGet(this, _currentTop))}px`;
};
if (!window.customElements.get("safe-sticky")) {
  window.customElements.define("safe-sticky", SafeSticky);
}

// js/common/carousel/carousel-navigation.js
var _abortController, _allItems, _onCarouselFilter, onCarouselFilter_fn;
var CarouselNavigation = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onCarouselFilter);
    __privateAdd(this, _abortController, void 0);
    __privateAdd(this, _allItems, []);
  }
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel navigation component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    __privateSet(this, _abortController, new AbortController());
    __privateSet(this, _allItems, Array.from(this.querySelectorAll("button")));
    __privateGet(this, _allItems).forEach((button) =>
      button.addEventListener(
        "click",
        () => this.onButtonClicked(this.items.indexOf(button)),
        { signal: __privateGet(this, _abortController).signal }
      )
    );
    this.carousel.addEventListener(
      "carousel:change",
      (event) => this.onNavigationChange(event.detail.index),
      { signal: __privateGet(this, _abortController).signal }
    );
    this.carousel.addEventListener(
      "carousel:filter",
      __privateMethod(this, _onCarouselFilter, onCarouselFilter_fn).bind(this),
      { signal: __privateGet(this, _abortController).signal }
    );
  }
  disconnectedCallback() {
    __privateGet(this, _abortController).abort();
  }
  get items() {
    return __privateGet(this, _allItems).filter(
      (item) => !item.hasAttribute("hidden")
    );
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
  get selectedIndex() {
    return this.items.findIndex(
      (button) => button.getAttribute("aria-current") === "true"
    );
  }
  onButtonClicked(newIndex) {
    this.carousel.select(newIndex);
    this.onNavigationChange(newIndex);
  }
  onNavigationChange(newIndex) {
    this.items.forEach((button, index) =>
      button.setAttribute("aria-current", newIndex === index ? "true" : "false")
    );
    if (
      this.hasAttribute("align-selected") &&
      (this.scrollWidth !== this.clientWidth ||
        this.scrollHeight !== this.clientHeight)
    ) {
      this.scrollTo({
        left:
          this.items[newIndex].offsetLeft -
          this.clientWidth / 2 +
          this.items[newIndex].clientWidth / 2,
        top:
          this.items[newIndex].offsetTop -
          this.clientHeight / 2 +
          this.items[newIndex].clientHeight / 2,
        behavior: matchesMediaQuery("motion-safe") ? "smooth" : "auto",
      });
    }
  }
};
_abortController = new WeakMap();
_allItems = new WeakMap();
_onCarouselFilter = new WeakSet();
onCarouselFilter_fn = function (event) {
  __privateGet(this, _allItems).forEach((item, index) => {
    item.toggleAttribute(
      "hidden",
      (event.detail.filteredIndexes || []).includes(index)
    );
  });
};
var CarouselPrevButton = class extends HTMLButtonElement {
  #abortController;
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel prev button component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    this.#abortController = new AbortController();
    this.addEventListener("click", () => this.carousel.previous(), {
      signal: this.#abortController.signal,
    });
    this.carousel.addEventListener(
      "scroll:edge-nearing",
      (event) => (this.disabled = event.detail.position === "start"),
      { signal: this.#abortController.signal }
    );
    this.carousel.addEventListener(
      "scroll:edge-leaving",
      (event) =>
        (this.disabled =
          event.detail.position === "start" ? false : this.disabled),
      { signal: this.#abortController.signal }
    );
  }
  disconnectedCallback() {
    this.#abortController.abort();
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
};
var CarouselNextButton = class extends HTMLButtonElement {
  #abortController;
  connectedCallback() {
    if (!this.carousel) {
      throw "Carousel next button component requires an aria-controls attribute that refers to the controlled carousel.";
    }
    this.#abortController = new AbortController();
    this.addEventListener("click", () => this.carousel.next(), {
      signal: this.#abortController.signal,
    });
    this.carousel.addEventListener(
      "scroll:edge-nearing",
      (event) => (this.disabled = event.detail.position === "end"),
      { signal: this.#abortController.signal }
    );
    this.carousel.addEventListener(
      "scroll:edge-leaving",
      (event) =>
        (this.disabled =
          event.detail.position === "end" ? false : this.disabled),
      { signal: this.#abortController.signal }
    );
  }
  disconnectedCallback() {
    this.#abortController.abort();
  }
  get carousel() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
};
if (!window.customElements.get("carousel-prev-button")) {
  window.customElements.define("carousel-prev-button", CarouselPrevButton, {
    extends: "button",
  });
}
if (!window.customElements.get("carousel-next-button")) {
  window.customElements.define("carousel-next-button", CarouselNextButton, {
    extends: "button",
  });
}
if (!window.customElements.get("carousel-navigation")) {
  window.customElements.define("carousel-navigation", CarouselNavigation);
}

// js/common/carousel/effect-carousel.js
import { animate as animate3, timeline, inView as inView3 } from "vendor";
var _listenersAbortController,
  _gestureArea,
  _player,
  _targetIndex,
  _preventInitialTransition,
  _setupListeners,
  setupListeners_fn,
  _onKeyboardNavigation,
  onKeyboardNavigation_fn,
  _preloadImages,
  preloadImages_fn;
var EffectCarousel = class extends HTMLElement {
  constructor() {
    super();
    /**
     * -------------------------------------------------------------------------------------------------------------------
     * PRIVATE
     * -------------------------------------------------------------------------------------------------------------------
     */
    __privateAdd(this, _setupListeners);
    /**
     * -------------------------------------------------------------------------------------------------------------------
     * OTHER
     * -------------------------------------------------------------------------------------------------------------------
     */
    __privateAdd(this, _onKeyboardNavigation);
    __privateAdd(this, _preloadImages);
    __privateAdd(this, _listenersAbortController, void 0);
    __privateAdd(this, _gestureArea, void 0);
    __privateAdd(this, _player, void 0);
    __privateAdd(this, _targetIndex, 0);
    __privateAdd(this, _preventInitialTransition, false);
    __privateMethod(this, _setupListeners, setupListeners_fn).call(this);
    inView3(this, () => this.onBecameVisible());
    this.addEventListener("carousel:settle", (event) => {
      this.allCells.forEach((cell) =>
        cell.classList.toggle("is-selected", cell === event.detail.cell)
      );
    });
  }
  connectedCallback() {
    __privateSet(
      this,
      _targetIndex,
      Math.max(
        0,
        this.cells.findIndex((item) => item.classList.contains("is-selected"))
      )
    );
    inView3(this, () =>
      __privateMethod(this, _preloadImages, preloadImages_fn).call(this)
    );
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (PROPERTIES)
   * -------------------------------------------------------------------------------------------------------------------
   */
  get allowSwipe() {
    return this.hasAttribute("allow-swipe");
  }
  get cellSelector() {
    return this.hasAttribute("cell-selector")
      ? this.getAttribute("cell-selector")
      : null;
  }
  get allCells() {
    return this.cellSelector
      ? Array.from(this.querySelectorAll(this.cellSelector))
      : Array.from(this.children);
  }
  get cells() {
    return this.allCells.filter((cell) => !cell.hasAttribute("hidden"));
  }
  get selectedCell() {
    return this.cells[this.selectedIndex];
  }
  get selectedIndex() {
    return __privateGet(this, _targetIndex);
  }
  get player() {
    return __privateGet(this, _player);
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (METHODS)
   * -------------------------------------------------------------------------------------------------------------------
   */
  previous({ instant = false } = {}) {
    return this.select(
      (this.selectedIndex - 1 + this.cells.length) % this.cells.length,
      { instant, direction: "previous" }
    );
  }
  next({ instant = false } = {}) {
    return this.select(
      (this.selectedIndex + 1 + this.cells.length) % this.cells.length,
      { instant, direction: "next" }
    );
  }
  async select(index, { instant = false, direction = null } = {}) {
    if (!(index in this.cells)) {
      return Promise.resolve();
    }
    this.dispatchEvent(
      new CustomEvent("carousel:select", {
        detail: { index, cell: this.cells[index] },
      })
    );
    if (index === this.selectedIndex) {
      return Promise.resolve();
    }
    __privateGet(this, _player)?.pause();
    const [fromSlide, toSlide] = [this.selectedCell, this.cells[index]];
    direction ??= index > this.selectedIndex ? "next" : "previous";
    __privateSet(this, _targetIndex, index);
    this.dispatchEvent(
      new CustomEvent("carousel:change", {
        detail: { index, cell: this.cells[index] },
      })
    );
    const animationControls = this.createOnChangeAnimationControls(
      fromSlide,
      toSlide,
      { direction }
    );
    if (
      "leaveControls" in animationControls &&
      "enterControls" in animationControls
    ) {
      const leaveAnimationControls = animationControls.leaveControls();
      if (instant) {
        leaveAnimationControls.finish();
      }
      await leaveAnimationControls.finished;
      __privateGet(this, _player)?.resume(true);
      fromSlide.classList.remove("is-selected");
      toSlide.classList.add("is-selected");
      const enterAnimationControls = animationControls.enterControls();
      if (instant) {
        enterAnimationControls.finish();
      }
      await enterAnimationControls.finished;
    } else {
      if (instant) {
        animationControls.finish();
      }
      __privateGet(this, _player)?.resume(true);
      toSlide.classList.add("is-selected");
      await animationControls.finished;
      fromSlide.classList.remove("is-selected");
    }
    this.dispatchEvent(
      new CustomEvent("carousel:settle", {
        detail: { index, cell: this.cells[index] },
      })
    );
  }
  /**
   * Filter cells by indexes. This will automatically add the "hidden" attribute to cells whose index belong to this
   * list. It will also take care of properly adjusting the controls. As a reaction, a "carousel:filter" with the
   * filtered indexes will be emitted.
   */
  filter(indexes = []) {
    this.allCells.forEach((cell, index) => {
      cell.toggleAttribute("hidden", indexes.includes(index));
    });
    this.dispatchEvent(
      new CustomEvent("carousel:filter", {
        detail: { filteredIndexes: indexes },
      })
    );
  }
  async onBecameVisible() {
    const animationControls = await this.createOnBecameVisibleAnimationControls(
      this.selectedCell
    );
    [
      this.selectedCell,
      ...this.selectedCell.querySelectorAll("[reveal-on-scroll]"),
    ].forEach((element) => {
      element.removeAttribute("reveal-on-scroll");
    });
    if (
      __privateGet(this, _preventInitialTransition) &&
      typeof animationControls.finish === "function"
    ) {
      animationControls.finish();
    }
    return animationControls.finished.then(() => {
      __privateGet(this, _player)?.resume(true);
      this.dispatchEvent(
        new CustomEvent("carousel:settle", {
          detail: { index: this.selectedIndex, cell: this.selectedCell },
        })
      );
    });
  }
  /**
   * The animation controls when the carousel enter into the view for the first time (by default, none)
   */
  createOnBecameVisibleAnimationControls(toSlide) {
    return animate3(toSlide, {}, { duration: 0 });
  }
  /**
   * Define the transition when the slide changes
   */
  createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
    return timeline([
      [fromSlide, { opacity: [1, 0] }, { duration: 0.3 }],
      [toSlide, { opacity: [0, 1] }, { duration: 0.3, at: "<" }],
    ]);
  }
  /**
   * When the breakpoint changes (for instance from mobile to desktop), we may have to clean up the existing
   * attributes leave by Motion
   */
  cleanUpAnimations() {
    this.allCells.forEach((cell) => {
      cell.style.removeProperty("opacity");
      cell.style.removeProperty("visibility");
    });
  }
};
_listenersAbortController = new WeakMap();
_gestureArea = new WeakMap();
_player = new WeakMap();
_targetIndex = new WeakMap();
_preventInitialTransition = new WeakMap();
_setupListeners = new WeakSet();
setupListeners_fn = function () {
  if (this.hasAttribute("disabled-on")) {
    mediaQueryListener(this.getAttribute("disabled-on"), (event) => {
      if (event.matches) {
        __privateGet(this, _listenersAbortController)?.abort();
        this.cleanUpAnimations();
      } else {
        __privateMethod(this, _setupListeners, setupListeners_fn).call(this);
      }
    });
    if (matchesMediaQuery(this.getAttribute("disabled-on"))) {
      return;
    }
  }
  __privateSet(this, _listenersAbortController, new AbortController());
  const listenerOptions = {
    signal: __privateGet(this, _listenersAbortController).signal,
  };
  if (Shopify.designMode) {
    this.closest(".shopify-section").addEventListener(
      "shopify:section:select",
      (event) =>
        __privateSet(this, _preventInitialTransition, event.detail.load),
      listenerOptions
    );
  }
  if (this.allCells.length > 1) {
    this.addEventListener(
      "carousel:change",
      __privateMethod(this, _preloadImages, preloadImages_fn)
    );
    if (this.allowSwipe) {
      __privateSet(
        this,
        _gestureArea,
        new GestureArea(this, {
          signal: __privateGet(this, _listenersAbortController).signal,
        })
      );
      this.addEventListener("swipeleft", this.next, listenerOptions);
      this.addEventListener("swiperight", this.previous, listenerOptions);
    }
    if (!this.hasAttribute("disable-keyboard-navigation")) {
      this.tabIndex = 0;
      this.addEventListener(
        "keydown",
        __privateMethod(this, _onKeyboardNavigation, onKeyboardNavigation_fn),
        listenerOptions
      );
    }
    if (Shopify.designMode) {
      this.addEventListener(
        "shopify:block:select",
        (event) =>
          this.select(this.cells.indexOf(event.target), {
            instant: event.detail.load,
          }),
        listenerOptions
      );
    }
    if (this.hasAttribute("autoplay")) {
      __privateGet(this, _player) ??
        __privateSet(
          this,
          _player,
          new Player(this.getAttribute("autoplay") ?? 5)
        );
      __privateGet(this, _player).addEventListener(
        "player:end",
        this.next.bind(this),
        listenerOptions
      );
      if (Shopify.designMode) {
        this.addEventListener(
          "shopify:block:select",
          () => __privateGet(this, _player).stop(),
          listenerOptions
        );
        this.addEventListener(
          "shopify:block:deselect",
          () => __privateGet(this, _player).start(),
          listenerOptions
        );
      }
    }
  }
};
_onKeyboardNavigation = new WeakSet();
onKeyboardNavigation_fn = function (event) {
  if (event.target !== this) {
    return;
  }
  if (event.code === "ArrowLeft") {
    this.previous();
  } else if (event.code === "ArrowRight") {
    this.next();
  }
};
_preloadImages = new WeakSet();
preloadImages_fn = function () {
  const previousSlide =
      this.cells[
        (this.selectedIndex - 1 + this.cells.length) % this.cells.length
      ],
    nextSlide =
      this.cells[
        (this.selectedIndex + 1 + this.cells.length) % this.cells.length
      ];
  [previousSlide, this.selectedCell, nextSlide].forEach((item) => {
    Array.from(item.querySelectorAll('img[loading="lazy"]')).forEach((img) =>
      img.setAttribute("loading", "eager")
    );
    Array.from(item.querySelectorAll('video[preload="none"]')).forEach(
      (video) => video.setAttribute("preload", "metadata")
    );
  });
};
if (!window.customElements.get("effect-carousel")) {
  window.customElements.define("effect-carousel", EffectCarousel);
}

// js/common/carousel/scroll-carousel.js
import { inView as inView4 } from "vendor";
var _hasPendingProgrammaticScroll,
  _onMouseDownListener,
  _onMouseMoveListener,
  _onMouseClickListener,
  _onMouseUpListener,
  _targetIndex2,
  _forceChangeEvent,
  _dragPosition,
  _isDragging,
  _dispatchableScrollEvents,
  _scrollTimeout,
  _setupListeners2,
  setupListeners_fn2,
  _updateTargetIndex,
  updateTargetIndex_fn,
  _onScroll,
  onScroll_fn,
  _onScrollEnd,
  onScrollEnd_fn,
  _calculateLeftScroll,
  calculateLeftScroll_fn,
  _calculateClosestIndexToAlignment,
  calculateClosestIndexToAlignment_fn,
  _onMouseDown,
  onMouseDown_fn,
  _onMouseMove,
  onMouseMove_fn,
  _onMouseClick,
  onMouseClick_fn,
  _onMouseUp,
  onMouseUp_fn,
  _onResize,
  onResize_fn,
  _onMutate,
  onMutate_fn,
  _adaptHeight,
  adaptHeight_fn,
  _preloadImages2,
  preloadImages_fn2;
var ScrollCarousel = class extends HTMLElement {
  constructor() {
    super();
    /**
     * -------------------------------------------------------------------------------------------------------------------
     * PRIVATE METHODS
     * -------------------------------------------------------------------------------------------------------------------
     */
    /**
     * Setup all the listeners needed for the carousel to work properly
     */
    __privateAdd(this, _setupListeners2);
    __privateAdd(this, _updateTargetIndex);
    /**
     * -------------------------------------------------------------------------------------------------------------------
     * SCROLL MANAGEMENT
     * -------------------------------------------------------------------------------------------------------------------
     */
    __privateAdd(this, _onScroll);
    __privateAdd(this, _onScrollEnd);
    /**
     * Calculate the amount to scroll to align the cell with the "cell-align" rule
     */
    __privateAdd(this, _calculateLeftScroll);
    __privateAdd(this, _calculateClosestIndexToAlignment);
    /**
     * -------------------------------------------------------------------------------------------------------------------
     * DRAG FEATURE
     * -------------------------------------------------------------------------------------------------------------------
     */
    __privateAdd(this, _onMouseDown);
    __privateAdd(this, _onMouseMove);
    __privateAdd(this, _onMouseClick);
    __privateAdd(this, _onMouseUp);
    /**
     * -------------------------------------------------------------------------------------------------------------------
     * OTHER
     * -------------------------------------------------------------------------------------------------------------------
     */
    __privateAdd(this, _onResize);
    __privateAdd(this, _onMutate);
    __privateAdd(this, _adaptHeight);
    __privateAdd(this, _preloadImages2);
    __privateAdd(this, _hasPendingProgrammaticScroll, false);
    __privateAdd(
      this,
      _onMouseDownListener,
      __privateMethod(this, _onMouseDown, onMouseDown_fn).bind(this)
    );
    __privateAdd(
      this,
      _onMouseMoveListener,
      __privateMethod(this, _onMouseMove, onMouseMove_fn).bind(this)
    );
    __privateAdd(
      this,
      _onMouseClickListener,
      __privateMethod(this, _onMouseClick, onMouseClick_fn).bind(this)
    );
    __privateAdd(
      this,
      _onMouseUpListener,
      __privateMethod(this, _onMouseUp, onMouseUp_fn).bind(this)
    );
    __privateAdd(this, _targetIndex2, 0);
    // The cell index to which we are currently going to
    __privateAdd(this, _forceChangeEvent, false);
    __privateAdd(this, _dragPosition, {});
    __privateAdd(this, _isDragging, false);
    __privateAdd(this, _dispatchableScrollEvents, {
      nearingStart: true,
      nearingEnd: true,
      leavingStart: true,
      leavingEnd: true,
    });
    __privateAdd(this, _scrollTimeout, void 0);
    __privateMethod(this, _setupListeners2, setupListeners_fn2).call(this);
    new ResizeObserver(
      __privateMethod(this, _onResize, onResize_fn).bind(this)
    ).observe(this);
    new MutationObserver(
      __privateMethod(this, _onMutate, onMutate_fn).bind(this)
    ).observe(this, {
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden"],
    });
  }
  connectedCallback() {
    __privateSet(
      this,
      _targetIndex2,
      Math.max(
        0,
        this.cells.findIndex((item) => item.classList.contains("is-initial"))
      )
    );
    if (__privateGet(this, _targetIndex2) > 0) {
      this.select(__privateGet(this, _targetIndex2), { instant: true });
    }
    if (this.adaptiveHeight) {
      __privateMethod(this, _adaptHeight, adaptHeight_fn).call(this);
    }
    inView4(this, () =>
      __privateMethod(this, _preloadImages2, preloadImages_fn2).call(this)
    );
  }
  disconnectedCallback() {
    this.removeEventListener(
      "mousemove",
      __privateGet(this, _onMouseMoveListener)
    );
    document.removeEventListener(
      "mouseup",
      __privateGet(this, _onMouseUpListener)
    );
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (PROPERTIES)
   * -------------------------------------------------------------------------------------------------------------------
   */
  get cellSelector() {
    return this.hasAttribute("cell-selector")
      ? this.getAttribute("cell-selector")
      : null;
  }
  get allCells() {
    return this.cellSelector
      ? Array.from(this.querySelectorAll(this.cellSelector))
      : Array.from(this.children);
  }
  get cells() {
    return this.allCells.filter((cell) => !cell.hasAttribute("hidden"));
  }
  get selectedCell() {
    return this.cells[this.selectedIndex];
  }
  get selectedIndex() {
    return __privateGet(this, _targetIndex2);
  }
  get cellAlign() {
    const scrollSnapAlign = getComputedStyle(this.cells[0]).scrollSnapAlign;
    return scrollSnapAlign === "none" ? "center" : scrollSnapAlign;
  }
  get groupCells() {
    if (this.hasAttribute("group-cells")) {
      const number = parseInt(this.getAttribute("group-cells"));
      return isNaN(number)
        ? Math.floor(this.clientWidth / this.cells[0].clientWidth)
        : number;
    } else {
      return 1;
    }
  }
  get adaptiveHeight() {
    return this.hasAttribute("adaptive-height");
  }
  get isScrollable() {
    return (
      this.scrollWidth !== this.clientWidth ||
      this.scrollHeight !== this.clientHeight
    );
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PUBLIC API (METHODS)
   * -------------------------------------------------------------------------------------------------------------------
   */
  previous({ instant = false } = {}) {
    this.select(
      Math.max(__privateGet(this, _targetIndex2) - this.groupCells, 0),
      { instant }
    );
  }
  next({ instant = false } = {}) {
    this.select(
      Math.min(
        __privateGet(this, _targetIndex2) + this.groupCells,
        this.cells.length - 1
      ),
      { instant }
    );
  }
  select(index, { instant = false } = {}) {
    if (!(index in this.cells)) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("carousel:select", {
        detail: { index, cell: this.cells[index] },
      })
    );
    if (
      ("checkVisibility" in this && this.checkVisibility()) ||
      (this.offsetWidth > 0 && this.offsetHeight > 0)
    ) {
      const targetScrollLeft = __privateMethod(
        this,
        _calculateLeftScroll,
        calculateLeftScroll_fn
      ).call(this, this.cells[index]);
      if (this.scrollLeft !== targetScrollLeft) {
        __privateMethod(this, _updateTargetIndex, updateTargetIndex_fn).call(
          this,
          index
        );
        __privateSet(this, _hasPendingProgrammaticScroll, true);
        this.scrollTo({
          left: targetScrollLeft,
          behavior: instant ? "auto" : "smooth",
        });
      } else {
        __privateMethod(this, _updateTargetIndex, updateTargetIndex_fn).call(
          this,
          __privateMethod(
            this,
            _calculateClosestIndexToAlignment,
            calculateClosestIndexToAlignment_fn
          ).call(this)
        );
      }
    } else {
      __privateSet(this, _targetIndex2, index);
      __privateSet(this, _forceChangeEvent, true);
    }
  }
  /**
   * Filter cells by indexes. This will automatically add the "hidden" attribute to cells whose index belong to this
   * list. It will also take care of properly adjusting the controls. As a reaction, a "carousel:filter" with the
   * filtered indexes will be emitted.
   */
  filter(indexes = []) {
    this.allCells.forEach((cell, index) => {
      cell.toggleAttribute("hidden", indexes.includes(index));
    });
    this.dispatchEvent(
      new CustomEvent("carousel:filter", {
        detail: { filteredIndexes: indexes },
      })
    );
  }
};
_hasPendingProgrammaticScroll = new WeakMap();
_onMouseDownListener = new WeakMap();
_onMouseMoveListener = new WeakMap();
_onMouseClickListener = new WeakMap();
_onMouseUpListener = new WeakMap();
_targetIndex2 = new WeakMap();
_forceChangeEvent = new WeakMap();
_dragPosition = new WeakMap();
_isDragging = new WeakMap();
_dispatchableScrollEvents = new WeakMap();
_scrollTimeout = new WeakMap();
_setupListeners2 = new WeakSet();
setupListeners_fn2 = function () {
  if (this.allCells.length > 1) {
    this.addEventListener(
      "carousel:change",
      __privateMethod(this, _preloadImages2, preloadImages_fn2)
    );
    this.addEventListener(
      "scroll",
      throttle(__privateMethod(this, _onScroll, onScroll_fn).bind(this))
    );
    this.addEventListener(
      "scrollend",
      __privateMethod(this, _onScrollEnd, onScrollEnd_fn)
    );
    if (this.hasAttribute("allow-drag")) {
      const mediaQuery = window.matchMedia("screen and (pointer: fine)");
      mediaQuery.addEventListener("change", (event) => {
        if (event.matches) {
          this.addEventListener(
            "mousedown",
            __privateGet(this, _onMouseDownListener)
          );
        } else {
          this.removeEventListener(
            "mousedown",
            __privateGet(this, _onMouseDownListener)
          );
        }
      });
      if (mediaQuery.matches) {
        this.addEventListener(
          "mousedown",
          __privateGet(this, _onMouseDownListener)
        );
      }
    }
    if (this.adaptiveHeight) {
      this.addEventListener(
        "carousel:settle",
        __privateMethod(this, _adaptHeight, adaptHeight_fn)
      );
    }
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) =>
        this.select(this.cells.indexOf(event.target), {
          instant: event.detail.load,
        })
      );
    }
  }
};
_updateTargetIndex = new WeakSet();
updateTargetIndex_fn = function (newValue) {
  if (
    newValue === __privateGet(this, _targetIndex2) &&
    !__privateGet(this, _forceChangeEvent)
  ) {
    return;
  }
  __privateSet(this, _targetIndex2, newValue);
  __privateSet(this, _forceChangeEvent, false);
  this.dispatchEvent(
    new CustomEvent("carousel:change", {
      detail: { index: newValue, cell: this.cells[newValue] },
    })
  );
};
_onScroll = new WeakSet();
onScroll_fn = function () {
  const scrollEdgeThreshold = 100,
    normalizedScrollLeft = Math.round(Math.abs(this.scrollLeft));
  if (
    normalizedScrollLeft < scrollEdgeThreshold &&
    __privateGet(this, _dispatchableScrollEvents)["nearingStart"]
  ) {
    this.dispatchEvent(
      new CustomEvent("scroll:edge-nearing", { detail: { position: "start" } })
    );
    __privateGet(this, _dispatchableScrollEvents)["nearingStart"] = false;
    __privateGet(this, _dispatchableScrollEvents)["leavingStart"] = true;
  }
  if (
    normalizedScrollLeft >= scrollEdgeThreshold &&
    __privateGet(this, _dispatchableScrollEvents)["leavingStart"]
  ) {
    this.dispatchEvent(
      new CustomEvent("scroll:edge-leaving", { detail: { position: "start" } })
    );
    __privateGet(this, _dispatchableScrollEvents)["leavingStart"] = false;
    __privateGet(this, _dispatchableScrollEvents)["nearingStart"] = true;
  }
  if (
    this.scrollWidth - this.clientWidth <
      normalizedScrollLeft + scrollEdgeThreshold &&
    __privateGet(this, _dispatchableScrollEvents)["nearingEnd"]
  ) {
    this.dispatchEvent(
      new CustomEvent("scroll:edge-nearing", { detail: { position: "end" } })
    );
    __privateGet(this, _dispatchableScrollEvents)["nearingEnd"] = false;
    __privateGet(this, _dispatchableScrollEvents)["leavingEnd"] = true;
  }
  if (
    this.scrollWidth - this.clientWidth >=
      normalizedScrollLeft + scrollEdgeThreshold &&
    __privateGet(this, _dispatchableScrollEvents)["leavingEnd"]
  ) {
    this.dispatchEvent(
      new CustomEvent("scroll:edge-leaving", { detail: { position: "end" } })
    );
    __privateGet(this, _dispatchableScrollEvents)["leavingEnd"] = false;
    __privateGet(this, _dispatchableScrollEvents)["nearingEnd"] = true;
  }
  if (!("onscrollend" in window)) {
    clearTimeout(__privateGet(this, _scrollTimeout));
    __privateSet(
      this,
      _scrollTimeout,
      setTimeout(() => {
        this.dispatchEvent(new CustomEvent("scrollend", { bubbles: true }));
      }, 75)
    );
  }
  if (__privateGet(this, _hasPendingProgrammaticScroll)) {
    return;
  }
  __privateMethod(this, _updateTargetIndex, updateTargetIndex_fn).call(
    this,
    __privateMethod(
      this,
      _calculateClosestIndexToAlignment,
      calculateClosestIndexToAlignment_fn
    ).call(this)
  );
};
_onScrollEnd = new WeakSet();
onScrollEnd_fn = function () {
  __privateSet(this, _hasPendingProgrammaticScroll, false);
  if (!__privateGet(this, _isDragging)) {
    this.style.removeProperty("scroll-snap-type");
  }
  __privateMethod(this, _updateTargetIndex, updateTargetIndex_fn).call(
    this,
    __privateMethod(
      this,
      _calculateClosestIndexToAlignment,
      calculateClosestIndexToAlignment_fn
    ).call(this)
  );
  this.dispatchEvent(
    new CustomEvent("carousel:settle", {
      detail: { index: this.selectedIndex, cell: this.selectedCell },
    })
  );
};
_calculateLeftScroll = new WeakSet();
calculateLeftScroll_fn = function (cell) {
  let scrollLeft;
  switch (this.cellAlign) {
    case "start":
      scrollLeft =
        document.dir === "ltr"
          ? cell.offsetLeft -
            (parseInt(getComputedStyle(this).scrollPaddingInlineStart) || 0)
          : cell.offsetLeft +
            cell.offsetWidth -
            this.clientWidth +
            (parseInt(getComputedStyle(this).scrollPaddingInlineStart) || 0);
      break;
    case "center":
      scrollLeft = Math.round(
        cell.offsetLeft - this.clientWidth / 2 + cell.clientWidth / 2
      );
      break;
    case "end":
      scrollLeft =
        document.dir === "ltr"
          ? cell.offsetLeft +
            cell.offsetWidth -
            this.clientWidth +
            (parseInt(getComputedStyle(this).scrollPaddingInlineEnd) || 0)
          : cell.offsetLeft -
            (parseInt(getComputedStyle(this).scrollPaddingInlineEnd) || 0);
      break;
  }
  return document.dir === "ltr"
    ? Math.min(Math.max(scrollLeft, 0), this.scrollWidth - this.clientWidth)
    : Math.min(Math.max(scrollLeft, this.clientWidth - this.scrollWidth), 0);
};
_calculateClosestIndexToAlignment = new WeakSet();
calculateClosestIndexToAlignment_fn = function () {
  let cellAlign = this.cellAlign,
    offsetAccumulators,
    targetPoint;
  if (cellAlign === "center") {
    offsetAccumulators = this.cells.map((cell) =>
      Math.round(cell.offsetLeft + cell.clientWidth / 2)
    );
    targetPoint = Math.round(this.scrollLeft + this.clientWidth / 2);
  } else if (
    (cellAlign === "start" && document.dir === "ltr") ||
    (cellAlign === "end" && document.dir === "rtl")
  ) {
    offsetAccumulators = this.cells.map((cell) => cell.offsetLeft);
    targetPoint = this.scrollLeft;
  } else {
    offsetAccumulators = this.cells.map(
      (cell) => cell.offsetLeft + cell.clientWidth
    );
    targetPoint = this.scrollLeft + this.clientWidth;
  }
  return offsetAccumulators.indexOf(
    offsetAccumulators.reduce((prev, curr) =>
      Math.abs(curr - targetPoint) < Math.abs(prev - targetPoint) ? curr : prev
    )
  );
};
_onMouseDown = new WeakSet();
onMouseDown_fn = function (event) {
  __privateSet(this, _dragPosition, {
    // The current scroll
    left: this.scrollLeft,
    top: this.scrollTop,
    // Get the current mouse position
    x: event.clientX,
    y: event.clientY,
  });
  __privateSet(this, _isDragging, true);
  this.style.setProperty("scroll-snap-type", "none");
  this.addEventListener("mousemove", __privateGet(this, _onMouseMoveListener));
  this.addEventListener("click", __privateGet(this, _onMouseClickListener), {
    once: true,
  });
  document.addEventListener("mouseup", __privateGet(this, _onMouseUpListener));
};
_onMouseMove = new WeakSet();
onMouseMove_fn = function (event) {
  event.preventDefault();
  const [dx, dy] = [
    event.clientX - __privateGet(this, _dragPosition).x,
    event.clientY - __privateGet(this, _dragPosition).y,
  ];
  this.scrollTop = __privateGet(this, _dragPosition).top - dy;
  this.scrollLeft = __privateGet(this, _dragPosition).left - dx;
};
_onMouseClick = new WeakSet();
onMouseClick_fn = function (event) {
  if (event.clientX - __privateGet(this, _dragPosition).x !== 0) {
    event.preventDefault();
  }
};
_onMouseUp = new WeakSet();
onMouseUp_fn = function (event) {
  __privateSet(this, _isDragging, false);
  if (event.clientX - __privateGet(this, _dragPosition).x === 0) {
    this.style.removeProperty("scroll-snap-type");
  } else if (!__privateGet(this, _hasPendingProgrammaticScroll)) {
    this.scrollTo({
      left: __privateMethod(
        this,
        _calculateLeftScroll,
        calculateLeftScroll_fn
      ).call(this, this.selectedCell),
      behavior: "smooth",
    });
  }
  this.removeEventListener(
    "mousemove",
    __privateGet(this, _onMouseMoveListener)
  );
  document.removeEventListener(
    "mouseup",
    __privateGet(this, _onMouseUpListener)
  );
};
_onResize = new WeakSet();
onResize_fn = function () {
  if (
    this.selectedIndex !==
    __privateMethod(
      this,
      _calculateClosestIndexToAlignment,
      calculateClosestIndexToAlignment_fn
    ).call(this)
  ) {
    this.select(this.selectedIndex, { instant: true });
  }
  if (this.adaptiveHeight) {
    __privateMethod(this, _adaptHeight, adaptHeight_fn).call(this);
  }
  this.classList.toggle("is-scrollable", this.scrollWidth > this.clientWidth);
};
_onMutate = new WeakSet();
onMutate_fn = function () {
  __privateSet(this, _forceChangeEvent, true);
};
_adaptHeight = new WeakSet();
adaptHeight_fn = function () {
  if (this.clientHeight === this.selectedCell.clientHeight) {
    return;
  }
  this.style.maxHeight = null;
  if (this.isScrollable) {
    this.style.maxHeight = `${this.selectedCell.clientHeight}px`;
  }
};
_preloadImages2 = new WeakSet();
preloadImages_fn2 = function () {
  const previousSlide = this.cells[Math.max(this.selectedIndex - 1, 0)],
    nextSlide =
      this.cells[Math.min(this.selectedIndex + 1, this.cells.length - 1)];
  [previousSlide, this.selectedCell, nextSlide]
    .filter((item) => item !== null)
    .forEach((item) => {
      Array.from(item.querySelectorAll('img[loading="lazy"]')).forEach((img) =>
        img.setAttribute("loading", "eager")
      );
      Array.from(item.querySelectorAll('video[preload="none"]')).forEach(
        (video) => video.setAttribute("preload", "metadata")
      );
    });
};
if (!window.customElements.get("scroll-carousel")) {
  window.customElements.define("scroll-carousel", ScrollCarousel);
}

// js/common/cart/fetch-cart.js
var createCartPromise = () => {
  return new Promise(async (resolve) => {
    resolve(await (await fetch(`${Shopify.routes.root}cart.js`)).json());
  });
};
var fetchCart = createCartPromise();
document.addEventListener("cart:change", (event) => {
  fetchCart = event.detail["cart"];
});
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    fetchCart = createCartPromise();
  }
});
document.addEventListener("cart:refresh", () => {
  fetchCart = createCartPromise();
});

// js/common/cart/cart-count.js
var _abortController2, _updateFromServer, updateFromServer_fn;
var CartCount = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _updateFromServer);
    __privateAdd(this, _abortController2, void 0);
  }
  connectedCallback() {
    __privateSet(this, _abortController2, new AbortController());
    document.addEventListener(
      "cart:change",
      (event) => (this.itemCount = event.detail["cart"]["item_count"]),
      { signal: __privateGet(this, _abortController2).signal }
    );
    document.addEventListener(
      "cart:refresh",
      __privateMethod(this, _updateFromServer, updateFromServer_fn).bind(this),
      { signal: __privateGet(this, _abortController2).signal }
    );
    window.addEventListener(
      "pageshow",
      __privateMethod(this, _updateFromServer, updateFromServer_fn).bind(this),
      { signal: __privateGet(this, _abortController2).signal }
    );
  }
  disconnectedCallback() {
    __privateGet(this, _abortController2).abort();
  }
  set itemCount(count) {
    this.innerText = count;
  }
};
_abortController2 = new WeakMap();
_updateFromServer = new WeakSet();
updateFromServer_fn = async function () {
  this.itemCount = (await fetchCart)["item_count"];
};
if (!window.customElements.get("cart-count")) {
  window.customElements.define("cart-count", CartCount);
}

// js/common/cart/cart-dot.js
var _abortController3, _updateFromServer2, updateFromServer_fn2;
var CartDot = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _updateFromServer2);
    __privateAdd(this, _abortController3, void 0);
  }
  connectedCallback() {
    __privateSet(this, _abortController3, new AbortController());
    document.addEventListener(
      "cart:change",
      (event) =>
        this.classList.toggle(
          "is-visible",
          event.detail["cart"]["item_count"] > 0
        ),
      { signal: __privateGet(this, _abortController3).signal }
    );
    document.addEventListener(
      "cart:refresh",
      __privateMethod(this, _updateFromServer2, updateFromServer_fn2).bind(
        this
      ),
      { signal: __privateGet(this, _abortController3).signal }
    );
    window.addEventListener(
      "pageshow",
      __privateMethod(this, _updateFromServer2, updateFromServer_fn2).bind(
        this
      ),
      { signal: __privateGet(this, _abortController3).signal }
    );
  }
  disconnectedCallback() {
    __privateGet(this, _abortController3).abort();
  }
};
_abortController3 = new WeakMap();
_updateFromServer2 = new WeakSet();
updateFromServer_fn2 = async function () {
  this.classList.toggle("is-visible", (await fetchCart)["item_count"] > 0);
};
if (!window.customElements.get("cart-dot")) {
  window.customElements.define("cart-dot", CartDot);
}

// js/common/cart/cart-note.js
var _onNoteChanged, onNoteChanged_fn;
var CartNote = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _onNoteChanged);
    this.addEventListener(
      "change",
      __privateMethod(this, _onNoteChanged, onNoteChanged_fn)
    );
  }
};
_onNoteChanged = new WeakSet();
onNoteChanged_fn = function (event) {
  if (event.target.getAttribute("name") !== "note") {
    return;
  }
  fetch(`${Shopify.routes.root}cart/update.js`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: event.target.value }),
    keepalive: true,
    // Allows to make sure the request is fired even when submitting the form
  });
};
if (!window.customElements.get("cart-note")) {
  window.customElements.define("cart-note", CartNote);
}

// js/common/cart/free-shipping-bar.js
var _onCartChangedListener,
  _threshold,
  _updateMessage,
  updateMessage_fn,
  _onCartChanged,
  onCartChanged_fn;
var FreeShippingBar = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _updateMessage);
    __privateAdd(this, _onCartChanged);
    __privateAdd(
      this,
      _onCartChangedListener,
      __privateMethod(this, _onCartChanged, onCartChanged_fn).bind(this)
    );
    __privateAdd(this, _threshold, void 0);
    __privateSet(
      this,
      _threshold,
      parseFloat(this.getAttribute("threshold").replace(/[^0-9.]/g, "")) * 100
    );
    this.setAttribute("threshold", __privateGet(this, _threshold));
  }
  static get observedAttributes() {
    return ["threshold", "total-price"];
  }
  connectedCallback() {
    document.addEventListener(
      "cart:change",
      __privateGet(this, _onCartChangedListener)
    );
  }
  disconnectedCallback() {
    document.removeEventListener(
      "cart:change",
      __privateGet(this, _onCartChangedListener)
    );
  }
  get totalPrice() {
    return parseFloat(this.getAttribute("total-price"));
  }
  set totalPrice(value) {
    this.setAttribute("total-price", value);
  }
  attributeChangedCallback() {
    __privateMethod(this, _updateMessage, updateMessage_fn).call(this);
  }
};
_onCartChangedListener = new WeakMap();
_threshold = new WeakMap();
_updateMessage = new WeakSet();
updateMessage_fn = function () {
  const messageElement = this.querySelector("span");
  if (this.totalPrice >= __privateGet(this, _threshold)) {
    messageElement.innerHTML = this.getAttribute("reached-message");
  } else {
    const replacement = `${formatMoney(
      __privateGet(this, _threshold) - this.totalPrice
    ).replace(/\$/g, "$$$$")}`;
    messageElement.innerHTML = this.getAttribute("unreached-message").replace(
      new RegExp("({{.*}})", "g"),
      replacement
    );
  }
};
_onCartChanged = new WeakSet();
onCartChanged_fn = function (event) {
  const priceForItems = event.detail["cart"]["items"]
      .filter((item) => item["requires_shipping"])
      .reduce((sum, item) => sum + item["final_line_price"], 0),
    cartDiscount = event.detail["cart"][
      "cart_level_discount_applications"
    ].reduce(
      (sum, discountAllocation) =>
        sum + discountAllocation["total_allocated_amount"],
      0
    );
  this.totalPrice = priceForItems - cartDiscount;
};
if (!window.customElements.get("free-shipping-bar")) {
  window.customElements.define("free-shipping-bar", FreeShippingBar);
}

// js/common/cart/line-item-quantity.js
import { Delegate } from "vendor";
var _delegate,
  _onQuantityChanged,
  onQuantityChanged_fn,
  _onChangeLinkClicked,
  onChangeLinkClicked_fn,
  _changeLineItemQuantity,
  changeLineItemQuantity_fn;
var LineItemQuantity = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _onQuantityChanged);
    __privateAdd(this, _onChangeLinkClicked);
    __privateAdd(this, _changeLineItemQuantity);
    __privateAdd(this, _delegate, new Delegate(this));
    __privateGet(this, _delegate).on(
      "change",
      "[data-line-key]",
      __privateMethod(this, _onQuantityChanged, onQuantityChanged_fn).bind(this)
    );
    __privateGet(this, _delegate).on(
      "click",
      '[href*="/cart/change"]',
      __privateMethod(this, _onChangeLinkClicked, onChangeLinkClicked_fn).bind(
        this
      )
    );
  }
};
_delegate = new WeakMap();
_onQuantityChanged = new WeakSet();
onQuantityChanged_fn = function (event, target) {
  __privateMethod(
    this,
    _changeLineItemQuantity,
    changeLineItemQuantity_fn
  ).call(this, target.getAttribute("data-line-key"), parseInt(target.value));
};
_onChangeLinkClicked = new WeakSet();
onChangeLinkClicked_fn = function (event, target) {
  event.preventDefault();
  const url = new URL(target.href);
  __privateMethod(
    this,
    _changeLineItemQuantity,
    changeLineItemQuantity_fn
  ).call(
    this,
    url.searchParams.get("id"),
    parseInt(url.searchParams.get("quantity"))
  );
};
_changeLineItemQuantity = new WeakSet();
changeLineItemQuantity_fn = async function (lineKey, targetQuantity) {
  if (window.themeVariables.settings.pageType === "cart") {
    window.location.href = `${Shopify.routes.root}cart/change?id=${lineKey}&quantity=${targetQuantity}`;
  } else {
    document.documentElement.dispatchEvent(
      new CustomEvent("theme:loading:start", { bubbles: true })
    );
    const lineItem = this.closest("line-item");
    lineItem?.dispatchEvent(
      new CustomEvent("line-item:will-change", {
        bubbles: true,
        detail: { targetQuantity },
      })
    );
    let sectionsToBundle = [];
    document.documentElement.dispatchEvent(
      new CustomEvent("cart:prepare-bundled-sections", {
        bubbles: true,
        detail: { sections: sectionsToBundle },
      })
    );
    const cartContent = await (
      await fetch(`${Shopify.routes.root}cart/change.js`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lineKey,
          quantity: targetQuantity,
          sections: sectionsToBundle.join(","),
        }),
      })
    ).json();
    document.documentElement.dispatchEvent(
      new CustomEvent("theme:loading:end", { bubbles: true })
    );
    const lineItemAfterChange = cartContent["items"].filter(
      (lineItem2) => lineItem2["key"] === lineKey
    );
    lineItem?.dispatchEvent(
      new CustomEvent("line-item:change", {
        bubbles: true,
        detail: {
          quantity:
            lineItemAfterChange.length === 0
              ? 0
              : lineItemAfterChange[0]["quantity"],
          cart: cartContent,
        },
      })
    );
    document.documentElement.dispatchEvent(
      new CustomEvent("cart:change", {
        bubbles: true,
        detail: {
          baseEvent: "line-item:change",
          cart: cartContent,
        },
      })
    );
  }
};
if (!window.customElements.get("line-item-quantity")) {
  window.customElements.define("line-item-quantity", LineItemQuantity);
}

// js/common/cart/shipping-estimator.js
var _estimateShippingListener,
  _estimateShipping,
  estimateShipping_fn,
  _getAsyncShippingRates,
  getAsyncShippingRates_fn,
  _formatShippingRates,
  formatShippingRates_fn,
  _formatError,
  formatError_fn;
var ShippingEstimator = class extends HTMLElement {
  constructor() {
    super(...arguments);
    /**
     * @doc https://shopify.dev/docs/themes/ajax-api/reference/cart#generate-shipping-rates
     */
    __privateAdd(this, _estimateShipping);
    __privateAdd(this, _getAsyncShippingRates);
    __privateAdd(this, _formatShippingRates);
    __privateAdd(this, _formatError);
    __privateAdd(
      this,
      _estimateShippingListener,
      __privateMethod(this, _estimateShipping, estimateShipping_fn).bind(this)
    );
  }
  connectedCallback() {
    this.submitButton = this.querySelector('[type="button"]');
    this.resultsElement = this.querySelector('[aria-live="polite"]');
    this.submitButton.addEventListener(
      "click",
      __privateGet(this, _estimateShippingListener)
    );
  }
  disconnectedCallback() {
    this.submitButton.removeEventListener(
      "click",
      __privateGet(this, _estimateShippingListener)
    );
  }
};
_estimateShippingListener = new WeakMap();
_estimateShipping = new WeakSet();
estimateShipping_fn = async function (event) {
  event.preventDefault();
  const zip = this.querySelector('[name="address[zip]"]').value,
    country = this.querySelector('[name="address[country]"]').value,
    province = this.querySelector('[name="address[province]"]').value;
  this.submitButton.setAttribute("aria-busy", "true");
  document.documentElement.dispatchEvent(
    new CustomEvent("theme:loading:start", { bubbles: true })
  );
  const prepareResponse = await fetch(
    `${Shopify.routes.root}cart/prepare_shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`,
    { method: "POST" }
  );
  document.documentElement.dispatchEvent(
    new CustomEvent("theme:loading:end", { bubbles: true })
  );
  if (prepareResponse.ok) {
    const shippingRates = await __privateMethod(
      this,
      _getAsyncShippingRates,
      getAsyncShippingRates_fn
    ).call(this, zip, country, province);
    __privateMethod(this, _formatShippingRates, formatShippingRates_fn).call(
      this,
      shippingRates
    );
  } else {
    const jsonError = await prepareResponse.json();
    __privateMethod(this, _formatError, formatError_fn).call(this, jsonError);
  }
  this.resultsElement.hidden = false;
  this.submitButton.removeAttribute("aria-busy");
};
_getAsyncShippingRates = new WeakSet();
getAsyncShippingRates_fn = async function (zip, country, province) {
  const response = await fetch(
    `${Shopify.routes.root}cart/async_shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`
  );
  const responseAsText = await response.text();
  if (responseAsText === "null") {
    return __privateMethod(
      this,
      _getAsyncShippingRates,
      getAsyncShippingRates_fn
    ).call(this, zip, country, province);
  } else {
    return JSON.parse(responseAsText)["shipping_rates"];
  }
};
_formatShippingRates = new WeakSet();
formatShippingRates_fn = function (shippingRates) {
  let formattedShippingRates = shippingRates.map((shippingRate) => {
    return `<li>${shippingRate["presentment_name"]}: ${shippingRate["currency"]} ${shippingRate["price"]}</li>`;
  });
  this.resultsElement.innerHTML = `
      <div class="v-stack gap-2">
        <p>${
          shippingRates.length === 0
            ? window.themeVariables.strings.shippingEstimatorNoResults
            : shippingRates.length === 1
            ? window.themeVariables.strings.shippingEstimatorOneResult
            : window.themeVariables.strings.shippingEstimatorMultipleResults
        }</p>
        ${
          formattedShippingRates === ""
            ? ""
            : `<ul class="list-disc" role="list">${formattedShippingRates}</ul>`
        }
      </div>
    `;
};
_formatError = new WeakSet();
formatError_fn = function (errors) {
  let formattedShippingRates = Object.keys(errors).map((errorKey) => {
    return `<li>${errors[errorKey]}</li>`;
  });
  this.resultsElement.innerHTML = `
      <div class="v-stack gap-2">
        <p>${window.themeVariables.strings.shippingEstimatorError}</p>
        <ul class="list-disc" role="list">${formattedShippingRates}</ul>
      </div>
    `;
};
if (!window.customElements.get("shipping-estimator")) {
  window.customElements.define("shipping-estimator", ShippingEstimator);
}

// js/common/facets/facets-form.js
var _isDirty,
  _buildUrl,
  buildUrl_fn,
  _onFormChanged,
  onFormChanged_fn,
  _onFormSubmitted,
  onFormSubmitted_fn;
var FacetsForm = class extends HTMLFormElement {
  constructor() {
    super();
    __privateAdd(this, _buildUrl);
    __privateAdd(this, _onFormChanged);
    __privateAdd(this, _onFormSubmitted);
    __privateAdd(this, _isDirty, false);
    this.addEventListener(
      "change",
      __privateMethod(this, _onFormChanged, onFormChanged_fn)
    );
    this.addEventListener(
      "submit",
      __privateMethod(this, _onFormSubmitted, onFormSubmitted_fn)
    );
  }
};
_isDirty = new WeakMap();
_buildUrl = new WeakSet();
buildUrl_fn = function () {
  const searchParams = new URLSearchParams(new FormData(this)),
    url = new URL(this.action);
  url.search = "";
  searchParams.forEach((value, key) => url.searchParams.append(key, value));
  ["page", "filter.v.price.gte", "filter.v.price.lte"].forEach(
    (optionToClear) => {
      if (url.searchParams.get(optionToClear) === "") {
        url.searchParams.delete(optionToClear);
      }
    }
  );
  url.searchParams.set("section_id", this.getAttribute("section-id"));
  return url;
};
_onFormChanged = new WeakSet();
onFormChanged_fn = function () {
  __privateSet(this, _isDirty, true);
  if (this.hasAttribute("update-on-change")) {
    if (HTMLFormElement.prototype.requestSubmit) {
      this.requestSubmit();
    } else {
      this.dispatchEvent(new Event("submit", { cancelable: true }));
    }
  } else {
    cachedFetch(
      __privateMethod(this, _buildUrl, buildUrl_fn).call(this).toString()
    );
  }
};
_onFormSubmitted = new WeakSet();
onFormSubmitted_fn = function (event) {
  event.preventDefault();
  if (!__privateGet(this, _isDirty)) {
    return;
  }
  this.dispatchEvent(
    new CustomEvent("facet:update", {
      bubbles: true,
      detail: {
        url: __privateMethod(this, _buildUrl, buildUrl_fn).call(this),
      },
    })
  );
  __privateSet(this, _isDirty, false);
};
if (!window.customElements.get("facets-form")) {
  window.customElements.define("facets-form", FacetsForm, { extends: "form" });
}

// js/common/overlay/dialog-element.js
import { animate as animate4, FocusTrap, Delegate as Delegate2 } from "vendor";
var lockLayerCount = 0;
var _isLocked,
  _delegate2,
  _abortController4,
  _focusTrap,
  _originalParentBeforeAppend,
  _allowOutsideClick,
  allowOutsideClick_fn,
  _allowOutsideClickTouch,
  allowOutsideClickTouch_fn,
  _allowOutsideClickMouse,
  allowOutsideClickMouse_fn,
  _onToggleClicked,
  onToggleClicked_fn,
  _updateSlotVisibility,
  updateSlotVisibility_fn;
var DialogElement = class extends HTMLElement {
  constructor() {
    super();
    /**
     * If "clickOutsideDeactivates" is true, then this listener will be called on every click outside the element. This
     * allows function separates touch and non-touch events
     */
    __privateAdd(this, _allowOutsideClick);
    /**
     * If "clickOutsideDeactivates" is true, this listener will be called on every touch click outside the trapped
     * element. By default, this will allow any click outside to cause the dialog to close
     */
    __privateAdd(this, _allowOutsideClickTouch);
    /**
     * If "clickOutsideDeactivates" is true, this listener will be called on every mouse click outside the trapped
     * element. By default, this will allow any click outside to cause the dialog to close.
     */
    __privateAdd(this, _allowOutsideClickMouse);
    /**
     * This function is called whenever a toggle (an element controlling this dialog) is called. This simply open
     * the dialog if closed, or close it if open
     */
    __privateAdd(this, _onToggleClicked);
    /**
     * Hide the slots that do not have any children
     */
    __privateAdd(this, _updateSlotVisibility);
    __privateAdd(this, _isLocked, false);
    __privateAdd(this, _delegate2, new Delegate2(document.body));
    __privateAdd(this, _abortController4, void 0);
    __privateAdd(this, _focusTrap, void 0);
    __privateAdd(this, _originalParentBeforeAppend, void 0);
    if (this.shadowDomTemplate) {
      this.attachShadow({ mode: "open" }).appendChild(
        document.getElementById(this.shadowDomTemplate).content.cloneNode(true)
      );
      this.shadowRoot.addEventListener("slotchange", (event) =>
        __privateMethod(
          this,
          _updateSlotVisibility,
          updateSlotVisibility_fn
        ).call(this, event.target)
      );
    }
    this.addEventListener("dialog:force-close", (event) => {
      this.hide();
      event.stopPropagation();
    });
  }
  static get observedAttributes() {
    return ["id", "open"];
  }
  connectedCallback() {
    if (this.id) {
      __privateGet(this, _delegate2)
        .off()
        .on(
          "click",
          `[aria-controls="${this.id}"]`,
          __privateMethod(this, _onToggleClicked, onToggleClicked_fn).bind(this)
        );
    }
    __privateSet(this, _abortController4, new AbortController());
    this.setAttribute("role", "dialog");
    if (this.shadowDomTemplate) {
      this.getShadowPartByName("overlay")?.addEventListener(
        "click",
        this.hide.bind(this),
        { signal: this.abortController.signal }
      );
      Array.from(this.shadowRoot.querySelectorAll("slot")).forEach((slot) =>
        __privateMethod(
          this,
          _updateSlotVisibility,
          updateSlotVisibility_fn
        ).call(this, slot)
      );
    }
    if (Shopify.designMode) {
      this.addEventListener(
        "shopify:block:select",
        (event) => this.show(!event.detail.load),
        { signal: this.abortController.signal }
      );
      this.addEventListener("shopify:block:deselect", this.hide, {
        signal: this.abortController.signal,
      });
      this._shopifySection =
        this._shopifySection || this.closest(".shopify-section");
      if (this._shopifySection) {
        if (this.hasAttribute("handle-editor-events")) {
          this._shopifySection.addEventListener(
            "shopify:section:select",
            (event) => this.show(!event.detail.load),
            { signal: this.abortController.signal }
          );
          this._shopifySection.addEventListener(
            "shopify:section:deselect",
            this.hide.bind(this),
            { signal: this.abortController.signal }
          );
        }
        this._shopifySection.addEventListener(
          "shopify:section:unload",
          () => this.remove(),
          { signal: this.abortController.signal }
        );
      }
    }
  }
  disconnectedCallback() {
    __privateGet(this, _delegate2).off();
    this.abortController.abort();
    this.focusTrap?.deactivate({ onDeactivate: () => {} });
    if (__privateGet(this, _isLocked)) {
      __privateSet(this, _isLocked, false);
      document.documentElement.classList.toggle("lock", --lockLayerCount > 0);
    }
  }
  /**
   * Open the dialog element (the animation can be disabled by passing false as an argument). This function should
   * normally not be directly overriden on children classes
   */
  show(animate27 = true) {
    if (this.open) {
      return Promise.resolve();
    }
    this.setAttribute("open", animate27 ? "" : "immediate");
    return waitForEvent(this, "dialog:after-show");
  }
  /**
   * Hide the dialog element. This function should normally not be directly overriden on children classes
   */
  hide() {
    if (!this.open) {
      return Promise.resolve();
    }
    this.removeAttribute("open");
    return waitForEvent(this, "dialog:after-hide");
  }
  /**
   * Get the abort controller used to clean listeners. You can retrieve it in children classes to add your own listeners
   * that will be cleaned when the element is removed or re-rendered
   */
  get abortController() {
    return __privateGet(this, _abortController4);
  }
  /**
   * Get all the elements controlling this dialog (typically, button). An element controls this dialog if it has an
   * aria-controls attribute matching the ID of this dialog element
   */
  get controls() {
    return Array.from(
      this.getRootNode().querySelectorAll(`[aria-controls="${this.id}"]`)
    );
  }
  /**
   * Returns if the dialog is open or closed
   */
  get open() {
    return this.hasAttribute("open");
  }
  /**
   * If true is returned, then FocusTrap will activate and manage all the focus management. This is required for good
   * accessibility (such as keyboard management) and should normally not be set to false in children classes unless
   * there is a very good reason to do so
   */
  get shouldTrapFocus() {
    return true;
  }
  /**
   * When the dialog focus is trapped, define if the page is lock (not scrollable). This is usually desirable on
   * full screen modals
   */
  get shouldLock() {
    return false;
  }
  /**
   * By default, when the focus is trapped on an element, a click outside the trapped element close it. Sometimes, it
   * may be desirable to turn off all interactions so that all clicks outside don't do anything
   */
  get clickOutsideDeactivates() {
    return true;
  }
  /**
   * Sometimes (especially for drawer) we need to ensure that an element is on top of everything else. To do that,
   * we need to move the element to the body. We are doing that on open, and then restore the initial position on
   * close
   */
  get shouldAppendToBody() {
    return false;
  }
  /**
   * Decide which element to focus first when the dialog focus is trapped. By default, the first focusable element
   * will be focused, but this can be overridden by passing a selector in the "initial-focus" attribute
   */
  get initialFocus() {
    return this.hasAttribute("initial-focus")
      ? this.getAttribute("initial-focus") === "false"
        ? false
        : this.querySelector(this.getAttribute("initial-focus"))
      : this.hasAttribute("tabindex")
      ? this
      : this.querySelector('input:not([type="hidden"])') || false;
  }
  /**
   * If set to true, then focus trap will not automatically scroll to the first focused element, which can cause
   * annoying experience.
   */
  get preventScrollWhenTrapped() {
    return true;
  }
  /**
   * Get the focus trap element configured with all the other attributes
   */
  get focusTrap() {
    return __privateSet(
      this,
      _focusTrap,
      __privateGet(this, _focusTrap) ||
        new FocusTrap.createFocusTrap([this, this.shadowRoot], {
          onDeactivate: this.hide.bind(this),
          allowOutsideClick: this.clickOutsideDeactivates
            ? __privateMethod(
                this,
                _allowOutsideClick,
                allowOutsideClick_fn
              ).bind(this)
            : false,
          initialFocus: matchesMediaQuery("supports-hover")
            ? this.initialFocus
            : false,
          fallbackFocus: this,
          preventScroll: this.preventScrollWhenTrapped,
        })
    );
  }
  /**
   * Get the ShadowDOM template (if any). If there is one defined, the dialog automatically constructs it with the
   * shadow DOM
   */
  get shadowDomTemplate() {
    return this.getAttribute("template");
  }
  /**
   * For dialog that use Shadow DOM, this allows a quick retrieval of parts by name
   */
  getShadowPartByName(name) {
    return this.shadowRoot?.querySelector(`[part="${name}"]`);
  }
  /**
   * Callback called when attributes changes. This is the part that glues everything
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "id":
        if (newValue) {
          __privateGet(this, _delegate2)
            .off()
            .on(
              "click",
              `[aria-controls="${this.id}"]`,
              __privateMethod(this, _onToggleClicked, onToggleClicked_fn).bind(
                this
              )
            );
        }
        break;
      case "open":
        this.controls.forEach((toggle) =>
          toggle.setAttribute(
            "aria-expanded",
            newValue === null ? "false" : "true"
          )
        );
        if (
          oldValue === null &&
          (newValue === "" || newValue === "immediate")
        ) {
          __privateSet(this, _originalParentBeforeAppend, null);
          this.style.setProperty("display", "block");
          this.dispatchEvent(new CustomEvent("dialog:before-show"));
          if (this.shouldAppendToBody && this.parentElement !== document.body) {
            __privateSet(this, _originalParentBeforeAppend, this.parentElement);
            document.body.append(this);
          }
          const animationControls = this.createEnterAnimationControls();
          if (newValue === "immediate") {
            animationControls.finish();
          }
          animationControls.finished.then(() => {
            this.dispatchEvent(new CustomEvent("dialog:after-show"));
          });
          if (this.shouldTrapFocus) {
            this.focusTrap.activate({
              checkCanFocusTrap: () => animationControls.finished,
            });
          }
          if (this.shouldLock) {
            lockLayerCount += 1;
            __privateSet(this, _isLocked, true);
            document.documentElement.classList.add("lock");
          }
        } else if (oldValue !== null && newValue === null) {
          this.dispatchEvent(new CustomEvent("dialog:before-hide"));
          const hideTransitionPromise =
            this.createLeaveAnimationControls().finished;
          hideTransitionPromise.then(() => {
            if (
              this.parentElement === document.body &&
              __privateGet(this, _originalParentBeforeAppend)
            ) {
              __privateGet(this, _originalParentBeforeAppend).appendChild(this);
              __privateSet(this, _originalParentBeforeAppend, null);
            }
            this.style.setProperty("display", "none");
            this.dispatchEvent(new CustomEvent("dialog:after-hide"));
          });
          this.focusTrap?.deactivate({
            checkCanReturnFocus: () => hideTransitionPromise,
          });
          if (this.shouldLock) {
            __privateSet(this, _isLocked, false);
            document.documentElement.classList.toggle(
              "lock",
              --lockLayerCount > 0
            );
          }
        }
        this.dispatchEvent(new CustomEvent("toggle", { bubbles: true }));
        break;
    }
  }
  /**
   * Create the animation controls for the enter animation
   */
  createEnterAnimationControls() {
    return animate4(this, {}, { duration: 0 });
  }
  /**
   * Create the animation controls for the leave animation
   */
  createLeaveAnimationControls() {
    return animate4(this, {}, { duration: 0 });
  }
  /**
   * When "clickOutsideDeactivates" is true, this method is called on the final click destination. If this method
   * returns true, then the dialog closes (if false, the dialog remains in its current state). By default, this
   * will close the dialog if a click is done outside the dialog. However, this may be overridden in children classes
   * to provide custom behavior (for instance, to only allow some elements to close the dialog)
   */
  hideForOutsideClickTarget(target) {
    return !this.contains(target);
  }
  /**
   * When "clickOutsideDeactivates" is set to true, this method allows to control which element, when clicked, allows
   * to pass-through and have its behavior being executed
   */
  allowOutsideClickForTarget(target) {
    return false;
  }
};
_isLocked = new WeakMap();
_delegate2 = new WeakMap();
_abortController4 = new WeakMap();
_focusTrap = new WeakMap();
_originalParentBeforeAppend = new WeakMap();
_allowOutsideClick = new WeakSet();
allowOutsideClick_fn = function (event) {
  if ("TouchEvent" in window && event instanceof TouchEvent) {
    return __privateMethod(
      this,
      _allowOutsideClickTouch,
      allowOutsideClickTouch_fn
    ).call(this, event);
  } else {
    return __privateMethod(
      this,
      _allowOutsideClickMouse,
      allowOutsideClickMouse_fn
    ).call(this, event);
  }
};
_allowOutsideClickTouch = new WeakSet();
allowOutsideClickTouch_fn = function (event) {
  event.target.addEventListener(
    "touchend",
    (subEvent) => {
      const endTarget = document.elementFromPoint(
        subEvent.changedTouches.item(0).clientX,
        subEvent.changedTouches.item(0).clientY
      );
      if (this.hideForOutsideClickTarget(endTarget)) {
        this.hide();
      }
    },
    { once: true, signal: this.abortController.signal }
  );
  return this.allowOutsideClickForTarget(event.target);
};
_allowOutsideClickMouse = new WeakSet();
allowOutsideClickMouse_fn = function (event) {
  if (event.type !== "click") {
    return false;
  }
  if (this.hideForOutsideClickTarget(event.target)) {
    this.hide();
  }
  if (this.allowOutsideClickForTarget(event.target)) {
    return true;
  }
  let target = event.target,
    closestControl = event.target.closest("[aria-controls]");
  if (
    closestControl &&
    closestControl.getAttribute("aria-controls") === this.id
  ) {
    target = closestControl;
  }
  return this.id !== target.getAttribute("aria-controls");
};
_onToggleClicked = new WeakSet();
onToggleClicked_fn = function (event) {
  event?.preventDefault();
  this.open ? this.hide() : this.show();
};
_updateSlotVisibility = new WeakSet();
updateSlotVisibility_fn = function (slot) {
  if (!["header", "footer"].includes(slot.name)) {
    return;
  }
  slot.parentElement.hidden =
    slot.assignedElements({ flatten: true }).length === 0;
};
var DialogCloseButton = class extends HTMLButtonElement {
  constructor() {
    super();
    this.addEventListener("click", () =>
      this.dispatchEvent(
        new CustomEvent("dialog:force-close", {
          bubbles: true,
          cancelable: true,
          composed: true,
        })
      )
    );
  }
};
if (!window.customElements.get("dialog-element")) {
  window.customElements.define("dialog-element", DialogElement);
}
if (!window.customElements.get("dialog-close-button")) {
  window.customElements.define("dialog-close-button", DialogCloseButton, {
    extends: "button",
  });
}

// js/common/overlay/drawer.js
import { timeline as timeline3 } from "vendor";

// js/common/overlay/modal.js
import { animate as animate5, timeline as timeline2 } from "vendor";
var Modal = class extends DialogElement {
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("aria-modal", "true");
  }
  get shadowDomTemplate() {
    return this.getAttribute("template") || "modal-default-template";
  }
  get shouldLock() {
    return true;
  }
  get shouldAppendToBody() {
    return true;
  }
  createEnterAnimationControls() {
    if (matchesMediaQuery("sm")) {
      return animate5(this, { opacity: [0, 1] }, { duration: 0.2 });
    } else {
      return timeline2([
        [
          this.getShadowPartByName("overlay"),
          { opacity: [0, 1] },
          { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
        ],
        [
          this.getShadowPartByName("content"),
          { transform: ["translateY(100%)", "translateY(0)"] },
          { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" },
        ],
      ]);
    }
  }
  createLeaveAnimationControls() {
    if (matchesMediaQuery("sm")) {
      return animate5(this, { opacity: [1, 0] }, { duration: 0.2 });
    } else {
      return timeline2([
        [
          this.getShadowPartByName("overlay"),
          { opacity: [1, 0] },
          { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
        ],
        [
          this.getShadowPartByName("content"),
          { transform: ["translateY(0)", "translateY(100%)"] },
          { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" },
        ],
      ]);
    }
  }
};
if (!window.customElements.get("x-modal")) {
  window.customElements.define("x-modal", Modal);
}

// js/common/overlay/drawer.js
var Drawer = class extends Modal {
  get shadowDomTemplate() {
    return this.getAttribute("template") || "drawer-default-template";
  }
  get openFrom() {
    return this.getAttribute("open-from") || "right";
  }
  createEnterAnimationControls() {
    this.getShadowPartByName("content").style.marginInlineStart =
      this.openFrom === "right" ? "auto" : 0;
    return timeline3([
      [
        this.getShadowPartByName("overlay"),
        { opacity: [0, 1] },
        { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
      ],
      [
        this.getShadowPartByName("content"),
        {
          transform: [
            `translateX(calc(var(--transform-logical-flip) * ${
              this.openFrom === "right" ? "100%" : "-100%"
            }))`,
            "translateX(0)",
          ],
        },
        { duration: 0.3, at: "<", easing: [0.645, 0.045, 0.355, 1] },
      ],
    ]);
  }
  createLeaveAnimationControls() {
    return timeline3([
      [
        this.getShadowPartByName("overlay"),
        { opacity: [1, 0] },
        { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
      ],
      [
        this.getShadowPartByName("content"),
        {
          transform: [
            "translateX(0)",
            `translateX(calc(var(--transform-logical-flip) * ${
              this.openFrom === "right" ? "100%" : "-100%"
            }))`,
          ],
        },
        { duration: 0.3, at: "<", easing: [0.645, 0.045, 0.355, 1] },
      ],
    ]);
  }
};
if (!window.customElements.get("x-drawer")) {
  window.customElements.define("x-drawer", Drawer);
}

// js/common/overlay/popin.js
import { animate as animate6 } from "vendor";
var PopIn = class extends DialogElement {
  get shouldTrapFocus() {
    return false;
  }
  createEnterAnimationControls() {
    return animate6(
      this,
      { opacity: [0, 1], transform: ["translateY(25px)", "translateY(0)"] },
      { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] }
    );
  }
  createLeaveAnimationControls() {
    return animate6(
      this,
      { opacity: [1, 0], transform: ["translateY(0)", "translateY(25px)"] },
      { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] }
    );
  }
};
if (!window.customElements.get("pop-in")) {
  window.customElements.define("pop-in", PopIn);
}

// js/common/overlay/popover.js
import { animate as animate7, timeline as timeline4 } from "vendor";
var Popover = class extends DialogElement {
  connectedCallback() {
    super.connectedCallback();
    this.controls.forEach((control) =>
      control.setAttribute("aria-haspopup", "dialog")
    );
    if (this.hasAttribute("close-on-listbox-select")) {
      this.addEventListener("listbox:select", this.hide, {
        signal: this.abortController.signal,
      });
    }
  }
  get shadowDomTemplate() {
    return this.getAttribute("template") || "popover-default-template";
  }
  get shouldLock() {
    return matchesMediaQuery("md-max");
  }
  get shouldAppendToBody() {
    return matchesMediaQuery("md-max");
  }
  get preventScrollWhenTrapped() {
    return true;
  }
  createEnterAnimationControls() {
    if (matchesMediaQuery("md")) {
      return animate7(this, { opacity: [0, 1] }, { duration: 0.2 });
    } else {
      return timeline4([
        [
          this.getShadowPartByName("overlay"),
          { opacity: [0, 1] },
          { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
        ],
        [
          this.getShadowPartByName("content"),
          { transform: ["translateY(100%)", "translateY(0)"] },
          { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" },
        ],
      ]);
    }
  }
  createLeaveAnimationControls() {
    if (matchesMediaQuery("md")) {
      return animate7(this, { opacity: [1, 0] }, { duration: 0.2 });
    } else {
      return timeline4([
        [
          this.getShadowPartByName("overlay"),
          { opacity: [1, 0] },
          { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
        ],
        [
          this.getShadowPartByName("content"),
          { transform: ["translateY(0)", "translateY(100%)"] },
          { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" },
        ],
      ]);
    }
  }
};
if (!window.customElements.get("x-popover")) {
  window.customElements.define("x-popover", Popover);
}

// js/common/facets/facets-drawer.js
var _updateFacets, updateFacets_fn;
var FacetsDrawer = class extends Drawer {
  constructor() {
    super();
    __privateAdd(this, _updateFacets);
    this.addEventListener(
      "dialog:after-hide",
      __privateMethod(this, _updateFacets, updateFacets_fn)
    );
  }
};
_updateFacets = new WeakSet();
updateFacets_fn = function () {
  const form = this.querySelector('[is="facets-form"]');
  if (HTMLFormElement.prototype.requestSubmit) {
    form?.requestSubmit();
  } else {
    form?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  }
};
if (!window.customElements.get("facets-drawer")) {
  window.customElements.define("facets-drawer", FacetsDrawer);
}

// js/common/facets/facet-link.js
var _onFacetUpdate, onFacetUpdate_fn;
var FacetLink = class extends HTMLAnchorElement {
  constructor() {
    super();
    __privateAdd(this, _onFacetUpdate);
    this.addEventListener(
      "click",
      __privateMethod(this, _onFacetUpdate, onFacetUpdate_fn).bind(this)
    );
  }
};
_onFacetUpdate = new WeakSet();
onFacetUpdate_fn = function (event) {
  event.preventDefault();
  const sectionId = extractSectionId(event.target),
    url = new URL(this.href);
  url.searchParams.set("section_id", sectionId);
  this.dispatchEvent(
    new CustomEvent("facet:update", {
      bubbles: true,
      detail: {
        url,
      },
    })
  );
};
if (!window.customElements.get("facet-link")) {
  window.customElements.define("facet-link", FacetLink, { extends: "a" });
}

// js/common/facets/facets-sort-popover.js
var _onSortChange, onSortChange_fn;
var FacetsSortPopover = class extends Popover {
  constructor() {
    super();
    __privateAdd(this, _onSortChange);
    this.addEventListener(
      "listbox:change",
      __privateMethod(this, _onSortChange, onSortChange_fn)
    );
  }
};
_onSortChange = new WeakSet();
onSortChange_fn = function (event) {
  const url = new URL(window.location.href);
  url.searchParams.set("sort_by", event.detail.value);
  url.searchParams.delete("page");
  url.searchParams.set("section_id", this.getAttribute("section-id"));
  this.dispatchEvent(
    new CustomEvent("facet:update", {
      bubbles: true,
      detail: {
        url,
      },
    })
  );
};
if (!window.customElements.get("facets-sort-popover")) {
  window.customElements.define("facets-sort-popover", FacetsSortPopover);
}

// js/common/facets/facets-listeners.js
import { Delegate as Delegate3 } from "vendor";
var abortController = null;
var delegate = new Delegate3(document.body);
var openDetailsValues = new Set(
  Array.from(
    document.querySelectorAll(
      '[is="facets-form"] details[open] input[name*="filter."]'
    ),
    (item) => item.name
  )
);
delegate.on(
  "toggle",
  '[is="facets-form"] details',
  (event, detailsElement) => {
    const inputNames = [
      ...new Set(
        Array.from(
          detailsElement.querySelectorAll('input[name*="filter."]'),
          (item) => item.name
        )
      ),
    ];
    inputNames.forEach((inputName) => {
      detailsElement.open
        ? openDetailsValues.add(inputName)
        : openDetailsValues.delete(inputName);
    });
  },
  true
);
document.addEventListener("facet:update", async (event) => {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const url = event.detail.url,
    shopifySection = document.getElementById(
      `shopify-section-${url.searchParams.get("section_id")}`
    );
  const clonedUrl = new URL(url);
  clonedUrl.searchParams.delete("section_id");
  history.replaceState({}, "", clonedUrl.toString());
  try {
    document.documentElement.dispatchEvent(
      new CustomEvent("theme:loading:start", { bubbles: true })
    );
    const tempContent = new DOMParser().parseFromString(
      await (
        await cachedFetch(url.toString(), { signal: abortController.signal })
      ).text(),
      "text/html"
    );
    document.documentElement.dispatchEvent(
      new CustomEvent("theme:loading:end", { bubbles: true })
    );
    const newShopifySection = tempContent.querySelector(".shopify-section");
    newShopifySection
      .querySelectorAll('[is="facets-form"] details')
      .forEach((detailsElement) => {
        const inputNames = [
          ...new Set(
            Array.from(
              detailsElement.querySelectorAll('input[name*="filter."]'),
              (item) => item.name
            )
          ),
        ];
        inputNames.forEach((inputName) => {
          detailsElement.open = openDetailsValues.has(inputName);
        });
      });
    shopifySection.replaceChildren(
      ...document.importNode(
        tempContent.querySelector(".shopify-section"),
        true
      ).childNodes
    );
    const scrollToProductList = () =>
      shopifySection
        .querySelector(".collection")
        .scrollIntoView({ block: "start", behavior: "smooth" });
    if ("requestIdleCallback" in window) {
      requestIdleCallback(scrollToProductList, { timeout: 500 });
    } else {
      requestAnimationFrame(scrollToProductList);
    }
  } catch (e) {}
});

// js/common/feedback/progress-bar.js
import { inView as inView5 } from "vendor";
var _allowUpdatingProgress, _calculateProgressBar, calculateProgressBar_fn;
var ProgressBar = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _calculateProgressBar);
    __privateAdd(
      this,
      _allowUpdatingProgress,
      !this.hasAttribute("animate-on-scroll")
    );
  }
  static get observedAttributes() {
    return ["aria-valuenow", "aria-valuemax"];
  }
  connectedCallback() {
    if (this.hasAttribute("animate-on-scroll")) {
      inView5(
        this,
        () => {
          __privateSet(this, _allowUpdatingProgress, true);
          __privateMethod(
            this,
            _calculateProgressBar,
            calculateProgressBar_fn
          ).call(this);
        },
        { margin: "-50px 0px" }
      );
    }
  }
  get progress() {
    return Math.min(
      1,
      this.getAttribute("aria-valuenow") / this.getAttribute("aria-valuemax")
    );
  }
  set valueMax(value) {
    this.setAttribute("aria-valuemax", value);
  }
  set valueNow(value) {
    this.setAttribute("aria-valuenow", value);
  }
  attributeChangedCallback() {
    if (__privateGet(this, _allowUpdatingProgress)) {
      __privateMethod(
        this,
        _calculateProgressBar,
        calculateProgressBar_fn
      ).call(this);
    }
  }
};
_allowUpdatingProgress = new WeakMap();
_calculateProgressBar = new WeakSet();
calculateProgressBar_fn = function () {
  this.style.setProperty("--progress", `${this.progress}`);
};
if (!window.customElements.get("progress-bar")) {
  window.customElements.define("progress-bar", ProgressBar);
}

// js/common/form/price-range.js
var PriceRange = class extends HTMLElement {
  #abortController;
  connectedCallback() {
    this.#abortController = new AbortController();
    const rangeLowerBound = this.querySelector(
        'input[type="range"]:first-child'
      ),
      rangeHigherBound = this.querySelector('input[type="range"]:last-child'),
      textInputLowerBound = this.querySelector(
        'input[name="filter.v.price.gte"]'
      ),
      textInputHigherBound = this.querySelector(
        'input[name="filter.v.price.lte"]'
      );
    textInputLowerBound.addEventListener(
      "focus",
      () => textInputLowerBound.select(),
      { signal: this.#abortController.signal }
    );
    textInputHigherBound.addEventListener(
      "focus",
      () => textInputHigherBound.select(),
      { signal: this.#abortController.signal }
    );
    textInputLowerBound.addEventListener(
      "change",
      (event) => {
        event.preventDefault();
        event.target.value = Math.max(
          Math.min(
            parseInt(event.target.value),
            parseInt(textInputHigherBound.value || event.target.max) - 1
          ),
          event.target.min
        );
        rangeLowerBound.value = event.target.value;
        rangeLowerBound.parentElement.style.setProperty(
          "--range-min",
          `${
            (parseInt(rangeLowerBound.value) / parseInt(rangeLowerBound.max)) *
            100
          }%`
        );
      },
      { signal: this.#abortController.signal }
    );
    textInputHigherBound.addEventListener(
      "change",
      (event) => {
        event.preventDefault();
        event.target.value = Math.min(
          Math.max(
            parseInt(event.target.value),
            parseInt(textInputLowerBound.value || event.target.min) + 1
          ),
          event.target.max
        );
        rangeHigherBound.value = event.target.value;
        rangeHigherBound.parentElement.style.setProperty(
          "--range-max",
          `${
            (parseInt(rangeHigherBound.value) /
              parseInt(rangeHigherBound.max)) *
            100
          }%`
        );
      },
      { signal: this.#abortController.signal }
    );
    rangeLowerBound.addEventListener(
      "change",
      (event) => {
        event.stopPropagation();
        textInputLowerBound.value = event.target.value;
        textInputLowerBound.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      },
      { signal: this.#abortController.signal }
    );
    rangeHigherBound.addEventListener(
      "change",
      (event) => {
        event.stopPropagation();
        textInputHigherBound.value = event.target.value;
        textInputHigherBound.dispatchEvent(
          new Event("change", { bubbles: true })
        );
      },
      { signal: this.#abortController.signal }
    );
    rangeLowerBound.addEventListener(
      "input",
      (event) => {
        event.target.value = Math.min(
          parseInt(event.target.value),
          parseInt(textInputHigherBound.value || event.target.max) - 1
        );
        event.target.parentElement.style.setProperty(
          "--range-min",
          `${
            (parseInt(event.target.value) / parseInt(event.target.max)) * 100
          }%`
        );
        textInputLowerBound.value = event.target.value;
      },
      { signal: this.#abortController.signal }
    );
    rangeHigherBound.addEventListener(
      "input",
      (event) => {
        event.target.value = Math.max(
          parseInt(event.target.value),
          parseInt(textInputLowerBound.value || event.target.min) + 1
        );
        event.target.parentElement.style.setProperty(
          "--range-max",
          `${
            (parseInt(event.target.value) / parseInt(event.target.max)) * 100
          }%`
        );
        textInputHigherBound.value = event.target.value;
      },
      { signal: this.#abortController.signal }
    );
  }
  disconnectedCallback() {
    this.#abortController.abort();
  }
};
if (!window.customElements.get("price-range")) {
  window.customElements.define("price-range", PriceRange);
}

// js/common/form/quantity-selector.js
var _abortController5,
  _decreaseButton,
  _increaseButton,
  _inputElement,
  _onDecreaseQuantity,
  onDecreaseQuantity_fn,
  _onIncreaseQuantity,
  onIncreaseQuantity_fn,
  _onVariantChangedListener,
  onVariantChangedListener_fn,
  _updateUI,
  updateUI_fn;
var QuantitySelector = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onDecreaseQuantity);
    __privateAdd(this, _onIncreaseQuantity);
    __privateAdd(this, _onVariantChangedListener);
    __privateAdd(this, _updateUI);
    __privateAdd(this, _abortController5, void 0);
    __privateAdd(this, _decreaseButton, void 0);
    __privateAdd(this, _increaseButton, void 0);
    __privateAdd(this, _inputElement, void 0);
  }
  connectedCallback() {
    __privateSet(this, _abortController5, new AbortController());
    __privateSet(
      this,
      _decreaseButton,
      this.querySelector("button:first-of-type")
    );
    __privateSet(
      this,
      _increaseButton,
      this.querySelector("button:last-of-type")
    );
    __privateSet(this, _inputElement, this.querySelector("input"));
    __privateGet(this, _decreaseButton)?.addEventListener(
      "click",
      __privateMethod(this, _onDecreaseQuantity, onDecreaseQuantity_fn).bind(
        this
      ),
      { signal: __privateGet(this, _abortController5).signal }
    );
    __privateGet(this, _increaseButton)?.addEventListener(
      "click",
      __privateMethod(this, _onIncreaseQuantity, onIncreaseQuantity_fn).bind(
        this
      ),
      { signal: __privateGet(this, _abortController5).signal }
    );
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateMethod(
        this,
        _onVariantChangedListener,
        onVariantChangedListener_fn
      ).bind(this),
      { signal: __privateGet(this, _abortController5).signal }
    );
  }
  disconnectedCallback() {
    __privateGet(this, _abortController5).abort();
  }
};
_abortController5 = new WeakMap();
_decreaseButton = new WeakMap();
_increaseButton = new WeakMap();
_inputElement = new WeakMap();
_onDecreaseQuantity = new WeakSet();
onDecreaseQuantity_fn = function () {
  __privateGet(this, _inputElement).stepDown();
  __privateMethod(this, _updateUI, updateUI_fn).call(this);
};
_onIncreaseQuantity = new WeakSet();
onIncreaseQuantity_fn = function () {
  __privateGet(this, _inputElement).stepUp();
  __privateMethod(this, _updateUI, updateUI_fn).call(this);
};
_onVariantChangedListener = new WeakSet();
onVariantChangedListener_fn = function (event) {
  __privateGet(this, _inputElement).updateVariantRule(event.detail.variant);
};
_updateUI = new WeakSet();
updateUI_fn = function () {
  __privateGet(this, _decreaseButton).disabled =
    __privateGet(this, _inputElement).quantity <= 1;
};
var _onValueInput, onValueInput_fn;
var QuantityInput = class extends HTMLInputElement {
  constructor() {
    super();
    __privateAdd(this, _onValueInput);
    this.addEventListener(
      "input",
      __privateMethod(this, _onValueInput, onValueInput_fn)
    );
    this.addEventListener("focus", this.select);
  }
  connectedCallback() {
    this.style.setProperty(
      "--quantity-selector-character-count",
      `${this.value.length}ch`
    );
  }
  get quantity() {
    return parseInt(this.value);
  }
  updateVariantRule(variant) {}
};
_onValueInput = new WeakSet();
onValueInput_fn = function () {
  if (this.value === "") {
    this.value = this.min || 1;
  }
  this.style.setProperty(
    "--quantity-selector-character-count",
    `${this.value.length}ch`
  );
};
if (!window.customElements.get("quantity-selector")) {
  window.customElements.define("quantity-selector", QuantitySelector);
}
if (!window.customElements.get("quantity-input")) {
  window.customElements.define("quantity-input", QuantityInput, {
    extends: "input",
  });
}

// js/common/form/resizable-textarea.js
var _onInput, onInput_fn;
var ResizableTextarea = class extends HTMLTextAreaElement {
  constructor() {
    super();
    __privateAdd(this, _onInput);
    this.addEventListener("input", __privateMethod(this, _onInput, onInput_fn));
  }
};
_onInput = new WeakSet();
onInput_fn = function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + 2 + "px";
};
if (!window.customElements.get("resizable-textarea")) {
  window.customElements.define("resizable-textarea", ResizableTextarea, {
    extends: "textarea",
  });
}

// js/common/list/listbox.js
var _accessibilityInitialized,
  _hiddenInput,
  _setupAccessibility,
  setupAccessibility_fn,
  _onOptionClicked,
  onOptionClicked_fn,
  _onInputChanged,
  onInputChanged_fn,
  _onKeyDown,
  onKeyDown_fn;
var Listbox = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _setupAccessibility);
    __privateAdd(this, _onOptionClicked);
    __privateAdd(this, _onInputChanged);
    __privateAdd(this, _onKeyDown);
    __privateAdd(this, _accessibilityInitialized, false);
    __privateAdd(this, _hiddenInput, void 0);
    this.addEventListener(
      "keydown",
      __privateMethod(this, _onKeyDown, onKeyDown_fn)
    );
  }
  static get observedAttributes() {
    return ["aria-activedescendant"];
  }
  connectedCallback() {
    __privateSet(
      this,
      _hiddenInput,
      this.querySelector('input[type="hidden"]')
    );
    __privateGet(this, _hiddenInput)?.addEventListener(
      "change",
      __privateMethod(this, _onInputChanged, onInputChanged_fn).bind(this)
    );
    if (!__privateGet(this, _accessibilityInitialized)) {
      requestAnimationFrame(
        __privateMethod(this, _setupAccessibility, setupAccessibility_fn).bind(
          this
        )
      );
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (
      name === "aria-activedescendant" &&
      oldValue !== null &&
      newValue !== oldValue
    ) {
      Array.from(this.querySelectorAll('[role="option"]')).forEach((option) => {
        if (option.id === newValue) {
          option.setAttribute("aria-selected", "true");
          if (
            __privateGet(this, _hiddenInput) &&
            __privateGet(this, _hiddenInput).value !== option.value
          ) {
            __privateGet(this, _hiddenInput).value = option.value;
            __privateGet(this, _hiddenInput).dispatchEvent(
              new Event("change", { bubbles: true })
            );
          }
          if (this.hasAttribute("aria-owns")) {
            this.getAttribute("aria-owns")
              .split(" ")
              .forEach((boundId) => {
                document.getElementById(boundId).textContent =
                  option.getAttribute("title") ||
                  option.innerText ||
                  option.value;
              });
          }
          option.dispatchEvent(
            new CustomEvent("listbox:change", {
              bubbles: true,
              detail: {
                value: option.value,
              },
            })
          );
        } else {
          option.setAttribute("aria-selected", "false");
        }
      });
    }
  }
};
_accessibilityInitialized = new WeakMap();
_hiddenInput = new WeakMap();
_setupAccessibility = new WeakSet();
setupAccessibility_fn = function () {
  this.setAttribute("role", "listbox");
  Array.from(this.querySelectorAll('[role="option"]')).forEach((option) => {
    option.addEventListener(
      "click",
      __privateMethod(this, _onOptionClicked, onOptionClicked_fn).bind(this)
    );
    option.id =
      "option-" +
      (crypto.randomUUID
        ? crypto.randomUUID()
        : Math.floor(Math.random() * 1e4));
    if (option.getAttribute("aria-selected") === "true") {
      this.setAttribute("aria-activedescendant", option.id);
    }
  });
  __privateSet(this, _accessibilityInitialized, true);
};
_onOptionClicked = new WeakSet();
onOptionClicked_fn = function (event) {
  if (event.currentTarget.getAttribute("type") === "submit") {
    return;
  }
  this.setAttribute("aria-activedescendant", event.currentTarget.id);
  event.currentTarget.dispatchEvent(
    new CustomEvent("listbox:select", {
      bubbles: true,
      detail: {
        value: event.currentTarget.value,
      },
    })
  );
};
_onInputChanged = new WeakSet();
onInputChanged_fn = function (event) {
  this.setAttribute(
    "aria-activedescendant",
    this.querySelector(
      `[role="option"][value="${CSS.escape(event.target.value)}"]`
    ).id
  );
};
_onKeyDown = new WeakSet();
onKeyDown_fn = function (event) {
  if (event.key === "ArrowUp") {
    event.target.previousElementSibling?.focus();
    event.preventDefault();
  } else if (event.key === "ArrowDown") {
    event.target.nextElementSibling?.focus();
    event.preventDefault();
  }
};
if (!window.customElements.get("x-listbox")) {
  window.customElements.define("x-listbox", Listbox);
}

// js/common/media/image-parallax.js
import { scroll, animate as animate8 } from "vendor";
var _setupParallax, setupParallax_fn, _getFirstParent, getFirstParent_fn;
var ImageParallax = class extends HTMLImageElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _setupParallax);
    __privateAdd(this, _getFirstParent);
  }
  connectedCallback() {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      __privateMethod(this, _setupParallax, setupParallax_fn).call(this);
    }
  }
};
_setupParallax = new WeakSet();
setupParallax_fn = function () {
  const [scale, translate] = [1.3, (0.15 * 100) / 1.3],
    isFirstSection = this.closest(".shopify-section").matches(":first-child");
  if (window.ScrollTimeline) {
    this.animate(
      {
        transform: [
          `scale(${scale}) translateY(-${translate}%)`,
          `scale(${scale}) translateY(${translate}%)`,
        ],
      },
      {
        fill: "forwards",
        timeline: new ViewTimeline({
          subject: __privateMethod(
            this,
            _getFirstParent,
            getFirstParent_fn
          ).call(this, this),
          axis: "block",
        }),
        rangeStart: isFirstSection ? "exit-crossing 0%" : "cover 0%",
        rangeEnd: "cover 100%",
      }
    );
  } else {
    scroll(
      animate8(
        this,
        {
          transform: [
            `scale(${scale}) translateY(-${translate}%)`,
            `scale(${scale}) translateY(${translate}%)`,
          ],
        },
        { easing: "linear" }
      ),
      {
        target: this,
        offset: [isFirstSection ? "start start" : "start end", "end start"],
      }
    );
  }
};
_getFirstParent = new WeakSet();
getFirstParent_fn = function (element) {
  const parent = element.parentElement;
  if (parent.clientHeight > 0) {
    return parent;
  } else {
    return __privateMethod(this, _getFirstParent, getFirstParent_fn).call(
      this,
      parent
    );
  }
};
if (!window.customElements.get("image-parallax")) {
  window.customElements.define("image-parallax", ImageParallax, {
    extends: "img",
  });
}

// js/common/product/gift-card-recipient.js
var _recipientCheckbox,
  _recipientOtherProperties,
  _recipientSendOnProperty,
  _offsetProperty,
  _recipientFieldsContainer,
  _synchronizeProperties,
  synchronizeProperties_fn,
  _formatDate,
  formatDate_fn;
var GiftCardRecipient = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _synchronizeProperties);
    __privateAdd(this, _formatDate);
    __privateAdd(this, _recipientCheckbox, void 0);
    __privateAdd(this, _recipientOtherProperties, []);
    __privateAdd(this, _recipientSendOnProperty, void 0);
    __privateAdd(this, _offsetProperty, void 0);
    __privateAdd(this, _recipientFieldsContainer, void 0);
  }
  connectedCallback() {
    const properties = Array.from(
        this.querySelectorAll('[name*="properties"]')
      ),
      checkboxPropertyName =
        "properties[__shopify_send_gift_card_to_recipient]";
    __privateSet(
      this,
      _recipientCheckbox,
      properties.find((input) => input.name === checkboxPropertyName)
    );
    __privateSet(
      this,
      _recipientOtherProperties,
      properties.filter((input) => input.name !== checkboxPropertyName)
    );
    __privateSet(
      this,
      _recipientFieldsContainer,
      this.querySelector(".gift-card-recipient__fields")
    );
    __privateSet(
      this,
      _offsetProperty,
      this.querySelector('[name="properties[__shopify_offset]"]')
    );
    if (__privateGet(this, _offsetProperty)) {
      __privateGet(this, _offsetProperty).value = /* @__PURE__ */ new Date()
        .getTimezoneOffset()
        .toString();
    }
    __privateSet(
      this,
      _recipientSendOnProperty,
      this.querySelector('[name="properties[Send on]"]')
    );
    const minDate = /* @__PURE__ */ new Date();
    const maxDate = /* @__PURE__ */ new Date();
    maxDate.setDate(minDate.getDate() + 90);
    __privateGet(this, _recipientSendOnProperty)?.setAttribute(
      "min",
      __privateMethod(this, _formatDate, formatDate_fn).call(this, minDate)
    );
    __privateGet(this, _recipientSendOnProperty)?.setAttribute(
      "max",
      __privateMethod(this, _formatDate, formatDate_fn).call(this, maxDate)
    );
    __privateGet(this, _recipientCheckbox)?.addEventListener(
      "change",
      __privateMethod(
        this,
        _synchronizeProperties,
        synchronizeProperties_fn
      ).bind(this)
    );
    __privateMethod(
      this,
      _synchronizeProperties,
      synchronizeProperties_fn
    ).call(this);
  }
};
_recipientCheckbox = new WeakMap();
_recipientOtherProperties = new WeakMap();
_recipientSendOnProperty = new WeakMap();
_offsetProperty = new WeakMap();
_recipientFieldsContainer = new WeakMap();
_synchronizeProperties = new WeakSet();
synchronizeProperties_fn = function () {
  __privateGet(this, _recipientOtherProperties).forEach(
    (property) =>
      (property.disabled = !__privateGet(this, _recipientCheckbox).checked)
  );
  __privateGet(this, _recipientFieldsContainer).classList.toggle(
    "js:hidden",
    !__privateGet(this, _recipientCheckbox).checked
  );
};
_formatDate = new WeakSet();
formatDate_fn = function (date) {
  const offset = date.getTimezoneOffset();
  const offsetDate = new Date(date.getTime() - offset * 60 * 1e3);
  return offsetDate.toISOString().split("T")[0];
};
if (!window.customElements.get("gift-card-recipient")) {
  window.customElements.define("gift-card-recipient", GiftCardRecipient);
}

// js/common/product/product-card.js
import { Delegate as Delegate4 } from "vendor";
var _delegate3,
  _onSwatchHovered,
  onSwatchHovered_fn,
  _onSwatchChanged,
  onSwatchChanged_fn,
  _createMediaImg,
  createMediaImg_fn,
  _getMatchingVariant,
  getMatchingVariant_fn;
var ProductCard = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _onSwatchHovered);
    __privateAdd(this, _onSwatchChanged);
    __privateAdd(this, _createMediaImg);
    __privateAdd(this, _getMatchingVariant);
    __privateAdd(this, _delegate3, new Delegate4(this));
    if (this.querySelectorAll('[type="radio"]').length > 0) {
      this.addEventListener(
        "pointerover",
        () => ProductLoader.load(this.getAttribute("handle")),
        { once: true }
      );
    }
  }
  connectedCallback() {
    __privateGet(this, _delegate3).on(
      "change",
      '.product-card__info [type="radio"]',
      __privateMethod(this, _onSwatchChanged, onSwatchChanged_fn).bind(this)
    );
    __privateGet(this, _delegate3).on(
      "pointerover",
      '.product-card__info [type="radio"] + label',
      __privateMethod(this, _onSwatchHovered, onSwatchHovered_fn).bind(this),
      true
    );
  }
  disconnectedCallback() {
    __privateGet(this, _delegate3).off();
  }
};
_delegate3 = new WeakMap();
_onSwatchHovered = new WeakSet();
onSwatchHovered_fn = async function (event, target) {
  const firstMatchingVariant = await __privateMethod(
      this,
      _getMatchingVariant,
      getMatchingVariant_fn
    ).call(this, target.control),
    primaryMediaElement = this.querySelector(".product-card__image--primary");
  if (firstMatchingVariant.hasOwnProperty("featured_media")) {
    __privateMethod(this, _createMediaImg, createMediaImg_fn).call(
      this,
      firstMatchingVariant["featured_media"],
      primaryMediaElement.className,
      primaryMediaElement.sizes
    );
  }
};
_onSwatchChanged = new WeakSet();
onSwatchChanged_fn = async function (event, target) {
  const firstMatchingVariant = await __privateMethod(
    this,
    _getMatchingVariant,
    getMatchingVariant_fn
  ).call(this, target);
  this.querySelectorAll(`a[href^="${this.product["url"]}"`).forEach((link) => {
    const url = new URL(link.href);
    url.searchParams.set("variant", firstMatchingVariant["id"]);
    link.href = `${url.pathname}${url.search}${url.hash}`;
  });
  if (!firstMatchingVariant.hasOwnProperty("featured_media")) {
    return;
  }
  const primaryMediaElement = this.querySelector(
      ".product-card__image--primary"
    ),
    secondaryMediaElement = this.querySelector(
      ".product-card__image--secondary"
    ),
    newPrimaryMediaElement = __privateMethod(
      this,
      _createMediaImg,
      createMediaImg_fn
    ).call(
      this,
      firstMatchingVariant["featured_media"],
      primaryMediaElement.className,
      primaryMediaElement.sizes
    );
  if (primaryMediaElement.src !== newPrimaryMediaElement.src) {
    if (secondaryMediaElement) {
      secondaryMediaElement.replaceWith(
        __privateMethod(this, _createMediaImg, createMediaImg_fn).call(
          this,
          this.product["media"][
            firstMatchingVariant["featured_media"]["position"]
          ] || this.product["media"][1],
          secondaryMediaElement.className,
          secondaryMediaElement.sizes
        )
      );
    }
    await primaryMediaElement.animate(
      { opacity: [1, 0] },
      { duration: 150, easing: "ease-in", fill: "forwards" }
    ).finished;
    await new Promise((resolve) =>
      newPrimaryMediaElement.complete
        ? resolve()
        : (newPrimaryMediaElement.onload = () => resolve())
    );
    primaryMediaElement.replaceWith(newPrimaryMediaElement);
    newPrimaryMediaElement.animate(
      { opacity: [0, 1] },
      { duration: 150, easing: "ease-in" }
    );
  }
};
_createMediaImg = new WeakSet();
createMediaImg_fn = function (media, className, sizes) {
  return createMediaImg(
    media,
    [200, 300, 400, 500, 600, 700, 800, 1e3, 1200, 1400, 1600, 1800],
    { class: className, sizes }
  );
};
_getMatchingVariant = new WeakSet();
getMatchingVariant_fn = async function (target) {
  // for checking size variant 5.8.2024

  // this.product = await ProductLoader.load(this.getAttribute("handle"));
  // return this.product["variants"].find((variant) => variant[`option${target.closest("[data-option-position]").getAttribute("data-option-position")}`] === target.value);
  this.product = await ProductLoader.load(this.getAttribute("handle"));
  var size_value = target.closest("[data-option-position-size]")
    ? target
        .closest("[data-option-position-size]")
        .getAttribute("data-option-position-size")
    : null;
  if (size_value == null) {
    return this.product["variants"].find(
      (variant) =>
        variant[
          `option${target
            .closest("[data-option-position]")
            .getAttribute("data-option-position")}`
        ] === target.value
    );
  } else {
    var var_obj;
    this.product["variants"].find((variant) => {
      if (variant.title.indexOf(size_value) > -1) {
        if (
          variant[
            `option${target
              .closest("[data-option-position]")
              .getAttribute("data-option-position")}`
          ] === target.value
        ) {
          var_obj = variant;
        }
      }
    });
    return var_obj;
  }
};
if (!window.customElements.get("product-card")) {
  window.customElements.define("product-card", ProductCard);
}

// js/common/product/product-form.js
var _onSubmit, onSubmit_fn;
var ProductForm = class extends HTMLFormElement {
  constructor() {
    super();
    __privateAdd(this, _onSubmit);
    this.addEventListener(
      "submit",
      __privateMethod(this, _onSubmit, onSubmit_fn)
    );
  }
  connectedCallback() {
    this.id.disabled = false;
  }
};
_onSubmit = new WeakSet();
onSubmit_fn = async function (event) {
  event.preventDefault();
  if (!this.checkValidity()) {
    this.reportValidity();
    return;
  }
  const submitButtons = Array.from(this.elements).filter(
    (button) => button.type === "submit"
  );
  submitButtons.forEach((submitButton) => {
    submitButton.setAttribute("disabled", "disabled");
    submitButton.setAttribute("aria-busy", "true");
  });
  document.documentElement.dispatchEvent(
    new CustomEvent("theme:loading:start", { bubbles: true })
  );
  let sectionsToBundle = [];
  document.documentElement.dispatchEvent(
    new CustomEvent("cart:prepare-bundled-sections", {
      bubbles: true,
      detail: { sections: sectionsToBundle },
    })
  );
  const formData = new FormData(this);
  formData.set("sections", sectionsToBundle.join(","));
  formData.set(
    "sections_url",
    `${Shopify.routes.root}variants/${this.id.value}`
  );
  const response = await fetch(`${Shopify.routes.root}cart/add.js`, {
    body: formData,
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      // Needed for Shopify to check inventory
    },
  });
  submitButtons.forEach((submitButton) => {
    submitButton.removeAttribute("disabled");
    submitButton.removeAttribute("aria-busy");
  });
  const responseJson = await response.json();
  document.documentElement.dispatchEvent(
    new CustomEvent("theme:loading:end", { bubbles: true })
  );
  if (response.ok) {
    if (
      window.themeVariables.settings.cartType === "page" ||
      window.themeVariables.settings.pageType === "cart"
    ) {
      return (window.location.href = `${Shopify.routes.root}cart`);
    }
    const cartContent = await (
      await fetch(`${Shopify.routes.root}cart.js`)
    ).json();
    cartContent["sections"] = responseJson["sections"];
    this.dispatchEvent(
      new CustomEvent("variant:add", {
        bubbles: true,
        detail: {
          items: responseJson.hasOwnProperty("items")
            ? responseJson["items"]
            : [responseJson],
          cart: cartContent,
          onSuccessDo: formData.get("on_success"),
        },
      })
    );
    document.documentElement.dispatchEvent(
      new CustomEvent("cart:change", {
        bubbles: true,
        detail: {
          baseEvent: "variant:add",
          onSuccessDo: formData.get("on_success"),
          cart: cartContent,
        },
      })
    );
  } else {
    this.dispatchEvent(
      new CustomEvent("cart:error", {
        bubbles: true,
        detail: {
          error: responseJson["description"],
        },
      })
    );
    document.dispatchEvent(new CustomEvent("cart:refresh"));
  }
};
if (!window.customElements.get("product-form")) {
  window.customElements.define("product-form", ProductForm, {
    extends: "form",
  });
}

// js/common/product/product-form-listeners.js
var _onVariantChangedListener2,
  _onVariantAddedListener,
  _onCartErrorListener,
  _onVariantChanged,
  onVariantChanged_fn,
  _onVariantAdded,
  onVariantAdded_fn,
  _onCartError,
  onCartError_fn;
var BuyButtons = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged);
    __privateAdd(this, _onVariantAdded);
    __privateAdd(this, _onCartError);
    __privateAdd(
      this,
      _onVariantChangedListener2,
      __privateMethod(this, _onVariantChanged, onVariantChanged_fn).bind(this)
    );
    __privateAdd(
      this,
      _onVariantAddedListener,
      __privateMethod(this, _onVariantAdded, onVariantAdded_fn).bind(this)
    );
    __privateAdd(
      this,
      _onCartErrorListener,
      __privateMethod(this, _onCartError, onCartError_fn).bind(this)
    );
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener2)
    );
    document.forms[this.getAttribute("form")]?.addEventListener(
      "cart:error",
      __privateGet(this, _onCartErrorListener)
    );
    if (window.themeVariables.settings.cartType === "message") {
      document.forms[this.getAttribute("form")]?.addEventListener(
        "variant:add",
        __privateGet(this, _onVariantAddedListener)
      );
    }
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener2)
    );
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "cart:error",
      __privateGet(this, _onCartErrorListener)
    );
  }
};
_onVariantChangedListener2 = new WeakMap();
_onVariantAddedListener = new WeakMap();
_onCartErrorListener = new WeakMap();
_onVariantChanged = new WeakSet();
onVariantChanged_fn = function (event) {
  const addToCartButton = this.querySelector('button[type="submit"]'),
    paymentButton = this.querySelector(".shopify-payment-button");
  addToCartButton.disabled =
    !event.detail.variant || !event.detail.variant["available"];
  if (!event.detail.variant) {
    addToCartButton.innerHTML = window.themeVariables.strings.unavailableButton;
    if (paymentButton) {
      paymentButton.style.display = "none";
    }
  } else {
    addToCartButton.innerHTML = event.detail.variant["available"]
      ? this.getAttribute("template").includes("pre-order")
        ? window.themeVariables.strings.preOrderButton
        : window.themeVariables.strings.addToCartButton
      : window.themeVariables.strings.soldOutButton;
    if (paymentButton) {
      paymentButton.style.display = event.detail.variant["available"]
        ? "block"
        : "none";
    }
  }
};
_onVariantAdded = new WeakSet();
onVariantAdded_fn = function (event) {
  const bannerElement = document.createRange().createContextualFragment(`
      <div class="banner banner--success" role="alert">
        ${window.themeVariables.strings.addedToCart}
      </div>
    `).firstElementChild;
  this.prepend(bannerElement);
  setTimeout(() => {
    bannerElement.remove();
  }, 2500);
};
_onCartError = new WeakSet();
onCartError_fn = function (event) {
  const bannerElement = document.createRange().createContextualFragment(`
      <div class="banner banner--error" role="alert">
        ${event.detail.error}
      </div>
    `).firstElementChild;
  this.prepend(bannerElement);
  setTimeout(() => {
    bannerElement.remove();
  }, 2500);
};
if (!window.customElements.get("buy-buttons")) {
  window.customElements.define("buy-buttons", BuyButtons);
}
var _onVariantChangedListener3,
  _sizesAttribute,
  _classAttribute,
  _widths,
  widths_get,
  _onVariantChanged2,
  onVariantChanged_fn2;
var VariantMedia = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _widths);
    __privateAdd(this, _onVariantChanged2);
    __privateAdd(
      this,
      _onVariantChangedListener3,
      __privateMethod(this, _onVariantChanged2, onVariantChanged_fn2).bind(this)
    );
    __privateAdd(this, _sizesAttribute, void 0);
    __privateAdd(this, _classAttribute, void 0);
  }
  connectedCallback() {
    __privateSet(this, _sizesAttribute, this.querySelector("img").sizes);
    __privateSet(this, _classAttribute, this.querySelector("img").className);
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener3)
    );
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener3)
    );
  }
};
_onVariantChangedListener3 = new WeakMap();
_sizesAttribute = new WeakMap();
_classAttribute = new WeakMap();
_widths = new WeakSet();
widths_get = function () {
  return this.getAttribute("widths")
    .split(",")
    .map((width) => parseInt(width));
};
_onVariantChanged2 = new WeakSet();
onVariantChanged_fn2 = function (event) {
  if (!event.detail.variant || !event.detail.variant["featured_media"]) {
    return;
  }
  this.replaceChildren(
    createMediaImg(
      event.detail.variant["featured_media"],
      __privateGet(this, _widths, widths_get),
      {
        class: __privateGet(this, _classAttribute),
        sizes: __privateGet(this, _sizesAttribute),
      }
    )
  );
};
if (!window.customElements.get("variant-media")) {
  window.customElements.define("variant-media", VariantMedia);
}
var _onVariantChangedListener4, _onVariantChanged3, onVariantChanged_fn3;
var PaymentTerms = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged3);
    __privateAdd(
      this,
      _onVariantChangedListener4,
      __privateMethod(this, _onVariantChanged3, onVariantChanged_fn3).bind(this)
    );
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener4)
    );
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener4)
    );
  }
};
_onVariantChangedListener4 = new WeakMap();
_onVariantChanged3 = new WeakSet();
onVariantChanged_fn3 = function (event) {
  if (event.detail.variant) {
    const element = this.querySelector('[name="id"]');
    element.value = event.detail.variant["id"];
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }
};
if (!window.customElements.get("payment-terms")) {
  window.customElements.define("payment-terms", PaymentTerms);
}
var _onVariantChangedListener5, _onVariantChanged4, onVariantChanged_fn4;
var PickupAvailability = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged4);
    __privateAdd(
      this,
      _onVariantChangedListener5,
      __privateMethod(this, _onVariantChanged4, onVariantChanged_fn4).bind(this)
    );
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener5)
    );
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener5)
    );
  }
};
_onVariantChangedListener5 = new WeakMap();
_onVariantChanged4 = new WeakSet();
onVariantChanged_fn4 = async function (event) {
  if (!event.detail.variant) {
    this.innerHTML = "";
  } else {
    const element = document.createElement("div");
    element.innerHTML = await (
      await fetch(
        `${Shopify.routes.root}variants/${event.detail.variant["id"]}?section_id=pickup-availability`
      )
    ).text();
    this.replaceChildren(
      ...element.querySelector("pickup-availability").childNodes
    );
  }
};
if (!window.customElements.get("pickup-availability")) {
  window.customElements.define("pickup-availability", PickupAvailability);
}
var currencyFormat = window.themeVariables.settings.currencyCodeEnabled
  ? window.themeVariables.settings.moneyWithCurrencyFormat
  : window.themeVariables.settings.moneyFormat;
var _onVariantChangedListener6, _onVariantChanged5, onVariantChanged_fn5;
var SalePrice = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged5);
    __privateAdd(
      this,
      _onVariantChangedListener6,
      __privateMethod(this, _onVariantChanged5, onVariantChanged_fn5).bind(this)
    );
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener6)
    );
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener6)
    );
  }
};
_onVariantChangedListener6 = new WeakMap();
_onVariantChanged5 = new WeakSet();
onVariantChanged_fn5 = function (event) {
  const variant = event.detail.variant;
  this.lastChild.replaceWith(
    document
      .createRange()
      .createContextualFragment(formatMoney(variant["price"], currencyFormat))
  );
  this.classList.toggle(
    "text-on-sale",
    variant["compare_at_price"] > variant["price"]
  );
};
var _onVariantChangedListener7, _onVariantChanged6, onVariantChanged_fn6;
var CompareAtPrice = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged6);
    __privateAdd(
      this,
      _onVariantChangedListener7,
      __privateMethod(this, _onVariantChanged6, onVariantChanged_fn6).bind(this)
    );
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener7)
    );
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener7)
    );
  }
};
_onVariantChangedListener7 = new WeakMap();
_onVariantChanged6 = new WeakSet();
onVariantChanged_fn6 = function (event) {
  const variant = event.detail.variant;
  this.lastChild.replaceWith(
    document
      .createRange()
      .createContextualFragment(
        formatMoney(variant["compare_at_price"], currencyFormat)
      )
  );
  this.hidden = !(variant["compare_at_price"] > variant["price"]);
};
var _onVariantChangedListener8, _onVariantChanged7, onVariantChanged_fn7;
var UnitPrice = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged7);
    __privateAdd(
      this,
      _onVariantChangedListener8,
      __privateMethod(this, _onVariantChanged7, onVariantChanged_fn7).bind(this)
    );
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener8)
    );
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener8)
    );
  }
};
_onVariantChangedListener8 = new WeakMap();
_onVariantChanged7 = new WeakSet();
onVariantChanged_fn7 = function (event) {
  const variant = event.detail.variant;
  if (!variant["unit_price"]) {
    return (this.hidden = true);
  }
  const referenceValue =
    variant["unit_price_measurement"]["reference_value"] !== 1
      ? variant["unit_price_measurement"]["reference_value"]
      : "";
  const node = document
    .createRange()
    .createContextualFragment(
      `${formatMoney(variant["unit_price"])}/${referenceValue}${
        variant["unit_price_measurement"]["reference_unit"]
      }`
    );
  this.lastChild.replaceWith(node);
  this.hidden = false;
};
if (!window.customElements.get("sale-price")) {
  window.customElements.define("sale-price", SalePrice);
}
if (!window.customElements.get("compare-at-price")) {
  window.customElements.define("compare-at-price", CompareAtPrice);
}
if (!window.customElements.get("unit-price")) {
  window.customElements.define("unit-price", UnitPrice);
}
var _onVariantChangedListener9, _onVariantChanged8, onVariantChanged_fn8;
var SoldOutBadge = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged8);
    __privateAdd(
      this,
      _onVariantChangedListener9,
      __privateMethod(this, _onVariantChanged8, onVariantChanged_fn8).bind(this)
    );
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener9)
    );
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener9)
    );
  }
};
_onVariantChangedListener9 = new WeakMap();
_onVariantChanged8 = new WeakSet();
onVariantChanged_fn8 = function (event) {
  this.hidden = event.detail.variant["available"];
};
var _onVariantChangedListener10, _onVariantChanged9, onVariantChanged_fn9;
var OnSaleBadge = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged9);
    __privateAdd(
      this,
      _onVariantChangedListener10,
      __privateMethod(this, _onVariantChanged9, onVariantChanged_fn9).bind(this)
    );
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener10)
    );
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener10)
    );
  }
};
_onVariantChangedListener10 = new WeakMap();
_onVariantChanged9 = new WeakSet();
onVariantChanged_fn9 = function (event) {
  const variant = event.detail.variant;
  if (variant["compare_at_price"] > variant["price"]) {
    this.hidden = false;
    if (this.hasAttribute("discount-mode")) {
      const savings =
        this.getAttribute("discount-mode") === "percentage"
          ? `${Math.round(
              ((variant["compare_at_price"] - variant["price"]) * 100) /
                variant["compare_at_price"]
            )}%`
          : formatMoney(variant["compare_at_price"] - variant["price"]);
      this.innerHTML = `${window.themeVariables.strings.discountBadge.replace(
        "@@",
        savings
      )}`;
    }
  } else {
    this.hidden = true;
  }
};
var _onBadgeChange, onBadgeChange_fn;
var BadgeList = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _onBadgeChange);
    const mutationObserver = new MutationObserver(
      __privateMethod(this, _onBadgeChange, onBadgeChange_fn).bind(this)
    );
    Array.from(this.children).forEach((badge) => {
      mutationObserver.observe(badge, {
        attributes: true,
        attributeFilter: ["hidden"],
      });
    });
  }
};
_onBadgeChange = new WeakSet();
onBadgeChange_fn = function () {
  this.hidden = Array.from(this.children).every((badge) =>
    badge.hasAttribute("hidden")
  );
};
if (!window.customElements.get("sold-out-badge")) {
  window.customElements.define("sold-out-badge", SoldOutBadge);
}
if (!window.customElements.get("on-sale-badge")) {
  window.customElements.define("on-sale-badge", OnSaleBadge);
}
if (!window.customElements.get("badge-list")) {
  window.customElements.define("badge-list", BadgeList);
}
var _onVariantChangedListener11,
  _inventoryElements,
  _progressBarElement,
  _onVariantChanged10,
  onVariantChanged_fn10;
var VariantInventory = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged10);
    __privateAdd(
      this,
      _onVariantChangedListener11,
      __privateMethod(this, _onVariantChanged10, onVariantChanged_fn10).bind(
        this
      )
    );
    __privateAdd(this, _inventoryElements, void 0);
    __privateAdd(this, _progressBarElement, void 0);
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener11)
    );
    __privateSet(
      this,
      _inventoryElements,
      Array.from(this.querySelectorAll("[data-variant-id]"))
    );
    __privateSet(this, _progressBarElement, this.querySelector("progress-bar"));
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener11)
    );
  }
};
_onVariantChangedListener11 = new WeakMap();
_inventoryElements = new WeakMap();
_progressBarElement = new WeakMap();
_onVariantChanged10 = new WeakSet();
onVariantChanged_fn10 = function (event) {
  this.hidden = !event.detail.variant;
  if (event.detail.variant) {
    __privateGet(this, _inventoryElements).forEach((item) => {
      const isItemHidden = item.toggleAttribute(
        "hidden",
        event.detail.variant["id"] !==
          parseInt(item.getAttribute("data-variant-id"))
      );
      if (!isItemHidden) {
        this.className = `inventory text-${item.getAttribute("data-status")}`;
        if (__privateGet(this, _progressBarElement)) {
          __privateGet(this, _progressBarElement).valueNow =
            item.getAttribute("data-quantity");
        }
      }
    });
  }
};
if (!window.customElements.get("variant-inventory")) {
  window.customElements.define("variant-inventory", VariantInventory);
}
var _onVariantChangedListener12, _onVariantChanged11, onVariantChanged_fn11;
var VariantSku = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged11);
    __privateAdd(
      this,
      _onVariantChangedListener12,
      __privateMethod(this, _onVariantChanged11, onVariantChanged_fn11).bind(
        this
      )
    );
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener12)
    );
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener12)
    );
  }
};
_onVariantChangedListener12 = new WeakMap();
_onVariantChanged11 = new WeakSet();
onVariantChanged_fn11 = function (event) {
  if (!event.detail.variant) {
    this.hidden = true;
  } else {
    this.innerText = `${window.themeVariables.strings.sku} ${event.detail.variant["sku"]}`;
    this.hidden = !event.detail.variant["sku"];
  }
};
if (!window.customElements.get("variant-sku")) {
  window.customElements.define("variant-sku", VariantSku);
}

// js/common/product/product-gallery.js
import { PhotoSwipeLightbox } from "vendor";
var _abortController6,
  _photoSwipeInstance,
  _onGestureChangedListener,
  _settledMedia,
  _registerLightboxUi,
  registerLightboxUi_fn,
  _onVariantChange,
  onVariantChange_fn,
  _onMediaChange,
  onMediaChange_fn,
  _onMediaSettle,
  onMediaSettle_fn,
  _onCarouselClick,
  onCarouselClick_fn,
  _getFilteredMediaIndexes,
  getFilteredMediaIndexes_fn,
  _onGestureStart,
  onGestureStart_fn,
  _onGestureChanged,
  onGestureChanged_fn;
var ProductGallery = class extends HTMLElement {
  /* Keep track of the currently settled media */
  constructor() {
    super();
    /**
     * Add custom elements to PhotoSwipe gallery
     */
    __privateAdd(this, _registerLightboxUi);
    /**
     * When the variant changes, we check the alt tags for each media and filter them
     */
    __privateAdd(this, _onVariantChange);
    /**
     * When the media is about to change, we perform some logic
     */
    __privateAdd(this, _onMediaChange);
    /**
     * When the media settles, we have to update various elements such as the AR button, the autoplay strategy...
     */
    __privateAdd(this, _onMediaSettle);
    /**
     * Detect a click on an image on desktop, and open the lightbox for the corresponding image
     */
    __privateAdd(this, _onCarouselClick);
    /**
     * Calculate, for a given variant, the media being filtered. This is using the same approach as Liquid, by using the
     * alt tag of the image to decide which image to show
     */
    __privateAdd(this, _getFilteredMediaIndexes);
    /**
     * For iOS devices only, we use the gesturechange event to easily detect a "pinch to zoom"
     */
    __privateAdd(this, _onGestureStart);
    __privateAdd(this, _onGestureChanged);
    __privateAdd(this, _abortController6, void 0);
    __privateAdd(this, _photoSwipeInstance, void 0);
    __privateAdd(
      this,
      _onGestureChangedListener,
      __privateMethod(this, _onGestureChanged, onGestureChanged_fn).bind(this)
    );
    __privateAdd(this, _settledMedia, void 0);
    this.addEventListener("lightbox:open", (event) =>
      this.openLightBox(event?.detail?.index)
    );
  }
  connectedCallback() {
    __privateSet(this, _abortController6, new AbortController());
    if (!this.carousel) {
      return;
    }
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateMethod(this, _onVariantChange, onVariantChange_fn).bind(this),
      { signal: __privateGet(this, _abortController6).signal }
    );
    this.carousel.addEventListener(
      "carousel:change",
      __privateMethod(this, _onMediaChange, onMediaChange_fn).bind(this),
      { signal: __privateGet(this, _abortController6).signal }
    );
    this.carousel.addEventListener(
      "carousel:settle",
      __privateMethod(this, _onMediaSettle, onMediaSettle_fn).bind(this),
      { signal: __privateGet(this, _abortController6).signal }
    );
    this.carousel.addEventListener(
      "click",
      __privateMethod(this, _onCarouselClick, onCarouselClick_fn).bind(this),
      { signal: __privateGet(this, _abortController6).signal }
    );
    if (this.hasAttribute("allow-zoom")) {
      this.carousel.addEventListener(
        "gesturestart",
        __privateMethod(this, _onGestureStart, onGestureStart_fn).bind(this),
        { capture: false, signal: __privateGet(this, _abortController6).signal }
      );
    }
    __privateMethod(this, _onMediaChange, onMediaChange_fn).call(this);
  }
  disconnectedCallback() {
    __privateGet(this, _abortController6).abort();
  }
  get viewInSpaceButton() {
    return this.querySelector("[data-shopify-xr]");
  }
  get carousel() {
    return this.querySelector(".product-gallery__carousel");
  }
  /**
   * Create the PhotoSwipe instance if it does not already exist. This is done on demand, so until the lightbox is
   * open, nothing is created to not impact performance
   */
  get lightBox() {
    if (__privateGet(this, _photoSwipeInstance)) {
      return __privateGet(this, _photoSwipeInstance);
    }
    __privateSet(
      this,
      _photoSwipeInstance,
      new PhotoSwipeLightbox({
        pswpModule: () => import("photoswipe"),
        bgOpacity: 1,
        maxZoomLevel: parseInt(this.getAttribute("allow-zoom")) || 3,
        closeTitle: window.themeVariables.strings.closeGallery,
        zoomTitle: window.themeVariables.strings.zoomGallery,
        errorMsg: window.themeVariables.strings.errorGallery,
        // UX
        arrowPrev: false,
        arrowNext: false,
        counter: false,
        close: false,
        zoom: false,
      })
    );
    __privateGet(this, _photoSwipeInstance).on(
      "uiRegister",
      __privateMethod(this, _registerLightboxUi, registerLightboxUi_fn).bind(
        this
      )
    );
    __privateGet(this, _photoSwipeInstance).addFilter(
      "thumbEl",
      (thumbEl, data) => data.thumbnailElement
    );
    __privateGet(this, _photoSwipeInstance).init();
    return __privateGet(this, _photoSwipeInstance);
  }
  /**
   * Open the lightbox at the given index (by default, it opens the selected image)
   */
  openLightBox(index) {
    const images = this.carousel.cells.flatMap((cell) =>
      Array.from(cell.querySelectorAll(":scope > img"))
    );
    const dataSource = images.map((image) => {
      return {
        thumbnailElement: image,
        src: image.src,
        srcset: image.srcset,
        msrc: image.currentSrc || image.src,
        width: parseInt(image.getAttribute("width")),
        height: parseInt(image.getAttribute("height")),
        alt: image.alt,
        thumbCropped: true,
      };
    });
    const imageCells = this.carousel.cells.filter(
      (cell) => cell.getAttribute("data-media-type") === "image"
    );
    this.lightBox.loadAndOpen(
      index ?? imageCells.indexOf(this.carousel.selectedCell),
      dataSource
    );
  }
};
_abortController6 = new WeakMap();
_photoSwipeInstance = new WeakMap();
_onGestureChangedListener = new WeakMap();
_settledMedia = new WeakMap();
_registerLightboxUi = new WeakSet();
registerLightboxUi_fn = function () {
  __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
    name: "close-button",
    className: "circle-button circle-button--xl hover:animate-icon-block",
    ariaLabel: window.themeVariables.strings.closeGallery,
    order: 2,
    isButton: true,
    html: `
        <svg aria-hidden="true" focusable="false" fill="none" width="16" class="icon" viewBox="0 0 16 16">
          <path d="m1 1 14 14M1 15 15 1" stroke="currentColor" stroke-width="1"/>
        </svg>
      `,
    onClick: () => {
      __privateGet(this, _photoSwipeInstance).pswp.close();
    },
  });
  if (
    __privateGet(this, _photoSwipeInstance).pswp.options.dataSource.length > 1
  ) {
    __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
      name: "previous-button",
      className: "circle-button hover:animate-icon-inline",
      ariaLabel: window.themeVariables.strings.previous,
      order: 1,
      isButton: true,
      html: `
        <svg aria-hidden="true" focusable="false" fill="none" width="16" class="icon icon--direction-aware" viewBox="0 0 16 18">
          <path d="M11 1 3 9l8 8" stroke="currentColor" stroke-linecap="square"/>
        </svg>
      `,
      onClick: () => {
        __privateGet(this, _photoSwipeInstance).pswp.prev();
      },
    });
    __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
      name: "next-button",
      className: "circle-button hover:animate-icon-inline",
      ariaLabel: window.themeVariables.strings.next,
      order: 3,
      isButton: true,
      html: `
        <svg aria-hidden="true" focusable="false" fill="none" width="16" class="icon icon--direction-aware" viewBox="0 0 16 18">
          <path d="m5 17 8-8-8-8" stroke="currentColor" stroke-linecap="square"/>
        </svg>
      `,
      onClick: () => {
        __privateGet(this, _photoSwipeInstance).pswp.next();
      },
    });
  }
};
_onVariantChange = new WeakSet();
onVariantChange_fn = function (event) {
  const filteredIndexes = __privateMethod(
    this,
    _getFilteredMediaIndexes,
    getFilteredMediaIndexes_fn
  ).call(this, event.detail.product, event.detail.variant);
  this.carousel.filter(filteredIndexes);
  if (
    event.detail.variant["featured_media"] &&
    event.detail.previousVariant["featured_media"]?.["id"] !==
      event.detail.variant["featured_media"]["id"]
  ) {
    const position = event.detail.variant["featured_media"]["position"] - 1,
      filteredIndexBelowPosition = filteredIndexes.filter(
        (filteredIndex) => filteredIndex < position
      );
    if (this.carousel.isScrollable) {
      this.carousel.select(position - filteredIndexBelowPosition.length, {
        instant: true,
      });
    } else {
      this.querySelector(
        `[data-media-id="${event.detail.variant["featured_media"]["id"]}"]`
      )?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }
};
_onMediaChange = new WeakSet();
onMediaChange_fn = function () {
  if (!__privateGet(this, _settledMedia)) {
    return;
  }
  switch (__privateGet(this, _settledMedia).getAttribute("data-media-type")) {
    case "external_video":
    case "video":
    case "model":
      __privateGet(this, _settledMedia).firstElementChild.pause();
  }
};
_onMediaSettle = new WeakSet();
onMediaSettle_fn = function (event) {
  const media = event ? event.detail.cell : this.carousel.selectedCell,
    zoomButton = this.querySelector(".product-gallery__zoom-button");
  switch (media.getAttribute("data-media-type")) {
    case "image":
      this.viewInSpaceButton?.setAttribute(
        "data-shopify-model3d-id",
        this.viewInSpaceButton?.getAttribute("data-shopify-model3d-default-id")
      );
      zoomButton?.classList.remove("product-gallery__zoom-button--hidden");
      break;
    case "external_video":
    case "video":
      this.viewInSpaceButton?.setAttribute(
        "data-shopify-model3d-id",
        this.viewInSpaceButton?.getAttribute("data-shopify-model3d-default-id")
      );
      zoomButton?.classList.add("product-gallery__zoom-button--hidden");
      if (this.hasAttribute("autoplay-media")) {
        media.firstElementChild.play();
      }
      break;
    case "model":
      if (matchesMediaQuery("md")) {
        media.firstElementChild.play();
      }
      this.viewInSpaceButton?.setAttribute(
        "data-shopify-model3d-id",
        event.detail.cell.getAttribute("data-media-id")
      );
      zoomButton?.classList.add("product-gallery__zoom-button--hidden");
      break;
  }
  __privateSet(this, _settledMedia, media);
};
_onCarouselClick = new WeakSet();
onCarouselClick_fn = function (event) {
  if (
    !this.hasAttribute("allow-zoom") ||
    !matchesMediaQuery("md") ||
    event.target.tagName !== "IMG"
  ) {
    return;
  }
  const media = event.target.closest(".product-gallery__media");
  const imageCells = this.carousel.cells.filter(
    (cell) => cell.getAttribute("data-media-type") === "image"
  );
  this.dispatchEvent(
    new CustomEvent("lightbox:open", {
      bubbles: true,
      detail: { index: imageCells.indexOf(media) },
    })
  );
};
_getFilteredMediaIndexes = new WeakSet();
getFilteredMediaIndexes_fn = function (product, variant) {
  const filteredMediaIds = [];
  /*product["media"].forEach((media) => {
    let matchMedia = variant["featured_media"] && media["position"] === variant["featured_media"]["position"];
    if (media["alt"]?.includes("#") && media["alt"] !== product["title"]) {
      if (!matchMedia) {
        const altParts = media["alt"].split("#"), mediaGroupParts = altParts.pop().split("_");
        product["options"].forEach((option) => {
          if (option["name"].toLowerCase() === mediaGroupParts[0].toLowerCase()) {
            if (variant["options"][option["position"] - 1].toLowerCase() !== mediaGroupParts[1].trim().toLowerCase()) {
              filteredMediaIds.push(media["position"] - 1);
            }
          }
        });
      }
    }
  });*/
  let size_option, color_option;
  product["options"].forEach((option) => {
    if (option["name"].toLowerCase() == "color") {
      color_option = option;
    } else if (option["name"].toLowerCase() == "size") {
      size_option = option;
    }
  });
  product["media"].forEach((media) => {
    let matchMedia =
      variant["featured_media"] &&
      media["position"] === variant["featured_media"]["position"];
    if (media["alt"]?.includes("#") && media["alt"] !== product["title"]) {
      if (!matchMedia) {
        let altParts = media["alt"].split("#")[1];
        let mediaGroupParts, color_value, size_value;
        if (altParts.indexOf(",") > -1 && color_option && size_option) {
          mediaGroupParts = altParts.split(",");
          color_value = mediaGroupParts[0].split("_");
          size_value = mediaGroupParts[1].split("_");
        } else {
          // Henry Lee - Edits for product thumbnails
          // mediaGroupParts = altParts.pop().split("_");
          mediaGroupParts = altParts.split("_");
        }
        if (altParts.indexOf(",") > -1 && color_option && size_option) {
          if (
            color_option["name"].toLowerCase() === color_value[0].toLowerCase()
          ) {
            if (
              variant["options"][color_option["position"] - 1].toLowerCase() !==
              color_value[1].trim().toLowerCase()
            ) {
              if (
                size_option["name"].toLowerCase() ===
                size_value[0].toLowerCase()
              ) {
                if (
                  variant["options"][
                    size_option["position"] - 1
                  ].toLowerCase() == size_value[1].trim().toLowerCase()
                ) {
                  filteredMediaIds.push(media["position"] - 1);
                } else {
                  filteredMediaIds.push(media["position"] - 1);
                }
              }
            } else if (
              size_option["name"].toLowerCase() === size_value[0].toLowerCase()
            ) {
              if (
                variant["options"][
                  size_option["position"] - 1
                ].toLowerCase() !== size_value[1].trim().toLowerCase()
              ) {
                filteredMediaIds.push(media["position"] - 1);
              }
            }
          }
        } else {
          product["options"].forEach((option) => {
            if (
              option["name"].toLowerCase() === mediaGroupParts[0].toLowerCase()
            ) {
              if (
                variant["options"][option["position"] - 1].toLowerCase() !==
                mediaGroupParts[1].trim().toLowerCase()
              ) {
                filteredMediaIds.push(media["position"] - 1);
              }
            }
          });
        }
      }
    }
  });
  return filteredMediaIds;
};
_onGestureStart = new WeakSet();
onGestureStart_fn = function (event) {
  event.preventDefault();
  this.carousel.addEventListener(
    "gesturechange",
    __privateGet(this, _onGestureChangedListener),
    { capture: false, signal: __privateGet(this, _abortController6).signal }
  );
};
_onGestureChanged = new WeakSet();
onGestureChanged_fn = function (event) {
  event.preventDefault();
  if (event.scale > 1.5) {
    this.dispatchEvent(
      new CustomEvent("lightbox:open", {
        bubbles: true,
        detail: { index: this.carousel.selectedIndex },
      })
    );
    this.removeEventListener(
      "gesturechange",
      __privateGet(this, _onGestureChangedListener)
    );
  }
};
var _intersectionObserver,
  _hasProgrammaticScroll,
  _scrollDirection,
  _lastScrollPosition,
  _onMediaObserve,
  onMediaObserve_fn;
var ProductGalleryNavigation = class extends CarouselNavigation {
  constructor() {
    super();
    /**
     * Use the intersection observer to change the selected icon
     */
    __privateAdd(this, _onMediaObserve);
    __privateAdd(
      this,
      _intersectionObserver,
      new IntersectionObserver(
        __privateMethod(this, _onMediaObserve, onMediaObserve_fn).bind(this),
        { threshold: [0, 0.5, 1] }
      )
    );
    __privateAdd(this, _hasProgrammaticScroll, false);
    __privateAdd(this, _scrollDirection, "bottom");
    __privateAdd(this, _lastScrollPosition, void 0);
    window.addEventListener("scroll", () => {
      if (window.scrollY > __privateGet(this, _lastScrollPosition)) {
        __privateSet(this, _scrollDirection, "bottom");
      } else {
        __privateSet(this, _scrollDirection, "top");
      }
      __privateSet(this, _lastScrollPosition, window.scrollY);
    });
  }
  connectedCallback() {
    super.connectedCallback();
    this.carousel.allCells.forEach((cell) =>
      __privateGet(this, _intersectionObserver).observe(cell)
    );
  }
  onButtonClicked(newIndex) {
    if (this.carousel.isScrollable) {
      super.onButtonClicked(newIndex);
    } else {
      this.carousel.cells[newIndex]?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
      this.onNavigationChange(newIndex);
      __privateSet(this, _hasProgrammaticScroll, true);
      if (!("onscrollend" in window)) {
        setTimeout(() => {
          __privateSet(this, _hasProgrammaticScroll, false);
        }, 1e3);
      } else {
        window.addEventListener(
          "scrollend",
          () => {
            __privateSet(this, _hasProgrammaticScroll, false);
          },
          { once: true }
        );
      }
    }
  }
};
_intersectionObserver = new WeakMap();
_hasProgrammaticScroll = new WeakMap();
_scrollDirection = new WeakMap();
_lastScrollPosition = new WeakMap();
_onMediaObserve = new WeakSet();
onMediaObserve_fn = function (entries) {
  if (this.carousel.isScrollable) {
    return;
  }
  const firstEntry = entries.find(
    (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5
  );
  if (!firstEntry || __privateGet(this, _hasProgrammaticScroll)) {
    return;
  }
  let selectedItem = this.items.find(
      (item) => item.getAttribute("aria-current") === "true"
    ),
    candidateItem = this.items.find(
      (item) =>
        item.getAttribute("data-media-id") ===
        firstEntry.target.getAttribute("data-media-id")
    );
  if (selectedItem == undefined) {
    selectedItem = this.items.find(
      (item) => item.getAttribute("hidden") == null
    );
  }
  if (
    __privateGet(this, _scrollDirection) === "bottom" &&
    parseInt(candidateItem.getAttribute("data-media-position")) >
      parseInt(selectedItem.getAttribute("data-media-position"))
  ) {
    selectedItem.setAttribute("aria-current", "false");
    candidateItem.setAttribute("aria-current", "true");
  } else if (
    __privateGet(this, _scrollDirection) === "top" &&
    parseInt(candidateItem.getAttribute("data-media-position")) <
      parseInt(selectedItem.getAttribute("data-media-position"))
  ) {
    selectedItem.setAttribute("aria-current", "false");
    candidateItem.setAttribute("aria-current", "true");
  }
};
var OpenLightBoxButton = class extends HTMLButtonElement {
  constructor() {
    super();
    this.addEventListener("click", () =>
      this.dispatchEvent(new CustomEvent("lightbox:open", { bubbles: true }))
    );
  }
};
if (!window.customElements.get("product-gallery")) {
  window.customElements.define("product-gallery", ProductGallery);
}
if (!window.customElements.get("product-gallery-navigation")) {
  window.customElements.define(
    "product-gallery-navigation",
    ProductGalleryNavigation
  );
}
if (!window.customElements.get("open-lightbox-button")) {
  window.customElements.define("open-lightbox-button", OpenLightBoxButton, {
    extends: "button",
  });
}

// js/common/product/product-list.js
import { inView as inView6, animate as animate9, stagger } from "vendor";
var ProductList = class extends HTMLElement {
  connectedCallback() {
    if (
      matchesMediaQuery("motion-safe") &&
      this.querySelectorAll('product-card[reveal-on-scroll="true"]').length > 0
    ) {
      inView6(this, this.reveal.bind(this));
    }
  }
  reveal() {
    animate9(
      this.querySelectorAll('product-card[reveal-on-scroll="true"]'),
      {
        opacity: [0, 1],
        transform: ["translateY(20px)", "translateY(0)"],
      },
      {
        duration: 0.2,
        easing: "ease-in-out",
        delay: stagger(0.05, { start: 0.4, easing: "ease-out" }),
      }
    );
  }
};
if (!window.customElements.get("product-list")) {
  window.customElements.define("product-list", ProductList);
}

// js/common/product/product-loader.js
var loadedProducts = {};
var ProductLoader = class {
  static load(productHandle) {
    if (!productHandle) {
      return;
    }
    if (loadedProducts[productHandle]) {
      return loadedProducts[productHandle];
    }
    loadedProducts[productHandle] = new Promise(async (resolve, reject) => {
      const response = await fetch(
        `${Shopify.routes.root}products/${productHandle}.js`
      );
      if (response.ok) {
        const responseAsJson = await response.json();
        resolve(responseAsJson);
      } else {
        reject(`
          Attempted to load information for product with handle ${productHandle}, but this product is in "draft" mode. You won't be able to
          switch between variants or access to per-variant information. To fully preview this product, change temporarily its status
          to "active".
        `);
      }
    });
    return loadedProducts[productHandle];
  }
};

// js/common/product/quick-buy-modal.js
var _onAfterHide, onAfterHide_fn;
var QuickBuyModal = class extends Modal {
  constructor() {
    super();
    __privateAdd(this, _onAfterHide);
    if (window.themeVariables.settings.cartType === "drawer") {
      document.addEventListener("variant:add", this.hide.bind(this));
    }
    this.addEventListener(
      "dialog:after-hide",
      __privateMethod(this, _onAfterHide, onAfterHide_fn).bind(this)
    );
  }
  async show() {
    document.documentElement.dispatchEvent(
      new CustomEvent("theme:loading:start", { bubbles: true })
    );
    const responseContent = await (
      await cachedFetch(
        `${window.Shopify.routes.root}products/${this.getAttribute("handle")}`
      )
    ).text();
    document.documentElement.dispatchEvent(
      new CustomEvent("theme:loading:end", { bubbles: true })
    );
    const tempDoc = new DOMParser().parseFromString(
      responseContent,
      "text/html"
    );
    const quickBuyContent = tempDoc.getElementById("quick-buy-content").content;
    Array.from(quickBuyContent.querySelectorAll("noscript")).forEach(
      (noScript) => noScript.remove()
    );
    this.replaceChildren(document.importNode(quickBuyContent, true));
    Shopify?.PaymentButton?.init();
    return super.show();
  }
};
_onAfterHide = new WeakSet();
onAfterHide_fn = function () {
  this.innerHTML = "";
};
if (!window.customElements.get("quick-buy-modal")) {
  window.customElements.define("quick-buy-modal", QuickBuyModal);
}

// js/common/product/variant-picker.js
var _abortController7,
  _onOptionChanged,
  onOptionChanged_fn,
  _onMasterSelectorChanged,
  onMasterSelectorChanged_fn,
  _getVariantById,
  getVariantById_fn,
  _getVariantFromOptions,
  getVariantFromOptions_fn,
  _isVariantSelectable,
  isVariantSelectable_fn,
  _getFirstMatchingAvailableOrSelectableVariant,
  getFirstMatchingAvailableOrSelectableVariant_fn,
  _getSelectedOptionValues,
  getSelectedOptionValues_fn,
  _updateDisableSelectors,
  updateDisableSelectors_fn,
  _updateDisableSelectorsForOptionLevel,
  updateDisableSelectorsForOptionLevel_fn;
var VariantPicker = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onOptionChanged);
    __privateAdd(this, _onMasterSelectorChanged);
    /**
     * Get the product variant by its ID
     */
    __privateAdd(this, _getVariantById);
    /**
     * Get the variant based on the options
     */
    __privateAdd(this, _getVariantFromOptions);
    /**
     * Detect if a specific variant is selectable. This is used when the "hide sold out variant" option is enabled, to allow
     * returning true only if the variant is actually available
     */
    __privateAdd(this, _isVariantSelectable);
    /**
     * This method is used internally to select an available or selectable variant, when the current choice does not
     * match the requirements. For instance, if sold out variants are configured to be hidden, but that the choices end
     * up being a non-valid variant, the theme automatically changes the variant to match the requirements. In the case
     * the customer end up on variant combinations that do not exist, it also switches to a valid combination.
     *
     * The algorithm is as follows: if we have for instance three options "Color", "Size" and "Material", we pop the last
     * option (Material) and try to find the first available variant for the given Color and Size. If none is found we
     * remove the second option (Size) and try to find the first available variant for the selected color. Finally, if none
     * is found we return the first available variant independently of any choice.
     */
    __privateAdd(this, _getFirstMatchingAvailableOrSelectableVariant);
    __privateAdd(this, _getSelectedOptionValues);
    /**
     * We add specific class to sold out variants based on the selectors
     */
    __privateAdd(this, _updateDisableSelectors);
    __privateAdd(this, _updateDisableSelectorsForOptionLevel);
    __privateAdd(this, _abortController7, void 0);
  }
  async connectedCallback() {
    __privateSet(this, _abortController7, new AbortController());
    this.masterSelector = document.forms[this.getAttribute("form")].id;
    this.optionSelectors = Array.from(
      this.querySelectorAll("[data-option-selector]")
    );
    if (!this.masterSelector) {
      console.warn(
        `The variant selector for product with handle ${this.productHandle} is not linked to any product form.`
      );
      return;
    }
    this.product = await ProductLoader.load(this.productHandle);
    this.optionSelectors.forEach((optionSelector) => {
      optionSelector.addEventListener(
        "change",
        __privateMethod(this, _onOptionChanged, onOptionChanged_fn).bind(this),
        { signal: __privateGet(this, _abortController7).signal }
      );
    });
    this.masterSelector.addEventListener(
      "change",
      __privateMethod(
        this,
        _onMasterSelectorChanged,
        onMasterSelectorChanged_fn
      ).bind(this),
      { signal: __privateGet(this, _abortController7).signal }
    );
    __privateMethod(
      this,
      _updateDisableSelectors,
      updateDisableSelectors_fn
    ).call(this);
    this.selectVariant(this.selectedVariant["id"]);
  }
  disconnectedCallback() {
    __privateGet(this, _abortController7).abort();
  }
  get selectedVariant() {
    return __privateMethod(this, _getVariantById, getVariantById_fn).call(
      this,
      parseInt(this.masterSelector.value)
    );
  }
  get productHandle() {
    return this.getAttribute("handle");
  }
  get hideSoldOutVariants() {
    return this.hasAttribute("hide-sold-out-variants");
  }
  get updateUrl() {
    return this.hasAttribute("update-url");
  }
  /**
   * Select a new variant by its ID
   */
  selectVariant(id) {
    if (
      !__privateMethod(this, _isVariantSelectable, isVariantSelectable_fn).call(
        this,
        __privateMethod(this, _getVariantById, getVariantById_fn).call(this, id)
      )
    ) {
      id = __privateMethod(
        this,
        _getFirstMatchingAvailableOrSelectableVariant,
        getFirstMatchingAvailableOrSelectableVariant_fn
      ).call(this)["id"];
    }
    const previousVariant = this.selectedVariant;
    if (previousVariant && previousVariant.id === id) {
      return;
    }
    this.masterSelector.value = id;
    this.masterSelector.dispatchEvent(new Event("change", { bubbles: true }));
    if (this.updateUrl && history.replaceState) {
      const newUrl = new URL(window.location.href);
      if (id) {
        newUrl.searchParams.set("variant", id);
      } else {
        newUrl.searchParams.delete("variant");
      }
      window.history.replaceState(
        { path: newUrl.toString() },
        "",
        newUrl.toString()
      );
    }
    __privateMethod(
      this,
      _updateDisableSelectors,
      updateDisableSelectors_fn
    ).call(this);
    this.masterSelector.form.dispatchEvent(
      new CustomEvent("variant:change", {
        bubbles: true,
        detail: {
          product: this.product,
          variant: this.selectedVariant,
          previousVariant,
        },
      })
    );
  }
};
_abortController7 = new WeakMap();
_onOptionChanged = new WeakSet();
onOptionChanged_fn = function (event) {
  if (!event.target.name.startsWith("option")) {
    return;
  }
  this.selectVariant(
    __privateMethod(
      this,
      _getVariantFromOptions,
      getVariantFromOptions_fn
    ).call(this)?.id
  );
};
_onMasterSelectorChanged = new WeakSet();
onMasterSelectorChanged_fn = function () {
  const options = this.selectedVariant?.options || [];
  options.forEach((value, index) => {
    let input = this.optionSelectors[index].querySelector(
        `input[type="radio"][name="option${index + 1}"][value="${CSS.escape(
          value
        )}"], input[type="hidden"][name="option${
          index + 1
        }"], select[name="option${index + 1}"]`
      ),
      triggerChangeEvent = false;
    if (
      input.tagName === "SELECT" ||
      (input.tagName === "INPUT" && input.type === "hidden")
    ) {
      triggerChangeEvent = input.value !== value;
      input.value = value;
    } else if (input.tagName === "INPUT" && input.type === "radio") {
      triggerChangeEvent = !input.checked && input.value === value;
      input.checked = input.value === value;
    }
    if (triggerChangeEvent) {
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
};
_getVariantById = new WeakSet();
getVariantById_fn = function (id) {
  return this.product["variants"].find((variant) => variant["id"] === id);
};
_getVariantFromOptions = new WeakSet();
getVariantFromOptions_fn = function () {
  const options = __privateMethod(
    this,
    _getSelectedOptionValues,
    getSelectedOptionValues_fn
  ).call(this);
  return this.product["variants"].find((variant) => {
    return variant["options"].every((value, index) => value === options[index]);
  });
};
_isVariantSelectable = new WeakSet();
isVariantSelectable_fn = function (variant) {
  if (!variant) {
    return false;
  } else {
    return (
      variant["available"] ||
      (!this.hideSoldOutVariants && !variant["available"])
    );
  }
};
_getFirstMatchingAvailableOrSelectableVariant = new WeakSet();
getFirstMatchingAvailableOrSelectableVariant_fn = function () {
  let options = __privateMethod(
      this,
      _getSelectedOptionValues,
      getSelectedOptionValues_fn
    ).call(this),
    matchedVariant = null,
    slicedCount = 0;
  do {
    options.pop();
    slicedCount += 1;
    matchedVariant = this.product["variants"].find((variant) => {
      if (this.hideSoldOutVariants) {
        return (
          variant["available"] &&
          variant["options"]
            .slice(0, variant["options"].length - slicedCount)
            .every((value, index) => value === options[index])
        );
      } else {
        return variant["options"]
          .slice(0, variant["options"].length - slicedCount)
          .every((value, index) => value === options[index]);
      }
    });
  } while (!matchedVariant && options.length > 0);
  return matchedVariant;
};
_getSelectedOptionValues = new WeakSet();
getSelectedOptionValues_fn = function () {
  return this.optionSelectors.map((optionSelector) => {
    return optionSelector.querySelector(
      'input[name^="option"][type="hidden"], input[name^="option"]:checked, select[name^="option"]'
    ).value;
  });
};
_updateDisableSelectors = new WeakSet();
updateDisableSelectors_fn = function () {
  const selectedVariant = this.selectedVariant;
  if (!selectedVariant) {
    return;
  }
  __privateMethod(
    this,
    _updateDisableSelectorsForOptionLevel,
    updateDisableSelectorsForOptionLevel_fn
  ).call(this, 0, selectedVariant);
};
_updateDisableSelectorsForOptionLevel = new WeakSet();
updateDisableSelectorsForOptionLevel_fn = function (level, selectedVariant) {
  if (!this.optionSelectors[level]) {
    return;
  }
  const applyClassToSelector = (
    selector,
    valueIndex,
    available,
    hasAtLeastOneCombination
  ) => {
    const optionValue = Array.from(
      selector.querySelectorAll("[data-option-value]")
    )[valueIndex];
    optionValue.toggleAttribute("hidden", !hasAtLeastOneCombination);
    if (this.hideSoldOutVariants) {
      optionValue.toggleAttribute("hidden", !available);
    } else {
      optionValue.classList.toggle("is-disabled", !available);
    }
  };
  const hasCombination = (variant, level2, value, selectedVariant2) => {
    return Array.from({ length: level2 + 1 }, (_, i) => {
      if (i === level2) {
        return variant[`option${level2 + 1}`] === value;
      } else {
        return variant[`option${i + 1}`] === selectedVariant2[`option${i + 1}`];
      }
    }).every((condition) => condition);
  };
  this.product["options"][level]["values"].forEach((value, valueIndex) => {
    const hasAtLeastOneCombination = this.product["variants"].some(
      (variant) =>
        hasCombination(variant, level, value, selectedVariant) && variant
    );
    const hasAvailableVariant = this.product["variants"].some(
      (variant) =>
        hasCombination(variant, level, value, selectedVariant) &&
        variant["available"]
    );
    applyClassToSelector(
      this.optionSelectors[level],
      valueIndex,
      hasAvailableVariant,
      hasAtLeastOneCombination
    );
    __privateMethod(
      this,
      _updateDisableSelectorsForOptionLevel,
      updateDisableSelectorsForOptionLevel_fn
    ).call(this, level + 1, selectedVariant);
  });
};
var _onVariantChangedListener13, _onVariantChanged12, onVariantChanged_fn12;
var VariantOptionValue = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onVariantChanged12);
    __privateAdd(
      this,
      _onVariantChangedListener13,
      __privateMethod(this, _onVariantChanged12, onVariantChanged_fn12).bind(
        this
      )
    );
  }
  connectedCallback() {
    document.forms[this.getAttribute("form")]?.addEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener13)
    );
  }
  disconnectedCallback() {
    document.forms[this.getAttribute("form")]?.removeEventListener(
      "variant:change",
      __privateGet(this, _onVariantChangedListener13)
    );
  }
};
_onVariantChangedListener13 = new WeakMap();
_onVariantChanged12 = new WeakSet();
onVariantChanged_fn12 = function (event) {
  this.innerHTML = event.detail.variant[this.getAttribute("for")];
};
if (!window.customElements.get("variant-picker")) {
  window.customElements.define("variant-picker", VariantPicker);
}
if (!window.customElements.get("variant-option-value")) {
  window.customElements.define("variant-option-value", VariantOptionValue);
}

// js/common/media/base-media.js
import { inView as inView7 } from "vendor";
var BaseMedia = class extends HTMLElement {
  static get observedAttributes() {
    return ["playing"];
  }
  connectedCallback() {
    this._abortController = new AbortController();
    if (this.hasAttribute("autoplay")) {
      inView7(this, this.play.bind(this), { margin: "0px 0px 0px 0px" });
    }
  }
  disconnectedCallback() {
    this._abortController.abort();
  }
  get playing() {
    return this.hasAttribute("playing");
  }
  get player() {
    return (this._playerProxy =
      this._playerProxy ||
      new Proxy(this._playerTarget(), {
        get: (target, prop) => {
          return async () => {
            target = await target;
            this._playerHandler(target, prop);
          };
        },
      }));
  }
  play() {
    if (!this.playing) {
      this.player.play();
    }
  }
  pause() {
    if (this.playing) {
      this.player.pause();
    }
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "playing") {
      if (oldValue === null && newValue === "") {
        this.dispatchEvent(new CustomEvent("media:play", { bubbles: true }));
        if (this.hasAttribute("group")) {
          Array.from(
            document.querySelectorAll(`[group="${this.getAttribute("group")}"]`)
          )
            .filter((item) => item !== this)
            .forEach((itemToPause) => {
              itemToPause.pause();
            });
        }
      } else if (newValue === null) {
        this.dispatchEvent(new CustomEvent("media:pause", { bubbles: true }));
      }
    }
  }
};

// js/common/media/model.js
var ModelMedia = class extends BaseMedia {
  connectedCallback() {
    super.connectedCallback();
    this.player;
  }
  _playerTarget() {
    return new Promise((resolve) => {
      this.setAttribute("loaded", "");
      window.Shopify.loadFeatures([
        {
          name: "shopify-xr",
          version: "1.0",
          onLoad: this._setupShopifyXr.bind(this),
        },
        {
          name: "model-viewer-ui",
          version: "1.0",
          onLoad: () => {
            const modelViewer = this.querySelector("model-viewer");
            modelViewer.addEventListener(
              "shopify_model_viewer_ui_toggle_play",
              () => this.setAttribute("playing", "")
            );
            modelViewer.addEventListener(
              "shopify_model_viewer_ui_toggle_pause",
              () => this.removeAttribute("playing")
            );
            resolve(
              new window.Shopify.ModelViewerUI(modelViewer, {
                focusOnPlay: true,
              })
            );
          },
        },
      ]);
    });
  }
  _playerHandler(target, prop) {
    target[prop]();
  }
  async _setupShopifyXr() {
    if (!window.ShopifyXR) {
      document.addEventListener(
        "shopify_xr_initialized",
        this._setupShopifyXr.bind(this)
      );
    } else {
      const models = (await ProductLoader.load(this.getAttribute("handle")))[
        "media"
      ].filter((media) => media["media_type"] === "model");
      window.ShopifyXR.addModels(models);
      window.ShopifyXR.setupXRElements();
    }
  }
};
if (!window.customElements.get("model-media")) {
  window.customElements.define("model-media", ModelMedia);
}

// js/common/media/video.js
import { inView as inView8 } from "vendor";
var onYouTubePromise = new Promise((resolve) => {
  window.onYouTubeIframeAPIReady = () => resolve();
});
var VideoMedia = class extends BaseMedia {
  #mustRemoveControlsAfterSuspend = false;
  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute("autoplay")) {
      this.addEventListener("click", this.play, {
        once: true,
        signal: this._abortController.signal,
      });
    }
    if (this.hasAttribute("show-play-button") && !this.shadowRoot) {
      this.attachShadow({ mode: "open" }).appendChild(
        document
          .getElementById("video-media-default-template")
          .content.cloneNode(true)
      );
    }
    if (this.getAttribute("type") === "video") {
      inView8(
        this,
        () => {
          this.querySelector("video")?.setAttribute("preload", "metadata");
        },
        { margin: "800px" }
      );
    }
  }
  _playerTarget() {
    if (this.hasAttribute("host")) {
      this.setAttribute("loaded", "");
      return new Promise(async (resolve) => {
        const templateElement = this.querySelector("template");
        if (templateElement) {
          templateElement.replaceWith(
            templateElement.content.firstElementChild.cloneNode(true)
          );
        }
        const muteVideo =
          this.hasAttribute("autoplay") || matchesMediaQuery("md-max");
        const script = document.createElement("script");
        script.type = "text/javascript";
        if (this.getAttribute("host") === "youtube") {
          if (!window.YT || !window.YT.Player) {
            script.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(script);
            await new Promise((resolve2) => {
              script.onload = resolve2;
            });
          }
          await onYouTubePromise;
          const player = new YT.Player(this.querySelector("iframe"), {
            events: {
              onReady: () => {
                if (muteVideo) {
                  player.mute();
                }
                resolve(player);
              },
              onStateChange: (event) => {
                if (event.data === YT.PlayerState.PLAYING) {
                  this.setAttribute("playing", "");
                } else if (
                  event.data === YT.PlayerState.ENDED ||
                  event.data === YT.PlayerState.PAUSED
                ) {
                  this.removeAttribute("playing");
                }
              },
            },
          });
        }
        if (this.getAttribute("host") === "vimeo") {
          if (!window.Vimeo || !window.Vimeo.Player) {
            script.src = "https://player.vimeo.com/api/player.js";
            document.head.appendChild(script);
            await new Promise((resolve2) => {
              script.onload = resolve2;
            });
          }
          const player = new Vimeo.Player(this.querySelector("iframe"));
          if (muteVideo) {
            player.setMuted(true);
          }
          player.on("play", () => {
            this.setAttribute("playing", "");
          });
          player.on("pause", () => this.removeAttribute("playing"));
          player.on("ended", () => this.removeAttribute("playing"));
          resolve(player);
        }
      });
    } else {
      const videoElement = this.querySelector("video");
      this.setAttribute("loaded", "");
      videoElement.addEventListener("play", () => {
        this.setAttribute("playing", "");
        this.removeAttribute("suspended");
        if (this.#mustRemoveControlsAfterSuspend) {
          videoElement.controls = false;
        }
      });
      videoElement.addEventListener("pause", () => {
        if (!videoElement.seeking && videoElement.paused) {
          this.removeAttribute("playing");
        }
      });
      return videoElement;
    }
  }
  _playerHandler(target, prop) {
    if (this.getAttribute("host") === "youtube") {
      prop === "play" ? target.playVideo() : target.pauseVideo();
    } else {
      if (prop === "play" && !this.hasAttribute("host")) {
        target.play().catch((error) => {
          if (error.name === "NotAllowedError") {
            this.setAttribute("suspended", "");
            if (!this.hasAttribute("controls")) {
              this.#mustRemoveControlsAfterSuspend = true;
              target.controls = true;
            }
          }
        });
      } else {
        target[prop]();
      }
    }
  }
};
if (!window.customElements.get("video-media")) {
  window.customElements.define("video-media", VideoMedia);
}

// js/common/navigation/accordion-disclosure.js
import { timeline as timeline5 } from "vendor";

// js/common/navigation/custom-details.js
var _onSummaryClickedListener, _onSummaryClicked, onSummaryClicked_fn;
var CustomDetails = class extends HTMLDetailsElement {
  constructor() {
    super();
    /**
     * By default, when clicking on the summary, the browser directly toggle the "open" attribute, which prevent to
     * perform animation. We therefore block that to allow doing an animation
     */
    __privateAdd(this, _onSummaryClicked);
    __privateAdd(
      this,
      _onSummaryClickedListener,
      __privateMethod(this, _onSummaryClicked, onSummaryClicked_fn).bind(this)
    );
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) =>
        this.toggle(true, !event.detail.load)
      );
      this.addEventListener("shopify:block:deselect", (event) =>
        this.toggle(false, !event.detail.load)
      );
    }
  }
  static get observedAttributes() {
    return ["open", "aria-expanded"];
  }
  connectedCallback() {
    this.setAttribute("aria-expanded", this.open ? "true" : "false");
    this.summaryElement.addEventListener(
      "click",
      __privateGet(this, _onSummaryClickedListener)
    );
  }
  disconnectedCallback() {
    this.summaryElement.removeEventListener(
      "click",
      __privateGet(this, _onSummaryClickedListener)
    );
  }
  get summaryElement() {
    return this.firstElementChild;
  }
  get contentElement() {
    return this.lastElementChild;
  }
  toggle(force = void 0, animate27 = true) {
    const newValue =
      typeof force === "boolean"
        ? force
        : !(this.getAttribute("aria-expanded") === "true");
    if (newValue) {
      this.setAttribute("open", animate27 ? "" : "immediate");
    }
    this.setAttribute("aria-expanded", newValue ? "true" : "false");
  }
  /**
   * Sync the "open" attribute with the is-expanded class. We also track the "internal-open" attribute to run
   * the various animation
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "open":
        this.setAttribute(
          "aria-expanded",
          newValue !== null ? "true" : "false"
        );
        break;
      case "aria-expanded":
        if (oldValue === newValue || !this.isConnected) {
          return;
        }
        if (newValue === "false" && this.open) {
          this.createHideAnimationControls()?.finished.then((event) => {
            if (event !== void 0) {
              this.removeAttribute("open");
            }
          });
        } else if (newValue === "true") {
          const controls = this.createShowAnimationControls();
          if (this.getAttribute("open") === "immediate") {
            controls.finish();
          }
        }
    }
  }
  createShowAnimationControls() {}
  createHideAnimationControls() {}
};
_onSummaryClickedListener = new WeakMap();
_onSummaryClicked = new WeakSet();
onSummaryClicked_fn = function (event) {
  if (this.open && this.summaryElement.hasAttribute("data-follow-link")) {
    return (window.location.href =
      this.summaryElement.getAttribute("data-follow-link"));
  }
  event.preventDefault();
  this.toggle();
};

// js/common/navigation/accordion-disclosure.js
var AccordionDisclosure = class extends CustomDetails {
  createShowAnimationControls() {
    this.style.overflow = "hidden";
    const animationControls = timeline5([
      [
        this,
        {
          height: [
            `${this.summaryElement.clientHeight}px`,
            `${this.scrollHeight}px`,
          ],
        },
        { duration: 0.25, easing: "ease" },
      ],
      [
        this.contentElement,
        { opacity: [0, 1], transform: ["translateY(4px)", `translateY(0)`] },
        { duration: 0.15, at: "-0.1" },
      ],
    ]);
    animationControls.finished.then(() => {
      this.style.height = null;
      this.style.overflow = null;
    });
    return animationControls;
  }
  createHideAnimationControls() {
    const animationControls = timeline5([
      [this.contentElement, { opacity: 0 }, { duration: 0.15 }],
      [
        this,
        {
          height: [
            `${this.clientHeight}px`,
            `${this.summaryElement.clientHeight}px`,
          ],
        },
        { duration: 0.25, at: "<", easing: "ease" },
      ],
    ]);
    animationControls.finished.then(() => {
      this.style.height = null;
    });
    return animationControls;
  }
};
if (!window.customElements.get("accordion-disclosure")) {
  window.customElements.define("accordion-disclosure", AccordionDisclosure, {
    extends: "details",
  });
}

// js/common/navigation/menu-disclosure.js
var _hoverTimer,
  _detectClickOutsideListener,
  _detectEscKeyboardListener,
  _detectFocusOutListener,
  _detectHoverOutsideListener,
  _detectHoverListener,
  _detectClickOutside,
  detectClickOutside_fn,
  _detectHover,
  detectHover_fn,
  _detectHoverOutside,
  detectHoverOutside_fn,
  _detectEscKeyboard,
  detectEscKeyboard_fn,
  _detectFocusOut,
  detectFocusOut_fn;
var _MenuDisclosure = class _MenuDisclosure extends CustomDetails {
  constructor() {
    super();
    /**
     * When dropdown menu is configured to open on click, we add a listener to detect click outside and automatically
     * close the navigation.
     */
    __privateAdd(this, _detectClickOutside);
    /**
     * On desktop device, if the mode is set to hover, we open/close the dropdown on hover
     */
    __privateAdd(this, _detectHover);
    /**
     * Try to detect when the user hover a different link, to immediately close the item without extra delay
     */
    __privateAdd(this, _detectHoverOutside);
    /**
     * Detect if we hit the "Escape" key to automatically close the dropdown
     */
    __privateAdd(this, _detectEscKeyboard);
    /**
     * Close the dropdown automatically when the dropdown is focused out
     */
    __privateAdd(this, _detectFocusOut);
    __privateAdd(this, _hoverTimer, void 0);
    __privateAdd(
      this,
      _detectClickOutsideListener,
      __privateMethod(this, _detectClickOutside, detectClickOutside_fn).bind(
        this
      )
    );
    __privateAdd(
      this,
      _detectEscKeyboardListener,
      __privateMethod(this, _detectEscKeyboard, detectEscKeyboard_fn).bind(this)
    );
    __privateAdd(
      this,
      _detectFocusOutListener,
      __privateMethod(this, _detectFocusOut, detectFocusOut_fn).bind(this)
    );
    __privateAdd(
      this,
      _detectHoverOutsideListener,
      __privateMethod(this, _detectHoverOutside, detectHoverOutside_fn).bind(
        this
      )
    );
    __privateAdd(
      this,
      _detectHoverListener,
      __privateMethod(this, _detectHover, detectHover_fn).bind(this)
    );
    this.addEventListener(
      "mouseover",
      __privateGet(this, _detectHoverListener)
    );
    this.addEventListener("mouseout", __privateGet(this, _detectHoverListener));
  }
  /**
   * Get the trigger mode (can be "click" or "hover"). However, for touch devices, it is always forced to click
   * to provide a better user experience
   */
  get trigger() {
    return !window.matchMedia("screen and (pointer: fine)").matches
      ? "click"
      : this.getAttribute("trigger");
  }
  /**
   * In ms, describe the delay before which we close the menu
   */
  get mouseOverDelayTolerance() {
    return 250;
  }
  /**
   * -------------------------------------------------------------------------------------------------------------------
   * PRIVATE API
   * -------------------------------------------------------------------------------------------------------------------
   */
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "aria-expanded") {
      if (oldValue === newValue) {
        return;
      }
      if (newValue === "false") {
        document.removeEventListener(
          "click",
          __privateGet(this, _detectClickOutsideListener)
        );
        document.removeEventListener(
          "keydown",
          __privateGet(this, _detectEscKeyboardListener)
        );
        document.removeEventListener(
          "focusout",
          __privateGet(this, _detectFocusOutListener)
        );
        document.removeEventListener(
          "mouseover",
          __privateGet(this, _detectHoverOutsideListener)
        );
      } else {
        document.addEventListener(
          "click",
          __privateGet(this, _detectClickOutsideListener)
        );
        document.addEventListener(
          "keydown",
          __privateGet(this, _detectEscKeyboardListener)
        );
        document.addEventListener(
          "focusout",
          __privateGet(this, _detectFocusOutListener)
        );
        document.addEventListener(
          "mouseover",
          __privateGet(this, _detectHoverOutsideListener)
        );
      }
    }
  }
};
_hoverTimer = new WeakMap();
_detectClickOutsideListener = new WeakMap();
_detectEscKeyboardListener = new WeakMap();
_detectFocusOutListener = new WeakMap();
_detectHoverOutsideListener = new WeakMap();
_detectHoverListener = new WeakMap();
_detectClickOutside = new WeakSet();
detectClickOutside_fn = function (event) {
  if (this.trigger !== "click") {
    return;
  }
  if (
    !this.contains(event.target) &&
    !(event.target.closest("details") instanceof _MenuDisclosure)
  ) {
    this.toggle(false);
  }
};
_detectHover = new WeakSet();
detectHover_fn = function (event) {
  if (this.trigger !== "hover") {
    return;
  }
  if (event.type === "mouseover") {
    clearTimeout(__privateGet(this, _hoverTimer));
    this.toggle(true);
  } else if (event.type === "mouseout") {
    __privateSet(
      this,
      _hoverTimer,
      setTimeout(() => this.toggle(false), this.mouseOverDelayTolerance)
    );
  }
};
_detectHoverOutside = new WeakSet();
detectHoverOutside_fn = function (event) {
  if (this.trigger !== "hover") {
    return;
  }
  const closestDetails = event.target.closest("details");
  if (
    closestDetails instanceof _MenuDisclosure &&
    closestDetails !== this &&
    !closestDetails.contains(this) &&
    !this.contains(closestDetails)
  ) {
    clearTimeout(__privateGet(this, _hoverTimer));
    this.toggle(false);
  }
};
_detectEscKeyboard = new WeakSet();
detectEscKeyboard_fn = function (event) {
  if (event.code === "Escape") {
    const targetMenu = event.target.closest("details[open]");
    if (targetMenu && targetMenu instanceof _MenuDisclosure) {
      targetMenu.toggle(false);
      event.stopPropagation();
    }
  }
};
_detectFocusOut = new WeakSet();
detectFocusOut_fn = function (event) {
  if (event.relatedTarget && !this.contains(event.relatedTarget)) {
    this.toggle(false);
  }
};
var MenuDisclosure = _MenuDisclosure;

// js/common/navigation/tabs.js
import {
  Delegate as Delegate5,
  animate as animate10,
  timeline as timeline6,
} from "vendor";
var _componentID,
  _buttons,
  _panels,
  _delegate4,
  _setupComponent,
  setupComponent_fn,
  _onButtonClicked,
  onButtonClicked_fn,
  _onSlotChange,
  onSlotChange_fn,
  _handleKeyboard,
  handleKeyboard_fn;
var Tabs = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _setupComponent);
    __privateAdd(this, _onButtonClicked);
    __privateAdd(this, _onSlotChange);
    /**
     * As per https://www.w3.org/WAI/ARIA/apg/example-index/tabs/tabs-automatic.html, when a tab is currently focused,
     * left and right arrow should switch the tab
     */
    __privateAdd(this, _handleKeyboard);
    __privateAdd(
      this,
      _componentID,
      crypto.randomUUID ? crypto.randomUUID() : Math.floor(Math.random() * 1e4)
    );
    __privateAdd(this, _buttons, []);
    __privateAdd(this, _panels, []);
    __privateAdd(this, _delegate4, new Delegate5(this));
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" }).appendChild(
        this.querySelector("template").content.cloneNode(true)
      );
    }
    if (Shopify.designMode) {
      this.addEventListener(
        "shopify:block:select",
        (event) =>
          (this.selectedIndex = __privateGet(this, _buttons).indexOf(
            event.target
          ))
      );
    }
    __privateGet(this, _delegate4).on(
      "click",
      'button[role="tab"]',
      __privateMethod(this, _onButtonClicked, onButtonClicked_fn).bind(this)
    );
    this.shadowRoot.addEventListener(
      "slotchange",
      __privateMethod(this, _onSlotChange, onSlotChange_fn).bind(this)
    );
    this.addEventListener(
      "keydown",
      __privateMethod(this, _handleKeyboard, handleKeyboard_fn)
    );
  }
  static get observedAttributes() {
    return ["selected-index"];
  }
  connectedCallback() {
    __privateMethod(this, _setupComponent, setupComponent_fn).call(this);
    this.selectedIndex = this.selectedIndex;
  }
  disconnectedCallback() {
    __privateGet(this, _delegate4).destroy();
  }
  /**
   * --------------------------------------------------------------------------
   * GETTERS AND SETTERS
   * --------------------------------------------------------------------------
   */
  get animationDuration() {
    return this.hasAttribute("animation-duration")
      ? parseFloat(this.getAttribute("animation-duration"))
      : 0.3;
  }
  get selectedIndex() {
    return parseInt(this.getAttribute("selected-index")) || 0;
  }
  set selectedIndex(index) {
    this.setAttribute(
      "selected-index",
      Math.min(
        Math.max(index, 0),
        __privateGet(this, _buttons).length - 1
      ).toString()
    );
    this.style.setProperty("--selected-index", this.selectedIndex.toString());
  }
  /**
   * --------------------------------------------------------------------------
   * METHODS
   * --------------------------------------------------------------------------
   */
  attributeChangedCallback(name, oldValue, newValue) {
    __privateGet(this, _buttons).forEach((button, index) =>
      button.setAttribute(
        "aria-selected",
        index === parseInt(newValue) ? "true" : "false"
      )
    );
    if (
      name === "selected-index" &&
      oldValue !== null &&
      oldValue !== newValue
    ) {
      this.transition(
        __privateGet(this, _panels)[parseInt(oldValue)],
        __privateGet(this, _panels)[parseInt(newValue)]
      );
    }
  }
  /**
   * Perform a custom transition (can be overridden in subclasses). To "from" and "to" are hash representing the panel
   */
  async transition(fromPanel, toPanel) {
    const beforeHeight = this.clientHeight;
    await animate10(
      fromPanel,
      { transform: ["translateY(0px)", "translateY(10px)"], opacity: [1, 0] },
      { duration: this.animationDuration }
    ).finished;
    fromPanel.hidden = true;
    toPanel.hidden = false;
    await timeline6([
      [
        this,
        {
          height: [`${beforeHeight}px`, `${this.clientHeight}px`],
          overflow: ["hidden", "visible"],
        },
        { duration: 0.15, easing: [0.85, 0, 0.15, 1] },
      ],
      [
        toPanel,
        { transform: ["translateY(10px)", "translateY(0px)"], opacity: [0, 1] },
        { duration: this.animationDuration, at: "+0.1" },
      ],
    ]).finished;
    this.style.removeProperty("height");
  }
};
_componentID = new WeakMap();
_buttons = new WeakMap();
_panels = new WeakMap();
_delegate4 = new WeakMap();
_setupComponent = new WeakSet();
setupComponent_fn = function () {
  __privateSet(
    this,
    _buttons,
    Array.from(
      this.shadowRoot.querySelector('slot[name="title"]').assignedNodes(),
      (item) => (item.matches("button") && item) || item.querySelector("button")
    )
  );
  __privateSet(
    this,
    _panels,
    Array.from(
      this.shadowRoot.querySelector('slot[name="content"]').assignedNodes()
    )
  );
  __privateGet(this, _buttons).forEach((button, index) => {
    button.setAttribute("role", "tab");
    button.setAttribute(
      "aria-controls",
      `tab-panel-${__privateGet(this, _componentID)}-${index}`
    );
    button.id = `tab-${__privateGet(this, _componentID)}-${index}`;
  });
  __privateGet(this, _panels).forEach((panel, index) => {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute(
      "aria-labelledby",
      `tab-${__privateGet(this, _componentID)}-${index}`
    );
    panel.id = `tab-panel-${__privateGet(this, _componentID)}-${index}`;
    panel.hidden = index !== this.selectedIndex;
  });
  this.style.setProperty(
    "--item-count",
    __privateGet(this, _buttons).length.toString()
  );
};
_onButtonClicked = new WeakSet();
onButtonClicked_fn = function (event, button) {
  this.selectedIndex = __privateGet(this, _buttons).indexOf(button);
};
_onSlotChange = new WeakSet();
onSlotChange_fn = function () {
  __privateMethod(this, _setupComponent, setupComponent_fn).call(this);
};
_handleKeyboard = new WeakSet();
handleKeyboard_fn = function (event) {
  const index = __privateGet(this, _buttons).indexOf(document.activeElement);
  if (index === -1 || !["ArrowLeft", "ArrowRight"].includes(event.key)) {
    return;
  }
  if (event.key === "ArrowLeft") {
    this.selectedIndex =
      (this.selectedIndex - 1 + __privateGet(this, _buttons).length) %
      __privateGet(this, _buttons).length;
  } else {
    this.selectedIndex =
      (this.selectedIndex + 1 + __privateGet(this, _buttons).length) %
      __privateGet(this, _buttons).length;
  }
  __privateGet(this, _buttons)[this.selectedIndex].focus();
};
if (!window.customElements.get("x-tabs")) {
  window.customElements.define("x-tabs", Tabs);
}

// js/common/search/predictive-search.js
var _listenersAbortController2,
  _fetchAbortController,
  _searchForm,
  _queryInput,
  _onInputChanged2,
  onInputChanged_fn2,
  _onFormSubmitted2,
  onFormSubmitted_fn2,
  _doPredictiveSearch,
  doPredictiveSearch_fn,
  _onSearchCleared,
  onSearchCleared_fn;
var PredictiveSearch = class extends HTMLElement {
  constructor() {
    super();
    /**
     * Check if the input is not empty, and if so, trigger the predictive search
     */
    __privateAdd(this, _onInputChanged2);
    /**
     * Prevent the form submission if the query is empty
     */
    __privateAdd(this, _onFormSubmitted2);
    /**
     * Do the actual predictive search
     */
    __privateAdd(this, _doPredictiveSearch);
    /**
     * If any search is pending, we abort them, and transition to the idle slot
     */
    __privateAdd(this, _onSearchCleared);
    __privateAdd(this, _listenersAbortController2, void 0);
    __privateAdd(this, _fetchAbortController, void 0);
    __privateAdd(this, _searchForm, void 0);
    __privateAdd(this, _queryInput, void 0);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      document
        .createRange()
        .createContextualFragment(`<slot name="results"></slot>`)
    );
  }
  connectedCallback() {
    __privateSet(this, _listenersAbortController2, new AbortController());
    __privateSet(
      this,
      _searchForm,
      document.querySelector(`[aria-owns="${this.id}"]`)
    );
    __privateSet(
      this,
      _queryInput,
      __privateGet(this, _searchForm).elements["q"]
    );
    __privateGet(this, _searchForm).addEventListener(
      "submit",
      __privateMethod(this, _onFormSubmitted2, onFormSubmitted_fn2).bind(this),
      { signal: __privateGet(this, _listenersAbortController2).signal }
    );
    __privateGet(this, _searchForm).addEventListener(
      "reset",
      __privateMethod(this, _onSearchCleared, onSearchCleared_fn).bind(this),
      { signal: __privateGet(this, _listenersAbortController2).signal }
    );
    __privateGet(this, _queryInput).addEventListener(
      "input",
      debounce(
        __privateMethod(this, _onInputChanged2, onInputChanged_fn2).bind(this),
        this.autoCompleteDelay,
        { signal: __privateGet(this, _listenersAbortController2).signal }
      )
    );
  }
  disconnectedCallback() {
    __privateGet(this, _listenersAbortController2).abort();
  }
  /**
   * Return the delay in ms before we send the autocomplete request. Using a value too low can cause the results to
   * refresh too often, so we recommend to keep the default one
   */
  get autoCompleteDelay() {
    return 280;
  }
  /**
   * Check if the store supports the predictive API (some languages do not). When not supported, the predictive
   * search is simply disabled and only the standard search is used
   */
  supportsPredictiveApi() {
    return JSON.parse(document.getElementById("shopify-features").innerHTML)[
      "predictiveSearch"
    ];
  }
};
_listenersAbortController2 = new WeakMap();
_fetchAbortController = new WeakMap();
_searchForm = new WeakMap();
_queryInput = new WeakMap();
_onInputChanged2 = new WeakSet();
onInputChanged_fn2 = function () {
  if (__privateGet(this, _queryInput).value === "") {
    return __privateMethod(this, _onSearchCleared, onSearchCleared_fn).call(
      this
    );
  }
  __privateGet(this, _fetchAbortController)?.abort();
  __privateSet(this, _fetchAbortController, new AbortController());
  try {
    return __privateMethod(
      this,
      _doPredictiveSearch,
      doPredictiveSearch_fn
    ).call(this);
  } catch (e) {
    if (e.name !== "AbortError") {
      throw e;
    }
  }
};
_onFormSubmitted2 = new WeakSet();
onFormSubmitted_fn2 = function (event) {
  if (__privateGet(this, _queryInput).value === "") {
    return event.preventDefault();
  }
};
_doPredictiveSearch = new WeakSet();
doPredictiveSearch_fn = async function () {
  document.documentElement.dispatchEvent(
    new CustomEvent("theme:loading:start", { bubbles: true })
  );
  const url = `${window.Shopify.routes.root}search${
      this.supportsPredictiveApi() ? "/suggest" : ""
    }`,
    queryParams = `q=${
      __privateGet(this, _queryInput).value
    }&section_id=predictive-search&resources[limit]=10&resources[limit_scope]=each`,
    tempDoc = new DOMParser().parseFromString(
      await (
        await cachedFetch(`${url}?${queryParams}`, {
          signal: __privateGet(this, _fetchAbortController).signal,
        })
      ).text(),
      "text/html"
    );
  this.querySelector('[slot="results"]').replaceChildren(
    ...document.importNode(tempDoc.querySelector(".shopify-section"), true)
      .children
  );
  document.documentElement.dispatchEvent(
    new CustomEvent("theme:loading:end", { bubbles: true })
  );
};
_onSearchCleared = new WeakSet();
onSearchCleared_fn = function () {
  __privateGet(this, _fetchAbortController)?.abort();
  __privateGet(this, _queryInput).focus();
  this.querySelector('[slot="results"]').innerHTML = "";
};
if (!window.customElements.get("predictive-search")) {
  window.customElements.define("predictive-search", PredictiveSearch);
}

// js/sections/announcement-bar.js
import { animate as animate11 } from "vendor";
var AnnouncementBarCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () =>
        animate11(
          fromSlide,
          {
            opacity: [1, 0],
            transform: ["translateY(0)", "translateY(-10px)"],
          },
          { duration: 0.25, easing: [0.55, 0.055, 0.675, 0.19] }
        ),
      enterControls: () =>
        animate11(
          toSlide,
          {
            opacity: [0, 1],
            transform: ["translateY(10px)", "translateY(0px)"],
          },
          { duration: 0.4, easing: [0.215, 0.61, 0.355, 1] }
        ),
    };
  }
};
if (!window.customElements.get("announcement-bar-carousel")) {
  window.customElements.define(
    "announcement-bar-carousel",
    AnnouncementBarCarousel
  );
}

// js/sections/before-after-image.js
import { animate as animate12, inView as inView9 } from "vendor";
var _onPointerMoveListener,
  _onTouchMoveListener,
  _touchStartTimestamp,
  _onPointerDown,
  onPointerDown_fn,
  _onPointerMove,
  onPointerMove_fn,
  _onTouchMove,
  onTouchMove_fn,
  _onPointerUp,
  onPointerUp_fn,
  _calculatePosition,
  calculatePosition_fn,
  _animateInitialPosition,
  animateInitialPosition_fn;
var BeforeAfter = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _onPointerDown);
    __privateAdd(this, _onPointerMove);
    __privateAdd(this, _onTouchMove);
    __privateAdd(this, _onPointerUp);
    __privateAdd(this, _calculatePosition);
    __privateAdd(this, _animateInitialPosition);
    __privateAdd(
      this,
      _onPointerMoveListener,
      __privateMethod(this, _onPointerMove, onPointerMove_fn).bind(this)
    );
    __privateAdd(
      this,
      _onTouchMoveListener,
      __privateMethod(this, _onTouchMove, onTouchMove_fn).bind(this)
    );
    __privateAdd(this, _touchStartTimestamp, 0);
    this.addEventListener(
      "pointerdown",
      __privateMethod(this, _onPointerDown, onPointerDown_fn)
    );
  }
  connectedCallback() {
    inView9(
      this,
      __privateMethod(
        this,
        _animateInitialPosition,
        animateInitialPosition_fn
      ).bind(this)
    );
  }
};
_onPointerMoveListener = new WeakMap();
_onTouchMoveListener = new WeakMap();
_touchStartTimestamp = new WeakMap();
_onPointerDown = new WeakSet();
onPointerDown_fn = function (event) {
  if (event.target.tagName === "A") {
    return;
  }
  document.addEventListener(
    "pointerup",
    __privateMethod(this, _onPointerUp, onPointerUp_fn).bind(this),
    { once: true }
  );
  if (matchesMediaQuery("supports-hover")) {
    document.addEventListener(
      "pointermove",
      __privateGet(this, _onPointerMoveListener)
    );
    __privateMethod(this, _calculatePosition, calculatePosition_fn).call(
      this,
      event
    );
  } else {
    const cursor = this.querySelector(".before-after__cursor");
    if (event.target === cursor || cursor.contains(event.target)) {
      document.addEventListener(
        "pointermove",
        __privateGet(this, _onPointerMoveListener)
      );
      this.addEventListener(
        "touchmove",
        __privateGet(this, _onTouchMoveListener),
        { passive: false }
      );
    } else {
      __privateSet(this, _touchStartTimestamp, event.timeStamp);
    }
  }
};
_onPointerMove = new WeakSet();
onPointerMove_fn = function (event) {
  __privateMethod(this, _calculatePosition, calculatePosition_fn).call(
    this,
    event
  );
};
_onTouchMove = new WeakSet();
onTouchMove_fn = function (event) {
  event.preventDefault();
};
_onPointerUp = new WeakSet();
onPointerUp_fn = function (event) {
  this.removeEventListener(
    "touchmove",
    __privateGet(this, _onTouchMoveListener)
  );
  document.removeEventListener(
    "pointermove",
    __privateGet(this, _onPointerMoveListener)
  );
  if (!matchesMediaQuery("supports-hover")) {
    if (event.timeStamp - __privateGet(this, _touchStartTimestamp) <= 250) {
      __privateMethod(this, _calculatePosition, calculatePosition_fn).call(
        this,
        event
      );
    }
  }
};
_calculatePosition = new WeakSet();
calculatePosition_fn = function (event) {
  let rectangle = this.getBoundingClientRect(),
    percentage;
  if (this.hasAttribute("vertical")) {
    percentage = ((event.clientY - rectangle.top) / this.clientHeight) * 100;
  } else {
    percentage = ((event.clientX - rectangle.left) / this.clientWidth) * 100;
    percentage = document.dir === "rtl" ? 100 - percentage : percentage;
  }
  this.style.setProperty(
    "--before-after-cursor-position",
    `${Math.min(Math.max(percentage, 0), 100)}%`
  );
};
_animateInitialPosition = new WeakSet();
animateInitialPosition_fn = function () {
  animate12(
    (progress) => {
      this.style.setProperty(
        "--before-after-cursor-position",
        `calc(var(--before-after-initial-cursor-position) * ${progress})`
      );
    },
    { duration: 0.6, easing: [0.85, 0, 0.15, 1] }
  );
};
if (!window.customElements.get("before-after")) {
  window.customElements.define("before-after", BeforeAfter);
}

// js/sections/blog-posts.js
import {
  animate as animate13,
  stagger as stagger2,
  inView as inView10,
} from "vendor";
var _reveal, reveal_fn;
var BlogPosts = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _reveal);
    if (
      this.hasAttribute("reveal-on-scroll") &&
      matchesMediaQuery("motion-safe")
    ) {
      inView10(this, __privateMethod(this, _reveal, reveal_fn).bind(this), {
        margin: "-50px 0px",
      });
    }
  }
};
_reveal = new WeakSet();
reveal_fn = function () {
  this.style.opacity = "1";
  animate13(
    this.children,
    { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
    {
      duration: 0.25,
      delay: stagger2(0.1, { easing: "ease-out" }),
      easing: "ease",
    }
  );
};
if (!window.customElements.get("blog-posts")) {
  window.customElements.define("blog-posts", BlogPosts);
}

// js/sections/cart-drawer.js
import { animate as animate14, timeline as timeline7 } from "vendor";
var _sectionId,
  _onBundleSection,
  onBundleSection_fn,
  _onCartChange,
  onCartChange_fn,
  _onBeforeShow,
  onBeforeShow_fn,
  _onPageShow,
  onPageShow_fn,
  _refreshCart,
  refreshCart_fn,
  _replaceContent,
  replaceContent_fn;
var CartDrawer = class extends Drawer {
  constructor() {
    super(...arguments);
    /**
     * This method is called when the cart is changing, and allow custom sections to order a "re-render"
     */
    __privateAdd(this, _onBundleSection);
    /**
     * When the cart changes, we need to re-render the cart drawer
     */
    __privateAdd(this, _onCartChange);
    /**
     * Execute the animation when the drawer is opened
     */
    __privateAdd(this, _onBeforeShow);
    /**
     * Modern browsers have a feature called "Back-forward cache" which allows to serve directly from the cache the previous
     * page. Unfortunately, this is causing issues with cart drawer, as it may display stale data. We therefore have to
     * detect the case when a page has been restored from backforward cache, and re-render the section
     */
    __privateAdd(this, _onPageShow);
    /**
     * Allow to refresh the cart when the "cart:refresh" event is triggered
     */
    __privateAdd(this, _refreshCart);
    /**
     * The new HTML element to replace
     */
    __privateAdd(this, _replaceContent);
    __privateAdd(this, _sectionId, void 0);
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _sectionId) ??
      __privateSet(this, _sectionId, extractSectionId(this));
    document.addEventListener(
      "cart:prepare-bundled-sections",
      __privateMethod(this, _onBundleSection, onBundleSection_fn).bind(this),
      { signal: this.abortController.signal }
    );
    document.addEventListener(
      "cart:change",
      __privateMethod(this, _onCartChange, onCartChange_fn).bind(this),
      { signal: this.abortController.signal }
    );
    document.addEventListener(
      "cart:refresh",
      __privateMethod(this, _refreshCart, refreshCart_fn).bind(this),
      { signal: this.abortController.signal }
    );
    window.addEventListener(
      "pageshow",
      __privateMethod(this, _onPageShow, onPageShow_fn).bind(this),
      { signal: this.abortController.signal }
    );
    this.addEventListener(
      "dialog:before-show",
      __privateMethod(this, _onBeforeShow, onBeforeShow_fn)
    );
  }
};
_sectionId = new WeakMap();
_onBundleSection = new WeakSet();
onBundleSection_fn = function (event) {
  event.detail.sections.push(__privateGet(this, _sectionId));
};
_onCartChange = new WeakSet();
onCartChange_fn = async function (event) {
  __privateMethod(this, _replaceContent, replaceContent_fn).call(
    this,
    event.detail.cart["sections"][__privateGet(this, _sectionId)]
  );
  if (
    (window.themeVariables.settings.cartType === "drawer" ||
      event.detail["onSuccessDo"] === "force_open_drawer") &&
    event.detail.baseEvent === "variant:add"
  ) {
    this.show();
  }
};
_onBeforeShow = new WeakSet();
onBeforeShow_fn = async function () {
  const drawerFooter = this.shadowRoot.querySelector('[part="footer"]');
  if (!drawerFooter) {
    return;
  }
  drawerFooter.style.opacity = "0";
  await waitForEvent(this, "dialog:after-show");
  animate14(
    drawerFooter,
    { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
    { duration: 0.25, easing: [0.25, 0.46, 0.45, 0.94] }
  );
};
_onPageShow = new WeakSet();
onPageShow_fn = async function (event) {
  if (!event.persisted) {
    return;
  }
  __privateMethod(this, _refreshCart, refreshCart_fn).call(this);
};
_refreshCart = new WeakSet();
refreshCart_fn = async function () {
  __privateMethod(this, _replaceContent, replaceContent_fn).call(
    this,
    await (
      await fetch(
        `${Shopify.routes.root}?section_id=${__privateGet(this, _sectionId)}`
      )
    ).text()
  );
};
_replaceContent = new WeakSet();
replaceContent_fn = async function (html) {
  const domElement = new DOMParser().parseFromString(html, "text/html"),
    newCartDrawer = document
      .createRange()
      .createContextualFragment(
        domElement
          .getElementById(`shopify-section-${__privateGet(this, _sectionId)}`)
          .querySelector("cart-drawer").innerHTML
      ),
    itemCount = (await fetchCart)["item_count"];
  if (itemCount === 0) {
    const controls = timeline7([
      [
        this.getShadowPartByName("body"),
        { opacity: [1, 0] },
        { duration: 0.15, easing: "ease-in" },
      ],
      [
        this.getShadowPartByName("footer"),
        { opacity: [1, 0], transform: ["translateY(0)", "translateY(30px)"] },
        { duration: 0.15, at: "<", easing: "ease-in" },
      ],
    ]);
    await controls.finished;
    this.replaceChildren(...newCartDrawer.children);
    animate14(
      this.getShadowPartByName("body"),
      { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
      { duration: 0.25, easing: [0.25, 0.46, 0.45, 0.94] }
    );
  } else {
    this.replaceChildren(...newCartDrawer.children);
  }
  this.classList.toggle("drawer--center-body", itemCount === 0);
};
var CartNoteDialog = class extends DialogElement {
  createEnterAnimationControls() {
    return animate14(
      this,
      { transform: ["translateY(100%)", "translateY(0)"] },
      { duration: 0.2, easing: "ease-in" }
    );
  }
  createLeaveAnimationControls() {
    return animate14(
      this,
      { transform: ["translateY(0)", "translateY(100%)"] },
      { duration: 0.2, easing: "ease-in" }
    );
  }
};
if (!window.customElements.get("cart-drawer")) {
  window.customElements.define("cart-drawer", CartDrawer);
}
if (!window.customElements.get("cart-note-dialog")) {
  window.customElements.define("cart-note-dialog", CartNoteDialog);
}

// js/sections/collection.js
import {
  timeline as timeline8,
  inView as inView11,
  Delegate as Delegate6,
} from "vendor";
var _reveal2, reveal_fn2;
var CollectionBanner = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _reveal2);
  }
  connectedCallback() {
    if (
      this.hasAttribute("reveal-on-scroll") &&
      matchesMediaQuery("motion-safe")
    ) {
      inView11(this, __privateMethod(this, _reveal2, reveal_fn2).bind(this));
    }
  }
};
_reveal2 = new WeakSet();
reveal_fn2 = async function () {
  const image = this.querySelector(".content-over-media > picture img"),
    content = this.querySelector(".content-over-media > .prose");
  await imageLoaded(image);
  const transformEffect = (0.15 * 100) / 1.3;
  const imageTransform =
    image.getAttribute("is") === "image-parallax"
      ? [
          `scale(1.5) translateY(-${transformEffect}%)`,
          `scale(1.3) translateY(-${transformEffect}%)`,
        ]
      : ["scale(1.2)", "scale(1)"];
  return timeline8([
    [this, { opacity: 1 }, { duration: 0, easing: [0.25, 0.46, 0.45, 0.94] }],
    [
      image,
      { opacity: [0, 1], transform: imageTransform },
      { duration: 0.8, delay: 0.25, at: "<", easing: [0.25, 0.46, 0.45, 0.94] },
    ],
    [
      content,
      { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
      { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] },
    ],
  ]);
};
var _delegate5,
  _onLayoutSwitch,
  onLayoutSwitch_fn,
  _setCartAttribute,
  setCartAttribute_fn;
var CollectionLayoutSwitch = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onLayoutSwitch);
    __privateAdd(this, _setCartAttribute);
    __privateAdd(this, _delegate5, new Delegate6(this));
  }
  connectedCallback() {
    __privateGet(this, _delegate5).on(
      "click",
      'button[type="button"]',
      __privateMethod(this, _onLayoutSwitch, onLayoutSwitch_fn).bind(this)
    );
  }
  get controlledList() {
    return document.getElementById(this.getAttribute("aria-controls"));
  }
};
_delegate5 = new WeakMap();
_onLayoutSwitch = new WeakSet();
onLayoutSwitch_fn = function (event, target) {
  if (target.classList.contains("is-active")) {
    return;
  }
  this.controlledList.setAttribute(
    `collection-${this.getAttribute("device")}-layout`,
    target.value
  );
  Array.from(this.querySelectorAll("button")).forEach((item) =>
    item.classList.toggle("is-active", item === target)
  );
  this.controlledList.reveal();
  __privateMethod(this, _setCartAttribute, setCartAttribute_fn).call(
    this,
    target.value
  );
};
_setCartAttribute = new WeakSet();
setCartAttribute_fn = function (newLayout) {
  const attributeProperty = `products_${this.getAttribute("device")}_grid_mode`;
  fetch(`${Shopify.routes.root}cart/update.js`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      attributes: {
        [attributeProperty]: newLayout,
      },
    }),
    keepalive: true,
    // Allows to make sure the request is fired even when submitting the form
  });
};
if (!window.customElements.get("collection-banner")) {
  window.customElements.define("collection-banner", CollectionBanner);
}
if (!window.customElements.get("collection-layout-switch")) {
  window.customElements.define(
    "collection-layout-switch",
    CollectionLayoutSwitch
  );
}

// js/sections/countdown-timer.js
import { animate as animate15, inView as inView12 } from "vendor";
var _flips,
  _expirationDate,
  _interval,
  _isVisible,
  _recalculateFlips,
  recalculateFlips_fn;
var CountdownTimer = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _recalculateFlips);
    __privateAdd(this, _flips, void 0);
    __privateAdd(this, _expirationDate, void 0);
    __privateAdd(this, _interval, void 0);
    __privateAdd(this, _isVisible, void 0);
  }
  connectedCallback() {
    __privateSet(
      this,
      _flips,
      Array.from(this.querySelectorAll("countdown-timer-flip"))
    );
    const expiresAt = this.getAttribute("expires-at");
    if (expiresAt !== "") {
      __privateSet(this, _expirationDate, new Date(expiresAt));
      __privateSet(
        this,
        _interval,
        setInterval(
          __privateMethod(this, _recalculateFlips, recalculateFlips_fn).bind(
            this
          ),
          1e3
        )
      );
      __privateMethod(this, _recalculateFlips, recalculateFlips_fn).call(this);
    }
    inView12(
      this,
      () => {
        __privateSet(this, _isVisible, true);
        return () => __privateSet(this, _isVisible, false);
      },
      { margin: "500px" }
    );
  }
  disconnectedCallback() {
    clearInterval(__privateGet(this, _interval));
  }
  get daysFlip() {
    return __privateGet(this, _flips).find(
      (flip) => flip.getAttribute("type") === "days"
    );
  }
  get hoursFlip() {
    return __privateGet(this, _flips).find(
      (flip) => flip.getAttribute("type") === "hours"
    );
  }
  get minutesFlip() {
    return __privateGet(this, _flips).find(
      (flip) => flip.getAttribute("type") === "minutes"
    );
  }
  get secondsFlip() {
    return __privateGet(this, _flips).find(
      (flip) => flip.getAttribute("type") === "seconds"
    );
  }
};
_flips = new WeakMap();
_expirationDate = new WeakMap();
_interval = new WeakMap();
_isVisible = new WeakMap();
_recalculateFlips = new WeakSet();
recalculateFlips_fn = function () {
  const dateNow = /* @__PURE__ */ new Date();
  if (__privateGet(this, _expirationDate) < dateNow) {
    if (this.getAttribute("expiration-behavior") === "hide") {
      this.closest(".shopify-section").remove();
    } else {
      return clearInterval(__privateGet(this, _interval));
    }
  }
  if (!__privateGet(this, _isVisible)) {
    return;
  }
  let delta = Math.abs(__privateGet(this, _expirationDate) - dateNow) / 1e3;
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  const seconds = Math.floor(delta % 60);
  this.daysFlip?.updateValue(days);
  this.hoursFlip?.updateValue(hours);
  this.minutesFlip?.updateValue(minutes);
  this.secondsFlip?.updateValue(seconds);
};
var CountdownTimerFlip = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    let flipHtml = [...this.textContent].map(
      () =>
        `<countdown-timer-flip-digit part="digit" ${
          this.hasAttribute("animate") ? "animate" : ""
        } style="display: inline-block">0</countdown-timer-flip-digit>`
    );
    this.shadowRoot.appendChild(
      document.createRange().createContextualFragment(flipHtml.join(""))
    );
  }
  updateValue(value) {
    this.textContent = Math.min(99, value).toString().padStart(2, "0");
    [...this.textContent].forEach((digit, index) => {
      this.shadowRoot.children[index].setAttribute("number", digit);
    });
  }
};
var CountdownTimerFlipDigit = class extends HTMLElement {
  static observedAttributes = ["number"];
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      document
        .createRange()
        .createContextualFragment("<div><slot></slot></div>")
    );
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    if (
      oldValue === null ||
      oldValue === newValue ||
      !this.hasAttribute("animate")
    ) {
      return (this.textContent = newValue);
    }
    await animate15(
      this.shadowRoot.firstElementChild,
      { opacity: [1, 0], transform: ["translateY(0)", "translateY(-8px)"] },
      { duration: 0.3, easing: [0.64, 0, 0.78, 0] }
    ).finished;
    this.textContent = newValue;
    animate15(
      this.shadowRoot.firstElementChild,
      { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0px)"] },
      { duration: 0.3, easing: [0.22, 1, 0.36, 1] }
    );
  }
};
if (!window.customElements.get("countdown-timer")) {
  window.customElements.define("countdown-timer", CountdownTimer);
}
if (!window.customElements.get("countdown-timer-flip")) {
  window.customElements.define("countdown-timer-flip", CountdownTimerFlip);
}
if (!window.customElements.get("countdown-timer-flip-digit")) {
  window.customElements.define(
    "countdown-timer-flip-digit",
    CountdownTimerFlipDigit
  );
}

// js/sections/customer.js
import { animate as animate16 } from "vendor";
var _loginForm,
  loginForm_get,
  _recoverForm,
  recoverForm_get,
  _switchForm,
  switchForm_fn;
var AccountLogin = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _loginForm);
    __privateAdd(this, _recoverForm);
    __privateAdd(this, _switchForm);
    window.addEventListener(
      "hashchange",
      __privateMethod(this, _switchForm, switchForm_fn).bind(this)
    );
    if (window.location.hash === "#recover") {
      __privateGet(this, _loginForm, loginForm_get).hidden = true;
      __privateGet(this, _recoverForm, recoverForm_get).hidden = false;
    }
  }
};
_loginForm = new WeakSet();
loginForm_get = function () {
  return this.querySelector("#login");
};
_recoverForm = new WeakSet();
recoverForm_get = function () {
  return this.querySelector("#recover");
};
_switchForm = new WeakSet();
switchForm_fn = async function () {
  const fromForm =
      window.location.hash === "#recover"
        ? __privateGet(this, _loginForm, loginForm_get)
        : __privateGet(this, _recoverForm, recoverForm_get),
    toForm =
      window.location.hash === "#recover"
        ? __privateGet(this, _recoverForm, recoverForm_get)
        : __privateGet(this, _loginForm, loginForm_get);
  await animate16(
    fromForm,
    { transform: ["translateY(0)", "translateY(30px)"], opacity: [1, 0] },
    { duration: 0.6, easing: "ease" }
  ).finished;
  fromForm.hidden = true;
  toForm.hidden = false;
  await animate16(
    toForm,
    { transform: ["translateY(30px)", "translateY(0)"], opacity: [0, 1] },
    { duration: 0.6, easing: "ease" }
  );
};
if (!window.customElements.get("account-login")) {
  window.customElements.define("account-login", AccountLogin);
}

// js/sections/faq.js
var _observer, _onObserve, onObserve_fn;
var FaqToc = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onObserve);
    __privateAdd(
      this,
      _observer,
      new IntersectionObserver(
        __privateMethod(this, _onObserve, onObserve_fn).bind(this),
        { rootMargin: "0px 0px -70% 0px" }
      )
    );
  }
  connectedCallback() {
    this.anchoredElements.forEach((anchoredElement) =>
      __privateGet(this, _observer).observe(anchoredElement)
    );
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
  }
  get anchorLinks() {
    return Array.from(this.querySelectorAll('a[href^="#"]'));
  }
  get anchoredElements() {
    return this.anchorLinks.map((anchor) =>
      document.querySelector(anchor.getAttribute("href"))
    );
  }
};
_observer = new WeakMap();
_onObserve = new WeakSet();
onObserve_fn = function (entries) {
  for (const entry of entries) {
    const anchorLink = this.anchorLinks.find(
      (anchor) => anchor.getAttribute("href") === `#${entry.target.id}`
    );
    if (!entry.isIntersecting && anchorLink.classList.contains("is-active")) {
      continue;
    }
    if (entry.isIntersecting) {
      this.anchorLinks.forEach((link) =>
        link.classList.toggle("is-active", link === anchorLink)
      );
    }
  }
};
if (!window.customElements.get("faq-toc")) {
  window.customElements.define("faq-toc", FaqToc);
}

// js/sections/featured-collections.js
import { animate as animate17 } from "vendor";
var FeaturedCollectionsCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () =>
        animate17(
          fromSlide,
          { opacity: [1, 0], transform: ["translateY(0)", "translateY(15px)"] },
          { duration: 0.3, easing: "ease-in" }
        ),
      enterControls: () =>
        animate17(
          toSlide,
          { opacity: [0, 1], transform: ["translateY(15px)", "translateY(0)"] },
          { duration: 0.2, delay: 0.2, easing: "ease-out" }
        ),
    };
  }
};
if (!window.customElements.get("featured-collections-carousel")) {
  window.customElements.define(
    "featured-collections-carousel",
    FeaturedCollectionsCarousel
  );
}

// js/sections/header.js
import {
  animate as animate18,
  timeline as timeline9,
  stagger as stagger3,
  Delegate as Delegate7,
} from "vendor";
var _headerTrackerIntersectionObserver,
  _abortController8,
  _scrollYTrackingPosition,
  _isVisible2,
  _onHeaderTrackerIntersection,
  onHeaderTrackerIntersection_fn,
  _detectMousePosition,
  detectMousePosition_fn,
  _detectScrollDirection,
  detectScrollDirection_fn,
  _setVisibility,
  setVisibility_fn;
var Header = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onHeaderTrackerIntersection);
    __privateAdd(this, _detectMousePosition);
    __privateAdd(this, _detectScrollDirection);
    __privateAdd(this, _setVisibility);
    __privateAdd(
      this,
      _headerTrackerIntersectionObserver,
      new IntersectionObserver(
        __privateMethod(
          this,
          _onHeaderTrackerIntersection,
          onHeaderTrackerIntersection_fn
        ).bind(this)
      )
    );
    __privateAdd(this, _abortController8, void 0);
    __privateAdd(this, _scrollYTrackingPosition, 0);
    __privateAdd(this, _isVisible2, true);
  }
  connectedCallback() {
    __privateSet(this, _abortController8, new AbortController());
    __privateGet(this, _headerTrackerIntersectionObserver).observe(
      document.getElementById("header-scroll-tracker")
    );
    if (this.hasAttribute("hide-on-scroll")) {
      window.addEventListener(
        "scroll",
        __privateMethod(
          this,
          _detectScrollDirection,
          detectScrollDirection_fn
        ).bind(this),
        { signal: __privateGet(this, _abortController8).signal }
      );
      window.addEventListener(
        "pointermove",
        __privateMethod(
          this,
          _detectMousePosition,
          detectMousePosition_fn
        ).bind(this),
        { signal: __privateGet(this, _abortController8).signal }
      );
    }
  }
  disconnectedCallback() {
    __privateGet(this, _abortController8).abort();
  }
};
_headerTrackerIntersectionObserver = new WeakMap();
_abortController8 = new WeakMap();
_scrollYTrackingPosition = new WeakMap();
_isVisible2 = new WeakMap();
_onHeaderTrackerIntersection = new WeakSet();
onHeaderTrackerIntersection_fn = function (entries) {
  this.classList.toggle("is-solid", !entries[0].isIntersecting);
};
_detectMousePosition = new WeakSet();
detectMousePosition_fn = function (event) {
  if (
    event.clientY < 100 &&
    window.matchMedia("screen and (pointer: fine)").matches
  ) {
    __privateMethod(this, _setVisibility, setVisibility_fn).call(this, true);
    __privateSet(this, _scrollYTrackingPosition, 0);
  }
};
_detectScrollDirection = new WeakSet();
detectScrollDirection_fn = function () {
  let isVisible;
  if (
    window.scrollY > __privateGet(this, _scrollYTrackingPosition) &&
    window.scrollY - __privateGet(this, _scrollYTrackingPosition) > 100
  ) {
    isVisible = false;
    __privateSet(this, _scrollYTrackingPosition, window.scrollY);
  } else if (window.scrollY < __privateGet(this, _scrollYTrackingPosition)) {
    __privateSet(this, _scrollYTrackingPosition, window.scrollY);
    isVisible = true;
  }
  if (isVisible !== void 0) {
    __privateMethod(this, _setVisibility, setVisibility_fn).call(
      this,
      isVisible
    );
  }
};
_setVisibility = new WeakSet();
setVisibility_fn = function (isVisible) {
  if (isVisible !== __privateGet(this, _isVisible2)) {
    if (!isVisible && this.querySelectorAll("[open]").length > 0) {
      return;
    }
    __privateSet(this, _isVisible2, isVisible);
    document.documentElement.style.setProperty(
      "--header-is-visible",
      isVisible ? "1" : "0"
    );
    this.classList.toggle("is-hidden", !isVisible);
  }
};
var DropdownMenuDisclosure = class extends MenuDisclosure {
  createShowAnimationControls() {
    let menuItemsSequence = [];
    if (window.themeVariables.settings.staggerMenuApparition) {
      menuItemsSequence = [
        this.contentElement.querySelectorAll(":scope > li"),
        { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] },
        { duration: 0.15, at: "-0.15", delay: stagger3(0.1) },
      ];
    }
    return timeline9([
      [this.contentElement, { opacity: [0, 1] }, { duration: 0.25 }],
      menuItemsSequence,
    ]);
  }
  createHideAnimationControls() {
    return timeline9([
      [this.contentElement, { opacity: [1, 0] }, { duration: 0.4 }],
    ]);
  }
};
var MegaMenuDisclosure = class extends MenuDisclosure {
  createShowAnimationControls() {
    const linklists = Array.from(
      this.contentElement.querySelectorAll(".mega-menu__linklist > li")
    );
    let menuItemsSequence = [];
    if (window.themeVariables.settings.staggerMenuApparition) {
      menuItemsSequence = [
        { name: "content", at: "-0.5" },
        [
          linklists,
          { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] },
          { duration: 0.3, at: "content", delay: stagger3(0.1) },
        ],
        [
          this.contentElement.querySelector(".mega-menu__promo"),
          { opacity: [0, 1] },
          { duration: 0.3, at: "-0.15" },
        ],
      ];
    }
    return timeline9([
      [this.contentElement, { opacity: [0, 1] }, { duration: 0.25 }],
      ...menuItemsSequence,
    ]);
  }
  createHideAnimationControls() {
    return timeline9([
      [this.contentElement, { opacity: [1, 0] }, { duration: 0.4 }],
    ]);
  }
};
var _calculateMaxHeight, calculateMaxHeight_fn;
var HeaderSearch = class extends DialogElement {
  constructor() {
    super();
    __privateAdd(this, _calculateMaxHeight);
    this.addEventListener(
      "dialog:before-show",
      __privateMethod(this, _calculateMaxHeight, calculateMaxHeight_fn).bind(
        this
      )
    );
  }
  get shadowDomTemplate() {
    return "header-search-default-template";
  }
  get shouldLock() {
    return true;
  }
  createEnterAnimationControls() {
    return timeline9([
      [
        this.getShadowPartByName("overlay"),
        { opacity: [0, 1] },
        { duration: 0.2, easing: [0.645, 0.045, 0.355, 1] },
      ],
      [
        this.getShadowPartByName("content"),
        {
          opacity: [0, 1],
          transform: [
            "translateY(calc(-1 * var(--header-height)))",
            "translateY(0)",
          ],
        },
        { duration: 0.2, at: "<", easing: [0.645, 0.045, 0.355, 1] },
      ],
    ]);
  }
  createLeaveAnimationControls() {
    return timeline9([
      [
        this.getShadowPartByName("overlay"),
        { opacity: [1, 0] },
        { duration: 0.2, easing: [0.645, 0.045, 0.355, 1] },
      ],
      [
        this.getShadowPartByName("content"),
        {
          opacity: [1, 0],
          transform: [
            "translateY(0)",
            "translateY(calc(-1 * var(--header-height)))",
          ],
        },
        { duration: 0.2, at: "<", easing: [0.645, 0.045, 0.355, 1] },
      ],
    ]);
  }
};
_calculateMaxHeight = new WeakSet();
calculateMaxHeight_fn = function () {
  const boundingRect = this.getBoundingClientRect(),
    maxHeight = window.innerHeight - boundingRect.top;
  this.style.setProperty("--header-search-max-height", `${maxHeight}px`);
};
var _collapsiblePanel,
  _buttonElements,
  _openCollapsiblePanel,
  openCollapsiblePanel_fn,
  _onSidebarBeforeShow,
  onSidebarBeforeShow_fn,
  _onSidebarAfterShow,
  onSidebarAfterShow_fn,
  _onSidebarBeforeHide,
  onSidebarBeforeHide_fn,
  _onSidebarAfterHide,
  onSidebarAfterHide_fn;
var HeaderSidebar = class extends Drawer {
  constructor() {
    super();
    __privateAdd(this, _openCollapsiblePanel);
    __privateAdd(this, _onSidebarBeforeShow);
    __privateAdd(this, _onSidebarAfterShow);
    __privateAdd(this, _onSidebarBeforeHide);
    __privateAdd(this, _onSidebarAfterHide);
    __privateAdd(this, _collapsiblePanel, void 0);
    __privateAdd(this, _buttonElements, void 0);
    this.addEventListener(
      "dialog:before-show",
      __privateMethod(this, _onSidebarBeforeShow, onSidebarBeforeShow_fn)
    );
    this.addEventListener(
      "dialog:after-show",
      __privateMethod(this, _onSidebarAfterShow, onSidebarAfterShow_fn)
    );
    this.addEventListener(
      "dialog:before-hide",
      __privateMethod(this, _onSidebarBeforeHide, onSidebarBeforeHide_fn)
    );
    this.addEventListener(
      "dialog:after-hide",
      __privateMethod(this, _onSidebarAfterHide, onSidebarAfterHide_fn)
    );
  }
  connectedCallback() {
    super.connectedCallback();
    __privateSet(
      this,
      _collapsiblePanel,
      this.querySelector('[slot="collapsible-panel"]')
    );
    __privateSet(
      this,
      _buttonElements,
      Array.from(
        this.querySelectorAll(
          ".header-sidebar__main-panel .header-sidebar__linklist [aria-controls]"
        )
      )
    );
    __privateGet(this, _buttonElements).forEach((button) =>
      button.addEventListener(
        "click",
        __privateMethod(
          this,
          _openCollapsiblePanel,
          openCollapsiblePanel_fn
        ).bind(this),
        { signal: this.abortController.signal }
      )
    );
  }
  revealItems(withDelay = false) {
    return timeline9([
      [
        this.querySelector(".header-sidebar__main-panel"),
        { opacity: 1, transform: "translateX(0)" },
        { duration: 0, delay: withDelay ? 0.5 : 0 },
      ],
      [
        this.querySelectorAll(
          ".header-sidebar__main-panel .header-sidebar__linklist li"
        ),
        { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] },
        {
          duration: 0.15,
          at: "-0.15",
          delay: window.themeVariables.settings.staggerMenuApparition
            ? stagger3(0.1)
            : 0,
        },
      ],
      [
        this.querySelector(".header-sidebar__footer"),
        { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
        { duration: 0.3 },
      ],
    ]);
  }
};
_collapsiblePanel = new WeakMap();
_buttonElements = new WeakMap();
_openCollapsiblePanel = new WeakSet();
openCollapsiblePanel_fn = function (event) {
  __privateGet(this, _buttonElements).forEach((button) =>
    button.setAttribute(
      "aria-expanded",
      button === event.currentTarget ? "true" : "false"
    )
  );
  __privateGet(this, _collapsiblePanel)?.setAttribute(
    "aria-activedescendant",
    event.currentTarget.getAttribute("aria-controls")
  );
  if (matchesMediaQuery("md-max")) {
    animate18(
      this.querySelector(".header-sidebar__main-panel"),
      { opacity: [1, 0], transform: ["translateX(0)", "translateX(-10px)"] },
      { duration: 0.25 }
    );
  }
};
_onSidebarBeforeShow = new WeakSet();
onSidebarBeforeShow_fn = function () {
  animate18(
    this.querySelector(".header-sidebar__main-panel"),
    { opacity: 0, transform: "translateX(0)" },
    { duration: 0 }
  );
};
_onSidebarAfterShow = new WeakSet();
onSidebarAfterShow_fn = function () {
  this.revealItems();
};
_onSidebarBeforeHide = new WeakSet();
onSidebarBeforeHide_fn = function () {
  if (matchesMediaQuery("md")) {
    __privateGet(this, _collapsiblePanel)?.removeAttribute(
      "aria-activedescendant"
    );
    __privateGet(this, _buttonElements).forEach((button) =>
      button.setAttribute("aria-expanded", "false")
    );
  }
};
_onSidebarAfterHide = new WeakSet();
onSidebarAfterHide_fn = function () {
  if (matchesMediaQuery("md-max")) {
    __privateGet(this, _collapsiblePanel)?.removeAttribute(
      "aria-activedescendant"
    );
    __privateGet(this, _buttonElements).forEach((button) =>
      button.setAttribute("aria-expanded", "false")
    );
  }
  Array.from(this.querySelectorAll("details")).forEach(
    (detail) => (detail.open = false)
  );
};
var _sidebarDelegate, _closePanel, closePanel_fn, _switchPanel, switchPanel_fn;
var HeaderSidebarCollapsiblePanel = class extends DialogElement {
  constructor() {
    super();
    __privateAdd(this, _closePanel);
    /**
     * Switch from one panel to another. The fromPanel may be undefined if there was no previously open panel
     */
    __privateAdd(this, _switchPanel);
    __privateAdd(this, _sidebarDelegate, new Delegate7(this));
    __privateGet(this, _sidebarDelegate).on(
      "click",
      '[data-action="close-panel"]',
      __privateMethod(this, _closePanel, closePanel_fn).bind(this)
    );
  }
  static get observedAttributes() {
    return [...super.observedAttributes, "aria-activedescendant"];
  }
  hideForOutsideClickTarget(target) {
    return false;
  }
  allowOutsideClickForTarget(target) {
    return target.closest(".header-sidebar") !== void 0;
  }
  createEnterAnimationControls() {
    if (matchesMediaQuery("md-max")) {
      return timeline9([
        [
          this,
          { opacity: [0, 1], transform: "translateX(0)" },
          { duration: 0.3 },
        ],
      ]);
    } else {
      return timeline9([
        [
          this,
          {
            opacity: [0, 1],
            transform: [
              "translateX(0)",
              "translateX(calc(var(--transform-logical-flip) * 100%)",
            ],
          },
          { duration: 0.3 },
        ],
      ]);
    }
  }
  createLeaveAnimationControls() {
    if (matchesMediaQuery("md-max")) {
      return timeline9([
        [
          this,
          { opacity: [1, 0], transform: ["translateX(0)", "translateX(10px)"] },
          { duration: 0.3 },
        ],
      ]);
    } else {
      return timeline9([
        [
          this,
          {
            opacity: [1, 0],
            transform: [
              "translateX(calc(var(--transform-logical-flip) * 100%))",
              "translateX(0)",
            ],
          },
          { duration: 0.3 },
        ],
      ]);
    }
  }
  async attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "aria-activedescendant") {
      if (oldValue === newValue) {
        return;
      }
      if (newValue !== null) {
        __privateMethod(this, _switchPanel, switchPanel_fn).call(
          this,
          this.querySelector(`#${oldValue}`),
          this.querySelector(`#${newValue}`)
        );
      } else {
        await this.hide();
        Array.from(this.querySelectorAll(".header-sidebar__sub-panel")).forEach(
          (subPanel) => (subPanel.hidden = true)
        );
      }
    }
  }
};
_sidebarDelegate = new WeakMap();
_closePanel = new WeakSet();
closePanel_fn = function () {
  this.removeAttribute("aria-activedescendant");
  this.closest("header-sidebar").revealItems(true);
};
_switchPanel = new WeakSet();
switchPanel_fn = async function (fromPanel, toPanel) {
  if (!this.open) {
    await this.show();
  }
  if (fromPanel) {
    await animate18(fromPanel, { opacity: [1, 0] }, { duration: 0.15 })
      .finished;
    fromPanel.hidden = true;
    Array.from(fromPanel.querySelectorAll("details")).forEach(
      (detail) => (detail.open = false)
    );
  }
  toPanel.hidden = false;
  const listSelector = matchesMediaQuery("md-max")
    ? ".header-sidebar__back-button, .header-sidebar__linklist li"
    : ".header-sidebar__linklist li";
  timeline9([
    [toPanel, { opacity: 1 }, { duration: 0 }],
    [
      toPanel.querySelectorAll(listSelector),
      { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] },
      {
        duration: 0.15,
        at: "-0.15",
        delay: window.themeVariables.settings.staggerMenuApparition
          ? stagger3(0.1)
          : 0,
      },
    ],
    [
      toPanel.querySelector(".header-sidebar__promo"),
      { opacity: [0, 1] },
      { duration: 0.45 },
    ],
  ]);
};
if (!window.customElements.get("x-header")) {
  window.customElements.define("x-header", Header);
}
if (!window.customElements.get("dropdown-menu-disclosure")) {
  window.customElements.define(
    "dropdown-menu-disclosure",
    DropdownMenuDisclosure,
    { extends: "details" }
  );
}
if (!window.customElements.get("mega-menu-disclosure")) {
  window.customElements.define("mega-menu-disclosure", MegaMenuDisclosure, {
    extends: "details",
  });
}
if (!window.customElements.get("header-search")) {
  window.customElements.define("header-search", HeaderSearch);
}
if (!window.customElements.get("header-sidebar")) {
  window.customElements.define("header-sidebar", HeaderSidebar);
}
if (!window.customElements.get("header-sidebar-collapsible-panel")) {
  window.customElements.define(
    "header-sidebar-collapsible-panel",
    HeaderSidebarCollapsiblePanel
  );
}

// js/sections/image-with-text.js
import { animate as animate19, inView as inView13 } from "vendor";
var _onBecameVisible, onBecameVisible_fn;
var ImageWithText = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onBecameVisible);
  }
  connectedCallback() {
    if (matchesMediaQuery("motion-safe")) {
      inView13(
        this.querySelector('[reveal-on-scroll="true"]'),
        ({ target }) =>
          __privateMethod(this, _onBecameVisible, onBecameVisible_fn).call(
            this,
            target
          ),
        { margin: "-200px 0px 0px 0px" }
      );
    }
  }
};
_onBecameVisible = new WeakSet();
onBecameVisible_fn = async function (target) {
  await imageLoaded(target);
  const fromValue =
    (window.direction === "rtl" ? -1 : 1) *
    (matchesMediaQuery("md-max") ? 0.6 : 1) *
    (this.classList.contains("image-with-text--reverse") ? 25 : -25);
  animate19(
    target,
    { opacity: 1, transform: [`translateX(${fromValue}px)`, "translateX(0)"] },
    { easing: [0.215, 0.61, 0.355, 1] },
    { duration: 0.8 }
  );
};
if (!window.customElements.get("image-with-text")) {
  window.customElements.define("image-with-text", ImageWithText);
}

// js/sections/image-with-text-overlay.js
import { timeline as timeline10, inView as inView14 } from "vendor";
var _preventInitialTransition2, _onBecameVisible2, onBecameVisible_fn2;
var ImageWithTextOverlay = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _onBecameVisible2);
    __privateAdd(this, _preventInitialTransition2, false);
    if (Shopify.designMode) {
      this.closest(".shopify-section").addEventListener(
        "shopify:section:select",
        (event) =>
          __privateSet(this, _preventInitialTransition2, event.detail.load)
      );
    }
  }
  connectedCallback() {
    if (
      matchesMediaQuery("motion-safe") &&
      this.getAttribute("reveal-on-scroll") === "true"
    ) {
      inView14(
        this,
        ({ target }) =>
          __privateMethod(this, _onBecameVisible2, onBecameVisible_fn2).call(
            this,
            target
          ),
        { amount: 0.05 }
      );
    }
  }
};
_preventInitialTransition2 = new WeakMap();
_onBecameVisible2 = new WeakSet();
onBecameVisible_fn2 = async function (target) {
  const media = target.querySelector(
      ".content-over-media > picture img, .content-over-media > svg"
    ),
    content = target.querySelector(".content-over-media > :not(picture, svg)");
  await imageLoaded(media);
  const animationControls = timeline10([
    [target, { opacity: 1 }],
    [
      media,
      {
        opacity: [0, 1],
        scale: [1.1, 1],
        easing: [0.215, 0.61, 0.355, 1],
        duration: 0.8,
      },
    ],
    [content, { opacity: [0, 1], duration: 0.8 }],
  ]);
  if (__privateGet(this, _preventInitialTransition2)) {
    animationControls.finish();
  }
};
if (!window.customElements.get("image-with-text-overlay")) {
  window.customElements.define("image-with-text-overlay", ImageWithTextOverlay);
}

// js/sections/images-with-text-scroll.js
import {
  timeline as timeline11,
  animate as animate20,
  inView as inView15,
  scroll as scroll2,
  ScrollOffset,
} from "vendor";
var _itemElements,
  _imageElements,
  _textElements,
  _visibleImageElement,
  _setupScrollObservers,
  setupScrollObservers_fn,
  _onBreakpointChanged,
  onBreakpointChanged_fn;
var ImagesWithTextScroll = class extends EffectCarousel {
  constructor() {
    super(...arguments);
    /**
     * Setup the different observers for the desktop experience
     */
    __privateAdd(this, _setupScrollObservers);
    /**
     * Due to how different the experience is on mobile and desktop, we use an observer to toggle between one mode and other
     */
    __privateAdd(this, _onBreakpointChanged);
    __privateAdd(this, _itemElements, void 0);
    __privateAdd(this, _imageElements, void 0);
    __privateAdd(this, _textElements, void 0);
    __privateAdd(this, _visibleImageElement, void 0);
  }
  // Reference to the currently visible image elements
  connectedCallback() {
    super.connectedCallback();
    __privateSet(
      this,
      _itemElements,
      Array.from(this.querySelectorAll(".images-with-text-scroll__item"))
    );
    __privateSet(
      this,
      _imageElements,
      Array.from(this.querySelectorAll(".images-with-text-scroll__image"))
    );
    __privateSet(
      this,
      _textElements,
      Array.from(this.querySelectorAll(".images-with-text-scroll__text"))
    );
    __privateSet(
      this,
      _visibleImageElement,
      __privateGet(this, _imageElements)[0]
    );
    inView15(this, () => {
      __privateGet(this, _imageElements).forEach((imageElement) =>
        imageElement.setAttribute("loading", "eager")
      );
    });
    if (matchesMediaQuery("md")) {
      __privateMethod(
        this,
        _setupScrollObservers,
        setupScrollObservers_fn
      ).call(this);
    }
    mediaQueryListener(
      "md",
      __privateMethod(this, _onBreakpointChanged, onBreakpointChanged_fn).bind(
        this
      )
    );
  }
  /**
   * Override the "cellSelector". In this component, what makes a "slide" (on mobile) is the piece of text
   */
  get cellSelector() {
    return ".images-with-text-scroll__item";
  }
  /**
   * Swipe should only be available on mobile and tablet, otherwise it is a scroll-based experience
   */
  get allowSwipe() {
    return matchesMediaQuery("md-max");
  }
  /**
   * Perform the mobile animation
   */
  createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
    let imageAnimationSequence = [],
      toSlideImage = toSlide.querySelector(".images-with-text-scroll__image");
    if (
      toSlideImage &&
      toSlideImage !== __privateGet(this, _visibleImageElement)
    ) {
      imageAnimationSequence.push(
        [
          __privateGet(this, _visibleImageElement),
          { opacity: [1, 0] },
          { duration: 0.8, delay: 0.4 },
        ],
        [
          toSlideImage,
          { opacity: [0, 1] },
          { duration: 0.8, at: "<", delay: 0.4 },
        ]
      );
      __privateSet(this, _visibleImageElement, toSlideImage);
    }
    return timeline11([
      ...imageAnimationSequence,
      [
        fromSlide.querySelector(".images-with-text-scroll__text"),
        { opacity: [1, 0], transform: ["translateY(0)", "translateY(-15px)"] },
        { duration: 0.4, at: "<", easing: [0.55, 0.055, 0.675, 0.19] },
      ],
      [
        toSlide.querySelector(".images-with-text-scroll__text"),
        { opacity: [0, 1], transform: ["translateY(15px)", "translateY(0)"] },
        { duration: 0.4, at: "+0.4", easing: [0.25, 0.46, 0.45, 0.94] },
      ],
    ]);
  }
};
_itemElements = new WeakMap();
_imageElements = new WeakMap();
_textElements = new WeakMap();
_visibleImageElement = new WeakMap();
_setupScrollObservers = new WeakSet();
setupScrollObservers_fn = function () {
  __privateGet(this, _textElements).forEach((textElement) => {
    scroll2(animate20(textElement, { opacity: [0, 0.25, 1, 0.25, 0] }), {
      target: textElement,
      offset: ScrollOffset.Any,
    });
  });
  scroll2(
    (info) => {
      const index = Math.min(
          Math.floor(
            info.y.progress / (1 / __privateGet(this, _itemElements).length)
          ),
          __privateGet(this, _itemElements).length - 1
        ),
        toImage = __privateGet(this, _itemElements)[index].querySelector(
          ".images-with-text-scroll__image"
        );
      if (toImage && toImage !== __privateGet(this, _visibleImageElement)) {
        timeline11([
          [
            __privateGet(this, _visibleImageElement),
            { opacity: [1, 0] },
            { duration: 0.25 },
          ],
          [toImage, { opacity: [0, 1] }, { duration: 0.25, at: "<" }],
        ]);
        __privateSet(this, _visibleImageElement, toImage);
      }
    },
    { target: this, offset: ["start center", "end center"] }
  );
};
_onBreakpointChanged = new WeakSet();
onBreakpointChanged_fn = function (event) {
  if (event.matches) {
    __privateGet(this, _imageElements).forEach((image) => (image.style = null));
    __privateGet(this, _textElements).forEach((text) => (text.style = null));
    __privateMethod(this, _setupScrollObservers, setupScrollObservers_fn).call(
      this
    );
  } else {
    this.getAnimations({ subtree: true }).forEach((animation) =>
      animation.cancel()
    );
  }
};
if (!window.customElements.get("images-with-text-scroll")) {
  window.customElements.define("images-with-text-scroll", ImagesWithTextScroll);
}

// js/sections/main-article.js
import { scroll as scroll3 } from "vendor";
var ArticleToolbar = class extends HTMLElement {
  connectedCallback() {
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      scroll3(
        (info) => {
          this.classList.toggle(
            "is-visible",
            info.y.progress > 0 && info.y.progress < 1
          );
        },
        {
          target: this.closest(".shopify-section"),
          offset: ["100px start", "end start"],
        }
      );
    }
  }
};
if (!window.customElements.get("article-toolbar")) {
  window.customElements.define("article-toolbar", ArticleToolbar);
}

// js/sections/media-grid.js
import { animate as animate21, inView as inView16 } from "vendor";
var _onReveal, onReveal_fn;
var MediaGrid = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onReveal);
  }
  connectedCallback() {
    if (matchesMediaQuery("motion-safe")) {
      inView16(
        this.querySelectorAll('[reveal-on-scroll="true"]'),
        __privateMethod(this, _onReveal, onReveal_fn).bind(this),
        { margin: "-200px 0px 0px 0px" }
      );
    }
  }
};
_onReveal = new WeakSet();
onReveal_fn = async function (entry) {
  await imageLoaded(entry.target.querySelector(":scope > img"));
  animate21(
    entry.target,
    { opacity: [0, 1] },
    { duration: 0.35, easing: "ease" }
  );
};
if (!window.customElements.get("media-grid")) {
  window.customElements.define("media-grid", MediaGrid);
}

// js/sections/multi-column.js
var MultiColumn = class extends HTMLElement {
  constructor() {
    super();
    if (Shopify.designMode) {
      this.addEventListener("shopify:block:select", (event) => {
        event.target.scrollIntoView({
          inline: "center",
          block: "nearest",
          behavior: event.detail["load"] ? "auto" : "smooth",
        });
      });
    }
  }
};
if (!window.customElements.get("multi-column")) {
  window.customElements.define("multi-column", MultiColumn);
}

// js/sections/multiple-media-with-text.js
import { timeline as timeline12, inView as inView17 } from "vendor";
var _preventInitialTransition3, _onBecameVisible3, onBecameVisible_fn3;
var MultipleMediaWithText = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _onBecameVisible3);
    __privateAdd(this, _preventInitialTransition3, false);
    if (Shopify.designMode) {
      this.closest(".shopify-section").addEventListener(
        "shopify:section:select",
        (event) =>
          __privateSet(this, _preventInitialTransition3, event.detail.load)
      );
    }
  }
  connectedCallback() {
    if (
      matchesMediaQuery("motion-safe") &&
      this.hasAttribute("reveal-on-scroll")
    ) {
      inView17(
        this,
        __privateMethod(this, _onBecameVisible3, onBecameVisible_fn3).bind(
          this
        ),
        { margin: "-10% 0px" }
      );
    }
  }
};
_preventInitialTransition3 = new WeakMap();
_onBecameVisible3 = new WeakSet();
onBecameVisible_fn3 = function () {
  const timelineSequence = timeline12([
    [this, { opacity: 1 }, { duration: 0 }],
    "media",
    ...Array.from(
      this.querySelectorAll(".multiple-media-with-text__media-wrapper > *"),
      (media) => {
        return [
          media,
          {
            opacity: [0, 1],
            transform: [
              "rotate(0deg)",
              `rotate(${media.style.getPropertyValue("--media-rotate")})`,
            ],
          },
          { duration: 0.5, at: "media" },
        ];
      }
    ),
    [
      this.querySelector(".multiple-media-with-text__content-wrapper"),
      { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
      { duration: 0.5 },
    ],
  ]);
  if (__privateGet(this, _preventInitialTransition3)) {
    timelineSequence.finish();
  }
};
if (!window.customElements.get("multiple-media-with-text")) {
  window.customElements.define(
    "multiple-media-with-text",
    MultipleMediaWithText
  );
}

// js/sections/newsletter-popup.js
var NewsletterPopup = class extends PopIn {
  connectedCallback() {
    super.connectedCallback();
    if (this.shouldAppearAutomatically) {
      setTimeout(() => this.show(), this.apparitionDelay);
    }
  }
  get apparitionDelay() {
    return parseInt(this.getAttribute("apparition-delay") || 0) * 1e3;
  }
  get shouldAppearAutomatically() {
    return !(
      localStorage.getItem("theme:popup-filled") === "true" ||
      (this.hasAttribute("only-once") &&
        localStorage.getItem("theme:popup-appeared") === "true")
    );
  }
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === "open" && this.open) {
      localStorage.setItem("theme:popup-appeared", "true");
    }
  }
};
if (!window.customElements.get("newsletter-popup")) {
  window.customElements.define("newsletter-popup", NewsletterPopup);
}

// js/sections/privacy-banner.js
import { Delegate as Delegate8 } from "vendor";
var _delegate6,
  _onConsentLibraryLoaded,
  onConsentLibraryLoaded_fn,
  _acceptPolicy,
  acceptPolicy_fn,
  _declinePolicy,
  declinePolicy_fn;
var PrivacyBanner = class extends PopIn {
  constructor() {
    super();
    __privateAdd(this, _onConsentLibraryLoaded);
    __privateAdd(this, _acceptPolicy);
    __privateAdd(this, _declinePolicy);
    __privateAdd(this, _delegate6, new Delegate8(this));
    window.Shopify.loadFeatures([
      {
        name: "consent-tracking-api",
        version: "0.1",
        onLoad: __privateMethod(
          this,
          _onConsentLibraryLoaded,
          onConsentLibraryLoaded_fn
        ).bind(this),
      },
    ]);
  }
  connectedCallback() {
    super.connectedCallback();
    __privateGet(this, _delegate6).on(
      "click",
      '[data-action="accept"]',
      __privateMethod(this, _acceptPolicy, acceptPolicy_fn).bind(this)
    );
    __privateGet(this, _delegate6).on(
      "click",
      '[data-action="decline"]',
      __privateMethod(this, _declinePolicy, declinePolicy_fn).bind(this)
    );
  }
  disconnectedCallback() {
    __privateGet(this, _delegate6).off();
  }
};
_delegate6 = new WeakMap();
_onConsentLibraryLoaded = new WeakSet();
onConsentLibraryLoaded_fn = function () {
  if (window.Shopify.customerPrivacy?.shouldShowBanner()) {
    this.show();
  }
};
_acceptPolicy = new WeakSet();
acceptPolicy_fn = function () {
  window.Shopify.customerPrivacy?.setTrackingConsent(
    true,
    this.hide.bind(this)
  );
};
_declinePolicy = new WeakSet();
declinePolicy_fn = function () {
  window.Shopify.customerPrivacy?.setTrackingConsent(
    false,
    this.hide.bind(this)
  );
};
if (!window.customElements.get("privacy-banner")) {
  window.customElements.define("privacy-banner", PrivacyBanner);
}

// js/sections/product.js
var _intersectionObserver2,
  _formElement,
  _footerElement,
  _latestFooterCondition,
  _latestFormCondition,
  _onFormVisibilityChange,
  onFormVisibilityChange_fn;
var ProductStickyBar = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _onFormVisibilityChange);
    __privateAdd(
      this,
      _intersectionObserver2,
      new IntersectionObserver(
        __privateMethod(
          this,
          _onFormVisibilityChange,
          onFormVisibilityChange_fn
        ).bind(this)
      )
    );
    __privateAdd(this, _formElement, void 0);
    __privateAdd(this, _footerElement, void 0);
    __privateAdd(this, _latestFooterCondition, false);
    __privateAdd(this, _latestFormCondition, false);
  }
  connectedCallback() {
    __privateSet(this, _formElement, document.forms[this.getAttribute("form")]);
    __privateSet(
      this,
      _footerElement,
      document.querySelector(".shopify-section--footer")
    );
    if (__privateGet(this, _formElement)) {
      __privateGet(this, _intersectionObserver2).observe(
        __privateGet(this, _formElement)
      );
      __privateGet(this, _intersectionObserver2).observe(
        __privateGet(this, _footerElement)
      );
    }
  }
};
_intersectionObserver2 = new WeakMap();
_formElement = new WeakMap();
_footerElement = new WeakMap();
_latestFooterCondition = new WeakMap();
_latestFormCondition = new WeakMap();
_onFormVisibilityChange = new WeakSet();
onFormVisibilityChange_fn = function (entries) {
  const [formEntry, footerEntry] = [
    entries.find((entry) => entry.target === __privateGet(this, _formElement)),
    entries.find(
      (entry) => entry.target === __privateGet(this, _footerElement)
    ),
  ];
  if (formEntry) {
    __privateSet(
      this,
      _latestFormCondition,
      !formEntry.isIntersecting && formEntry.boundingClientRect.bottom < 0
    );
  }
  if (footerEntry) {
    __privateSet(this, _latestFooterCondition, !footerEntry.isIntersecting);
  }
  this.classList.toggle(
    "is-visible",
    __privateGet(this, _latestFooterCondition) &&
      __privateGet(this, _latestFormCondition)
  );
};
if (!window.customElements.get("product-sticky-bar")) {
  window.customElements.define("product-sticky-bar", ProductStickyBar);
}

// js/sections/product-recommendations.js
var _isLoaded, _loadRecommendations, loadRecommendations_fn;
var ProductRecommendations = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _loadRecommendations);
    __privateAdd(this, _isLoaded, false);
  }
  connectedCallback() {
    __privateMethod(this, _loadRecommendations, loadRecommendations_fn).call(
      this
    );
  }
};
_isLoaded = new WeakMap();
_loadRecommendations = new WeakSet();
loadRecommendations_fn = async function () {
  if (__privateGet(this, _isLoaded)) {
    return;
  }
  __privateSet(this, _isLoaded, true);
  const section = this.closest(".shopify-section"),
    intent = this.getAttribute("intent") || "related",
    url = `${
      Shopify.routes.root
    }recommendations/products?product_id=${this.getAttribute(
      "product"
    )}&limit=${this.getAttribute("limit") || 4}&section_id=${extractSectionId(
      section
    )}&intent=${intent}`,
    response = await fetch(url, {
      priority: intent === "related" ? "low" : "auto",
    });
  const tempDiv = new DOMParser().parseFromString(
      await response.text(),
      "text/html"
    ),
    productRecommendationsElement = tempDiv.querySelector(
      "product-recommendations"
    );
  if (productRecommendationsElement.childElementCount > 0) {
    this.replaceChildren(
      ...document.importNode(productRecommendationsElement, true).childNodes
    );
    this.hidden = false;
  } else {
    this.remove();
  }
};
if (!window.customElements.get("product-recommendations")) {
  window.customElements.define(
    "product-recommendations",
    ProductRecommendations
  );
}

// js/sections/recently-viewed-products.js
var _isLoaded2,
  _searchQueryString,
  searchQueryString_get,
  _loadProducts,
  loadProducts_fn;
var RecentlyViewedProducts = class extends HTMLElement {
  constructor() {
    super(...arguments);
    __privateAdd(this, _searchQueryString);
    __privateAdd(this, _loadProducts);
    __privateAdd(this, _isLoaded2, false);
  }
  connectedCallback() {
    __privateMethod(this, _loadProducts, loadProducts_fn).call(this);
  }
};
_isLoaded2 = new WeakMap();
_searchQueryString = new WeakSet();
searchQueryString_get = function () {
  const items = new Set(
    JSON.parse(localStorage.getItem("theme:recently-viewed-products") || "[]")
  );
  if (this.hasAttribute("exclude-id")) {
    items.delete(parseInt(this.getAttribute("exclude-id")));
  }
  return Array.from(items.values(), (item) => `id:${item}`)
    .slice(0, parseInt(this.getAttribute("products-count")))
    .join(" OR ");
};
_loadProducts = new WeakSet();
loadProducts_fn = async function () {
  if (__privateGet(this, _isLoaded2)) {
    return;
  }
  __privateSet(this, _isLoaded2, true);
  const section = this.closest(".shopify-section"),
    url = `${Shopify.routes.root}search?type=product&q=${__privateGet(
      this,
      _searchQueryString,
      searchQueryString_get
    )}&section_id=${extractSectionId(section)}`,
    response = await fetch(url, { priority: "low" });
  const tempDiv = new DOMParser().parseFromString(
      await response.text(),
      "text/html"
    ),
    recentlyViewedProductsElement = tempDiv.querySelector(
      "recently-viewed-products"
    );
  if (recentlyViewedProductsElement.childElementCount > 0) {
    this.replaceChildren(
      ...document.importNode(recentlyViewedProductsElement, true).childNodes
    );
  } else {
    section.remove();
  }
};
if (!window.customElements.get("recently-viewed-products")) {
  window.customElements.define(
    "recently-viewed-products",
    RecentlyViewedProducts
  );
}

// js/sections/shop-the-look.js
import { animate as animate22, timeline as timeline13 } from "vendor";
var _controlledPopover,
  _selectedHotSpot,
  _setInitialPosition,
  setInitialPosition_fn,
  _onSpotSelected,
  onSpotSelected_fn,
  _onUpdateHotSpotPosition,
  onUpdateHotSpotPosition_fn,
  _onLookChanged,
  onLookChanged_fn,
  _changeLookFocalPoint,
  changeLookFocalPoint_fn,
  _restorePosition,
  restorePosition_fn;
var ShopTheLookMobileCarousel = class extends ScrollCarousel {
  constructor() {
    super();
    __privateAdd(this, _setInitialPosition);
    __privateAdd(this, _onSpotSelected);
    __privateAdd(this, _onUpdateHotSpotPosition);
    __privateAdd(this, _onLookChanged);
    __privateAdd(this, _changeLookFocalPoint);
    __privateAdd(this, _restorePosition);
    __privateAdd(this, _controlledPopover, void 0);
    __privateAdd(this, _selectedHotSpot, void 0);
    this.addEventListener(
      "carousel:change",
      __privateMethod(this, _onLookChanged, onLookChanged_fn)
    );
    Array.from(this.querySelectorAll(".shop-the-look__hot-spot-list")).forEach(
      (list) => {
        list.carousel.addEventListener(
          "carousel:select",
          __privateMethod(this, _onSpotSelected, onSpotSelected_fn).bind(this)
        );
        list.carousel.addEventListener("carousel:change", () =>
          __privateMethod(
            this,
            _onUpdateHotSpotPosition,
            onUpdateHotSpotPosition_fn
          ).call(this, list)
        );
      }
    );
    Array.from(this.querySelectorAll(".shop-the-look__popover")).forEach(
      (popover) => {
        popover.addEventListener(
          "dialog:before-show",
          __privateMethod(
            this,
            _changeLookFocalPoint,
            changeLookFocalPoint_fn
          ).bind(this)
        );
        popover.addEventListener(
          "dialog:before-hide",
          __privateMethod(this, _restorePosition, restorePosition_fn).bind(this)
        );
      }
    );
  }
  connectedCallback() {
    super.connectedCallback();
    __privateMethod(this, _setInitialPosition, setInitialPosition_fn).call(
      this
    );
  }
  get isExpanded() {
    return this.classList.contains("is-expanded");
  }
};
_controlledPopover = new WeakMap();
_selectedHotSpot = new WeakMap();
_setInitialPosition = new WeakSet();
setInitialPosition_fn = function () {
  __privateSet(
    this,
    _selectedHotSpot,
    this.selectedCell.querySelector(
      '.shop-the-look__hot-spot[aria-current="true"]'
    )
  );
  __privateMethod(this, _onLookChanged, onLookChanged_fn).call(this);
};
_onSpotSelected = new WeakSet();
onSpotSelected_fn = function () {
  if (!this.isExpanded) {
    document
      .getElementById(this.selectedCell.getAttribute("data-popover-id"))
      .show();
  }
};
_onUpdateHotSpotPosition = new WeakSet();
onUpdateHotSpotPosition_fn = function (list) {
  __privateSet(
    this,
    _selectedHotSpot,
    list.querySelector('.shop-the-look__hot-spot[aria-current="true"]')
  );
  if (this.isExpanded) {
    __privateMethod(this, _changeLookFocalPoint, changeLookFocalPoint_fn).call(
      this
    );
  }
};
_onLookChanged = new WeakSet();
onLookChanged_fn = function () {
  const popoverId = this.selectedCell.getAttribute("data-popover-id");
  __privateSet(this, _controlledPopover, document.getElementById(popoverId));
  this.nextElementSibling.setAttribute("aria-controls", popoverId);
};
_changeLookFocalPoint = new WeakSet();
changeLookFocalPoint_fn = function () {
  const scale = window.innerWidth / this.selectedCell.clientWidth,
    remainingSpace =
      window.innerHeight -
      __privateGet(this, _controlledPopover).shadowRoot.querySelector(
        '[part="base"]'
      ).clientHeight,
    imageHeightAfterScale = Math.round(
      this.selectedCell.querySelector(".shop-the-look__image-wrapper")
        .clientHeight * scale
    ),
    outsideViewportImageHeight = Math.max(
      imageHeightAfterScale - remainingSpace,
      0
    ),
    insideViewportImageHeight =
      imageHeightAfterScale - outsideViewportImageHeight,
    hotSpotFocalPoint = Math.round(
      (__privateGet(this, _selectedHotSpot).offsetTop +
        __privateGet(this, _selectedHotSpot).clientHeight / 2) *
        scale
    ),
    offsetToMove = Math.round(
      hotSpotFocalPoint - insideViewportImageHeight / 2
    ),
    minTranslateY = Math.round(
      -(
        this.parentElement.getBoundingClientRect().top -
        (imageHeightAfterScale - this.selectedCell.offsetHeight) / 2
      )
    ),
    maxTranslateY = Math.round(minTranslateY - outsideViewportImageHeight),
    translateY = Math.min(
      Math.max(minTranslateY - offsetToMove, maxTranslateY),
      minTranslateY
    );
  if (!this.isExpanded) {
    animate22(
      this,
      {
        transform: [
          "translateY(0) scale(1)",
          `translateY(${translateY}px) scale(${scale})`,
        ],
      },
      { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] }
    );
    document.documentElement.style.setProperty("--hide-header-group", "1");
  } else {
    animate22(
      this,
      { transform: `translateY(${translateY}px) scale(${scale})` },
      { duration: 0.4, easing: "ease-in-out" }
    );
  }
  this.classList.add("is-expanded");
};
_restorePosition = new WeakSet();
restorePosition_fn = function () {
  animate22(
    this,
    { transform: "translateY(0) scale(1)" },
    { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] }
  ).finished.then(() => {
    this.style.transform = null;
  });
  this.classList.remove("is-expanded");
  document.documentElement.style.removeProperty("--hide-header-group");
};
var _updateButtonLink, updateButtonLink_fn;
var ShopTheLookProductListCarousel = class extends EffectCarousel {
  constructor() {
    super();
    __privateAdd(this, _updateButtonLink);
    this.addEventListener(
      "carousel:change",
      __privateMethod(this, _updateButtonLink, updateButtonLink_fn).bind(this)
    );
  }
};
_updateButtonLink = new WeakSet();
updateButtonLink_fn = function (event) {
  const productCard = event.detail.cell.querySelector(".product-card");
  if (productCard.hasAttribute("handle")) {
    this.nextElementSibling.href = `${
      Shopify.routes.root
    }products/${productCard.getAttribute("handle")}`;
  }
};
var ShopTheLookDesktopCarousel = class extends EffectCarousel {
  createOnBecameVisibleAnimationControls(toSlide) {
    return animate22(
      toSlide.querySelectorAll(".shop-the-look__item-content"),
      { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
      { duration: 0.5 }
    );
  }
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return timeline13([
      [
        fromSlide.querySelectorAll(".shop-the-look__item-content"),
        { opacity: [1, 0] },
        { duration: 0.3 },
      ],
      [
        fromSlide.querySelectorAll(".shop-the-look__image-wrapper > *"),
        { opacity: [1, 0], transform: ["translateX(0)", "translateX(-15px)"] },
        { duration: 0.5, at: "<", easing: [0.645, 0.045, 0.355, 1] },
      ],
      [
        toSlide.querySelectorAll(".shop-the-look__image-wrapper > *"),
        { opacity: [0, 1], transform: ["translateX(-15px)", "translateX(0)"] },
        { duration: 0.5, at: "<" },
      ],
      [
        toSlide.querySelectorAll(".shop-the-look__item-content"),
        { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
        { duration: 0.5, at: "-0.1" },
      ],
    ]);
  }
};
var ShopTheLookPopover = class extends Popover {
  hideForOutsideClickTarget(target) {
    return false;
  }
  allowOutsideClickForTarget(target) {
    return target.classList.contains("shop-the-look__hot-spot");
  }
};
if (!window.customElements.get("shop-the-look-mobile-carousel")) {
  window.customElements.define(
    "shop-the-look-mobile-carousel",
    ShopTheLookMobileCarousel
  );
}
if (!window.customElements.get("shop-the-look-product-list-carousel")) {
  window.customElements.define(
    "shop-the-look-product-list-carousel",
    ShopTheLookProductListCarousel
  );
}
if (!window.customElements.get("shop-the-look-desktop-carousel")) {
  window.customElements.define(
    "shop-the-look-desktop-carousel",
    ShopTheLookDesktopCarousel
  );
}
if (!window.customElements.get("shop-the-look-popover")) {
  window.customElements.define("shop-the-look-popover", ShopTheLookPopover);
}

// js/sections/slideshow.js
import { timeline as timeline14, Delegate as Delegate9 } from "vendor";
var _delegate7,
  _onVideoEndedListener,
  _autoplayPauseOnVideo,
  autoplayPauseOnVideo_get,
  _getSlideEnteringSequence,
  getSlideEnteringSequence_fn,
  _getSlideLeavingSequence,
  getSlideLeavingSequence_fn,
  _muteVideo,
  muteVideo_fn,
  _unmuteVideo,
  unmuteVideo_fn,
  _onVolumeChange,
  onVolumeChange_fn,
  _onSlideSettle,
  onSlideSettle_fn,
  _onVideoEnded,
  onVideoEnded_fn,
  _onNextButtonClicked,
  onNextButtonClicked_fn,
  _handleAutoplayProgress,
  handleAutoplayProgress_fn;
var SlideshowCarousel = class extends EffectCarousel {
  constructor() {
    super();
    /**
     * If this attribute is available, then the carousel will stop autoplaying when a video plays
     */
    __privateAdd(this, _autoplayPauseOnVideo);
    /**
     * Generate the part of the sequence when the given slide is entering
     */
    __privateAdd(this, _getSlideEnteringSequence);
    /**
     * Generate the part of the sequence when the given slide is leaving
     */
    __privateAdd(this, _getSlideLeavingSequence);
    /**
     * Mute the video for the active slide, by ignoring the video that may not be visible
     */
    __privateAdd(this, _muteVideo);
    /**
     * Unmute the video for the active slide, by ignoring the video that may not be visible
     */
    __privateAdd(this, _unmuteVideo);
    /**
     * Update the volume controls button (if any) based on whether the video is mute or not
     */
    __privateAdd(this, _onVolumeChange);
    /**
     * Do action when the slide settles
     */
    __privateAdd(this, _onSlideSettle);
    /**
     * If the merchant decide to autorotate but to stop autoplay when video is playing, we register a listener that
     * will move to the next slide (if any)
     */
    __privateAdd(this, _onVideoEnded);
    /**
     * Scroll to the next section when the button is clicked, by leveraging JS native scroll
     */
    __privateAdd(this, _onNextButtonClicked);
    /**
     * Set up the proper CSS variables to show the circular progress bar based on the autoplay properties
     */
    __privateAdd(this, _handleAutoplayProgress);
    __privateAdd(this, _delegate7, new Delegate9(this));
    __privateAdd(
      this,
      _onVideoEndedListener,
      __privateMethod(this, _onVideoEnded, onVideoEnded_fn).bind(this)
    );
    __privateGet(this, _delegate7).on(
      "click",
      '[data-action="navigate-next"]',
      __privateMethod(this, _onNextButtonClicked, onNextButtonClicked_fn).bind(
        this
      )
    );
    __privateGet(this, _delegate7).on(
      "click",
      '[data-action="unmute"]',
      __privateMethod(this, _unmuteVideo, unmuteVideo_fn).bind(this)
    );
    __privateGet(this, _delegate7).on(
      "click",
      '[data-action="mute"]',
      __privateMethod(this, _muteVideo, muteVideo_fn).bind(this)
    );
    this.addEventListener(
      "volumechange",
      __privateMethod(this, _onVolumeChange, onVolumeChange_fn),
      { capture: true }
    );
    this.addEventListener(
      "carousel:settle",
      __privateMethod(this, _onSlideSettle, onSlideSettle_fn)
    );
    if (this.hasAttribute("autoplay") && this.player) {
      this.player.addEventListener(
        "player:start",
        __privateMethod(
          this,
          _handleAutoplayProgress,
          handleAutoplayProgress_fn
        ).bind(this)
      );
      this.player.addEventListener(
        "player:stop",
        __privateMethod(
          this,
          _handleAutoplayProgress,
          handleAutoplayProgress_fn
        ).bind(this)
      );
      this.player.addEventListener(
        "player:visibility-pause",
        __privateMethod(
          this,
          _handleAutoplayProgress,
          handleAutoplayProgress_fn
        ).bind(this)
      );
      this.player.addEventListener(
        "player:visibility-resume",
        __privateMethod(
          this,
          _handleAutoplayProgress,
          handleAutoplayProgress_fn
        ).bind(this)
      );
    }
  }
  disconnectedCallback() {
    __privateGet(this, _delegate7).destroy();
  }
  /**
   * Check when the media is fully loaded so that we can initiate the switch
   */
  async createOnBecameVisibleAnimationControls(toSlide) {
    if (toSlide.getAttribute("media-type") === "image") {
      await imageLoaded(toSlide.querySelectorAll("img"));
    } else {
      await videoLoaded(toSlide.querySelectorAll("video"));
    }
    if (toSlide.hasAttribute("reveal-on-scroll")) {
      return timeline14([
        ...__privateMethod(
          this,
          _getSlideEnteringSequence,
          getSlideEnteringSequence_fn
        ).call(this, toSlide),
      ]);
    }
    return { finished: Promise.resolve() };
  }
  /**
   * Create the animation when it changes from one slide to another, by making sure to properly handling the videos
   */
  createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
    const fromVideo = Array.from(fromSlide.querySelectorAll("video")),
      toVideo = Array.from(toSlide.querySelectorAll("video")).filter(
        (video) => video.offsetParent
      );
    fromSlide.removeEventListener(
      "ended",
      __privateGet(this, _onVideoEndedListener),
      { capture: true }
    );
    fromVideo.forEach((video) => {
      video.muted = true;
      video.pause();
    });
    toVideo.forEach((video) => {
      video.muted = true;
      video.currentTime = 0;
      video.play();
    });
    return {
      leaveControls: () =>
        timeline14(
          __privateMethod(
            this,
            _getSlideLeavingSequence,
            getSlideLeavingSequence_fn
          ).call(this, fromSlide)
        ),
      enterControls: () =>
        timeline14(
          __privateMethod(
            this,
            _getSlideEnteringSequence,
            getSlideEnteringSequence_fn
          ).call(this, toSlide)
        ),
    };
  }
};
_delegate7 = new WeakMap();
_onVideoEndedListener = new WeakMap();
_autoplayPauseOnVideo = new WeakSet();
autoplayPauseOnVideo_get = function () {
  return this.hasAttribute("autoplay-pause-on-video");
};
_getSlideEnteringSequence = new WeakSet();
getSlideEnteringSequence_fn = function (slide) {
  const slideContent = slide.querySelector(".slideshow__slide-content");
  if (slideContent.classList.contains("slideshow__slide-content--boxed")) {
    return [
      [
        slide,
        { opacity: [0, 1] },
        { duration: 0.8, easing: [0.25, 0.46, 0.45, 0.94] },
      ],
      [
        slide.querySelectorAll(
          ".content-over-media > :is(video-media, svg), .content-over-media > picture img"
        ),
        { opacity: [0, 1], transform: ["scale(1.2)", "scale(1)"] },
        { duration: 0.8, at: "<", easing: [0.25, 0.46, 0.45, 0.94] },
      ],
      [
        slideContent,
        { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
        { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] },
      ],
    ];
  } else {
    return [
      [
        slide,
        { opacity: [0, 1] },
        { duration: 0.8, easing: [0.25, 0.46, 0.45, 0.94] },
      ],
      [
        slide.querySelectorAll(
          ".content-over-media > :is(video-media, svg), .content-over-media > picture img"
        ),
        { opacity: [0, 1], transform: ["scale(1.2)", "scale(1)"] },
        { duration: 0.8, at: "<", easing: [0.25, 0.46, 0.45, 0.94] },
      ],
      [
        slideContent.querySelector(".prose"),
        { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
        { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] },
      ],
      [
        slideContent.querySelector(".button-group"),
        { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0)"] },
        { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] },
      ],
    ];
  }
};
_getSlideLeavingSequence = new WeakSet();
getSlideLeavingSequence_fn = function (slide) {
  const slideContent = slide.querySelector(".slideshow__slide-content");
  if (slideContent.classList.contains("slideshow__slide-content--boxed")) {
    return [
      [
        slideContent,
        { opacity: [1, 0], transform: ["translateY(0)", "translateY(20px)"] },
        { duration: 0.25, at: "leaving", easing: [0.55, 0.055, 0.675, 0.19] },
      ],
      [
        slide.querySelectorAll(
          ".content-over-media > :is(video-media, svg), .content-over-media > picture img"
        ),
        { opacity: [1, 0] },
        { duration: 0.2, at: "-0.1", easing: [0.55, 0.055, 0.675, 0.19] },
      ],
    ];
  } else {
    return [
      [
        slideContent.querySelector(".prose"),
        { opacity: [1, 0], transform: ["translateY(0)", "translateY(10px)"] },
        { duration: 0.25, at: "leaving", easing: [0.55, 0.055, 0.675, 0.19] },
      ],
      [
        slideContent.querySelector(".button-group"),
        { opacity: [1, 0], transform: ["translateY(0)", "translateY(20px)"] },
        { duration: 0.25, at: "<", easing: [0.55, 0.055, 0.675, 0.19] },
      ],
      [
        slide.querySelectorAll(
          ".content-over-media > :is(video-media, svg), .content-over-media > picture img"
        ),
        { opacity: [1, 0] },
        { duration: 0.2, at: "-0.1", easing: [0.55, 0.055, 0.675, 0.19] },
      ],
    ];
  }
};
_muteVideo = new WeakSet();
muteVideo_fn = function (event) {
  event.preventDefault();
  Array.from(this.selectedCell.querySelectorAll("video"))
    .filter((video) => video.offsetParent)
    .forEach((video) => (video.muted = true));
};
_unmuteVideo = new WeakSet();
unmuteVideo_fn = function (event) {
  event.preventDefault();
  Array.from(this.selectedCell.querySelectorAll("video"))
    .filter((video) => video.offsetParent)
    .forEach((video) => (video.muted = false));
};
_onVolumeChange = new WeakSet();
onVolumeChange_fn = function (event) {
  const volumeControl = event.target
    .closest(".slideshow__slide")
    .querySelector(".slideshow__volume-control");
  if (volumeControl) {
    volumeControl.querySelector('[data-action="unmute"]').hidden =
      !event.target.muted;
    volumeControl.querySelector('[data-action="mute"]').hidden =
      event.target.muted;
  }
};
_onSlideSettle = new WeakSet();
onSlideSettle_fn = function (event) {
  const videoList = Array.from(event.detail.cell.querySelectorAll("video"));
  if (
    __privateGet(this, _autoplayPauseOnVideo, autoplayPauseOnVideo_get) &&
    this.cells.length > 1 &&
    videoList.length > 0
  ) {
    this.player?.pause();
    videoList.forEach((video) => (video.loop = false));
    event.detail.cell.addEventListener(
      "ended",
      __privateGet(this, _onVideoEndedListener),
      { capture: true, once: true }
    );
  }
};
_onVideoEnded = new WeakSet();
onVideoEnded_fn = function () {
  this.next();
};
_onNextButtonClicked = new WeakSet();
onNextButtonClicked_fn = function () {
  this.closest(".shopify-section").nextElementSibling?.scrollIntoView({
    block: "start",
    behavior: "smooth",
  });
};
_handleAutoplayProgress = new WeakSet();
handleAutoplayProgress_fn = function (event) {
  switch (event.type) {
    case "player:start":
      let autoplayDuration = this.getAttribute("autoplay");
      if (
        __privateGet(this, _autoplayPauseOnVideo, autoplayPauseOnVideo_get) &&
        this.selectedCell.getAttribute("media-type") === "video"
      ) {
        const video = Array.from(this.selectedCell.querySelectorAll("video"))
          .filter((video2) => video2.offsetParent)
          .pop();
        if (video) {
          autoplayDuration = video.duration;
        }
      }
      this.style.setProperty(
        "--slideshow-progress-duration",
        `${autoplayDuration}s`
      );
      this.style.setProperty("--slideshow-progress-play-state", "running");
      break;
    case "player:stop":
      this.style.setProperty("--slideshow-progress-duration", `0s`);
      this.style.setProperty("--slideshow-progress-play-state", "paused");
      break;
    case "player:visibility-pause":
      this.style.setProperty("--slideshow-progress-play-state", "paused");
      break;
    case "player:visibility-resume":
      this.style.setProperty("--slideshow-progress-play-state", "running");
      break;
  }
};
if (!window.customElements.get("slideshow-carousel")) {
  window.customElements.define("slideshow-carousel", SlideshowCarousel);
}

// js/sections/testimonials.js
import { animate as animate23 } from "vendor";
var TestimonialCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide, { direction }) {
    return {
      leaveControls: () =>
        animate23(
          fromSlide,
          {
            opacity: [1, 0],
            transform: ["translateY(0)", "translateY(-15px)"],
          },
          { duration: 0.4, easing: [0.55, 0.055, 0.675, 0.19] }
        ),
      enterControls: () =>
        animate23(
          toSlide,
          { opacity: [0, 1], transform: ["translateY(15px)", "translateY(0)"] },
          { duration: 0.4, delay: 0, easing: [0.25, 0.46, 0.45, 0.94] }
        ),
    };
  }
};
if (!window.customElements.get("testimonial-carousel")) {
  window.customElements.define("testimonial-carousel", TestimonialCarousel);
}

// js/sections/text-with-icons.js
import { animate as animate24 } from "vendor";
var TextWithIconsCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () =>
        animate24(
          fromSlide,
          {
            opacity: [1, 0],
            transform: ["translateY(0)", "translateY(-10px)"],
          },
          { duration: 0.3, easing: "ease-in" }
        ),
      enterControls: () =>
        animate24(
          toSlide,
          {
            opacity: [0, 1],
            transform: ["translateY(10px)", "translateY(0px)"],
          },
          { duration: 0.3, delay: 0.2, easing: "ease-out" }
        ),
    };
  }
};
if (!window.customElements.get("text-with-icons-carousel")) {
  window.customElements.define(
    "text-with-icons-carousel",
    TextWithIconsCarousel
  );
}

// js/sections/timeline.js
import { animate as animate25, timeline as timeline15 } from "vendor";
var TimelineCarousel = class extends EffectCarousel {
  createOnBecameVisibleAnimationControls(toSlide) {
    return animate25(
      toSlide.querySelectorAll(".timeline__item-content"),
      { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
      { duration: 0.5 }
    );
  }
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return timeline15([
      [
        fromSlide.querySelectorAll(".timeline__item-content"),
        { opacity: [1, 0] },
        { duration: 0.3 },
      ],
      [
        fromSlide.querySelector(".timeline__item-image-wrapper :is(img, svg)"),
        { opacity: [1, 0], transform: ["translateX(0)", "translateX(-15px)"] },
        { duration: 0.5, at: "<", easing: [0.645, 0.045, 0.355, 1] },
      ],
      [
        toSlide.querySelector(".timeline__item-image-wrapper :is(img, svg)"),
        { opacity: [0, 1], transform: ["translateX(-15px)", "translateX(0)"] },
        { duration: 0.5, at: "<" },
      ],
      [
        toSlide.querySelectorAll(".timeline__item-content"),
        { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
        { duration: 0.5, at: "-0.1" },
      ],
    ]);
  }
};
if (!window.customElements.get("timeline-carousel")) {
  window.customElements.define("timeline-carousel", TimelineCarousel);
}

// js/theme.js
import { animate as animate26, Delegate as Delegate10 } from "vendor";
(() => {
  const delegateDocument = new Delegate10(document.documentElement);
  if (
    window.themeVariables.settings.showPageTransition &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches
  ) {
    delegateDocument.on(
      "click",
      'a:not([target="_blank"])',
      async (event, target) => {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey) {
          return;
        }
        if (
          target.hostname !== window.location.hostname ||
          target.pathname === window.location.pathname
        ) {
          return;
        }
        event.preventDefault();
        await animate26(document.body, { opacity: 0 }, { duration: 0.2 })
          .finished;
        window.location = target.href;
      }
    );
  }
  delegateDocument.on("click", 'a[href*="#"]', (event, target) => {
    if (
      event.defaultPrevented ||
      target.matches("[allow-hash-change]") ||
      target.pathname !== window.location.pathname ||
      target.search !== window.location.search
    ) {
      return;
    }
    const url = new URL(target.href);
    if (url.hash === "") {
      return;
    }
    const anchorElement = document.querySelector(url.hash);
    if (anchorElement) {
      event.preventDefault();
      anchorElement.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: no-preference)")
          .matches
          ? "smooth"
          : "auto",
      });
      document.documentElement.dispatchEvent(
        new CustomEvent("hashchange:simulate", {
          bubbles: true,
          detail: { hash: url.hash },
        })
      );
    }
  });
  if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
    document.head.querySelector('meta[name="viewport"]').content =
      "width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, maximum-scale=1.0";
  }
  Array.from(document.querySelectorAll(".prose table")).forEach((table) => {
    table.outerHTML =
      '<div class="table-scroller">' + table.outerHTML + "</div>";
  });
})();
export {
  AccordionDisclosure,
  AccountLogin,
  AnnouncementBarCarousel,
  ArticleToolbar,
  BadgeList,
  BeforeAfter,
  BlogPosts,
  BuyButtons,
  CarouselNavigation,
  CarouselNextButton,
  CarouselPrevButton,
  CartCount,
  CartDot,
  CartDrawer,
  CartNote,
  CollectionBanner,
  CollectionLayoutSwitch,
  CompareAtPrice,
  ConfirmButton,
  CopyButton,
  CountdownTimer,
  CountdownTimerFlip,
  CountdownTimerFlipDigit,
  CountrySelector,
  CustomDetails,
  DialogCloseButton,
  DialogElement,
  Drawer,
  EffectCarousel,
  FacetLink,
  FacetsDrawer,
  FacetsForm,
  FacetsSortPopover,
  FaqToc,
  FeaturedCollectionsCarousel,
  FreeShippingBar,
  GestureArea,
  GiftCardRecipient,
  Header,
  HeightObserver,
  ImageParallax,
  ImageWithText,
  ImageWithTextOverlay,
  ImagesWithTextScroll,
  LineItemQuantity,
  Listbox,
  LoadingBar,
  MarqueeText,
  MediaGrid,
  MenuDisclosure,
  Modal,
  ModelMedia,
  MultiColumn,
  MultipleMediaWithText,
  NewsletterPopup,
  OnSaleBadge,
  OpenLightBoxButton,
  PaymentTerms,
  PickupAvailability,
  Player,
  PopIn,
  Popover,
  PredictiveSearch,
  PriceRange,
  PrivacyBanner,
  ProductCard,
  ProductForm,
  ProductGallery,
  ProductGalleryNavigation,
  ProductList,
  ProductLoader,
  ProductRecommendations,
  ProductStickyBar,
  ProgressBar,
  QrCode,
  QuantityInput,
  QuantitySelector,
  QuickBuyModal,
  RecentlyViewedProducts,
  ResizableTextarea,
  SafeSticky,
  SalePrice,
  ScrollCarousel,
  ShareButton,
  ShippingEstimator,
  ShopTheLookDesktopCarousel,
  ShopTheLookMobileCarousel,
  ShopTheLookPopover,
  ShopTheLookProductListCarousel,
  SlideshowCarousel,
  SoldOutBadge,
  Tabs,
  TestimonialCarousel,
  TextWithIconsCarousel,
  TimelineCarousel,
  UnitPrice,
  VariantInventory,
  VariantMedia,
  VariantPicker,
  VariantSku,
  VideoMedia,
  cachedFetch,
  createMediaImg,
  debounce,
  extractSectionId,
  fetchCart,
  formatMoney,
  generateSrcset,
  imageLoaded,
  matchesMediaQuery,
  mediaQueryListener,
  throttle,
  videoLoaded,
  waitForEvent,
};
