import React from 'react';
import { User } from 'firebase/auth';
import { GOOGLE_DRIVE_FOLDER_URL } from '../services/googleDriveService';

interface GoogleDriveSyncBannerProps {
  user: User | null;
  isLoggingIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onOpenExportModal: () => void;
  onQuickSync: () => void;
  isSyncing: boolean;
  lastSyncTime: string | null;
  lastUploadedUrl: string | null;
}

export const GoogleDriveSyncBanner: React.FC<GoogleDriveSyncBannerProps> = ({
  user,
  isLoggingIn,
  onLogin,
  onLogout,
  onOpenExportModal,
  onQuickSync,
  isSyncing,
  lastSyncTime,
  lastUploadedUrl,
}) => {
  return (
    <div className="bg-neutral-900/80 border-b border-neutral-800 px-4 py-2.5 text-xs text-neutral-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Status & Drive Target Folder Link */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span>{user ? 'Google Drive Cloud Storage Terhubung' : 'Penyimpanan Google Drive Siap'}</span>
          </span>

          <span className="text-neutral-500 hidden sm:inline" aria-hidden="true">·</span>

          <a
            href={GOOGLE_DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-emerald-300 underline underline-offset-2 transition-colors flex items-center gap-1 font-mono text-[11px]"
            title="Buka folder tujuan laporan presentasi di Google Drive"
          >
            <span>📁 Folder: 1P62-KOsYtJA...</span>
            <span className="text-[10px]">↗</span>
          </a>

          {lastSyncTime && (
            <>
              <span className="text-neutral-500 hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-neutral-400 text-[11px]">
                Tersinkron: <span className="font-mono text-neutral-200">{lastSyncTime}</span>
              </span>
            </>
          )}

          {lastUploadedUrl && (
            <a
              href={lastUploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-medium hover:bg-emerald-500/25 transition-colors"
            >
              Buka Spreadsheet Terakhir ↗
            </a>
          )}
        </div>

        {/* Right Side: Account & Sync Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400 hidden lg:inline truncate max-w-[180px]">
                {user.email}
              </span>
              <button
                onClick={onQuickSync}
                disabled={isSyncing}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <span className="w-3 h-3 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Menyinkronkan...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Sinkronkan ke Drive</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenExportModal}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded text-xs border border-neutral-700 transition-colors whitespace-nowrap"
              >
                Pusat Presentasi
              </button>

              <button
                onClick={onLogout}
                className="text-[11px] text-neutral-400 hover:text-rose-300 px-1.5 py-1 transition-colors"
                title="Keluar dari akun Google"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onLogin}
                disabled={isLoggingIn}
                className="px-3 py-1 bg-white hover:bg-neutral-100 text-neutral-900 font-medium rounded text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isLoggingIn ? 'Menghubungkan...' : 'Hubungkan Akun Google'}</span>
              </button>

              <button
                onClick={onOpenExportModal}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs border border-neutral-700 transition-colors whitespace-nowrap"
              >
                Lihat Format Data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
