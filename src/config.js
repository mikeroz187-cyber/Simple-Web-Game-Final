/*
 * Studio Empire Config
 * Mirrors config.toml values plus MVP data catalogs.
 */
const SHOOT_OUTPUT_PLACEHOLDER_SVG = [
  "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"96\" height=\"96\" viewBox=\"0 0 96 96\">",
  "<rect width=\"96\" height=\"96\" fill=\"#eef1f6\"/>",
  "<circle cx=\"48\" cy=\"38\" r=\"18\" fill=\"#c3cad6\"/>",
  "<rect x=\"20\" y=\"62\" width=\"56\" height=\"22\" rx=\"10\" fill=\"#c3cad6\"/>",
  "</svg>"
].join("");

const LOCATION_PLACEHOLDER_THUMB_PATH = "assets/images/placeholders/location_placeholder.svg";
const SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH = "data:image/svg+xml;utf8," + encodeURIComponent(SHOOT_OUTPUT_PLACEHOLDER_SVG);
const CONQUEST_THRESHOLDS = {
  assistant: {
    reputation: { tier1: 3, tier2: 10 },
    followers: { tier1: 300, tier2: 1200 },
    onlyFansSubscribers: { tier3: 150, tier4: 400 },
    netWorth: { tier3: 25000, tier4: 80000 }
  },
  talentscout: {
    recruits: { stage1: 1, stage2: 2, stage3: 3, stage4: 4 },
    reputation: { tier1: 6, tier3: 22 },
    followers: { tier2: 1500 },
    milestones: { stage3: 2 }
  },
  saleswoman: {
    upgrades: { stage1: 1, stage2: 2, stage3: 4, stage4: 6 },
    shopSpend: { stage2: 1200 }
  }
};

function buildPlaceholderImagePaths(count, path) {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const resolvedPath = path || "";
  return Array.from({ length: safeCount }, function () {
    return resolvedPath;
  });
}

const AUTOMATION_AUTO_BOOK_ENABLED_DEFAULT = false;
const AUTOMATION_AUTO_BOOK_PER_DAY = 1;
const ACT2_STAFFING_PUSH_CONFIG = {
  warningDay: 120,
  checkOnEnteringDay: 121,
  requiredActiveContracted: 7,
  haloStarDelta: 1,
  penalty: {
    crisisOverheadPerDay: 75,
    crisisBookingCostPerShoot: 200
  },
  recruitForceUnlock: {
    firstWaveDay: 90,
    secondWaveDay: 105
  }
};

const CONFIG = {
  project: {
    name: "Studio Empire",
    repo_slug: "studio-empire",
    version: "0.1.0",
    stage: "MVP",
    author: "Repo Owner",
    license: "UNLICENSED"
  },
  meta: {
    configVersion: 1
  },
  build: {
    runtime: "static",
    entry_html: "index.html",
    main_js: "src/main.js",
    stylesheet: "styles.css"
  },
  app: {
    desktop_only: true,
    single_page_app: true,
    no_backend: true,
    no_database: true,
    no_frameworks: true
  },
  AUTOMATION_AUTO_BOOK_ENABLED_DEFAULT: AUTOMATION_AUTO_BOOK_ENABLED_DEFAULT,
  AUTOMATION_AUTO_BOOK_PER_DAY: AUTOMATION_AUTO_BOOK_PER_DAY,
  automation: {
    enabledDefault: false,
    autoBookDefault: AUTOMATION_AUTO_BOOK_ENABLED_DEFAULT,
    autoPostDefault: false,
    maxActionsPerDay: 1,
    minCashReserve: 0,
    actionPriority: ["autoBook", "autoPost"],
    autoPostPlatformPriority: ["Instagram", "X"]
  },
  SHOOT_OUTPUTS_MAX_HISTORY: 50,
  LOCATION_PLACEHOLDER_THUMB_PATH: LOCATION_PLACEHOLDER_THUMB_PATH,
  SHOOT_OUTPUT_PLACEHOLDER_THUMB_PATH: "data:image/svg+xml;utf8," + encodeURIComponent(SHOOT_OUTPUT_PLACEHOLDER_SVG),
  SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH: SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH,
  save: {
    localstorage_key: "studio_empire_save",
    autosave_enabled: true,
    autosave_interval_seconds: 10,
    save_schema_version: 5,
    default_slot_id: "slot_1",
    autosave_slot_id: "autosave",
    slots: [
      { id: "slot_1", label: "Slot 1" },
      { id: "slot_2", label: "Slot 2" },
      { id: "slot_3", label: "Slot 3" },
      { id: "autosave", label: "Autosave" }
    ],
    export_file_prefix: "studio-empire-save",
    export_file_extension: "json"
  },
  ui: {
    default_font_family: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    base_font_size_px: 14,
    panel_gap_px: 12,
    main_padding_px: 16,
    story_log_preview_length: 120,
    recruitModal: {
      modalMaxHeightVh: 80,
      modalMaxWidthPx: 1100,
      modalMaxWidthVw: 92,
      imageMaxHeightVh: 55
    }
  },
  ambientArt: {
    enabled: true,
    mascots: {
      assistant: {
        id: "assistant",
        name: "The Assistant",
        poses: {
          welcome: { path: "assets/images/mascots/assistant_welcome.png", label: "Welcome" },
          concerned: { path: "assets/images/mascots/assistant_concerned.png", label: "Concerned" },
          celebratory: { path: "assets/images/mascots/assistant_celebratory.png", label: "Celebratory" },
          presenting: { path: "assets/images/mascots/assistant_presenting.png", label: "Presenting" },
          reflective: { path: "assets/images/mascots/assistant_reflective.png", label: "Reflective" }
        }
      },
      producer: {
        id: "producer",
        name: "The Producer",
        poses: {
          ready: { path: "assets/images/mascots/producer_ready.png", label: "Ready" },
          thumbsUp: { path: "assets/images/mascots/producer_thumbsup.png", label: "Thumbs Up" },
          admiring: { path: "assets/images/mascots/producer_admiring.png", label: "Admiring" }
        }
      },
      talentScout: {
        id: "talentScout",
        name: "The Talent Scout",
        poses: {
          introducing: { path: "assets/images/mascots/talentscout_introducing.png", label: "Introducing" },
          impressed: { path: "assets/images/mascots/talentscout_impressed.png", label: "Impressed" },
          phone: { path: "assets/images/mascots/talentscout_phone.png", label: "On Phone" }
        }
      },
      saleswoman: {
        id: "saleswoman",
        name: "The Saleswoman",
        poses: {
          welcoming: { path: "assets/images/mascots/saleswoman_welcoming.png", label: "Welcoming" },
          presenting: { path: "assets/images/mascots/saleswoman_presenting.png", label: "Presenting" },
          sold: { path: "assets/images/mascots/saleswoman_sold.png", label: "Sold!" }
        }
      }
    },
    backgrounds: {
      hub: { path: "assets/images/backgrounds/bg_hub.png" },
      booking: { path: "assets/images/backgrounds/bg_booking.png" },
      gallery: { path: "assets/images/backgrounds/bg_gallery.png" },
      roster: { path: "assets/images/backgrounds/bg_roster.png" },
      recruitment: { path: "assets/images/backgrounds/bg_recruitment.png" },
      analytics: { path: "assets/images/backgrounds/bg_analytics.png" },
      shop: { path: "assets/images/backgrounds/bg_shop.png" },
      social: { path: "assets/images/backgrounds/bg_social.png" },
      storyLog: { path: "assets/images/backgrounds/bg_storylog.png" }
    },
    screenMascots: {
      hub: { character: "assistant", defaultPose: "welcome" },
      booking: { character: "producer", defaultPose: "ready" },
      gallery: { character: "producer", defaultPose: "admiring" },
      roster: null,
      recruitment: { character: "talentScout", defaultPose: "introducing" },
      analytics: { character: "assistant", defaultPose: "presenting" },
      shop: { character: "saleswoman", defaultPose: "welcoming" },
      social: { character: "talentScout", defaultPose: "phone" },
      storyLog: { character: "assistant", defaultPose: "reflective" }
    }
  },
  debug: {
    enabled: true,
    queryParam: "debug",
    queryValue: "1",
    minDay: 1,
    maxDay: 9999
  },
  game: {
    starting_day: 1,
    action_day_max: 90,
    max_day: 270,
    starting_cash: 5000,
    loan_principal: 5000,
    loan_total_due: 25000,
    debt_due_day: 90,
    shoots_per_day: 5
  },
  economy: {
    promo_followers_gain: 115,
    premium_base_of_subs: 23,
    subscriber_conversion_rate: 0.01,
    starPowerExponent: 1.15,
    starPowerCost: {
      enabled: true,
      threshold: 6,
      multipliers: {
        7: 1.1,
        8: 1.2,
        9: 1.35,
        10: 1.5
      },
      defaultMultiplier: 1.0
    },
    base_shoot_cost: 100,
    contentTypeCostMult: {
      promo: 1.0,
      premium: 1.6
    },
    debtPayment: {
      enabled: true,
      quickAmounts: [500, 1000, 2500],
      minPayment: 100,
      allowMax: true,
      confirmForPaymentsAbove: 5000
    },
    cashflow: {
      ofNetMonthlyPerSub: 20,
      daysPerMonth: 30,
      enableDailyOfPayout: true,
      enableDailyOverhead: true,
      overheadTiers: [
        { minSubs: 0, dailyOverhead: 0, label: "Shoestring" },
        { minSubs: 50, dailyOverhead: 8, label: "Scrappy" },
        { minSubs: 100, dailyOverhead: 20, label: "Growing" },
        { minSubs: 200, dailyOverhead: 60, label: "Scaling" },
        { minSubs: 350, dailyOverhead: 100, label: "Busy" },
        { minSubs: 500, dailyOverhead: 150, label: "Big League" },
        { minSubs: 750, dailyOverhead: 210, label: "Enterprise" },
        { minSubs: 1000, dailyOverhead: 270, label: "Machine" }
      ]
    },
    netWorth: {
      enabled: true,
      valuationMultiple: 12,
      label: "Net Worth"
    }
  },
  onlyfans: {
    pricePerMonth: 10,
    daysPerMonth: 30
  },
  conversion: {
    promo: {
      followersToOF: 0.0001,
      socialSubsToOF: 0.04
    },
    premium: {
      ofSubsMultiplier: 1.25
    }
  },
  market: {
    competition: {
      enabled: true,
      unlockAfterDebt: true,
      unlockMessageId: "act2_competition_unlocked",
      weeklyCheckCadenceDays: 7,
      storyLogEnabled: true,
      rivals: [
        {
          id: "rival_night_slate",
          name: "Night Slate Media",
          baseReputationScore: 55,
          weeklyGrowthRate: 1.2
        },
        {
          id: "rival_luxe_pixel",
          name: "Luxe Pixel Studios",
          baseReputationScore: 48,
          weeklyGrowthRate: 0.9
        }
      ],
      marketShifts: {
        shift_promo_cooldown: {
          name: "Promo Cooldown",
          startDay: 190,
          endDay: 205,
          multipliers: {
            promoFollowerMult: 0.95,
            premiumOfSubsMult: 1
          }
        },
        shift_premium_bump: {
          name: "Premium Bump",
          startDay: 220,
          endDay: 235,
          multipliers: {
            promoFollowerMult: 1,
            premiumOfSubsMult: 1.08
          }
        }
      }
    },
    saturation: {
      enabledAfterDebt: true,
      unlockMessageId: "act2_saturation_activated",
      defaultMult: 1,
      tiers: [
        { min: 0, max: 99, mult: 1, label: "0–99 subs tier" },
        { min: 100, max: 199, mult: 0.95, label: "100–199 subs tier" },
        { min: 200, max: 349, mult: 0.9, label: "200–349 subs tier" },
        { min: 350, max: 499, mult: 0.85, label: "350–499 subs tier" },
        { min: 500, max: 699, mult: 0.8, label: "500–699 subs tier" },
        { min: 700, max: 999, mult: 0.75, label: "700–999 subs tier" },
        { min: 1000, max: null, mult: 0.7, label: "1000+ subs tier" }
      ]
    },
    socialFootprintBonus: {
      enabled: true,
      source: "socialFollowers",
      perFollowers: 1000,
      bonusPerUnit: 0.01,
      maxBonusMult: 1.15,
      minFollowersToStart: 0,
      label: "Social bonus"
    }
  },
  takeover: {
    enabled: true,
    unlockDay: 181,
    rosterCapAfterUnlock: 40,
    placeholderPortraitPath: LOCATION_PLACEHOLDER_THUMB_PATH,
    daysPerStage: 2,
    bossConfrontationStages: 5,
    boss: {
      cost: 150000,
      stages: ["summons", "negotiation", "power_play", "fall", "terms"],
      daysPerStage: 2,
      requiredReputation: 100,
      repRewardOnDefeat: 25
    },
    repRequirements: {
      tier1: 30,
      tier2: 50,
      tier3: 75,
      boss: 100
    },
    costs: {
      intel: 5000,
      approach: 10000,
      turn: 25000,
      debut: 5000,
      bossConfrontation: 150000
    },
    tierMultipliers: {
      tier1: 1.0,
      tier2: 1.5,
      tier3: 2.0
    },
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
    repDefense: {
      strong: 100,
      normal: 75,
      vulnerable: 50,
      weak: 25,
      crisis: 10
    },
    retaliation: {
      minDaysBetweenEvents: 7,
      maxDaysBetweenEvents: 14,
      poachDefenseCost: 25000,
      poachRepPenaltyOnLoss: -10,
      lostCooldownDays: 14,
      poachBaseCost: 8000,
      poachCostPerStarPower: 2000,
      allianceDurationDays: 14,
      allianceCostMultiplier: 1.25
    },
    performersToVulnerableBoss: 3,
    studios: {
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
    },
    studioOrder: [
      "neon_cherry",
      "honey_trap",
      "midnight_media",
      "velvet_vault",
      "saint_sin"
    ],
    bosses: {
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
    },
    performers: {
      takeover_mika_sato: {
        id: "takeover_mika_sato",
        name: "Mika Sato",
        studioId: "neon_cherry",
        tier: "tier1",
        starPower: 2,
        weaknessType: "secret",
        archetypeLine: "Idol sweet on camera, filthy off it, terrified the wrong clip leaks.",
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
        archetypeLine: "Loud, hungry, and dying to be the face instead of the background noise.",
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
        archetypeLine: "Ignored and simmering, she'll crawl to anyone who actually looks at her.",
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
        archetypeLine: "Cute face, ugly balance sheet, and a panic she can't hide.",
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
        archetypeLine: "She thinks she's untouchable, and she needs you to prove she's wrong.",
        description: "The veteran of Neon Cherry. Thinks she's the best. Wants to prove it.",
        portraitPath: "assets/images/takeover/neon_cherry/takeover_luna_lux/portrait.png"
      },
      takeover_rosa_vega: {
        id: "takeover_rosa_vega",
        name: "Rosa Vega",
        studioId: "honey_trap",
        tier: "tier1",
        starPower: 2,
        weaknessType: "ambition",
        archetypeLine: "Done being the 'niece'—she wants her own spotlight and she'll trade for it.",
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
        archetypeLine: "Always the sidekick, always ignored, ready to be chosen by anyone.",
        description: "Always the sidekick. She's ready for a studio that notices her.",
        portraitPath: "assets/images/takeover/honey_trap/takeover_daniela_cruz/portrait.png"
      },
      takeover_valentina_fuentes: {
        id: "takeover_valentina_fuentes",
        name: "Valentina Fuentes",
        studioId: "honey_trap",
        tier: "tier2",
        starPower: 3,
        weaknessType: "debt",
        archetypeLine: "Her debt clock is ticking, and she'll sign anything that stops it.",
        description: "In debt to a cartel-adjacent moneylender. She's desperate.",
        portraitPath: "assets/images/takeover/honey_trap/takeover_valentina_fuentes/portrait.png"
      },
      takeover_marisol_delgado: {
        id: "takeover_marisol_delgado",
        name: "Marisol Delgado",
        studioId: "honey_trap",
        tier: "tier2",
        starPower: 3,
        weaknessType: "secret",
        archetypeLine: "She's hiding a kid and will do anything to keep it quiet.",
        description: "She's hiding a kid from the whole industry. One slip could ruin her.",
        portraitPath: "assets/images/takeover/honey_trap/takeover_marisol_delgado/portrait.png"
      },
      takeover_sofia_reyes: {
        id: "takeover_sofia_reyes",
        name: "Sofia Reyes",
        studioId: "honey_trap",
        tier: "tier3",
        starPower: 4,
        weaknessType: "pride",
        archetypeLine: "Queen bee who only bends when the throne is on the line.",
        description: "The queen bee. Needs to be worshipped. You can give her that.",
        portraitPath: "assets/images/takeover/honey_trap/takeover_sofia_reyes/portrait.png"
      },
      takeover_raven_darke: {
        id: "takeover_raven_darke",
        name: "Raven Darke",
        studioId: "midnight_media",
        tier: "tier1",
        starPower: 2,
        weaknessType: "secret",
        archetypeLine: "All spikes and leather, secretly soft enough to blackmail.",
        description: "Pierced everywhere, but secretly a softie. Hides it with spikes.",
        portraitPath: "assets/images/takeover/midnight_media/takeover_raven_darke/portrait.png"
      },
      takeover_zoe_vicious: {
        id: "takeover_zoe_vicious",
        name: "Zoe Vicious",
        studioId: "midnight_media",
        tier: "tier1",
        starPower: 2,
        weaknessType: "ambition",
        archetypeLine: "Fame-hungry and loyal to whoever gets her there fastest.",
        description: "Wants fame so badly she can taste it. Loyal to no one.",
        portraitPath: "assets/images/takeover/midnight_media/takeover_zoe_vicious/portrait.png"
      },
      takeover_jade_holloway: {
        id: "takeover_jade_holloway",
        name: "Jade Holloway",
        studioId: "midnight_media",
        tier: "tier2",
        starPower: 3,
        weaknessType: "neglect",
        archetypeLine: "Overlooked and bitter, she'd sell out just to be seen.",
        description: "Never promoted, never spotlighted. Her resentment is boiling.",
        portraitPath: "assets/images/takeover/midnight_media/takeover_jade_holloway/portrait.png"
      },
      takeover_elektra_wylde: {
        id: "takeover_elektra_wylde",
        name: "Elektra Wylde",
        studioId: "midnight_media",
        tier: "tier2",
        starPower: 3,
        weaknessType: "debt",
        archetypeLine: "Crypto-burned and broke, looking for a savior with a leash.",
        description: "She threw her money into a failed crypto scheme. She needs a bailout.",
        portraitPath: "assets/images/takeover/midnight_media/takeover_elektra_wylde/portrait.png"
      },
      takeover_vex_morrow: {
        id: "takeover_vex_morrow",
        name: "Vex Morrow",
        studioId: "midnight_media",
        tier: "tier3",
        starPower: 4,
        weaknessType: "pride",
        archetypeLine: "Too cool for everyone until you make it a challenge.",
        description: "Punk icon, too cool for everyone. Except you. Maybe.",
        portraitPath: "assets/images/takeover/midnight_media/takeover_vex_morrow/portrait.png"
      },
      takeover_bianca_morel: {
        id: "takeover_bianca_morel",
        name: "Bianca Morel",
        studioId: "velvet_vault",
        tier: "tier1",
        starPower: 3,
        weaknessType: "ambition",
        archetypeLine: "Climbing the luxury ladder one signature at a time.",
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
        archetypeLine: "Luxury's old favorite, itching to be chosen again.",
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
        archetypeLine: "Designer tastes, discount bankroll, and a balance sheet full of secrets.",
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
        archetypeLine: "A velvet smile hiding a scandal you can cash in.",
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
        archetypeLine: "The queen of couture, terrified her crown is costume jewelry.",
        description: "THE star. Magazine covers, brand deals. Terrified someone will realize she's not as smart as she looks.",
        portraitPath: "assets/images/takeover/velvet_vault/takeover_isabelle_fontaine/portrait.png"
      },
      takeover_scarlet_obrien: {
        id: "takeover_scarlet_obrien",
        name: "Scarlet O'Brien",
        studioId: "saint_sin",
        tier: "tier1",
        starPower: 3,
        weaknessType: "ambition",
        archetypeLine: "Confessional darling who wants the pulpit all to herself.",
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
        archetypeLine: "A faithful enforcer who's tired of being left at the altar.",
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
        archetypeLine: "Luxury penitent with a debt ledger you can turn into a leash.",
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
        archetypeLine: "Holier-than-thou on camera, soft as lace in private.",
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
        archetypeLine: "The heir who kneels only to sharpen her claim.",
        description: "Victoria's heir apparent. Would kneel for Victoria forever—but she'll never be #1 while Victoria's around.",
        portraitPath: "assets/images/takeover/saint_sin/takeover_lilith_kane/portrait.png"
      }
    }
  },
  reputation: {
    branches: [
      {
        id: "prestige",
        label: "Prestige",
        requiredReputation: 60,
        ofSubsMult: 1.10,
        followersMult: 0.95,
        blurb: "High-end brand. More OF subs per premium, slightly less reach."
      },
      {
        id: "volume",
        label: "Volume",
        requiredReputation: 60,
        ofSubsMult: 0.95,
        followersMult: 1.10,
        blurb: "Chase reach. More followers, slightly less premium OF subs."
      },
      {
        id: "boutique",
        label: "Boutique",
        requiredReputation: 60,
        ofSubsMult: 1.05,
        followersMult: 1.05,
        blurb: "Balanced refinement. Slight boost to both."
      }
    ],
    selectionStartDay: 181
  },
  booking: {
    combo: {
      enabled: false,
      costMultiplier: 1.6,
      fatigueMultiplierEach: 0.85
    }
  },
  performers: {
    core_count: 3,
    freelance_count: 5,
    default_star_power: 1,
    default_max_bookings_per_day: 1,
    max_daily_bookings_cap: 3,
    max_fatigue: 100,
    fatigue_per_shoot: 10,
    fatigue_recovery_per_day: 5,
    starting_loyalty: 50,
    starPowerProgression: {
      enabled: true,
      shootsPerIncrease: 5,
      maxStarPower: 10
    },
    core_ids: [
      "core_lena_watts",
      "core_milo_park",
      "core_tess_rowan"
    ],
    freelance_ids: [
      "free_jade_voss",
      "free_nico_blade",
      "free_rin_holt",
      "free_kira_sol",
      "free_eli_hart"
    ],
    act2_ids: [
      "act2_ivy_glaze",
      "act2_dex_marion",
      "act2_sable_quinn",
      "act2_joel_riggs"
    ],
    catalog: {
      core_lena_watts: {
        id: "core_lena_watts",
        name: "Kendra Lynn",
        type: "core",
        starPower: 3,
        description: "Polished lead with calm authority and a steady fanbase."
      },
      core_milo_park: {
        id: "core_milo_park",
        name: "Abella Banks",
        type: "core",
        starPower: 2,
        description: "Warm, versatile collaborator who fits any concept."
      },
      core_tess_rowan: {
        id: "core_tess_rowan",
        name: "Jessie Star",
        type: "core",
        starPower: 1,
        description: "Scrappy newcomer with raw energy and room to grow."
      },
      free_jade_voss: {
        id: "free_jade_voss",
        name: "Candy Blaze",
        type: "freelance",
        starPower: 3,
        description: "Seasoned pro who delivers instantly but keeps it professional."
      },
      free_nico_blade: {
        id: "free_nico_blade",
        name: "Skye Ryder",
        type: "freelance",
        starPower: 2,
        description: "Flashy specialist known for bold aesthetics and fast turnarounds."
      },
      free_rin_holt: {
        id: "free_rin_holt",
        name: "Nova Quinn",
        type: "freelance",
        starPower: 2,
        description: "Reliable utility hire with a clean, consistent style."
      },
      free_kira_sol: {
        id: "free_kira_sol",
        name: "Tiffany Heat",
        type: "freelance",
        starPower: 1,
        description: "Quiet wildcard who surprises when the concept is right."
      },
      free_eli_hart: {
        id: "free_eli_hart",
        name: "Mila Rush",
        type: "freelance",
        starPower: 1,
        description: "Budget-friendly helper with earnest charm and limited reach."
      },
      act2_ivy_glaze: {
        id: "act2_ivy_glaze",
        name: "Ivy Glaze",
        type: "freelance",
        starPower: 4,
        description: "Glossy brand-builder who treats every shoot like a product launch."
      },
      act2_dex_marion: {
        id: "act2_dex_marion",
        name: "Dex Malone",
        type: "freelance",
        starPower: 3,
        description: "Over-prepared specialist who still improvises to steal the scene."
      },
      act2_sable_quinn: {
        id: "act2_sable_quinn",
        name: "Sable Quinn",
        type: "freelance",
        starPower: 3,
        description: "Trend-chasing chameleon with a knack for monetizing the moment."
      },
      act2_joel_riggs: {
        id: "act2_joel_riggs",
        name: "Eli Black",
        type: "freelance",
        starPower: 2,
        description: "Deadpan support who makes chaos look like a deliberate choice."
      },
      recruit_aria_lux: {
        id: "recruit_aria_lux",
        name: "Aria Afterdark",
        type: "core",
        starPower: 3,
        maxBookingsPerDay: 2,
        description: "Polished starlet who treats every set like a headline moment."
      },
      recruit_bryn_sterling: {
        id: "recruit_bryn_sterling",
        name: "Scarlett Sterling",
        type: "core",
        starPower: 2,
        description: "Quick study with a sharp camera instinct and easy chemistry."
      },
      recruit_celeste_noir: {
        id: "recruit_celeste_noir",
        name: "Celeste Sin",
        type: "core",
        starPower: 4,
        maxBookingsPerDay: 3,
        description: "High-stamina headliner with a loyal fan club and a cinematic gaze."
      },
      recruit_dahlia_slate: {
        id: "recruit_dahlia_slate",
        name: "Dahlia Kane",
        type: "core",
        starPower: 3,
        description: "Glossy brand-builder who keeps the vibe premium and polished."
      },
      recruit_eden_frost: {
        id: "recruit_eden_frost",
        name: "Eden Ivy",
        type: "core",
        starPower: 2,
        maxBookingsPerDay: 2,
        description: "Cool, composed performer who thrives under pressure and bright lights."
      },
      recruit_fern_kestrel: {
        id: "recruit_fern_kestrel",
        name: "Raven Foxx",
        type: "core",
        starPower: 3,
        description: "Hyper-competent closer with a knack for turning concepts into buzz."
      },
      recruit_gigi_blade: {
        id: "recruit_gigi_blade",
        name: "Gigi Blade",
        type: "core",
        starPower: 4,
        maxBookingsPerDay: 3,
        description: "Relentless showstopper who lives for big swings and bold sets."
      }
    }
  },
  recruitment: {
    maxRosterSize: 5,
    dailyCandidateLimit: 1,
    candidates: [
      {
        performerId: "recruit_bryn_sterling",
        storyId: "unlock_performer_bryn_sterling",
        repRequired: 5,
        forceUnlockDay: ACT2_STAFFING_PUSH_CONFIG.recruitForceUnlock.firstWaveDay,
        hireCost: 900,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchTitle: "A quick study with a headline stare",
        pitchText: "Scarlett Sterling wants her first real headline, and your studio is the fastest route. She learns the playbook in one take and smiles like she owns it.",
        pitchBullets: [
          "Hook: She wants a studio that moves fast and keeps the mystique tight.",
          "Edge: Sharp camera instincts with instant chemistry.",
          "Terms: Cash up front, treated like the breakout."
        ],
        meetCaptions: [
          "New number saved as “Boss.”",
          "Soft launch. No tags.",
          "She studies angles like a cheat code.",
          "“First real set. Make it count.”",
          "Hair still damp, eyes still locked in.",
          "DMs muted. Yours stay open.",
          "Close enough to hear the flash.",
          "Practicing the smirk you asked for.",
          "Audience bait. She’s already teasing.",
          "Seen 1 minute ago."
        ]
      },
      {
        performerId: "recruit_aria_lux",
        storyId: "unlock_performer_aria_lux",
        repRequired: 10,
        forceUnlockDay: ACT2_STAFFING_PUSH_CONFIG.recruitForceUnlock.firstWaveDay,
        hireCost: 1400,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchTitle: "Red-carpet polish, after-hours appetite",
        pitchText: "Aria Afterdark treats every set like a headline and wants your rise as her next one. She expects direction that feels exclusive, not desperate.",
        pitchBullets: [
          "Hook: She wants a studio that feels VIP from first DM.",
          "Edge: A headline aura that makes every frame look expensive.",
          "Terms: Premium fee, premium treatment."
        ],
        meetCaptions: [
          "Gloss first, gossip later.",
          "“Tell me the dress code.”",
          "Flash test. She nailed it.",
          "Soft focus, sharp intent.",
          "She only follows one account.",
          "Booked the slot. Cleared the night.",
          "No entourage, just you.",
          "She likes the way you run it.",
          "DM preview: “Keep this quiet.”",
          "Last call. She’s still up."
        ]
      },
      {
        performerId: "recruit_dahlia_slate",
        storyId: "unlock_performer_dahlia_slate",
        repRequired: 15,
        forceUnlockDay: ACT2_STAFFING_PUSH_CONFIG.recruitForceUnlock.secondWaveDay,
        hireCost: 1800,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchTitle: "Premium polish with a sly grin",
        pitchText: "Dahlia Kane knows your studio can sell gloss without losing heat. She wants clean lines, controlled light, and your name on the credit.",
        pitchBullets: [
          "Hook: She’s here for a studio that looks expensive on purpose.",
          "Edge: Brand-builder who makes polish feel addictive.",
          "Terms: Cash now, spotlight later."
        ],
        meetCaptions: [
          "She brought her own mood board.",
          "“Make it glossy, not safe.”",
          "Lighting check: perfect.",
          "No messy takes. No wasted shots.",
          "She likes your calm voice.",
          "Soft launch, high shine.",
          "Frame it like a magazine.",
          "She approves the cut with a smirk.",
          "Private preview, no watermark.",
          "Seen from the mirror."
        ]
      },
      {
        performerId: "recruit_eden_frost",
        storyId: "unlock_performer_eden_frost",
        repRequired: 20,
        forceUnlockDay: ACT2_STAFFING_PUSH_CONFIG.recruitForceUnlock.secondWaveDay,
        hireCost: 2200,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchTitle: "Ice-calm pro, all about control",
        pitchText: "Eden Ivy likes tight schedules and a boss who calls the shots. Your momentum tells her you can handle her pace.",
        pitchBullets: [
          "Hook: She wants structure with a little danger in it.",
          "Edge: Cool composure that reads as power on camera.",
          "Terms: Solid fee, serious direction."
        ],
        meetCaptions: [
          "Quiet room. Loud results.",
          "“On time. On brand.”",
          "She doesn’t miss the mark.",
          "No small talk, just chemistry.",
          "Your notes. Her execution.",
          "She likes the pressure.",
          "Muted palette, sharp eyes.",
          "She saves the best for last.",
          "Private preview, no edits.",
          "She’s already ready."
        ]
      },
      {
        performerId: "recruit_fern_kestrel",
        storyId: "unlock_performer_fern_kestrel",
        repRequired: 25,
        hireCost: 2700,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchTitle: "Closer energy with viral instincts",
        pitchText: "Raven Foxx follows momentum and wants in before it peaks. She turns a concept into buzz and expects you to steer the storm.",
        pitchBullets: [
          "Hook: She’s chasing the fastest rise in the city—yours.",
          "Edge: Closer who turns concepts into heat.",
          "Terms: Cash now, loyalty to the top."
        ],
        meetCaptions: [
          "She asked for your shot list.",
          "“Let’s make noise.”",
          "Risky angle, perfect take.",
          "She’s all momentum.",
          "The buzz is already building.",
          "She wants a private preview.",
          "No soft edits. Full impact.",
          "She knows the boss when she sees one.",
          "Trending in a closed circle.",
          "She’s waiting on your cue."
        ]
      },
      {
        performerId: "recruit_celeste_noir",
        storyId: "unlock_performer_celeste_noir",
        repRequired: 30,
        hireCost: 3400,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchTitle: "Headliner stamina, cinematic gaze",
        pitchText: "Celeste Sin doesn’t audition for small rooms. She’s here because your studio is finally worth her time—and she wants you in control.",
        pitchBullets: [
          "Hook: She wants a studio that feels elite, not busy.",
          "Edge: High-stamina headliner with a cinematic stare.",
          "Terms: Top-tier fee, headline respect."
        ],
        meetCaptions: [
          "No small talk. Just intent.",
          "“Frame me like a movie.”",
          "She only does first takes.",
          "The room goes quiet for her.",
          "She likes a boss who directs.",
          "After-hours slot, no witnesses.",
          "She’s the reason the lights stay on.",
          "Her fans can wait. You don’t.",
          "Private cut, locked link.",
          "Seen just now."
        ]
      },
      {
        performerId: "recruit_gigi_blade",
        storyId: "unlock_performer_gigi_blade",
        repRequired: 35,
        hireCost: 4200,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchTitle: "Showstopper built for big swings",
        pitchText: "Gigi Blade wants glamour, risk, and a studio brave enough to frame it. She picked you because your rise already looks expensive.",
        pitchBullets: [
          "Hook: She wants the hottest room and the boldest boss.",
          "Edge: Relentless showstopper with a viral streak.",
          "Terms: Premium cash, premium loyalty."
        ],
        meetCaptions: [
          "She walks in like she owns it.",
          "“Let’s make it loud.”",
          "Dangerous angles, perfect smile.",
          "She wants the VIP lens.",
          "Gloves off. Glam on.",
          "Your name on her call sheet.",
          "She likes a boss who dares.",
          "Private preview, no leaks.",
          "She’s trending before the drop.",
          "Last slide. Still watching."
        ]
      }
    ]
  },
  conquests: {
    enabled: true,
    placeholderPortraitPath: "assets/images/mascots/placeholder.svg",
    thresholds: CONQUEST_THRESHOLDS,
    characters: {
      producer: {
        id: "producer",
        name: "The Producer",
        roleLabel: "Executive Producer",
        portraitPath: "assets/images/mascots/producer_stage1.png",
        stages: [
          {
            stageIndex: 1,
            portraitPath: "assets/images/mascots/producer_stage1.png",
            trigger: {
              type: "equipment",
              requirements: [{ key: "lightingLevel", minLevel: 1 }]
            },
            message: "Lighting check: make it expensive.",
            sceneTitle: "She wants the glow on you",
            sceneBody: "Lighting Level {{lightingLevel}} turns the set into a spotlight.<br>“You made me look expensive,” she says.<br>“So I’m sending you the proof.”",
            rewardPack: {
              packId: "producer_stage1",
              title: "Lighting Check DMs",
              description: "You made her look expensive, so she returns the favor. Three glow-lit selfies that feel like a private thank-you.",
              imagePaths: buildPlaceholderImagePaths(3, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 2,
            portraitPath: "assets/images/mascots/producer_stage2.png",
            trigger: {
              type: "equipment",
              requirements: [{ key: "cameraLevel", minLevel: 1 }]
            },
            message: "Lens upgrade: private preview.",
            sceneTitle: "She leans in on the monitor",
            sceneBody: "Camera Level {{cameraLevel}} pulls her to the screen.<br>“If it’s this crisp, I’ll give you a set worth zooming.”<br>She sends a tighter run, no wasted frames.",
            rewardPack: {
              packId: "producer_stage2",
              title: "Focus Pull Tease",
              description: "She leans into the monitor and sends four tight shots made for your new lens. Every frame says you’re in control.",
              imagePaths: buildPlaceholderImagePaths(4, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 3,
            portraitPath: "assets/images/mascots/producer_stage3.png",
            trigger: {
              type: "equipment",
              requirements: [{ key: "setDressingLevel", minLevel: 1 }]
            },
            message: "Set dressed: she stays late.",
            sceneTitle: "You built a room she won’t leave",
            sceneBody: "Set Dressing {{setDressingLevel}} turns the studio into a scene.<br>“You built the mood,” she says, lingering after wrap.<br>“So I sent the after-hours cut.”",
            rewardPack: {
              packId: "producer_stage3",
              title: "After-Hours Cut",
              description: "She stays late and sends five moody frames from the locked set. All atmosphere, all yours.",
              imagePaths: buildPlaceholderImagePaths(5, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 4,
            portraitPath: "assets/images/mascots/producer_stage4.png",
            trigger: {
              type: "equipment",
              requirements: [
                { key: "lightingLevel", minLevel: 2 },
                { key: "cameraLevel", minLevel: 2 }
              ]
            },
            message: "VIP production: locked in.",
            sceneTitle: "Private production, vault rules",
            sceneBody: "Lighting {{lightingLevel}} and Camera {{cameraLevel}} say you run the room.<br>“You can handle pressure,” she says, sliding the bolt.<br>“So this one goes in the vault.”",
            rewardPack: {
              packId: "producer_stage4",
              title: "Director's Vault",
              description: "A VIP private set with twenty shots she only sends to the one running the room.",
              imagePaths: buildPlaceholderImagePaths(20, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          }
        ]
      },
      assistant: {
        id: "assistant",
        name: "The Assistant",
        roleLabel: "Executive Assistant",
        portraitPath: "assets/images/mascots/assistant_stage1.png",
        stages: [
          {
            stageIndex: 1,
            portraitPath: "assets/images/mascots/assistant_stage1.png",
            trigger: {
              anyOf: [
                { type: "stat", stat: "reputation", min: CONQUEST_THRESHOLDS.assistant.reputation.tier1 },
                { type: "stat", stat: "totalFollowers", min: CONQUEST_THRESHOLDS.assistant.followers.tier1 }
              ]
            },
            message: "Your numbers are getting loud.",
            sceneTitle: "The feed is hungry",
            sceneBody: "Reputation {{reputation}} and followers {{followers}} are spiking.<br>“The feed is hungry,” she says, leaning in.<br>“Give it just enough to beg.”",
            rewardPack: {
              packId: "assistant_stage1",
              title: "Priority Ping",
              description: "Your numbers spike, and she makes you her top priority. Three crisp selfies with a quiet power you can feel.",
              imagePaths: buildPlaceholderImagePaths(3, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 2,
            portraitPath: "assets/images/mascots/assistant_stage2.png",
            trigger: {
              anyOf: [
                { type: "stat", stat: "reputation", min: CONQUEST_THRESHOLDS.assistant.reputation.tier2 },
                { type: "stat", stat: "totalFollowers", min: CONQUEST_THRESHOLDS.assistant.followers.tier2 }
              ]
            },
            message: "Trendline alert: keep her close.",
            sceneTitle: "She tightens the calendar",
            sceneBody: "Followers {{followers}} won’t stop climbing.<br>“I control the schedule,” she murmurs.<br>“You stay at the top.”",
            rewardPack: {
              packId: "assistant_stage2",
              title: "Calendar Control",
              description: "She blocks out an after-hours slot just for you. Five poised shots that feel like an invitation you can’t decline.",
              imagePaths: buildPlaceholderImagePaths(5, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 3,
            portraitPath: "assets/images/mascots/assistant_stage3.png",
            trigger: {
              anyOf: [
                { type: "stat", stat: "onlyFansSubscribers", min: CONQUEST_THRESHOLDS.assistant.onlyFansSubscribers.tier3 },
                { type: "stat", stat: "netWorth", min: CONQUEST_THRESHOLDS.assistant.netWorth.tier3 }
              ]
            },
            message: "Executive slot reserved.",
            sceneTitle: "After-hours on your calendar",
            sceneBody: "OF subs {{ofSubs}} just crossed into real money.<br>“Premium attention costs extra,” she says.<br>“Good thing you’re my priority.”",
            rewardPack: {
              packId: "assistant_stage3",
              title: "Executive Slot",
              description: "She books you after hours and sends five controlled, revealing selfies. It reads like a private briefing just for you.",
              imagePaths: buildPlaceholderImagePaths(5, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 4,
            portraitPath: "assets/images/mascots/assistant_stage4.png",
            trigger: {
              anyOf: [
                { type: "stat", stat: "onlyFansSubscribers", min: CONQUEST_THRESHOLDS.assistant.onlyFansSubscribers.tier4 },
                { type: "stat", stat: "netWorth", min: CONQUEST_THRESHOLDS.assistant.netWorth.tier4 }
              ]
            },
            message: "Boardroom access: private.",
            sceneTitle: "Private calendar, private loyalty",
            sceneBody: "Cash {{cash}} and followers {{followers}} say empire.<br>She closes the blinds. “You built this.”<br>“Let me show you what loyalty buys.”",
            rewardPack: {
              packId: "assistant_stage4",
              title: "Loyalty Ledger",
              description: "She opens the private calendar and sends a VIP pack of twenty shots. It’s a trophy set for the boss she’s sworn to.",
              imagePaths: buildPlaceholderImagePaths(20, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          }
        ]
      },
      talentscout: {
        id: "talentscout",
        name: "The Talent Scout",
        roleLabel: "Roster Strategist",
        portraitPath: "assets/images/mascots/talentscout_stage1.png",
        stages: [
          {
            stageIndex: 1,
            portraitPath: "assets/images/mascots/talentscout_stage1.png",
            trigger: {
              minDay: 60,
              anyOf: [
                { type: "stat", stat: "recruitCount", min: CONQUEST_THRESHOLDS.talentscout.recruits.stage1 },
                { type: "stat", stat: "reputation", min: CONQUEST_THRESHOLDS.talentscout.reputation.tier1 }
              ]
            },
            message: "My inbox is melting.",
            sceneTitle: "She smells a breakout",
            sceneBody: "Recruits on file: {{recruitsCount}}.<br>“New girls don’t ask—they pitch,” she says.<br>“They ask about you.”",
            rewardPack: {
              packId: "talentscout_stage1",
              title: "Scout's Teaser",
              description: "She smells a winner and sends three playful backstage selfies. It’s her way of saying you’ve caught her eye.",
              imagePaths: buildPlaceholderImagePaths(3, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 2,
            portraitPath: "assets/images/mascots/talentscout_stage2.png",
            trigger: {
              anyOf: [
                { type: "stat", stat: "recruitCount", min: CONQUEST_THRESHOLDS.talentscout.recruits.stage2 },
                { type: "stat", stat: "totalFollowers", min: CONQUEST_THRESHOLDS.talentscout.followers.tier2 }
              ]
            },
            message: "Buzz check: your roster is hot.",
            sceneTitle: "She rides the spotlight",
            sceneBody: "Followers {{followers}} are loud and she rides the noise.<br>“That kind of buzz makes my phone glow,” she smirks.<br>“So I sent something worth gossip.”",
            rewardPack: {
              packId: "talentscout_stage2",
              title: "Buzz Tape",
              description: "She rides the noise and drops five gossip-ready shots into your DMs. Status looks good on her.",
              imagePaths: buildPlaceholderImagePaths(5, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 3,
            portraitPath: "assets/images/mascots/talentscout_stage3.png",
            trigger: {
              requiresDebtCleared: true,
              anyOf: [
                { type: "stat", stat: "recruitCount", min: CONQUEST_THRESHOLDS.talentscout.recruits.stage3 },
                { type: "stat", stat: "milestoneCount", min: CONQUEST_THRESHOLDS.talentscout.milestones.stage3 }
              ]
            },
            message: "Private audition request.",
            sceneTitle: "She auditions herself for you",
            sceneBody: "Recruits {{recruitsCount}} deep and she still wants your attention.<br>“Let me show you what I scout for,” she whispers.<br>“Consider it my personal pitch.”",
            rewardPack: {
              packId: "talentscout_stage3",
              title: "Personal Audition",
              description: "She wants your approval and sends five slow-burn audition selfies. It’s an invitation to pick favorites.",
              imagePaths: buildPlaceholderImagePaths(5, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 4,
            portraitPath: "assets/images/mascots/talentscout_stage4.png",
            trigger: {
              requiresDebtCleared: true,
              anyOf: [
                { type: "stat", stat: "recruitCount", min: CONQUEST_THRESHOLDS.talentscout.recruits.stage4 },
                { type: "stat", stat: "reputation", min: CONQUEST_THRESHOLDS.talentscout.reputation.tier3 }
              ]
            },
            message: "Top-tier roster, top-tier perks.",
            sceneTitle: "She signs, then seals it",
            sceneBody: "Reputation {{reputation}} and recruits {{recruitsCount}} put you in the top lane.<br>She snaps her pen shut. “Elite rosters get elite access.”<br>“This pack is your trophy.”",
            rewardPack: {
              packId: "talentscout_stage4",
              title: "Roster Trophy Set",
              description: "She makes it official with a VIP set of twenty shots. This is the private pack she reserves for top-tier owners.",
              imagePaths: buildPlaceholderImagePaths(20, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          }
        ]
      },
      saleswoman: {
        id: "saleswoman",
        name: "The Saleswoman",
        roleLabel: "Deal Closer",
        portraitPath: "assets/images/mascots/saleswoman_stage1.png",
        stages: [
          {
            stageIndex: 1,
            portraitPath: "assets/images/mascots/saleswoman_stage1.png",
            trigger: {
              minDay: 60,
              anyOf: [
                { type: "stat", stat: "totalUpgradesPurchased", min: CONQUEST_THRESHOLDS.saleswoman.upgrades.stage1 }
              ]
            },
            message: "Upgrade day. She shows up smiling.",
            sceneTitle: "She likes how you spend",
            sceneBody: "Upgrades purchased: {{upgradesPurchased}}.<br>“You don’t hesitate,” she purrs.<br>“So I won’t either.”",
            rewardPack: {
              packId: "saleswoman_stage1",
              title: "First Close",
              description: "You made your first buy, and she answers with three teasing sales-floor selfies. She wants you coming back.",
              imagePaths: buildPlaceholderImagePaths(3, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 2,
            portraitPath: "assets/images/mascots/saleswoman_stage2.png",
            trigger: {
              anyOf: [
                { type: "stat", stat: "totalUpgradesPurchased", min: CONQUEST_THRESHOLDS.saleswoman.upgrades.stage2 },
                { type: "stat", stat: "totalShopSpend", min: CONQUEST_THRESHOLDS.saleswoman.shopSpend.stage2 }
              ]
            },
            message: "Receipt check: you went premium.",
            sceneTitle: "She frames the receipt",
            sceneBody: "Shop spend {{shopSpend}} has her leaning over the counter.<br>“That’s the kind of receipt I frame,” she smiles.<br>“Consider this your rebate.”",
            rewardPack: {
              packId: "saleswoman_stage2",
              title: "Premium Receipt",
              description: "It turns out big spenders are her type. She sends five revealing pics with a note: you don’t ask the price.",
              imagePaths: buildPlaceholderImagePaths(5, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 3,
            portraitPath: "assets/images/mascots/saleswoman_stage3.png",
            trigger: {
              requiresDebtCleared: true,
              anyOf: [
                { type: "stat", stat: "totalUpgradesPurchased", min: CONQUEST_THRESHOLDS.saleswoman.upgrades.stage3 },
                { type: "equipment", key: "lightingLevel", minLevel: 2 },
                { type: "equipment", key: "cameraLevel", minLevel: 2 },
                { type: "equipment", key: "setDressingLevel", minLevel: 2 }
              ]
            },
            message: "Tier 2 unlocked her attention.",
            sceneTitle: "She sells the premium touch",
            sceneBody: "Upgrades purchased {{upgradesPurchased}} and she’s already next to you.<br>“Premium service is hands-on,” she whispers.<br>“Lucky you.”",
            rewardPack: {
              packId: "saleswoman_stage3",
              title: "Backroom Upsell",
              description: "She calls it premium service and sends five sleek, close-range selfies from the back office. You’re her favorite client now.",
              imagePaths: buildPlaceholderImagePaths(5, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 4,
            portraitPath: "assets/images/mascots/saleswoman_stage4.png",
            trigger: {
              requiresDebtCleared: true,
              anyOf: [
                { type: "stat", stat: "totalUpgradesPurchased", min: CONQUEST_THRESHOLDS.saleswoman.upgrades.stage4 },
                {
                  type: "equipment",
                  requirements: [
                    { key: "lightingLevel", minLevel: 2 },
                    { key: "cameraLevel", minLevel: 2 },
                    { key: "setDressingLevel", minLevel: 2 }
                  ]
                }
              ]
            },
            message: "Closed deals, open vault.",
            sceneTitle: "The closer collects",
            sceneBody: "Total spend {{shopSpend}} and upgrades {{upgradesPurchased}} make you her favorite client.<br>She locks the showroom. “You bought everything worth owning.”<br>“Now I collect.”",
            rewardPack: {
              packId: "saleswoman_stage4",
              title: "Platinum Private Vault",
              description: "She locks the showroom and sends a VIP pack of twenty shots. It’s the trophy set for her biggest spender.",
              imagePaths: buildPlaceholderImagePaths(20, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          }
        ]
      },
      bankManager: {
        id: "bankManager",
        name: "The Bank Manager",
        roleLabel: "Senior Account Manager",
        portraitPath: "assets/images/mascots/bank_manager_stage1.png",
        stages: [
          {
            stageIndex: 1,
            portraitPath: "assets/images/mascots/bank_manager_stage1.png",
            trigger: {
              type: "debtPaidRatio",
              minRatio: 0.25
            },
            message: "Quarter paid. She calls you in.",
            sceneTitle: "Quarter paid, eyes on you",
            sceneBody: "Debt remaining: {{debtRemaining}}. She taps the ledger.<br>“Twenty-five percent down—disciplined or dangerous.”<br>“Keep going. I like clients who deliver.”",
            rewardPack: {
              packId: "bank_manager_stage1",
              title: "Quarterly Statement",
              description: "She rewards discipline with three polished office selfies. The power dynamic is written between the lines.",
              imagePaths: buildPlaceholderImagePaths(3, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 2,
            portraitPath: "assets/images/mascots/bank_manager_stage2.png",
            trigger: {
              type: "debtPaidRatio",
              minRatio: 0.5
            },
            message: "Half paid. She’s recalculating.",
            sceneTitle: "Halfway paid, leverage shifts",
            sceneBody: "Debt remaining: {{debtRemaining}}.<br>“At fifty percent, this stops being a loan.”<br>“It becomes leverage.”",
            rewardPack: {
              packId: "bank_manager_stage2",
              title: "Leverage File",
              description: "She sends five after-hours shots from her office. The note reads like a contract—signed in private.",
              imagePaths: buildPlaceholderImagePaths(5, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 3,
            portraitPath: "assets/images/mascots/bank_manager_stage3.png",
            trigger: {
              type: "debtPaidRatio",
              minRatio: 0.75
            },
            message: "Seventy-five. She wants a meeting.",
            sceneTitle: "Pressure makes you useful",
            sceneBody: "Debt remaining: {{debtRemaining}} and she doesn’t blink.<br>“You perform under pressure,” she says.<br>“So do I.”",
            rewardPack: {
              packId: "bank_manager_stage3",
              title: "Risk Review",
              description: "She sends five controlled, slow-burn selfies and calls it a risk review. You feel the leverage even in the lighting.",
              imagePaths: buildPlaceholderImagePaths(5, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          },
          {
            stageIndex: 4,
            portraitPath: "assets/images/mascots/bank_manager_stage4.png",
            trigger: {
              type: "debtPaidRatio",
              minRatio: 1
            },
            message: "Debt cleared. Terms change.",
            sceneTitle: "Zero balance, new terms",
            sceneBody: "Debt remaining: {{debtRemaining}}.<br>She locks the office. “Zero balance.”<br>“So let’s renegotiate in private.”",
            rewardPack: {
              packId: "bank_manager_stage4",
              title: "Zero Balance Session",
              description: "Debt cleared means private terms. She delivers a VIP pack of twenty office-hour shots you’re not supposed to have.",
              imagePaths: buildPlaceholderImagePaths(20, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH)
            }
          }
        ]
      }
    }
  },
  freelancers: {
    profiles: [
      { id: "persona_midnight_muse", name: "Midnight Muse", description: "Late-night icon with velvet confidence and an algorithm-ready wink." },
      { id: "persona_glass_hearts", name: "Glass Hearts", description: "Glam auteur who treats every shoot like a glossy editorial." },
      { id: "persona_arcade_angel", name: "Pixel Vixen", description: "Bright retro pulse who turns nostalgia into instant chatter." },
      { id: "persona_velvet_riot", name: "Velvet Riot", description: "Stylish troublemaker with a loyal cult following and bold instincts." },
      { id: "persona_neon_paper", name: "Neon Paper", description: "Sharp, buzzy newcomer who wins crowds with effortless swagger." },
      { id: "persona_spark_syntax", name: "Spark Syntax", description: "Tech-chic performer who sells the vibe with crisp precision." },
      { id: "persona_satin_ace", name: "Satin Ace", description: "Cool tactician who keeps the shoot smooth and the fans curious." },
      { id: "persona_cosmic_rose", name: "Neon Siren", description: "Dreamy headliner with a cosmic edge and contagious momentum." },
      { id: "persona_polaroid_heat", name: "Polaroid Heat", description: "Flash-frame favorite who sparks fast buzz with playful flair." },
      { id: "persona_moondust_viper", name: "Moondust Viper", description: "Sultry mystique with a bite, built for short-term spikes." }
    ],
    promoFollowersBonusFlat: 80,
    freelancerSocialSubMultiplier: 0.6
  },
  agencyPacks: {
    enabled: true,
    dailyLimit: 1,
    flatFee: 300,
    bundleCount: 5,
    promoFollowersMult: 1.5,
    premiumOfSubsMult: 0.5,
    premiumSubsMult: 0.5
  },
  performerManagement: {
    contractDaysByType: {
      core: 90,
      freelance: 30,
      act2: 30
    },
    renewalCostByType: {
      core: 0,
      freelance: 500,
      act2: 500
    },
    retentionRules: {
      loyaltyMin: 0,
      loyaltyMax: 100,
      loyaltyGainPerBooking: 2,
      loyaltyDecayPerWeekIdle: 2
    },
    divaFeeRules: {
      enabled: true,
      tiers: [
        { maxLoyalty: 40, shootFee: 100, renewalFee: 200, label: "Diva Fee" },
        { maxLoyalty: 25, shootFee: 250, renewalFee: 500, label: "Full Diva Fee" }
      ]
    },
    maxConsecutiveBookings: 3,
    restDaysOnMaxFatigue: 1,
    contractWarningThresholdDays: 5
  },
  content_types: {
    available: ["Promo", "Premium"]
  },
  content: {
    variance: {
      enabled: true,
      maxVariancePct: 0.15,
      seedPolicy: "stored",
      startDay: 181,
      maxRollLogEntries: 100
    }
  },
  shootPhotos: {
    count: 5,
    placeholderPath: SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH
  },
  social_platforms: {
    platforms: ["Instagram", "X"],
    instagram_reach_multiplier: 1.0,
    x_reach_multiplier: 1.0
  },
  social: {
    strategy: {
      defaultStrategyId: "balanced"
    },
    manualStrategy: {
      channels: ["tease", "collabs", "ads"],
      channelLabels: {
        tease: "Tease",
        collabs: "Collabs",
        ads: "Ads"
      },
      minSpend: 0,
      maxSpend: "playerCash",
      defaultDailyBudget: 200,
      followersPerDollar: {
        tease: 1.2,
        collabs: 1.6,
        ads: 0.8
      },
      subsPerFollower: 0.01,
      diminishingReturnsK: 0.002
    }
  },
  socialCollabWeek: {
    initialOfferDay: 170,
    dailyUniquePromosRequired: 5,
    durationDays: 7,
    retryDelayDays: 14,
    reward: {
      reputationDelta: 8,
      promoReachBonusPct: 3
    },
    partners: [
      "NeonVice Studio",
      "Velvet Alley Media",
      "AfterDark Collective",
      "Chrome Hearts Content",
      "SugarStatic Studio"
    ]
  },
  analytics: {
    rollupWindowsDays: [7, 30],
    metricKeys: ["mrrDelta", "socialFollowers", "socialSubscribers", "onlyFansSubscribers", "promoCount", "premiumCount"],
    snapshotFrequencyDays: 1,
    historyMaxDays: 120,
    sparklineDays: 30,
    cashflowDays: 7
  },
  progression: {
    starting_reputation: 0,
    unlockSchedule: [
      { day: 4, type: "equipment", id: "lighting", storyId: "unlock_equipment_lighting" },
      { day: 18, type: "equipment", id: "camera", storyId: "unlock_equipment_camera" },
      { day: 180, type: "equipment", id: "set_dressing", storyId: "unlock_equipment_set_dressing" }
    ]
  },
  milestones: {
    milestoneOrder: [
      "ms_followers_500",
      "ms_subscribers_100",
      "ms_mrr_10000",
      "ms_followers_1000",
      "ms_subscribers_250",
      "ms_followers_2500",
      "ms_revenue_50000",
      "ms_subscribers_500",
      "ms_followers_5000",
      "ms_mrr_100000",
      "ms_reputation_25",
      "ms_reputation_50"
    ],
    milestones: {
      ms_followers_500: {
        label: "First 500 Social Followers",
        type: "followers",
        threshold: 500,
        rewardReputation: 2
      },
      ms_subscribers_100: {
        label: "First 100 OF Subscribers",
        type: "subscribers",
        threshold: 100,
        rewardReputation: 2
      },
      ms_mrr_10000: {
        label: "$10k MRR",
        type: "mrr",
        threshold: 10000,
        rewardReputation: 3
      },
      ms_followers_1000: {
        label: "First 1,000 Social Followers",
        type: "followers",
        threshold: 1000,
        rewardReputation: 3
      },
      ms_subscribers_250: {
        label: "First 250 OF Subscribers",
        type: "subscribers",
        threshold: 250,
        rewardReputation: 3
      },
      ms_followers_2500: {
        label: "2,500 Social Followers",
        type: "followers",
        threshold: 2500,
        rewardReputation: 5
      },
      ms_revenue_50000: {
        label: "$50k MRR",
        type: "mrr",
        threshold: 50000,
        rewardReputation: 7
      },
      ms_subscribers_500: {
        label: "500 OF Subscribers",
        type: "subscribers",
        threshold: 500,
        rewardReputation: 5
      },
      ms_followers_5000: {
        label: "5,000 Social Followers",
        type: "followers",
        threshold: 5000,
        rewardReputation: 7
      },
      ms_mrr_100000: {
        label: "$100k MRR",
        type: "mrr",
        threshold: 100000,
        rewardReputation: 10
      },
      ms_reputation_25: {
        label: "Reputation 25",
        type: "reputation",
        threshold: 25
      },
      ms_reputation_50: {
        label: "Reputation 50",
        type: "reputation",
        threshold: 50
      }
    }
  },
  legacyMilestones: {
    milestoneOrder: [
      "legacy_revenue_250k",
      "legacy_subscribers_1500",
      "legacy_reputation_80",
      "legacy_story_complete"
    ],
    milestones: {
      legacy_revenue_250k: {
        id: "legacy_revenue_250k",
        label: "$250k MRR",
        type: "mrr",
        threshold: 250000,
        rewardCash: 5000
      },
      legacy_subscribers_1500: {
        id: "legacy_subscribers_1500",
        label: "1,500 Subscribers",
        type: "subscribers",
        threshold: 1500,
        rewardCash: 4000
      },
      legacy_reputation_80: {
        id: "legacy_reputation_80",
        label: "Reputation 80",
        type: "reputation",
        threshold: 80,
        rewardCash: 6000
      },
      legacy_story_complete: {
        id: "legacy_story_complete",
        label: "Complete Act 3 Story",
        type: "storyComplete",
        threshold: 1,
        rewardCash: 8000
      }
    }
  },
  upgrades: {
    manager: {
      enabled: true,
      unlockAfterDebt: true,
      cost: 12000,
      overheadReductionMult: 0.85,
      title: "Hire Manager",
      description: "Cuts daily overhead by 15%. One-time purchase."
    }
  },
  leaseUpgrade: {
    enabled: true,
    storyTriggerDay: 95,
    windowDays: 14,
    windowPrice: 35000,
    latePrice: 65000,
    overheadDeltaPerDay: 100,
    repOnPurchase: 5,
    repOnMiss: -5,
    rosterCapBase: 5,
    rosterCapAfterUpgrade: 7,
    shopUnlockAfterDay: 95
  },
  studioUpgrade: {
    enabled: true,
    triggerDay: 145,
    requiresLeaseUpgrade: true,
    offerWindowDays: 14,
    repPenaltyOnDecline: 3,
    repPenaltyOnMiss: 5,
    cashPrice: 85000,
    latePrice: 110000,
    finance: {
      enabled: true,
      termDays: 20,
      downPayment: 20000,
      totalFinancedAmount: 75000
    },
    effects: {
      repBonus: 5,
      dailyOverheadDelta: 250,
      dailyShootCapBonus: 1,
      premiumOfSubsMult: 1.08
    },
    penalty: {
      enabled: true,
      durationDays: 14,
      premiumOfSubsMult: 0.92
    },
    ui: {
      hubTitle: "Studio Upgrade",
      hubSubtitleWindow: "A bigger room. Better light. Dirtier profits.",
      hubSubtitleFinanced: "You’re playing with house money now.",
      hubSubtitleOwned: "VIP sets. VIP attention.",
      hubSubtitleLate: "You blinked. Price went up.",
      modalTitle: "Studio Upgrade — VIP Set Buildout",
      modalBody: "A real studio isn’t just space — it’s permission. Bigger sets, cleaner angles, hotter talent. But the bill hits every morning like a hangover."
    }
  },
  equipment: {
    upgradeOrder: ["lighting", "camera", "set_dressing"],
    upgrades: {
      lighting: {
        maxLevel: 3,
        levelCosts: [600, 900, 1200],
        followersMultPerLevel: 0.05,
        ofSubsMultPerLevel: 0.00
      },
      camera: {
        maxLevel: 3,
        levelCosts: [800, 1200, 1600],
        followersMultPerLevel: 0.00,
        ofSubsMultPerLevel: 0.05
      },
      set_dressing: {
        maxLevel: 3,
        levelCosts: [500, 800, 1100],
        followersMultPerLevel: 0.03,
        ofSubsMultPerLevel: 0.03
      }
    }
  },
  locations: {
    tier0_ids: [
      "bedroom"
    ],
    tier1_ids: [
      "shower"
    ],
    tier2_ids: [
      "office"
    ],
    tier1UnlockCost: 2000,
    tier1Name: "Tier 1 — Downtown Studio",
    tier2UnlockCost: 5000,
    tier2Name: "Tier 2 — High-End Sets",
    tier2ReputationRequirement: 25,
    catalog: {
      bedroom: {
        id: "bedroom",
        name: "Bedroom (Tier 0)",
        tier: 0,
        cost: 50,
        unlockCost: 0,
        unlockRequirements: [],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A simple, familiar space for low-stakes starter shoots."
      },
      shower: {
        id: "shower",
        name: "Shower (Tier 1)",
        tier: 1,
        cost: 300,
        unlockCost: 750,
        unlockRequirements: [],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A tiled set with steamy ambiance and higher production value."
      },
      office: {
        id: "office",
        name: "Office (Tier 2)",
        tier: 2,
        cost: 1800,
        unlockCost: 5000,
        unlockRequirements: ["Reputation ≥ 25"],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A clean corporate space that signals serious growth."
      }
    }
  },
  themes: {
    mvp: {
      theme_ids: [
        "lingerie",
        "office",
        "uniform",
        "interracial"
      ],
      themes: {
        lingerie: {
          id: "lingerie",
          name: "Lingerie",
          description: "Your signature premium look — lace, heels, and zero subtlety.",
          modifiers: { followersMult: 1.12, ofSubsMult: 0.92 }
        },
        office: {
          id: "office",
          name: "Office",
          description: "After-hours authority — desks, suits, and someone ‘breaking rules.’",
          modifiers: { followersMult: 0.95, ofSubsMult: 1.08 }
        },
        uniform: {
          id: "uniform",
          name: "Uniform",
          description: "Roleplay on demand — maid, nurse, teacher vibes, you call the shots.",
          modifiers: { followersMult: 1.00, ofSubsMult: 1.00 }
        },
        interracial: {
          id: "interracial",
          name: "Interracial",
          description: "A bold, high-click category flex — instantly legible, instantly addictive.",
          modifiers: { followersMult: 0.90, ofSubsMult: 1.12 }
        }
      }
    },
    act2: {
      theme_ids: [],
      themes: {}
    },
    act3: {
      theme_ids: [
        "cosplay",
        "curves",
        "alt",
        "luxury",
        "confession"
      ],
      themes: {
        cosplay: {
          id: "cosplay",
          name: "Cosplay",
          description: "Costumes and canon, twisted into your own private fan service.",
          modifiers: { followersMult: 1.0, ofSubsMult: 1.0 }
        },
        curves: {
          id: "curves",
          name: "Curves",
          description: "Soft power, heavy heat. Every frame sells the shape.",
          modifiers: { followersMult: 1.0, ofSubsMult: 1.0 }
        },
        alt: {
          id: "alt",
          name: "Alt",
          description: "Ink, leather, and a stare that dares them to flinch.",
          modifiers: { followersMult: 1.0, ofSubsMult: 1.0 }
        },
        luxury: {
          id: "luxury",
          name: "Luxury",
          description: "Silk, gold, and velvet promises that come with a signature.",
          modifiers: { followersMult: 1.0, ofSubsMult: 1.0 }
        },
        confession: {
          id: "confession",
          name: "Confession",
          description: "Secrets whispered close, then sold back as a thrill.",
          modifiers: { followersMult: 1.0, ofSubsMult: 1.0 }
        }
      }
    }
  },
  afterHours: {
    enabled: true,
    knockChancePerEligible: 0.12,
    cooldownDays: 7,
    minDayForKnock: 10,
    starBonusReputationRequired: 50,
    recruitHelpReputationRequired: 100,
    oneTimeFeesByPerformerId: {
      core_lena_watts: 5600,
      core_milo_park: 4800,
      core_tess_rowan: 3000
    },
    defaultOneTimeFee: 4000,
    declineLoyaltyPenalty: 10,
    declineCooldownDays: 10,
    recruitMapping: {
      core_lena_watts: "recruit_aria_lux",
      core_milo_park: "recruit_celeste_noir",
      core_tess_rowan: "recruit_dahlia_slate"
    },
    imagePaths: {
      systemBackground: "assets/images/afterdark/system/office_night_bg.png",
      encountersBase: "assets/images/afterdark/encounters/"
    }
  },
  story: {
    act1: {
      act1_intro_day: 1,
      act1_debt_reminder_days: [30, 60, 80],
      act1_end_day: 90,
      intro: {
        id: "act1_intro_day1",
        triggerDay: 1
      },
      debtReminders: [
        { id: "act1_debt_reminder_day30", triggerDay: 30 },
        { id: "act1_debt_reminder_day60", triggerDay: 60 },
        { id: "act1_debt_reminder_day80", triggerDay: 80 }
      ],
      endEvents: {
        win: { id: "act1_end_win_day90", triggerDay: 90 },
        loss: { id: "act1_end_loss_day90", triggerDay: 90 }
      }
    },
    act2: {
      schedule: []
    },
    act3: {
      schedule: [
        { id: "act3_takeover_unlock_day181", triggerDay: 181 },
        { id: "act3_brand_legacy_day200", triggerDay: 200 },
        { id: "act3_market_shift_day225", triggerDay: 225 },
        { id: "act3_mentorship_day245", triggerDay: 245 },
        { id: "act3_exit_strategy_day270", triggerDay: 270 }
      ],
      effects: {
        act3_brand_legacy_day200: { reputationDelta: 2, socialFollowersDelta: 200 },
        act3_market_shift_day225: { cashDelta: 1500 },
        act3_mentorship_day245: { fatigueAllPerformersDelta: -1 },
        act3_exit_strategy_day270: { cashDelta: 3000, reputationDelta: 1 }
      }
    }
  },
  act2: {
    staffingPush: ACT2_STAFFING_PUSH_CONFIG
  }
};
