import { Suspense } from 'react';
import SittersPageClient from '@/app/ui/pages/SittersPageClient'; 

function PageLoading() {
  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 text-muted">正在載入保姆列表...</p>
    </div>
  );
}

export default function SittersPage() {
  return ( 
      <Suspense fallback={<PageLoading />}>
        <SittersPageClient />
      </Suspense>
  );
}