import { ModelUploadForm } from '@/features/3d-model/ui/ModelUploadForm';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function UploadModelPage() {
  const session = await auth();

  if (!session?.user) redirect("/sign-in");
  return (
    <div className="min-h-screen pt-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Загрузка 3D модели</h1>
          <p className="text-lg text-muted-foreground">Загрузите вашу 3D модель и настройте ее в нашем редакторе</p>
        </div>

        <ModelUploadForm />
      </div>
    </div>
  );
}
