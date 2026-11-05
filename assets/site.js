// START /assets/site.js v3

// Add permalink anchors to major titled sections.
// The page remains fully usable if JavaScript is unavailable.
document.querySelectorAll('main[data-section-permalinks] section[id]').forEach((section) => {
  const heading = section.querySelector(
    ':scope > .narrow > h2.section-title, :scope > h2.section-title'
  );

  if (!heading || heading.querySelector('.heading-anchor')) return;

  const sectionLabel = heading.textContent.trim();
  const anchor = document.createElement('a');

  anchor.className = 'heading-anchor';
  anchor.setAttribute('href', `#${encodeURIComponent(section.id)}`);
  anchor.setAttribute('aria-label', `Permalink to ${sectionLabel}`);
  anchor.setAttribute('title', `Permalink to ${sectionLabel}`);
  anchor.textContent = '#';

  heading.classList.add('anchor-heading');
  heading.prepend(anchor);
});

// END /assets/site.js
