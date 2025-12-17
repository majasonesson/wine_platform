import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
  else if (type === 'certificate') {
    result = await supabase
      .from('owner_certificate_instance')
      .update({ verification_document_url: blob.url })
      .eq('id', id); // Note: check if you use 'id' or a composite key here
  }

  if (result?.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json(blob);
}