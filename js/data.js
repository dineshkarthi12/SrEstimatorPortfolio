/*
 * All editable content for the site lives here.
 * Pages read window.SITE and render from it, so change copy, links and
 * numbers in this file only.
 *
 * Client names are anonymised on the site; real names are kept only in
 * comments next to each project.
 */
window.SITE = {
  site: {
    url: "https://srestimatorportfolio.vercel.app/"
  },

  person: {
    name: "Dinesh Kumar",
    title: "Senior Estimator · Quantity Surveyor · BOQ Specialist",
    location: "Chennai, Tamil Nadu",
    coords: "N 13.08° · E 80.27° · Chennai"
  },

  links: {
    email: "dineshkumarsn33@gmail.com",
    phone: "+91 99521 29182",
    phoneHref: "tel:+919952129182",
    whatsapp: "https://wa.me/919952129182",
    // Generated from this file: node tools/build-resume.mjs
    resume: "assets/Dinesh-Kumar-Resume.pdf"
  },

  hero: {
    label: "Senior Estimator · Quantity Surveyor · BOQ Specialist",
    line: "Interior Fit-Out | Civil & Finishing | MEP | Tendering | Cost Control",
    statsLead: "Seven years. Measured, priced and signed off.",
    engineer: "Trained as a civil engineer. I measure to IS 1200 before I price a single item.",
    ctaLead: "The projects are below. So is the resume."
  },

  stats: [
    { value: 7, suffix: "+", label: "years in estimation" },
    { value: 44, suffix: "+", label: "projects estimated" },
    { prefix: "₹", value: 84, suffix: " Cr+", label: "BOQ value, 5 featured projects" },
    { value: 20, suffix: "%", label: "lower cost overruns" },
    { value: 18, suffix: "%", label: "less material wastage" },
    { value: 100, suffix: "%", label: "client sign-off on variations" }
  ],

  about: {
    title: "Seven years of turning drawings into numbers people sign.",
    paragraphs: [
      "I'm a results-driven Senior Estimator and Quantity Surveyor in Chennai, with 7+ years in quantity take-off, BOM and BOQ preparation, rate analysis and cost control for commercial and residential interior fit-out, joinery, civil finishing and MEP packages.",
      "I work across the full cost lifecycle: pre-tender and tender estimation, bid preparation, comparative statements, value engineering, variation and change-order costing, and RA and final bill certification.",
      "I studied civil engineering, and it shows in how I work. Quantities are measured to IS 1200 and rates are built from CPWD DSR/SOR and current market rates, so anyone can check the number and get the same answer."
    ],
    spec: [
      ["Based in", "Chennai, Tamil Nadu"],
      ["Experience", "7+ years, since March 2019"],
      ["Focus", "Interior fit-out, joinery, civil finishing, MEP"],
      ["Measurement", "IS 1200"],
      ["Rates", "CPWD DSR/SOR, market rate analysis"],
      ["Education", "B.E. Civil Engineering"]
    ],
    figure: "Fig. 02 — Terrace and reflecting pool, frame 150 of the fly-through"
  },

  /*
   * BOM material categories per BOQ trade (shared by every project).
   * A project can override `material` for a trade with what its drawings
   * specify (see bomOverrides in each project).
   */
  bomLibrary: {
    prelim:      { material: "Site set-up, supervision, insurance, temporary works", unit: "LS" },
    civil:       { material: "Blockwork, cement, sand, aggregate, plaster", unit: "cum / sqm" },
    demolition:  { material: "Dismantling, debris removal and disposal", unit: "sqm / LS" },
    builders:    { material: "Openings, chasing and making good for services", unit: "LS" },
    flooring:    { material: "Tile / stone, screed, adhesive, skirting", unit: "sqm" },
    partitions:  { material: "Gypsum board, metal studs, cladding panels", unit: "sqm" },
    wallfinish:  { material: "Primer, putty, paint, wallpaper, texture", unit: "sqm" },
    column:      { material: "Column cladding panels and framing", unit: "sqm" },
    ceiling:     { material: "Gypsum / grid ceiling, framing, paint", unit: "sqm" },
    doors:       { material: "Door shutters, frames, ironmongery", unit: "nos" },
    joinery:     { material: "Plywood, laminate, veneer, hardware", unit: "rmt / nos" },
    canopy:      { material: "Steel framing, ACP / facade cladding", unit: "sqm" },
    handrail:    { material: "Toughened glass, SS handrail, fixings", unit: "rmt / sqm" },
    electrical:  { material: "Cables, conduits, DBs, wiring points", unit: "rmt / pts" },
    light:       { material: "Light fixtures, drivers, controls", unit: "nos" },
    cubicles:    { material: "Toilet cubicle partitions and hardware", unit: "nos" },
    toilet:      { material: "Sanitaryware, CP fittings, accessories", unit: "nos" },
    hvac:        { material: "Indoor / outdoor units, ducting, insulation, grilles", unit: "TR / sqm" },
    freshair:    { material: "Fresh-air units, ducting, dampers", unit: "nos / sqm" },
    extract:     { material: "Extract hoods, ducting, fans", unit: "nos / sqm" },
    cctv:        { material: "Cameras, recorders, data points, speakers, cabling", unit: "nos / pts" },
    parking:     { material: "Boom barriers, ticketing, guidance system", unit: "nos" },
    bms:         { material: "Controllers, sensors, field cabling", unit: "pts" },
    firealarm:   { material: "Detectors, panels, call points, talkback units", unit: "nos" },
    firefight:   { material: "Detectors, sprinklers, extinguishers", unit: "nos" },
    cleaning:    { material: "Periodic and final cleaning", unit: "LS" },
    elv:         { material: "Data, CCTV, access control and music points", unit: "pts" },
    mep:         { material: "HVAC, electrical, plumbing and lighting items", unit: "LS / nos" },
    equipment:   { material: "Café equipment and special items", unit: "nos / LS" },
    furniture:   { material: "Tables, chairs, sofas", unit: "nos" },
    plumbing:    { material: "Pipes, fittings, sanitaryware, CP fittings", unit: "rmt / nos" },
    kitchen:     { material: "Cooking ranges, refrigeration, SS work tables", unit: "nos" },
    lpg:         { material: "LPG bank, piping, valves", unit: "rmt / LS" },
    shopfront:   { material: "Shopfront (by landlord)", unit: "—" }
  },

  /*
   * Projects, in value order. Amounts are in rupees, excluding GST, exactly
   * as they appear in the BOQ summary. tools/verify.mjs (and the page itself,
   * in the console) checks that the trades add up to boq.total.
   */
  projects: [
    // Real project: Premier Mall, Kumbakonam — 3rd floor food court & multiplex.
    {
      slug: "retail-mall-kumbakonam",
      hero: true,
      name: "Retail Mall – Food Court & Multiplex, Kumbakonam",
      short: "Retail Mall, Kumbakonam",
      category: "Retail",
      type: "Retail mall · Food court & multiplex fit-out",
      location: "Kumbakonam, Tamil Nadu",
      client: "Retail mall developer",
      scope: "Third-floor food court and multiplex fit-out: civil, demolition and builder's works, finishes, ceilings, canopy and elevation, glazing, electrical and lighting, HVAC, fresh air and kitchen extract, CCTV/IT/music, parking management, BMS, fire alarm and cleaning.",
      role: "Lead estimator: take-off, BOQ, rate analysis and every revision",
      challenge: [
        "A live mall floor: a 288-seat food court, three theatres, a multiplex screen, kiosks and anchor tenant units all share one ceiling layout.",
        "The client kept revising the design while the estimate was being built. Every change had to move through the quantities, the rates and the summary without breaking the trade totals."
      ],
      result: [
        "One BOQ of ₹42.8 Cr (excl. GST) across 24 trades, kept in step with each client revision so the summary always matched the latest drawings.",
        "The largest packages are wall finishes (₹3.16 Cr), ceiling (₹2.85 Cr) and electrical (₹2.73 Cr)."
      ],
      boq: { total: 428312743.80, gst: 77096293.88, net: 505409037.68 },
      trades: [
        ["Preliminaries", 25399383.84, "prelim"],
        ["Civil works", 24171795.64, "civil"],
        ["Demolition works", 17569261.42, "demolition"],
        ["Builder's works", 21600167.37, "builders"],
        ["Flooring works", 19613140.34, "flooring"],
        ["Partitions & wall cladding", 18384497.65, "partitions"],
        ["Wall finishes", 31554936.38, "wallfinish"],
        ["Ceiling & ceiling finishes", 28528182.56, "ceiling"],
        ["Doors", 11538888.95, "doors"],
        ["Joinery works", 16958443.67, "joinery"],
        ["Canopy / elevation works", 18885592.25, "canopy"],
        ["Handrail & glass works", 13628102.39, "handrail"],
        ["Electrical works", 27274811.53, "electrical"],
        ["Light", 11381133.39, "light"],
        ["Cubicles", 7917732.94, "cubicles"],
        ["HVAC works", 19962299.70, "hvac"],
        ["Fresh air system", 14095288.54, "freshair"],
        ["Kitchen extract system", 22028569.71, "extract"],
        ["CCTV, IT & music system", 17680801.42, "cctv"],
        ["Parking management system", 16107600.83, "parking"],
        ["BMS", 13016782.50, "bms"],
        ["Fire alarm & talkback system", 14958675.87, "firealarm"],
        ["Regular cleaning works", 4405797.94, "cleaning"],
        ["Office ELV works", 11650856.97, "elv"]
      ],
      bomOverrides: {},
      // Revision timeline (hero project only).
      timeline: [
        { rev: "Rev. 0", label: "First BOQ, priced from the tender drawings" },
        { rev: "Client revisions", label: "Layout, ceiling and tenant changes, each re-measured and re-priced through the trade totals" },
        { rev: "Latest issue", label: "The current BOQ summary shown on this page", value: 428312743.80, current: true }
      ],
      images: {
        plate: "assets/projects/retail-mall-kumbakonam/plate-drawing.webp",
        boq: "assets/projects/retail-mall-kumbakonam/boq-summary.webp",
        drawings: [
          { src: "assets/projects/retail-mall-kumbakonam/drawing-1.webp", w: 1600, h: 1964, caption: "Third floor — food court and multiplex ceiling layout" }
        ]
      }
    },

    // Real project: PUKO (Cones and Brew), Chennai. Architect: SNA. MEP sheets list VB World Chennai.
    {
      slug: "cafe-chennai",
      name: "Café & Ice-Cream Parlour, Chennai",
      short: "Café & Ice-Cream, Chennai",
      category: "F&B",
      type: "Café & ice-cream parlour · Two-floor fit-out",
      location: "Chennai, Tamil Nadu",
      client: "Café & ice-cream brand",
      scope: "Ground and first floor café: civil, interior partitions and wall cladding, wall finishes, ceilings, flooring, doors, joinery, MEP (HVAC, electrical, plumbing and lighting) and café equipment.",
      role: "Lead estimator: take-off, BOQ and rate analysis",
      challenge: [
        "The drawing set runs to 57 sheets: furniture and flooring layouts for both floors, a curved feature wall in rammed-earth texture paint, a stone-and-tile floor pattern, staircase details and separate MEP layouts.",
        "Curved walls and cut-tile flooring don't measure like straight runs, so each was taken off from the layouts piece by piece."
      ],
      result: [
        "A ₹20.9 Cr BOQ (excl. GST) in 10 trades.",
        "Partitions & wall cladding (₹3.24 Cr), MEP (₹2.85 Cr) and café equipment (₹2.68 Cr) carry 42% of the value."
      ],
      boq: { total: 208736849, gst: 37572632.82, net: 246309481.82 },
      trades: [
        ["Preliminaries", 12836500, "prelim"],
        ["Civil works", 23675420, "civil"],
        ["Interior partitions & wall cladding", 32418670, "partitions"],
        ["Wall finishes", 20837560, "wallfinish"],
        ["Ceiling & ceiling finishes", 17649320, "ceiling"],
        ["Flooring works", 19526480, "flooring"],
        ["Doors", 9645780, "doors"],
        ["Joinery works", 16873650, "joinery"],
        ["MEP works (HVAC, electrical, plumbing & lighting)", 28465230, "mep"],
        ["Café equipment & special items", 26808239, "equipment"]
      ],
      bomOverrides: {
        flooring: "Beige concrete-finish tile 4′×2′ and cut tile, beige granite treads, risers, stepper and ramp, red travertine (per flooring layouts)",
        wallfinish: "Beige concrete texture paint; linear-grain (rammed-earth) texture paint on the curved wall"
      },
      images: {
        plate: "assets/projects/cafe-chennai/plate-drawing.webp",
        boq: "assets/projects/cafe-chennai/boq-summary.webp",
        drawings: [
          { src: "assets/projects/cafe-chennai/drawing-1.webp", w: 2000, h: 704, caption: "Ground floor — floor layout" },
          { src: "assets/projects/cafe-chennai/drawing-2.webp", w: 2000, h: 871, caption: "Ground floor — flooring layout and legend" },
          { src: "assets/projects/cafe-chennai/drawing-3.webp", w: 2000, h: 755, caption: "First floor — floor layout" },
          { src: "assets/projects/cafe-chennai/drawing-4.webp", w: 2000, h: 958, caption: "First floor — flooring layout and legend" },
          { src: "assets/projects/cafe-chennai/render-1.webp", w: 1600, h: 773, caption: "First floor — design render" }
        ]
      }
    },

    // Real project: Lab of Future, Mega Mall. Same client as project 5.
    {
      slug: "learning-store-mega-mall",
      name: "Experiential Learning Store, Mega Mall",
      short: "Learning Store, Mega Mall",
      category: "Retail",
      type: "Experiential learning store · Mall unit",
      location: "Mega mall, India",
      client: "Ed-tech learning brand (repeat client)",
      scope: "Themed zones — reception, centre zone, counselling room, AI room, space station and makerspace: flooring, partitions, wall finishes, column cladding, ceilings, doors, joinery, toilet fixtures, HVAC, and electrical, lighting, IT and ELV.",
      role: "Lead estimator: take-off, BOQ and rate analysis",
      challenge: [
        "The design arrived as a layout and a set of 3D views. HVAC had its own layout, but the electrical, lighting, IT and ELV drawings were still awaited.",
        "That package is the largest in the BOQ (₹2.84 Cr), so it had to be priced from the layout and the 3D views before the services drawings existed."
      ],
      result: [
        "A ₹16.1 Cr BOQ (excl. GST) across 11 trades, with HVAC priced to the HVAC layout and the electrical package clearly marked as estimated ahead of final drawings.",
        "A repeat client: the same brand's school innovation lab (project 05) was estimated on the same trade structure."
      ],
      boq: { total: 161412783, gst: 29054300.94, net: 190467083.94 },
      trades: [
        ["Preliminaries", 12875600, "prelim"],
        ["Flooring works", 18642300, "flooring"],
        ["Partitions & wall cladding", 15789410, "partitions"],
        ["Wall finishes", 12463750, "wallfinish"],
        ["Column cladding", 9256320, "column"],
        ["Ceiling & ceiling finishes", 14328640, "ceiling"],
        ["Doors", 9875980, "doors"],
        ["Joinery works", 11236540, "joinery"],
        ["Toilet fixtures & accessories", 8645210, "toilet"],
        ["HVAC works (as per HVAC layout)", 19874560, "hvac"],
        ["Electrical, lighting, IT & ELV works (drawings awaited)", 28424473, "electrical", "Estimated ahead of final drawings"]
      ],
      bomOverrides: {},
      images: {
        plate: "assets/projects/learning-store-mega-mall/plate-drawing.webp",
        boq: "assets/projects/learning-store-mega-mall/boq-summary.webp",
        drawings: [
          { src: "assets/projects/learning-store-mega-mall/drawing-1.webp", w: 1800, h: 1798, caption: "Store layout — zones along the mall walkway" },
          { src: "assets/projects/learning-store-mega-mall/drawing-2.webp", w: 1600, h: 1067, caption: "AI room — 3D view used for take-off" },
          { src: "assets/projects/learning-store-mega-mall/drawing-3.webp", w: 1600, h: 1067, caption: "Space station — 3D view used for take-off" }
        ]
      }
    },

    // Real project: Ponram, ECR Chennai. Architect: SNA.
    {
      slug: "restaurant-ecr",
      name: "Restaurant, ECR Chennai",
      short: "Restaurant, ECR Chennai",
      category: "F&B",
      type: "Restaurant · Two-floor fit-out",
      location: "ECR, Chennai",
      client: "Restaurant group",
      scope: "Ground-floor dining, private dining rooms, ice-cream counter and kitchen; first-floor Asian dining with a café counter. 19 trades, from demolition and builder's works to kitchen equipment, LPG and ELV.",
      role: "Lead estimator: take-off, BOQ and rate analysis",
      challenge: [
        "Many small trades on one budget: demolition, builder's works, LPG, fire alarm and final cleaning each sit under ₹5 lakh, and the shopfront is by the landlord.",
        "Each still needs its own scope line, or it turns up later as a variation."
      ],
      result: [
        "A ₹4.27 Cr BOQ (excl. GST) with 18 priced trades and the landlord's shopfront kept out as a clear exclusion.",
        "Light (₹53.3 L), ceiling (₹50.5 L) and wall finishes (₹46.7 L) are the largest packages."
      ],
      boq: { total: 42725399 },
      trades: [
        ["Preliminaries", 1870100, "prelim"],
        ["Demolition work", 109500, "demolition"],
        ["Builder's works", 458914, "builders"],
        ["Flooring works", 1617600, "flooring"],
        ["Partitions & wall cladding", 2661615, "partitions"],
        ["Wall finishes", 4672845, "wallfinish"],
        ["Ceiling & ceiling finishes", 5046505, "ceiling"],
        ["Joinery works", 4555945, "joinery"],
        ["Shopfront works", null, "shopfront", "By landlord"],
        ["Loose furniture", 1810615, "furniture"],
        ["Light", 5333090, "light"],
        ["Electrical works", 4130220, "electrical"],
        ["Plumbing works", 2292990, "plumbing"],
        ["HVAC works", 3753950, "hvac"],
        ["Kitchen equipment works", 2424360, "kitchen"],
        ["Fire alarm & fire fighting", 150225, "firefight"],
        ["ELV works", 1307195, "elv"],
        ["LPG system", 373480, "lpg"],
        ["Final cleaning works", 156250, "cleaning"]
      ],
      bomOverrides: {},
      images: {
        plate: "assets/projects/restaurant-ecr/plate-drawing.webp",
        boq: "assets/projects/restaurant-ecr/boq-summary.webp",
        drawings: [
          { src: "assets/projects/restaurant-ecr/drawing-1.webp", w: 2000, h: 945, caption: "Ground floor layout" },
          { src: "assets/projects/restaurant-ecr/drawing-2.webp", w: 2000, h: 928, caption: "First floor layout — Asian dining" },
          { src: "assets/projects/restaurant-ecr/drawing-3.webp", w: 1600, h: 814, caption: "Ground floor dining — design render" },
          { src: "assets/projects/restaurant-ecr/drawing-4.webp", w: 1600, h: 814, caption: "First floor dining — design render" }
        ]
      }
    },

    // Real project: Lab of Future – Don Bosco School. Same client as project 3.
    {
      slug: "innovation-lab-school",
      name: "Innovation Lab, School Campus",
      short: "Innovation Lab, School",
      category: "Education",
      type: "Innovation lab · School campus fit-out",
      location: "School campus, India",
      client: "School, through the ed-tech brand (repeat client)",
      scope: "A lab with aerospace and robotics, AI, makerspace, recording and multimedia rooms, a counselling room and a performing stage: flooring, partitions, wall finishes, column cladding, ceiling, doors and joinery.",
      role: "Lead estimator: take-off, BOQ and rate analysis",
      challenge: [
        "A compact package with a full drawing set: GA, flooring, partition, wall finish and ceiling layouts, each with its own legend — carpet, vinyl and porcelain flooring; gypsum and glass partitions; paint, wallpaper, acoustic and ribbed panels.",
        "Every legend code has to land in the BOQ as its own measured item."
      ],
      result: [
        "A ₹49.6 L BOQ (excl. GST) across 8 trades, led by partitions & wall cladding (₹9.83 L) and flooring (₹8.76 L).",
        "A repeat brief from the learning-store client, priced on the same trade structure."
      ],
      boq: { total: 4957385.40, gst: 892329.37, net: 5849714.77 },
      trades: [
        ["Preliminaries", 348650, "prelim"],
        ["Flooring works", 876320, "flooring"],
        ["Partitions & wall cladding", 983450, "partitions"],
        ["Wall finishes", 567890, "wallfinish"],
        ["Column cladding", 642180, "column"],
        ["Ceiling & ceiling finishes", 752430, "ceiling"],
        ["Doors", 435780, "doors"],
        ["Joinery works", 350685.40, "joinery"]
      ],
      bomOverrides: {
        flooring: "600×600 carpet (FL-01), vinyl sticker finish (FL-02), 600×600 white porcelain tile (FL-03)",
        partitions: "Dry gypsum wall (PL-02), 12 mm clear tempered glass (PL-03)",
        wallfinish: "Grey fenomastic paint (WF-01), wallpaper (WF-02), 50 mm acoustic panel (WF-03), 20 mm ribbed panel (WF-04), 12 mm tempered glazing (WF-05)",
        ceiling: "Grey fenomastic paint finish (CL-01)"
      },
      images: {
        plate: "assets/projects/innovation-lab-school/plate-drawing.webp",
        boq: "assets/projects/innovation-lab-school/boq-summary.webp",
        drawings: [
          { src: "assets/projects/innovation-lab-school/drawing-1.webp", w: 1940, h: 1015, caption: "General arrangement layout" },
          { src: "assets/projects/innovation-lab-school/drawing-2.webp", w: 2000, h: 909, caption: "Flooring layout and legend" },
          { src: "assets/projects/innovation-lab-school/drawing-3.webp", w: 2000, h: 907, caption: "Partition layout and legend" },
          { src: "assets/projects/innovation-lab-school/drawing-4.webp", w: 2000, h: 907, caption: "Wall finish layout and legend" },
          { src: "assets/projects/innovation-lab-school/drawing-5.webp", w: 2000, h: 910, caption: "Ceiling layout and legend" }
        ]
      }
    }
  ],

  process: [
    {
      name: "Drawing & spec study",
      text: "Read every sheet, legend and specification before measuring anything. Note what is missing and raise RFIs early.",
      tools: ["AutoCAD 2D", "Specifications", "Legends", "RFIs"]
    },
    {
      name: "Quantity take-off",
      text: "Measure each item to IS 1200, so anyone using the same rules gets the same quantity.",
      tools: ["IS 1200", "AutoCAD 2D", "Excel take-off sheets"]
    },
    {
      name: "BOM preparation",
      text: "Turn quantities into materials: sizes, units and wastage allowances a buyer can order from.",
      tools: ["MTO", "Wastage allowances", "Excel"]
    },
    {
      name: "BOQ preparation",
      text: "Group items by trade with clear descriptions, units and quantities, ready for pricing.",
      tools: ["Trade-wise BOQ", "Item descriptions", "Units"]
    },
    {
      name: "Vendor quotes & rate analysis",
      text: "Compare vendor quotes and build each unit rate from material, labour and overheads.",
      tools: ["Comparative statements", "CPWD DSR/SOR", "Market rates"]
    },
    {
      name: "Final costing & submission",
      text: "Summarise, check every total, issue the revision and track each change until sign-off.",
      tools: ["Cost summary", "Revisions", "Variation orders"]
    }
  ],

  experience: [
    {
      role: "Estimation Lead (Interior Fit-Out & Finishing Works)",
      company: "Toprock Global, Chennai",
      dates: "Sep 2020 – Present",
      points: [
        "End-to-end quantity take-off and BOQ preparation for commercial interior fit-outs and 26+ villas.",
        "Rate analysis and unit-rate build-ups from material, labour and overhead costs.",
        "Vendor quotation evaluation and comparative statements.",
        "Cost variance tracking against the approved BOQ.",
        "Variation and change-order costing, with 100% client sign-off.",
        "RA bill and final bill certification.",
        "AutoCAD 2D drawings prepared for take-off and measurement."
      ]
    },
    {
      role: "Junior Estimator & Interior Designer",
      company: "Sakthi Construction, Coimbatore",
      dates: "Mar 2019 – Aug 2020",
      points: [
        "BOQs and estimates for 18+ interior fit-out projects.",
        "Comparative statements for vendor and material selection.",
        "Reduced material wastage by 18%.",
        "Resolved RFIs between site, design team and clients."
      ]
    }
  ],

  skills: [
    ["Software", "MS Excel (advanced costing templates), AutoCAD 2D, SketchUp, 3ds Max, Lumion, MS Office"],
    ["Standards & rates", "IS 1200, CPWD DSR/SOR, Market rate analysis"],
    ["Quantities", "QTO/MTO, BOM, BOQ, Rate analysis"],
    ["Tendering", "Tender & bid preparation, Comparative statements, Value engineering"],
    ["Commercial", "Variation orders, RA/final bills, Cost control"]
  ],

  // Leave empty to hide the block, e.g. ["RICS Associate (2025)"]
  certifications: [],

  education: {
    degree: "B.E. Civil Engineering",
    school: "Government College of Engineering",
    years: "2013 – 2017"
  },

  languages: [
    ["English", "Professional"],
    ["Tamil", "Native"]
  ],

  contact: {
    title: "Let’s price it properly.",
    line: "I’m open to senior estimator and quantity surveyor roles in interior fit-out, civil finishing and MEP."
  }
};
