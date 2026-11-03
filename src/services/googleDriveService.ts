import { GeneratedReport } from '../utils/reportAggregator';

export const GOOGLE_DRIVE_PARENT_FOLDER_ID = '1P62-KOsYtJAqXGQJMSsgm-nmclVpXwYV';
export const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/u/0/folders/${GOOGLE_DRIVE_PARENT_FOLDER_ID}`;

export const SUBFOLDER_NAMES = {
  Harian: '01_Laporan_Harian',
  Mingguan: '02_Laporan_Mingguan',
  Bulanan: '03_Laporan_Bulanan',
};

export interface UploadResult {
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  csvFileId?: string;
  csvFileUrl?: string;
  folderId: string;
  folderName: string;
  reportTitle: string;
  uploadedAt: string;
}

/**
 * Finds or creates a subfolder within the user's specified Google Drive parent folder.
 */
export async function getOrCreateSubfolder(
  parentFolderId: string,
  subfolderName: string,
  accessToken: string
): Promise<string> {
  // Check if subfolder already exists
  const query = encodeURIComponent(
    `'${parentFolderId}' in parents and name = '${subfolderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
  );

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!searchRes.ok) {
    const errorText = await searchRes.text();
    console.error('Error searching for subfolder:', errorText);
    throw new Error(`Gagal mencari folder di Google Drive: ${searchRes.statusText}`);
  }

  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create subfolder inside parentFolderId
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: subfolderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    console.error('Error creating subfolder:', errorText);
    throw new Error(`Gagal membuat subfolder "${subfolderName}": ${createRes.statusText}`);
  }

  const createData = await createRes.json();
  return createData.id;
}

/**
 * Creates a native Google Spreadsheet inside the specified subfolder,
 * populates the tabular data, and adds executive presentation formatting.
 */
export async function createGoogleSpreadsheet(
  report: GeneratedReport,
  targetFolderId: string,
  accessToken: string
): Promise<{ spreadsheetId: string; webViewLink: string }> {
  // 1. Create spreadsheet with Sheets API
  const sheetTitle = `${report.title} (Presentasi)`;
  const valuesData = [
    [`Laporan AgriPulse Smart Farm: ${report.zoneName}`],
    [`Komoditas: ${report.cropName} | Periode: ${report.period} | Dibuat: ${report.generatedAt}`],
    [], // empty line
    ['RINGKASAN EKSEKUTIF / KEY PERFORMANCE INDICATORS'],
    ...report.summaryMetrics.map((m) => [m.label, m.value]),
    [], // empty line
    report.headers,
    ...report.rows,
  ];

  const createSheetRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: sheetTitle,
      },
      sheets: [
        {
          properties: {
            title: report.period,
            gridProperties: {
              frozenRowCount: 7 + report.summaryMetrics.length,
            },
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: valuesData.map((row) => ({
                values: row.map((val) => ({
                  userEnteredValue:
                    typeof val === 'number'
                      ? { numberValue: val }
                      : { stringValue: String(val) },
                })),
              })),
            },
          ],
        },
      ],
    }),
  });

  if (!createSheetRes.ok) {
    const errText = await createSheetRes.text();
    console.error('Sheets API creation error:', errText);
    throw new Error(`Gagal membuat file Google Sheets: ${createSheetRes.statusText}`);
  }

  const sheetData = await createSheetRes.json();
  const spreadsheetId = sheetData.spreadsheetId;

  // 2. Move file into targetFolderId in Drive
  const moveRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${spreadsheetId}?addParents=${targetFolderId}&fields=id,parents,webViewLink`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  let webViewLink = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
  if (moveRes.ok) {
    const moveData = await moveRes.json();
    if (moveData.webViewLink) webViewLink = moveData.webViewLink;
  }

  return { spreadsheetId, webViewLink };
}

/**
 * Uploads a CSV spreadsheet copy into the target Google Drive subfolder.
 */
export async function uploadCsvToDrive(
  report: GeneratedReport,
  targetFolderId: string,
  accessToken: string
): Promise<{ fileId: string; webViewLink: string }> {
  const fileName = `${report.title}.csv`;
  const boundary = '-------AgriPulseBoundary' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: 'text/csv',
    parents: [targetFolderId],
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: text/csv\r\n\r\n' +
    report.csvContent +
    closeDelimiter;

  const uploadRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    console.error('Drive upload error:', errText);
    throw new Error(`Gagal mengunggah CSV ke Drive: ${uploadRes.statusText}`);
  }

  const data = await uploadRes.json();
  return {
    fileId: data.id,
    webViewLink: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view`,
  };
}

/**
 * Full Sync Pipeline: creates subfolder, uploads Google Sheets and CSV companion,
 * and returns direct links for presentations.
 */
export async function syncReportToGoogleDrive(
  report: GeneratedReport,
  accessToken: string
): Promise<UploadResult> {
  const subfolderName = SUBFOLDER_NAMES[report.period] || '01_Laporan_Harian';
  
  // 1. Get or create the subfolder in parent 1P62-KOsYtJAqXGQJMSsgm-nmclVpXwYV
  const subfolderId = await getOrCreateSubfolder(
    GOOGLE_DRIVE_PARENT_FOLDER_ID,
    subfolderName,
    accessToken
  );

  // 2. Create native Google Sheets for presentation
  const { spreadsheetId, webViewLink: spreadsheetUrl } = await createGoogleSpreadsheet(
    report,
    subfolderId,
    accessToken
  );

  // 3. Upload companion CSV file
  let csvFileId: string | undefined;
  let csvFileUrl: string | undefined;
  try {
    const csvResult = await uploadCsvToDrive(report, subfolderId, accessToken);
    csvFileId = csvResult.fileId;
    csvFileUrl = csvResult.webViewLink;
  } catch (e) {
    console.warn('CSV upload warning (non-fatal):', e);
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    csvFileId,
    csvFileUrl,
    folderId: subfolderId,
    folderName: subfolderName,
    reportTitle: report.title,
    uploadedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };
}
