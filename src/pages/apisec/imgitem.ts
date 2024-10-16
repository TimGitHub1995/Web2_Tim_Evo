import type { APIRoute } from 'astro';
import sqlite from 'better-sqlite3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';

const dbPath = path.resolve("./src/database/", 'database.db');
const imgPath = path.resolve("./public/images/items");

function getFileSuffix(filename) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex !== -1 && lastDotIndex !== 0) {
    return filename.slice(lastDotIndex + 1);
  }
  return '';
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
   
   // Nutzer dürfen nur von einem  Nutzer mit Admin-Rechten geladen werden. Im Token ist gespeichert, ob einer Admin ist 
   if (authResult.payload.admin === 0) {
     return new Response(JSON.stringify({
       personObject: {
         success: "error",
         message: "no permission"
       }
     }))
    }
    const formData = await request.formData();
    console.log(formData);
    let imgFileName = "";
    await Promise.all(
        formData
          .getAll('image')
          .map(async (file: File) => {
            imgFileName = uuidv4() + "." + getFileSuffix(file.name);
            await writeFile(
                path.resolve(imgPath, imgFileName),
                new Uint8Array(await file.arrayBuffer())
            ) 
          })         
      );
      await Promise.all(
        formData.getAll("itemId").map(itemId => {
            console.log(itemId)
            let db = new sqlite(dbPath);
            const updates = db.prepare('UPDATE Items SET imgItem = ? WHERE id = ?')
                     .run(imgFileName, itemId); 
            db.close();
        })
      ); 
    return new Response(JSON.stringify({
        success: "ok",
        message: "image uploaded"
    }))
  }