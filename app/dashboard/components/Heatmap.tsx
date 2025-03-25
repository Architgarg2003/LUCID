"use client"

import React, { useEffect, useMemo } from 'react'
import ActivityCalendar, { ThemeInput } from 'react-activity-calendar'
import { Tooltip as MuiTooltip } from '@mui/material';
import { Separator } from '@/components/ui/separator';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-react';
import Heading from '@/components/ui/Heading';

interface GitMapI {
  totalInteractions: any,
  dailyInteractions: any[]
}

const transformData = (dailyInteractions: any[]): any[] => {
  return dailyInteractions?.map(interaction => ({
    date: interaction.date,
    count: interaction.count,
    level: interaction.level
  }));
};

const GitMap = ({ totalInteractions, dailyInteractions }: GitMapI) => {
  const [data, setData] = React.useState<any>([]);
  const transformedDailyInteractions = useMemo(() => transformData(dailyInteractions), [dailyInteractions]);

  useEffect(() => {
    if (dailyInteractions && transformedDailyInteractions.length > 0) {
      setData(transformedDailyInteractions);
    }
  }, [dailyInteractions, transformedDailyInteractions]);

  const explicitTheme: ThemeInput = {
    light: ['#E3D0FF', '#BA88FF', '#923FFF', '#7C3AED', '#5D2FB5'],
    dark: ['#E3D0FF', '#BA88FF', '#923FFF', '#7C3AED', '#5D2FB5'],
  };

  return (
    <div className="bg-white h-max w-full px-10 p-7 gap-2 rounded-xl flex flex-col">
      <Heading >Interactions</Heading>
      <div className="text-center flex flex-row gap-[3.2rem]">
        <div className="p-2 rounded-xl">
          <p className="font-semibold text-4xl text-black">{dailyInteractions ? dailyInteractions[dailyInteractions.length-1]?.count : 0}</p>
          <Separator />
          <p className="text-sm">Today's Interactions</p>
        </div>
        <div className="p-2 rounded-xl">
          <p className="font-semibold text-4xl text-black">{totalInteractions?.InteractionNumber || 0}</p>
          <Separator />
          <p className="text-sm">Total Interactions</p>
        </div>
      </div>
      <ActivityCalendar
        data={data}
        theme={explicitTheme}
        blockSize={23}
        blockRadius={5}
        renderBlock={(block, activity) => (
          <MuiTooltip
            title={`${activity.count} activities on ${activity.date}`}
          >
            {block}
          </MuiTooltip>
        )}
        showWeekdayLabels
        weekStart={1}
        hideColorLegend
        hideTotalCount
      />
    </div>
  )
}

export default GitMap
