import { HTMLAttributes } from 'react';

export default function Ul(props: HTMLAttributes<HTMLUListElement>) {
  return <ul className="list-unstyled" {...props} />;
}
