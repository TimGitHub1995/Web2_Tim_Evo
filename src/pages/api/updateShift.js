import { updateShift } from '../../../utils/fetchShiftData.js';

export async function post({ request }) {
  const { schicht_id, nachname, vorname, universität, arbeitstag } = await request.json();
  updateShift(schicht_id, nachname, vorname, universität, arbeitstag);
  return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
}