export const dynamic = "force-dynamic"; // يمنع SSR/SSG

import FinalizeCVClient from './FinalizeCVClient';

export default function Page() {
  return <FinalizeCVClient />;
}
