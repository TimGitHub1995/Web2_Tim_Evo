import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('./src/database/hoki_DB.db');

// Funktion zum Abrufen der Schichtdaten
export function fetchShiftData() {
  const db = new Database(dbPath, { readonly: true });
  const rows = db.prepare('SELECT nachname, vorname, universität, schicht_id FROM mitarbeiter').all();
  db.close();
  return rows;
}

// Funktion zum Erstellen einer neuen Schicht
export function createShift(nachname, vorname, universität, arbeitstag) {
  const db = new Database(dbPath);
  const stmt = db.prepare('INSERT INTO mitarbeiter (nachname, vorname, universität, arbeitstag) VALUES (?, ?, ?, ?)');
  stmt.run(nachname, vorname, universität, arbeitstag);
  db.close();
}

// Funktion zum Aktualisieren einer Schicht
export function updateShift(schicht_id, nachname, vorname, universität, arbeitstag) {
  const db = new Database(dbPath);
  const stmt = db.prepare('UPDATE mitarbeiter SET nachname = ?, vorname = ?, universität = ?, arbeitstag = ? WHERE schicht_id = ?');
  stmt.run(nachname, vorname, universität, arbeitstag, schicht_id);
  db.close();
}

// Funktion zum Löschen einer Schicht
export function deleteShift(schicht_id) {
  const db = new Database(dbPath);
  const stmt = db.prepare('DELETE FROM mitarbeiter WHERE schicht_id = ?');
  stmt.run(schicht_id);
  db.close();
}