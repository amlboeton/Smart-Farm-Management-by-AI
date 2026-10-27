import { getSupabaseClient } from './supabase';

/** Attach the current access token; Express independently verifies it with Supabase Auth. */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error('Sesi login tidak tersedia. Silakan login kembali.');
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  return fetch(input, { ...init, headers });
}
