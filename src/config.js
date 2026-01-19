/*
 * Studio Empire Config
 * Mirrors config.toml values plus MVP data catalogs.
 */
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
    configVersion: 3
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
  save: {
    localstorage_key: "studio_empire_save",
    autosave_enabled: true,
    autosave_interval_seconds: 10,
    save_schema_version: 1,
    export_file_prefix: "studio-empire-save",
    export_file_extension: "json"
  },
  ui: {
    default_font_family: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    base_font_size_px: 14,
    panel_gap_px: 12,
    main_padding_px: 16
  },
  game: {
    starting_day: 1,
    action_day_max: 90,
    starting_cash: 5000,
    loan_principal: 5000,
    loan_total_due: 10000,
    debt_due_day: 90
  },
  economy: {
    promo_followers_gain: 100,
    premium_base_revenue: 250,
    subscriber_conversion_rate: 0.01,
    base_shoot_cost: 100
  },
  performerManagement: {
    availabilityRules: { maxConsecutiveBookings: 2, restDaysAfterMax: 1 },
    retentionRules: {
      loyaltyWarningThreshold: 40,
      loyaltyLeaveThreshold: 25,
      loyaltyGainPerBooking: 1,
      loyaltyDecayPerWeekIdle: 2
    },
    contractRules: {
      coreLengthDays: 90,
      freelanceLengthDays: 30,
      coreRenewalCost: 500,
      freelanceRenewalCost: 250
    }
  },
  analytics: {
    rollupWindowsDays: [7, 30],
    metricKeys: ["revenue", "followers", "subscribers", "promoCount", "premiumCount"],
    snapshotFrequencyDays: 7
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
      act2_aria_vale: {
        id: "act2_aria_vale",
        name: "Aria Vale",
        type: "core",
        starPower: 3,
        description: "Brand-focused lead with consistent high-end delivery."
      },
      act2_jonah_kade: {
        id: "act2_jonah_kade",
        name: "Jonah Kade",
        type: "core",
        starPower: 2,
        description: "Versatile performer who adapts quickly to new themes."
      },
      act2_sky_moreno: {
        id: "act2_sky_moreno",
        name: "Sky Moreno",
        type: "freelance",
        starPower: 3,
        description: "High-demand freelancer known for premium polish."
      },
      act2_pax_hollow: {
        id: "act2_pax_hollow",
        name: "Pax Hollow",
        type: "freelance",
        starPower: 2,
        description: "Experimental stylist who boosts niche engagement."
      },
      act3_naomi_ward: {
        id: "act3_naomi_ward",
        name: "Naomi Ward",
        type: "core",
        starPower: 4,
        description: "Flagship talent with prestige-level draw and stability."
      },
      act3_ryker_lane: {
        id: "act3_ryker_lane",
        name: "Ryker Lane",
        type: "freelance",
        starPower: 3,
        description: "Elite specialist who excels in high-risk concepts."
      },
      act3_liv_solace: {
        id: "act3_liv_solace",
        name: "Liv Solace",
        type: "freelance",
        starPower: 3,
        description: "Late-game wildcard with strong premium conversion."
      }
    },
    act2Roster: {
      performerIds: [
        "act2_aria_vale",
        "act2_jonah_kade",
        "act2_sky_moreno",
        "act2_pax_hollow"
      ],
      roleIds: ["lead", "specialist", "support"],
      roles: {
        lead: { label: "Lead", followersMult: 1.05, revenueMult: 1.05 },
        specialist: { label: "Specialist", followersMult: 1.10, revenueMult: 1.00 },
        support: { label: "Support", followersMult: 0.95, revenueMult: 1.00 }
      }
    }
  },
  content_types: {
    available: ["Promo", "Premium"]
  },
  social_platforms: {
    platforms: ["Instagram", "X"],
    instagram_reach_multiplier: 1.0,
    x_reach_multiplier: 1.0
  },
  social: {
    strategy: {
      defaultStrategyId: "balanced",
      strategies: {
        balanced: { instagramReachMult: 1.0, xReachMult: 1.0, subscriberConversionMult: 1.0 },
        growth_focus: { instagramReachMult: 1.2, xReachMult: 0.9, subscriberConversionMult: 0.9 },
        revenue_focus: { instagramReachMult: 0.9, xReachMult: 1.2, subscriberConversionMult: 1.1 }
      }
    }
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
      ms_followers_1000: { label: "First 1,000 Followers", type: "followers", threshold: 1000 },
      ms_subscribers_250: { label: "First 250 Subscribers", type: "subscribers", threshold: 250 },
      ms_revenue_50000: { label: "$50k Lifetime Revenue", type: "lifetimeRevenue", threshold: 50000 },
      ms_reputation_25: { label: "Reputation 25", type: "reputation", threshold: 25 },
      ms_reputation_50: { label: "Reputation 50", type: "reputation", threshold: 50 }
    }
  },
  equipment: {
    upgradeOrder: ["lighting", "camera", "set_dressing"],
    upgrades: {
      lighting: { maxLevel: 3, levelCosts: [600, 900, 1200], followersMultPerLevel: 0.05, revenueMultPerLevel: 0.00 },
      camera: { maxLevel: 3, levelCosts: [800, 1200, 1600], followersMultPerLevel: 0.00, revenueMultPerLevel: 0.05 },
      set_dressing: { maxLevel: 3, levelCosts: [500, 800, 1100], followersMultPerLevel: 0.03, revenueMultPerLevel: 0.03 }
    }
  },
  rivals: {
    evaluationCadenceDays: 7,
    studios: [
      { id: "rival_night_slate", name: "Night Slate Media", baseScore: 55, weeklyGrowthRate: 1.03 },
      { id: "rival_rose_quartz", name: "Rose Quartz Studio", baseScore: 48, weeklyGrowthRate: 1.02 }
    ]
  },
  market: {
    multiplierFloor: 0.85,
    multiplierCeiling: 1.15,
    shiftSchedule: [
      { id: "shift_premium_boom", day: 225 },
      { id: "shift_promo_fatigue", day: 245 }
    ],
    shifts: {
      shift_premium_boom: { revenueMult: 1.15, followersMult: 0.95 },
      shift_promo_fatigue: { revenueMult: 0.95, followersMult: 0.85 }
    }
  },
  reputation: {
    branches: {
      branches: [
        { id: "prestige", label: "Prestige", requiredReputation: 60, revenueMult: 1.10, followersMult: 0.95 },
        { id: "volume", label: "Volume", requiredReputation: 60, revenueMult: 0.95, followersMult: 1.10 },
        { id: "boutique", label: "Boutique", requiredReputation: 60, revenueMult: 1.05, followersMult: 1.05 }
      ]
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
      legacy_revenue_250k: { label: "$250k Lifetime Revenue", type: "lifetimeRevenue", threshold: 250000, rewardCash: 5000 },
      legacy_subscribers_1500: { label: "1,500 Subscribers", type: "subscribers", threshold: 1500, rewardCash: 4000 },
      legacy_reputation_80: { label: "Reputation 80", type: "reputation", threshold: 80, rewardCash: 6000 },
      legacy_story_complete: { label: "Complete Act 3 Story", type: "storyComplete", threshold: 1, rewardCash: 8000 }
    }
  },
  automation: {
    enabled: false,
    maxActionsPerDay: 1,
    minCashReserve: 1000
  },
  schedule: {
    enabled: false,
    maxQueueSize: 3,
    resolvePerDay: 1
  },
  content: {
    variance: {
      enabled: true,
      maxVariancePct: 0.15,
      seedPolicy: "stored"
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
    tiers: {
      tierOrder: ["tier0", "tier1", "tier2", "tier3"],
      defaultTierId: "tier0",
      tiers: {
        tier0: { unlockCost: 0, requiredReputation: 0 },
        tier1: { unlockCost: 2000, requiredReputation: 10 },
        tier2: { unlockCost: 4000, requiredReputation: 20 },
        tier3: { unlockCost: 12000, requiredReputation: 50 }
      }
    },
    catalog: {
      location_basic_bedroom: {
        id: "location_basic_bedroom",
        name: "Basic Bedroom",
        tier: 0,
        cost: 50,
        unlockCost: 0,
        unlockRequirements: [],
        description: "A simple, familiar space for low-stakes starter shoots."
      },
      location_shared_apartment: {
        id: "location_shared_apartment",
        name: "Shared Apartment",
        tier: 0,
        cost: 80,
        unlockCost: 0,
        unlockRequirements: [],
        description: "A modest room with everyday clutter and casual vibes."
      },
      location_spare_office: {
        id: "location_spare_office",
        name: "Spare Office",
        tier: 0,
        cost: 120,
        unlockCost: 0,
        unlockRequirements: [],
        description: "A quiet corner with a desk setup for clean, focused content."
      },
      location_studio_loft: {
        id: "location_studio_loft",
        name: "Studio Loft",
        tier: 1,
        cost: 300,
        unlockCost: 750,
        unlockRequirements: [],
        description: "A compact loft with improved lighting and a cleaner backdrop."
      },
      location_city_apartment: {
        id: "location_city_apartment",
        name: "City Apartment",
        tier: 1,
        cost: 450,
        unlockCost: 1100,
        unlockRequirements: [],
        description: "A tidy urban space that feels more professional and polished."
      },
      location_small_warehouse: {
        id: "location_small_warehouse",
        name: "Small Warehouse",
        tier: 1,
        cost: 600,
        unlockCost: 1500,
        unlockRequirements: [],
        description: "A larger, flexible space suited for varied set dressing."
      },
      location_downtown_penthouse: {
        id: "location_downtown_penthouse",
        name: "Downtown Penthouse",
        tier: 2,
        cost: 1800,
        unlockCost: 4000,
        unlockRequirements: ["reputation>=20"],
        description: "A sleek high-rise space that signals serious growth."
      },
      location_suburban_house: {
        id: "location_suburban_house",
        name: "Suburban House",
        tier: 2,
        cost: 2200,
        unlockCost: 5000,
        unlockRequirements: ["reputation>=25"],
        description: "A full home set that unlocks richer lifestyle shoots."
      },
      location_private_studio: {
        id: "location_private_studio",
        name: "Private Studio",
        tier: 2,
        cost: 2600,
        unlockCost: 6000,
        unlockRequirements: ["reputation>=30"],
        description: "A dedicated studio with controlled lighting and props."
      },
      location_luxury_penthouse: {
        id: "location_luxury_penthouse",
        name: "Luxury Penthouse",
        tier: 3,
        cost: 5200,
        unlockCost: 12000,
        unlockRequirements: ["reputation>=50"],
        description: "A premium skyline suite built for top-tier showcases."
      },
      location_beachfront_villa: {
        id: "location_beachfront_villa",
        name: "Beachfront Villa",
        tier: 3,
        cost: 6500,
        unlockCost: 15000,
        unlockRequirements: ["reputation>=60"],
        description: "An exclusive coastal property for aspirational content."
      },
      location_private_mansion: {
        id: "location_private_mansion",
        name: "Private Mansion",
        tier: 3,
        cost: 8200,
        unlockCost: 20000,
        unlockRequirements: ["reputation>=70"],
        description: "A sprawling estate that defines elite production value."
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
    },
    act3: {
      theme_ids: [
        "theme_legacy_gala",
        "theme_power_play",
        "theme_afterglow",
        "theme_urban_luxe",
        "theme_cinematic"
      ],
      themes: {
        theme_legacy_gala: {
          id: "theme_legacy_gala",
          name: "Legacy Gala",
          description: "Formal, prestige-forward sets with ceremonial flair.",
          modifiers: { followersMult: 0.95, revenueMult: 1.30 }
        },
        theme_power_play: {
          id: "theme_power_play",
          name: "Power Play",
          description: "Bold, high-stakes visuals with confident framing.",
          modifiers: { followersMult: 1.00, revenueMult: 1.20 }
        },
        theme_afterglow: {
          id: "theme_afterglow",
          name: "Afterglow",
          description: "Soft, intimate styling that sustains loyal subscribers.",
          modifiers: { followersMult: 0.90, revenueMult: 1.15 }
        },
        theme_urban_luxe: {
          id: "theme_urban_luxe",
          name: "Urban Luxe",
          description: "Sleek modern interiors emphasizing sophistication.",
          modifiers: { followersMult: 1.05, revenueMult: 1.10 }
        },
        theme_cinematic: {
          id: "theme_cinematic",
          name: "Cinematic",
          description: "Dramatic lighting and framing built for standout showcases.",
          modifiers: { followersMult: 1.00, revenueMult: 1.25 }
        }
      }
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
      startDay: 91,
      eventOrder: [
        "act2_expansion_plan_day95",
        "act2_staffing_push_day120",
        "act2_studio_upgrade_day145",
        "act2_partnership_offer_day170"
      ]
    },
    act3: {
      startDay: 181,
      eventOrder: [
        "act3_brand_legacy_day200",
        "act3_market_shift_day225",
        "act3_mentorship_day245",
        "act3_exit_strategy_day270"
      ]
    }
  }
};
