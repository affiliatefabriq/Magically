"use client"

import { TrendDetails } from '@/components/pages/dynamic/TrendDetails';
import { useParams } from 'next/navigation';

const TrendDetailsPage = () => {
  const { trendId } = useParams<{ trendId: string }>();

  return (
    <TrendDetails trendId={trendId} />
  );
};

export default TrendDetailsPage;