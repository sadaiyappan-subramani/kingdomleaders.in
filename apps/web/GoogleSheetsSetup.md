# Google Sheets Registration Webhook Setup

This guide helps you set up a Google Apps Script to store form submissions from the Kingdom Leaders 2026 website into your Google Sheet, starting exactly from the **3rd row**.

## 1. Google Apps Script Code

Copy the following code. It handles the form submissions, formats the sheet with premium aesthetics, and ensures data is written starting from the 3rd row:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  
  // Initialize headers and styles if it is a fresh sheet
  initializeSheetIfNeeded(sheet);
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Find the next available row (minimum row 3)
    var lastRow = sheet.getLastRow();
    var targetRow = Math.max(3, lastRow + 1);
    
    var timestamp = new Date();
    
    // Map form data to columns
    var rowData = [
      timestamp,                        // Column A: Submission Timestamp
      data.name || '',                  // Column B: Full Name
      data.email || '',                 // Column C: Email Address
      data.phone || '',                 // Column D: Phone Number
      data.age || '',                   // Column E: Age
      data.city || '',                  // Column F: City/Town
      data.role || '',                  // Column G: Ministry Role
      data.churchName || '',            // Column H: Church Name
      data.denomination || '',          // Column I: Denomination
      data.foodPreference || '',        // Column J: Food Preference
      data.accommodationRequired || '', // Column K: Accommodation Required
      data.expectations || '',          // Column L: Expectations/Prayer Request
      data.agreeToTime || ''            // Column M: Agree to Time
    ];
    
    // Insert data starting from the target row
    sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Apply styling to the new row
    var rowRange = sheet.getRange(targetRow, 1, 1, rowData.length);
    rowRange.setFontFamily("Inter");
    rowRange.setFontSize(10);
    rowRange.setVerticalAlignment("middle");
    
    // Format timestamp column
    sheet.getRange(targetRow, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      message: "Registered successfully at row " + targetRow 
    })).setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Support GET requests for testing deployment
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    success: true, 
    message: "Google Sheets Webhook is active! Send a POST request to submit registration data." 
  })).setMimeType(ContentService.MimeType.JSON);
}

function initializeSheetIfNeeded(sheet) {
  // If sheet is empty or only has 1 row, let's create the title in row 1 and headers in row 2
  if (sheet.getLastRow() < 2) {
    sheet.clear();
    
    // Title in Row 1
    sheet.getRange("A1").setValue("Kingdom Leaders 2026 Registration Data");
    var titleRange = sheet.getRange("A1:M1");
    titleRange.merge();
    titleRange.setFontFamily("Montserrat");
    titleRange.setFontSize(16);
    titleRange.setFontWeight("bold");
    titleRange.setFontColor("#FFFFFF");
    titleRange.setBackground("#1E293B"); // Slate 800
    titleRange.setHorizontalAlignment("center");
    titleRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 40);
    
    // Headers in Row 2
    var headers = [
      "Submission Timestamp",
      "Full Name",
      "Email Address",
      "Phone Number",
      "Age",
      "City/Town",
      "Ministry Role",
      "Church Name",
      "Denomination",
      "Food Preference",
      "Accommodation Required",
      "Expectations / Prayer Request",
      "Agree to Conference Time"
    ];
    
    sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
    var headerRange = sheet.getRange("A2:M2");
    headerRange.setFontFamily("Inter");
    headerRange.setFontSize(11);
    headerRange.setFontWeight("bold");
    headerRange.setFontColor("#1E293B");
    headerRange.setBackground("#F1F5F9"); // Slate 100
    headerRange.setBorder(true, true, true, true, true, true, "#CBD5E1", SpreadsheetApp.BorderStyle.SOLID);
    headerRange.setHorizontalAlignment("left");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(2, 28);
    
    // Set column widths to look clean and neat
    var colWidths = [180, 150, 200, 120, 60, 120, 120, 180, 150, 120, 150, 250, 150];
    for (var i = 0; i < colWidths.length; i++) {
      sheet.setColumnWidth(i + 1, colWidths[i]);
    }
  }
}
```

## 2. Setup Instructions

To deploy this script to your Google Sheet:

1. **Open your Google Sheet**:
   Open [KIngdom Leaders 2026](https://docs.google.com/spreadsheets/d/1wCWwBVrnhUzN8UdsijFWwEBUO5MWdKwLZlwhFyPA93M/edit).
2. **Open Apps Script Editor**:
   In the top menu, go to **Extensions** -> **Apps Script**.
3. **Add the Code**:
   - Delete any existing code in the editor (usually a dummy `myFunction`).
   - Paste the Google Apps Script code from Section 1 above.
   - Rename the project to `Kingdom Leaders Registration Webhook` (top left).
   - Click the **Save** icon (disk symbol) or press `Ctrl + S`.
4. **Deploy as Web App**:
   - Click the blue **Deploy** button (top right) -> **New deployment**.
   - Under *Select type*, click the gear icon and select **Web app**.
   - Enter a description (e.g., `v1`).
   - Set **Execute as** to: **Me** (your email).
   - Set **Who has access** to: **Anyone** (this is crucial so the website server can submit without Google login prompt).
   - Click **Deploy**.
5. **Authorize Access**:
   - Click **Authorize Access** and select your Google account.
   - Click **Advanced** -> **Go to Kingdom Leaders Registration Webhook (unsafe)**.
   - Click **Allow**.
6. **Copy Web App URL**:
   - Copy the generated **Web app URL** (it ends with `/exec`).
   - *Note: Make sure you copy the Web App URL, NOT the spreadsheet URL.*

## 3. Update Environment Variables

Once you have copied the Web App URL, update the environment variable in your project files:

1. In `apps/web/.env.local`, set:
   ```env
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/PASTE_YOUR_DEPLOYED_WEB_APP_ID/exec
   ```
2. In the root `.env.local` (if applicable), update the same variable.
3. Restart your dev server (`pnpm dev`) so Next.js reads the updated environment variable.
