import { MatDateFormats } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'YYYY/MM/DD',
    },
    display: {
        dateInput: 'YYYY/MM/DD',
        monthYearLabel: 'YYYY MMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY MMM',
    }
};
