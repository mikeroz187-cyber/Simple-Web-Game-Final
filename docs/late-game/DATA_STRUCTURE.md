# Industry Takeover — Data Structure

## Overview

This document defines all data structures for the Industry Takeover system: config schemas, gameState extensions, and content data formats.

---

## 1. Config Additions (src/config.js)

### 1.1 Takeover System Config

```javascript
CONFIG.takeover = {
  // System unlock
  unlockDay: 181,
  enabled: true,

  // Timing
  daysPerStage: 2,
  bossConfrontationStages: 5,
  
  // Reputation thresholds
  repRequirements: {
    tier1: 30,
    tier2: 50,
    tier3: 75,
    boss: 100 // Reputation cap is 100 (global)
  },

  // Base costs (Tier 1)
  costs: {
    intel: 4000,
    approach: 9000,
    turn: 22000,
    debut: 6000,
    bossConfrontation: 140000
  },

  // Tier cost multipliers
  tierMultipliers: {
    tier1: 1.0,
    tier2: 1.5,
    tier3: 2.0
  },

  // Reputation changes
  repChanges: {
    weaknessAmbition: 0,
    weaknessNeglect: 0,
    weaknessDebt: -5,
    weaknessPride: -10,
    weaknessSecret: -20,
    failedAcquisition: -15,
    successfulDebut: 3,
    bossDefeated: 25,
    defendedPoach: 5,
    passiveRecoveryPerWeek: 1
  },

  // Reputation defense thresholds
  repDefense: {
    strong: 100,    // Attacks mostly fizzle
    normal: 75,     // Reduced impact
    vulnerable: 50, // Normal impact
    weak: 25,       // High impact
    crisis: 10      // Floor - cannot drop below
  },

  // Rival retaliation
  retaliation: {
    minDaysBetweenEvents: 7,
    maxDaysBetweenEvents: 14,
    poachDefenseCost: 20000,
    poachRepPenaltyOnLoss: -10,
    lostCooldownDays: 14,
    poachBaseCost: 8000,         // Base counter-offer cost
    poachCostPerStarPower: 2000, // Additional per star power
    allianceDurationDays: 14,
    allianceCostMultiplier: 1.25
  },

  // Boss vulnerability threshold
  performersToVulnerableBoss: 3
};
```

### 1.2 Studios Config

```javascript
CONFIG.takeover.studios = {
  neon_cherry: {
    id: "neon_cherry",
    name: "Neon Cherry",
    tagline: "Cute sells. Weird sells more.",
    specialty: "Cosplay/Kawaii",
    difficulty: 2,
    bossId: "boss_yuki_tanaka",
    performerIds: [
      "takeover_mika_sato",
      "takeover_pepper_chu",
      "takeover_kira_kimura",
      "takeover_suki_avalon",
      "takeover_luna_lux"
    ],
    bonusOnDefeat: {
      type: "contentMultiplier",
      category: "cosplay",
      value: 1.10
    }
  },

  honey_trap: {
    id: "honey_trap",
    name: "Honey Trap Productions",
    tagline: "Family first. Business second. But business is good.",
    specialty: "Latina/Curves",
    difficulty: 3,
    bossId: "boss_carmen_reyes",
    performerIds: [
      "takeover_rosa_vega",
      "takeover_daniela_cruz",
      "takeover_valentina_fuentes",
      "takeover_marisol_delgado",
      "takeover_sofia_reyes"
    ],
    bonusOnDefeat: {
      type: "contentMultiplier",
      category: "curves",
      value: 1.10
    }
  },

  midnight_media: {
    id: "midnight_media",
    name: "Midnight Media",
    tagline: "We're not mainstream. We're better.",
    specialty: "Alt/Edge",
    difficulty: 3,
    bossId: "boss_sasha_volkov",
    performerIds: [
      "takeover_raven_darke",
      "takeover_zoe_vicious",
      "takeover_jade_holloway",
      "takeover_elektra_wylde",
      "takeover_vex_morrow"
    ],
    bonusOnDefeat: {
      type: "contentMultiplier",
      category: "alt",
      value: 1.10
    }
  },

  velvet_vault: {
    id: "velvet_vault",
    name: "Velvet Vault",
    tagline: "Luxury locked tight. You hold the key.",
    specialty: "Luxury/Glamour",
    difficulty: 4,
    bossId: "boss_dominique_vance",
    performerIds: [
      "takeover_bianca_morel",
      "takeover_chanel_dubois",
      "takeover_natasha_kaine",
      "takeover_serena_lake",
      "takeover_isabelle_fontaine"
    ],
    bonusOnDefeat: {
      type: "contentMultiplier",
      category: "luxury",
      value: 1.10
    }
  },

  saint_sin: {
    id: "saint_sin",
    name: "Saint Sin",
    tagline: "Confession is currency. Pay up.",
    specialty: "Confession/Taboo",
    difficulty: 5,
    bossId: "boss_victoria_kross",
    performerIds: [
      "takeover_scarlet_obrien",
      "takeover_mistress_ivy",
      "takeover_delilah_thorn",
      "takeover_anastasia_devereux",
      "takeover_lilith_kane"
    ],
    bonusOnDefeat: {
      type: "contentMultiplier",
      category: "confession",
      value: 1.10
    }
  }
};

// Studio order (for display and suggested progression)
CONFIG.takeover.studioOrder = [
  "neon_cherry",
  "honey_trap",
  "midnight_media",
  "velvet_vault",
  "saint_sin"
];
```

### 1.3 Bosses Config

```javascript
CONFIG.takeover.bosses = {
  boss_yuki_tanaka: {
    id: "boss_yuki_tanaka",
    name: "Yuki Tanaka",
    studioId: "neon_cherry",
    age: 28,
    description: "Petite, pastel hair, always in some costume element. Bubbly exterior hiding business anxiety.",
    weakness: "Desperate to be taken seriously. Treat her like a real player, and she'll melt.",
    confrontationStyle: "Seduction through validation",
    portraitPath: "assets/images/takeover/neon_cherry/boss_yuki_tanaka/portrait.png"
  },

  boss_carmen_reyes: {
    id: "boss_carmen_reyes",
    name: "Carmen Reyes",
    studioId: "honey_trap",
    age: 42,
    description: "Mature, voluptuous, always overdressed. Former performer. Protective mama bear.",
    weakness: "Her son has debts. Real ones. She'd do anything to protect him.",
    confrontationStyle: "Leverage through family pressure",
    portraitPath: "assets/images/takeover/honey_trap/boss_carmen_reyes/portrait.png"
  },

  boss_sasha_volkov: {
    id: "boss_sasha_volkov",
    name: "Sasha Volkov",
    studioId: "midnight_media",
    age: 35,
    description: "Eastern European ice queen. Sleeve tattoos, undercut, permanent scowl.",
    weakness: "Hypocrisy. She preaches anti-capitalism while hoarding the profits.",
    confrontationStyle: "Exposure and unmasking",
    portraitPath: "assets/images/takeover/midnight_media/boss_sasha_volkov/portrait.png"
  },

  boss_dominique_vance: {
    id: "boss_dominique_vance",
    name: "Dominique Vance",
    studioId: "velvet_vault",
    age: 38,
    description: "Luxury tyrant in silk gloves. Every contract feels like a collar.",
    weakness: "She can't stand anyone escaping her orbit. Offer her a bigger throne.",
    confrontationStyle: "Control through decadence",
    portraitPath: "assets/images/takeover/velvet_vault/boss_dominique_vance/portrait.png"
  },

  boss_victoria_kross: {
    id: "boss_victoria_kross",
    name: "Victoria Kross",
    studioId: "saint_sin",
    age: 41,
    description: "Devout in public, vicious in private. Turns confession into leverage.",
    weakness: "She needs the world to believe she's the savior. Break the illusion.",
    confrontationStyle: "Exposure through confession",
    portraitPath: "assets/images/takeover/saint_sin/boss_victoria_kross/portrait.png"
  }
};
```

### 1.4 Performers Config

Each takeover performer entry includes a `tier` string (`tier1`/`tier2`/`tier3`), a `weaknessType`, and a one-line `archetypeLine` used in the Studio Detail roster UI.

```javascript
CONFIG.takeover.performers = {
  // ═══════════════════════════════════════════
  // NEON CHERRY PERFORMERS
  // ═══════════════════════════════════════════
  
  takeover_mika_sato: {
    id: "takeover_mika_sato",
    name: "Mika Sato",
    studioId: "neon_cherry",
    tier: "tier1",
    starPower: 2,
    weaknessType: "secret",
    description: "The 'pure' idol with a not-so-pure side hustle. Moonlights at a hostess club.",
    portraitPath: "assets/images/takeover/neon_cherry/takeover_mika_sato/portrait.png"
  },

  takeover_pepper_chu: {
    id: "takeover_pepper_chu",
    name: "Pepper Chu",
    studioId: "neon_cherry",
    tier: "tier1",
    starPower: 2,
    weaknessType: "ambition",
    description: "Loud, hungry, wants to be the STAR, not a backup dancer in elf ears.",
    portraitPath: "assets/images/takeover/neon_cherry/takeover_pepper_chu/portrait.png"
  },

  takeover_kira_kimura: {
    id: "takeover_kira_kimura",
    name: "Kira Kimura",
    studioId: "neon_cherry",
    tier: "tier2",
    starPower: 3,
    weaknessType: "neglect",
    description: "Talented but overlooked. Yuki forgot her birthday. She noticed.",
    portraitPath: "assets/images/takeover/neon_cherry/takeover_kira_kimura/portrait.png"
  },

  takeover_suki_avalon: {
    id: "takeover_suki_avalon",
    name: "Suki Avalon",
    studioId: "neon_cherry",
    tier: "tier2",
    starPower: 3,
    weaknessType: "debt",
    description: "Gambling problem. Cute face, ugly spreadsheet. Owes the wrong people.",
    portraitPath: "assets/images/takeover/neon_cherry/takeover_suki_avalon/portrait.png"
  },

  takeover_luna_lux: {
    id: "takeover_luna_lux",
    name: "Luna Lux",
    studioId: "neon_cherry",
    tier: "tier3",
    starPower: 4,
    weaknessType: "pride",
    description: "The veteran of Neon Cherry. Thinks she's the best. Wants to prove it.",
    portraitPath: "assets/images/takeover/neon_cherry/takeover_luna_lux/portrait.png"
  },

  // ═══════════════════════════════════════════
  // HONEY TRAP PERFORMERS
  // ═══════════════════════════════════════════

  takeover_rosa_vega: {
    id: "takeover_rosa_vega",
    name: "Rosa Vega",
    studioId: "honey_trap",
    tier: "tier1",
    starPower: 2,
    weaknessType: "ambition",
    description: "Carmen's 'niece' (not really). Wants OUT of the family shadow.",
    portraitPath: "assets/images/takeover/honey_trap/takeover_rosa_vega/portrait.png"
  },

  takeover_daniela_cruz: {
    id: "takeover_daniela_cruz",
    name: "Daniela Cruz",
    studioId: "honey_trap",
    tier: "tier1",
    starPower: 2,
    weaknessType: "neglect",
    description: "Hard worker, never gets the spotlight. Carmen plays favorites—not her.",
    portraitPath: "assets/images/takeover/honey_trap/takeover_daniela_cruz/portrait.png"
  },

  takeover_valentina_fuentes: {
    id: "takeover_valentina_fuentes",
    name: "Valentina Fuentes",
    studioId: "honey_trap",
    tier: "tier2",
    starPower: 3,
    weaknessType: "debt",
    description: "Bad boyfriend left her with bad credit. Carmen doesn't know how bad.",
    portraitPath: "assets/images/takeover/honey_trap/takeover_valentina_fuentes/portrait.png"
  },

  takeover_marisol_delgado: {
    id: "takeover_marisol_delgado",
    name: "Marisol Delgado",
    studioId: "honey_trap",
    tier: "tier3",
    starPower: 4,
    weaknessType: "pride",
    description: "The golden child. Carmen's favorite. Thinks she's irreplaceable.",
    portraitPath: "assets/images/takeover/honey_trap/takeover_marisol_delgado/portrait.png"
  },

  takeover_sofia_reyes: {
    id: "takeover_sofia_reyes",
    name: "Sofia Reyes",
    studioId: "honey_trap",
    tier: "tier3",
    starPower: 4,
    weaknessType: "secret",
    description: "Carmen's actual niece. Sweet girl. Except for those photos that would DESTROY Carmen.",
    portraitPath: "assets/images/takeover/honey_trap/takeover_sofia_reyes/portrait.png"
  },

  // ═══════════════════════════════════════════
  // MIDNIGHT MEDIA PERFORMERS
  // ═══════════════════════════════════════════

  takeover_raven_darke: {
    id: "takeover_raven_darke",
    name: "Raven Darke",
    studioId: "midnight_media",
    tier: "tier1",
    starPower: 2,
    weaknessType: "ambition",
    description: "Too talented for this 'collective' bullshit. Wants mainstream money.",
    portraitPath: "assets/images/takeover/midnight_media/takeover_raven_darke/portrait.png"
  },

  takeover_zoe_vicious: {
    id: "takeover_zoe_vicious",
    name: "Zoe Vicious",
    studioId: "midnight_media",
    tier: "tier1",
    starPower: 2,
    weaknessType: "neglect",
    description: "Used to be Sasha's favorite. Then Sasha found a new favorite.",
    portraitPath: "assets/images/takeover/midnight_media/takeover_zoe_vicious/portrait.png"
  },

  takeover_jade_holloway: {
    id: "takeover_jade_holloway",
    name: "Jade Holloway",
    studioId: "midnight_media",
    tier: "tier2",
    starPower: 3,
    weaknessType: "debt",
    description: "Studio loans she didn't understand. Sasha owns her contract. You could own her instead.",
    portraitPath: "assets/images/takeover/midnight_media/takeover_jade_holloway/portrait.png"
  },

  takeover_elektra_wylde: {
    id: "takeover_elektra_wylde",
    name: "Elektra Wylde",
    studioId: "midnight_media",
    tier: "tier2",
    starPower: 3,
    weaknessType: "secret",
    description: "Straight-edge 'no drugs' image. Except for the pills she needs more and more.",
    portraitPath: "assets/images/takeover/midnight_media/takeover_elektra_wylde/portrait.png"
  },

  takeover_vex_morrow: {
    id: "takeover_vex_morrow",
    name: "Vex Morrow",
    studioId: "midnight_media",
    tier: "tier3",
    starPower: 4,
    weaknessType: "pride",
    description: "Sasha's current #1. True believer. Would do ANYTHING to prove her devotion.",
    portraitPath: "assets/images/takeover/midnight_media/takeover_vex_morrow/portrait.png"
  },

  // ═══════════════════════════════════════════
  // VELVET LENS PERFORMERS
  // ═══════════════════════════════════════════

  takeover_bianca_morel: {
    id: "takeover_bianca_morel",
    name: "Bianca Morel",
    studioId: "velvet_vault",
    tier: "tier1",
    starPower: 3,
    weaknessType: "ambition",
    description: "Wants to be Dominique. Literally. Would do anything to climb.",
    portraitPath: "assets/images/takeover/velvet_vault/takeover_bianca_morel/portrait.png"
  },

  takeover_chanel_dubois: {
    id: "takeover_chanel_dubois",
    name: "Chanel DuBois",
    studioId: "velvet_vault",
    tier: "tier1",
    starPower: 3,
    weaknessType: "neglect",
    description: "The 'old face' being phased out for newer models. Still has years left. Pissed about it.",
    portraitPath: "assets/images/takeover/velvet_vault/takeover_chanel_dubois/portrait.png"
  },

  takeover_natasha_kaine: {
    id: "takeover_natasha_kaine",
    name: "Natasha Kaine",
    studioId: "velvet_vault",
    tier: "tier2",
    starPower: 4,
    weaknessType: "debt",
    description: "Rich girl cosplay—actually broke. Keeps up appearances on credit cards.",
    portraitPath: "assets/images/takeover/velvet_vault/takeover_natasha_kaine/portrait.png"
  },

  takeover_serena_lake: {
    id: "takeover_serena_lake",
    name: "Serena Lake",
    studioId: "velvet_vault",
    tier: "tier3",
    starPower: 4,
    weaknessType: "secret",
    description: "She's the one sleeping with Dominique's husband. She doesn't know you know. Yet.",
    portraitPath: "assets/images/takeover/velvet_vault/takeover_serena_lake/portrait.png"
  },

  takeover_isabelle_fontaine: {
    id: "takeover_isabelle_fontaine",
    name: "Isabelle Fontaine",
    studioId: "velvet_vault",
    tier: "tier3",
    starPower: 5,
    weaknessType: "pride",
    description: "THE star. Magazine covers, brand deals. Terrified someone will realize she's not as smart as she looks.",
    portraitPath: "assets/images/takeover/velvet_vault/takeover_isabelle_fontaine/portrait.png"
  },

  // ═══════════════════════════════════════════
  // BLACK LACE PERFORMERS
  // ═══════════════════════════════════════════

  takeover_scarlet_obrien: {
    id: "takeover_scarlet_obrien",
    name: "Scarlet O'Brien",
    studioId: "saint_sin",
    tier: "tier1",
    starPower: 3,
    weaknessType: "ambition",
    description: "Wants to be the next Victoria. Willing to go through YOU to get there.",
    portraitPath: "assets/images/takeover/saint_sin/takeover_scarlet_obrien/portrait.png"
  },

  takeover_mistress_ivy: {
    id: "takeover_mistress_ivy",
    name: "Mistress Ivy",
    studioId: "saint_sin",
    tier: "tier1",
    starPower: 3,
    weaknessType: "neglect",
    description: "Senior performer. Victoria's taking her for granted. She's noticed.",
    portraitPath: "assets/images/takeover/saint_sin/takeover_mistress_ivy/portrait.png"
  },

  takeover_delilah_thorn: {
    id: "takeover_delilah_thorn",
    name: "Delilah Thorn",
    studioId: "saint_sin",
    tier: "tier2",
    starPower: 4,
    weaknessType: "debt",
    description: "Expensive tastes. Borrowed from Victoria personally. Now she's trapped.",
    portraitPath: "assets/images/takeover/saint_sin/takeover_delilah_thorn/portrait.png"
  },

  takeover_anastasia_devereux: {
    id: "takeover_anastasia_devereux",
    name: "Anastasia Devereux",
    studioId: "saint_sin",
    tier: "tier2",
    starPower: 4,
    weaknessType: "secret",
    description: "Vanilla. Completely vanilla in her personal life. The 'hardcore domme' watches rom-coms.",
    portraitPath: "assets/images/takeover/saint_sin/takeover_anastasia_devereux/portrait.png"
  },

  takeover_lilith_kane: {
    id: "takeover_lilith_kane",
    name: "Lilith Kane",
    studioId: "saint_sin",
    tier: "tier3",
    starPower: 5,
    weaknessType: "pride",
    description: "Victoria's heir apparent. Would kneel for Victoria forever—but she'll never be #1 while Victoria's around.",
    portraitPath: "assets/images/takeover/saint_sin/takeover_lilith_kane/portrait.png"
  }
};

// Helper: Get performer IDs by tier
CONFIG.takeover.getPerformersByTier = function(tier) {
  return Object.values(CONFIG.takeover.performers)
    .filter(p => p.tier === tier)
    .map(p => p.id);
};
```

---

## 2. GameState Extensions

### 2.1 Takeover State Object

Add to `gameState`:

```javascript
gameState.takeover = {
  // System status
  unlocked: false,
  unlockedDay: null,
  victory: {
    achieved: false,
    achievedDay: null,
    modalShown: false
  },

  // Studio tracking
  studios: {
    // Per-studio state
    neon_cherry: {
      status: "active",        // "active" | "vulnerable" | "defeated"
      defeatedDay: null,
      bossConfrontation: null  // null or confrontation progress object
    },
    honey_trap: { status: "active", defeatedDay: null, bossConfrontation: null },
    midnight_media: { status: "active", defeatedDay: null, bossConfrontation: null },
    velvet_vault: { status: "active", defeatedDay: null, bossConfrontation: null },
    saint_sin: { status: "active", defeatedDay: null, bossConfrontation: null }
  },

  // Performer acquisition tracking
  performers: {
    // Per-performer state (backfilled on load)
    // Example:
    // "takeover_mika_sato": {
    //   id: "takeover_mika_sato",
    //   studioId: "neon_cherry",
    //   status: "in_progress",   // "locked" | "available" | "in_progress" | "acquired" | "lost"
    //   tier: "tier1",
    //   weaknessType: "secret",
    //   currentStage: "intel",   // "intel" | "approach" | "turn" | "debut"
    //   stageStartDay: 185,
    //   stageCompleteDay: 187,
    //   stageReady: false,
    //   attemptCount: 1,
    //   nextAvailableDay: 0,
    //   lastOutcome: null        // "aborted" | "failed" | "completed"
    // }
  },

  // Boss confrontation tracking (separate for clarity)
  bossConfrontations: {
    // Example:
    // "boss_yuki_tanaka": {
    //   status: "in_progress",  // "locked" | "vulnerable" | "in_progress" | "defeated"
    //   currentStage: 3,        // 1-5
    //   stageStartDay: 200,
    //   stageCompleteDay: 202,
    //   defeatedDay: null
    // }
  },

  // Gallery unlocks
  gallery: {
    performers: [],  // Array of performer IDs with unlocked content
    bosses: []       // Array of boss IDs with unlocked content
  },

  // Retaliation tracking
  retaliation: {
    nextPoachDay: null,   // Next eligible day for a poach attempt
    pending: null,        // Active poach attempt payload (if any)
    lastResolvedDay: null,
    totalAttempts: 0,
    totalLosses: 0,
    totalDefenses: 0
  },

  // Statistics
  stats: {
    totalSpent: 0,
    performersAcquired: 0,
    performersLost: 0,
    performersReacquired: 0,
    studiosDefeated: 0,
    bossesDefeated: 0,
    poachAttemptsDefended: 0,
    poachAttemptsLost: 0
  }
};
```

### 2.2 Default State Generator

```javascript
function getDefaultTakeoverState() {
  return {
    unlocked: false,
    unlockedDay: null,
    victory: {
      achieved: false,
      achievedDay: null,
      modalShown: false
    },
    studios: {
      neon_cherry: { status: "active", defeatedDay: null, bossConfrontation: null },
      honey_trap: { status: "active", defeatedDay: null, bossConfrontation: null },
      midnight_media: { status: "active", defeatedDay: null, bossConfrontation: null },
      velvet_vault: { status: "active", defeatedDay: null, bossConfrontation: null },
      saint_sin: { status: "active", defeatedDay: null, bossConfrontation: null }
    },
    performers: {},
    bossConfrontations: {},
    gallery: {
      bosses: {},
      trophies: {},
      notes: []
    },
    retaliation: {
      nextPoachDay: null,
      pending: null,
      lastResolvedDay: null,
      totalAttempts: 0,
      totalLosses: 0,
      totalDefenses: 0
    },
    stats: {
      totalSpent: 0,
      performersAcquired: 0,
      performersLost: 0,
      performersReacquired: 0,
      studiosDefeated: 0,
      bossesDefeated: 0,
      poachAttemptsDefended: 0,
      poachAttemptsLost: 0
    }
  };
}
```

### 2.3 Roster Integration

When a performer is acquired, they are added to `gameState.roster.performers`:

```javascript
// Acquired takeover performer added to roster
{
  id: "takeover_mika_sato",
  name: "Mika Sato",
  type: "act2",               // Uses standard contract rules
  starPower: 2,
  starPowerShoots: 0,
  portraitPath: "assets/images/takeover/neon_cherry/takeover_mika_sato/portrait.png",
  fatigue: 0,
  loyalty: 50                 // Starts at 50
}
```

---

## 3. Content Data Structure

### 3.1 Acquisition Content

Each performer has narrative content for their acquisition arc. Store in `CONFIG.takeover.content.performers`:

Stage images are resolved by convention using the performer and studio IDs:
`assets/images/takeover/<studioId>/<performerId>/<stage>_<n>.png` where `n=1..5` (UI caps at 5 and falls back to the placeholder portrait when missing).

```javascript
CONFIG.takeover.content = {
  performers: {
    takeover_mika_sato: {
      // Stage 1: Intel
      intel: {
        preText: "Dig into Mika's background. Squeaky clean online... but your contacts mention she's been seen somewhere she shouldn't be.",
        completeText: "WEAKNESS IDENTIFIED: Secret\n\nShe moonlights at a hostess club her boss doesn't know about. The 'pure' idol isn't so pure after all.",
        images: {
          portrait: "portrait.png"
        }
      },

      // Stage 2: Approach
      approach: {
        scenes: [
          {
            image: "approach_01.png",
            text: "You show up at the club. She freezes when she sees you. You smile. Buy her a drink. Let her wonder how much you know."
          },
          {
            image: "approach_02.png",
            text: "\"Yuki doesn't know you're here, does she?\"\n\nShe doesn't answer. She doesn't have to."
          }
        ],
        completeText: "She's scared. But she's also curious. Time to make your move."
      },

      // Stage 3: Turn
      turn: {
        introText: "Time to close the deal. She has a secret. You have leverage.",
        scenes: [
          {
            image: "turn_01.png",
            text: "You lay it out. You could tell Yuki. You could tell everyone."
          },
          {
            image: "turn_02.png",
            text: "\"Or...\"\n\nYou let the word hang."
          },
          {
            image: "turn_03.png",
            text: "\"Work for me. Privately. Prove you're worth protecting.\""
          },
          {
            image: "turn_04.png",
            text: "She hesitates. You wait."
          },
          {
            image: "turn_05.png",
            text: "Then she locks the door."
          },
          {
            image: "turn_06.png",
            text: "What happens next stays between you."
          },
          {
            image: "turn_07.png",
            text: "She gives you everything you wanted."
          },
          {
            image: "turn_08.png",
            text: "And some things you didn't know you wanted."
          }
        ],
        completeText: "She's yours now. Mika Sato has agreed to leave Neon Cherry."
      },

      // Stage 4: Debut
      debut: {
        introText: "Her first official shoot under your banner.",
        scenes: [
          {
            image: "debut_01.png",
            text: "First day at the new studio. She's nervous but determined."
          },
          {
            image: "debut_02.png",
            text: "The camera loves her. It always did."
          },
          {
            image: "debut_03.png",
            text: "But now she's not hiding anything."
          },
          {
            image: "debut_04.png",
            text: "This is who she really is."
          },
          {
            image: "debut_05.png",
            text: "And she's yours."
          }
        ],
        completeText: "MIKA SATO has joined your roster.\n\n✓ Available for booking\n✓ Takeover gallery updated\n✓ Neon Cherry weakened"
      }
    },

    // ... similar structure for all 25 performers
  },

  bosses: {
    boss_yuki_tanaka: {
      summons: {
        text: "She calls. Her voice is tight. Controlled panic.\n\n\"We need to talk. Just us. Neutral ground.\"\n\nYou both know that's a lie.",
        images: ["confrontation_01.png", "confrontation_02.png"]
      },
      negotiation: {
        text: "\"A partnership,\" she offers. Hands shaking around her coffee cup. \"I know things. I have connections. We could—\"\n\nYou let her finish. Then you smile.\n\n\"No.\"",
        images: ["confrontation_03.png", "confrontation_04.png"]
      },
      powerPlay: {
        text: "She tries threats next. Industry contacts. Legal angles. A desperate bluff about content she doesn't have.\n\nNone of it lands. You're too big now. She's too small.",
        images: ["confrontation_05.png", "confrontation_06.png"]
      },
      fall: {
        text: "You see it in her eyes. The moment she realizes.\n\nShe's not negotiating anymore.\n\nShe's surrendering.",
        images: ["confrontation_07.png", "confrontation_08.png"]
      },
      terms: {
        introText: "The terms are yours to dictate.",
        scenes: [
          { image: "confrontation_09.png", text: "She wanted to be taken seriously." },
          { image: "confrontation_10.png", text: "Now she is." }
        ],
        completeText: "NEON CHERRY — ACQUIRED\n\nYuki Tanaka has submitted. Her studio is yours.\n\n✓ All remaining performers acquired\n✓ Boss collection entry unlocked\n✓ +10% cosplay content bonus"
      }
    },

    // ... similar structure for all 5 bosses
  }
};
```

---

## 4. Asset Directory Structure

```
assets/
  images/
    takeover/
      neon_cherry/
        studio_logo.png
        boss_yuki_tanaka/
          portrait.png
          confrontation_01.png
          confrontation_02.png
          confrontation_03.png
          confrontation_04.png
          confrontation_05.png
          confrontation_06.png
          confrontation_07.png
          confrontation_08.png
          confrontation_09.png
          confrontation_10.png
        mika_sato/
          portrait.png
          approach_01.png
          approach_02.png
          turn_01.png
          turn_02.png
          turn_03.png
          turn_04.png
          turn_05.png
          turn_06.png
          turn_07.png
          turn_08.png
          debut_01.png
          debut_02.png
          debut_03.png
          debut_04.png
          debut_05.png
        pepper_chu/
          [same structure]
        kira_kimura/
          [same structure]
        suki_avalon/
          [same structure]
        luna_lux/
          [same structure]
      
      honey_trap/
        [same structure]
      
      midnight_media/
        [same structure]
      
      velvet_vault/
        [same structure]
      
      saint_sin/
        [same structure]
      
      ui/
        victory_artwork.png
        locked_portrait_silhouette.png
```

---

## 5. Save/Load Considerations

### Migration from v3 to v4

When loading a v3 save into v4 (with Takeover):

```javascript
function migrateV3toV4(saveData) {
  // Add takeover state with defaults
  if (!saveData.takeover) {
    saveData.takeover = getDefaultTakeoverState();
    
    // Check if player already past Day 181
    if (saveData.player.day >= 181) {
      saveData.takeover.unlocked = true;
      saveData.takeover.unlockedDay = 181;
    }
  }
  
  saveData.version = 4;
  return saveData;
}
```

### Validation Rules

```javascript
function validateTakeoverState(state) {
  const required = ['unlocked', 'studios', 'performers', 'gallery', 'stats'];
  for (const key of required) {
    if (!(key in state.takeover)) return false;
  }
  
  // Validate studio IDs
  const validStudios = Object.keys(CONFIG.takeover.studios);
  for (const id of Object.keys(state.takeover.studios)) {
    if (!validStudios.includes(id)) return false;
  }
  
  return true;
}
```
