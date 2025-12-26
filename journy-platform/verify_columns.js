
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function verifyData() {
    // 1. Get a single wine from wine_full_card
    const { data: wine, error } = await supabase
        .from('wine_full_card')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error("Error fetching wine:", error);
        return;
    }

    console.log("Win full card columns:", Object.keys(wine));

    // Check specifically for packaging fields
    const packagingFields = [
        'packaging_bottle_material',
        'packaging_closure_material',
        'packaging_label_material'
    ];

    const missing = packagingFields.filter(f => !Object.keys(wine).includes(f));

    if (missing.length > 0) {
        console.error("MISSING FIELDS IN VIEW:", missing);
    } else {
        console.log("All packaging fields present in view.");
        console.log("Sample values:", {
            bottle: wine.packaging_bottle_material,
            closure: wine.packaging_closure_material,
            label: wine.packaging_label_material
        });
    }
}

verifyData();

