/* Guide produits : trouver le bon manchon, la bonne brosse ou le bon adhésif chez le client.
   Données : assets/guide-data.js (fiches du site schuller.eu + conseils internes).
   Désignation, UDV et prix sont lus en direct dans le catalogue du CRM à partir des références.
   Filtres : OU à l'intérieur d'un même critère, ET entre les critères ; chaque option affiche
   le nombre de produits qu'elle donnerait avec les autres filtres déjà choisis. */
(function () {
  const ICONS = {
    manchons: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="9" width="28" height="14" rx="5" fill="currentColor" opacity=".9"/><path d="M34 16h6v10H24v14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="20" y="38" width="8" height="7" rx="2" fill="currentColor"/></svg>',
    brosses: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="20" y="4" width="8" height="16" rx="3" fill="currentColor"/><rect x="15" y="19" width="18" height="7" rx="2" fill="currentColor" opacity=".75"/><path d="M14 26h20l-2 17H16z" fill="currentColor" opacity=".9"/></svg>',
    adhesifs: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="20" cy="22" r="14" fill="none" stroke="currentColor" stroke-width="7"/><path d="M20 36h22v-7" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/></svg>',
    filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const DATA = window.PRODUCT_GUIDE_DATA || { families: [] };
  const state = {
    family: DATA.families[0]?.id || "manchons",
    selected: {},
    search: {},
    sets: {},
    sort: "pertinence",
    collapsed: {},
    expanded: new Set(),
    drawer: false,
  };

  const esc = (value) => (typeof escapeHtml === "function" ? escapeHtml(value) : String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])));
  const money = (value) => {
    try { return formatter.format(Number(value) || 0); } catch (error) { return `${value} €`; }
  };
  const lookup = (ref) => {
    try { return typeof findProduct === "function" ? findProduct(ref) : null; } catch (error) { return null; }
  };
  const fold = (text) => String(text || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  DATA.families.forEach((family) => {
    family.products.forEach((product, index) => {
      product.id = `${family.id}-${index}`;
      product.haystack = fold([product.name, product.series, product.alias, product.short, ...product.refs.map((r) => r.ref)].join(" "));
    });
  });

  const family = () => DATA.families.find((item) => item.id === state.family) || DATA.families[0];
  const selection = (fam) => (state.selected[fam.id] ||= {});
  const selectedCount = (fam) => Object.values(selection(fam)).reduce((sum, list) => sum + list.length, 0);
  const optionLabel = (fam, groupId, optionId) => fam.filters.find((g) => g.id === groupId)?.options.find((o) => o.id === optionId)?.label || optionId;

  function baseList(fam) {
    const query = fold(state.search[fam.id] || "").trim();
    return fam.products.filter((product) => (state.sets[fam.id] || !product.set) && (!query || query.split(/\s+/).every((word) => product.haystack.includes(word))));
  }

  function passes(product, sel, skipGroup) {
    return Object.entries(sel).every(([groupId, options]) => {
      if (groupId === skipGroup || !options.length) return true;
      const values = product.criteria[groupId] || [];
      return options.some((option) => values.includes(option));
    });
  }

  function results(fam) {
    const sel = selection(fam);
    const list = baseList(fam).filter((product) => passes(product, sel));
    const score = (product) => Object.entries(sel).reduce((sum, [groupId, options]) => sum + options.filter((o) => (product.criteria[groupId] || []).includes(o)).length, 0);
    return list
      .map((product) => ({ product, score: score(product) }))
      .sort((a, b) => {
        if (state.sort === "nom") return a.product.name.localeCompare(b.product.name, "fr");
        if (state.sort === "gamme") return a.product.rank - b.product.rank || a.product.name.localeCompare(b.product.name, "fr");
        return b.score - a.score || a.product.rank - b.product.rank || a.product.name.localeCompare(b.product.name, "fr");
      });
  }

  function optionCount(fam, groupId, optionId) {
    const sel = selection(fam);
    return baseList(fam).filter((product) => passes(product, sel, groupId) && (product.criteria[groupId] || []).includes(optionId)).length;
  }

  // ------------------------------------------------------------------ rendu
  function renderFamilies() {
    return `<div class="pg-families" role="tablist" aria-label="Familles de produits">${DATA.families.map((fam) => `
      <button type="button" role="tab" class="pg-family${fam.id === state.family ? " is-active" : ""}" data-pg-family="${esc(fam.id)}" aria-selected="${fam.id === state.family}">
        <span class="pg-family-icon">${ICONS[fam.id] || ""}</span>
        <span class="pg-family-text"><strong>${esc(fam.label)}</strong><small>${esc(fam.subtitle)} · ${fam.products.filter((p) => !p.set).length} produits</small></span>
      </button>`).join("")}</div>`;
  }

  function renderFilters(fam) {
    const sel = selection(fam);
    const total = selectedCount(fam);
    const count = results(fam).length;
    return `<aside class="pg-filters${state.drawer ? " is-open" : ""}" aria-label="Filtres">
      <div class="pg-filters-head">
        <h3>Filtres</h3>
        <div>
          ${total ? `<button type="button" class="pg-link" data-pg-clear>Tout effacer</button>` : ""}
          <button type="button" class="pg-icon-btn pg-drawer-close" data-pg-drawer="close" aria-label="Fermer les filtres">${ICONS.close}</button>
        </div>
      </div>
      <div class="pg-filters-body">
        ${fam.filters.map((group, index) => {
          const chosen = sel[group.id] || [];
          const collapsed = state.collapsed[`${fam.id}:${group.id}`] ?? index > 3;
          return `<section class="pg-group${collapsed ? " is-collapsed" : ""}">
            <button type="button" class="pg-group-head" data-pg-toggle="${esc(group.id)}" aria-expanded="${!collapsed}">
              <span class="pg-step">${index + 1}</span>
              <span class="pg-group-title">${esc(group.label)}</span>
              ${chosen.length ? `<span class="pg-group-badge">${chosen.length}</span>` : ""}
              <span class="pg-chevron">${ICONS.chevron}</span>
            </button>
            <div class="pg-options">${group.options.map((option) => {
              const on = chosen.includes(option.id);
              const n = optionCount(fam, group.id, option.id);
              const disabled = !on && n === 0;
              return `<label class="pg-option${on ? " is-on" : ""}${disabled ? " is-disabled" : ""}">
                <input type="checkbox" data-pg-group="${esc(group.id)}" value="${esc(option.id)}"${on ? " checked" : ""}${disabled ? " disabled" : ""} />
                <span class="pg-check" aria-hidden="true"></span>
                <span class="pg-option-label">${esc(option.label)}</span>
                <span class="pg-option-count">${n}</span>
              </label>`;
            }).join("")}</div>
          </section>`;
        }).join("")}
        <label class="pg-switch">
          <input type="checkbox" data-pg-sets${state.sets[fam.id] ? " checked" : ""} />
          <span class="pg-switch-track" aria-hidden="true"></span>
          <span>Inclure les sets &amp; assortiments</span>
        </label>
      </div>
      <div class="pg-filters-foot"><button type="button" class="primary-button" data-pg-drawer="close">Voir ${count} produit${count > 1 ? "s" : ""}</button></div>
    </aside>`;
  }

  function renderActive(fam) {
    const sel = selection(fam);
    const pills = Object.entries(sel).flatMap(([groupId, options]) => options.map((optionId) => `
      <button type="button" class="pg-pill" data-pg-remove="${esc(groupId)}:${esc(optionId)}">${esc(optionLabel(fam, groupId, optionId))}${ICONS.close}</button>`));
    return pills.length ? `<div class="pg-pills">${pills.join("")}</div>` : "";
  }

  function renderRefs(product) {
    const expanded = state.expanded.has(product.id);
    const refs = expanded ? product.refs : product.refs.slice(0, 4);
    if (!product.refs.length) return '<p class="pg-muted">Références non communiquées sur le site.</p>';
    return `<table class="pg-refs"><thead><tr><th>Réf.</th><th>Taille</th><th>UDV</th><th>Prix</th></tr></thead><tbody>${refs.map((item) => {
      const catalog = lookup(item.ref);
      return `<tr${catalog ? "" : ' class="is-missing" title="Référence absente du catalogue CRM"'}><td><b>${esc(item.ref)}</b></td><td>${esc(item.size || "—")}</td><td>${catalog?.udv ? esc(catalog.udv) : "—"}</td><td>${catalog ? money(catalog.price) : "—"}</td></tr>`;
    }).join("")}</tbody></table>${product.refs.length > 4 ? `<button type="button" class="pg-link" data-pg-more="${esc(product.id)}">${expanded ? "Réduire" : `Voir les ${product.refs.length} références`}</button>` : ""}`;
  }

  function renderCard(fam, item, index, items) {
    const { product, score } = item;
    const sel = selection(fam);
    const keyGroups = fam.filters.slice(0, 3);
    const tags = keyGroups.flatMap((group) => (product.criteria[group.id] || []).map((id) => ({ group: group.id, id, label: optionLabel(fam, group.id, id), hit: (sel[group.id] || []).includes(id) })))
      .sort((a, b) => Number(b.hit) - Number(a.hit))
      .slice(0, 6);
    // « Meilleur choix » seulement si ce produit coche plus de critères que tous les autres.
    const best = index === 0 && score > 0 && selectedCount(fam) > 0 && (items.length === 1 || score > items[1].score);
    return `<article class="pg-card${best ? " is-best" : ""}">
      <div class="pg-card-media">
        ${product.image ? `<img src="${esc(product.image)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()" />` : ""}
        <span class="pg-card-fallback">${ICONS[fam.id] || ""}</span>
        ${best ? '<span class="pg-badge">Meilleur choix</span>' : product.set ? '<span class="pg-badge is-soft">Set</span>' : ""}
      </div>
      <div class="pg-card-body">
        <p class="pg-card-series">${esc(product.series)}${product.alias ? ` <span>· aussi « ${esc(product.alias)} »</span>` : ""}</p>
        <h4>${esc(product.name)}</h4>
        ${product.short ? `<p class="pg-card-short">${esc(product.short)}</p>` : ""}
        ${product.text && product.text !== product.short ? `<p class="pg-card-text">${esc(product.text)}</p>` : ""}
        ${tags.length ? `<ul class="pg-tags">${tags.map((tag) => `<li class="${tag.hit ? "is-hit" : ""}">${esc(tag.label)}</li>`).join("")}</ul>` : ""}
        ${product.specs?.length ? `<dl class="pg-specs">${product.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
        ${renderRefs(product)}
        ${product.url ? `<a class="pg-source" href="${esc(product.url)}" target="_blank" rel="noopener">Fiche schuller.eu ${ICONS.external}</a>` : ""}
      </div>
    </article>`;
  }

  function renderResults(fam) {
    const items = results(fam);
    const total = selectedCount(fam);
    return `<section class="pg-results" aria-live="polite">
      <div class="pg-toolbar">
        <div class="pg-search">${ICONS.search}<input type="search" data-pg-search placeholder="Nom, série ou référence…" value="${esc(state.search[fam.id] || "")}" /></div>
        <button type="button" class="pg-filter-btn" data-pg-drawer="open">${ICONS.filter}Filtres${total ? ` <span>${total}</span>` : ""}</button>
        <label class="pg-sort">Trier
          <select data-pg-sort>
            <option value="pertinence"${state.sort === "pertinence" ? " selected" : ""}>Pertinence</option>
            <option value="gamme"${state.sort === "gamme" ? " selected" : ""}>Gamme</option>
            <option value="nom"${state.sort === "nom" ? " selected" : ""}>Nom</option>
          </select>
        </label>
      </div>
      <div class="pg-summary"><strong>${items.length}</strong> produit${items.length > 1 ? "s" : ""} ${total || (state.search[fam.id] || "").trim() ? `correspond${items.length > 1 ? "ent" : ""} à votre recherche` : "disponible" + (items.length > 1 ? "s" : "")}</div>
      ${renderActive(fam)}
      ${items.length
        ? `<div class="pg-grid">${items.map((item, index) => renderCard(fam, item, index, items)).join("")}</div>`
        : `<div class="pg-empty"><strong>Aucun produit ne correspond.</strong><span>Retirez un filtre ou cochez « Inclure les sets &amp; assortiments ».</span>${total ? '<button type="button" class="ghost-button compact" data-pg-clear>Effacer les filtres</button>' : ""}</div>`}
      <p class="pg-footnote">Source : fiches produits schuller.eu et conseils d'utilisation internes · prix et UDV issus du catalogue CRM.</p>
    </section>`;
  }

  function render(keepFocus) {
    const root = document.querySelector("#guideRoot");
    if (!root) return;
    if (!DATA.families.length) {
      root.innerHTML = '<div class="pg-empty">Guide indisponible : données non chargées.</div>';
      return;
    }
    const fam = family();
    const scrollBody = root.querySelector(".pg-filters-body")?.scrollTop || 0;
    root.innerHTML = `${renderFamilies()}<div class="pg-layout">${renderFilters(fam)}${renderResults(fam)}</div>${state.drawer ? '<button type="button" class="pg-backdrop" data-pg-drawer="close" aria-label="Fermer"></button>' : ""}`;
    const body = root.querySelector(".pg-filters-body");
    if (body) body.scrollTop = scrollBody;
    if (keepFocus) {
      const input = root.querySelector("[data-pg-search]");
      if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
    }
  }

  // ------------------------------------------------------------------ événements
  document.addEventListener("click", (event) => {
    const root = document.querySelector("#guideRoot");
    if (!root || !root.contains(event.target)) return;
    const fam = family();
    const target = event.target.closest("[data-pg-family],[data-pg-toggle],[data-pg-clear],[data-pg-remove],[data-pg-more],[data-pg-drawer]");
    if (!target) return;
    if (target.dataset.pgFamily) {
      state.family = target.dataset.pgFamily;
      state.drawer = false;
    } else if (target.dataset.pgToggle) {
      const key = `${fam.id}:${target.dataset.pgToggle}`;
      const index = fam.filters.findIndex((g) => g.id === target.dataset.pgToggle);
      state.collapsed[key] = !(state.collapsed[key] ?? index > 3);
    } else if (target.hasAttribute("data-pg-clear")) {
      state.selected[fam.id] = {};
      state.search[fam.id] = "";
    } else if (target.dataset.pgRemove) {
      const [groupId, optionId] = target.dataset.pgRemove.split(":");
      const list = selection(fam)[groupId] || [];
      selection(fam)[groupId] = list.filter((id) => id !== optionId);
    } else if (target.dataset.pgMore) {
      const id = target.dataset.pgMore;
      if (state.expanded.has(id)) state.expanded.delete(id); else state.expanded.add(id);
    } else if (target.dataset.pgDrawer) {
      state.drawer = target.dataset.pgDrawer === "open";
      document.body.classList.toggle("pg-drawer-open", state.drawer);
    }
    render();
  });

  document.addEventListener("change", (event) => {
    const root = document.querySelector("#guideRoot");
    if (!root || !root.contains(event.target)) return;
    const fam = family();
    const input = event.target;
    if (input.dataset.pgGroup) {
      const sel = selection(fam);
      const list = sel[input.dataset.pgGroup] || (sel[input.dataset.pgGroup] = []);
      if (input.checked && !list.includes(input.value)) list.push(input.value);
      if (!input.checked) sel[input.dataset.pgGroup] = list.filter((id) => id !== input.value);
    } else if (input.hasAttribute("data-pg-sets")) {
      state.sets[fam.id] = input.checked;
    } else if (input.hasAttribute("data-pg-sort")) {
      state.sort = input.value;
    } else {
      return;
    }
    render();
  });

  let searchTimer = null;
  document.addEventListener("input", (event) => {
    if (!event.target.matches?.("#guideRoot [data-pg-search]")) return;
    state.search[family().id] = event.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => render(true), 160);
  });

  window.renderProductGuide = () => render();
})();
