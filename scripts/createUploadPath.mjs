import fs from 'fs';
import path from 'path';

const uploadPath = path.join(process.cwd(), 'public', 'upload');

try {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log('Ordner erstellt:', uploadPath);
  }
} catch (err) {
  console.error('Fehler beim Erstellen des Ordners:', err);
}