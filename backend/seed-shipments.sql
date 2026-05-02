-- ══════════════════════════════════════════════════════════════
-- AeroBay: Complete Seed Data Update
-- Updates selected_items to match full catalog + adds shipments
-- Run in Supabase SQL Editor
-- ══════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 1. DAV Public (Standard) → PARTIAL FULFILLMENT             │
-- └─────────────────────────────────────────────────────────────┘
UPDATE form_submissions SET
selected_items = '[
  {"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":2,"name":"Weather Man","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":7,"name":"3D Model Airplane 37\"","group":"Machines & Models","quantity":2,"remarks":"","included":true},
  {"sno":10,"name":"Drone - Programmable Pluto","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":15,"name":"3D Printer SE - Creality Ender 3 V3 SE","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":20,"name":"Wind Tunnel","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":26,"name":"Robotic Arm","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":34,"name":"Cordless Drill Kit - DeWALT DCD700C2A","group":"Mechanical Tools","quantity":1,"remarks":"","included":true},
  {"sno":58,"name":"Vernier Callipers - Insize","group":"Measuring Tools","quantity":1,"remarks":"","included":true},
  {"sno":70,"name":"Soldering Machine with Wire","group":"Electronic Tools","quantity":3,"remarks":"","included":true},
  {"sno":72,"name":"Glue Gun","group":"Electronic Tools","quantity":5,"remarks":"","included":true},
  {"sno":85,"name":"3D Printer Filament - PLA+","group":"Consumables","quantity":5,"remarks":"","included":true},
  {"sno":114,"name":"First Aid Kit - Apollo","group":"Safety Tools","quantity":2,"remarks":"","included":true},
  {"sno":115,"name":"Face Mask","group":"Safety Tools","quantity":500,"remarks":"","included":true},
  {"sno":116,"name":"Safety Goggle","group":"Safety Tools","quantity":30,"remarks":"","included":true}
]'::jsonb,
shipments = '[
  {"id":"s1a","shipment_code":"SHP-20260415-M1AX","date":"2026-04-15","status":"Delivered","notes":"Batch 1 - Heavy machines via BlueDart","items":[
    {"name":"Satellite Model","qty_shipped":1},
    {"name":"Weather Man","qty_shipped":1},
    {"name":"3D Printer SE - Creality Ender 3 V3 SE","qty_shipped":1},
    {"name":"Wind Tunnel","qty_shipped":1},
    {"name":"Cordless Drill Kit - DeWALT DCD700C2A","qty_shipped":1}
  ]},
  {"id":"s1b","shipment_code":"SHP-20260428-E2BY","date":"2026-04-28","status":"Dispatched","notes":"Batch 2 - Electronics via DTDC #TRK928374","items":[
    {"name":"Soldering Machine with Wire","qty_shipped":3},
    {"name":"Glue Gun","qty_shipped":5},
    {"name":"Vernier Callipers - Insize","qty_shipped":1},
    {"name":"First Aid Kit - Apollo","qty_shipped":2}
  ]}
]'::jsonb
WHERE school_name = 'DAV Public';

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 2. St. Columba's (Basix) → FULLY FULFILLED                 │
-- └─────────────────────────────────────────────────────────────┘
UPDATE form_submissions SET
selected_items = '[
  {"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":2,"name":"Weather Man","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":7,"name":"Drone - Programmable","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":11,"name":"3D Printer V3 SE","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":14,"name":"Wind Tunnel","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":19,"name":"Robotic Arm","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":24,"name":"Cordless Drill Bit","group":"Mechanical Tools","quantity":1,"remarks":"","included":true},
  {"sno":46,"name":"Vernier Callipers","group":"Measuring Tools","quantity":1,"remarks":"","included":true},
  {"sno":56,"name":"Soldering Machine with Wire","group":"Electronic Tools","quantity":2,"remarks":"","included":true},
  {"sno":57,"name":"Glue Gun","group":"Electronic Tools","quantity":3,"remarks":"","included":true},
  {"sno":92,"name":"First Aid Kit","group":"Safety Tools","quantity":1,"remarks":"","included":true},
  {"sno":93,"name":"Face Mask","group":"Safety Tools","quantity":300,"remarks":"","included":true}
]'::jsonb,
shipments = '[
  {"id":"s2a","shipment_code":"SHP-20260320-F1CZ","date":"2026-03-20","status":"Delivered","notes":"Complete consignment delivered to school","items":[
    {"name":"Satellite Model","qty_shipped":1},
    {"name":"Weather Man","qty_shipped":1},
    {"name":"Drone - Programmable","qty_shipped":1},
    {"name":"3D Printer V3 SE","qty_shipped":1},
    {"name":"Wind Tunnel","qty_shipped":1},
    {"name":"Robotic Arm","qty_shipped":1},
    {"name":"Cordless Drill Bit","qty_shipped":1},
    {"name":"Vernier Callipers","qty_shipped":1},
    {"name":"Soldering Machine with Wire","qty_shipped":2},
    {"name":"Glue Gun","qty_shipped":3},
    {"name":"First Aid Kit","qty_shipped":1},
    {"name":"Face Mask","qty_shipped":300}
  ]}
]'::jsonb
WHERE school_name ILIKE '%Columba%';

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 3. Apeejay School (Advanced) → PARTIAL (1 batch)            │
-- └─────────────────────────────────────────────────────────────┘
UPDATE form_submissions SET
selected_items = '[
  {"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":2,"name":"Weather Man","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":3,"name":"Wind Tunnel","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":4,"name":"3D Printer SE","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":5,"name":"3D Printer V3+","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":8,"name":"3D Pen","group":"Machines & Models","quantity":10,"remarks":"","included":true},
  {"sno":21,"name":"Drone - Programmable","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":30,"name":"Robotic Arm","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":44,"name":"Rotary Tool","group":"Mechanical Tools","quantity":1,"remarks":"","included":true},
  {"sno":69,"name":"Vernier Callipers","group":"Measuring Tools","quantity":1,"remarks":"","included":true},
  {"sno":82,"name":"Soldering Machine with Wire","group":"Electronic Tools","quantity":4,"remarks":"","included":true},
  {"sno":132,"name":"First Aid Kit","group":"Safety Tools","quantity":2,"remarks":"","included":true},
  {"sno":133,"name":"Face Mask","group":"Safety Tools","quantity":500,"remarks":"","included":true}
]'::jsonb,
shipments = '[
  {"id":"s3a","shipment_code":"SHP-20260405-G2DA","date":"2026-04-05","status":"Delivered","notes":"Initial batch - 3D printers and heavy equipment","items":[
    {"name":"Satellite Model","qty_shipped":1},
    {"name":"Wind Tunnel","qty_shipped":1},
    {"name":"3D Printer SE","qty_shipped":1},
    {"name":"3D Printer V3+","qty_shipped":1},
    {"name":"Rotary Tool","qty_shipped":1}
  ]}
]'::jsonb
WHERE school_name ILIKE '%Apeejay%' AND lab_category = 'Advanced';

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 4. Amity International (Premium) → PARTIAL (2 batches)      │
-- └─────────────────────────────────────────────────────────────┘
UPDATE form_submissions SET
selected_items = '[
  {"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":2,"name":"Weather Man","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":3,"name":"Wind Tunnel","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":4,"name":"3D Printer K1C","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":5,"name":"3D Printer V3+","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":8,"name":"3D Pen","group":"Machines & Models","quantity":10,"remarks":"","included":true},
  {"sno":24,"name":"Drone - Programmable","group":"Machines & Models","quantity":2,"remarks":"","included":true},
  {"sno":33,"name":"Robotic Arm","group":"Machines & Models","quantity":2,"remarks":"","included":true},
  {"sno":52,"name":"Rotary Tool","group":"Mechanical Tools","quantity":1,"remarks":"","included":true},
  {"sno":79,"name":"Vernier Callipers","group":"Measuring Tools","quantity":2,"remarks":"","included":true},
  {"sno":92,"name":"Soldering Machine with Wire","group":"Electronic Tools","quantity":4,"remarks":"","included":true},
  {"sno":147,"name":"First Aid Kit","group":"Safety Tools","quantity":3,"remarks":"","included":true},
  {"sno":148,"name":"Face Mask","group":"Safety Tools","quantity":600,"remarks":"","included":true}
]'::jsonb,
shipments = '[
  {"id":"s4a","shipment_code":"SHP-20260401-H3EB","date":"2026-04-01","status":"Delivered","notes":"Phase 1 - Core machines delivered to campus","items":[
    {"name":"Satellite Model","qty_shipped":1},
    {"name":"Weather Man","qty_shipped":1},
    {"name":"Wind Tunnel","qty_shipped":1},
    {"name":"3D Printer K1C","qty_shipped":1},
    {"name":"3D Printer V3+","qty_shipped":1},
    {"name":"Rotary Tool","qty_shipped":1},
    {"name":"First Aid Kit","qty_shipped":3}
  ]},
  {"id":"s4b","shipment_code":"SHP-20260420-I4FC","date":"2026-04-20","status":"Delivered","notes":"Phase 2 - Electronics and consumables","items":[
    {"name":"Soldering Machine with Wire","qty_shipped":4},
    {"name":"Vernier Callipers","qty_shipped":2},
    {"name":"3D Pen","qty_shipped":10},
    {"name":"Face Mask","qty_shipped":600}
  ]}
]'::jsonb
WHERE school_name ILIKE '%Amity%';

-- ┌─────────────────────────────────────────────────────────────┐
-- │ 5. Apeejay School (Premium) → PENDING (no shipments)        │
-- └─────────────────────────────────────────────────────────────┘
UPDATE form_submissions SET
selected_items = '[
  {"sno":1,"name":"Satellite Model","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":2,"name":"Weather Man","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":3,"name":"Wind Tunnel","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":4,"name":"3D Printer K1C","group":"Machines & Models","quantity":1,"remarks":"","included":true},
  {"sno":33,"name":"Robotic Arm","group":"Machines & Models","quantity":2,"remarks":"","included":true},
  {"sno":92,"name":"Soldering Machine with Wire","group":"Electronic Tools","quantity":4,"remarks":"","included":true},
  {"sno":147,"name":"First Aid Kit","group":"Safety Tools","quantity":3,"remarks":"","included":true}
]'::jsonb,
shipments = '[]'::jsonb
WHERE school_name ILIKE '%Apeejay%' AND lab_category = 'Premium';

-- ══════════════════════════════════════════════════════════════
-- VERIFY
-- ══════════════════════════════════════════════════════════════
SELECT 
  school_name, lab_category,
  jsonb_array_length(selected_items) as items,
  jsonb_array_length(COALESCE(shipments, '[]'::jsonb)) as batches
FROM form_submissions
ORDER BY created_at DESC LIMIT 10;
