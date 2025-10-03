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

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user.
 *     description: Registers a new user by creating an account in Supabase and an alumni profile in Sanity.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *               - batch
 *               - major
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's chosen password.
 *               fullName:
 *                 type: string
 *                 description: The user's full name.
 *               batch:
 *                 type: integer
 *                 description: The user's graduation batch/year.
 *               major:
 *                 type: string
 *                 description: The user's major.
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 userId:
 *                   type: string
 *                   description: The ID of the user in Supabase.
 *                 sanityId:
 *                   type: string
 *                   description: The ID of the alumni document in Sanity.
 *       400:
 *         description: Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing required fields
 *       500:
 *         description: Internal Server Error or Supabase sign-up error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
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
