import {
  getTournamentSettings,
  getPlayers,
  getMatches,
  getBracket,
  getAnnouncements,
  getRules,
  getWinnerInformation,
} from '../services/data-service.js';

// This tells the app which HTML page is currently open.
// Each HTML file sets a value such as "home", "players", or "schedule".
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

// ---------------------------------------------------------------------------
// Shared layout helpers
// ---------------------------------------------------------------------------

function renderShell() {
  const header = document.querySelector('[data-site-header]');
  const footer = document.querySelector('[data-site-footer]');

  // The header and footer are not repeated manually in every HTML page.
  // Instead, this function injects the shared site layout into placeholder divs.
  header.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <div class="container nav-wrap">
        <a class="brand" href="index.html" aria-label="Tagalog Open home">
          <span class="brand-mark">TO</span>
          <span>Tagalog Open</span>
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
              <span class="brand-mark">TO</span>
              <span>Tagalog Open</span>
            </a>
            <p class="footer-copy">
              A premier Los Santos tennis tournament celebrating competition,
              community, and the city's finest sporting talent.
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
              <a href="index.html#venue">Venue</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <span>Presented by the Office of the Mayor, City of Los Santos</span>
          <span>&copy; 2026 Tagalog Open</span>
        </div>
      </div>
    </footer>
  `;

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');

  // Mobile menu open / close behavior.
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

// Creates a consistent status badge such as Live, Upcoming, or Completed.
const badge = (status) => `
  <span class="badge badge-${status.toLowerCase().replace(/\s+/g, '-')}">${status}</span>
`;

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

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------

async function renderHome() {
  const [settings, announcements, matches, winners] = await Promise.all([
    getTournamentSettings(),
    getAnnouncements(),
    getMatches(),
    getWinnerInformation(),
  ]);

  const liveMatch = matches.find((match) => match.status === 'Live');
  const featuredMatch = liveMatch || matches.find((match) => match.status === 'Upcoming');

  document.querySelector('[data-home]').innerHTML = `
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <div class="eyebrow">Presented by the Office of the Mayor</div>
          <h1 class="display">Tagalog<br>Open</h1>
          <p class="lead">
            ${settings.tagline} Los Santos steps onto center court for three nights
            of precision, pressure, and championship tennis.
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="schedule.html">
              View schedule <span>-></span>
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
              <strong>${settings.displayDate}</strong>
            </div>
            <div>
              <span class="hero-card-label">Venue</span>
              <strong>Vespucci Tennis Club</strong>
            </div>
          </div>
        </aside>
      </div>
    </section>

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
          <div class="stat">
            <strong>${settings.prize}</strong>
            <span>Prize purse</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow" style="color: var(--green-2)">City championship tennis</div>
            <h2 class="section-title">The court belongs<br>to Los Santos</h2>
          </div>
          <p class="lead" style="color: #5e6b64">
            Sixteen competitors. One single-elimination bracket. Every rally moves
            one player closer to the city championship.
          </p>
        </div>

        <div class="cards-3">
          <article class="card">
            <div class="card-kicker">Registration</div>
            <h3>${settings.registrationStatus}</h3>
            <p class="muted">
              Four places remain. Registration closes August 9 or when the field
              reaches capacity.
            </p>
          </article>

          <article class="card">
            <div class="card-kicker">Format</div>
            <h3>${settings.format}</h3>
            <p class="muted">
              Best-of-three sets from the opening round through the championship final.
            </p>
          </article>

          <article class="card" id="venue">
            <div class="card-kicker">Venue</div>
            <h3>${settings.location}</h3>
            <p class="muted">
              Center Court and Court 2 host play across all three tournament nights.
            </p>
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
            <div class="card-kicker">
              ${announcements[0].category} - ${announcements[0].date}
            </div>
            <h3>${announcements[0].title}</h3>
            <p>${announcements[0].content}</p>
            <a class="button button-primary" href="announcements.html">Read updates</a>
          </div>
        </article>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow" style="color: var(--green-2)">Center court</div>
            <h2 class="section-title">Featured match</h2>
          </div>
          ${badge(featuredMatch?.status || 'Upcoming')}
        </div>
        ${featureMatch(featuredMatch)}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-heading">
          <div>
            <div class="eyebrow">The road ahead</div>
            <h2 class="section-title">Tournament honors</h2>
          </div>
          <p class="muted">Revealed after championship night</p>
        </div>

        <div class="outcomes">
          <div class="card outcome-card ${winners.concluded ? '' : 'tbd'}">
            <div class="outcome-icon">1</div>
            <div class="eyebrow">Champion</div>
            <h3>${winners.champion}</h3>
          </div>
          <div class="card outcome-card ${winners.concluded ? '' : 'tbd'}">
            <div class="outcome-icon">2</div>
            <div class="eyebrow">Runner-up</div>
            <h3>${winners.runnerUp}</h3>
          </div>
          <div class="card outcome-card ${winners.concluded ? '' : 'tbd'}">
            <div class="outcome-icon">*</div>
            <div class="eyebrow">Tournament MVP</div>
            <h3>${winners.mvp}</h3>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
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
            <span class="arrow">-></span>
          </a>

          <a class="card quick-card" href="results.html">
            <div>
              <div class="card-kicker">Courtside</div>
              <h3>Live scores & results</h3>
            </div>
            <span class="arrow">-></span>
          </a>

          <a class="card quick-card" href="rules.html">
            <div>
              <div class="card-kicker">Official</div>
              <h3>Tournament rules</h3>
            </div>
            <span class="arrow">-></span>
          </a>
        </div>
      </div>
    </section>
  `;

  startCountdown(settings);
}

function featureMatch(match) {
  if (!match) {
    return '<article class="card"><p class="muted">No featured match available yet.</p></article>';
  }

  return `
    <article class="card">
      <div class="match-feature">
        <div>
          <div class="competitor">${match.player1}</div>
          <div class="muted">${match.round}</div>
        </div>
        <div class="versus">VS</div>
        <div>
          <div class="competitor">${match.player2}</div>
          <div class="muted">${match.court} - ${match.time}</div>
        </div>
      </div>
    </article>
  `;
}

function startCountdown(settings) {
  const element = document.querySelector('[data-countdown]');

  const tick = () => {
    const now = Date.now();
    const start = new Date(settings.startDate).getTime();
    const end = new Date(settings.endDate).getTime();

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

// ---------------------------------------------------------------------------
// Players page
// ---------------------------------------------------------------------------

async function renderPlayers() {
  const players = await getPlayers();
  const grid = document.querySelector('#players-grid');
  const search = document.querySelector('#player-search');

  const draw = () => {
    const term = search.value.toLowerCase();
    const list = players.filter((player) =>
      `${player.name} ${player.affiliation}`.toLowerCase().includes(term)
    );

    document.querySelector('#player-count').textContent = `${list.length} player${list.length === 1 ? '' : 's'}`;

    grid.innerHTML = list.length
      ? list
          .map(
            (player) => `
              <article class="card player-card">
                <div class="player-top">
                  <div class="avatar">${player.initials}</div>
                  <div class="seed">${player.seed ? `Seed ${player.seed}` : 'Unseeded'}</div>
                </div>
                <h3>${player.name}</h3>
                <div class="muted">${player.affiliation}</div>
                <div class="card-footer">
                  ${badge(player.registration)}
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
        const player = players.find((entry) => entry.id === button.dataset.player);

        openModal(`
          <div class="avatar">${player.initials}</div>
          <h2 class="modal-title">${player.name}</h2>
          <div class="muted">${player.affiliation}</div>

          <div class="detail-grid">
            <div class="detail">
              <small>Seed</small>
              <strong>${player.seed || 'Unseeded'}</strong>
            </div>
            <div class="detail">
              <small>Status</small>
              <strong>${player.status}</strong>
            </div>
            <div class="detail">
              <small>Hometown</small>
              <strong>${player.hometown}</strong>
            </div>
            <div class="detail">
              <small>Plays</small>
              <strong>${player.handedness}</strong>
            </div>
          </div>

          <p>${player.bio}</p>
        `);
      };
    });
  };

  search.addEventListener('input', draw);
  draw();
}

// ---------------------------------------------------------------------------
// Schedule page
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
            <td>${match.displayDate}<br><span class="muted">${match.time}</span></td>
            <td>${match.court}</td>
            <td>${match.round}</td>
            <td class="name-cell">${match.player1}<br><span class="muted">vs ${match.player2}</span></td>
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
              <strong>${match.displayDate} - ${match.time}</strong>
              ${badge(match.status)}
            </div>
            <div class="mobile-match-players">
              ${match.player1}<br><span class="muted">vs</span> ${match.player2}
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
// Bracket page
// ---------------------------------------------------------------------------

async function renderBracket() {
  const rounds = await getBracket();

  document.querySelector('#bracket').innerHTML = rounds
    .map(
      (round, index) => `
        <section class="bracket-round ${index === rounds.length - 1 ? 'champion-round' : ''}">
          <h3>${round.name}</h3>
          <div class="round-matches">
            ${round.matches
              .map(
                (match, matchIndex) => `
                  <article class="bracket-match" aria-label="${round.name} match ${matchIndex + 1}">
                    ${match
                      .slice(0, 2)
                      .filter(Boolean)
                      .map(
                        (name) => `
                          <div class="bracket-player ${match[2] === name ? 'winner' : ''} ${name === 'TBD' ? 'tbd' : ''}">
                            <span>${name}</span>
                            ${match[2] === name ? '<span>✓</span>' : ''}
                          </div>
                        `
                      )
                      .join('')}
                  </article>
                `
              )
              .join('')}
          </div>
        </section>
      `
    )
    .join('');
}

// ---------------------------------------------------------------------------
// Results page
// ---------------------------------------------------------------------------

async function renderResults() {
  const matches = await getMatches();
  const live = matches.filter((match) => match.status === 'Live');
  const completed = matches.filter((match) => match.status === 'Completed');

  const card = (match) => `
    <article class="result-card">
      <div class="result-head">
        <span>${match.round} - ${match.court}</span>
        ${badge(match.status)}
      </div>

      <div class="score-line ${match.winner === match.player1 ? 'winner' : ''}">
        <span>${match.player1}</span>
        <strong>${match.score.split(', ')[0] || '-'}</strong>
      </div>

      <div class="score-line ${match.winner === match.player2 ? 'winner' : ''}">
        <span>${match.player2}</span>
        <strong>${match.status === 'Live' ? 'Current' : match.winner === match.player2 ? 'Winner' : 'Final'}</strong>
      </div>

      <div class="result-foot">
        <span>${match.displayDate} - ${match.time}</span>
        <button class="text-button" data-match="${match.id}">Match details -></button>
      </div>
    </article>
  `;

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
          ${match.player1}<br><span class="muted">vs</span> ${match.player2}
        </h2>

        <div class="detail-grid">
          <div class="detail">
            <small>Score</small>
            <strong>${match.score}</strong>
          </div>
          <div class="detail">
            <small>Winner</small>
            <strong>${match.winner || 'In progress'}</strong>
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
// Rules page
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
            <p>${rule.content}</p>
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
// Announcements page
// ---------------------------------------------------------------------------

async function renderAnnouncements() {
  const list = (await getAnnouncements()).sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || b.iso.localeCompare(a.iso)
  );

  document.querySelector('#announcement-list').innerHTML = list.length
    ? list
        .map(
          (announcement) => `
            <article class="announcement-card ${announcement.pinned ? 'pinned' : ''}">
              <div class="announcement-meta">
                ${announcement.pinned ? '<span class="pin-label">* Pinned</span>' : ''}
                <span>${announcement.date}</span>
                <span>&bull;</span>
                <span>${announcement.category}</span>
              </div>
              <h2>${announcement.title}</h2>
              <p>${announcement.content}</p>
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
}

// ---------------------------------------------------------------------------
// App start
// ---------------------------------------------------------------------------

// First the shared layout is drawn.
renderShell();

// Then the app chooses the correct page renderer.
const renderers = {
  home: renderHome,
  players: renderPlayers,
  schedule: renderSchedule,
  bracket: renderBracket,
  results: renderResults,
  rules: renderRules,
  announcements: renderAnnouncements,
};

renderers[page]?.().catch((error) => {
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
