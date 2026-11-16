(function () {
  const ENTRIES = [
    {
      q: "House batteries won't charge on shore power — where do I look first?",
      a: "Check the 15A “Battery Charger” breaker on the face of the Trace inverter FIRST. When it's tripped, the inverter still inverts and passes AC through, so everything looks normal — but the charger section is fully disabled. Tell-tale: the RC-9 VDC bargraph is dark and no CHARGER LED is lit. Resetting the breaker restores charging immediately (RC-9 shows BULK, ~12.5 V climbing, later FLOAT ~13 V).",
      tags: ["electrical", "batteries", "charging", "trace", "inverter", "RC-9"],
    },
    {
      q: "Why did the 15A charger breaker trip in the first place?",
      a: "The coach had been run on only 2 of the 4 house batteries. The charger pushed full current into half the bank's capacity, causing overcharge / boilover and the trip. Always run all four house batteries together — bank sizing matters for safe charging.",
      tags: ["electrical", "batteries", "charging", "root cause"],
    },
    {
      q: "How do I verify the house batteries are wired in parallel correctly?",
      a: "With a meter: any positive-to-positive = 0 V, any negative-to-negative = 0 V, and bank positive-to-negative = ~12–13 V. A ~24 V reading means a series wiring error. The 4 AGMs sit in a 2×2 tray, terminals facing center; mains exit the diagonal corners (B1 positive, B4 negative) for balanced load sharing.",
      tags: ["electrical", "batteries", "wiring", "parallel", "AGM"],
    },
    {
      q: "Is there anything unsafe about the dashboard headlight switch?",
      a: "Yes — treat it as a fire risk. It's a combo electrical / air-valve assembly that runs hot and has an internal air leak. The fix is to replace the combo assembly AND add a headlight relay to offload current off the switch.",
      tags: ["electrical", "headlights", "fire risk", "safety", "relay"],
    },
    {
      q: "The Trace inverter — is it set up right for the AGM batteries?",
      a: "Outstanding item: the Trace must be set to the AGM charge profile and have its temperature sensor clipped to a battery. Until then, charging isn't optimized for the AGM bank.",
      tags: ["electrical", "inverter", "AGM", "charging", "setup"],
    },
    {
      q: "The shower leaks even after new stems — what's wrong?",
      a: "On the Phoenix 4\" valve, a leak that new Lasco S-447-3NL stems won't fix is almost always the cracked white plastic crossover / manifold tube inside the valve — a known failure point. Replace the whole valve (Phoenix PF213350); stems alone won't do it.",
      tags: ["plumbing", "shower", "phoenix", "leak", "valve"],
    },
    {
      q: "How do I get to the shower valve supply lines?",
      a: "Through the kitchen cabinet chase behind the galley — the red / blue PEX lines run there. There is NO dedicated shower access panel (not in the factory manual). Use SharkBite / PEX female adapters, PTFE tape, and don't overtorque the plastic.",
      tags: ["plumbing", "shower", "access", "PEX", "galley"],
    },
    {
      q: "A baggage door won't latch — how do I fix it?",
      a: "Pull the bottom of the door outward to align the striker, then latch. Note that level-dependent binding is a SEPARATE issue: if the coach isn't level, bay doors can bind or not open — check level before assuming a mechanical failure.",
      tags: ["baggage doors", "latch", "leveling"],
    },
    {
      q: "When can I turn on the AC after hooking up power?",
      a: "Wait 30–45 seconds after connecting shore power or starting the generator, and wait until the green lights show on the Intellitec EMS panel. Only then turn on AC or high-draw items. Flipping a big load too early can trip the panel.",
      tags: ["electrical", "EMS", "shore power", "generator", "AC"],
    },
    {
      q: "What's the safe rule with the leveling jacks before driving?",
      a: "The RED light on the RVA leveling panel means a jack is down while the engine is on. It must be OFF before you move — driving on the jacks will wreck them. Retract all three rams, confirm red is out, and re-air the suspension before driving.",
      tags: ["leveling", "jacks", "safety", "RVA"],
    },
    {
      q: "What has to be true to flat-tow the Escalade safely?",
      a: "The transfer case must reach SOLID neutral (hold the dial to N 10+ sec until the light is solid; verify by shifting R then D with zero movement). Steering stays free only with ignition in ACC and the fob removed — never turn it fully OFF while towing or the wheel locks and grinds the tires. Battery cutoff OPEN while towing.",
      tags: ["flat-tow", "escalade", "transfer case", "towing", "safety"],
    },
    {
      q: "Onan Quiet Diesel 7500 runs rough / erratic — what's the fix?",
      a: "Almost always wet stacking. This is a Cummins Onan 7.5HDKAJ diesel; when it's run under-loaded, unburned fuel and soot build up and the engine hunts / misses / smokes. Diesel engines need load. Fix: run at 60–95% of rated 7.5 kW (both roof A/Cs on, water heater on electric, microwave) for 1–2 hours. The engine should smooth out and the exhaust smoke should clear as heat builds and the residue burns off. There is NO spark-arrestor cleanout plug on this diesel — that's a gas-Onan procedure. Prevention: exercise the genset monthly at 50%+ load for at least an hour. Full procedure: Guide > Generator.",
      tags: ["generator", "onan", "quiet diesel", "hdkaj", "wet stacking", "erratic", "rough", "diesel", "load"],
    },
    {
      q: "Onan HDKAJ maintenance intervals and part numbers?",
      a: "Cummins Onan 7.5HDKAJ Quiet Diesel 7500. Oil + oil filter every 250 running hours or annually, whichever first. 3 qt with filter, API CE grade. Viscosity 15W-40 for 5–120°F; 10W-30 for -13–68°F; 5W-30 for -40–68°F. Part numbers from the panel plate: air cleaner 140-2897, oil filter 185-5409, fuel filter 149-2513. Do fuel + air filters and coolant check at the same interval.",
      tags: ["generator", "onan", "hdkaj", "maintenance", "interval", "oil", "filter", "part numbers"],
    },
    {
      q: "How do I start the Onan diesel generator?",
      a: "It's a diesel with a glow-plug preheat cycle. Rotary switch on the coach panel to ON, then press and HOLD Start/Preheat. The red LED indicates preheat running — hold 5–15 seconds (longer when cold) until the engine catches, then release. Let it idle 30–60 seconds before adding load. To stop: shed load, idle 30–60 seconds for turbo cooldown, press Stop, rotary to OFF. Full procedure: Guide > Generator.",
      tags: ["generator", "onan", "diesel", "start", "preheat", "glow plug", "stop"],
    },
    {
      q: "What do the Onan generator indicator flash codes mean?",
      a: "On the coach panel indicator: 1 rapid = preheat active (normal during start). 2 rapid = high engine temperature — shed load, check coolant and airflow. 3 rapid = low oil pressure — STOP immediately and check oil level. Slow flashing = service required, see the service manual.",
      tags: ["generator", "onan", "flash codes", "indicator", "preheat", "high temp", "low oil pressure"],
    },
    {
      q: "What bulb does the coach interior use, and what's the LED replacement?",
      a: "Original bulbs are 1141 incandescent — 12V DC, BA15s single-contact bayonet base, 18W, ~264 lumens warm white. Same bulb also fits sockets marked 1156, 1003, or 7506. LED drop-in replacements use the same BA15s base and 12V DC — no wiring, just twist and swap. Local buy in Sterling, CO: both Walmart Supercenter (1510 W Main St, store #924) and Home Depot (1614 W Main St, store #1545) are right next door to each other. Walmart.com carries several 10-pack LED 1141 warm-white options with in-store pickup at the Sterling location — HQRP 10-pack, 2800-3200K warm white, is closest color match to the original tungsten. Home Depot lists an LED 1141 (DG79023WVP) as well. Want brighter? A 3000K 2W pack pushes 500 lm each — a real upgrade over the dim incandescent. Stock a 10-pack: overhead, reading, ceiling puck, and bay lights all use the same bulb.",
      tags: ["lighting", "bulb", "1141", "1156", "BA15s", "LED", "interior", "warm white", "12V", "replacement", "walmart", "home depot", "sterling"],
    },
    {
      q: "Starlink won't connect at camp — what do I check first?",
      a: "On the Mini, five things in order. (1) Sky view — must be 110°+ clear with no trees, awning, canopy, or coach above; use the Starlink app's Obstruction Check to pick the spot. (2) Power — ~20-40 W typical / ~100 W peak via USB-C PD; verify the brick is actually powered and the cable is seated at both ends. (3) Thermal — if the Mini was in direct Colorado sun on hot pavement, it may have shut itself down above ~120°F internal; feel the back, move it to partial shade, let it cool. (4) Firmware — first use at a new location can trigger a slow update; give it up to 15 minutes before troubleshooting. (5) Plan — residential plans require 'stopped and deployed' not in-motion; running in-motion needs a Roam plan.",
      tags: ["starlink", "mini", "internet", "wifi", "dish", "obstruction", "thermal", "connect", "no signal"],
    },
    {
      q: "Can I run Starlink while driving the coach?",
      a: "Only on a Roam plan — Mini Roam supports in-motion use with the Mini dish. Residential plans with portability are STOP-TO-USE: you must park, deploy the dish on its kickstand, and point it at clear sky. Trying to use a residential plan in-motion gives you signal only when stationary and may flag the account. Check the plan in the Starlink app before assuming.",
      tags: ["starlink", "roam", "mini", "in-motion", "driving", "plan", "mobile"],
    },
    {
      q: "The Starlink WiFi SSID is 'STARLINK' with no password — is that safe?",
      a: "No. Factory default on the Mini is an unsecured open WiFi named 'STARLINK'. Anyone in WiFi range can jump on, use your data, and worse — be on the same local network as every device in the coach. Fix it before you use it: Starlink app → Settings → WiFi, set a custom SSID and a WPA2 password. Takes 60 seconds. Don't skip this because 'we're on our own property' — the Mini's WiFi reaches further than you think.",
      tags: ["starlink", "mini", "wifi", "security", "ssid", "password", "open network", "lock"],
    },
    {
      q: "How do I change the Starlink WiFi name and password?",
      a: "On the phone: (1) Download the Starlink app (App Store or Google Play) if not already installed. (2) Connect the phone to the open STARLINK WiFi for now. (3) Open the app — it auto-detects the dish on the same network; you'll land on its home screen within a few seconds. (4) Tap SETTINGS at the bottom, then WIFI. (5) Under NETWORK NAME, type whatever you want to call it (e.g. Diplomat-Net). (6) Under SECURITY, pick WPA2 (or WPA2/WPA3 if offered). (7) Under PASSWORD, enter at least 8 characters — make it memorable but not guessable. (8) Tap SAVE. The dish resets its WiFi (~30 sec) and every device has to reconnect using the new name + password. First device to reconnect: the phone, with the new credentials. No app? Same thing works at http://192.168.1.1 in a browser on a device that's already joined the WiFi.",
      tags: ["starlink", "mini", "wifi", "password", "ssid", "change", "setup", "app", "security"],
    },
    {
      q: "How do I start the furnace?",
      a: "Quick version on the Duo-Therm Comfort Control thermostat (ceiling, front walkway, built into the roof A/C vent housing): (1) Propane ON at the ASME tank in P3. (2) Press MODE until the display reads FURNACE (MODE cycles OFF → FURNACE → COOL → FAN). (3) UP/DOWN sets the SET POINT above room temp. (4) Two zones — press ZONE to switch between Zone 1 and Zone 2 before setting each. The propane burner lights, the blower comes on, and the furnace cycles until the room hits temp. If it's been sitting unused for a while, pull the access panel under the fridge first and check the burn chamber for mouse nests, wasps, or chewed insulation — screwdrivers are in the bottom drawer at the front of the coach. Full procedure: Guide > Furnace.",
      tags: ["furnace", "heat", "propane", "thermostat", "duo-therm", "comfort control", "dometic", "mode", "set point", "zone", "ceiling panel"],
    },
    {
      q: "Where is the furnace located and how do I access it?",
      a: "The furnace lives UNDER the refrigerator. To service or inspect the burn chamber: (1) furnace OFF at the thermostat, (2) propane OFF at the P3 tank, (3) grab a screwdriver from the bottom drawer at the front of the coach, (4) remove the screws on the access panel below the fridge and lift it off. Look for mouse nests, wasp mud, spider webs, and chewed insulation — any of that can ignite when the furnace fires. Vacuum / brush out anything that doesn't belong, reinstall the panel, snug the screws, propane back on.",
      tags: ["furnace", "access", "service", "burn chamber", "fridge", "screwdriver", "propane"],
    },
    {
      q: "How do I turn on the water heater?",
      a: "Different unit from the furnace — this one makes HOT WATER, and it lives UNDER THE CLOSET. (1) Propane ON at the P3 tank. (2) Confirm water in the fresh tank OR city water is hooked up — dry-firing burns out the element. (3) KIB monitor panel → flip the HEATER switch ON. (4) Red indicator lights up and the ignition cycles. (5) Listen for the click and then a steady burn. (6) Walk to the closet, open it, and look down at the heater — confirm the burner is actually lit through the sight port. (7) Give it 20-30 minutes to bring 6 gallons up to temp. Before complaining about no hot water: confirm the HEATER switch is actually ON (red light visible) and that 20-30 min has passed since it was turned on. Full procedure: Guide > Plumbing > Water Heater.",
      tags: ["water heater", "hot water", "propane", "KIB", "panel", "closet", "ignition", "heater switch", "20 minutes", "30 minutes"],
    },
    {
      q: "What do the gauges and switches on the KIB monitor panel mean?",
      a: "Five gauges, three switches. Gauges show: LPG (propane), FRESH (fresh water), HOLDING (black / toilet), GRAY (sinks + shower), BATTERY (house bank: L low / F fair / G good / C charging). The gauges are dark normally — hold the TEST switch to light them up, release to turn off. PUMP runs the fresh water pump (ON when boondocking from the fresh tank, OFF when on city water). HEATER runs the propane ignition on the water heater under the closet.",
      tags: ["KIB", "monitor panel", "gauges", "tank", "LPG", "fresh", "gray", "holding", "battery", "test", "pump", "heater"],
    },
    {
      q: "The water heater won't light — what do I check?",
      a: "Walk through the symptom. (1) I hear clicks but no burn: propane off at P3, or the tank is empty, or the igniter needs another cycle. Flip HEATER off at the KIB panel, wait 30 seconds, flip it back on. (2) No click at all: 12 V to the heater is dead — check the main 12 V panel in D1 for a tripped breaker or blown fuse, confirm the HEATER switch is working. (3) Burns a few seconds, then shuts off: dirty flame sensor or blocked exhaust — pull the exterior access cover and inspect. (4) Heater burns fine but the water's cold: the winterizing BYPASS valve was left in bypass mode — find it at the top of the unit where red/blue PEX enters and return it to NORMAL.",
      tags: ["water heater", "troubleshooting", "won't light", "no hot water", "bypass", "propane", "KIB"],
    },
    {
      q: "What's the power draw of the Starlink Mini and how do I run it on 12V DC?",
      a: "Mini uses USB-C PD input, 12-48 V input range, typical 20-40 W / peak ~100 W. Three ways to power on the coach: (1) included 100 W USB-C PD brick plugged into shore, generator, or inverter outlet — simplest, ~30 W draw end-to-end; (2) any quality 100 W-rated USB-C PD adapter; (3) a 12 V USB-C PD trigger adapter for direct DC from the house bank — skips the inverter so you don't idle it for a 30 W load. Options (1) and (2) are easy; option (3) is nicer for long boondocking because you lose the inverter conversion loss.",
      tags: ["starlink", "mini", "power", "watts", "USB-C", "PD", "12V", "DC", "inverter"],
    },
    {
      q: "How is the coach awning powered and where's the switch?",
      a: "Two controls. A key switch enables power to the awning motor — the key lives on the RV key ring, stored in the cupboard above the driver's seat. A separate rocker inside the entry stairwell drives the awning in or out. Key must be ON before the rocker does anything. Full procedure and safety rules: Guide > Awning.",
      tags: ["awning", "key", "stairwell", "controls"],
    },
    {
      q: "Can I leave the coach awning out overnight or in wind?",
      a: "Never in wind, and never unattended in weather. High wind rips the fabric and can tear the arms off the coach — sometimes with roof damage. Rule of thumb: any doubt about wind now or forecast, or heading to bed — retract. A retracted awning has never been damaged by wind. Arms are also sticky and often take 2-3 people with gentle assistance to run in or out; never force.",
      tags: ["awning", "wind", "safety", "damage"],
    },
  ];

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  function normalize(s) {
    return String(s || '').toLowerCase();
  }

  function matches(entry, needle) {
    if (!needle) return true;
    const hay = normalize(entry.q + ' ' + entry.a + ' ' + entry.tags.join(' '));
    return needle.split(/\s+/).filter(Boolean).every((tok) => hay.includes(tok));
  }

  function render(needle) {
    const list = document.getElementById('kb-list');
    const empty = document.getElementById('kb-empty');
    const meter = document.getElementById('kb-meter');
    const count = document.getElementById('kb-count');
    const tpl = document.getElementById('kb-item');

    const filtered = ENTRIES.filter((e) => matches(e, needle));

    list.innerHTML = '';
    filtered.forEach((e) => {
      const node = tpl.content.firstElementChild.cloneNode(true);
      node.querySelector('.q').textContent = e.q;
      node.querySelector('.a').textContent = e.a;
      const tags = node.querySelector('.kb-tags');
      tags.innerHTML = e.tags.map((t) => `<span class="kb-tag">${esc(t)}</span>`).join('');
      list.appendChild(node);
    });

    empty.hidden = filtered.length > 0;
    const total = ENTRIES.length;
    meter.textContent = needle
      ? `${filtered.length} of ${total} match`
      : `${total} entries`;
    if (count) count.textContent = `${total} entries`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('kb-input');
    const clear = document.getElementById('kb-clear');
    input.addEventListener('input', () => render(normalize(input.value)));
    clear.addEventListener('click', () => { input.value = ''; render(''); input.focus(); });
    render('');
  });
})();
