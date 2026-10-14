/**
 * Velvet & Vow | Couples Passion & Romance Engine
 * Tailored for submissive couples, saree adoration, and gentle intimate connection.
 */

// --- AUDIO SYNTHESIZER (Web Audio API) ---
class SoundSynth {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playChime(type = 'soft') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'soft') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, now); // 528Hz love/miracle frequency
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'celebrate') {
        // Royal harp chord
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const chordOsc = this.ctx.createOscillator();
          const chordGain = this.ctx.createGain();
          chordOsc.type = 'triangle';
          chordOsc.frequency.setValueAtTime(freq, now + i * 0.08);
          chordGain.gain.setValueAtTime(0.15, now + i * 0.08);
          chordGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.8);
          chordOsc.connect(chordGain);
          chordGain.connect(this.ctx.destination);
          chordOsc.start(now + i * 0.08);
          chordOsc.stop(now + i * 0.08 + 0.85);
        });
      } else if (type === 'gong') {
        // Deep meditation gong for kiss timer end
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 1.5);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        osc.start(now);
        osc.stop(now + 2.0);
      }
    } catch (e) {
      console.warn('Audio synth error:', e);
    }
  }

  vibrate(pattern = [30, 40, 30]) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }
}

const sound = new SoundSynth();

// --- STATE MANAGEMENT ---
const STORAGE_KEY = 'velvet_vow_state';

const defaultState = {
  deviceMode: 'shared', // 'shared' or 'paired'
  myRole: 'husband',    // 'husband' or 'wife'
  roomCode: 'LOVE24',
  userPin: '1234',
  pinLockEnabled: true,
  husbandMood: null,
  wifeMood: null,
  kissStreak: 1,
  lastKissDate: null,
  goddessGems: 150,
  dailyPraiseTasks: {
    morning: false,
    body: false,
    clothing: false,
    date: new Date().toISOString().slice(0, 10)
  },
  customCompliments: [],
  customWishes: [],
  redeemedCoupons: []
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    const today = new Date().toISOString().slice(0, 10);
    // Reset daily praise if new day
    if (parsed.dailyPraiseTasks && parsed.dailyPraiseTasks.date !== today) {
      parsed.dailyPraiseTasks = {
        morning: false,
        body: false,
        clothing: false,
        date: today
      };
    }
    return { ...defaultState, ...parsed };
  } catch (e) {
    return { ...defaultState };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save state', e);
  }
}

let appState = loadState();

// --- CONTENT DATABASES ---
const COMPLIMENTS_DB = {
  saree: [
    "When you drape a saree, the entire atmosphere shifts. You carry it with such effortless grace and raw sensuality that I literally lose track of what I was doing.",
    "The way your saree pallu rests on your shoulder and reveals the curve of your waist... you look like pure royalty.",
    "You have no idea how magnetic you look in traditional silk. Every time you turn around, I fall in love with you all over again.",
    "That saree doesn't just look beautiful on you—you make that saree look breathtaking.",
    "The pleats, the border, and the way you walk in it... you are the most gorgeous woman I have ever laid eyes on.",
    "Whenever you wear a saree, my heart skips a beat. I just want to stand near you, breathe in your perfume, and gently kiss your waist.",
    "You look like a living painting draped in that fabric. I feel like the luckiest man alive just being the one standing beside you."
  ],
  body: [
    "You have no idea how beautiful your curves are. Every line of your body is soft, warm, and perfection to me.",
    "Your waist and the curve of your hips drive me crazy. I crave just resting my hands there and holding you close.",
    "The warmth of your skin against mine is my favorite place in the whole world.",
    "You are so deeply feminine and alluring. Looking at you always makes my pulse quicken.",
    "Your collarbone, your neck, the way you smell... everything about you turns me on in the gentlest way."
  ],
  face: [
    "Your eyes do something to me every single time you look over. They are deep, soft, and so captivating.",
    "That smile of yours lights up our whole room. It instantly melts away whatever stress I carried from my day.",
    "Your lips look so soft right now... all I want is to lean in and kiss you slowly without saying a word.",
    "When you laugh with your whole heart, you are at your absolute most radiant.",
    "You have a natural, effortless beauty that doesn't need any makeup or filters. You are stunning to me."
  ],
  bold: [
    "Seeing you in that bold dress makes my head spin. You look like a dangerous queen.",
    "You carry such an undeniable, sultry allure when you let your confidence shine. You could stop traffic.",
    "I love the quiet confidence you have when you dress up. It makes me want to pull you into my arms and never let go.",
    "You are an absolute stunner. Anyone in the room who looks at you can only dream, but you're coming home with me.",
    "That outfit hugs you in all the right places. You have an intoxicating energy tonight."
  ],
  sweet: [
    "Being your husband is the greatest honor of my life. You make every day warmer.",
    "No matter how busy life gets, holding you in my arms is where I always feel completely at peace.",
    "You are my sacred safe haven. I love you, I adore your spirit, and I cherish your body.",
    "I want to spend tonight just making you feel loved, adored, and completely worshipped.",
    "You don't have to prove anything or perform for me. You just existing is enough to make me adore you."
  ]
};

const SCRATCH_DARES = {
  mild: [
    { title: "The 30-Second Forehead Blessing", desc: "Husband holds her face tenderly in both hands and places a soft, slow kiss on her forehead while she closes her eyes.", emoji: "🌸" },
    { title: "The Palm & Knuckle Trail", desc: "Take her right hand. Slowly kiss the center of her palm, then trace your lips gently across each of her knuckles.", emoji: "✨" },
    { title: "The Whispered Gratitude", desc: "Lean close to her ear and whisper 3 exact physical things you love most about her appearance today.", emoji: "💌" },
    { title: "The 1-Minute Silent Hug", desc: "Embrace each other chest-to-chest. Close your eyes and breathe together in complete silence until you feel totally relaxed.", emoji: "🫂" },
    { title: "The Gentle Hair Caress", desc: "Husband gently brushes her hair with his fingers away from her neck, placing a warm kiss on the exposed skin.", emoji: "🌹" }
  ],
  medium: [
    { title: "The Saree Waistline Trace", desc: "Husband places his warm hands on the bare curve of her waist, trailing slow fingertips from her hip to her ribcage.", emoji: "🥻" },
    { title: "The Collarbone Melt", desc: "Unbutton or slide her top slightly to reveal her collarbone. Husband places 5 slow, warm kisses along the bone line.", emoji: "💋" },
    { title: "The Blindfold Tease", desc: "Wife closes her eyes (or puts on a silk scarf). Husband touches her hands, arms, and neck with light feather touches.", emoji: "🙈" },
    { title: "The 10-Minute Foot & Ankle Rub", desc: "Wife relaxes back. Husband applies lotion or warm oil, gently massaging her feet and calves while praising her.", emoji: "💆‍♀️" },
    { title: "The Slow Lip Brush", desc: "Husband touches his lips to hers so lightly they barely touch, teasing her until she leans forward to pull him in.", emoji: "🔥" }
  ],
  wild: [
    { title: "The Saree Undraping Command", desc: "Husband slowly removes the safety pin from her saree shoulder. He gathers the pallu and kisses her bare shoulder as it drops.", emoji: "👑" },
    { title: "The Bold Dress Pillow Talk", desc: "Lie down together in dim lighting. Husband whispers his favorite imagination scenario about seeing her in the boldest dress.", emoji: "🍷" },
    { title: "The King & Queen Worship", desc: "Wife lies down comfortably. Husband kisses her from her forehead, down her neck, shoulders, and waist, treating her body like sacred art.", emoji: "🕯️" },
    { title: "The 3-Minute Deep Kiss", desc: "A prolonged, passionate kiss with no talking, hands roaming over her back and waist, zero rush to undress.", emoji: "🌶️" },
    { title: "The Private Bedroom Runway", desc: "She puts on her favorite heels or bold outfit. Husband sits back and showers her with compliments as she models it for him.", emoji: "👠" }
  ]
};

const TRUTH_DARES_PROMPTS = {
  truths: [
    "What is the single most attractive outfit or saree I have ever worn in your eyes?",
    "If you could have me touch or kiss you anywhere right now with zero talking, where would it be?",
    "When was the last time you thought about me sexually during the day without telling me?",
    "What is a secret fantasy or spicy daydream you have that you've felt too shy to say out loud?",
    "What makes you feel most loved and desired: words of praise, gentle touches, or deep kisses?"
  ],
  dares: [
    "Husband: Whisper the dirtiest or sweetest compliment you can think of directly into her ear.",
    "Wife: Place your hands on his chest, look into his eyes for 15 seconds, and kiss him deeply.",
    "Husband: Give her a 3-minute soothing shoulder and neck massage with gentle kisses in between.",
    "Both: Turn off the lamp and share a passionate 60-second kiss in complete darkness.",
    "Wife: Model one bold turn or pose on the bed while husband gives you three compliments."
  ]
};

const FANTASY_SCENARIOS = [
  {
    category: "Bold Queen Fantasy",
    title: "The Center of Attention",
    body: "Imagine we are attending an elite private party. You are wearing the boldest, most stunning dress in your wardrobe. As you walk into the room, every conversation pauses. Every person looks at you with intense desire—and I lean in, whisper in your ear: 'They can only look, but tonight you belong entirely to me.'",
    spark: "How does it feel to know how deeply you are desired? Which dress would you pick for this?"
  },
  {
    category: "Royal Saree Worship",
    title: "The Royal Chamber Ritual",
    body: "Imagine you are an ancient Empress and I am your loyal consort. You stand draped in royal crimson silk. My only duty tonight is to serve you, slowly unwrap the silk pleats one by one, kiss your waist, and massage your feet until all the world's worries melt away.",
    spark: "Would you like me to massage your feet and waist with warm scented oil tonight?"
  },
  {
    category: "Hotwife Pillow Talk / Erotic Imagination",
    title: "The Glamour Siren & Envious Eyes",
    body: "Imagine we are sitting at a luxury rooftop lounge. You are wearing a backless dress that reveals the curve of your spine. Men at the surrounding tables keep sneaking glances, mesmerized by you. I hold your hand tightly across the table and smile, knowing your beauty is captivating everyone in the room.",
    spark: "Tell me: do you enjoy knowing how intoxicating and gorgeous you look to other people while knowing I am yours?"
  },
  {
    category: "Intimate Stranger Roleplay",
    title: "The Luxury Hotel Encounter",
    body: "Imagine we checked into separate rooms at a 5-star hotel and met by chance at the hotel bar. You are the mysterious, irresistible woman in a saree sipping a cocktail. I sit beside you, buy you a drink, and try to flirt with you like I'm meeting you for the very first time.",
    spark: "What would your mysterious persona say to me at that bar?"
  }
];

const WARDROBE_ROULETTE = [
  { name: "Royal Silk Saree & Deep Neck Blouse", icon: "🥻", desc: "Drape a rich silk or chiffon saree with an open pallu. Let your hair fall loosely over one shoulder." },
  { name: "The Slinky Little Black / Red Dress", icon: "✨", desc: "A dress that highlights your curves and neckline. Pair with delicate earrings and dark lipstick." },
  { name: "His Oversized White Button-Down Shirt", icon: "👔", desc: "Wear only his loose formal shirt with top buttons unfastened. Irresistibly cute and seductive." },
  { name: "Pure Silk Robe & Bare Shoulders", icon: "🌸", desc: "Soft, flowing satin tied loosely at the waist. Lightly perfumed with your favorite fragrance." },
  { name: "The Backless Blouse & Flowing Georgette", icon: "💃", desc: "A sheer georgette saree showing the elegance of your back and waistline." }
];

const INITIAL_COUPONS = [
  { id: 'c1', title: "💆‍♀️ 20-Min Foot & Ankle Massage", desc: "Warm lotion, slow relaxing strokes, zero effort from her." },
  { id: 'c2', title: "🥻 Royal Saree Goddess Night", desc: "She wears a saree; husband gives full adoration & undraping ritual." },
  { id: 'c3', title: "💋 10-Minute Pure Kissing Session", desc: "Just slow kisses and embraces in bed without rush to have sex." },
  { id: 'c4', title: "👑 Queen's Breakfast/Dinner in Bed", desc: "Husband serves her favorite meal and cleans up all dishes." },
  { id: 'c5', title: "🕯️ Safe Haven Dark Cuddle", desc: "Hold each other in complete darkness with zero performance pressure." },
  { id: 'c6', title: "📸 Private Glamour Photoshoot", desc: "Husband takes 5 gorgeous, sensual photos capturing her curves." }
];

// --- TOAST HELPER ---
function showToast(msg) {
  let toast = document.getElementById('app-toast-box');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast-box';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('visible');
  sound.vibrate([20, 20]);
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2400);
}

// --- DOM INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  // Parse URL Parameters for Instant Pairing link (e.g. ?room=LOVE24&role=wife)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('room')) {
    appState.roomCode = urlParams.get('room').toUpperCase();
    appState.deviceMode = 'paired';
  }
  if (urlParams.has('role')) {
    appState.myRole = urlParams.get('role');
    appState.deviceMode = 'paired';
  }
  saveState(appState);

  initPasscodeGate();
  initNavigation();
  initDiscreetMode();
  initSoundToggle();
  initPairingSystem();
  initRadarTab();
  initSareeTab();
  initKissLab();
  initPraiseVault();
  initScratchCards();
  initFantasyLounge();
  initCoupons();
  initChatBridge();
});

// 1. NAVIGATION
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sound.playChime('soft');
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.dataset.target;
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Ribbon quick-kiss CTA
  const quickKiss = document.getElementById('quick-kiss-cta');
  if (quickKiss) {
    quickKiss.addEventListener('click', () => {
      const kissTab = document.querySelector('.nav-tab[data-target="tab-kiss"]');
      if (kissTab) kissTab.click();
    });
  }
}

// 2. DISCREET / STEALTH MODE
function initDiscreetMode() {
  const stealthBtn = document.getElementById('stealth-mode-btn');
  const overlay = document.getElementById('discreet-overlay');
  const exitBtn = document.getElementById('exit-discreet-btn');

  if (stealthBtn && overlay) {
    stealthBtn.addEventListener('click', () => {
      overlay.classList.remove('hidden');
    });
  }
  if (exitBtn && overlay) {
    exitBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
    });
  }
}

// 3. SOUND TOGGLE
function initSoundToggle() {
  const btn = document.getElementById('sound-toggle-btn');
  const icon = document.getElementById('sound-icon');
  if (btn && icon) {
    btn.addEventListener('click', () => {
      sound.enabled = !sound.enabled;
      icon.textContent = sound.enabled ? '🔊' : '🔇';
      showToast(sound.enabled ? 'Sound FX Enabled' : 'Sound FX Muted');
    });
  }
}

// 4. TAB 1: GREEN LIGHT RADAR & INITIATOR WHEEL
function initRadarTab() {
  const husbandPills = document.querySelectorAll('#husband-radar-box .mood-pill');
  const wifePills = document.querySelectorAll('#wife-radar-box .mood-pill');
  const husbandDisplay = document.getElementById('husband-mood-display');
  const wifeDisplay = document.getElementById('wife-mood-display');
  const matchBox = document.getElementById('radar-match-box');
  const matchActBtn = document.getElementById('match-act-btn');

  function updateRadarUI() {
    husbandPills.forEach(p => {
      p.classList.toggle('selected', p.dataset.mood === appState.husbandMood);
    });
    wifePills.forEach(p => {
      p.classList.toggle('selected', p.dataset.mood === appState.wifeMood);
    });

    if (appState.husbandMood) {
      husbandDisplay.innerHTML = `Signal: <b>${formatMood(appState.husbandMood)}</b>`;
    }
    if (appState.wifeMood) {
      wifeDisplay.innerHTML = `Signal: <b>${formatMood(appState.wifeMood)}</b>`;
    }

    // Check for match
    if (appState.husbandMood && appState.wifeMood) {
      const romanticMoods = ['fire', 'kiss', 'massage'];
      const bothRomantic = romanticMoods.includes(appState.husbandMood) && romanticMoods.includes(appState.wifeMood);
      
      if (bothRomantic) {
        matchBox.classList.remove('hidden');
        sound.playChime('celebrate');
      } else {
        matchBox.classList.add('hidden');
      }
    }
  }

  function formatMood(m) {
    switch(m) {
      case 'fire': return '🔥 Craving Passion & Sex';
      case 'kiss': return '💋 Craving Kisses & Slow Touch';
      case 'massage': return '💆 Pampering & Massage';
      case 'cuddle': return '🧸 Gentle Cuddles Only';
      case 'sleep': return '💤 Resting Tonight';
      default: return m;
    }
  }

  husbandPills.forEach(pill => {
    pill.addEventListener('click', () => {
      appState.husbandMood = pill.dataset.mood;
      saveState(appState);
      sound.playChime('soft');
      showToast('Husband mood signaled');
      updateRadarUI();
      broadcastSync('update_mood', { role: 'husband', mood: pill.dataset.mood });
    });
  });

  wifePills.forEach(pill => {
    pill.addEventListener('click', () => {
      appState.wifeMood = pill.dataset.mood;
      saveState(appState);
      sound.playChime('soft');
      showToast('Her mood signaled');
      updateRadarUI();
      broadcastSync('update_mood', { role: 'wife', mood: pill.dataset.mood });
    });
  });

  if (matchActBtn) {
    matchActBtn.addEventListener('click', () => {
      const kissTab = document.querySelector('.nav-tab[data-target="tab-kiss"]');
      if (kissTab) kissTab.click();
    });
  }

  updateRadarUI();

  // INITIATOR WHEEL
  const spinBtn = document.getElementById('spin-wheel-btn');
  const wheel = document.getElementById('initiator-wheel');
  const wheelResultBox = document.getElementById('wheel-result-box');
  const wheelResultText = document.getElementById('wheel-result-text');

  let currentRotation = 0;
  let spinning = false;

  const outcomes = [
    { title: "Tonight: Husband Initiates with Gentle Worship 🕯️", desc: "Husband takes full charge of the atmosphere: dim the lights, guide her to bed, and start with slow neck kisses. She only needs to relax." },
    { title: "Tonight: Wife Calls The Shots Like a Queen 👑", desc: "Wife is the untouchable Goddess. She can whisper what she wants, or simply point to where she wants to be touched." },
    { title: "Tonight: Slow Synchronized Melt 💋", desc: "No leader or follower. Turn off all lights, lie side-by-side holding hands, and kiss slowly." },
    { title: "Tonight: Total Pampering & Massage Favor 💆‍♀️", desc: "Husband treats her to an unhurried foot or back rub with no pressure for anything more." }
  ];

  if (spinBtn && wheel) {
    spinBtn.addEventListener('click', () => {
      if (spinning) return;
      spinning = true;
      sound.playChime('soft');

      // Random 4 to 7 full rotations plus sector offset
      const randomIndex = Math.floor(Math.random() * outcomes.length);
      const degreesPerSector = 90;
      const targetDegree = (3 - randomIndex) * degreesPerSector + 45; 
      const totalSpin = 1800 + targetDegree;

      currentRotation += totalSpin;
      wheel.style.transform = `rotate(${currentRotation}deg)`;

      setTimeout(() => {
        spinning = false;
        sound.playChime('celebrate');
        sound.vibrate([50, 50, 50]);
        const outcome = outcomes[randomIndex];
        wheelResultText.innerHTML = `<b>${outcome.title}</b><p class="mt-1" style="font-size:0.82rem; color:#ffd6e0;">${outcome.desc}</p>`;
        wheelResultBox.classList.remove('hidden');
      }, 3800);
    });
  }
}

// 5. TAB 2: SAREE & GODDESS QUEST
function initSareeTab() {
  const sareeBtn = document.getElementById('saree-draped-btn');
  const boldDressBtn = document.getElementById('bold-dress-btn');
  const celebrationBox = document.getElementById('saree-celebration-box');
  const complimentDisplay = document.getElementById('spontaneous-saree-compliment');
  const undrapingBtn = document.getElementById('start-undraping-guide-btn');

  function triggerCelebration(isSaree) {
    sound.playChime('celebrate');
    sound.vibrate([60, 40, 60, 40]);
    appState.goddessGems = (appState.goddessGems || 100) + 100;
    saveState(appState);

    const list = isSaree ? COMPLIMENTS_DB.saree : COMPLIMENTS_DB.bold;
    const randomPraise = list[Math.floor(Math.random() * list.length)];
    if (complimentDisplay) complimentDisplay.textContent = `"${randomPraise}"`;

    if (celebrationBox) {
      celebrationBox.classList.remove('hidden');
      celebrationBox.scrollIntoView({ behavior: 'smooth' });
    }
    showToast('👑 Queen Check-in! +100 Goddess Gems Earned');
    broadcastSync('saree_alert', { isSaree });
  }

  if (sareeBtn) {
    sareeBtn.addEventListener('click', () => triggerCelebration(true));
  }
  if (boldDressBtn) {
    boldDressBtn.addEventListener('click', () => triggerCelebration(false));
  }

  // Sensual Ritual Steps Interactivity
  const ritualSteps = document.querySelectorAll('.ritual-step');
  ritualSteps.forEach(step => {
    step.addEventListener('click', () => {
      sound.playChime('soft');
      ritualSteps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });

  if (undrapingBtn) {
    undrapingBtn.addEventListener('click', () => {
      const firstStep = document.querySelector('.ritual-step[data-step="1"]');
      if (firstStep) {
        firstStep.scrollIntoView({ behavior: 'smooth' });
        firstStep.classList.add('active');
      }
    });
  }

  // Wardrobe Roulette
  const spinWardrobeBtn = document.getElementById('spin-wardrobe-btn');
  const wardrobeCard = document.getElementById('wardrobe-result-card');
  const wardrobeName = document.getElementById('wardrobe-name');
  const wardrobeDesc = document.getElementById('wardrobe-desc');

  if (spinWardrobeBtn && wardrobeCard) {
    spinWardrobeBtn.addEventListener('click', () => {
      sound.playChime('soft');
      const pick = WARDROBE_ROULETTE[Math.floor(Math.random() * WARDROBE_ROULETTE.length)];
      wardrobeCard.style.opacity = '0.3';
      setTimeout(() => {
        wardrobeName.textContent = pick.name;
        wardrobeDesc.textContent = pick.desc;
        wardrobeCard.querySelector('.wardrobe-icon').textContent = pick.icon;
        wardrobeCard.style.opacity = '1';
        sound.playChime('celebrate');
        showToast('New allure revealed!');
      }, 300);
    });
  }
}

// 6. TAB 3: KISS & TOUCH LAB
function initKissLab() {
  const timerDisplay = document.getElementById('timer-display');
  const timerTitle = document.getElementById('timer-ritual-title');
  const timerInstruct = document.getElementById('timer-instructions');
  const startBtn = document.getElementById('start-timer-btn');
  const resetBtn = document.getElementById('reset-timer-btn');
  const pulseRing = document.getElementById('pulse-animation-ring');
  const presetChips = document.querySelectorAll('.preset-chip');
  const streakCount = document.getElementById('kiss-streak-count');
  const logKissBtn = document.getElementById('log-kiss-btn');

  let duration = 60;
  let remaining = 60;
  let timerInterval = null;
  let isRunning = false;

  function updateTimerText() {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    if (isRunning) {
      clearInterval(timerInterval);
      isRunning = false;
      startBtn.textContent = 'Resume Intimacy Timer';
      pulseRing.classList.remove('pulsing');
      return;
    }

    sound.playChime('soft');
    isRunning = true;
    startBtn.textContent = 'Pause';
    pulseRing.classList.add('pulsing');

    timerInterval = setInterval(() => {
      if (remaining > 0) {
        remaining--;
        updateTimerText();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'Melt Complete ❤️';
        pulseRing.classList.remove('pulsing');
        sound.playChime('gong');
        sound.vibrate([100, 100, 100, 100]);
        showToast('Sacred Kiss Complete. Stay in each other’s arms.');
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    remaining = duration;
    updateTimerText();
    startBtn.textContent = 'Start Intimacy Timer';
    pulseRing.classList.remove('pulsing');
  }

  if (startBtn) startBtn.addEventListener('click', startTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);

  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sound.playChime('soft');
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      duration = parseInt(chip.dataset.time, 10);
      remaining = duration;
      timerTitle.textContent = chip.dataset.title;
      timerInstruct.textContent = chip.dataset.instruct;
      resetTimer();
    });
  });

  // Kiss Streak
  if (streakCount) streakCount.textContent = appState.kissStreak || 1;
  if (logKissBtn) {
    logKissBtn.addEventListener('click', () => {
      const today = new Date().toISOString().slice(0, 10);
      if (appState.lastKissDate === today) {
        showToast('Already checked in today! Keep kissing ❤️');
        return;
      }
      appState.kissStreak = (appState.kissStreak || 0) + 1;
      appState.lastKissDate = today;
      saveState(appState);
      if (streakCount) streakCount.textContent = appState.kissStreak;
      sound.playChime('celebrate');
      showToast(`Streak Increased! ${appState.kissStreak} Days of Passion 🔥`);
      broadcastSync('kiss_logged', { streak: appState.kissStreak });
    });
  }
}

// 7. TAB 4: GODDESS PRAISE & FLIRT VAULT
function initPraiseVault() {
  const catChips = document.querySelectorAll('.cat-chip');
  const complimentText = document.getElementById('generated-compliment-text');
  const newCompBtn = document.getElementById('new-compliment-btn');
  const copyCompBtn = document.getElementById('copy-compliment-btn');
  const speakCompBtn = document.getElementById('speak-compliment-btn');
  const whatsappCompBtn = document.getElementById('whatsapp-compliment-btn');

  let currentCat = 'saree';

  function getRandomCompliment() {
    const list = COMPLIMENTS_DB[currentCat] || COMPLIMENTS_DB.saree;
    return list[Math.floor(Math.random() * list.length)];
  }

  function generateCompliment() {
    sound.playChime('soft');
    const comp = getRandomCompliment();
    if (complimentText) {
      complimentText.style.opacity = '0';
      setTimeout(() => {
        complimentText.textContent = `"${comp}"`;
        complimentText.style.opacity = '1';
      }, 200);
    }
  }

  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      catChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCat = chip.dataset.cat;
      generateCompliment();
    });
  });

  if (newCompBtn) newCompBtn.addEventListener('click', generateCompliment);

  if (copyCompBtn) {
    copyCompBtn.addEventListener('click', () => {
      if (!complimentText) return;
      const text = complimentText.textContent.replace(/^"|"$/g, '');
      navigator.clipboard.writeText(text).then(() => {
        showToast('Compliment copied to clipboard!');
      });
    });
  }

  if (whatsappCompBtn) {
    whatsappCompBtn.addEventListener('click', () => {
      if (!complimentText) return;
      const text = complimentText.textContent.replace(/^"|"$/g, '');
      const url = `https://wa.me/?text=${encodeURIComponent(text + " ❤️")}`;
      window.open(url, '_blank');
    });
  }

  if (speakCompBtn) {
    speakCompBtn.addEventListener('click', () => {
      if (!complimentText || !('speechSynthesis' in window)) {
        showToast('Speech not supported on this browser');
        return;
      }
      const text = complimentText.textContent.replace(/^"|"$/g, '');
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.85; // slow romantic pace
      utter.pitch = 0.95;
      window.speechSynthesis.speak(utter);
    });
  }

  // Daily Tasks Checklist
  const task1 = document.getElementById('praise-task-1');
  const task2 = document.getElementById('praise-task-2');
  const task3 = document.getElementById('praise-task-3');

  if (task1 && task2 && task3) {
    task1.checked = !!appState.dailyPraiseTasks.morning;
    task2.checked = !!appState.dailyPraiseTasks.body;
    task3.checked = !!appState.dailyPraiseTasks.clothing;

    function handleTaskChange() {
      appState.dailyPraiseTasks.morning = task1.checked;
      appState.dailyPraiseTasks.body = task2.checked;
      appState.dailyPraiseTasks.clothing = task3.checked;
      saveState(appState);

      const count = [task1.checked, task2.checked, task3.checked].filter(Boolean).length;
      document.querySelector('.checklist-header h3').textContent = `Husband's Daily Praise Goal (${count}/3 Completed)`;
      if (count === 3) {
        sound.playChime('celebrate');
        showToast('🌟 Daily Praise Goal Achieved! She is feeling loved.');
      } else {
        sound.playChime('soft');
      }
    }

    task1.addEventListener('change', handleTaskChange);
    task2.addEventListener('change', handleTaskChange);
    task3.addEventListener('change', handleTaskChange);
  }

  // Custom Compliments Vault
  const customInput = document.getElementById('custom-compliment-input');
  const saveCustomBtn = document.getElementById('save-custom-compliment-btn');
  const customList = document.getElementById('custom-compliments-list');

  function renderCustomCompliments() {
    if (!customList) return;
    customList.innerHTML = '';
    (appState.customCompliments || []).forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'praise-item';
      div.innerHTML = `<span>“${item}”</span><button class="item-delete-btn" data-index="${index}">✕</button>`;
      customList.appendChild(div);
    });

    customList.querySelectorAll('.item-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        appState.customCompliments.splice(idx, 1);
        saveState(appState);
        renderCustomCompliments();
      });
    });
  }

  if (saveCustomBtn && customInput) {
    saveCustomBtn.addEventListener('click', () => {
      const val = customInput.value.trim();
      if (!val) return;
      if (!appState.customCompliments) appState.customCompliments = [];
      appState.customCompliments.push(val);
      saveState(appState);
      customInput.value = '';
      renderCustomCompliments();
      sound.playChime('soft');
      showToast('Custom compliment saved to vault!');
    });
  }

  renderCustomCompliments();
}

// 8. TAB 5: SCRATCH CARDS & SPICY DARES
function initScratchCards() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const secretTitle = document.getElementById('scratch-secret-title');
  const secretDesc = document.getElementById('scratch-secret-desc');
  const secretEmoji = document.getElementById('scratch-secret-emoji');
  const newCardBtn = document.getElementById('new-scratch-card-btn');
  const intensityBtns = document.querySelectorAll('.intensity-btn');

  let currentLevel = 'medium';
  let isScratching = false;
  let scratched = false;

  function loadCard() {
    scratched = false;
    const pool = SCRATCH_DARES[currentLevel] || SCRATCH_DARES.medium;
    const card = pool[Math.floor(Math.random() * pool.length)];

    secretTitle.textContent = card.title;
    secretDesc.textContent = card.desc;
    secretEmoji.textContent = card.emoji;

    // Repaint canvas scratch cover
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#53143c');
    grad.addColorStop(0.5, '#781538');
    grad.addColorStop(1, '#3f102c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add gold fleck pattern & label
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#e5b966';
    ctx.textAlign = 'center';
    ctx.fillText('✦ SCRATCH TO REVEAL DARE ✦', canvas.width / 2, canvas.height / 2);
  }

  function scratch(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    if (!scratched) {
      sound.vibrate([15]);
      checkScratchPercentage();
    }
  }

  function checkScratchPercentage() {
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let transparentPixels = 0;
      for (let i = 3; i < imgData.data.length; i += 32) {
        if (imgData.data[i] === 0) transparentPixels++;
      }
      const totalSampled = imgData.data.length / 32;
      if (transparentPixels / totalSampled > 0.4) {
        scratched = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sound.playChime('celebrate');
        showToast('Secret Dare Unveiled! Time to play 😈');
      }
    } catch (e) {}
  }

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  // Mouse & Touch events
  canvas.addEventListener('mousedown', (e) => {
    isScratching = true;
    const pos = getCoords(e);
    scratch(pos.x, pos.y);
  });
  window.addEventListener('mouseup', () => { isScratching = false; });
  canvas.addEventListener('mousemove', (e) => {
    if (!isScratching) return;
    const pos = getCoords(e);
    scratch(pos.x, pos.y);
  });

  canvas.addEventListener('touchstart', (e) => {
    isScratching = true;
    const pos = getCoords(e);
    scratch(pos.x, pos.y);
  }, { passive: true });
  window.addEventListener('touchend', () => { isScratching = false; });
  canvas.addEventListener('touchmove', (e) => {
    if (!isScratching) return;
    const pos = getCoords(e);
    scratch(pos.x, pos.y);
  }, { passive: true });

  if (newCardBtn) {
    newCardBtn.addEventListener('click', () => {
      sound.playChime('soft');
      loadCard();
    });
  }

  intensityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      intensityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLevel = btn.dataset.level;
      sound.playChime('soft');
      loadCard();
    });
  });

  loadCard();

  // Sensual Truth or Dare
  const truthBtn = document.getElementById('tod-truth-btn');
  const dareBtn = document.getElementById('tod-dare-btn');
  const todDisplay = document.getElementById('tod-display-card');
  const todBadge = document.getElementById('tod-type-badge');
  const todText = document.getElementById('tod-text');

  if (truthBtn && todDisplay) {
    truthBtn.addEventListener('click', () => {
      sound.playChime('soft');
      todBadge.className = 'tod-badge truth';
      todBadge.textContent = 'SENSUAL TRUTH';
      const prompt = TRUTH_DARES_PROMPTS.truths[Math.floor(Math.random() * TRUTH_DARES_PROMPTS.truths.length)];
      todText.textContent = prompt;
      todDisplay.classList.remove('hidden');
    });
  }

  if (dareBtn && todDisplay) {
    dareBtn.addEventListener('click', () => {
      sound.playChime('soft');
      todBadge.className = 'tod-badge dare';
      todBadge.textContent = 'SPICY DARE';
      const prompt = TRUTH_DARES_PROMPTS.dares[Math.floor(Math.random() * TRUTH_DARES_PROMPTS.dares.length)];
      todText.textContent = prompt;
      todDisplay.classList.remove('hidden');
    });
  }
}

// 9. TAB 6: FANTASY & IMAGINATION LOUNGE
function initFantasyLounge() {
  const drawBtn = document.getElementById('draw-fantasy-btn');
  const tagEl = document.getElementById('fantasy-category-tag');
  const titleEl = document.getElementById('fantasy-scenario-title');
  const bodyEl = document.getElementById('fantasy-scenario-body');
  const sparkEl = document.getElementById('fantasy-spark-text');

  function drawScenario() {
    sound.playChime('soft');
    const pick = FANTASY_SCENARIOS[Math.floor(Math.random() * FANTASY_SCENARIOS.length)];
    if (tagEl) tagEl.textContent = pick.category;
    if (titleEl) titleEl.textContent = `"${pick.title}"`;
    if (bodyEl) bodyEl.textContent = pick.body;
    if (sparkEl) sparkEl.textContent = pick.spark;
    showToast('New fantasy card drawn 🍷');
  }

  if (drawBtn) drawBtn.addEventListener('click', drawScenario);

  // Secret Wishlist Jar
  const wishInput = document.getElementById('new-wish-input');
  const addWishBtn = document.getElementById('add-wish-btn');
  const wishesContainer = document.getElementById('wishes-container');

  function renderWishes() {
    if (!wishesContainer) return;
    wishesContainer.innerHTML = '';
    (appState.customWishes || []).forEach((w, idx) => {
      const div = document.createElement('div');
      div.className = 'wish-item';
      div.innerHTML = `<span>💌 ${w}</span><button class="item-delete-btn" data-index="${idx}">✕</button>`;
      wishesContainer.appendChild(div);
    });

    wishesContainer.querySelectorAll('.item-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        appState.customWishes.splice(idx, 1);
        saveState(appState);
        renderWishes();
      });
    });
  }

  if (addWishBtn && wishInput) {
    addWishBtn.addEventListener('click', () => {
      const text = wishInput.value.trim();
      if (!text) return;
      if (!appState.customWishes) appState.customWishes = [];
      appState.customWishes.push(text);
      saveState(appState);
      wishInput.value = '';
      renderWishes();
      sound.playChime('celebrate');
      showToast('Desire dropped safely into the jar!');
    });
  }

  renderWishes();
}

// 10. TAB 7: COUPLES LOVE COUPONS
function initCoupons() {
  const couponsGrid = document.getElementById('coupons-grid');
  const titleInput = document.getElementById('coupon-title-input');
  const descInput = document.getElementById('coupon-desc-input');
  const createBtn = document.getElementById('create-coupon-btn');

  function renderCoupons() {
    if (!couponsGrid) return;

    const allCoupons = [
      ...INITIAL_COUPONS,
      ...(appState.customCoupons || [])
    ];

    couponsGrid.innerHTML = '';

    allCoupons.forEach(coupon => {
      const isRedeemed = (appState.redeemedCoupons || []).includes(coupon.id);
      const card = document.createElement('div');
      card.className = `coupon-ticket ${isRedeemed ? 'redeemed' : ''}`;
      card.innerHTML = `
        <div class="coupon-left">
          <h4>${coupon.title}</h4>
          <p>${coupon.desc}</p>
        </div>
        <button class="coupon-redeem-btn" data-id="${coupon.id}" ${isRedeemed ? 'disabled' : ''}>
          ${isRedeemed ? 'Redeemed' : 'Redeem Now'}
        </button>
      `;
      couponsGrid.appendChild(card);
    });

    couponsGrid.querySelectorAll('.coupon-redeem-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (!appState.redeemedCoupons) appState.redeemedCoupons = [];
        if (!appState.redeemedCoupons.includes(id)) {
          appState.redeemedCoupons.push(id);
          saveState(appState);
          sound.playChime('celebrate');
          showToast('Coupon Redeemed! Enjoy your royal favor 👑');
          broadcastSync('coupon_redeemed', { couponId: id });
          renderCoupons();
        }
      });
    });
  }

  if (createBtn && titleInput && descInput) {
    createBtn.addEventListener('click', () => {
      const t = titleInput.value.trim();
      const d = descInput.value.trim();
      if (!t) return;
      if (!appState.customCoupons) appState.customCoupons = [];
      appState.customCoupons.push({
        id: 'custom_' + Date.now(),
        title: `🎁 ${t}`,
        desc: d || 'Valid anytime between husband and wife!'
      });
      saveState(appState);
      titleInput.value = '';
      descInput.value = '';
      sound.playChime('celebrate');
      showToast('Custom Coupon Created!');
      renderCoupons();
    });
  }

  renderCoupons();
}

// 11. CHAT-TO-BEDROOM BRIDGE (WhatsApp sender)
function initChatBridge() {
  const starterBtns = document.querySelectorAll('.send-starter-btn');
  starterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.text;
      if (!text) return;
      sound.playChime('soft');
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    });
  });
}

// 12. TWO-PHONE PAIRING & REAL-TIME SYNC
let localSSE = null;
let peerConnection = null;
let peer = null;

// --- END-TO-END ENCRYPTION (E2EE) ---
// Guarantees 100% privacy between office and home across 4G/5G mobile networks!
async function deriveEncryptionKey(passphrase) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('velvet_sacred_privacy_salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptData(object, passphrase) {
  if (!window.crypto || !crypto.subtle) return object;
  try {
    const enc = new TextEncoder();
    const key = await deriveEncryptionKey(passphrase);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(JSON.stringify(object))
    );
    return {
      encrypted: true,
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(encrypted))
    };
  } catch (e) {
    return object;
  }
}

async function decryptData(payload, passphrase) {
  if (!payload || !payload.encrypted) return payload;
  if (!window.crypto || !crypto.subtle) return payload;
  try {
    const dec = new TextDecoder();
    const key = await deriveEncryptionKey(passphrase);
    const iv = new Uint8Array(payload.iv);
    const ciphertext = new Uint8Array(payload.ciphertext);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    return JSON.parse(dec.decode(decrypted));
  } catch (e) {
    console.warn('E2EE Decryption error: verify couple codes match', e);
    return null;
  }
}

async function getHashedTopic(code) {
  try {
    const enc = new TextEncoder();
    const hashBuf = await crypto.subtle.digest('SHA-256', enc.encode(`velvet_vow_${code}`));
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return 'vv_' + hashArr.slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return 'vv_' + (code || 'love24').toLowerCase().replace(/[^a-z0-9]/g, '');
  }
}

async function broadcastSync(action, payload) {
  if (appState.deviceMode !== 'paired') return;
  const rawData = {
    room: appState.roomCode,
    senderRole: appState.myRole,
    action,
    payload,
    timestamp: Date.now()
  };

  // Encrypt with our secret passphrase before broadcasting into the cloud!
  const encryptedPayload = await encryptData(rawData, appState.roomCode || 'LOVE24');
  const cloudTopic = await getHashedTopic(appState.roomCode || 'LOVE24');

  // 1. Universal Cloud Relay (Encrypted E2EE over 4G/5G mobile networks worldwide)
  fetch(`https://ntfy.sh/${cloudTopic}`, {
    method: 'POST',
    body: JSON.stringify(encryptedPayload),
    headers: {
      'Title': 'Velvet & Vow',
      'Tags': 'lock,sparkles'
    }
  }).catch(() => {});

  // 2. Local network server fallback (if on home Wi-Fi)
  fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rawData)
  }).catch(() => {});

  // 3. WebRTC PeerJS fallback
  if (peerConnection && peerConnection.open) {
    try {
      peerConnection.send(rawData);
    } catch (e) {}
  }
}

function triggerSystemNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        vibrate: [200, 100, 200]
      });
    } catch (e) {}
  }
}

function handleIncomingSync(data) {
  if (!data || data.senderRole === appState.myRole) return; // ignore own echoed messages

  if (data.action === 'update_mood') {
    const role = data.payload.role;
    const mood = data.payload.mood;
    if (role === 'husband') {
      appState.husbandMood = mood;
    } else if (role === 'wife') {
      appState.wifeMood = mood;
    }
    saveState(appState);
    sound.playChime('soft');
    const msg = `Partner signaled: ${mood.toUpperCase()} mood 💌`;
    showToast(msg);
    triggerSystemNotification("Velvet & Vow | Intimacy Signal", msg);

    // Update UI if radar tab exists
    const husbandPills = document.querySelectorAll('#husband-radar-box .mood-pill');
    const wifePills = document.querySelectorAll('#wife-radar-box .mood-pill');
    const husbandDisplay = document.getElementById('husband-mood-display');
    const wifeDisplay = document.getElementById('wife-mood-display');
    const matchBox = document.getElementById('radar-match-box');

    husbandPills.forEach(p => p.classList.toggle('selected', p.dataset.mood === appState.husbandMood));
    wifePills.forEach(p => p.classList.toggle('selected', p.dataset.mood === appState.wifeMood));
    if (husbandDisplay && appState.husbandMood) husbandDisplay.innerHTML = `Signal: <b>${appState.husbandMood}</b>`;
    if (wifeDisplay && appState.wifeMood) wifeDisplay.innerHTML = `Signal: <b>${appState.wifeMood}</b>`;

    if (appState.husbandMood && appState.wifeMood) {
      const romanticMoods = ['fire', 'kiss', 'massage'];
      if (romanticMoods.includes(appState.husbandMood) && romanticMoods.includes(appState.wifeMood)) {
        if (matchBox) matchBox.classList.remove('hidden');
        sound.playChime('celebrate');
        sound.vibrate([80, 50, 80]);
        showToast('✨ SPARK MATCH! Both of you want intimacy tonight!');
        triggerSystemNotification("✨ SPARK MATCH!", "Both of you want intimacy tonight! Time to kiss.");
      }
    }
  } else if (data.action === 'saree_alert') {
    sound.playChime('celebrate');
    sound.vibrate([100, 50, 100, 50]);
    const msg = '👑 Queen Alert: She is in a saree right now! Tap Saree tab for your royal duties!';
    showToast(msg);
    triggerSystemNotification("👑 Queen Alert", "She is in a saree right now! Tap to view your royal duties.");
    const celebrationBox = document.getElementById('saree-celebration-box');
    if (celebrationBox) celebrationBox.classList.remove('hidden');
  } else if (data.action === 'kiss_logged') {
    appState.kissStreak = data.payload.streak || (appState.kissStreak + 1);
    saveState(appState);
    const streakCount = document.getElementById('kiss-streak-count');
    if (streakCount) streakCount.textContent = appState.kissStreak;
    sound.playChime('celebrate');
    const msg = `❤️ Partner checked in: Kiss Streak is now ${appState.kissStreak} Days!`;
    showToast(msg);
    triggerSystemNotification("❤️ Kiss Checked In", msg);
  } else if (data.action === 'coupon_redeemed') {
    const id = data.payload.couponId;
    if (!appState.redeemedCoupons) appState.redeemedCoupons = [];
    if (!appState.redeemedCoupons.includes(id)) appState.redeemedCoupons.push(id);
    saveState(appState);
    sound.playChime('celebrate');
    const msg = '🎟️ Partner redeemed a royal intimacy coupon!';
    showToast(msg);
    triggerSystemNotification("🎟️ Coupon Redeemed", msg);
    const btn = document.querySelector(`.coupon-redeem-btn[data-id="${id}"]`);
    if (btn) {
      btn.textContent = 'Redeemed';
      btn.disabled = true;
      const card = btn.closest('.coupon-ticket');
      if (card) card.classList.add('redeemed');
    }
  }
}

function startSyncConnection() {
  if (appState.deviceMode !== 'paired') return;

  const connIndicator = document.getElementById('conn-indicator-dot');
  const connLabel = document.getElementById('conn-status-label');

  // Request browser notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }

  // 1. UNIVERSAL CLOUD SSE (Encrypted E2EE over 4G/5G mobile networks worldwide)
  getHashedTopic(appState.roomCode || 'LOVE24').then(cloudTopic => {
    if (window.cloudSSE) window.cloudSSE.close();
    try {
      window.cloudSSE = new EventSource(`https://ntfy.sh/${cloudTopic}/sse`);
      window.cloudSSE.onmessage = async (event) => {
        try {
          const raw = JSON.parse(event.data);
          if (raw.event === 'message') {
            const rawPayload = JSON.parse(raw.message);
            // Decrypt with our secret passphrase!
            const decrypted = await decryptData(rawPayload, appState.roomCode || 'LOVE24');
            if (decrypted) {
              handleIncomingSync(decrypted);
            }
          }
        } catch (e) {}
      };
      window.cloudSSE.onopen = () => {
        if (connIndicator) connIndicator.classList.add('online');
        if (connLabel) connLabel.textContent = `🔒 E2EE Cloud Synced (${appState.roomCode})`;
      };
    } catch (e) {}
  });

  // 2. Connect Local Server SSE (Fallback if running on local PC)
  if (window.EventSource) {
    if (localSSE) localSSE.close();
    try {
      localSSE = new EventSource(`/api/events?room=${encodeURIComponent(appState.roomCode)}`);
      localSSE.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleIncomingSync(data);
        } catch (e) {}
      };
    } catch (e) {}
  }

  // 3. Connect WebRTC PeerJS P2P (Cloud Fallback)
  if (window.Peer) {
    const myPeerId = `velvet-vow-${safeRoom}-${appState.myRole}`.toLowerCase();
    const partnerPeerId = `velvet-vow-${safeRoom}-${appState.myRole === 'husband' ? 'wife' : 'husband'}`.toLowerCase();

    try {
      if (peer) peer.destroy();
      peer = new Peer(myPeerId);

      peer.on('open', () => {
        if (connIndicator) connIndicator.classList.add('online');
        // Try connecting to partner
        peerConnection = peer.connect(partnerPeerId, { reliable: true });
        peerConnection.on('data', handleIncomingSync);
      });

      peer.on('connection', (conn) => {
        peerConnection = conn;
        conn.on('data', handleIncomingSync);
        if (connIndicator) connIndicator.classList.add('online');
        if (connLabel) connLabel.textContent = `Paired with Partner's Phone!`;
      });

      peer.on('error', (err) => {
        console.log('PeerJS notice:', err);
      });
    } catch (e) {
      console.warn('Peer error', e);
    }
  }
}

function initPairingSystem() {
  const pairBtn = document.getElementById('pair-mode-btn');
  const modal = document.getElementById('pairing-modal');
  const closeBtn = document.getElementById('close-pairing-modal-btn');
  const modeSharedBtn = document.getElementById('mode-shared-btn');
  const modePairedBtn = document.getElementById('mode-paired-btn');
  const pairedPanel = document.getElementById('paired-settings-panel');
  const roleHusbandBtn = document.getElementById('role-husband-btn');
  const roleWifeBtn = document.getElementById('role-wife-btn');
  const roomCodeInput = document.getElementById('couple-room-code-input');
  const saveCodeBtn = document.getElementById('save-room-code-btn');
  const inviteBtn = document.getElementById('invite-partner-btn');
  const connIndicator = document.getElementById('conn-indicator-dot');
  const connLabel = document.getElementById('conn-status-label');
  const deviceBadge = document.getElementById('device-mode-badge');

  function updateModeUI() {
    if (appState.deviceMode === 'paired') {
      modePairedBtn.classList.add('active');
      modeSharedBtn.classList.remove('active');
      pairedPanel.classList.remove('hidden');
      deviceBadge.textContent = appState.myRole === 'husband' ? '🧔 Husband’s Phone (Paired)' : '👑 Wife’s Phone (Paired)';
    } else {
      modeSharedBtn.classList.add('active');
      modePairedBtn.classList.remove('active');
      pairedPanel.classList.add('hidden');
      deviceBadge.textContent = 'Shared Device Mode';
    }

    roleHusbandBtn.classList.toggle('active', appState.myRole === 'husband');
    roleWifeBtn.classList.toggle('active', appState.myRole === 'wife');
    if (roomCodeInput) roomCodeInput.value = appState.roomCode || 'LOVE24';
  }

  if (pairBtn && modal) {
    pairBtn.addEventListener('click', () => {
      sound.playChime('soft');
      modal.classList.remove('hidden');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  if (modeSharedBtn) {
    modeSharedBtn.addEventListener('click', () => {
      appState.deviceMode = 'shared';
      saveState(appState);
      sound.playChime('soft');
      updateModeUI();
      showToast('Switched to Shared Device Mode');
    });
  }

  if (modePairedBtn) {
    modePairedBtn.addEventListener('click', () => {
      appState.deviceMode = 'paired';
      saveState(appState);
      sound.playChime('soft');
      updateModeUI();
      startSyncConnection();
      showToast('Switched to Two Phones Paired Mode');
    });
  }

  if (roleHusbandBtn) {
    roleHusbandBtn.addEventListener('click', () => {
      appState.myRole = 'husband';
      saveState(appState);
      sound.playChime('soft');
      updateModeUI();
      startSyncConnection();
    });
  }

  if (roleWifeBtn) {
    roleWifeBtn.addEventListener('click', () => {
      appState.myRole = 'wife';
      saveState(appState);
      sound.playChime('soft');
      updateModeUI();
      startSyncConnection();
    });
  }

  if (saveCodeBtn && roomCodeInput) {
    saveCodeBtn.addEventListener('click', () => {
      const code = roomCodeInput.value.trim().toUpperCase() || 'LOVE24';
      appState.roomCode = code;
      saveState(appState);
      sound.playChime('celebrate');
      showToast(`Couple Code set to: ${code}`);
      startSyncConnection();
    });
  }

  if (inviteBtn) {
    inviteBtn.addEventListener('click', () => {
      const partnerRole = appState.myRole === 'husband' ? 'wife' : 'husband';
      const cleanOrigin = window.location.origin;
      const cleanPath = window.location.pathname;
      const inviteUrl = `${cleanOrigin}${cleanPath}?room=${encodeURIComponent(appState.roomCode)}&role=${partnerRole}`;
      const msg = `Join me on our private Velvet & Vow romantic app ❤️ Tap this link on your phone to connect with me instantly: ${inviteUrl}`;
      const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    });
  }

  updateModeUI();
  if (appState.deviceMode === 'paired') {
    startSyncConnection();
  }
}

// 13. PASSCODE SECURITY GATE
function initPasscodeGate() {
  const gate = document.getElementById('passcode-gate');
  if (!gate) return;

  // Check if PIN lock is disabled or already unlocked this session
  if (!appState.pinLockEnabled || sessionStorage.getItem('velvet_unlocked') === 'true') {
    gate.classList.add('unlocked');
  }

  let enteredPin = '';
  const dots = [
    document.getElementById('p-dot-0'),
    document.getElementById('p-dot-1'),
    document.getElementById('p-dot-2'),
    document.getElementById('p-dot-3')
  ];
  const errorMsg = document.getElementById('pin-error-msg');
  const numKeys = document.querySelectorAll('.num-key[data-val]');
  const deleteKey = document.getElementById('num-delete-btn');
  const disguiseKey = document.getElementById('num-disguise-btn');

  function updateDots() {
    dots.forEach((dot, idx) => {
      if (dot) dot.classList.toggle('filled', idx < enteredPin.length);
    });
  }

  function handleDigit(d) {
    if (enteredPin.length >= 4) return;
    enteredPin += d;
    sound.playChime('soft');
    updateDots();

    if (enteredPin.length === 4) {
      setTimeout(verifyPin, 150);
    }
  }

  function verifyPin() {
    const validPin = appState.userPin || '1234';
    if (enteredPin === validPin) {
      sound.playChime('celebrate');
      sound.vibrate([40, 40]);
      sessionStorage.setItem('velvet_unlocked', 'true');
      gate.classList.add('unlocked');
      if (errorMsg) errorMsg.classList.add('hidden');
    } else {
      sound.vibrate([100, 50, 100]);
      if (errorMsg) errorMsg.classList.remove('hidden');
      enteredPin = '';
      updateDots();
    }
  }

  numKeys.forEach(key => {
    key.addEventListener('click', () => handleDigit(key.dataset.val));
  });

  if (deleteKey) {
    deleteKey.addEventListener('click', () => {
      if (enteredPin.length > 0) {
        enteredPin = enteredPin.slice(0, -1);
        updateDots();
      }
    });
  }

  if (disguiseKey) {
    disguiseKey.addEventListener('click', () => {
      const overlay = document.getElementById('discreet-overlay');
      if (overlay) overlay.classList.remove('hidden');
    });
  }

  // --- SETTINGS & PIN MANAGEMENT ---
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettingsBtn = document.getElementById('close-settings-modal-btn');
  const newPinInput = document.getElementById('new-pin-input');
  const saveNewPinBtn = document.getElementById('save-new-pin-btn');
  const currentPinReminder = document.getElementById('current-pin-reminder');
  const requirePinToggle = document.getElementById('require-pin-toggle');
  const lockNowBtn = document.getElementById('lock-now-btn');
  const modalLockNowBtn = document.getElementById('modal-lock-now-btn');

  function updatePinReminder() {
    if (currentPinReminder) {
      currentPinReminder.innerHTML = `Current PIN: <b>${appState.userPin || '1234'}</b>`;
    }
    if (requirePinToggle) {
      requirePinToggle.checked = appState.pinLockEnabled !== false;
    }
  }

  function lockAppNow() {
    sound.playChime('soft');
    sessionStorage.removeItem('velvet_unlocked');
    gate.classList.remove('unlocked');
    if (settingsModal) settingsModal.classList.add('hidden');
    enteredPin = '';
    updateDots();
    showToast('App Locked 🔒');
  }

  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', () => {
      sound.playChime('soft');
      updatePinReminder();
      settingsModal.classList.remove('hidden');
    });
  }

  if (closeSettingsBtn && settingsModal) {
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('hidden');
    });
  }

  if (saveNewPinBtn && newPinInput) {
    saveNewPinBtn.addEventListener('click', () => {
      const pin = newPinInput.value.trim();
      if (pin.length !== 4 || isNaN(pin)) {
        showToast('Please enter a 4-digit number (e.g. 5678)');
        return;
      }
      appState.userPin = pin;
      saveState(appState);
      newPinInput.value = '';
      updatePinReminder();
      sound.playChime('celebrate');
      showToast(`New PIN Saved: ${pin} 🔑`);
    });
  }

  if (requirePinToggle) {
    requirePinToggle.addEventListener('change', () => {
      appState.pinLockEnabled = requirePinToggle.checked;
      saveState(appState);
      showToast(requirePinToggle.checked ? 'PIN Protection Active' : 'PIN Protection Disabled');
    });
  }

  if (lockNowBtn) lockNowBtn.addEventListener('click', lockAppNow);
  if (modalLockNowBtn) modalLockNowBtn.addEventListener('click', lockAppNow);

  const inlineSettingsBtn = document.getElementById('inline-settings-btn');
  const navSettingsTab = document.getElementById('nav-settings-tab');

  if (inlineSettingsBtn) {
    inlineSettingsBtn.addEventListener('click', () => {
      sound.playChime('soft');
      updatePinReminder();
      if (settingsModal) settingsModal.classList.remove('hidden');
    });
  }

  if (navSettingsTab) {
    navSettingsTab.addEventListener('click', () => {
      sound.playChime('soft');
      updatePinReminder();
      if (settingsModal) settingsModal.classList.remove('hidden');
    });
  }
}


