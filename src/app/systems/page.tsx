import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from '@/components/ui/ContentWrapper';
import Section from '@/components/ui/Section';

export default function SystemsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Systems', active: true },
  ];

  return (
    <ContentWrapper>
      <ContentHeader title="Systems" breadcrumbItems={breadcrumbItems} />

      <Section className={'content'}>
        <div className="container-fluid">
          <p>Welcome to your Systems Page!</p>
        </div>
      </Section>
    </ContentWrapper>
  );
}
