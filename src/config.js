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

function buildPlaceholderImagePaths(count, path) {
  const safeCount = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const resolvedPath = path || "";
  return Array.from({ length: safeCount }, function () {
    return resolvedPath;
  });
}

const AUTOMATION_AUTO_BOOK_ENABLED_DEFAULT = false;
const AUTOMATION_AUTO_BOOK_PER_DAY = 1;

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
    save_schema_version: 4,
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
    story_log_preview_length: 120
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
    base_shoot_cost: 100,
    contentTypeCostMult: {
      promo: 1.0,
      premium: 1.6
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
      maxStarPower: 6
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
        name: "Lena Watts",
        type: "core",
        starPower: 3,
        description: "Polished lead with calm authority and a steady fanbase."
      },
      core_milo_park: {
        id: "core_milo_park",
        name: "Milo Park",
        type: "core",
        starPower: 2,
        description: "Warm, versatile collaborator who fits any concept."
      },
      core_tess_rowan: {
        id: "core_tess_rowan",
        name: "Tess Rowan",
        type: "core",
        starPower: 1,
        description: "Scrappy newcomer with raw energy and room to grow."
      },
      free_jade_voss: {
        id: "free_jade_voss",
        name: "Jade Voss",
        type: "freelance",
        starPower: 3,
        description: "Seasoned pro who delivers instantly but keeps it professional."
      },
      free_nico_blade: {
        id: "free_nico_blade",
        name: "Nico Blade",
        type: "freelance",
        starPower: 2,
        description: "Flashy specialist known for bold aesthetics and fast turnarounds."
      },
      free_rin_holt: {
        id: "free_rin_holt",
        name: "Rin Holt",
        type: "freelance",
        starPower: 2,
        description: "Reliable utility hire with a clean, consistent style."
      },
      free_kira_sol: {
        id: "free_kira_sol",
        name: "Kira Sol",
        type: "freelance",
        starPower: 1,
        description: "Quiet wildcard who surprises when the concept is right."
      },
      free_eli_hart: {
        id: "free_eli_hart",
        name: "Eli Hart",
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
        name: "Dex Marion",
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
        name: "Joel Riggs",
        type: "freelance",
        starPower: 2,
        description: "Deadpan support who makes chaos look like a deliberate choice."
      },
      recruit_aria_lux: {
        id: "recruit_aria_lux",
        name: "Aria Lux",
        type: "core",
        starPower: 3,
        maxBookingsPerDay: 2,
        description: "Polished starlet who treats every set like a headline moment."
      },
      recruit_bryn_sterling: {
        id: "recruit_bryn_sterling",
        name: "Bryn Sterling",
        type: "core",
        starPower: 2,
        description: "Quick study with a sharp camera instinct and easy chemistry."
      },
      recruit_celeste_noir: {
        id: "recruit_celeste_noir",
        name: "Celeste Noir",
        type: "core",
        starPower: 4,
        maxBookingsPerDay: 3,
        description: "High-stamina headliner with a loyal fan club and a cinematic gaze."
      },
      recruit_dahlia_slate: {
        id: "recruit_dahlia_slate",
        name: "Dahlia Slate",
        type: "core",
        starPower: 3,
        description: "Glossy brand-builder who keeps the vibe premium and polished."
      },
      recruit_eden_frost: {
        id: "recruit_eden_frost",
        name: "Eden Frost",
        type: "core",
        starPower: 2,
        maxBookingsPerDay: 2,
        description: "Cool, composed performer who thrives under pressure and bright lights."
      },
      recruit_fern_kestrel: {
        id: "recruit_fern_kestrel",
        name: "Fern Kestrel",
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
    maxRosterSize: 10,
    dailyCandidateLimit: 1,
    candidates: [
      {
        performerId: "recruit_bryn_sterling",
        storyId: "unlock_performer_bryn_sterling",
        repRequired: 5,
        hireCost: 900,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchText: "A sharp-eyed newcomer looking for a studio with real ambition and a tasteful edge."
      },
      {
        performerId: "recruit_aria_lux",
        storyId: "unlock_performer_aria_lux",
        repRequired: 10,
        hireCost: 1400,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchText: "She brings a red-carpet aura and expects direction that feels exclusive, not desperate."
      },
      {
        performerId: "recruit_dahlia_slate",
        storyId: "unlock_performer_dahlia_slate",
        repRequired: 15,
        hireCost: 1800,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchText: "Your brand gets brighter with every shoot, and she knows exactly how to sell the glow."
      },
      {
        performerId: "recruit_eden_frost",
        storyId: "unlock_performer_eden_frost",
        repRequired: 20,
        hireCost: 2200,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchText: "A composed pro who thrives on tight schedules and perfectly framed moments."
      },
      {
        performerId: "recruit_fern_kestrel",
        storyId: "unlock_performer_fern_kestrel",
        repRequired: 25,
        hireCost: 2700,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchText: "She thrives on momentum, and your studio’s reputation has her attention."
      },
      {
        performerId: "recruit_celeste_noir",
        storyId: "unlock_performer_celeste_noir",
        repRequired: 30,
        hireCost: 3400,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchText: "A headliner with high standards and higher stamina, drawn to elite creative control."
      },
      {
        performerId: "recruit_gigi_blade",
        storyId: "unlock_performer_gigi_blade",
        repRequired: 35,
        hireCost: 4200,
        meetSlides: buildPlaceholderImagePaths(10, SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH),
        pitchText: "A viral magnet with a taste for premium spots and a daring, glamorous edge."
      }
    ]
  },
  freelancers: {
    profiles: [
      { id: "persona_midnight_muse", name: "Midnight Muse", description: "Late-night icon with velvet confidence and an algorithm-ready wink." },
      { id: "persona_glass_hearts", name: "Glass Hearts", description: "Glam auteur who treats every shoot like a glossy editorial." },
      { id: "persona_arcade_angel", name: "Arcade Angel", description: "Bright retro pulse who turns nostalgia into instant chatter." },
      { id: "persona_velvet_riot", name: "Velvet Riot", description: "Stylish troublemaker with a loyal cult following and bold instincts." },
      { id: "persona_neon_paper", name: "Neon Paper", description: "Sharp, buzzy newcomer who wins crowds with effortless swagger." },
      { id: "persona_spark_syntax", name: "Spark Syntax", description: "Tech-chic performer who sells the vibe with crisp precision." },
      { id: "persona_satin_ace", name: "Satin Ace", description: "Cool tactician who keeps the shoot smooth and the fans curious." },
      { id: "persona_cosmic_rose", name: "Cosmic Rose", description: "Dreamy headliner with a cosmic edge and contagious momentum." },
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
  analytics: {
    rollupWindowsDays: [7, 30],
    metricKeys: ["mrrDelta", "socialFollowers", "socialSubscribers", "onlyFansSubscribers", "promoCount", "premiumCount"],
    snapshotFrequencyDays: 7
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
    }
  },
  story: {
    act1: {
      act1_intro_day: 1,
      act1_debt_reminder_days: [15, 18, 22, 25, 29, 30, 36, 37, 45, 46, 55, 60, 63, 70, 72, 80, 83, 84, 85],
      act1_end_day: 90,
      intro: {
        id: "act1_intro_day1",
        triggerDay: 1
      },
      debtReminders: [
        { id: "act1_pack01_client_referral_day15", triggerDay: 15 },
        { id: "act1_pack03_debt_spiral_day18", triggerDay: 18 },
        { id: "act1_pack02_sponsor_ping_day22", triggerDay: 22 },
        { id: "act1_pack01_premium_editing_day25", triggerDay: 25 },
        { id: "act1_pack02_backroom_buzz_day29", triggerDay: 29 },
        { id: "act1_debt_reminder_day30", triggerDay: 30 },
        { id: "act1_pack03_power_trip_day36", triggerDay: 36 },
        { id: "act1_pack02_rumor_polish_day37", triggerDay: 37 },
        { id: "act1_pack01_vendor_discount_day45", triggerDay: 45 },
        { id: "act1_pack02_midnight_metrics_day46", triggerDay: 46 },
        { id: "act1_pack02_press_quote_day55", triggerDay: 55 },
        { id: "act1_debt_reminder_day60", triggerDay: 60 },
        { id: "act1_pack03_debt_pressure_day63", triggerDay: 63 },
        { id: "act1_pack01_repeat_commissions_day70", triggerDay: 70 },
        { id: "act1_pack02_fanmail_stack_day72", triggerDay: 72 },
        { id: "act1_debt_reminder_day80", triggerDay: 80 },
        { id: "act1_pack02_late_act1_fever_day83", triggerDay: 83 },
        { id: "act1_pack03_empire_swagger_day84", triggerDay: 84 },
        { id: "act1_pack01_final_stretch_day85", triggerDay: 85 }
      ],
      endEvents: {
        win: { id: "act1_end_win_day90", triggerDay: 90 },
        loss: { id: "act1_end_loss_day90", triggerDay: 90 }
      }
    },
    act2: {
      schedule: [
        { id: "act2_expansion_plan_day95", triggerDay: 95 },
        { id: "act2_staffing_push_day120", triggerDay: 120 },
        { id: "act2_studio_upgrade_day145", triggerDay: 145 },
        { id: "act2_partnership_offer_day170", triggerDay: 170 }
      ]
    },
    act3: {
      schedule: [
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
  }
};
