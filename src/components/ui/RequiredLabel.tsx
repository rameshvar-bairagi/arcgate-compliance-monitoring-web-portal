'use client';

import React from 'react';
import { Form } from 'react-bootstrap';

const RequiredLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Form.Label>
    {children} <span className='text-danger'>*</span>
  </Form.Label>
);

export default RequiredLabel;