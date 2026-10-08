/**
 * My Stewardship Check → Google Sheets
 *
 * Paste this into Extensions › Apps Script of your Google Sheet,
 * then Deploy › New deployment › Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the Web app URL (ends in /exec) into SHEET_URL in index.html.
 *
 * Each submission has an ID. If someone taps "Edit answers" and finishes
 * again, their existing row is updated instead of adding a duplicate.
 */

const SHEET_NAME = 'Responses'; // tab name; created automatically if missing
const HEADERS = [
  'Timestamp', 'Name',
  '1. What has been entrusted to me?',
  '2. What am I doing well?',
  '3. Where is my stewardship gap?',
  '4. What would a steward do?',
  '5. What will I do? (7-day commitment)',
  'Submission ID', 'Device'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const p = (e && e.parameter) || {};
    const sheet = getSheet_();
    const clean = v => String(v || '').slice(0, 2000).replace(/^[=+\-@]/, "'$&"); // block formula injection
    const id = clean(p.id) || Utilities.getUuid();

    const row = [
      new Date(),
      clean(p.name) || '(no name)',
      clean(p.q1), clean(p.q2), clean(p.q3), clean(p.q4), clean(p.q5),
      id,
      clean(p.userAgent)
    ];

    // Update existing row with the same Submission ID, else append.
    const idCol = HEADERS.indexOf('Submission ID') + 1;
    const last = sheet.getLastRow();
    let target = 0;
    if (last > 1) {
      const ids = sheet.getRange(2, idCol, last - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (ids[i][0] === id) { target = i + 2; break; }
      }
    }
    if (target) {
      sheet.getRange(target, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the /exec URL in a browser to confirm it's live.
function doGet() {
  return ContentService.createTextOutput('Stewardship Check endpoint is running.');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}
