import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSanityClient } from 'next-sanity';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Sanity client for writing
const sanityClient = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03', // Use a consistent API version
  token: process.env.SANITY_API_TOKEN, // A token with write permissions
  useCdn: false, // Don't use CDN for writing
});

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, batch, major } = await req.json();

    if (!email || !password || !fullName || !batch || !major) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Sign up user in Supabase
    const { data: user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 500 });
    }

    // 2. Create alumni profile in Sanity
    const slug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');

    const alumniDoc = {
      _type: 'alumni',
      fullName,
      slug: {
        _type: 'slug',
        current: slug,
      },
      batch,
      major,
      email,
      isVerified: false, // Default to false, can be verified later in Sanity Studio
    };

    const { _id: sanityId } = await sanityClient.create(alumniDoc);

    return NextResponse.json({ message: 'User registered successfully', userId: user?.user?.id, sanityId }, { status: 201 });

  } catch (error: any) {
    console.error('Sign-up API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
