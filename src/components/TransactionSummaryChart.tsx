import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface TransactionSummaryChartProps {
  data: {
    labels: string[];
    amounts: number[];
  };
  type: 'pemasukan' | 'pengeluaran';
}

export default function TransactionSummaryChart({ data, type }: TransactionSummaryChartProps) {
  const colors = type === 'pemasukan' 
    ? ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d']
    : ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.amounts,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace(')', ', 0.2)')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
          },
          color: '#6b7280',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        {type === 'pemasukan' ? 'Ringkasan Pemasukan' : 'Ringkasan Pengeluaran'}
      </h3>
      <div className="aspect-square">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
}
