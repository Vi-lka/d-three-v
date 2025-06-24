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
import { formatDate } from "@/shared/lib/utils";

type ModelCardDetailedProps = Model & {
  action?: React.ReactNode;
};

export function ModelCardDetailed(props: ModelCardDetailedProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Image
          src={props.imageUrl}
          alt={props.originalName}
          width={500}
          height={500}
          className="w-full h-48 object-cover"
        />
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">
          {props.originalName}
        </CardTitle>
        <CardDescription className="text-sm"></CardDescription>
        {!!props.action && <CardAction>{props.action}</CardAction>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-secondary leading-relaxed mb-3">
          {props.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{formatDate(props.createdAt)}</span>
          <span>{props.fileSize}</span>
        </div>
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
