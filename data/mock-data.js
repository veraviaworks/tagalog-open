export const tournamentSettings = {
  name: 'Tagalog Open',
  presentedBy: 'Office of the Mayor, City of Los Santos',
  tagline: 'One city. One court. One champion.',
  startDate: '2026-08-22T18:00:00-07:00',
  endDate: '2026-08-24T23:00:00-07:00',
  displayDate: 'August 22–24, 2026',
  location: 'Vespucci Tennis Club, Los Santos',
  registrationStatus: 'Registration Open',
  capacity: 16,
  format: '16-player single elimination',
  registeredCount: 12,
  totalMatches: 15,
  prize: '$150,000',
  lastUpdated: 'August 2, 2026',
};

export const players = [
  { id: 'p1', name: 'Mateo Santos', initials: 'MS', affiliation: 'Los Santos Police Department', seed: 1, registration: 'Confirmed', status: 'Active', hometown: 'La Mesa', handedness: 'Right-handed', bio: 'A composed baseline player known for patient rallies and clinical returns.' },
  { id: 'p2', name: 'Elena Cruz', initials: 'EC', affiliation: 'Pillbox Medical Center', seed: 2, registration: 'Confirmed', status: 'Active', hometown: 'Del Perro', handedness: 'Left-handed', bio: 'An aggressive counterpuncher with one of the quickest serves in the field.' },
  { id: 'p3', name: 'Rafael Navarro', initials: 'RN', affiliation: 'Los Santos Customs', seed: 3, registration: 'Confirmed', status: 'Active', hometown: 'Hawick', handedness: 'Right-handed', bio: 'A fearless net player who thrives in short, high-pressure exchanges.' },
  { id: 'p4', name: 'Mika Reyes', initials: 'MR', affiliation: 'Weazel News', seed: 4, registration: 'Confirmed', status: 'Active', hometown: 'Downtown', handedness: 'Right-handed', bio: 'A tactical all-court competitor with a sharp cross-court forehand.' },
  { id: 'p5', name: 'Lucas Villanueva', initials: 'LV', affiliation: 'Department of Justice', seed: 5, registration: 'Confirmed', status: 'Active', hometown: 'Rockford Hills', handedness: 'Left-handed', bio: 'A steady competitor respected for discipline and excellent court coverage.' },
  { id: 'p6', name: 'Sofia Mendoza', initials: 'SM', affiliation: 'Los Santos Fire Department', seed: 6, registration: 'Confirmed', status: 'Active', hometown: 'Vespucci', handedness: 'Right-handed', bio: 'A powerful server who looks to control points from the opening shot.' },
  { id: 'p7', name: 'Gabriel Flores', initials: 'GF', affiliation: 'Dynasty 8', seed: 7, registration: 'Confirmed', status: 'Active', hometown: 'Mirror Park', handedness: 'Right-handed', bio: 'A creative shot-maker who uses pace changes to disrupt opponents.' },
  { id: 'p8', name: 'Isabella Torres', initials: 'IT', affiliation: 'Bahama Mamas', seed: 8, registration: 'Confirmed', status: 'Active', hometown: 'West Vinewood', handedness: 'Left-handed', bio: 'A resilient defender with an exceptional backhand down the line.' },
  { id: 'p9', name: 'Noah Garcia', initials: 'NG', affiliation: 'Los Santos Transit', seed: null, registration: 'Confirmed', status: 'Active', hometown: 'Strawberry', handedness: 'Right-handed', bio: 'A newcomer bringing speed, energy, and an unpredictable return game.' },
  { id: 'p10', name: 'Camila Aquino', initials: 'CA', affiliation: 'Bean Machine', seed: null, registration: 'Confirmed', status: 'Active', hometown: 'Little Seoul', handedness: 'Right-handed', bio: 'A confident doubles specialist making her singles tournament debut.' },
  { id: 'p11', name: 'Adrian Ramos', initials: 'AR', affiliation: 'Premium Deluxe Motorsport', seed: null, registration: 'Pending', status: 'Reserve', hometown: 'Burton', handedness: 'Left-handed', bio: 'A hard hitter awaiting final tournament registration clearance.' },
  { id: 'p12', name: 'Luna Castillo', initials: 'LC', affiliation: 'Vanilla Unicorn', seed: null, registration: 'Confirmed', status: 'Active', hometown: 'Davis', handedness: 'Right-handed', bio: 'A calm and resourceful competitor who excels in deciding points.' },
];

export const matches = [
  { id:'m1', date:'2026-08-22', displayDate:'Aug 22', time:'6:00 PM', court:'Center Court', round:'Round of 16', player1:'Mateo Santos', player2:'Noah Garcia', status:'Completed', score:'6–2, 6–3', winner:'Mateo Santos', note:'Santos controlled the baseline and broke serve four times.' },
  { id:'m2', date:'2026-08-22', displayDate:'Aug 22', time:'6:00 PM', court:'Court 2', round:'Round of 16', player1:'Isabella Torres', player2:'Camila Aquino', status:'Completed', score:'4–6, 7–5, 6–2', winner:'Isabella Torres', note:'Torres recovered from a slow start in the longest match of opening night.' },
  { id:'m3', date:'2026-08-22', displayDate:'Aug 22', time:'7:15 PM', court:'Center Court', round:'Round of 16', player1:'Mika Reyes', player2:'Luna Castillo', status:'Completed', score:'6–4, 6–4', winner:'Mika Reyes', note:'Reyes stayed composed through two tightly contested sets.' },
  { id:'m4', date:'2026-08-22', displayDate:'Aug 22', time:'7:15 PM', court:'Court 2', round:'Round of 16', player1:'Lucas Villanueva', player2:'Sofia Mendoza', status:'Live', score:'4–3, 30–15', winner:null, note:'Villanueva leads on serve in the opening set.' },
  { id:'m5', date:'2026-08-22', displayDate:'Aug 22', time:'8:30 PM', court:'Center Court', round:'Round of 16', player1:'Elena Cruz', player2:'Adrian Ramos', status:'Upcoming', score:'—', winner:null, note:'First career meeting between Cruz and Ramos.' },
  { id:'m6', date:'2026-08-22', displayDate:'Aug 22', time:'8:30 PM', court:'Court 2', round:'Round of 16', player1:'Gabriel Flores', player2:'TBD', status:'Postponed', score:'—', winner:null, note:'Opponent confirmation pending.' },
  { id:'m7', date:'2026-08-22', displayDate:'Aug 22', time:'9:45 PM', court:'Center Court', round:'Round of 16', player1:'Rafael Navarro', player2:'TBD', status:'Upcoming', score:'—', winner:null, note:'Final qualifier to be announced.' },
  { id:'m8', date:'2026-08-22', displayDate:'Aug 22', time:'9:45 PM', court:'Court 2', round:'Round of 16', player1:'TBD', player2:'TBD', status:'Cancelled', score:'—', winner:null, note:'Bracket position released following a withdrawal.' },
  { id:'m9', date:'2026-08-23', displayDate:'Aug 23', time:'6:00 PM', court:'Center Court', round:'Quarterfinal', player1:'Mateo Santos', player2:'Isabella Torres', status:'Upcoming', score:'—', winner:null, note:'Quarterfinal one.' },
  { id:'m10', date:'2026-08-23', displayDate:'Aug 23', time:'7:15 PM', court:'Center Court', round:'Quarterfinal', player1:'Mika Reyes', player2:'TBD', status:'Upcoming', score:'—', winner:null, note:'Quarterfinal two.' },
  { id:'m11', date:'2026-08-23', displayDate:'Aug 23', time:'8:30 PM', court:'Center Court', round:'Quarterfinal', player1:'TBD', player2:'TBD', status:'Upcoming', score:'—', winner:null, note:'Quarterfinal three.' },
  { id:'m12', date:'2026-08-23', displayDate:'Aug 23', time:'9:45 PM', court:'Center Court', round:'Quarterfinal', player1:'TBD', player2:'TBD', status:'Upcoming', score:'—', winner:null, note:'Quarterfinal four.' },
  { id:'m13', date:'2026-08-24', displayDate:'Aug 24', time:'6:30 PM', court:'Center Court', round:'Semifinal', player1:'TBD', player2:'TBD', status:'Upcoming', score:'—', winner:null, note:'Semifinal one.' },
  { id:'m14', date:'2026-08-24', displayDate:'Aug 24', time:'8:00 PM', court:'Center Court', round:'Semifinal', player1:'TBD', player2:'TBD', status:'Upcoming', score:'—', winner:null, note:'Semifinal two.' },
  { id:'m15', date:'2026-08-24', displayDate:'Aug 24', time:'10:00 PM', court:'Center Court', round:'Final', player1:'TBD', player2:'TBD', status:'Upcoming', score:'—', winner:null, note:'The championship match.' },
];

export const bracket = [
  { name:'Round of 16', matches:[['Mateo Santos','Noah Garcia','Mateo Santos'],['Isabella Torres','Camila Aquino','Isabella Torres'],['Mika Reyes','Luna Castillo','Mika Reyes'],['Lucas Villanueva','Sofia Mendoza',null],['Elena Cruz','Adrian Ramos',null],['Gabriel Flores','TBD',null],['Rafael Navarro','TBD',null],['TBD','TBD',null]] },
  { name:'Quarterfinals', matches:[['Mateo Santos','Isabella Torres',null],['Mika Reyes','TBD',null],['TBD','TBD',null],['TBD','TBD',null]] },
  { name:'Semifinals', matches:[['TBD','TBD',null],['TBD','TBD',null]] },
  { name:'Championship', matches:[['TBD','TBD',null]] },
  { name:'Champion', matches:[['TBD','',null]] },
];

export const announcements = [
  { id:'a1', title:'Registration enters final week', date:'August 2, 2026', iso:'2026-08-02', category:'Registration', pinned:true, urgent:false, content:'Twelve competitors have secured their place in the inaugural Tagalog Open. Four positions remain available through August 9. Players must submit their legal name, affiliation, and preferred match availability to the tournament office.' },
  { id:'a2', title:'Opening-night court assignments published', date:'July 31, 2026', iso:'2026-07-31', category:'Schedule', pinned:false, urgent:false, content:'Center Court and Court 2 assignments for the Round of 16 are now available. Competitors should check in at least 20 minutes before their listed start time.' },
  { id:'a3', title:'Official tournament rules confirmed', date:'July 28, 2026', iso:'2026-07-28', category:'Tournament Notice', pinned:false, urgent:false, content:'The Office of the Mayor has ratified the competition rules for match play, score reporting, technical interruptions, and disputes. All registered players are responsible for reviewing the complete rules before check-in.' },
  { id:'a4', title:'Vespucci Tennis Club named host venue', date:'July 20, 2026', iso:'2026-07-20', category:'General', pinned:false, urgent:false, content:'The City of Los Santos is proud to welcome competitors and spectators to Vespucci Tennis Club for three nights of championship tennis.' },
];

export const rules = [
  { title:'Tournament format', content:'The Tagalog Open is a 16-player, single-elimination tournament. A player advances by winning their scheduled match. The bracket is seeded by the tournament committee, with remaining positions assigned by public draw.' },
  { title:'Match format', content:'All matches are best-of-three sets. The first player to win two sets wins the match. Organizers may shorten a delayed match only when both players are notified before play begins.' },
  { title:'Scoring rules', content:'Standard tennis scoring applies: love, 15, 30, 40, game. Sets are first to six games with a two-game advantage. At 6–6, a first-to-seven tiebreak with a two-point advantage decides the set.' },
  { title:'Player responsibilities', content:'Players must know their schedule, arrive prepared, use approved equipment, follow staff direction, and remain reachable through their registration contact throughout the event.' },
  { title:'Late arrivals', content:'Check-in closes 10 minutes after the scheduled start time. A late player may receive a match warning. After 15 minutes, the tournament director may declare a walkover.' },
  { title:'Withdrawals and forfeits', content:'Withdrawals should be reported as early as possible. A player who leaves an active match without an approved medical or technical reason forfeits the match and any unfinished sets.' },
  { title:'Sportsmanship', content:'Respect toward opponents, officials, spectators, and venue staff is mandatory. Threats, harassment, deliberate disruption, or abuse of game mechanics may result in point penalties or disqualification.' },
  { title:'Technical issues or disconnections', content:'If a player disconnects, play pauses for up to five minutes. The score and server are preserved. A second prolonged interruption may be ruled a retirement at the tournament director’s discretion.' },
  { title:'Score reporting', content:'The winning player must confirm the final score with a court official immediately after the match. Results are official once posted on the tournament website.' },
  { title:'Disputes and organizer decisions', content:'Disputes must be raised before the next point whenever possible. The tournament director’s interpretation of the rules and final ruling are binding for the event.' },
];

export const winners = { concluded:false, champion:'TBD', runnerUp:'TBD', mvp:'TBD' };
