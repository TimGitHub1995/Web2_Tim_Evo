import { createShift } from '../../../utils/fetchShiftData.js';

export async function post({ request }) {
  const { nachname, vorname, universität, arbeitstag } = await request.json();
  createShift(nachname, vorname, universität, arbeitstag);
  return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
}