# 🎅 Secret Santa Wish List 🎄

A festive one-page wish list for a Secret Santa gift exchange. Each friend adds their name and their top 3 gift ideas, and everyone sees the same board, so you always know what your giftee wants.

**👉 Live page: https://joosh-ee.github.io/SecretSanta/**

## Features

- **Shared wish list.** An expandable table with at least 5 friends, each with Wish #1, #2 and #3. Entries save automatically to a Google Sheet, and everyone who opens the link sees the same list. It checks for new entries every 15 seconds.
- **Holiday greeting pop-up.** A random greeting appears when the page opens. Tap the 🔔 button for another.
- **Festive look.** An ivy and holly border, twinkling string lights and falling snow.
- **Admin controls.** Clearing the board, or removing a friend's row, needs an admin password. The password is checked by the Google Sheet's script, so it never appears on the public page.
- **Works on phones.**

## How it works

| Part | What it is |
|------|------------|
| `index.html` | The whole page: HTML, CSS and JavaScript in one file, hosted on GitHub Pages. |
| `apps-script/Code.gs` | A Google Apps Script web app that reads and writes the shared Google Sheet. |
| `SETUP.md` | Steps for connecting your own Google Sheet. |

If no Sheet URL is set in `index.html` (`SHEET_API_URL`), the list saves only in each visitor's own browser.

## Updating

Push changes to the `claude/christmas-secret-santa-list-96l0am` branch. GitHub Pages redeploys the site automatically within a minute or two.
