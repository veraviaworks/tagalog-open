import {
  getTournamentSettings,
  getPlayers,
  getMatches,
  getBracket,
  getAnnouncements,
  getRules,
  getWinnerInformation,
} from '../services/data-service.js';

// code to tell system which fucking page is open
const page = document.body.dataset.page || 'home';

// Shared navigation links used in the header.
const links = [
  ['home', 'index.html', 'Home'],
  ['players', 'players.html', 'Players'],
  ['schedule', 'schedule.html', 'Schedule'],
  ['bracket', 'bracket.html', 'Bracket'],
  ['results', 'results.html', 'Scores'],
  ['rules', 'rules.html', 'Rules'],
  ['announcements', 'announcements.html', 'Announcements'],
];

const pageTitles = {
  home: '',
  players: 'Players',
  schedule: 'Schedule',
  bracket: 'Bracket',
  results: 'Scores & Results',
  rules: 'Rules',
  announcements: 'Announcements',
};
const PH_TIMEZONE = 'Asia/Manila';

// dvb shared layout helper

function renderShell(settings = {}) {
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');
  const siteName = settings.name || 'Tagalog Open';
  const presentedBy = settings.presentedBy || 'Office of the Mayor, City of Los Santos';
  const location = settings.location || 'Vespucci Beach Tennis Court';
  const brandMark = siteName
    .split(/\s+/)
    .map((word) => word[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const currentYear = settings.startDate
    ? new Date(settings.startDate).getFullYear()
    : new Date().getFullYear();

  const pageTitle = pageTitles[page];
  document.title = pageTitle ? `${pageTitle} | ${siteName}` : `${siteName} | City of Los Santos`;

  // DVB NOTE - The header and footer are not repeated manually in every HTML page.
  // Instead, this function injects the shared site layout into placeholder divs.
  header.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="container nav-wrap">
        <a class="brand" href="index.html" aria-label="${escapeHtml(siteName)} home">
          <span class="brand-mark">${escapeHtml(brandMark)}</span>
          <span>${escapeHtml(siteName)}</span>
        </a>

        <nav class="nav-links" id="site-nav" aria-label="Primary navigation">
          ${links
            .map(
              ([id, href, label]) => `
                <a href="${href}" ${id === page ? 'class="active" aria-current="page"' : ''}>
                  ${label}
                </a>
              `
            )
            .join('')}
        </nav>

        <button
          class="menu-toggle"
          type="button"
          aria-label="Open navigation"
          aria-expanded="false"
          aria-controls="site-nav"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  `;

  footer.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="brand" href="index.html">
              <span class="brand-mark">${escapeHtml(brandMark)}</span>
              <span>${escapeHtml(siteName)}</span>
            </a>
            <p class="footer-copy">
              ${escapeHtml(settings.tagline || `A premier tennis tournament celebrating competition, community, and the city's finest sporting talent.`)}
            </p>
          </div>

          <div>
            <div class="footer-title">Tournament</div>
            <div class="footer-links">
              <a href="players.html">Players</a>
              <a href="schedule.html">Schedule</a>
              <a href="bracket.html">Bracket</a>
              <a href="results.html">Scores & results</a>
            </div>
          </div>

          <div>
            <div class="footer-title">Information</div>
            <div class="footer-links">
              <a href="rules.html">Official rules</a>
              <a href="announcements.html">Announcements</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <span>Presented by ${escapeHtml(presentedBy)}</span>
          <span>&copy; ${currentYear} ${escapeHtml(siteName)} · ${escapeHtml(location)}</span>
        </div>
      </div>
    </footer>
  `;

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  // for fookinginang mobile view open close behavior
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');

    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', open);
  });

  nav.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
}

//  For status badge - Live, Upcoming, or Completed.
const badge = (status) => `
  ${String(status || '').trim()
    ? `<span class="badge badge-${String(status).toLowerCase().replace(/\s+/g, '-')}">${status}</span>`
    : ''}
`;

const toArray = (value) => (Array.isArray(value) ? value : []);

const toObject = (value) =>
  value && typeof value === 'object' && !Array.isArray(value) ? value : {};

const toBool = (value) => String(value).trim().toLowerCase() === 'true';

const formatDisplayName = (value) =>
  escapeHtml(value || 'Tagalog Open').replace(/\s+/g, '<br>');

const formatMoney = (value) => {
  const raw = String(value ?? '').trim();

  if (!raw) {
    return '';
  }

  return raw.startsWith('$') ? raw : `$${raw}`;
};

function formatSheetTime(value) {
  const raw = String(value || '').trim();

  if (!raw) {
    return '';
  }

  // Added for ISO date time PH zone 
  if (raw.includes('T')) {
    const parsed = new Date(raw);

    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat('en-PH', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: PH_TIMEZONE,
      }).format(parsed);
    }
  }

  return raw;
}

function getPhilippineDateParts(value) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: PH_TIMEZONE,
  });

  const parts = formatter.formatToParts(parsed);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    return null;
  }

  return { year, month, day };
}

function normalizePhilippineDate(value) {
  const raw = String(value || '').trim();

  if (!raw) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const parts = getPhilippineDateParts(raw);

  if (parts) {
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  return raw;
}

function formatSheetDate(value) {
  const normalized = normalizePhilippineDate(value);

  if (!normalized) {
    return '';
  }

  const parsed = new Date(`${normalized}T00:00:00+08:00`);

  if (Number.isNaN(parsed.getTime())) {
    return normalized;
  }

  return new Intl.DateTimeFormat('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: PH_TIMEZONE,
  }).format(parsed);
}

// Small helper to safely print text into HTML when needed.
const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>'"]/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[char]
  );

const formatMultilineHtml = (value) =>
  escapeHtml(value).replace(/\r?\n/g, '<br>');

const formatMatchupHtml = (player1, player2) => {
  const leftRaw = String(player1 ?? '').trim();
  const rightRaw = String(player2 ?? '').trim();
  const left = escapeHtml(leftRaw || 'TBD');
  const right = escapeHtml(rightRaw || 'TBD');

  if (!leftRaw && !rightRaw) {
    return '<span class="tbd-state">TBD</span>';
  }

  return `${left}<br><span class="muted">vs ${right}</span>`;
};

const formatMatchScore = (match) => {
  const p1 = String(match?.P1_Score ?? match?.p1_score ?? '').trim();
  const p2 = String(match?.P2_Score ?? match?.p2_score ?? '').trim();
  const legacyScore = String(match?.score ?? '').trim();

  if (p1 || p2) {
    return {
      p1: escapeHtml(p1 || '-'),
      p2: escapeHtml(p2 || '-'),
      text: escapeHtml(`${p1 || '-'} - ${p2 || '-'}`),
    };
  }

  return {
    p1: '',
    p2: '',
    text: escapeHtml(legacyScore || '-'),
  };
};

const formatWinner = (value) => String(value ?? '').trim() || 'TBD';

const formatMatchDate = (value) => {
  const raw = String(value ?? '').trim();

  return raw ? escapeHtml(raw) : '<span class="tbd-state">TBD</span>';
};

const formatScoreStrip = (match) => {
  const score = formatMatchScore(match);

  if (score.p1 || score.p2) {
    return `<span class="score-line-simple">${score.p1}-${score.p2}</span>`;
  }

  return `<span class="score-legacy">${score.text}</span>`;
};

function openModal(content) {
  const modal = document.querySelector('#detail-modal');

  if (!modal) {
    return;
  }

  modal.querySelector('.modal-panel').innerHTML = `
    <button class="modal-close" type="button" aria-label="Close details">x</button>
    ${content}
  `;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-close').focus();

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  modal.querySelector('.modal-close').addEventListener('click', close);
  modal.onclick = (event) => {
    if (event.target === modal) {
      close();
    }
  };

  document.onkeydown = (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      close();
    }
  };
}

function announcementModalMarkup(announcement) {
  return `
    ${
      announcement.photo
        ? `
          <img class="announcement-modal-photo" src="${escapeHtml(announcement.photo)}" alt="${escapeHtml(
            announcement.title
          )}">
        `
        : ''
    }
    <div class="announcement-modal-meta">
      ${badge(announcement.pinned ? 'Pinned' : 'Announcement')}
      ${announcement.urgent ? badge('Urgent') : ''}
      <span>${announcement.date}</span>
      <span>&bull;</span>
      <span>${announcement.category}</span>
    </div>
    <h2 class="modal-title">${announcement.title}</h2>
    <p>${announcement.content}</p>
  `;
}

// ---------------------------------------------------------------------------
// DVB Home page
// ---------------------------------------------------------------------------

async function renderHome() {
  try {
    const [settingsRaw, announcementsRaw, matchesRaw, winnersRaw] = await Promise.all([
      getTournamentSettings(),
      getAnnouncements(),
      getMatches(),
      getWinnerInformation(),
    ]);

    const settings = toObject(settingsRaw);
    const announcements = toArray(announcementsRaw).map((announcement) => ({
      ...announcement,
      pinned: toBool(announcement?.pinned),
      urgent: toBool(announcement?.urgent),
      photo: String(announcement?.photo || '').trim(),
    }));
    const matches = toArray(matchesRaw);
    const winners = {
      ...toObject(winnersRaw),
      concluded: toBool(winnersRaw?.concluded),
    };
    const featuredAnnouncement = announcements.find((announcement) => announcement?.pinned) || announcements[0];
    const liveMatches = matches
      .filter((match) => match?.status === 'Live')
      .sort((a, b) => getPhilippineTimestamp(a?.date, a?.time, '00:00:00') - getPhilippineTimestamp(b?.date, b?.time, '00:00:00'));
    const upcomingMatches = matches
      .filter((match) => match?.status === 'Upcoming')
      .sort(
        (a, b) =>
          getPhilippineTimestamp(a?.date, a?.time, '23:59:59') -
          getPhilippineTimestamp(b?.date, b?.time, '23:59:59')
      );
    const featuredMatches = liveMatches.length ? liveMatches : upcomingMatches.slice(0, 1);
    const featuredMatchTitle = liveMatches.length > 1 ? 'Featured matches' : 'Featured match';
    const prizeTiers = [
      {
        place: 'Champion',
        amount: settings.prizeChampion || settings.prize,
        note: settings.prizeChampionNote || 'Top prize',
      },
      {
        place: '2nd Placer',
        amount: settings.prizeSecond,
        note: settings.prizeSecondNote || 'Runner-up prize',
      },
      {
        place: '3rd Placer',
        amount: settings.prizeThird,
        note: settings.prizeThirdNote || 'Third place prize',
      },
    ].filter((tier) => tier.amount);

    const prizeSection = prizeTiers.length
      ? `
        <section class="section section-soft prize-section reveal-section">
          <div class="container">
            <div class="section-heading">
              <div>
                <div class="eyebrow" style="color: var(--green-2)">Prize list</div>
                <h2 class="section-title">Tournament prizes</h2>
              </div>
              <p class="muted"></p>
            </div>

            <div class="cards-3 prize-grid">
              ${prizeTiers
                .map(
                  (tier) => `
                    <article class="card outcome-card prize-card">
                      <div class="outcome-icon prize-icon">${tier.place === 'Champion' ? '1' : tier.place === '2nd Placer' ? '2' : '3'}</div>
                      <div class="eyebrow">${tier.place}</div>
                      <h3>${formatMoney(tier.amount)}</h3>
                      <p class="muted">${tier.note}</p>
                    </article>
                  `
                )
                .join('')}
            </div>
          </div>
        </section>
      `
      : '';

    document.querySelector('[data-home]').innerHTML = `
    <section class="hero">
      <div class="container hero-grid">
          <div class="hero-copy">
            <div class="eyebrow">Presented by ${escapeHtml(settings.presentedBy || 'Office of the Mayor')}</div>
            <h1 class="display">${formatDisplayName(settings.name)}</h1>
            <p class="lead">
            ${settings.tagline || "The Tagalog Open is the City's premier tennis championship. Competitors battle through a single-elimination tournament for the opportunity to become the Tagalog Open Champion."} Los Santos steps onto center court for three nights
            of precision, pressure, and championship tennis.
            </p>
          <div class="hero-actions">
            <a
              class="button button-primary"
              href="https://bit.ly/45vG1QQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              Register now <span></span>
            </a>
            <a class="button button-primary" href="schedule.html">
              View schedule <span></span>
            </a>
            <a class="button button-secondary" href="players.html">Meet the players</a>
          </div>
        </div>

        <aside class="hero-card">
          <div class="hero-card-label">First serve in</div>
          <div class="countdown" data-countdown aria-live="polite"></div>
          <div class="hero-meta">
            <div>
              <span class="hero-card-label">Dates</span>
              <strong>${settings.displayDate || formatSheetDate(settings.startDate) || 'Dates to be announced'}</strong>
              ${
                formatSheetTime(settings.displayTime || settings.startTime) || settings.timezoneLabel
                  ? `
                    <div class="muted">
                      ${formatSheetTime(settings.displayTime || settings.startTime) || ''}
                      ${formatSheetTime(settings.displayTime || settings.startTime) && settings.timezoneLabel ? ' · ' : ''}
                      ${settings.timezoneLabel || ''}
                    </div>
                  `
                  : ''
              }
            </div>
            <div>
              <span class="hero-card-label">Venue</span>
              <strong>${settings.location || 'Vespucci Beach Tennis Court'}</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>

    ${prizeSection}

    <section class="section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat">
            <strong>${settings.registeredCount}</strong>
            <span>Players registered</span>
          </div>
          <div class="stat">
            <strong>${settings.capacity}</strong>
            <span>Player capacity</span>
          </div>
          <div class="stat">
            <strong>${settings.totalMatches}</strong>
            <span>Matches</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-soft featured-matches-section reveal-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow" style="color: var(--green-2)">CITY OF LOS SANTOS • TAGALOG OPEN</div>
            <h2 class="section-title">The court belongs<br>to Los Santos</h2>
          </div>
          <p class="lead" style="color: #5e6b64">
            The Tagalog Open is the City's premier tennis championship. Competitors battle through a single-elimination
            tournament for the opportunity to become the Tagalog Open Champion.
          </p>
        </div>

        <div class="cards-3">
          <article class="card">
            <div class="card-kicker">Registration</div>
            <h3>${settings.registrationStatus}</h3>
            <p class="muted">
              Registration remains open until the announced deadline or until registration is officially closed by the
              tournament organizers.
            </p>
          </article>

          <article class="card">
            <div class="card-kicker">Format</div>
            <h3>${settings.format}</h3>
            <p class="muted">
              Opening rounds are <strong>Race to 3</strong>. Quarterfinals, Semifinals, and Finals are
              <strong>Race to 6</strong>.
            </p>
          </article>

          <article class="card" id="venue">
            <div class="card-kicker">Venue</div>
            <h3>Vespucci Beach Tennis Court</h3>
            <p class="muted">Competitors should refer to the match schedule for their assigned court and start time.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Pinned update</div>
            <h2 class="section-title">Latest announcement</h2>
          </div>
          <a class="button button-secondary" href="announcements.html">All announcements</a>
        </div>

          <article class="announcement-feature">
            <div class="feature-label">Official<br>Notice</div>
            <div class="feature-body">
              ${
                featuredAnnouncement
                  ? `
                    <div class="announcement-feature-layout">
                      <div class="announcement-feature-copy">
                        <div class="card-kicker">
                          ${featuredAnnouncement.category} - ${featuredAnnouncement.date}
                        </div>
                        <h3>${featuredAnnouncement.title}</h3>
                        <p class="multiline-copy">${formatMultilineHtml(featuredAnnouncement.content)}</p>
                        <a class="button button-primary" href="announcements.html">Read updates</a>
                      </div>
                      ${
                        featuredAnnouncement.photo
                          ? `
                            <button class="announcement-feature-thumb" type="button" data-announcement-feature>
                              <img
                                src="${escapeHtml(featuredAnnouncement.photo)}"
                                alt="${escapeHtml(featuredAnnouncement.title)}"
                              >
                              <span>View photo</span>
                            </button>
                          `
                          : ''
                      }
                    </div>
                  `
                  : `
                    <div class="card-kicker">Announcements</div>
                    <h3>No announcements yet</h3>
                    <p>Updates will appear here once you add rows to the announcements tab.</p>
                    <a class="button button-primary" href="announcements.html">View announcements</a>
                  `
              }
            </div>
          </article>
        </div>
    </section>

    <section class="section section-soft reveal-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow" style="color: var(--green-2)">Center court</div>
            <h2 class="section-title">${featuredMatchTitle}</h2>
          </div>
        </div>
        ${featureMatchList(featuredMatches)}
      </div>
    </section>

    <section class="section section-soft honors-section reveal-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow">${winners.concluded ? 'Final results' : 'The road ahead'}</div>
            <h2 class="section-title">${winners.concluded ? 'Tournament honors' : 'Tournament honors pending'}</h2>
          </div>
          <p class="muted">${winners.concluded ? 'Official honors are now finalized.' : 'Revealed after championship night'}</p>
        </div>

        <div class="outcomes ${winners.concluded ? 'is-final' : 'is-pending'}">
          <div class="card outcome-card ${winners.concluded ? 'is-final' : 'is-pending'}">
            <div class="outcome-icon">1</div>
            <div class="eyebrow">Champion</div>
            <h3>${winners.champion || 'TBD'}</h3>
          </div>
          <div class="card outcome-card ${winners.concluded ? 'is-final' : 'is-pending'}">
            <div class="outcome-icon">2</div>
            <div class="eyebrow">2nd Placer</div>
            <h3>${winners.secondPlacer || winners.runnerUp || 'TBD'}</h3>
          </div>
          <div class="card outcome-card ${winners.concluded ? 'is-final' : 'is-pending'}">
            <div class="outcome-icon">3</div>
            <div class="eyebrow">3rd Placer</div>
            <h3>${winners.thirdPlacer || winners.mvp || 'TBD'}</h3>
          </div>
        </div>
      </div>
    </section>

    <section class="section explore-section reveal-section">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow">Explore</div>
            <h2 class="section-title">Follow the tournament</h2>
          </div>
        </div>

        <div class="cards-3">
          <a class="card quick-card" href="bracket.html">
            <div>
              <div class="card-kicker">Progression</div>
              <h3>Championship bracket</h3>
            </div>
            <span class="arrow"></span>
          </a>

          <a class="card quick-card" href="results.html">
            <div>
              <div class="card-kicker">Courtside</div>
              <h3>Live scores & results</h3>
            </div>
            <span class="arrow"></span>
          </a>

          <a class="card quick-card" href="rules.html">
            <div>
              <div class="card-kicker">Official</div>
              <h3>Tournament rules</h3>
            </div>
            <span class="arrow"></span>
          </a>
        </div>
      </div>
    </section>

  `;

    if (featuredAnnouncement?.photo) {
      document.querySelector('[data-announcement-feature]')?.addEventListener('click', () => {
        openModal(announcementModalMarkup(featuredAnnouncement));
      });
    }

    startCountdown(settings);
  } catch (error) {
    console.error('Home page render failed', error);

    const fallbackSettings = toObject(
      await getTournamentSettings().catch(() => ({
          tagline:
          "The Tagalog Open is the City's premier tennis championship. Competitors battle through a single-elimination tournament for the opportunity to become the Tagalog Open Champion.",
      }))
    );

    document.querySelector('[data-home]').innerHTML = `
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <div class="eyebrow">Presented by ${escapeHtml(fallbackSettings.presentedBy || 'Office of the Mayor')}</div>
            <h1 class="display">${formatDisplayName(fallbackSettings.name)}</h1>
            <p class="lead">
              ${fallbackSettings.tagline || "The Tagalog Open is the City's premier tennis championship. Competitors battle through a single-elimination tournament for the opportunity to become the Tagalog Open Champion."} Los Santos steps onto center court for three nights
              of precision, pressure, and championship tennis.
            </p>
          </div>

          <aside class="hero-card">
            <div class="hero-card-label">Home page fallback</div>
            <p class="muted">
              The live sheet data loaded with a mismatch, so the homepage is showing a safe fallback view.
            </p>
          </aside>
        </div>
      </section>

      ${prizeSection}
    `;
  }
}

function featureMatch(match) {
  if (!match) {
    return '<article class="card"><p class="muted">No featured match available yet.</p></article>';
  }

  return `
    <article class="card">
      <div class="match-feature">
        <div>
          <div class="competitor">${escapeHtml(String(match.player1 ?? '').trim() || 'TBD')}</div>
          <div class="muted">${match.round}</div>
        </div>
        <div class="versus">VS</div>
        <div>
          <div class="competitor">${escapeHtml(String(match.player2 ?? '').trim() || 'TBD')}</div>
          <div class="muted">${escapeHtml(match.court)} - ${escapeHtml(match.time)}</div>
        </div>
      </div>
    </article>
  `;
}

function featureMatchList(matches) {
  const list = toArray(matches).filter(Boolean);

  if (!list.length) {
    return '<article class="card"><p class="muted">No featured match available yet.</p></article>';
  }

  const [spotlight, ...rest] = list;

  return `
    <div class="featured-match-stack">
      <article class="card featured-match-spotlight">
        <div class="card-kicker">${badge(spotlight.status)}</div>
        <div class="match-feature">
          <div>
            <div class="competitor">${escapeHtml(String(spotlight.player1 ?? '').trim() || 'TBD')}</div>
            <div class="muted">${spotlight.round}</div>
          </div>
          <div class="versus">VS</div>
          <div>
            <div class="competitor">${escapeHtml(String(spotlight.player2 ?? '').trim() || 'TBD')}</div>
            <div class="muted">${escapeHtml(spotlight.court)} - ${escapeHtml(spotlight.time)}</div>
          </div>
        </div>
      </article>

      ${
        rest.length
          ? `
            <div class="featured-match-queue">
              <div class="queue-label">${rest.length > 1 ? 'More live matches' : 'Another live match'}</div>
              ${rest
                .map(
                  (match) => `
                    <article class="mini-match">
                      <div class="mini-match-head">
                        <strong>${escapeHtml(String(match.player1 ?? '').trim() || 'TBD')}</strong>
                        <span>${escapeHtml(match.time)}</span>
                      </div>
                      <div class="mini-match-vs">vs ${escapeHtml(String(match.player2 ?? '').trim() || 'TBD')}</div>
                      <div class="mini-match-meta">
                        <span>${escapeHtml(match.round)}</span>
                        <span>${escapeHtml(match.court)}</span>
                      </div>
                    </article>
                  `
                )
                .join('')}
            </div>
          `
          : ''
      }
    </div>
  `;
}

function parseTimeTo24Hour(timeValue, fallback = '00:00:00') {
  const value = String(timeValue || '').trim();

  if (!value) {
    return fallback;
  }

  const normalized = value.toUpperCase().replace(/\s+/g, ' ');
  const match = normalized.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);

  if (!match) {
    return fallback;
  }

  let hours = Number(match[1]);
  const minutes = match[2] || '00';
  const period = match[3];

  if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  }

  return `${String(hours).padStart(2, '0')}:${minutes}:00`;
}

function getPhilippineTimestamp(dateValue, timeValue, fallbackTime) {
  const value = normalizePhilippineDate(dateValue);

  if (!value) {
    return NaN;
  }

  const time = parseTimeTo24Hour(timeValue, fallbackTime);
  return new Date(`${value}T${time}+08:00`).getTime();
}

function startCountdown(settings) {
  const element = document.querySelector('[data-countdown]');
  if (!element || !settings?.startDate) {
    return;
  }

  const tick = () => {
    const now = Date.now();
    const start = getPhilippineTimestamp(
      settings.startDate,
      settings.startTime || formatSheetTime(settings.displayTime),
      '00:00:00'
    );
    const end = settings.endDate
      ? getPhilippineTimestamp(
          settings.endDate,
          settings.endTime || formatSheetTime(settings.endDisplayTime),
          '23:59:59'
        )
      : Number.POSITIVE_INFINITY;

    if (Number.isNaN(start)) {
      return;
    }

    if (now >= end) {
      element.innerHTML = '<div class="count-message" style="grid-column: 1 / -1">Tournament Completed</div>';
      return;
    }

    if (now >= start) {
      element.innerHTML = '<div class="count-message" style="grid-column: 1 / -1">Tournament In Progress</div>';
      return;
    }

    const distance = Math.max(0, start - now);
    const units = [
      ['Days', Math.floor(distance / 86400000)],
      ['Hours', Math.floor(distance / 3600000) % 24],
      ['Minutes', Math.floor(distance / 60000) % 60],
      ['Seconds', Math.floor(distance / 1000) % 60],
    ];

    element.innerHTML = units
      .map(
        ([label, value]) => `
          <div class="count-unit">
            <strong>${String(value).padStart(2, '0')}</strong>
            <span>${label}</span>
          </div>
        `
      )
      .join('');
  };

  tick();
  setInterval(tick, 1000);
}

function initScrollReveal() {
  const sections = document.querySelectorAll('[data-home] .reveal-section');

  if (!sections.length) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -6% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// ---------------------------------------------------------------------------
// DVB Players page
// ---------------------------------------------------------------------------

async function renderPlayers() {
  const players = await getPlayers();
  const grid = document.querySelector('#players-grid');
  const search = document.querySelector('#player-search');
  const normalizePlayer = (player) => ({
    id: String(player?.id ?? '').trim() || 'TBD',
    name: String(player?.name ?? '').trim() || 'TBD',
    initials: String(player?.initials ?? '').trim() || 'TBD',
    status: String(player?.status ?? '').trim() || 'TBD',
  });

  const draw = () => {
    const term = search.value.toLowerCase();
    const list = players.map(normalizePlayer).filter((player) =>
      `${player.id} ${player.name} ${player.initials} ${player.status}`.toLowerCase().includes(term)
    );

    document.querySelector('#player-count').textContent = `${list.length} player${list.length === 1 ? '' : 's'}`;

    grid.innerHTML = list.length
      ? list
          .map(
            (player) => `
              <article class="card player-card">
                <div class="player-top">
                  <div class="avatar">${player.initials}</div>
                  <div class="seed">${player.id}</div>
                </div>
                <h3>${player.name}</h3>
                <div class="card-footer">
                  ${badge(player.status)}
                  <button class="text-button" data-player="${player.id}">View profile -></button>
                </div>
              </article>
            `
          )
          .join('')
      : `
          <div class="empty-state" style="grid-column: 1 / -1">
            <strong>No players found</strong>
            Try another name or organization.
          </div>
        `;

    grid.querySelectorAll('[data-player]').forEach((button) => {
      button.onclick = () => {
        const player = players.map(normalizePlayer).find((entry) => entry.id === button.dataset.player);

        openModal(`
          <div class="avatar">${player.initials}</div>
          <h2 class="modal-title">${player.name}</h2>
          <p class="muted">Player details at a glance</p>
          <div class="detail-grid">
            <div class="detail">
              <small>ID</small>
              <strong>${player.id}</strong>
            </div>
            <div class="detail">
              <small>Status</small>
              <strong>${player.status}</strong>
            </div>
          </div>
        `);
      };
    });
  };

  search.addEventListener('input', draw);
  draw();
}

// ---------------------------------------------------------------------------
// DVB Schedule page
// ---------------------------------------------------------------------------

async function renderSchedule() {
  const matches = await getMatches();
  const controls = ['round', 'status', 'court', 'search'];
  const elements = Object.fromEntries(
    controls.map((control) => [control, document.querySelector(`#filter-${control}`)])
  );

  const uniqueValues = (key) => [...new Set(matches.map((match) => match[key]))];

  elements.round.innerHTML =
    '<option value="">All rounds</option>' +
    uniqueValues('round').map((value) => `<option>${value}</option>`).join('');

  elements.status.innerHTML =
    '<option value="">All statuses</option>' +
    uniqueValues('status').map((value) => `<option>${value}</option>`).join('');

  elements.court.innerHTML =
    '<option value="">All courts</option>' +
    uniqueValues('court').map((value) => `<option>${value}</option>`).join('');

  const draw = () => {
    const list = matches.filter(
      (match) =>
        (!elements.round.value || match.round === elements.round.value) &&
        (!elements.status.value || match.status === elements.status.value) &&
        (!elements.court.value || match.court === elements.court.value) &&
        `${match.player1} ${match.player2}`.toLowerCase().includes(elements.search.value.toLowerCase())
    );

    document.querySelector('#schedule-body').innerHTML = list
      .map(
        (match) => `
          <tr>
            <td>${formatMatchDate(match.displayDate)}</td>
            <td>${match.court}</td>
            <td>${match.round}</td>
            <td class="name-cell">${formatMatchupHtml(match.player1, match.player2)}</td>
            <td>
              <div class="schedule-score">${formatScoreStrip(match)}</div>
            </td>
            <td><span class="winner-pill ${formatWinner(match.winner) === 'TBD' ? 'tbd' : ''}">${escapeHtml(formatWinner(match.winner))}</span></td>
            <td>${badge(match.status)}</td>
          </tr>
        `
      )
      .join('');

    document.querySelector('#schedule-mobile').innerHTML = list
      .map(
        (match) => `
          <article class="mobile-match">
            <div class="mobile-match-head">
              <strong>${formatMatchDate(match.displayDate)}</strong>
              ${badge(match.status)}
            </div>
            <div class="mobile-match-players">
              ${formatMatchupHtml(match.player1, match.player2)}
            </div>
            <div class="mobile-match-score">${formatScoreStrip(match)}</div>
            <div class="mobile-match-winner">
              <span>Winner</span>
              <strong class="${formatWinner(match.winner) === 'TBD' ? 'tbd' : ''}">${escapeHtml(formatWinner(match.winner))}</strong>
            </div>
            <div class="mobile-match-meta">
              <span>${match.round}</span>
              <span>${match.court}</span>
            </div>
          </article>
        `
      )
      .join('');

    document.querySelector('#schedule-empty').hidden = !!list.length;
    document.querySelector('.table-wrap').style.visibility = list.length ? 'visible' : 'hidden';
  };

  Object.values(elements).forEach((element) => {
    element.addEventListener(element.tagName === 'INPUT' ? 'input' : 'change', draw);
  });

  draw();
}

// ---------------------------------------------------------------------------
// DVB Bracket page
// ---------------------------------------------------------------------------

async function renderBracket() {
  const rows = await getBracket();
  const list = Array.isArray(rows) ? rows : [];
  const roundOrder = ['Laglagan', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Final', 'Champion'];
  const roundAliases = {
    round1: 'Laglagan',
    'round 1': 'Laglagan',
    roundof16: 'Round of 16',
    'round of 16': 'Round of 16',
    quarterfinals: 'Quarter Finals',
    'quarter finals': 'Quarter Finals',
    semifinals: 'Semi Finals',
    'semi finals': 'Semi Finals',
    final: 'Final',
    finals: 'Final',
    champion: 'Champion',
    laglagan: 'Laglagan',
  };

  const groupedRounds = list.reduce((acc, row) => {
    const rawRound = String(row.roundname ?? row.roundName ?? row.round ?? '').trim();
    const aliasKey = rawRound.toLowerCase().replace(/\s+/g, '');
    const roundName = roundAliases[aliasKey] || rawRound || 'Bracket';
    const currentMatches = acc[roundName] || [];
    const matchNumber = Number(row.matchNumber ?? row.matchnumber ?? currentMatches.length + 1);

    if (!acc[roundName]) {
      acc[roundName] = [];
    }

    acc[roundName].push({
      matchNumber: Number.isFinite(matchNumber) ? matchNumber : currentMatches.length + 1,
      player1: String(row.player1 ?? 'TBD').trim() || 'TBD',
      player2: String(row.player2 ?? 'TBD').trim() || 'TBD',
      winner: String(row.winner ?? '').trim(),
      laglagan: String(row.laglagan ?? row.lagLagan ?? row.eliminated ?? '').trim(),
    });

    return acc;
  }, {});

  const roundSizes = {
    Laglagan: 16,
    'Round of 16': 8,
    'Quarter Finals': 4,
    'Semi Finals': 2,
    Final: 1,
    Champion: 1,
  };

  const buildMatch = (matchNumber, match) => ({
    matchNumber,
    player1: String(match?.player1 ?? 'TBD').trim() || 'TBD',
    player2: String(match?.player2 ?? 'TBD').trim() || 'TBD',
    winner: String(match?.winner ?? '').trim(),
    laglagan: String(match?.laglagan ?? match?.lagLagan ?? match?.eliminated ?? '').trim(),
  });

  const rounds = roundOrder.map((name) => {
    const expectedCount = roundSizes[name] || 0;
    const matches = (groupedRounds[name] || []).sort((a, b) => a.matchNumber - b.matchNumber);
    const matchMap = new Map(matches.map((match) => [match.matchNumber, match]));

    return {
      name,
      matches: Array.from({ length: expectedCount }, (_, index) => buildMatch(index + 1, matchMap.get(index + 1))),
    };
  });

  const advanceWinner = (match) => {
    const winner = String(match?.winner ?? '').trim();
    if (winner) {
      return winner;
    }

    const player1 = String(match?.player1 ?? '').trim();
    const player2 = String(match?.player2 ?? '').trim();
    const isBye = (value) => /^(bye|automatic advance|auto advance)$/i.test(value);

    if (player1 && isBye(player2)) {
      return player1;
    }

    if (player2 && isBye(player1)) {
      return player2;
    }

    return 'TBD';
  };

  const seededRounds = rounds.map((round, roundIndex, allRounds) => {
    if (roundIndex === 0) {
      return round;
    }

    const previousRound = allRounds[roundIndex - 1];

    return {
      ...round,
      matches: round.matches.map((match) => {
        const previousMatchA = previousRound?.matches?.[(match.matchNumber - 1) * 2];
        const previousMatchB = previousRound?.matches?.[(match.matchNumber - 1) * 2 + 1];

        if (round.name === 'Champion') {
          return {
            ...match,
            player1: advanceWinner(previousMatchA) || match.player1 || 'TBD',
            player2: '',
          };
        }

        return {
          ...match,
          player1: advanceWinner(previousMatchA) || match.player1 || 'TBD',
          player2: advanceWinner(previousMatchB) || match.player2 || 'TBD',
        };
      }),
    };
  });

  document.querySelector('#bracket').innerHTML = rounds
    .map((round, index) => ({
      ...round,
      matches: seededRounds[index]?.matches || round.matches,
    }))
    .map(
      (round) => `
        <section class="bracket-round ${round.name === 'Champion' ? 'champion-round' : ''}">
          <h3>${round.name}</h3>
          <div class="round-matches">
            ${
      round.matches.length
        ? round.matches
            .map(
              (match) => `
                        <article class="bracket-match ${round.name === 'Champion' ? 'champion-winner' : ''}" aria-label="${round.name} match ${match.matchNumber}">
                          ${
                            round.name === 'Champion'
                              ? `
                                <div class="bracket-champion">
                                  <div class="champion-badge">🏆 Champion</div>
                                  <div class="champion-name ${match.player1 === 'TBD' ? 'tbd' : ''}">
                                    ${match.player1}
                                  </div>
                                </div>
                              `
                              : `
                                <div class="bracket-player ${match.winner === match.player1 ? 'winner' : ''} ${match.player1 === 'TBD' ? 'tbd' : ''}">
                                  <span>${match.player1}</span>
                                  ${match.winner === match.player1 ? '<span>&#10003;</span>' : ''}
                                </div>
                                <div class="bracket-player ${match.winner === match.player2 ? 'winner' : ''} ${match.player2 === 'TBD' ? 'tbd' : ''}">
                                  <span>${match.player2}</span>
                                  ${match.winner === match.player2 ? '<span>&#10003;</span>' : ''}
                                </div>
                              `
                          }
                        </article>
                      `
                    )
                    .join('')
                : round.name === 'Champion'
                  ? `
                    <article class="bracket-match champion-placeholder champion-winner" aria-label="Champion placeholder">
                      <div class="bracket-champion">
                        <div class="champion-badge">🏆 Champion</div>
                        <div class="champion-name tbd">TBD</div>
                        <p>Winner appears here after the final.</p>
                      </div>
                    </article>
                  `
                  : `
                    <div class="empty-bracket-slot">TBD</div>
                  `
            }
          </div>
        </section>
      `
    )
    .join('');
}

// ---------------------------------------------------------------------------
// DVB Results page
// ---------------------------------------------------------------------------

async function renderResults() {
  const matches = await getMatches();
  const live = matches.filter((match) => match.status === 'Live');
  const completed = matches.filter((match) => match.status === 'Completed');

  const card = (match) => {
    const score = formatMatchScore(match);

    return `
    <article class="result-card">
      <div class="result-head">
        <span>${match.round} - ${match.court}</span>
        ${badge(match.status)}
      </div>

      <div class="score-line ${match.winner === match.player1 ? 'winner' : ''}">
        <span>${match.player1}</span>
        <strong>${score.p1 || score.text}</strong>
      </div>

      <div class="score-line ${match.winner === match.player2 ? 'winner' : ''}">
        <span>${match.player2}</span>
        <strong>${score.p2 || (match.status === 'Live' ? 'Current' : match.winner === match.player2 ? 'Winner' : 'Final')}</strong>
      </div>

      <div class="result-foot">
        <span>${formatMatchDate(match.displayDate)} - ${escapeHtml(String(match.time ?? '').trim() || 'TBD')}</span>
        <button class="text-button" data-match="${match.id}">Match details -></button>
      </div>
    </article>
  `;
  };

  const render = (selector, list, label) => {
    const element = document.querySelector(selector);

    element.innerHTML = list.length
      ? list.map(card).join('')
      : `
          <div class="empty-state" style="grid-column: 1 / -1">
            <strong>No ${label}</strong>
            Check back when play gets underway.
          </div>
        `;
  };

  render('#live-results', live, 'live matches');
  render('#completed-results', completed, 'completed results');

  document.querySelectorAll('[data-match]').forEach((button) => {
    button.onclick = () => {
      const match = matches.find((entry) => entry.id === button.dataset.match);

      openModal(`
        <div>${badge(match.status)}</div>
        <h2 class="modal-title">
          ${formatMatchupHtml(match.player1, match.player2)}
        </h2>

        <div class="detail-grid">
        <div class="detail">
          <small>Score</small>
          <strong>${formatMatchScore(match).text}</strong>
        </div>
        <div class="detail">
          <small>Winner</small>
          <strong>${formatWinner(match.winner)}</strong>
        </div>
          <div class="detail">
            <small>Round</small>
            <strong>${match.round}</strong>
          </div>
          <div class="detail">
            <small>Court</small>
            <strong>${match.court}</strong>
          </div>
        </div>

        <p>${match.note}</p>
      `);
    };
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.onclick = () => {
      document.querySelectorAll('.tab').forEach((button) => {
        button.classList.toggle('active', button === tab);
        button.setAttribute('aria-selected', String(button === tab));
      });

      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.hidden = panel.id !== tab.dataset.tab;
      });
    };
  });
}

// ---------------------------------------------------------------------------
// DVB Rules page
// ---------------------------------------------------------------------------

async function renderRules() {
  const [rules, settings] = await Promise.all([getRules(), getTournamentSettings()]);

  document.querySelector('#rules-updated').textContent = settings.lastUpdated;

  document.querySelector('#rules-list').innerHTML = rules
    .map(
      (rule, index) => `
        <article class="accordion ${index === 0 ? 'open' : ''}">
          <h2>
            <button
              class="accordion-trigger"
              type="button"
              aria-expanded="${index === 0}"
              aria-controls="rule-${index}"
            >
              <span>${rule.title}</span>
              <span>+</span>
            </button>
          </h2>
          <div class="accordion-content" id="rule-${index}" ${index === 0 ? '' : 'hidden'}>
            <p class="multiline-copy">${formatMultilineHtml(rule.content)}</p>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.accordion-trigger').forEach((button) => {
    button.onclick = () => {
      const item = button.closest('.accordion');
      const content = item.querySelector('.accordion-content');
      const open = item.classList.toggle('open');

      content.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    };
  });
}

// ---------------------------------------------------------------------------
// DVB Announcements page
// ---------------------------------------------------------------------------

async function renderAnnouncements() {
  const list = toArray(await getAnnouncements())
    .map((announcement) => ({
      ...announcement,
      pinned: toBool(announcement?.pinned),
      urgent: toBool(announcement?.urgent),
      iso: String(announcement?.iso || '').trim(),
      photo: String(announcement?.photo || '').trim(),
    }))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.iso.localeCompare(a.iso));

  document.querySelector('#announcement-list').innerHTML = list.length
    ? list
        .map(
          (announcement) => `
            <article class="announcement-card ${announcement.pinned ? 'pinned' : ''} ${announcement.urgent ? 'urgent' : ''}">
              <div class="announcement-card-main">
                <div class="announcement-meta">
                  <span class="announcement-flags">
                    ${announcement.pinned ? '<span class="pin-label">Pinned</span>' : ''}
                    ${announcement.urgent ? '<span class="urgent-label">Urgent</span>' : ''}
                  </span>
                  <span>${announcement.date}</span>
                  <span>&bull;</span>
                  <span>${announcement.category}</span>
                </div>
                <h2>${announcement.title}</h2>
                <p class="multiline-copy">${formatMultilineHtml(announcement.content)}</p>
                ${
                  announcement.photo
                    ? `<button class="text-button announcement-open" type="button" data-announcement="${escapeHtml(
                        announcement.id || announcement.title
                      )}">View photo</button>`
                    : ''
                }
              </div>
              ${
                announcement.photo
                  ? `
                    <button class="announcement-photo" type="button" data-announcement="${escapeHtml(
                      announcement.id || announcement.title
                    )}">
                      <img src="${escapeHtml(announcement.photo)}" alt="${escapeHtml(announcement.title)}">
                    </button>
                  `
                  : ''
              }
            </article>
          `
        )
        .join('')
    : `
        <div class="empty-state">
          <strong>No announcements yet</strong>
          Official tournament updates will appear here.
        </div>
      `;

  document.querySelectorAll('[data-announcement]').forEach((button) => {
    button.addEventListener('click', () => {
      const announcement = list.find((item) => (item.id || item.title) === button.dataset.announcement);
      if (announcement) {
        openModal(announcementModalMarkup(announcement));
      }
    });
  });
}

// ---------------------------------------------------------------------------
// DVB App start
// ---------------------------------------------------------------------------

async function initializeSite() {
  // Draw the shared layout immediately so the page feels responsive.
  renderShell({});

  // Then the app chooses the correct page renderer.
  const renderer = renderers[page];

  await renderer?.();

  // Hydrate the shell after the page is already visible.
  getTournamentSettings()
    .then((settingsRaw) => {
      renderShell(toObject(settingsRaw));
    })
    .catch(() => {
      // Keep the fallback shell if the sheet request fails.
    });

  initScrollReveal();
}

const renderers = {
  home: renderHome,
  players: renderPlayers,
  schedule: renderSchedule,
  bracket: renderBracket,
  results: renderResults,
  rules: renderRules,
  announcements: renderAnnouncements,
};

initializeSite().catch((error) => {
  console.error(error);

  const main = document.querySelector('main');

  main.insertAdjacentHTML(
    'beforeend',
    `
      <div class="container section">
        <div class="empty-state">
          <strong>Unable to load this page</strong>
          Please refresh and try again.
        </div>
      </div>
    `
  );
});
