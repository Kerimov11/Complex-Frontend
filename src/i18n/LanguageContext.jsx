import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { LANGUAGES, translateString } from './translations';

const LANG_STORAGE_KEY = 'ha_ice_lang';

const LanguageContext = createContext({
  lang: 'az',
  setLang: () => {},
  t: (s) => s,
  languages: LANGUAGES,
});

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE']);
const TRANSLATE_ATTRS = ['placeholder', 'title', 'aria-label'];

// WeakMaps store { orig, lastWritten } per DOM node so we never lose
// the original Azerbaijani text when switching AZ -> EN -> RU -> AZ.
const origTextMap = new WeakMap();
const origAttrMap = new WeakMap();

function shouldSkipElement(el) {
  if (!el || el.nodeType !== 1) return false;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.closest && el.closest('[data-no-translate="true"]')) return true;
  return false;
}

function translateTextNode(node, lang) {
  const parent = node.parentElement;
  if (!parent || shouldSkipElement(parent)) return;

  const currentVal = node.nodeValue || '';
  if (!currentVal.trim()) return;

  let entry = origTextMap.get(node);
  if (!entry) {
    entry = { orig: currentVal, lastWritten: currentVal };
    origTextMap.set(node, entry);
  } else if (currentVal !== entry.lastWritten && currentVal !== entry.orig) {
    // React updated the underlying text node to a new Azerbaijani value
    entry.orig = currentVal;
  }

  const target = lang === 'az' ? entry.orig : translateString(entry.orig, lang);
  entry.lastWritten = target;
  if (node.nodeValue !== target) {
    node.nodeValue = target;
  }
}

function translateElementAttrs(el, lang) {
  if (!el || el.nodeType !== 1 || shouldSkipElement(el)) return;

  let attrStore = origAttrMap.get(el);
  for (const attr of TRANSLATE_ATTRS) {
    if (!el.hasAttribute(attr)) continue;
    const currentVal = el.getAttribute(attr);
    if (!currentVal || !currentVal.trim()) continue;

    if (!attrStore) {
      attrStore = {};
      origAttrMap.set(el, attrStore);
    }

    let entry = attrStore[attr];
    if (!entry) {
      entry = { orig: currentVal, lastWritten: currentVal };
      attrStore[attr] = entry;
    } else if (currentVal !== entry.lastWritten && currentVal !== entry.orig) {
      entry.orig = currentVal;
    }

    const target = lang === 'az' ? entry.orig : translateString(entry.orig, lang);
    entry.lastWritten = target;
    if (currentVal !== target) {
      el.setAttribute(attr, target);
    }
  }
}

function translateSubtree(root, lang) {
  if (!root) return;

  if (root.nodeType === 3) {
    translateTextNode(root, lang);
    return;
  }

  if (root.nodeType !== 1) return;
  if (shouldSkipElement(root)) return;

  translateElementAttrs(root, lang);

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.nodeType === 1) {
          if (SKIP_TAGS.has(node.tagName) || node.getAttribute('data-no-translate') === 'true') {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
        if (node.nodeType === 3) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    }
  );

  let current = walker.nextNode();
  while (current) {
    if (current.nodeType === 3) {
      translateTextNode(current, lang);
    } else if (current.nodeType === 1) {
      translateElementAttrs(current, lang);
    }
    current = walker.nextNode();
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'az' || saved === 'en' || saved === 'ru') return saved;
    } catch {
      // ignore storage errors
    }
    return 'az';
  });

  const langRef = useRef(lang);
  langRef.current = lang;
  const isApplyingRef = useRef(false);

  const applyAll = useCallback((targetLang) => {
    if (isApplyingRef.current) return;
    isApplyingRef.current = true;
    try {
      translateSubtree(document.body, targetLang);
    } finally {
      // Release lock after microtask so MutationObserver ignores our own writes
      Promise.resolve().then(() => {
        isApplyingRef.current = false;
      });
    }
  }, []);

  const setLang = useCallback(
    (nextLang) => {
      if (!['az', 'en', 'ru'].includes(nextLang)) return;
      langRef.current = nextLang;
      setLangState(nextLang);
      try {
        localStorage.setItem(LANG_STORAGE_KEY, nextLang);
      } catch {
        // ignore storage errors
      }
      // Translate immediately on click so there is zero delay
      applyAll(nextLang);
    },
    [applyAll]
  );

  const t = useCallback(
    (str) => {
      if (!str || typeof str !== 'string') return str;
      return translateString(str, lang);
    },
    [lang]
  );

  // Apply translation to the entire document whenever language changes
  useEffect(() => {
    document.documentElement.lang = lang;
    applyAll(lang);
    const timer = setTimeout(() => applyAll(langRef.current), 60);
    return () => clearTimeout(timer);
  }, [lang, applyAll]);

  // Observe DOM mutations (route changes, modals, dynamic data, toasts)
  useEffect(() => {
    let rafId = null;
    const pendingNodes = new Set();

    const flushMutations = () => {
      rafId = null;
      if (isApplyingRef.current) return;
      isApplyingRef.current = true;
      try {
        const currentLang = langRef.current;
        if (pendingNodes.size > 40) {
          pendingNodes.clear();
          translateSubtree(document.body, currentLang);
        } else {
          for (const node of pendingNodes) {
            translateSubtree(node, currentLang);
          }
          pendingNodes.clear();
        }
      } finally {
        Promise.resolve().then(() => {
          isApplyingRef.current = false;
        });
      }
    };

    const observer = new MutationObserver((mutations) => {
      if (isApplyingRef.current) return;

      for (const m of mutations) {
        if (m.type === 'characterData') {
          pendingNodes.add(m.target);
        } else if (m.type === 'attributes') {
          pendingNodes.add(m.target);
        } else if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === 1 || n.nodeType === 3) {
              pendingNodes.add(n);
            }
          });
        }
      }

      if (pendingNodes.size > 0 && !rafId) {
        rafId = requestAnimationFrame(flushMutations);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATE_ATTRS,
    });

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
