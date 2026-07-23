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

Row 9
```
Date:
Service:  Onan Quiet Diesel 7500 — wet-stacking recovery run (running erratic)
Mileage:
Cost:
Vendor:
Status:   Due
Notes:    Cummins Onan 7.5HDKAJ. Symptom: rough/erratic. Cause on diesel = wet stacking from under-loading. Fix: run 1-2 hr at 60-95% load — both roof A/Cs + water heater + microwave. Should smooth out and stop smoking. Prevention: exercise MONTHLY at 50%+ load for 1 hr. NOT a spark-arrestor blow-out — this is diesel, no arrestor. Full steps in Guide > Generator. Hours at last read: 2252.4.
```

Row 10
```
Date:
Service:  Onan HDKAJ — oil + oil filter change (250 hr / annual)
Mileage:
Cost:
Vendor:
Status:   Upcoming
Notes:    3 qt with filter, API CE, 15W-40. Oil filter 185-5409, fuel filter 149-2513 (do at same interval), air cleaner 140-2897.
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

Row 7
```
Part:      Onan HDKAJ oil filter
Category:  Generator
Qty:       0
Location:  P5
Part #:    185-5409
Notes:     Diesel Onan Quiet Diesel 7500. Change every 250 hr / annual.
```

Row 8
```
Part:      Onan HDKAJ fuel filter
Category:  Generator
Qty:       0
Location:  P5
Part #:    149-2513
Notes:     Change with oil filter.
```

Row 9
```
Part:      Onan HDKAJ air cleaner
Category:  Generator
Qty:       0
Location:  P5
Part #:    140-2897
Notes:     Inspect at each service; replace when dirty.
```

Row 10
```
Part:      Diesel engine oil, 15W-40 API CE
Category:  Generator
Qty:       0
Location:  P5
Part #:
Notes:     Genset takes 3 qt w/filter. Stock 1 gal for one change + top-off.
```

Row 11
```
Part:      1141 LED bulb (BA15s, 12V, warm white)
Category:  Lighting
Qty:       0
Location:  Interior
Part #:    1141 / 1156 / BA15s
Notes:     Drop-in LED replacement for coach interior 1141 incandescents. Warm white (2700-3200K) for best color match to original. Buy a 10-pack at Walmart Sterling (#924, 1510 W Main) or Home Depot Sterling (#1545, 1614 W Main) — order online for in-store pickup. Same bulb fits sockets marked 1141/1156/1003/7506 — overhead, reading, ceiling puck, bay lights all use it.
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
