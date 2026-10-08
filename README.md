# My Stewardship Check

A one-page site for Day 3 (My Work, My Stewardship). People answer the five reflection questions one at a time, and each finished set is saved as a row in your Google Sheet.

## Files

- `index.html` — the whole website (deploy this to Vercel)
- `apps-script/Code.gs` — the Google Apps Script that writes answers to the sheet (not deployed to Vercel)

## 1. Connect the Google Sheet

1. Open your sheet: https://docs.google.com/spreadsheets/d/1O-QGXuGi00AmOaEZTIa75a3VGcxRKB8hdcRq4obb328/edit
2. Go to **Extensions › Apps Script**.
3. Delete what's in `Code.gs`, paste the contents of `apps-script/Code.gs`, and save.
4. Click **Deploy › New deployment**, choose type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, approve the permissions, and copy the **Web app URL** (it ends in `/exec`).
6. In `index.html`, replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with that URL.

Answers go to a tab named **Responses** (created automatically, with headers).

If you change `Code.gs` later, use **Deploy › Manage deployments › Edit › New version** so the same URL keeps working.

## 2. Deploy to Vercel

Push this folder to a GitHub repo and import it in Vercel (Framework preset: **Other**, no build command). Or from this folder run:

```
npx vercel --prod
```

## 3. Update the QR code

After Vercel gives you the live URL (e.g. `https://stewardship-check.vercel.app`), send it to Claude to regenerate the QR code on slide 5. The current QR points to the claude.ai version.

## How it behaves

- Name is optional. Blank names save as "(no name)".
- Answers are submitted when the person taps **Finish** on question 5.
- If they tap **Edit answers** and finish again, their existing row is updated (matched by Submission ID), so there are no duplicates.
- Their progress is kept on their phone if they close the tab mid-way.
