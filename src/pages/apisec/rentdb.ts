import type { APIRoute } from 'astro';
import sqlite from 'better-sqlite3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { authenticateToken } from '@utils/authentication';


const dbPath = path.resolve("./src/database/", 'hoki_DB.db');
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

  let personId = request.headers.get("id"); 
  if (personId !== null) {
    let db = new sqlite(dbPath);
    // Die Abfrage muss nur die eigenen Rents enthalten. Es sollen nur die eigenen Ausleihen angesehen werden können. 
    let rentsFromDb = await db.prepare('SELECT Rents.id AS rentId, * FROM Rents LEFT JOIN Items ON Rents.itemId = Items.id WHERE personId = ? ORDER BY endDate DESC').all(personId);
    db.close();
    return new Response(JSON.stringify({
          rents: rentsFromDb, 
          success: "ok",
          message: ""})) 
  } else {
    return new Response(JSON.stringify({
      success: "error",
      message: "attribute missing"}));
  }
}

export const POST: APIRoute = async ({ params, request }) => {
  // header auslesen
  const authHeader = request.headers.get('authorization');
  // entschlüsseln
  const authResult = authenticateToken(authHeader);
  // prüfen, ob der token gültig ist
  if (!authResult.valid) {
    return new Response(JSON.stringify({ success: "error", message: "not logged in" }), { status: authResult.error === 'Unauthorized' ? 401 : 403 });
  }

  let rent = await request.json();
  if ( rent.hasOwnProperty("personId")
    && rent.hasOwnProperty("itemId")
    // Muss Unix Time Stamp als Number sein
    && rent.hasOwnProperty("startDate")
    // Muss Unix Time Stamp als Number sein
    && rent.hasOwnProperty("endDate")
    && rent.hasOwnProperty("message")) {
      let id = uuidv4();
      let now = dayjs().unix();
      let db = new sqlite(dbPath);
      let added = db.prepare("INSERT INTO Rents (id, personId, itemId, startDate, endDate, message, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?)")
                  .run(id, rent.personId, rent.itemId, rent.startDate, rent.endDate, rent.message, now, now);
      db.close();
      return new Response(JSON.stringify({
          rents: added, 
          success: "ok",
          message: "rent added"
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
  // header auslesen
  const authHeader = request.headers.get('authorization');
  // entschlüsseln
  const authResult = authenticateToken(authHeader);
  // prüfen, ob der token gültig ist
  if (!authResult.valid) {
    return new Response(JSON.stringify({ success: "error", message: "not logged in" }), { status: authResult.error === 'Unauthorized' ? 401 : 403 });
  }

  let rent = await request.json();
  if ( rent.hasOwnProperty("id")
    && rent.hasOwnProperty("personId")
    && rent.hasOwnProperty("itemId")
    // Muss Unix Time Stamp als Number sein
    && rent.hasOwnProperty("startDate")
    // Muss Unix Time Stamp als Number sein
    && rent.hasOwnProperty("endDate")
    && rent.hasOwnProperty("message")) {
      let now = dayjs().unix(); 
      let db = new sqlite(dbPath);
      const updates = db.prepare('UPDATE Rents SET personId = ?, itemId = ?, startDate = ?, endDate = ?, message = ?, updatedAt = ? WHERE id = ?')
                     .run(rent.personId, rent.itemId, rent.startDate, rent.endDate, rent.message, now, rent.id); 
      db.close();
      return new Response(JSON.stringify({
          rents: updates, 
          success: "ok",
          message: "person updated"
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
  // header auslesen
  const authHeader = request.headers.get('authorization');
  // entschlüsseln
  const authResult = authenticateToken(authHeader);
  // prüfen, ob der token gültig ist
  if (!authResult.valid) {
    return new Response(JSON.stringify({ success: "error", message: "not logged in" }), { status: authResult.error === 'Unauthorized' ? 401 : 403 });
  }

  let id = request.headers.get("id"); 
  if (id !== null) {
      let db = new sqlite(dbPath);
      // Die Zeile mit der ID löschen mit DELETE
      const deleted = db.prepare('DELETE FROM Rents WHERE id = ?').run(id);
      db.close();
      return new Response(JSON.stringify({
          rents: deleted, 
          success: "ok",
          message: "person deleted"
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

