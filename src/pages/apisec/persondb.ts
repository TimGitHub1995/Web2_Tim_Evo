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
  
 // Nutzer dürfen nur von einem  Nutzer mit Admin-Rechten geladen werden. Im Token ist gespeichert, ob einer Admin ist 
 if (authResult.payload.admin === 0) {
  return new Response(JSON.stringify({
    personObject: {
      success: "error",
      message: "no permission"
    }
  }))
  }

  // authentication valid, send data 
  let db = new sqlite(dbPath);
  let personsFromDb = await db.prepare('SELECT id, prename, surname, city, age, username, img, admin FROM Persons').all();
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
  // header auslesen
  const authHeader = request.headers.get('authorization');
  // entschlüsseln
  const authResult = authenticateToken(authHeader);
  // prüfen, ob der token gültig ist
  if (!authResult.valid) {
    return new Response(JSON.stringify({ success: "error", message: "not logged in" }), { status: authResult.error === 'Unauthorized' ? 401 : 403 });
  }

  // Neue Nutzer anlegen darf nur ein Nutzer mit Admin-Rechten. Im Token ist gespeichert, ob einer Admin ist 
  if (authResult.payload.admin === 0) {
    return new Response(JSON.stringify({
      personObject: {
        success: "error",
        message: "no permission"
      }
    }))
  }

  let person = await request.json();
  console.log("Person", person);
   
  if ( person.hasOwnProperty("username")
    && person.hasOwnProperty("password")
    && person.hasOwnProperty("prename")
    && person.hasOwnProperty("surname")
    && person.hasOwnProperty("age")
    && person.hasOwnProperty("city")) {
      let id = uuidv4();
      let now = dayjs().unix(); 
      let db = new sqlite(dbPath);
      let added = db.prepare("INSERT INTO Persons (id, prename, surname, age, city, username, password, admin, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)")
                  .run(id, person.prename, person.surname, person.age, person.city, person.username, person.password, 0, now, now);
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
  const authHeader = request.headers.get('authorization');
  const authResult = authenticateToken(authHeader);
  if (!authResult.valid) {
    return new Response(JSON.stringify({ success: "error", message: "not logged in" }), { status: authResult.error === 'Unauthorized' ? 401 : 403 });
  }

  // Ändern von Nutzern anlegen darf nur ein Nutzer mit Admin-Rechten. Im Token ist gespeichert, ob einer Admin ist 
  if (authResult.payload.admin === 0) {
    return new Response(JSON.stringify({
      personObject: {
        success: "error",
        message: "no permission"
      }
    }))
  }

  let person = await request.json();
  if ( person.hasOwnProperty("id")
    && person.hasOwnProperty("prename")
    && person.hasOwnProperty("surname")
    && person.hasOwnProperty("age")
    && person.hasOwnProperty("city")
    && person.hasOwnProperty("admin")) {
      let now = dayjs().unix(); 
      let db = new sqlite(dbPath);
      const updates = db.prepare('UPDATE Persons SET prename = ?, surname = ?, age = ?, city = ?, admin=?, updatedAt = ? WHERE id = ?')
                     .run(person.prename, person.surname, person.age, person.city, person.admin, now, person.id); 
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
  const authHeader = request.headers.get('authorization');
  const authResult = authenticateToken(authHeader);
  if (!authResult.valid) {
    return new Response(JSON.stringify({ success: "error", message: "not logged in" }), { status: authResult.error === 'Unauthorized' ? 401 : 403 });
  }

  // Löschen von Nutzern anlegen darf nur ein Nutzer mit Admin-Rechten. Im Token ist gespeichert, ob einer Admin ist 
  if (authResult.payload.admin === 0) {
    return new Response(JSON.stringify({
      personObject: {
        success: "error",
        message: "no permission"
      }
    }))
  }

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

