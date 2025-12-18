import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

//when users upload photos to the platform the files goes to blob as a url and the url is stored in the database Supabase. THis update-avatar tells Supabase where to store the file

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const type = searchParams.get('type'); // e.g., 'producer', 'distributor', 'wine'
  const id = searchParams.get('id');     // The GTIN or the UUID

  if (!filename || !type || !id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // 1. Upload to Vercel Blob (organizing files into folders)
  const blob = await put(`${type}/${filename}`, request.body!, {
    access: 'public',
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 2. Logic to route the URL to the correct table/column
  let result;
  
  if (type === 'producer') {
    result = await supabase
      .from('producer')
      .update({ profile_image_url: blob.url })
      .eq('id', id);
  } 
  else if (type === 'wine') {
    result = await supabase
      .from('product_wine')
      .update({ product_image_url: blob.url })
      .eq('gtin', id);
  }
  // ... inuti din POST function i route.ts ...

  else if (type === 'certificate') {
    // 1. Hämta alla parametrar
    const certificateId = searchParams.get('certificateId');
    const refNumber = searchParams.get('refNumber') || 'PENDING';
    const expiryDate = searchParams.get('expiryDate');
    
    // Hämta specifika ID:n från URL:en
    const producerId = searchParams.get('producerId');
    const distributorId = searchParams.get('distributorId');
    
    // Identifiera vem som laddar upp (för uploaded_by_id)
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Spara i owner_certificate_instance
    result = await supabase
      .from('owner_certificate_instance')
      .upsert({ 
        certificate_id: certificateId, 
        reference_number: refNumber,
        expiry_date: expiryDate,
        verification_document_url: blob.url,
        uploaded_by_id: user?.id,      // Den faktiska inloggade användaren
        producer_id: producerId || null,
        distributor_id: distributorId || null
      }, { 
        // Denna matchar din Composite Primary Key
        onConflict: 'certificate_id, producer_id, distributor_id' 
      });
}

  if (result?.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json(blob);
}