# Google Sheets Setup Guide

This project automatically syncs form submissions to a Google Sheet using the Google Sheets API v4.

## 1. Create a Google Service Account
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the **Google Sheets API**.
4. Go to **IAM & Admin > Service Accounts**.
5. Click **Create Service Account**, give it a name (e.g., `aerobay-form-sync`), and complete the creation.
6. Click on the newly created service account, go to the **Keys** tab.
7. Click **Add Key > Create new key**, choose **JSON**, and download it.

## 2. Set Up Your Google Sheet
1. Create a new Google Sheet.
2. In the first row, add the following headers (order matters for the current implementation):
   - Submission Date
   - School Name
   - Institution Code
   - Contact Person
   - Email Address
   - Phone Number
   - Lab Category
   - Selected Items Count
   - Total Quantity
   - Custom Items
   - Additional Notes
   - Status
   - Synced At
3. **Share the Sheet**: Click "Share" and add the `client_email` from your downloaded Service Account JSON file as an **Editor**.
4. Extract the **Spreadsheet ID** from the URL.
   - Example: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit`

## 3. Configure Environment Variables
In your backend `.env` file, add the necessary credentials from the JSON file:

```
GOOGLE_SHEETS_ID=your-spreadsheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyData\n-----END PRIVATE KEY-----\n"
```

*Note: Make sure to wrap the `GOOGLE_PRIVATE_KEY` in quotes and preserve the `\n` newline characters.*
