(function () {
  'use strict';

  document.documentElement.classList.add('js');

  function enableEnhancedControls() {
    document.querySelectorAll('[data-theme-toggle], [data-cmdk-open]').forEach(function (control) {
      control.disabled = false;
      control.removeAttribute('aria-disabled');
    });
  }

  enableEnhancedControls();

  // ===== Theme toggle (initial system, then light / dark) =====
  function getStoredTheme() {
    try {
      var v = localStorage.getItem('zeropress-docs2-theme');
      return v === 'light' || v === 'dark' ? v : null;
    } catch (e) { return null; }
  }

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getResolvedTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  function updateThemeControls(resolved) {
    var currentLabel = resolved === 'dark' ? 'Dark theme' : 'Light theme';
    var nextLabel = resolved === 'dark' ? 'light theme' : 'dark theme';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', currentLabel + ' (click to switch to ' + nextLabel + ')');
      btn.setAttribute('title', 'Switch to ' + nextLabel);
    });
  }

  function setThemeAttributes(resolved) {
    var root = document.documentElement;
    root.dataset.theme = resolved;
    root.dataset.themeResolved = resolved;
    root.classList.toggle('dark', resolved === 'dark');
    updateThemeControls(resolved);
  }

  function applyTheme(theme) {
    var resolved = theme === 'dark' ? 'dark' : 'light';
    try {
      localStorage.setItem('zeropress-docs2-theme', resolved);
    } catch (e) {}
    setThemeAttributes(resolved);
  }

  setThemeAttributes(getResolvedTheme());

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var current = document.documentElement.dataset.themeResolved || getResolvedTheme();
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  });
  // Re-resolve on system change only until the user chooses light or dark.
  if (window.matchMedia) {
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () {
      if (!getStoredTheme()) setThemeAttributes(getSystemTheme());
    };
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else if (mql.addListener) mql.addListener(onChange);
  }

  // ===== Mobile nav close on link click =====
  var navToggle = document.getElementById('nav-toggle');
  var navTrigger = document.querySelector('[data-nav-trigger]');
  function syncNavState() {
    if (!navToggle || !navTrigger) return;
    navTrigger.setAttribute('aria-expanded', navToggle.checked ? 'true' : 'false');
    navTrigger.setAttribute('aria-label', navToggle.checked ? 'Close navigation' : 'Open navigation');
  }
  if (navToggle) {
    navToggle.addEventListener('change', syncNavState);
    syncNavState();
    if (navTrigger) {
      navTrigger.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        navToggle.checked = !navToggle.checked;
        navToggle.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
    document.querySelectorAll('.sidebar__link').forEach(function (a) {
      a.addEventListener('click', function () {
        navToggle.checked = false;
        syncNavState();
      });
    });
  }

  // ===== Sidebar collapsible group persistence =====
  document.querySelectorAll('.sidebar__group[data-group]').forEach(function (group) {
    var key = 'zeropress-docs2-sidebar-' + group.dataset.group;
    try {
      var stored = localStorage.getItem(key);
      if (stored === 'closed') group.removeAttribute('open');
      else if (stored === 'open') group.setAttribute('open', '');
    } catch (e) {}
    group.addEventListener('toggle', function () {
      try { localStorage.setItem(key, group.open ? 'open' : 'closed'); } catch (e) {}
    });
  });

  // ===== Heading anchor links =====
  var prose = document.querySelector('.prose');
  if (prose) {
    var anchorIcon = '<svg class="icon" width="14" height="14" aria-hidden="true"><use href="#icon-link"/></svg>';
    var anchorCheck = '<svg class="icon" width="14" height="14" aria-hidden="true"><use href="#icon-check"/></svg>';
    prose.querySelectorAll('h2[id], h3[id], h4[id]').forEach(function (heading) {
      if (heading.querySelector('.heading-anchor')) return;
      var a = document.createElement('a');
      a.className = 'heading-anchor';
      a.href = '#' + heading.id;
      a.setAttribute('aria-label', 'Copy link to ' + heading.textContent.trim());
      a.innerHTML = anchorIcon;
      a.addEventListener('click', function (e) {
        var url = window.location.origin + window.location.pathname + '#' + heading.id;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          e.preventDefault();
          navigator.clipboard.writeText(url).then(function () {
            a.classList.add('is-copied');
            a.innerHTML = anchorCheck;
            history.replaceState(null, '', '#' + heading.id);
            setTimeout(function () {
              a.classList.remove('is-copied');
              a.innerHTML = anchorIcon;
            }, 1300);
          }).catch(function () {});
        }
      });
      heading.appendChild(a);
    });
  }

  // ===== Mermaid progressive enhancement =====
  var MERMAID_RUNTIME_URL = 'https://cdn.jsdelivr.net/npm/mermaid@11.15.0/dist/mermaid.min.js';
  var mermaidRuntimePromise = null;

  function mermaidTheme() {
    var resolved = document.documentElement.dataset.themeResolved;
    if (!resolved && window.matchMedia) {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return resolved === 'dark' ? 'dark' : 'default';
  }

  function getMermaidCodeBlocks() {
    return Array.prototype.slice.call(document.querySelectorAll('pre > code.language-mermaid, pre > code.lang-mermaid'));
  }

  function loadMermaidRuntime() {
    if (window.mermaid) return Promise.resolve(window.mermaid);
    if (mermaidRuntimePromise) return mermaidRuntimePromise;

    mermaidRuntimePromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-zp-mermaid-runtime]');
      if (existing) {
        existing.addEventListener('load', function () {
          if (window.mermaid) resolve(window.mermaid);
          else reject(new Error('Mermaid runtime loaded without exposing window.mermaid.'));
        }, { once: true });
        existing.addEventListener('error', function () {
          reject(new Error('Failed to load Mermaid runtime.'));
        }, { once: true });
        return;
      }

      var script = document.createElement('script');
      script.src = MERMAID_RUNTIME_URL;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.zpMermaidRuntime = 'mermaid@11.15.0';
      script.addEventListener('load', function () {
        if (window.mermaid) resolve(window.mermaid);
        else reject(new Error('Mermaid runtime loaded without exposing window.mermaid.'));
      }, { once: true });
      script.addEventListener('error', function () {
        reject(new Error('Failed to load Mermaid runtime.'));
      }, { once: true });
      document.head.appendChild(script);
    });

    return mermaidRuntimePromise;
  }

  function prepareMermaidBlocks(blocks) {
    return blocks.map(function (code, index) {
      var pre = code.parentElement;
      var container = document.createElement('div');
      container.className = 'mermaid zp-mermaid';
      container.dataset.mermaidIndex = String(index + 1);
      container.textContent = code.textContent || '';
      pre.replaceWith(container);
      return { pre: pre, container: container };
    });
  }

  function renderMermaidBlocks() {
    var blocks = getMermaidCodeBlocks();
    if (!blocks.length) return;

    loadMermaidRuntime().then(function (mermaid) {
      var entries = prepareMermaidBlocks(blocks);
      if (!entries.length) return;

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: mermaidTheme(),
      });

      return Promise.resolve(mermaid.run({
        nodes: entries.map(function (entry) { return entry.container; }),
      })).catch(function (error) {
        entries.forEach(function (entry) {
          if (entry.container.isConnected) {
            entry.pre.classList.add('zp-mermaid-error');
            entry.container.replaceWith(entry.pre);
          }
        });
        console.warn('[zeropress] Mermaid rendering failed.', error);
      });
    }).catch(function (error) {
      console.warn('[zeropress] Mermaid runtime was not loaded; leaving code blocks unchanged.', error);
    });
  }

  renderMermaidBlocks();

  // ===== Code copy buttons + language labels =====
  document.querySelectorAll('pre > code, .code-block__code').forEach(function (code) {
    // Language label: read first hljs-style language-* class on <code>
    var pre = code.closest('pre');
    if (pre && !pre.dataset.language) {
      var match = (code.className || '').match(/(?:language|lang)-([\w-]+)/);
      if (match) {
        var lang = match[1].toLowerCase();
        pre.classList.add('language-' + lang);
        pre.dataset.language = lang;
      }
    }

    var host = code.closest('.code-block') || code.parentElement;
    if (!host || host.querySelector(':scope > .copy-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'copy-btn'; btn.textContent = 'Copy';
    btn.addEventListener('click', function () {
      var text = code.innerText;
      if (!navigator.clipboard) { btn.textContent = 'Unavailable'; return; }
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });
    host.style.position = host.style.position || 'relative';
    host.appendChild(btn);
  });

  // ===== HTML document TOC progressive enhancement =====
  document.querySelectorAll('[data-enhance-toc]').forEach(function (toc) {
    var article = toc.closest('.article-grid') || document;
    var headings = Array.prototype.slice.call(article.querySelectorAll('.prose h2[id], .prose h3[id], .prose h4[id]'));
    if (!headings.length) return;

    var title = document.createElement('p');
    title.className = 'toc__title';
    title.textContent = 'On this page';

    var nav = document.createElement('nav');
    var listEl = document.createElement('ul');

    headings.forEach(function (heading) {
      var level = Number((heading.tagName || '').replace('H', '')) || 2;
      var item = document.createElement('li');
      var link = document.createElement('a');
      item.className = 'toc__item toc__item--level-' + level;
      link.href = '#' + heading.id;
      link.setAttribute('data-toc-link', '');
      link.textContent = heading.textContent.trim();
      item.appendChild(link);
      listEl.appendChild(item);
    });

    nav.appendChild(listEl);
    toc.appendChild(title);
    toc.appendChild(nav);
    toc.hidden = false;
  });

  // ===== TOC active section =====
  var tocLinks = document.querySelectorAll('[data-toc-link]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var headings = [];
    tocLinks.forEach(function (link) {
      var id = (link.getAttribute('href') || '').replace('#', '');
      var el = id && document.getElementById(id);
      if (el) headings.push({ el: el, link: link });
    });
    var setActive = function (id) {
      tocLinks.forEach(function (l) {
        var li = l.parentElement;
        var match = (l.getAttribute('href') || '') === '#' + id;
        l.classList.toggle('is-active', match);
        if (li) li.classList.toggle('is-active', match);
      });
    };
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '0px 0px -70% 0px', threshold: 0 });
    headings.forEach(function (h) { observer.observe(h.el); });
  }

  // ===== Command palette =====
  var palette = document.querySelector('[data-cmdk]');
  if (!palette) return;
  var input = palette.querySelector('[data-cmdk-input]');
  var list = palette.querySelector('[data-cmdk-list]');
  var empty = palette.querySelector('[data-cmdk-empty]');
  var searchApiPromise;
  var renderTicket = 0;

  function loadSearchApi() {
    if (!searchApiPromise) {
      searchApiPromise = import('/_zeropress/search.js');
    }
    return searchApiPromise;
  }

  function setEmpty(message) {
    empty.textContent = message;
    empty.hidden = false;
  }

  function clearActive() {
    list.querySelectorAll('a').forEach(function (item) {
      item.classList.remove('is-active');
    });
  }

  function toPlainText(value) {
    if (!value) return '';
    var template = document.createElement('template');
    template.innerHTML = String(value);
    return (template.content.textContent || '').trim();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightMatches(text, terms) {
    if (!text || !terms || !terms.length) return escapeHtml(text || '');
    var escaped = escapeHtml(text);
    // Sort longest first so "build-pages" matches before "build".
    var sorted = terms.slice().sort(function (a, b) { return b.length - a.length; });
    var pattern = sorted.map(escapeRegExp).join('|');
    var rx = new RegExp('(' + pattern + ')', 'gi');
    return escaped.replace(rx, '<mark>$1</mark>');
  }

  function tokenize(query) {
    return (query || '').toLowerCase()
      .split(/\s+/)
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length >= 2; });
  }

  function renderResults(results, terms) {
    list.innerHTML = '';
    var first = null;

    results.forEach(function (entry) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = entry.url;
      a.className = 'cmdk__result';
      var titleHtml = highlightMatches(entry.title, terms);
      var excerptHtml = entry.excerpt ? highlightMatches(entry.excerpt, terms) : '';
      a.innerHTML = '<span class="cmdk__result-title">' + titleHtml + '</span>' +
        (excerptHtml ? '<span class="cmdk__result-excerpt">' + excerptHtml + '</span>' : '');
      li.appendChild(a);
      list.appendChild(li);
      if (!first) first = a;
    });

    if (first) first.classList.add('is-active');
  }

  function render(query) {
    var ticket = ++renderTicket;
    var q = (query || '').trim();
    list.innerHTML = '';

    if (!q) {
      setEmpty('Type to search.');
      return;
    }

    setEmpty('Searching...');
    var terms = tokenize(q);

    loadSearchApi()
      .then(function (api) {
        return api.search(q, { limit: 20 });
      })
      .then(function (searchResult) {
        if (ticket !== renderTicket) return;
        var rawResults = (searchResult && searchResult.results) || [];
        if (!rawResults.length) {
          list.innerHTML = '';
          setEmpty('No matches.');
          return;
        }
        return Promise.all(rawResults.map(function (r) { return r.data(); })).then(function (rows) {
          if (ticket !== renderTicket) return;
          var entries = rows.map(function (row) {
            var url = row.url || '#';
            var title = (row.meta && row.meta.title) || url;
            var excerpt = row.plain_excerpt || toPlainText(row.excerpt) || '';
            return {
              url: url,
              title: title,
              excerpt: excerpt
            };
          });
          empty.hidden = true;
          renderResults(entries, terms);
        });
      })
      .catch(function () {
        if (ticket !== renderTicket) return;
        list.innerHTML = '';
        setEmpty('Search index is unavailable.');
      });
  }

  function open(prefill) {
    palette.hidden = false;
    if (input) {
      input.value = prefill || '';
      setTimeout(function () { input.focus(); input.select(); }, 10);
    }
    render(prefill || '');
  }
  function close() { palette.hidden = true; }

  document.querySelectorAll('[data-cmdk-open]').forEach(function (btn) {
    btn.addEventListener('click', function () { open(); });
  });
  palette.querySelectorAll('[data-cmdk-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      palette.hidden ? open() : close();
    } else if (e.key === 'Escape' && !palette.hidden) {
      close();
    } else if (!palette.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      var items = Array.prototype.slice.call(list.querySelectorAll('a'));
      if (!items.length) return;
      var idx = items.findIndex(function (i) { return i.classList.contains('is-active'); });
      clearActive();
      idx = e.key === 'ArrowDown' ? (idx + 1) % items.length : (idx - 1 + items.length) % items.length;
      items[idx].classList.add('is-active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (!palette.hidden && e.key === 'Enter') {
      var active = list.querySelector('a.is-active');
      if (active) { e.preventDefault(); window.location.href = active.href; }
    } else if (palette.hidden && e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var t = e.target;
      var inForm = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (!inForm) { e.preventDefault(); open(); }
    }
  });

  if (input) input.addEventListener('input', function () { render(input.value); });
})();
