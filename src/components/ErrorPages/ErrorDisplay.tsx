'use client';

// components/ErrorPages/ErrorDisplay.tsx
import ContentWrapper from '../ui/ContentWrapper';
import ContentHeader from '../ui/ContentHeader';
import Section from '../ui/Section';
import Heading from '../ui/Heading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ErrorDisplayProps {
  errorCode: number;
}

const errorMessages: Record<number, { title: string; message: string; action?: () => void }> = {
  401: {
    title: 'Unauthorized',
    message: 'You are not logged in. Redirecting to login...',
  },
  402: {
    title: 'Payment Required',
    message: 'Payment required.',
  },
  403: {
    title: 'Forbidden',
    message: 'Access denied! You don’t have permission to access this resource.',
  },
  404: {
    title: 'Not Found',
    message: 'Resource doesn’t exist.',
  },
  500: {
    title: 'Internal Server Error',
    message: 'Something went wrong on our end. Please try again later.',
  },
  501: {
    title: 'Not Implemented',
    message: 'Feature not available. Please try again later.',
  },
  502: {
    title: 'Bad Gateway',
    message: 'Temporary server issue. Please try again later.',
  },
  503: {
    title: 'Service Unavailable',
    message: 'The server is temporarily unavailable. Please try again shortly.',
  },
  504: {
    title: 'Gateway Timeout',
    message: 'Server taking too long. Please try again shortly.',
  },
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorCode }) => {
  const router = useRouter();
  const error = errorMessages[errorCode] || {
    title: 'Unknown Error',
    message: 'An unexpected error occurred.',
  };

  useEffect(() => {
    if (errorCode === 401 || errorCode === 403) {
      setTimeout(() => {
        // router.push('/login');
        // if (!router?.push) return null;
        Promise.resolve().then(() => router.replace('/login'));
      }, 2000); // Redirect after 2 seconds
    }
  }, [errorCode, router]);

  return (
    <ContentWrapper>
        <ContentHeader title={`${errorCode} Error Page`} />
        <Section className="content">
            <div className="error-page">
                <Heading level={2} variant="primary" className={`headline ${errorCode === 500 ? 'text-danger' : 'text-warning'}`}> {errorCode}</Heading>
                <div className="error-content">
                    <Heading level={3} >
                        <i className={`fas fa-exclamation-triangle ${errorCode === 500 ? 'text-danger' : 'text-warning'}`}></i> {error.title}
                    </Heading>
                    <p>
                        {error.message}
                    </p>
                </div>
            </div>
        </Section>
    </ContentWrapper>
  );
};