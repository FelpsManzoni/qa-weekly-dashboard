import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { EmptyState } from '../EmptyState/EmptyState';
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { TestCaseDistribution } from '../../types';
import './TestCaseDistributionChart.css';

type TestCaseDistributionChartProps = {
  distributions: TestCaseDistribution[];
};

const COLORS = ['var(--status-pass)', 'var(--status-warning)', 'var(--status-blocked)'] as const;

export function TestCaseDistributionChart({ distributions }: TestCaseDistributionChartProps) {
  const { t } = usePreferences();
  const distribution = distributions[0];

  if (!distribution) {
    return <EmptyState title={t(copy.testCaseDistribution)} body={t(copy.emptyGeneric)} />;
  }

  const data = [
    { name: t(copy.automated), value: distribution.automated_count, color: COLORS[0] },
    { name: t(copy.pendingAutomation), value: distribution.pending_auto_count, color: COLORS[1] },
    { name: t(copy.notAutomated), value: distribution.not_auto_count, color: COLORS[2] }
  ];
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <section className="chart-card test-case-chart">
      <div className="section-heading">{t(copy.testCaseDistribution)}</div>
      <div className="test-case-chart__layout">
        <div className="chart-card__canvas">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={78}
                label={({ value }) => {
                  if (!total || typeof value !== 'number') {
                    return '';
                  }

                  return `${Math.round((value / total) * 100)}%`;
                }}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <dl className="test-case-chart__legend" aria-label="Test case distribution legend">
          {data.map((entry) => (
            <div key={entry.name} className="test-case-chart__legend-item">
              <dt className="test-case-chart__legend-label">
                <span
                  className="test-case-chart__legend-swatch"
                  aria-hidden="true"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </dt>
              <dd className="test-case-chart__legend-value">{entry.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
