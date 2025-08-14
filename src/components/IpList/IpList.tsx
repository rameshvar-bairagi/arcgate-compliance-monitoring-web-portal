'use client';

import React, { useState } from 'react';

interface DateIPList {
  date: string;
  ipList: string[];
}

interface Props {
  data: DateIPList[];
}

const IpList: React.FC<Props> = ({ data }) => {
  const [activeDate, setActiveDate] = useState<string>(data[0]?.date || '');

  return (
    <div>
      {/* Sticky date navigation */}
      <div
        className="position-sticky top-0 bg-white z-3 p-2 border-bottom"
      >
        {data.map((entry) => (
          <button
            key={entry.date}
            className={`btn btn-sm btn-block ${activeDate === entry.date ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveDate(entry.date)}
          >
            {entry.date}
          </button>
        ))}
      </div>

      {/* Fixed IP section header */}
      <div
        className="position-sticky top-48 bg-light p-2 border-bottom z-3"
      >
        <h5 className="m-0">{activeDate} — IP List</h5>
      </div>

      {/* Scrollable IP list area */}
      <div
        className="max-h-calc overflow-auto"
      >
        <ul className="list-group">
          {data
            .find((entry) => entry.date === activeDate)
            ?.ipList.map((ip, idx) => (
              <li
                key={idx}
                className="list-group-item py-1 px-2"
                style={{ fontFamily: 'monospace' }}
              >
                {ip}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default IpList;
