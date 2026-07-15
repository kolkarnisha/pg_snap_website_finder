import { supabase } from './supabase';

// ─── AUTH ─────────────────────────────────────────────────────────────────────

/** Sign up with email and password */
export async function signUp({ email, password, name, role }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
    },
  });
  if (error) throw error;

  // Save profile to profiles table
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      name,
      email,
      role,
    });
  }
  return data;
}

/** Sign in with email and password */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Sign in with Google OAuth */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
  return data;
}

/** Sign out */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Get current user */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/** Get current session */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/** Listen to auth changes */
export function onAuthChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

// ─── PROFILES ─────────────────────────────────────────────────────────────────

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

// ─── PG LISTINGS ──────────────────────────────────────────────────────────────

/** Fetch all PG listings */
export async function getPGListings() {
  const { data, error } = await supabase
    .from('pg_listings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/** Fetch single PG by ID */
export async function getPGById(id) {
  const { data, error } = await supabase
    .from('pg_listings')
    .select('*, pg_reviews(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

/** Create a new PG listing */
export async function createPGListing(pgData) {
  const { data, error } = await supabase
    .from('pg_listings')
    .insert([pgData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

/** Create a new booking */
export async function createBooking(bookingData) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Get bookings for current user */
export async function getUserBookings(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, pg_listings(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

/** Add a review */
export async function addReview({ pgId, userId, rating, text, author }) {
  const { data, error } = await supabase
    .from('pg_reviews')
    .insert([{ pg_id: pgId, user_id: userId, rating, text, author }])
    .select()
    .single();
  if (error) throw error;
  return data;
}
