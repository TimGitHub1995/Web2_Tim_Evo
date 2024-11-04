import type { APIRoute } from 'astro';
import sqlite from 'better-sqlite3';
import * as path from 'path';

const dbPath = path.resolve("./src/database/", "hoki_DB.db");
console.log(dbPath);

export const GET: APIRoute = ({ params, request }) => {
  let db = new sqlite(dbPath , sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
  });
//  let resultPerson = db.exec("CREATE TABLE IF NOT EXISTS Persons ('id' TEXT NOT NULL, 'prename' TEXT NOT NULL DEFAULT '', 'surname' TEXT NOT NULL DEFAULT '', 'city' TEXT NOT NULL DEFAULT '', 'age' INT NOT NULL DEFAULT 0, 'img' TEXT NOT NULL DEFAULT '', 'createdAt' INT NOT NULL DEFAULT 0, updatedAt INT NOT NULL DEFAULT 0)");
//  console.log(resultPerson);
  let addPerson = db.exec("ALTER TABLE Persons ADD COLUMN username TEXT NOT NULL DEFAULT ''");
  console.log(addPerson);
  addPerson = db.exec("ALTER TABLE Persons ADD COLUMN password TEXT NOT NULL DEFAULT ''");
  console.log(addPerson);
  addPerson = db.exec("ALTER TABLE Persons ADD COLUMN admin INT NOT NULL DEFAULT 0");
  console.log(addPerson);
//  let resultItem = db.exec("CREATE TABLE IF NOT EXISTS Items ('id' TEXT NOT NULL, 'name' TEXT NOT NULL DEFAULT '', 'category' TEXT NOT NULL DEFAULT '', 'isAvailable' INT NOT NULL DEFAULT 1, 'imgItem' TEXT NOT NULL DEFAULT '', 'createdAt' INT NOT NULL DEFAULT 0, updatedAt INT NOT NULL DEFAULT 0)");
//  console.log(resultItem);
//  let resultRent = db.exec("CREATE TABLE IF NOT EXISTS Rents ('id' TEXT NOT NULL, 'message' TEXT NOT NULL DEFAULT '', 'personId' TEXT NOT NULL DEFAULT '', 'itemId' TEXT NOT NULL DEFAULT 1, startDate INT NOT NULL DEFAULT 0, endDate INT NOT NULL DEFAULT 0, endDateBringBack INT NOT NULL DEFAULT 0, 'img' TEXT NOT NULL DEFAULT '', 'createdAt' INT NOT NULL DEFAULT 0, updatedAt INT NOT NULL DEFAULT 0)");
//  console.log(resultRent);
  db.close();
  return new Response(JSON.stringify({ success: "ok", message: "Database initialized" }));
}