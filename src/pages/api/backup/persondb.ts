import type { APIRoute } from 'astro';
import sqlite from 'better-sqlite3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';


const dbPath = path.resolve("./src/database/", 'hoki_DB.db');
console.log(dbPath);

export const GET: APIRoute = async ({ params, request }) => {
  let db = new sqlite(dbPath);
  let personsFromDb = await db.prepare('SELECT prename, surname, city, age, username, img FROM Persons').all();
//  console.log("----->", personsFromDb);
  db.close();
  return new Response(JSON.stringify({
      personObject: {
        persons: personsFromDb, 
        success: "ok",
        message: ""
      }
    }
  ))
}

export const POST: APIRoute = async ({ params, request }) => {
  let person = await request.json();
  if ( person.hasOwnProperty("prename")
    && person.hasOwnProperty("surname")
    && person.hasOwnProperty("age")
    && person.hasOwnProperty("city")) {
      let id = uuidv4();
      let now = dayjs().unix(); 
//     console.log(now);
      let db = new sqlite(dbPath);
      let added = db.prepare("INSERT INTO Persons (id, prename, surname, age, city, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)")
                  .run(id, person.prename, person.surname, person.age, person.city, now, now);
      db.close();
      return new Response(JSON.stringify({
        personObject: {
          persons: added, 
          success: "ok",
          message: "person added"
        }
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
  let person = await request.json();
  if ( person.hasOwnProperty("id")
    && person.hasOwnProperty("prename")
    && person.hasOwnProperty("surname")
    && person.hasOwnProperty("age")
    && person.hasOwnProperty("city")) {
      let now = dayjs().unix(); 
      let db = new sqlite(dbPath);
      const updates = db.prepare('UPDATE Persons SET prename = ?, surname = ?, age = ?, city = ?, updatedAt = ? WHERE id = ?')
                     .run(person.prename, person.surname, person.age, person.city, now, person.id); 
      db.close();
      return new Response(JSON.stringify({
        personObject: {
          persons: updates, 
          success: "ok",
          errorMessage: "person updated"
        }
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
      const deleted = db.prepare('DELETE FROM Persons WHERE id = ?').run(id);
      db.close();
      return new Response(JSON.stringify({
        personObject: {
          persons: deleted, 
          success: "ok",
          message: "person deleted"
        }
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

