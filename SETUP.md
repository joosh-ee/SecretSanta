# Connecting the shared Google Sheet

This makes the wish list shared: everyone who opens the page sees and edits the same board.

1. Create a new Google Sheet at https://sheets.new (name it anything, e.g. "Secret Santa").
2. In the Sheet, open **Extensions → Apps Script**.
3. Delete what's in the editor, paste in all of `apps-script/Code.gs`, and change
   `ADMIN_PASSWORD` on line 9 to your own password. Click the save icon (💾).
4. Click **Deploy → New deployment**, click the gear ⚙️ next to "Select type" and choose **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**, then **Authorize access** and pick your Google account.
   Google will warn that the app isn't verified: click **Advanced → Go to … (unsafe)** → **Allow**.
   (It's your own script, so this is expected.)
6. Copy the **Web app URL** (it ends in `/exec`).
7. In `index.html`, paste it between the quotes on the line
   `const SHEET_API_URL = "";` and push (or send the URL to Claude to do it).

## Changing the code later

If you edit the script, use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**
so the same URL keeps working. Creating a *new* deployment gives a new URL.

## Admin password

- **🔒 Clear Board** wipes the wishes (or, with the box unticked, names too) after you enter the password.
- Removing a friend's row (🗑️) also needs the password.
- The password lives only in your private Apps Script, never in the public page.
  To change it, edit `ADMIN_PASSWORD` and redeploy as a new version.
