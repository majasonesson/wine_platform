
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkPackaging() {
    // Get defining row from wine_packaging if possible
    const { data, error } = await supabase
        .from('wine_packaging')
        .select('*')
        .limit(1);

    if (error) {
        console.log("Error checking wine_packaging:", error.message);
    } else if (data && data.length > 0) {
        console.log("wine_packaging columns:", Object.keys(data[0]));
    } else {
        console.log("wine_packaging table empty or access denied, but no error.");
    }
}

checkPackaging();

