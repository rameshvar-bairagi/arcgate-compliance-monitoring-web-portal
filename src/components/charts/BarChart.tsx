'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  registerables
} from 'chart.js';

Chart.register(...registerables);

interface BarChartProps {
  id: string;
  data: ChartData<'bar'>;
  options?: ChartOptions<'bar'>;
  className?: string;
  height?: number;
  width?: number;
}

export default function BarChart({
  id,
  data,
  options,
  className,
  height = 300,
  width = 500
}: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<'bar'> | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy(); // Cleanup existing chart instance
      }

      const config: ChartConfiguration<'bar'> = {
        type: 'bar',
        data,
        options
      };

      chartRef.current = new Chart(canvasRef.current, config);
    }

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      width={width}
      height={height}
    />
  );
}
