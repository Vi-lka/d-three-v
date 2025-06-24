import { Eye } from "lucide-react";
import Image from "next/image";

import type { Model } from "@/server/db/schema";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type ModelCardProps = Pick<
  Model,
  "originalName" | "imageUrl" | "description"
> & {
  action?: React.ReactNode;
};

export function ModelCard({
  originalName,
  imageUrl,
  description,
  action,
}: ModelCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Image
          src={imageUrl}
          alt={originalName}
          width={500}
          height={500}
          className="w-full h-48 object-cover"
        />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">{originalName}</CardTitle>
        <CardDescription className="text-sm"></CardDescription>
        {!!action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary leading-relaxed">{description}</p>
      </CardContent>
      <CardFooter>
        <Button className="flex-1">
          <Eye className="w-4 h-4 mr-2" />
          Просмотр 3D
        </Button>
      </CardFooter>
    </Card>
  );
}
