import React, { useState } from 'react';
import { FarmZone } from '../types/farm';
import {
  generateDailyReport,
  generateWeeklyReport,
  generateMonthlyReport,
  GeneratedReport,
} from '../utils/reportAggregator';
import {
  syncReportToGoogleDrive,
  UploadResult,
  GOOGLE_DRIVE_FOLDER_URL,
} from '../services/googleDriveService';

interface DriveExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: FarmZone;
  accessToken: string | null;
  onLoginRequest: () => void;
  onUploadSuccess: (res: UploadResult) => void;
}

export const DriveExportModal: React.FC<DriveExportModalProps> = ({
  isOpen,
  onClose,
  selectedZone,
  accessToken,
  onLoginRequest,
  onUploadSuccess,
}) => {
  const [activePeriod, setActivePeriod] = useState<'Harian' | 'Mingguan' | 'Bulanan'>('Bulanan');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportMessage, setExportMessage] = useState<{ type: 'success' | 'error'; text: string; url?: string } | null>(null);

  if (!isOpen) return null;

  const currentReport: GeneratedReport =
    activePeriod === 'Harian'
      ? generateDailyReport(selectedZone)
      : activePeriod === 'Mingguan'
      ? generateWeeklyReport(selectedZone)
      : generateMonthlyReport(selectedZone);

  const handleExportToDrive = async () => {
    if (!accessToken) {
      onLoginRequest();
      return;
    }

    const confirmed = window.confirm(
      `Ekspor ${currentReport.title} ke Google Drive folder "1P62-KOsYtJA..." pada subfolder "${
        activePeriod === 'Harian' ? '01_Laporan_Harian' : activePeriod === 'Mingguan' ? '02_Laporan_Mingguan' : '03_Laporan_Bulanan'
      }"? File Google Sheets dan CSV akan dibuat otomatis.`
    );
    if (!confirmed) return;

    setIsExporting(true);
    setExportMessage(null);

    try {
      const result = await syncReportToGoogleDrive(currentReport, accessToken);
      onUploadSuccess(result);
      setExportMessage({
        type: 'success',
        text: `Berhasil disimpan ke Google Drive pada subfolder: ${result.folderName}`,
        url: result.spreadsheetUrl,
      });
    } catch (err: any) {
      console.error(err);
      setExportMessage({
        type: 'error',
        text: err.message || 'Gagal menyimpan ke Google Drive. Periksa izin akses akun Google Anda.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadLocalCsv = () => {
    const blob = new Blob([currentReport.csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentReport.title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl flex flex-col text-neutral-100">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <span>Google Drive & Sheets Integration</span>
              <span aria-hidden="true">·</span>
              <span>Folder: 1P62-KOsYtJA...</span>
              <span aria-hidden="true">·</span>
              <span>Bahan Presentasi Eksekutif</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Pusat Ekspor Data Presentasi AgriPulse
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-2 my-4 p-1 bg-neutral-950 rounded-lg border border-neutral-800 w-fit">
          <button
            onClick={() => { setActivePeriod('Harian'); setExportMessage(null); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePeriod === 'Harian'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            01. Laporan Harian (24 Jam)
          </button>
          <button
            onClick={() => { setActivePeriod('Mingguan'); setExportMessage(null); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePeriod === 'Mingguan'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            02. Laporan Mingguan (7 Hari)
          </button>
          <button
            onClick={() => { setActivePeriod('Bulanan'); setExportMessage(null); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activePeriod === 'Bulanan'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            03. Presentasi Bulanan Eksekutif (Rekomendasi)
          </button>
        </div>

        {/* Feedback Alert */}
        {exportMessage && (
          <div
            className={`p-3.5 rounded-lg text-xs mb-4 flex items-center justify-between border ${
              exportMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
            }`}
          >
            <span>{exportMessage.text}</span>
            {exportMessage.url && (
              <a
                href={exportMessage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-emerald-500 text-neutral-950 font-semibold rounded hover:bg-emerald-400 transition-colors shrink-0 ml-3"
              >
                Buka Spreadsheet ↗
              </a>
            )}
          </div>
        )}

        {/* Executive KPI Summary Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {currentReport.summaryMetrics.map((metric, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
              <div className="text-[11px] text-neutral-400 mb-0.5">{metric.label}</div>
              <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Spreadsheet Table Preview */}
        <div className="flex-1 overflow-hidden border border-neutral-800 rounded-lg bg-neutral-950">
          <div className="p-2.5 bg-neutral-900 border-b border-neutral-800 text-xs flex justify-between items-center text-neutral-400">
            <span>Pratinjau Tabel Spreadsheet ({currentReport.rows.length} Baris Data)</span>
            <span className="font-mono text-[11px]">Format: Google Sheets + CSV</span>
          </div>
          <div className="overflow-x-auto max-h-60 p-2">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-900/50">
                  {currentReport.headers.map((h, i) => (
                    <th key={i} className="py-2 px-3 text-[11px] font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {currentReport.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-neutral-900/40">
                    {row.map((val, cIdx) => (
                      <td key={cIdx} className="py-1.5 px-3 whitespace-nowrap tabular-nums text-[11px]">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-400">
            Folder Target: <a href={GOOGLE_DRIVE_FOLDER_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">1P62-KOsYtJAqXGQJMSsgm-nmclVpXwYV</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadLocalCsv}
              className="px-3.5 py-2 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors whitespace-nowrap"
            >
              Unduh CSV
            </button>

            {accessToken ? (
              <button
                onClick={handleExportToDrive}
                disabled={isExporting}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                {isExporting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Menyimpan ke Drive...</span>
                  </>
                ) : (
                  <>
                    <span>📁</span>
                    <span>Kirim ke Google Drive</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onLoginRequest}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
              >
                <span>Login Google untuk Menyimpan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
