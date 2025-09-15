'use client';

import React, { useState } from 'react';
import Button from '../ui/Button';
import Ul from '../ui/Ul';
import Li from '../ui/Li';
import Heading from '../ui/Heading';

interface DateIPList {
  date: string;
  ipList: string[];
  nonActiveList: string[];
}

interface Props {
  data: DateIPList[];
  type: 'Active' | 'Non-Active';
}

const IpList: React.FC<Props> = ({ data, type }) => {
  const [activeDate, setActiveDate] = useState<string>(data[0]?.date || '');

  // Pick list based on type
  const getList = (date: string) => {
    const entry = data.find((d) => d.date === date);
    if (!entry) return [];
    return type === 'Active' ? entry.ipList : entry.nonActiveList;
  };

  return (
    <div>
      {/* Sticky date navigation */}
      <div
        className="position-sticky top-0 bg-white z-3 p-2 border-bottom"
      >
        {data.map((entry) => (
          <Button
            key={entry.date}
            className={`btn btn-sm btn-block ${activeDate === entry.date ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveDate(entry.date)}
            variant={"default"}
          >
            {entry.date}
          </Button>
        ))}
      </div>

      {/* Fixed IP section header */}
      <div
        className="position-sticky top-48 bg-light p-2 border-bottom z-3"
      >
        <Heading level={5} className="m-0">{activeDate} — IP List</Heading>
      </div>

      {/* Scrollable IP list area */}
      <div
        className="max-h-calc overflow-auto"
      >
        <Ul className="list-group">
          {getList(activeDate).map((ip, idx) => (
            <Li
              key={idx}
              className="list-group-item py-1 px-2"
              style={{ fontFamily: 'monospace' }}
            >
              {ip}
            </Li>
          ))}
        </Ul>
      </div>
    </div>
  );
};

export default IpList;
