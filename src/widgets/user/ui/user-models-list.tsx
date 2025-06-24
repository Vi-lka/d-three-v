"use client"

import { SearchField } from "@/shared/components/primitives/SearchField";
import { Pagination } from "@/shared/components/primitives/Pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useUserModels } from "@/entities/user";
import { toast } from "sonner";
import { ModelCardDetailed } from "@/entities/3d-model";
import { Button } from "@/shared/components/ui/button";

export function UserModelsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои 3D модели</CardTitle>
        <CardDescription>Управляйте своей коллекцией 3D моделей</CardDescription>
      </CardHeader>
      <CardContent>
        <SearchField placeholder="Поиск по названию или описанию" />
        <ModelsGrid />
      </CardContent>
    </Card>
  )
}

const ModelsGrid = () => {
  const { data, error, isLoading } = useUserModels();

  if (error) {
    toast.error(error.message);
    return null;
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!data || data.length === 0) return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Модели не найдены</p>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {data.map((model) => (
          <ModelCardDetailed 
            key={model.id} 
            action={
              <Button variant="outline">Изменить</Button>
            }
            {...model} 
          />
        ))}
      </div>

      <Pagination totalCount={data.length} pageSizeSelectOptions />
    </>
  );
};
