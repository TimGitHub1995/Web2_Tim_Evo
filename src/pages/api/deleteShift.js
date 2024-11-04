import { deleteShift } from '../../../utils/fetchShiftData.js';

export async function post({ request }) {
  const { schicht_id } = await request.json();
  deleteShift(schicht_id);
  return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
}