// utils/chartConfig.ts
import { ChartOptions } from 'chart.js';

export const defaultBarChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      mode: 'index',
      intersect: false
    },
    legend: {
      display: false
    }
  },
  hover: {
    mode: 'index',
    intersect: false
  },
  scales: {
    y: {
      beginAtZero: true, // this is valid here, outside ticks
      grid: {
        color: 'rgba(0, 0, 0, 0.2)',
        lineWidth: 0
      },
      ticks: {
        callback: function (value) {
          if (typeof value === 'number' && value >= 1000) {
            return `$${value / 1000}k`;
          }
          return `$${value}`;
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#6c757d',
        font: {
          weight: 'bold'
        }
      }
    }
  }
};