import { url } from '../../utils';

export const resourceDownloads = {
  ponvDataExtractionTemplate: {
    href: url('/downloads/ponv_data_extraction_template.xlsx'),
    label: 'PONV Data Extraction Template',
    format: 'XLSX',
  },
} as const;
