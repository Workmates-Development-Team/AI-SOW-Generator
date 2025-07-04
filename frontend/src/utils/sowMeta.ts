// Utility to generate SOW number and date
export function generateSowNumberAndDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const shortUuid = Math.random().toString(36).substring(2, 7).toUpperCase();
  const sowNumber = `CWM${day}${month}${year}${shortUuid}`;
  const sowDate = date.toISOString();
  return { sowNumber, sowDate };
} 