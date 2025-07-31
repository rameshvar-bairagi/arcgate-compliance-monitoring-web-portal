import { HTMLAttributes } from 'react';

export default function Ol(props: HTMLAttributes<HTMLUListElement>) {
  return <ol className="list-unstyled" {...props} />;
}
