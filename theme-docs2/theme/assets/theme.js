(function () {
  'use strict';

  // ===== Theme toggle (three-state: light / dark / system) =====
  function getStoredTheme() {
    try {
      var v = localStorage.getItem('loomis-theme');
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch (e) { return 'system'; }
  }
  function applyTheme(theme) {
    var root = document.documentElement;
    var resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    root.dataset.theme = theme;
    root.dataset.themeResolved = resolved;
    root.classList.toggle('dark', resolved === 'dark');
    try {
      if (theme === 'system') {
        localStorage.removeItem('loomis-theme');
      } else {
        localStorage.setItem('loomis-theme', theme);
      }
    } catch (e) {}
  }
  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var current = getStoredTheme();
      var next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
      applyTheme(next);
      var label = next === 'system' ? 'System theme' : next === 'dark' ? 'Dark theme' : 'Light theme';
      btn.setAttribute('aria-label', label + ' (click to cycle)');
      btn.setAttribute('title', label);
    });
  });
  // Re-resolve on system change while in 'system' mode
  if (window.matchMedia) {
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () { if (getStoredTheme() === 'system') applyTheme('system'); };
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else if (mql.addListener) mql.addListener(onChange);
  }

  // ===== Sidebar active link =====
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.sidebar__link').forEach(function (a) {
    var href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href === path) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // ===== Mobile nav close on link click =====
  var navToggle = document.getElementById('nav-toggle');
  if (navToggle) {
    document.querySelectorAll('.sidebar__link').forEach(function (a) {
      a.addEventListener('click', function () { navToggle.checked = false; });
    });
  }

  // ===== Sidebar collapsible group persistence =====
  document.querySelectorAll('.sidebar__group[data-group]').forEach(function (group) {
    var key = 'loomis-sidebar-' + group.dataset.group;
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
    var anchorIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
    var anchorCheck = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
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

  // ===== Page stats (reading time + section count) =====
  var statsEl = document.querySelector('[data-page-stats]');
  if (statsEl && prose) {
    var text = prose.innerText || prose.textContent || '';
    var words = text.trim().split(/\s+/).filter(Boolean).length;
    var minutes = Math.max(1, Math.round(words / 200));
    var sections = prose.querySelectorAll('h2[id]').length;
    var readEl = statsEl.querySelector('[data-page-stat-read-time]');
    var sectionsEl = statsEl.querySelector('[data-page-stat-sections]');
    if (readEl) readEl.textContent = minutes + ' min read';
    if (sectionsEl) sectionsEl.textContent = sections === 1 ? '1 section' : sections + ' sections';
    if (words > 30 && sections >= 1) {
      statsEl.hidden = false;
    } else if (words > 30) {
      // No headings — still show reading time
      if (sectionsEl) sectionsEl.remove();
      var sep = statsEl.querySelector('.page-stats__sep');
      if (sep) sep.remove();
      statsEl.hidden = false;
    }
  }

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

  function renderResult(resultData) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    var title = document.createElement('span');
    var excerpt = document.createElement('span');
    var url = resultData.url || '#';
    var meta = resultData.meta || {};
    var snippet = resultData.plain_excerpt || toPlainText(resultData.excerpt);

    a.href = url;
    a.className = 'cmdk__result';

    title.className = 'cmdk__result-title';
    title.textContent = meta.title || url;
    a.appendChild(title);

    if (snippet) {
      excerpt.className = 'cmdk__result-excerpt';
      excerpt.textContent = snippet;
      a.appendChild(excerpt);
    }

    li.appendChild(a);
    list.appendChild(li);
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
    loadSearchApi()
      .then(function (api) {
        return api.search(q, { limit: 12 });
      })
      .then(function (searchResult) {
        if (ticket !== renderTicket) return;
        var results = (searchResult && searchResult.results) || [];
        list.innerHTML = '';
        if (!results.length) {
          setEmpty('No matches.');
          return;
        }
        empty.hidden = true;
        return Promise.all(results.map(function (result) {
          return result.data().then(renderResult);
        })).then(function () {
          if (ticket !== renderTicket) return;
          var first = list.querySelector('a');
          if (first) first.classList.add('is-active');
        });
      })
      .catch(function () {
        if (ticket !== renderTicket) return;
        list.innerHTML = '';
        setEmpty('Search index is unavailable.');
      });
  }

  function open() {
    palette.hidden = false;
    render('');
    if (input) { input.value = ''; setTimeout(function () { input.focus(); }, 10); }
  }
  function close() { palette.hidden = true; }

  document.querySelectorAll('[data-cmdk-open]').forEach(function (btn) {
    btn.addEventListener('click', open);
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
    }
  });

  if (input) input.addEventListener('input', function () { render(input.value); });
})();
