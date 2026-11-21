/**
 * Secret Santa shared wish list — Google Apps Script backend.
 *
 * Paste this whole file into Extensions → Apps Script of your Google Sheet,
 * change ADMIN_PASSWORD below, then deploy as a Web app (see SETUP.md).
 * The password lives only here in your private script, never in the public page.
 */

const ADMIN_PASSWORD = 'change-me';   // <-- pick your own password

const SHEET_NAME = 'Wishes';
const HEADERS = ['id', 'name', 'wish1', 'wish2', 'wish3', 'updated'];
const FIELDS = ['name', 'wish1', 'wish2', 'wish3'];
const MIN_ROWS = 5;
const MAX_ROWS = 100;
const MAX_LEN = 200;

function doGet() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return json_({ ok: true, rows: listRows_(getSheet_()) });
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad_request' }); }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = getSheet_();
    switch (req.action) {
      case 'list':
        break;

      case 'update': {
        const col = FIELDS.indexOf(req.field);
        const row = findRow_(sh, req.id);
        if (col === -1 || !row) return json_({ ok: false, error: 'not_found', rows: listRows_(sh) });
        sh.getRange(row, col + 2).setValue(clean_(req.value));
        sh.getRange(row, 6).setValue(new Date());
        break;
      }

      case 'add':
        if (sh.getLastRow() - 1 >= MAX_ROWS) return json_({ ok: false, error: 'too_many', rows: listRows_(sh) });
        sh.appendRow([Utilities.getUuid(), '', '', '', '', new Date()]);
        break;

      case 'delete': {
        if (!checkPassword_(req.password)) return json_({ ok: false, error: 'bad_password' });
        const row = findRow_(sh, req.id);
        if (row && sh.getLastRow() - 1 > MIN_ROWS) sh.deleteRow(row);
        break;
      }

      case 'clear': {
        if (!checkPassword_(req.password)) return json_({ ok: false, error: 'bad_password' });
        const n = sh.getLastRow() - 1;
        if (req.keepNames) {
          if (n > 0) sh.getRange(2, 3, n, 3).clearContent();
        } else if (n > 0) {
          sh.deleteRows(2, n);
        }
        break;
      }

      default:
        return json_({ ok: false, error: 'unknown_action' });
    }
    return json_({ ok: true, rows: listRows_(sh) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- helpers ---------- */

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function listRows_(sh) {
  while (sh.getLastRow() - 1 < MIN_ROWS) sh.appendRow([Utilities.getUuid(), '', '', '', '', new Date()]);
  const n = sh.getLastRow() - 1;
  return sh.getRange(2, 1, n, 5).getValues().map(r => ({
    id: String(r[0]),
    name: String(r[1]),
    wishes: [String(r[2]), String(r[3]), String(r[4])]
  }));
}

function findRow_(sh, id) {
  const n = sh.getLastRow() - 1;
  if (!id || n <= 0) return null;
  const hit = sh.getRange(2, 1, n, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : null;
}

// Plain text only; a leading ' stops entries like "=..." becoming formulas.
function clean_(v) {
  const s = String(v == null ? '' : v).slice(0, MAX_LEN);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function checkPassword_(p) {
  if (String(p || '') === ADMIN_PASSWORD) return true;
  Utilities.sleep(1500); // slow down guessing
  return false;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
