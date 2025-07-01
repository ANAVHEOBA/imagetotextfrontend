import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseDate',
  standalone: true
})
export class ParseDatePipe implements PipeTransform {
  transform(value: string | undefined | null): Date | null {
    if (!value) {
      return null;
    }
    
    // The backend returns a format like "2025-06-29 7:11:45.598 +00:00:00".
    // This isn't a standard ISO format and causes issues, especially with single-digit hours.
    
    // Step 1: Split date from time. e.g., "2025-06-29" and "7:11:45.598"
    const parts = value.split(' ');
    if (parts.length < 2) {
      return new Date(value); // Fallback for unexpected formats
    }

    const datePart = parts[0];
    const timePart = parts[1];

    // Step 2: Pad the time part to ensure 2-digit hours.
    const timeParts = timePart.split(':');
    if (timeParts.length === 3) {
      timeParts[0] = timeParts[0].padStart(2, '0'); // Pad hour, e.g., "7" -> "07"
      const paddedTimePart = timeParts.join(':');
      
      // Step 3: Reconstruct into a fully compliant ISO 8601 string.
      const isoCompliantString = `${datePart}T${paddedTimePart}Z`;
      const date = new Date(isoCompliantString);

      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    
    // Fallback for any other case
    console.error('Could not parse date with new logic:', value);
    return new Date(value.replace(' ', 'T'));
  }
} 