import type { APIRoute } from 'astro';
import sqlite from 'better-sqlite3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';


const dbPath = path.resolve('./src/database/', 'hoki_DB.db');
console.log(dbPath);

export const GET: APIRoute = async ({ params, request }) => {
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
  console.log("POST ITEMS")
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
  // überprüfen, ob alle Daten vorhanden sind. 
  // Die Daten werden in dem Body übertragen. 
  // Diese Daten im Body lassen sich durch umwandeln 
  // des JSON Strings 
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
  // überprüfen, ob alle Daten vorhanden sind. 
  // Die Daten werden in dem Body übertragen. 
  // Diese Daten im Body lassen sich durch umwandeln 
  // des JSON Strings 
  let id = request.headers.get("id"); 
  if (id !== null) {
      let db = new sqlite(dbPath);
      // Die Zeile mit der ID löschen mit DELETE
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

