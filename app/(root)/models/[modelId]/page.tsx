'use client';

import { useParams } from 'next/navigation';
import { ModelDetails } from '@/components/pages/generations/models/model-details/ModelDetails';

const ModelDetailsPage = () => {
  const { modelId } = useParams();

  return <ModelDetails modelId={modelId as string} />;
};

export default ModelDetailsPage;
