'use client';

import React from 'react';

interface DateIPList {
  date: string;
  ipList: string[];
}

interface Props {
  data: DateIPList[];
}

const IPListByDate: React.FC<Props> = ({ data }) => {
  return (
    <div>
      {data.map((entry) => (
        <div key={entry.date} className="mb-4">
          <h5 className="fw-bold">{entry.date}</h5>
          <ul className="list-group">
            {entry.ipList.map((ip, index) => (
              <li
                key={index}
                className="list-group-item py-1 px-2"
                style={{ fontFamily: 'monospace' }}
              >
                {ip}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default IPListByDate;
