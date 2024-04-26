/**
 * Select the first match only, context is optional
 */
export const $ = (selector, context) =>
  (context || document).querySelector(selector);

/**
 * Select a list of matching elements, context is optional
 */
export const $$ = (selector, context) =>
  (context || document).querySelectorAll(selector);

/**
 * Select matching id
 */
export const $id = id => document.getElementById(id);

/**
 * Select matching tags
 */
export const $tag = tag => document.getElementsByTagName(tag);

/**
 * Class utilities
 */
export const hasClass = (el, className) => el.classList.contains(className);

export const addClass = (el, className) => {
  let classList = className.split(' ');
  el.classList.add(classList[0]);
  if (classList.length > 1) addClass(el, classList.slice(1).join(' '));
};

export const removeClass = (el, className) => {
  let classList = className.split(' ');
  el.classList.remove(classList[0]);
  if (classList.length > 1) removeClass(el, classList.slice(1).join(' '));
};

export const toggleClass = (el, className) => el.classList.toggle(className);
