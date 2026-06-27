const config = JSON.parse(document.getElementById('site-config-data').textContent);
const pageType = window.location.pathname.endsWith('form.html') ? 'form' : 'home';
const titleEl = document.getElementById('site-title');
const navEl = document.getElementById('site-nav');

if (titleEl) {
  titleEl.textContent = config.title;
}

function formatNavItem(item) {
  const link = document.createElement('a');
  link.textContent = item.label;
  link.href = item.href;
  link.style.backgroundColor = config.palette[item.color]?.hex || '#252525';
  return link;
}

if (navEl) {
  const navItems = config.navigation[pageType] || [];
  navItems.forEach((item) => navEl.appendChild(formatNavItem(item)));
}

const introSection = document.getElementById('home-intro');
if (introSection) {
  const heading = document.createElement('h2');
  heading.textContent = config.home.intro.heading;
  const copy = document.createElement('p');
  copy.textContent = config.home.intro.subheading;
  introSection.appendChild(heading);
  introSection.appendChild(copy);
}

const cardsSection = document.getElementById('home-cards');
if (cardsSection) {
  config.home.cards.forEach((card) => {
    const article = document.createElement('article');
    article.className = `card card--${card.pattern}`;

    const accent = document.createElement('div');
    accent.className = 'card__accent';
    accent.textContent = card.icon;
    accent.style.backgroundColor = config.palette[card.accent]?.hex || '#252525';

    const title = document.createElement('h3');
    title.className = 'card__title';
    title.textContent = card.title;

    const description = document.createElement('p');
    description.className = 'card__description';
    description.textContent = card.description;

    article.appendChild(accent);
    article.appendChild(title);
    article.appendChild(description);
    cardsSection.appendChild(article);
  });
}

const ctaSection = document.getElementById('home-cta');
if (ctaSection) {
  const button = document.createElement('a');
  button.className = 'btn';
  button.textContent = config.cta.label;
  button.href = config.cta.href;
  ctaSection.appendChild(button);
}

const paletteStrip = document.getElementById('palette-strip');
if (paletteStrip) {
  Object.values(config.palette).forEach((color) => {
    const dot = document.createElement('span');
    dot.className = 'palette-dot';
    dot.style.backgroundColor = color.hex;
    dot.setAttribute('title', `${color.name} ${color.pantone}`);
    paletteStrip.appendChild(dot);
  });
}
