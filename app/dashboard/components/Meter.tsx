import React from 'react'
import RadialChart from './RadialChart'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

interface MeterI{
  percentage:number,
  title:string
}

const Meter = ({ percentage, title }: MeterI) => {
  return (
    <div className=" h-max p-10 px-10 rounded-xl flex flex-row gap-2 bg-white text-lg">
      <RadialChart percentage={percentage} />
      <div className="font-bold">{percentage}%</div>
      <div>{title}</div>
    </div>
  )
}

export default Meter;