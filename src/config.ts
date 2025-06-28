export default {
  wbApiToken: process.env.WB_API_TOKEN || '',
  googleCredentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
  },
  spreadsheetIds: process.env.SPREADSHEET_IDS?.split(',') || []
};