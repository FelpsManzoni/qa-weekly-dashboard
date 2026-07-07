import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { EmptyState } from '../EmptyState/EmptyState';
import { bilingualText, copy } from '../../utils/copy';
import type { TestCaseDistribution } from '../../types';
import './TestCaseDistributionChart.css';

type TestCaseDistributionChartProps = {
  distributions: TestCaseDistribution[];
};

const COLORS = ['var(--status-pass)', 'var(--status-warning)', 'var(--status-blocked)'];

export function TestCaseDistributionChart({ distributions }: TestCaseDistributionChartProps) {
  const distribution = distributions[0];

  if (!distribution) {
    return <EmptyState title={bilingualText(copy.testCaseDistribution)} body={bilingualText(copy.emptyGeneric)} />;
  }

  const data = [
    { name: 'Automated', value: distribution.automated_count },
    { name: 'Pending Automation', value: distribution.pending_auto_count },
    { name: 'Not Automated', value: distribution.not_auto_count }
  ];

  return (
    <section className="chart-card">
      <div className="section-heading">{bilingualText(copy.testCaseDistribution)}</div>
      <div className="chart-card__canvas">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
