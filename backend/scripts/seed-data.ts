/**
 * Seed script — Updates ALL form_submissions with complete catalog items
 * and adds realistic shipment data to specific schools.
 *
 * This version ensures:
 * 1. EVERY submission gets its full category list (all items included: true).
 * 2. Specific schools are marked as Fulfilled, Partial, or Pending.
 */

import { createClient } from '@supabase/supabase-js';
import { LAB_DATA } from '../../src/data/labItems';
import type { LabCategoryName } from '../../src/types';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!url || !key) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

/** Build the full selected_items array for a given category */
function buildFullItemList(category: LabCategoryName) {
  const groups = LAB_DATA[category] || [];
  return groups.flatMap(g =>
    g.items.map(item => ({
      sno: item.sno,
      name: item.name,
      group: g.group,
      quantity: item.qty,
      remarks: '',
      included: true // All items selected by default as requested
    }))
  );
}

async function seed() {
  console.log('🔄 Fetching all submissions...');
  
  const { data: submissions, error } = await supabase
    .from('form_submissions')
    .select('id, school_name, lab_category')
    .order('created_at', { ascending: false });

  if (error) { console.error('❌ Fetch failed:', error.message); process.exit(1); }
  
  console.log(`📦 Found ${submissions.length} submissions. Processing...`);

  for (const sub of submissions) {
    const category = sub.lab_category as LabCategoryName;
    const fullItemList = buildFullItemList(category);
    
    // Determine shipments based on school name
    let shipments: any[] = [];
    const schoolName = sub.school_name.toLowerCase();

    if (schoolName.includes('columba')) {
      // FULLY FULFILLED (Completed)
      shipments = [{
        id: 'shp-full-001',
        shipment_code: 'SHP-BASIX-FULL',
        date: new Date().toISOString().split('T')[0],
        status: 'Delivered',
        notes: 'Full Basix lab tier delivered and verified.',
        items: fullItemList.map(i => ({ name: i.name, qty_shipped: i.quantity }))
      }];
    } else if (schoolName.includes('apeejay') && category === 'Premium') {
      // ANOTHER COMPLETED ONE (Premium)
      shipments = [{
        id: 'shp-full-002',
        shipment_code: 'SHP-PREM-FULL',
        date: new Date().toISOString().split('T')[0],
        status: 'Delivered',
        notes: 'Complete Premium tier consignment delivered.',
        items: fullItemList.map(i => ({ name: i.name, qty_shipped: i.quantity }))
      }];
    } else if (schoolName.includes('dav public')) {
      // PARTIAL
      const half = Math.ceil(fullItemList.length / 2);
      shipments = [{
        id: 'shp-part-001',
        shipment_code: 'SHP-STD-PART1',
        date: new Date().toISOString().split('T')[0],
        status: 'Delivered',
        notes: 'Initial batch of machines and tools.',
        items: fullItemList.slice(0, half).map(i => ({ name: i.name, qty_shipped: i.quantity }))
      }];
    } else if (schoolName.includes('amity')) {
      // PARTIAL
      const third = Math.ceil(fullItemList.length / 3);
      shipments = [{
        id: 'shp-part-002',
        shipment_code: 'SHP-PREM-PART1',
        date: new Date().toISOString().split('T')[0],
        status: 'Dispatched',
        notes: 'First 1/3 of premium items en route.',
        items: fullItemList.slice(0, third).map(i => ({ name: i.name, qty_shipped: i.quantity }))
      }];
    }
    // Others stay at [] (Pending)

    console.log(`  Updating ${sub.school_name} (${category})...`);
    const { error: updateError } = await supabase
      .from('form_submissions')
      .update({ 
        selected_items: fullItemList,
        shipments: shipments
      })
      .eq('id', sub.id);

    if (updateError) {
      console.error(`    ❌ Failed: ${updateError.message}`);
    }
  }

  console.log('\n🎉 Seed complete! All submissions updated with full category items.');
}

seed().catch(console.error);
