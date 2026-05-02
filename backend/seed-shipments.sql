-- ══════════════════════════════════════════════════════════════
-- AeroBay: Seed Shipment Data for Dashboard Testing
-- Run this in your Supabase SQL Editor AFTER running:
--   ALTER TABLE form_submissions ADD COLUMN shipments JSONB DEFAULT '[]'::jsonb;
-- ══════════════════════════════════════════════════════════════

-- STEP 1: Add shipments to the FIRST submission (simulate "Partially Shipped")
UPDATE form_submissions
SET shipments = '[
  {
    "id": "shp-seed-001",
    "shipment_code": "SHP-20260428-AB1X",
    "date": "2026-04-28",
    "status": "Delivered",
    "notes": "First batch - Machines & heavy equipment",
    "items": [
      {"name": "Satellite Model", "qty_shipped": 1},
      {"name": "Weather Man", "qty_shipped": 1},
      {"name": "3D Printer V3 SE", "qty_shipped": 1},
      {"name": "Wind Tunnel", "qty_shipped": 1},
      {"name": "Cordless Drill Bit", "qty_shipped": 1},
      {"name": "Vernier Callipers", "qty_shipped": 1}
    ]
  },
  {
    "id": "shp-seed-002",
    "shipment_code": "SHP-20260430-CD2Y",
    "date": "2026-04-30",
    "status": "Dispatched",
    "notes": "Second batch - Electronics & consumables",
    "items": [
      {"name": "Soldering Machine with Wire", "qty_shipped": 2},
      {"name": "Glue Gun", "qty_shipped": 3},
      {"name": "3D Printer Filament", "qty_shipped": 2},
      {"name": "Robotic Arm", "qty_shipped": 1},
      {"name": "First Aid Kit", "qty_shipped": 1}
    ]
  }
]'::jsonb
WHERE id = (SELECT id FROM form_submissions ORDER BY created_at ASC LIMIT 1);

-- STEP 2: Add shipments to the SECOND submission (simulate "Fully Shipped")
UPDATE form_submissions
SET shipments = '[
  {
    "id": "shp-seed-003",
    "shipment_code": "SHP-20260425-EF3Z",
    "date": "2026-04-25",
    "status": "Delivered",
    "notes": "Complete shipment - all items in single batch",
    "items": [
      {"name": "Satellite Model", "qty_shipped": 1},
      {"name": "Weather Man", "qty_shipped": 1},
      {"name": "3D Printer V3 SE", "qty_shipped": 1},
      {"name": "Wind Tunnel", "qty_shipped": 1},
      {"name": "Drone - Programmable", "qty_shipped": 1},
      {"name": "Water Pressure Rocket Launcher", "qty_shipped": 1},
      {"name": "Air Pressure Rocket Launcher", "qty_shipped": 1},
      {"name": "Robotic Arm", "qty_shipped": 1},
      {"name": "Cordless Drill Bit", "qty_shipped": 1},
      {"name": "Vernier Callipers", "qty_shipped": 1},
      {"name": "Soldering Machine with Wire", "qty_shipped": 2},
      {"name": "Glue Gun", "qty_shipped": 3},
      {"name": "3D Printer Filament", "qty_shipped": 2},
      {"name": "First Aid Kit", "qty_shipped": 1},
      {"name": "Face Mask", "qty_shipped": 300},
      {"name": "Polycarbonate Safety Goggle", "qty_shipped": 20}
    ]
  }
]'::jsonb
WHERE id = (SELECT id FROM form_submissions ORDER BY created_at ASC LIMIT 1 OFFSET 1);

-- STEP 3: Third submission stays with NO shipments (simulate "Pending")
-- No update needed — the default '[]' handles this.

-- ══════════════════════════════════════════════════════════════
-- VERIFY: Check what the dashboard will see
-- ══════════════════════════════════════════════════════════════
SELECT 
  school_name, 
  lab_category,
  jsonb_array_length(COALESCE(shipments, '[]'::jsonb)) as shipment_count,
  CASE 
    WHEN jsonb_array_length(COALESCE(shipments, '[]'::jsonb)) = 0 THEN 'Pending'
    ELSE 'Has Shipments'
  END as status
FROM form_submissions
ORDER BY created_at ASC;
