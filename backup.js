const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); // For running pg_dump

const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

async function backupPostgreSQL() {
  const dbName = process.env.DB_NAME || 'adhavansilks_db';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 5432;
  const dbPassword = process.env.DB_PASSWORD;

  const backupFileName = `adhavansilks_db-${timestamp}.sql`;
  const backupFilePath = path.join(backupDir, backupFileName);

  // Set PGPASSWORD for pg_dump
  process.env.PGPASSWORD = dbPassword;

  const pgDumpCommand = `pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -F p -d ${dbName} > "${backupFilePath}"`;

  console.log('Starting PostgreSQL database backup...');
  exec(pgDumpCommand, (error, stdout, stderr) => {
    // Unset PGPASSWORD for security
    delete process.env.PGPASSWORD;

    if (error) {
      console.error(`PostgreSQL backup failed: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`pg_dump stderr: ${stderr}`);
    }
    console.log(`PostgreSQL database backed up to ${backupFilePath}`);
  });
}

// Removed SQLite backup logic
// const dbSrc = path.join(__dirname, 'sarees.db');
// const dbDest = path.join(backupDir, `sarees-${timestamp}.db`);
// fs.copyFileSync(dbSrc, dbDest);
// console.log(`Database backed up to ${dbDest}`);

// Backup uploads directory
const uploadsSrc = path.join(__dirname, 'uploads');
const uploadsDest = path.join(backupDir, `uploads-${timestamp}`);
if (fs.existsSync(uploadsSrc)) {
  fs.cpSync(uploadsSrc, uploadsDest, { recursive: true });
  console.log(`Uploads backed up to ${uploadsDest}`);
} else {
  console.log('No uploads directory found to back up.');
}

// Call the backup function for PostgreSQL
backupPostgreSQL(); 