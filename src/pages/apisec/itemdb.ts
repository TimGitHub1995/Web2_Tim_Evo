import type { APIRoute } from 'astro';
import sqlite from 'better-sqlite3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { authenticateToken } from '@utils/authentication';

const dbPath = path.resolve('./src/database/', 'database.db');
console.log(dbPath);

export const GET: APIRoute = async ({ params, request }) => {
  // header auslesen
  const authHeader = request.headers.get('authorization');
  // entschlüsseln
  const authResult = authenticateToken(authHeader);
  // prüfen, ob der token gültig ist
  if (!authResult.valid) {
    return new Response(JSON.stringify({ success: "error", message: "not logged in" }), { status: authResult.error === 'Unauthorized' ? 401 : 403 });
  }

  let db = new sqlite(dbPath);
  let itemsFromDb = await db.prepare('SELECT * FROM Items').all();
  db.close();
  return new Response(JSON.stringify({
        items: itemsFromDb, 
        success: "ok",
        message: ""
    }
  ))
}

export const POST: APIRoute = async ({ params, request }) => {
  const authHeader = request.headers.get('authorization');
  const authResult = authenticateToken(authHeader);
  if (!authResult.valid) {
    return new Response(JSON.stringify({ success: "error", message: "not logged in" }), { status: authResult.error === 'Unauthorized' ? 401 : 403 });
  }
  
  let item = await request.json();
  console.log(item);
  if ( item.hasOwnProperty("name")
    && item.hasOwnProperty("category")
    && item.hasOwnProperty("isAvailable")) {
      let id = uuidv4();
      let now = dayjs().unix(); 
      let db = new sqlite(dbPath);
      let added = db.prepare("INSERT INTO Items (id, name, category, isAvailable, createdAt, updatedAt) VALUES (?,?,?,?,?,?)")
                  .run(id, item.name, item.category, item.isAvailable, now, now);
      db.close();
      return new Response(JSON.stringify({
          success: "ok",
          message: "item added"
      }))
    } else {
      return new Response(
        JSON.stringify({   
            success: "error",
            message: "attributes missing"
        }),{
          // Fehler-Fall gibt Status 400 zurück. 
          status : 400
        })
    }
}

export const PUT: APIRoute = async ({ params, request }) => {
  const authHeader = request.headers.get('authorization');
  const authResult = authenticateToken(authHeader);
  if (!authResult.valid) {
    return new Response(JSON.stringify({ success: "error", message: "not logged in" }), { status: authResult.error === 'Unauthorized' ? 401 : 403 });
  }

  let item = await request.json();
  if ( item.hasOwnProperty("id")
    && item.hasOwnProperty("name")
    && item.hasOwnProperty("category")
    && item.hasOwnProperty("isAvailable")) 
    {
      let now = dayjs().unix(); 
      let db = new sqlite(dbPath);
      const updates = db.prepare('UPDATE Items SET name = ?, category = ?, isAvailable = ?, updatedAt = ? WHERE id = ?')
                     .run(item.name, item.category, item.isAvailable, now, item.id); 
      db.close();
      return new Response(JSON.stringify({
          items: updates, 
          success: "ok",
          errorMessage: "item updated"
      }))
    } else {
      return new Response(
        JSON.stringify({   
            success: "error",
            message: "attributes missing"
        }),{
          // Fehler-Fall gibt Status 400 zurück. 
          status : 400
        })
    }
}

export const DELETE: APIRoute = async ({ params, request }) => {
  const authHeader = request.headers.get('authorization');
  const authResult = authenticateToken(authHeader);
  if (!authResult.valid) {
    return new Response(JSON.stringify({ success: "error", message: "not logged in" }), { status: authResult.error === 'Unauthorized' ? 401 : 403 });
  }

  let id = request.headers.get("id"); 
  if (id !== null) {
      let db = new sqlite(dbPath);
      const deleted = db.prepare('DELETE FROM Items WHERE id = ?').run(id);
      db.close();
      return new Response(JSON.stringify({
          items: deleted, 
          success: "ok",
          message: "item deleted"
      }))
    } else {
      return new Response(
        JSON.stringify({   
            success: "error",
            message: "attributes missing"
        }),{
          // Fehler-Fall gibt Status 400 zurück. 
          status : 400
        })
    }
}

