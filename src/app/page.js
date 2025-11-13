// app/page.js
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/en');
}

// أو إذا عايز صفحة مؤقتة
// export default function HomePage() {
//   return (
//     <div style={{ padding: '50px', textAlign: 'center' }}>
//       <h1>CV Master</h1>
//       <p>Redirecting to English version...</p>
//       <a href="/en">Go to English</a>
//     </div>
//   );
// }