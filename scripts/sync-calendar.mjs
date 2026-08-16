import { writeFile } from 'node:fs/promises';

const calendarUrl =
    'https://ical-cdn.teamsnap.com/team_schedule/77067463-bd63-4b91-8ff0-8665be0f6a96.ics';

const response = await fetch(calendarUrl);
if (!response.ok) throw new Error(`TeamSnap returned HTTP ${response.status}`);

const calendar = await response.text();
if (!calendar.includes('BEGIN:VCALENDAR') || !calendar.includes('BEGIN:VEVENT')) {
    throw new Error('TeamSnap response is not a valid event calendar');
}

await writeFile(new URL('../calendar.ics', import.meta.url), calendar, 'utf8');
await writeFile(
    new URL('../calendar-meta.json', import.meta.url),
    `${JSON.stringify({ syncedAt: new Date().toISOString() }, null, 2)}\n`,
    'utf8'
);
console.log(`Saved calendar.ics (${calendar.length} characters)`);
