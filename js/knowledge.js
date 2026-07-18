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
      q: "Onan generator runs rough / erratic — where do I look first?",
      a: "Suspect carbon buildup in the muffler and spark-arrestor screen. Onan's fix is a blow-out: cool the generator 30 min, remove the top cover and the muffler cleanout plug (typically 11/16\" or 7/16\" hex — some models 3/4\"), then run the coach at full load (both roof A/Cs, water heater on electric, microwave) for 5 minutes with the plug OUT. Expect black smoke — that's the carbon leaving. Shut down, cool, reinstall the plug. If the plug is brass, use a 6-point socket and don't over-torque. Full procedure: Guide > Generator. Onan calls for this at 250 running hours or annually — same interval as the oil change.",
      tags: ["generator", "onan", "exhaust", "cleanout", "spark arrestor", "carbon", "erratic", "rough"],
    },
    {
      q: "How often should the Onan spark arrestor / exhaust cleanout be serviced?",
      a: "Every 250 running hours OR once a year, whichever comes first. It's the same interval as the engine oil change, so when one is due, do both.",
      tags: ["generator", "onan", "maintenance", "interval", "spark arrestor"],
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
