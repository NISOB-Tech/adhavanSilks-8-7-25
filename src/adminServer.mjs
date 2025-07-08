import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from 'cors';  // ✅ ADD THIS

dotenv.config();

const app = express();

app.use(cors());  // ✅ ADD THIS — it should come right after creating `app`
app.use(bodyParser.json());

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

const failedAttempts = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD
  }
});

function sendSecurityAlert(username) {
  const mailOptions = {
    from: process.env.ALERT_EMAIL,
    to: process.env.SECURITY_TEAM_EMAIL,
    subject: `⚠️ Security Alert: Multiple failed logins`,
    text: `There have been more than 3 failed login attempts for username: ${username}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error('Error sending alert email:', err);
    else console.log('Alert email sent:', info.response);
  });
}

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  console.log(`Received login attempt: ${username}, ${password}`); // ✅ For debugging

  if (!failedAttempts[username]) failedAttempts[username] = { count: 0 };

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    failedAttempts[username].count = 0;
    return res.json({ success: true, message: 'Login successful' });
  } else {
    failedAttempts[username].count += 1;

    if (failedAttempts[username].count > 3) {
      sendSecurityAlert(username);
    }

    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

app.listen(3001, () => {
  console.log('✅ Server running at http://localhost:3001');
  console.log('ADMIN_USER:', ADMIN_USER);
  console.log('ADMIN_PASS:', ADMIN_PASS);
});


