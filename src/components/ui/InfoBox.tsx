/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useAppSelector } from '@/hooks/useRedux';
import { importWorkStations } from '@/services/allApiService';
import { parseFile } from '@/utils/fileUtils';
import React from 'react';
import { toast } from 'react-toastify';

interface InfoBoxProps {
  iconClass: string; // e.g. "fas fa-cog"
  bgColorClass?: string; // e.g. "bg-info"
  label: string;
  value: string | number;
  unit?: string; // e.g. "%"
  onClick?: () => void;
  importAction?: boolean;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  iconClass,
  bgColorClass = 'bg-info',
  label,
  value,
  unit,
  onClick,
  importAction = false,
}) => {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  // console.log(userProfile,'userProfile');
  const sendToApi = async (ips: string[]) => {
    try {
      const payload = {
        ipList: ips,
        date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
      };

      const res = await importWorkStations(payload);
      if (res !== 'OK') {
        throw new Error(typeof res === 'string' ? res : JSON.stringify(res));
      }

      toast.success(`${ips.length} Workstations imported successfully`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error(`Failed to import Workstations: ${message}`);
    }
  };

  return (
    <div 
      className="info-box"
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <span className={`info-box-icon ${bgColorClass} elevation-1`}>
        <i className={iconClass}></i>
      </span>

      <div className="info-box-content">
        <span className="info-box-text">{label}</span>
        <span className="info-box-number">
          {value} {unit && <small>{unit}</small>}

          {/* Import button (triggers file input) */}
          {importAction && userProfile?.roles === "ROLE_ADMIN" && (
            <>
              <input
                id="import-file"
                type="file"
                accept=".csv, .xlsx"
                className="hidden d-none"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const ips = await parseFile(file); // string[]
                      await sendToApi(ips);
                    } catch (err) {
                      const message =
                        err instanceof Error
                          ? err.message
                          : 'Unknown error occurred';
                      toast.error(`Failed to import: ${message}`);
                    }
                  }
                }}
              />

              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={() => document.getElementById("import-file")?.click()}
                style={{float: "inline-end"}}
              >
                <i className="fa fa-file-excel"></i> Import
              </button>
            </>
          )}
        </span>
      </div>
    </div>
  );
};

export default InfoBox;