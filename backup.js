const fs = require('fs');
const path = require('path');

const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

// Backup database
const dbSrc = path.join(__dirname, 'sarees.db');
const dbDest = path.join(backupDir, `sarees-${timestamp}.db`);
fs.copyFileSync(dbSrc, dbDest);
console.log(`Database backed up to ${dbDest}`);

// Backup uploads directory
const uploadsSrc = path.join(__dirname, 'uploads');
const uploadsDest = path.join(backupDir, `uploads-${timestamp}`);
if (fs.existsSync(uploadsSrc)) {
  fs.cpSync(uploadsSrc, uploadsDest, { recursive: true });
  console.log(`Uploads backed up to ${uploadsDest}`);
} else {
  console.log('No uploads directory found to back up.');
} 