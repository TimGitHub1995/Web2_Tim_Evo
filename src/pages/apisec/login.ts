import type { APIRoute } from 'astro';
import sqlite from 'better-sqlite3';
import * as path from 'path';
import jwt from 'jsonwebtoken';
import config  from '@utils/config'

const dbPath = path.resolve("./src/database/", 'hoki_DB.db');
console.log(dbPath);

export const POST: APIRoute = async ({ request }) => {
  const { username, password } = await request.json();

  let db = new sqlite(dbPath);
  const users = await db.prepare('SELECT * FROM Persons WHERE username = ? AND password = ?').all(username, password);
  db.close();
  console.log("users", users)

  if (users.length === 0) {
    return new Response(JSON.stringify({ success: "error", message: "Invalid credentials" }), { status: 401 });
  }

  const user = users[0]; 
  const payload = { id: user.id, username: user.username, admin: user.admin };
  // der Token ist verschlüsselt und kann vom Frontend nicht gelesen werden, da der Schlüssel nur dem Backend bekannt ist. 
  console.log("Payload: ",payload);

  let token = jwt.sign(payload, config.secretKey, { expiresIn: '7d' });
  console.log("Token", token);
  //  das userObj kann vom Frontend gelesen werden. 
  let userObj = { id: user.id, username: user.username, prename: user.prename, surname: user.surname, admin: user.admin };
  console.log("userObj", userObj);

  return new Response(JSON.stringify({ success: "ok", message: "login successful", token: token, user: userObj }), { status: 200 });
};