/**
 * AlertX Pre-seeded Emergency Mock Database
 */

export const INITIAL_REPORTS = [
  {
    id: 'ALT-9082',
    type: 'SOS Alert',
    category: 'Armed Robbery',
    title: 'ACTIVE SOS: Armed Robbery at Metro Central Bank',
    description: 'Panic SOS button triggered by citizen inside bank lobby. Two masked individuals spotted with handguns.',
    location: '407 Tech Square, Downtown',
    coords: { lat: 37.7749, lng: -122.4194 },
    timestamp: '2 mins ago',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    reporter: 'Elena Rostova (+1 555-0192)',
    userRole: 'Citizen',
    priority: 'Critical',
    priorityScore: 95,
    confidence: '98%',
    aiReasoning: 'Immediate threat to life & weapons confirmed in active SOS alert.',
    status: 'Dispatched',
    assignedUnit: 'Squad 104 - Tactical Command',
    hasWeapons: true,
    hasCasualties: false,
    isHappeningNow: true,
    evidenceUrls: [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80'
    ],
    suspectSketch: {
      faceShape: 'Oval',
      hairStyle: 'Cap / Beanie',
      skinTone: '#c58c85',
      eyes: 'Narrow / Stern',
      eyebrows: 'Thick Bushy',
      nose: 'Sharp Straight',
      mouth: 'Mask Covered',
      facialHair: 'Clean Shaved',
      accessories: 'Tactical Mask',
      notes: 'Height approx 6ft 1in, black hoodie, tattoo on right wrist'
    }
  },
  {
    id: 'ALT-8431',
    type: 'Crime Report',
    category: 'Assault & Violence',
    title: 'Physical Altercation near Central Station Exit 3',
    description: 'Brawl broke out between 3 individuals near ticket counters. Security staff requesting immediate backup.',
    location: 'Central Transit Hub Platform B',
    coords: { lat: 37.7833, lng: -122.4167 },
    timestamp: '14 mins ago',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    reporter: 'Officer Vance (Transit Security)',
    userRole: 'Security Officer',
    priority: 'High',
    priorityScore: 78,
    confidence: '92%',
    aiReasoning: 'Physical violence in high-density public area.',
    status: 'In Progress',
    assignedUnit: 'Patrol Unit 12',
    hasWeapons: false,
    hasCasualties: true,
    isHappeningNow: true,
    evidenceUrls: [
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80'
    ],
    suspectSketch: null
  },
  {
    id: 'ALT-7204',
    type: 'Crime Report',
    category: 'Cyber Crime / Financial Fraud',
    title: 'Sophisticated ATM Skimmer & Credentials Theft',
    description: 'Digital skimmer device detected on ATM machine #4. Citizen card credentials cloned.',
    location: '1288 University Blvd, Campus West',
    coords: { lat: 37.7690, lng: -122.4480 },
    timestamp: '45 mins ago',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    reporter: 'Marcus Vance (+1 555-8831)',
    userRole: 'Citizen',
    priority: 'Medium',
    priorityScore: 48,
    confidence: '95%',
    aiReasoning: 'Financial fraud crime without physical danger to life.',
    status: 'Pending',
    assignedUnit: 'Unassigned',
    hasWeapons: false,
    hasCasualties: false,
    isHappeningNow: false,
    evidenceUrls: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80'
    ],
    suspectSketch: {
      faceShape: 'Square',
      hairStyle: 'Short Crop',
      skinTone: '#e0ac69',
      eyes: 'Round / Wide',
      eyebrows: 'Thin Arc',
      nose: 'Wide Flat',
      mouth: 'Thin Lips',
      facialHair: 'Full Beard',
      accessories: 'Dark Sunglasses',
      notes: 'Captured on CCTV installing skimmer module at 02:15 AM'
    }
  },
  {
    id: 'ALT-6110',
    type: 'Crime Report',
    category: 'Fire Emergency',
    title: 'Substation Transformer Fire & Smoke Hazard',
    description: 'Heavy black smoke spewing from power grid station. Sparks visible near electrical lines.',
    location: 'Industrial Park Zone 4',
    coords: { lat: 37.7550, lng: -122.4250 },
    timestamp: '1 hour ago',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    reporter: 'Local Resident',
    userRole: 'Citizen',
    priority: 'Critical',
    priorityScore: 88,
    confidence: '96%',
    aiReasoning: 'Fire hazard with structural explosion risk.',
    status: 'Resolved',
    assignedUnit: 'Fire Engine 09 & Hazmat',
    hasWeapons: false,
    hasCasualties: false,
    isHappeningNow: false,
    evidenceUrls: [],
    suspectSketch: null
  },
  {
    id: 'ALT-5012',
    type: 'Crime Report',
    category: 'Vandalism / Property Damage',
    title: 'Graffiti Vandalism on Campus Library Wall',
    description: 'Overnight spray painting on east facade of Main Library.',
    location: 'University Campus Plaza',
    coords: { lat: 37.7780, lng: -122.4310 },
    timestamp: '3 hours ago',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    reporter: 'Campus Guard',
    userRole: 'Security Guard',
    priority: 'Low',
    priorityScore: 22,
    confidence: '91%',
    aiReasoning: 'Property damage without active threat.',
    status: 'Resolved',
    assignedUnit: 'Campus Patrol',
    hasWeapons: false,
    hasCasualties: false,
    isHappeningNow: false,
    evidenceUrls: [],
    suspectSketch: null
  }
];

export const RESPONSE_UNITS = [
  { id: 'UNIT-104', name: 'Squad 104 - Tactical Command', status: 'On Route', location: 'Downtown Central', vehicle: 'Interceptor SUV' },
  { id: 'UNIT-012', name: 'Patrol Unit 12', status: 'Available', location: 'Transit District', vehicle: 'Patrol Cruiser' },
  { id: 'UNIT-009', name: 'Fire Engine 09 & Hazmat', status: 'On Station', location: 'Station 4', vehicle: 'Fire Truck' },
  { id: 'UNIT-CYBER', name: 'Cyber Crime Investigation Unit', status: 'Assigned', location: 'HQ Cyber Cell', vehicle: 'Mobile Command' }
];

export const EMERGENCY_HOTLINES = [
  { name: 'Police Emergency Dispatch', number: '911', icon: 'ShieldAlert', color: 'red' },
  { name: 'National Crime Helpline', number: '1-800-222-TIPS', icon: 'PhoneCall', color: 'blue' },
  { name: 'Cyber Crime Reporting Desk', number: '1-800-CYBER-99', icon: 'Laptop', color: 'purple' },
  { name: 'Women & Campus Safety Line', number: '1-800-799-SAFE', icon: 'HeartHandshake', color: 'pink' },
  { name: 'Fire & Medical Response', number: '911-FIRE', icon: 'Flame', color: 'orange' }
];

export const SAFE_ZONES = [
  { name: 'Central District Police Precinct 5', address: '500 Security Way', distance: '0.4 miles away', status: '24/7 Open', coords: { lat: 37.775, lng: -122.418 } },
  { name: 'Campus Safety Headquarters', address: '100 University Ave', distance: '0.8 miles away', status: '24/7 Open', coords: { lat: 37.771, lng: -122.435 } },
  { name: 'Metro Community Hospital ER', address: '88 Healthcare Blvd', distance: '1.2 miles away', status: 'Emergency Ward', coords: { lat: 37.765, lng: -122.412 } }
];
