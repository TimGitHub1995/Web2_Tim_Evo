import Database from 'better-sqlite3';
import path from 'path';

// Funktion zum Abrufen der Schichtdaten
export function fetchShiftData() {
  // Verbindung zur Datenbank herstellen, Dateipfad verwenden
  const db = new Database(path.resolve('./src/database/hoki_DB.db'), { readonly: true });

  // Daten abfragen
  const rows = db.prepare('SELECT nachname, vorname, universität, schicht_id FROM mitarbeiter').all();

  // Datenbank schließen
  db.close();

  // Daten zurückgeben
  return rows;
}
