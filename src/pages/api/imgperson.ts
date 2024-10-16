import type { APIRoute } from 'astro';
import sqlite from 'better-sqlite3';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';

const dbPath = path.resolve("./src/database/", 'database.db');
const imgPath = path.resolve("./public/images/persons");

function getFileSuffix(filename) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex !== -1 && lastDotIndex !== 0) {
    return filename.slice(lastDotIndex + 1);
  }
  return '';
}

export const POST: APIRoute = async ({ params, request }) => {
    console.log("POST")
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
        formData.getAll("personId").map(personId => {
            console.log(personId)
            let db = new sqlite(dbPath);
            const updates = db.prepare('UPDATE Persons SET img = ? WHERE id = ?')
                     .run(imgFileName, personId); 
            db.close();
        })
      ); 
    return new Response(JSON.stringify({
        success: "ok",
        message: "image uploaded"
    }))
  }