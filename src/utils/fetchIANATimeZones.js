export async function fetchIANATimeZones() {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezones');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const timeZones = await response.json();
    return timeZones;
  } catch (error) {
    console.error('Failed to fetch IANA time zones:', error);
    throw error; // Re-throw for the caller to handle
  }
}