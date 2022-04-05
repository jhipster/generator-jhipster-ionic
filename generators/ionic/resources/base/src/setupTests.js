/**
 * fix: `matchMedia` not present, legacy browsers require a polyfill
 */
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

/**
 * fix: `window.URL.createObjectURL is not a function` when running tests
 */
window.URL.createObjectURL = () => {};
