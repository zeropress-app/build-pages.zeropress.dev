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

  // ===== Pages index (used by search grouping, hover previews, 404 prefill) =====
  var pagesIndexPromise;
  function loadPagesIndex() {
    if (!pagesIndexPromise) {
      pagesIndexPromise = fetch('/_zeropress/pages-index.json', { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.json() : { pages: [] }; })
        .then(function (data) {
          var byUrl = new Map();
          (data.pages || []).forEach(function (p) {
            var key = normalizePath(p.url);
            byUrl.set(key, p);
          });
          return { pages: data.pages || [], byUrl: byUrl };
        })
        .catch(function () { return { pages: [], byUrl: new Map() }; });
    }
    return pagesIndexPromise;
  }
  function normalizePath(u) {
    if (!u) return '/';
    var v = String(u).split('#')[0].split('?')[0];
    if (!v.startsWith('/')) v = '/' + v;
    if (v.length > 1 && v.endsWith('/')) v = v.slice(0, -1);
    return v || '/';
  }

  // ===== Internal link hover previews =====
  (function () {
    if (!('IntersectionObserver' in window) || !window.matchMedia) return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (!prose) return;

    var card = null;
    var hoverTimer = null;
    var leaveTimer = null;
    var currentLink = null;

    function ensureCard() {
      if (card) return card;
      card = document.createElement('div');
      card.className = 'link-preview';
      card.setAttribute('role', 'tooltip');
      card.hidden = true;
      card.innerHTML = '<span class="link-preview__group" data-link-preview-group></span>' +
        '<strong class="link-preview__title" data-link-preview-title></strong>' +
        '<span class="link-preview__excerpt" data-link-preview-excerpt></span>';
      document.body.appendChild(card);
      card.addEventListener('mouseenter', function () { window.clearTimeout(leaveTimer); });
      card.addEventListener('mouseleave', scheduleHide);
      return card;
    }

    function position(target) {
      var rect = target.getBoundingClientRect();
      var width = Math.min(320, window.innerWidth - 32);
      card.style.maxWidth = width + 'px';
      var top = rect.bottom + 8;
      var left = rect.left;
      if (left + width > window.innerWidth - 16) left = window.innerWidth - width - 16;
      if (left < 16) left = 16;
      // Flip if it would overflow vertically
      if (top + 140 > window.innerHeight && rect.top > 160) {
        top = rect.top - 8 - card.offsetHeight;
      }
      card.style.top = top + window.scrollY + 'px';
      card.style.left = left + window.scrollX + 'px';
    }

    function show(target, page) {
      ensureCard();
      var groupEl = card.querySelector('[data-link-preview-group]');
      var titleEl = card.querySelector('[data-link-preview-title]');
      var excerptEl = card.querySelector('[data-link-preview-excerpt]');
      groupEl.textContent = page.group_label || page.category || '';
      groupEl.hidden = !groupEl.textContent;
      titleEl.textContent = page.title || target.textContent;
      excerptEl.textContent = page.excerpt || '';
      card.hidden = false;
      card.classList.remove('is-visible');
      // Force reflow then animate in.
      card.offsetHeight;
      position(target);
      card.classList.add('is-visible');
    }

    function hide() {
      if (!card) return;
      card.classList.remove('is-visible');
      card.hidden = true;
      currentLink = null;
    }

    function scheduleHide() {
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(hide, 140);
    }

    function isInternalLink(a) {
      var href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return false;
      try {
        var u = new URL(href, window.location.origin);
        if (u.origin !== window.location.origin) return false;
        return u.pathname && u.pathname !== window.location.pathname.replace(/\/+$/, '');
      } catch (e) { return false; }
    }

    function handleEnter(e) {
      var a = e.target.closest('a[href]');
      if (!a || !prose.contains(a)) return;
      if (!isInternalLink(a)) return;
      window.clearTimeout(hoverTimer);
      window.clearTimeout(leaveTimer);
      currentLink = a;
      hoverTimer = window.setTimeout(function () {
        if (currentLink !== a) return;
        loadPagesIndex().then(function (idx) {
          var u = new URL(a.getAttribute('href'), window.location.origin);
          var page = idx.byUrl.get(normalizePath(u.pathname));
          if (page && currentLink === a) show(a, page);
        });
      }, 220);
    }

    function handleLeave(e) {
      var related = e.relatedTarget;
      if (related && card && (card === related || card.contains(related))) return;
      window.clearTimeout(hoverTimer);
      scheduleHide();
    }

    prose.addEventListener('mouseenter', handleEnter, true);
    prose.addEventListener('mouseleave', handleLeave, true);
    prose.addEventListener('focusin', handleEnter);
    prose.addEventListener('focusout', handleLeave);
    window.addEventListener('scroll', function () {
      if (currentLink && card && !card.hidden) position(currentLink);
    }, { passive: true });
  })();

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
    var groups = new Map();
    var groupOrder = ['foundations', 'guides', 'reference', 'legal', 'home', null];

    return loadPagesIndex().then(function (idx) {
      results.forEach(function (entry) {
        var groupKey = entry.page ? entry.page.group_key : null;
        var groupLabel = entry.page ? entry.page.group_label : null;
        if (!groupKey) {
          groupKey = 'other';
          groupLabel = 'Other';
        }
        if (!groups.has(groupKey)) groups.set(groupKey, { label: groupLabel || groupKey, items: [] });
        groups.get(groupKey).items.push(entry);
      });

      var orderedKeys = Array.from(groups.keys()).sort(function (a, b) {
        var ai = groupOrder.indexOf(a); if (ai === -1) ai = groupOrder.length;
        var bi = groupOrder.indexOf(b); if (bi === -1) bi = groupOrder.length;
        return ai - bi;
      });

      var first = null;
      orderedKeys.forEach(function (key) {
        var group = groups.get(key);
        var header = document.createElement('li');
        header.className = 'cmdk__group';
        header.textContent = group.label;
        list.appendChild(header);

        group.items.forEach(function (entry) {
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
      });

      if (first) first.classList.add('is-active');
    });
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
        return Promise.all([
          loadPagesIndex(),
          Promise.all(rawResults.map(function (r) { return r.data(); })),
        ]).then(function (resolved) {
          if (ticket !== renderTicket) return;
          var idx = resolved[0];
          var rows = resolved[1];
          var entries = rows.map(function (row) {
            var url = row.url || '#';
            var title = (row.meta && row.meta.title) || url;
            var excerpt = row.plain_excerpt || toPlainText(row.excerpt) || '';
            var page = idx.byUrl.get(normalizePath(url));
            return {
              url: url,
              title: title,
              excerpt: excerpt,
              page: page || null,
            };
          });
          empty.hidden = true;
          return renderResults(entries, terms);
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

  // ===== 404 page: auto-open palette with URL slug as query =====
  if (document.querySelector('[data-not-found]')) {
    var slug = window.location.pathname
      .replace(/^\/+|\/+$/g, '')
      .replace(/\/+/g, ' ')
      .replace(/[-_.]+/g, ' ')
      .replace(/index$|\.html?$/i, '')
      .trim();
    if (slug.length >= 2) {
      setTimeout(function () { open(slug); }, 250);
    }
  }
})();
