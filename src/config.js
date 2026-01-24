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
  AUTOMATION_AUTO_BOOK_ENABLED_DEFAULT: false,
  AUTOMATION_AUTO_BOOK_PER_DAY: 1,
  SHOOT_OUTPUTS_MAX_HISTORY: 50,
  LOCATION_PLACEHOLDER_THUMB_PATH: LOCATION_PLACEHOLDER_THUMB_PATH,
  SHOOT_OUTPUT_PLACEHOLDER_THUMB_PATH: "data:image/svg+xml;utf8," + encodeURIComponent(SHOOT_OUTPUT_PLACEHOLDER_SVG),
  save: {
    localstorage_key: "studio_empire_save",
    autosave_enabled: true,
    autosave_interval_seconds: 10,
    save_schema_version: 3,
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
    loan_total_due: 10000,
    debt_due_day: 90,
    shoots_per_day: 5
  },
  economy: {
    promo_followers_gain: 100,
    premium_base_revenue: 250,
    subscriber_conversion_rate: 0.01,
    base_shoot_cost: 100
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
  competition: {
    enabled: false,
    startDay: 181,
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
          premiumRevenueMult: 1
        }
      },
      shift_premium_bump: {
        name: "Premium Bump",
        startDay: 220,
        endDay: 235,
        multipliers: {
          promoFollowerMult: 1,
          premiumRevenueMult: 1.08
        }
      }
    }
  },
  reputation: {
    branches: [
      {
        id: "prestige",
        label: "Prestige",
        requiredReputation: 60,
        revenueMult: 1.10,
        followersMult: 0.95,
        blurb: "High-end brand. More money per premium, slightly less reach."
      },
      {
        id: "volume",
        label: "Volume",
        requiredReputation: 60,
        revenueMult: 0.95,
        followersMult: 1.10,
        blurb: "Chase reach. More followers, slightly less money per premium."
      },
      {
        id: "boutique",
        label: "Boutique",
        requiredReputation: 60,
        revenueMult: 1.05,
        followersMult: 1.05,
        blurb: "Balanced refinement. Slight boost to both."
      }
    ],
    selectionStartDay: 181
  },
  booking: {
    combo: {
      enabled: true,
      costMultiplier: 1.6,
      fatigueMultiplierEach: 0.85,
      revenueMultiplierByRoles: {
        "lead+specialist": 1.18,
        "lead+support": 1.1
      },
      promoFollowersMultiplierByRoles: {
        "lead+specialist": 1.08,
        "lead+support": 1.15
      }
    }
  },
  performers: {
    core_count: 3,
    freelance_count: 5,
    default_star_power: 1,
    max_fatigue: 100,
    fatigue_per_shoot: 10,
    fatigue_recovery_per_day: 5,
    starting_loyalty: 50,
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
    role_labels: {
      lead: "Lead",
      specialist: "Specialist",
      support: "Support"
    },
    role_by_id: {
      act2_ivy_glaze: "lead",
      act2_dex_marion: "specialist",
      act2_sable_quinn: "lead",
      act2_joel_riggs: "support"
    },
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
      }
    }
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
    location_tier_1_unlock_cost: 2000
  },
  milestones: {
    milestoneOrder: [
      "ms_followers_1000",
      "ms_subscribers_250",
      "ms_revenue_50000",
      "ms_reputation_25",
      "ms_reputation_50"
    ],
    milestones: {
      ms_followers_1000: {
        label: "First 1,000 Social Followers",
        type: "followers",
        threshold: 1000
      },
      ms_subscribers_250: {
        label: "First 250 OF Subscribers",
        type: "subscribers",
        threshold: 250
      },
      ms_revenue_50000: {
        label: "$50k MRR",
        type: "mrr",
        threshold: 50000
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
        label: "$250k Lifetime Revenue",
        type: "lifetimeRevenue",
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
  equipment: {
    upgradeOrder: ["lighting", "camera", "set_dressing"],
    upgrades: {
      lighting: {
        maxLevel: 3,
        levelCosts: [600, 900, 1200],
        followersMultPerLevel: 0.05,
        revenueMultPerLevel: 0.00
      },
      camera: {
        maxLevel: 3,
        levelCosts: [800, 1200, 1600],
        followersMultPerLevel: 0.00,
        revenueMultPerLevel: 0.05
      },
      set_dressing: {
        maxLevel: 3,
        levelCosts: [500, 800, 1100],
        followersMultPerLevel: 0.03,
        revenueMultPerLevel: 0.03
      }
    }
  },
  locations: {
    tier0_ids: [
      "location_basic_bedroom",
      "location_shared_apartment",
      "location_spare_office"
    ],
    tier1_ids: [
      "location_studio_loft",
      "location_city_apartment",
      "location_small_warehouse"
    ],
    tier2_ids: [
      "location_downtown_penthouse",
      "location_suburban_house",
      "location_private_studio"
    ],
    tier1UnlockCost: 2000,
    tier1Name: "Tier 1 — Downtown Studio",
    tier2UnlockCost: 5000,
    tier2Name: "Tier 2 — High-End Sets",
    tier2ReputationRequirement: 25,
    catalog: {
      location_basic_bedroom: {
        id: "location_basic_bedroom",
        name: "Basic Bedroom",
        tier: 0,
        cost: 50,
        unlockCost: 0,
        unlockRequirements: [],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A simple, familiar space for low-stakes starter shoots."
      },
      location_shared_apartment: {
        id: "location_shared_apartment",
        name: "Shared Apartment",
        tier: 0,
        cost: 80,
        unlockCost: 0,
        unlockRequirements: [],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A modest room with everyday clutter and casual vibes."
      },
      location_spare_office: {
        id: "location_spare_office",
        name: "Spare Office",
        tier: 0,
        cost: 120,
        unlockCost: 0,
        unlockRequirements: [],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A quiet corner with a desk setup for clean, focused content."
      },
      location_studio_loft: {
        id: "location_studio_loft",
        name: "Studio Loft",
        tier: 1,
        cost: 300,
        unlockCost: 750,
        unlockRequirements: [],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A compact loft with improved lighting and a cleaner backdrop."
      },
      location_city_apartment: {
        id: "location_city_apartment",
        name: "City Apartment",
        tier: 1,
        cost: 450,
        unlockCost: 1100,
        unlockRequirements: [],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A tidy urban space that feels more professional and polished."
      },
      location_small_warehouse: {
        id: "location_small_warehouse",
        name: "Small Warehouse",
        tier: 1,
        cost: 600,
        unlockCost: 1500,
        unlockRequirements: [],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A larger, flexible space suited for varied set dressing."
      },
      location_downtown_penthouse: {
        id: "location_downtown_penthouse",
        name: "Downtown Penthouse",
        tier: 2,
        cost: 1800,
        unlockCost: 4000,
        unlockRequirements: ["Reputation ≥ 20"],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A sleek high-rise space that signals serious growth."
      },
      location_suburban_house: {
        id: "location_suburban_house",
        name: "Suburban House",
        tier: 2,
        cost: 2200,
        unlockCost: 5000,
        unlockRequirements: ["Reputation ≥ 25"],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A full home set that unlocks richer lifestyle shoots."
      },
      location_private_studio: {
        id: "location_private_studio",
        name: "Private Studio",
        tier: 2,
        cost: 2600,
        unlockCost: 6000,
        unlockRequirements: ["Reputation ≥ 30"],
        thumbnailPath: LOCATION_PLACEHOLDER_THUMB_PATH,
        description: "A dedicated studio with controlled lighting and props."
      }
    }
  },
  themes: {
    mvp: {
      theme_ids: [
        "theme_casual",
        "theme_glamour",
        "theme_fitness",
        "theme_boudoir",
        "theme_nightlife"
      ],
      themes: {
        theme_casual: {
          id: "theme_casual",
          name: "Casual",
          description: "Everyday, approachable vibes that feel natural and low-pressure.",
          modifiers: { followersMult: 1.05, revenueMult: 0.90 }
        },
        theme_glamour: {
          id: "theme_glamour",
          name: "Glamour",
          description: "High-polish styling with bold poses and premium presentation.",
          modifiers: { followersMult: 0.95, revenueMult: 1.10 }
        },
        theme_fitness: {
          id: "theme_fitness",
          name: "Fitness",
          description: "Athletic energy with clean lighting and motion-focused shots.",
          modifiers: { followersMult: 1.10, revenueMult: 0.95 }
        },
        theme_boudoir: {
          id: "theme_boudoir",
          name: "Boudoir",
          description: "Intimate, classy sets with warm lighting and confident framing.",
          modifiers: { followersMult: 0.90, revenueMult: 1.15 }
        },
        theme_nightlife: {
          id: "theme_nightlife",
          name: "Nightlife",
          description: "Club-style ambiance with neon accents and late-night mood.",
          modifiers: { followersMult: 1.00, revenueMult: 1.00 }
        }
      }
    },
    act2: {
      theme_ids: [
        "theme_luxury_retreat",
        "theme_editorial",
        "theme_downtown_chic",
        "theme_sunlit_getaway",
        "theme_afterhours"
      ],
      themes: {
        theme_luxury_retreat: {
          id: "theme_luxury_retreat",
          name: "Luxury Retreat",
          description: "Resort-grade spaces with a relaxed, high-end atmosphere.",
          modifiers: { followersMult: 0.95, revenueMult: 1.20 }
        },
        theme_editorial: {
          id: "theme_editorial",
          name: "Editorial",
          description: "Magazine-style staging with bold angles and fashion emphasis.",
          modifiers: { followersMult: 1.05, revenueMult: 1.05 }
        },
        theme_downtown_chic: {
          id: "theme_downtown_chic",
          name: "Downtown Chic",
          description: "Urban interiors with a sleek, modern aesthetic.",
          modifiers: { followersMult: 1.00, revenueMult: 1.10 }
        },
        theme_sunlit_getaway: {
          id: "theme_sunlit_getaway",
          name: "Sunlit Getaway",
          description: "Bright, airy sets with soft daylight and beachy calm.",
          modifiers: { followersMult: 1.10, revenueMult: 0.95 }
        },
        theme_afterhours: {
          id: "theme_afterhours",
          name: "After Hours",
          description: "Late-night ambience with moody shadows and intimate lighting.",
          modifiers: { followersMult: 0.90, revenueMult: 1.20 }
        }
      }
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
