# Airtable Seed — Diplomat Logbook

Use this when you're at a terminal (or the Airtable UI) to set up the two
tables the logbook page reads and writes.

Names are **case-sensitive**. Match them letter-for-letter or the API returns
`422 UNKNOWN_FIELD_NAME` and rows won't show up on the site.

---

## Base setup

1. Create (or open) an Airtable base.
2. Add the two tables below with the exact field names and types shown.
3. Set the three env vars in Vercel (Project → Settings → Environment Variables):
   - `AIRTABLE_TOKEN` — a Personal Access Token with scopes
     `data.records:read` and `data.records:write` on this base only.
   - `AIRTABLE_BASE_ID` — starts with `app…`.
   - `LOGBOOK_PIN` — any string you'll remember.
4. Redeploy.

---

## Table 1 — `Service Log`

Field name (exact) | Type
--- | ---
`Date` | Date
`Service` | Long text
`Mileage` | Number (integer)
`Cost` | Currency
`Vendor` | Single line text
`Status` | Single select — options: `Done`, `Upcoming`, `Due`
`Notes` | Long text

### Seed rows (paste one at a time in the Airtable UI)

Fill any `(TBD)` fields with your real values when you have them; leave blank
otherwise — the logbook renders empty cells fine.

Row 1
```
Date:     (TBD)
Service:  Replaced 4 house batteries with Super Start 24MAGM Group 24 AGM
Mileage:  98653
Cost:     (TBD)
Vendor:   O'Reilly Auto Parts (Elizabeth CO)
Status:   Done
Notes:    1-yr warranty. Wired parallel in 2x2 tray. Warranty line 866-830-4351.
```

Row 2
```
Date:     (TBD)
Service:  Reset tripped 15A "Battery Charger" breaker on Trace inverter
Mileage:  98653
Cost:     0
Vendor:   Self
Status:   Done
Notes:    Charging restored — RC-9 to BULK then FLOAT ~13V. Root cause: ran only 2 of 4 batteries.
```

Row 3
```
Date:     (TBD)
Service:  Shower valve stem replacement (Lasco S-447-3NL) — did not stop leak
Mileage:
Cost:
Vendor:   Self
Status:   Done
Notes:    Leak traced to cracked plastic crossover tube; full valve replacement needed.
```

Row 4
```
Date:
Service:  Replace shower valve (Phoenix PF213350)
Mileage:
Cost:
Vendor:
Status:   Upcoming
Notes:    SharkBite/PEX adapters, PTFE tape, don't overtorque plastic.
```

Row 5
```
Date:
Service:  Set Trace inverter to AGM profile + connect temperature sensor
Mileage:
Cost:
Vendor:
Status:   Upcoming
Notes:
```

Row 6
```
Date:
Service:  Replace dashboard headlight switch combo + add headlight relay
Mileage:
Cost:
Vendor:
Status:   Due
Notes:    Fire risk — runs hot, internal air leak. Priority.
```

Row 7
```
Date:
Service:  Replace tires — full matched set
Mileage:
Cost:
Vendor:
Status:   Due
Notes:    At least one Goodyear G661 HSA dated 44/2015 (~11 yr). Mixed brands across axles. Size 255/70R22.5 LR-H.
```

Row 8
```
Date:
Service:  Confirm + install Amazon-ordered baggage door latch parts
Mileage:
Cost:
Vendor:
Status:   Upcoming
Notes:    Latch type not yet confirmed.
```

---

## Table 2 — `Parts Inventory`

Field name (exact — mind the space and `#`) | Type
--- | ---
`Part` | Single line text
`Category` | Single line text
`Qty` | Number (integer)
`Location` | Single line text
`Part #` | Single line text
`Notes` | Long text

### Seed rows

Row 1
```
Part:      Phoenix shower valve
Category:  Plumbing
Qty:       0
Location:
Part #:    PF213350
Notes:     Full replacement for leaking 4" two-handle valve
```

Row 2
```
Part:      Lasco stems
Category:  Plumbing
Qty:       0
Location:
Part #:    S-447-3NL
Notes:     Already tried; didn't fix leak
```

Row 3
```
Part:      Baggage door latch
Category:  Hardware
Qty:       0
Location:
Part #:    (TBD)
Notes:     Ordered on Amazon; confirm type
```

Row 4
```
Part:      Headlight relay
Category:  Electrical
Qty:       0
Location:
Part #:    (TBD)
Notes:     To offload current off dash switch
```

Row 5
```
Part:      Headlight switch combo assembly
Category:  Electrical
Qty:       0
Location:
Part #:    (TBD)
Notes:     Combo electrical/air valve — replaces fire-risk unit
```

Row 6
```
Part:      Coach tires
Category:  Tire
Qty:       0
Location:
Part #:    255/70R22.5 LR-H
Notes:     Full matched set needed
```

---

## Sanity check when it's live

```
curl -i https://<your-domain>/api/service-log
# → 401 Unauthorized  (no PIN — correct)

curl -i -H "x-logbook-pin: <PIN>" https://<your-domain>/api/service-log
# → 200  { "records": [ ... ] }
```

Open `/logbook`, enter the PIN, and rows should appear immediately.
