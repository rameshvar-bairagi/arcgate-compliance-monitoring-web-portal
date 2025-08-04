// components/ErrorPages/ErrorRenderer.tsx
import type { AxiosError } from 'axios';
import ContentWrapper from '../ui/ContentWrapper';
import ContentHeader from '../ui/ContentHeader';
import Section from '../ui/Section';
import Heading from '../ui/Heading';

type ErrorRendererProps = {
  error: AxiosError;
};

export default function ErrorRenderer({ error }: ErrorRendererProps) {
  console.log('errorerrorerror', error)
  const status = error?.response?.status;
  const code = error?.code;
  const message = error?.message;
  return (
    <ContentWrapper>
        <ContentHeader title={`${status} Error Page`} />
        <Section className="content">
            <div className="error-page">
                <Heading level={2} variant="primary" className={`headline ${status === 500 ? 'text-danger' : 'text-warning'}`}> {status}</Heading>
                <div className="error-content">
                    <Heading level={3} >
                        <i className={`fas fa-exclamation-triangle ${status === 500 ? 'text-danger' : 'text-warning'}`}></i> {code}
                    </Heading>
                    <p>
                        {message}
                    </p>
                </div>
            </div>
        </Section>
    </ContentWrapper>
  );
}