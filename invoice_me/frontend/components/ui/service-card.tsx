import { ServiceCardData } from "@/lib/types/user-interface";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./card";
import { Button } from "./button";
import { ServiceQuickStats } from "@/lib/types/dashboard";
import { buttonWithIconInformation } from "@/lib/types/user-interface";

interface ServiceCardProps {
  data: ServiceCardData;
}

export function ServiceCard({
  data
}: ServiceCardProps) {
  const {
    title,
    description,
    serviceClassColor,
    quickStatsColor,
    icon: Icon,
    inconColor = "text-slate-500",
    buttonInformation,
    serviceStats,
  } = data;
  return (
    <Card className={`hover:shadow-lg transition-shadow ${serviceClassColor}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Icon className={`h-5 w-5 ${inconColor}`} />
          {title}
        </CardTitle>
        <CardDescription className="text-slate-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick stats for financing */}
        <div
          className={`grid grid-cols-2 gap-4 p-3 ${quickStatsColor} rounded-lg`}
        >
          {serviceStats.map((quickStats: ServiceQuickStats, index) => (
            <div key={index}>
              <p className="text-xs text-slate-600">
                {quickStats.serviceTilte}
              </p>
              <p className="font-semibold text-slate-900">
                {quickStats?.affixPosition === "prefix" &&
                  quickStats.serviceValueAffix}
                {quickStats.serviceValue.toLocaleString()}
                {quickStats?.affixPosition === "suffix" &&
                  quickStats.serviceValueAffix}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {buttonInformation.map(
            (buttonInfo: buttonWithIconInformation, index) => (
              <Button
                size={buttonInfo.buttonSize}
                variant={buttonInfo.buttonVariant}
                className={`${buttonInfo.buttonColor} hover:${buttonInfo.buttonHoverColor} cursor-pointer`}
                key={index}
              >
                <buttonInfo.buttonIcon className="h-4 w-4 mr-2" />
                {buttonInfo.buttonText}
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
