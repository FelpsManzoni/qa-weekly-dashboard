import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { EmptyState } from '../EmptyState/EmptyState';
import { bilingualText, copy } from '../../utils/copy';
import type { IssueMetric, Week } from '../../types';
import './IssueHistoryChart.css';

type IssueHistoryChartProps = {
  metrics: IssueMetric[];
  weeks: Week[];
  selectedWeekId?: string | null;
};

export function IssueHistoryChart({ metrics, weeks, selectedWeekId = null }: IssueHistoryChartProps) {
  if (!metrics.length) {
    return <EmptyState title={bilingualText(copy.issueHistory)} body={bilingualText(copy.emptyGeneric)} />;
  }

  const data = metrics.map((metric) => {
    const week = weeks.find((item) => item.id === metric.week_id);

    return {
      name: week ? `W${week.week_number}` : metric.week_id,
      fixed: metric.fixed_count,
      reported: metric.reported_count,
      // Marks the point matching the currently selected week so it can be highlighted (#10).
      isSelected: metric.week_id === selectedWeekId
    };
  });

  const selectedLabel = data.find((point) => point.isSelected)?.name ?? null;

  return (
    <section className="chart-card">
      <div className="section-heading">{bilingualText(copy.issueHistory)}</div>
      <div className="chart-card__canvas">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid stroke="var(--border-subtle)" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {selectedLabel ? <ReferenceLine x={selectedLabel} stroke="var(--brand-primary)" strokeDasharray="4 4" /> : null}
            <Line dataKey="fixed" name="Fixed issues" stroke="var(--status-pass)" strokeWidth={3} />
            <Line dataKey="reported" name="Reported issues" stroke="var(--status-fail)" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
