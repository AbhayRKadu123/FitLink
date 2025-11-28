// utils/getTodayIST.js
export default function getTodayIST() {
  // Returns date string 'YYYY-MM-DD' for Asia/Kolkata timezone
  // Uses toLocaleDateString with en-CA (ISO-like format)
  const nowInKolkata = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata"
  });
  // en-CA gives YYYY-MM-DD format
  return nowInKolkata;
}
