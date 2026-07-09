import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { EmptyState } from '../EmptyState/EmptyState';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { TestCaseDistribution } from '../../types';
import './TestCaseDistributionChart.css';

type TestCaseDistributionChartProps = {
  distributions: TestCaseDistribution[];
};

const COLORS = ['var(--status-pass)', 'var(--status-warning)', 'var(--status-blocked)'];

export function TestCaseDistributionChart({ distributions }: TestCaseDistributionChartProps) {
  const { t } = usePreferences();
  const distribution = distributions[0];

  if (!distribution) {
    return <EmptyState title={t(copy.testCaseDistribution)} body={t(copy.emptyGeneric)} />;
  }

  const data = [
    { name: t(copy.automated), value: distribution.automated_count },
    { name: t(copy.pendingAutomation), value: distribution.pending_auto_count },
    { name: t(copy.notAutomated), value: distribution.not_auto_count }
  ];

  return (
    <section className="chart-card">
      <div className="section-heading">{t(copy.testCaseDistribution)}</div>
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
