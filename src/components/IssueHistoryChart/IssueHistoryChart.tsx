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
import { copy } from '../../utils/copy';
import { usePreferences } from '../../hooks/usePreferences';
import type { IssueMetric, Week } from '../../types';
import './IssueHistoryChart.css';

type IssueHistoryChartProps = {
  metrics: IssueMetric[];
  weeks: Week[];
  selectedWeekId?: string | null;
  rangeWeeks: 5 | 10;
  onRangeChange: (range: 5 | 10) => void;
};

export function IssueHistoryChart({
  metrics,
  weeks,
  selectedWeekId = null,
  rangeWeeks,
  onRangeChange
}: IssueHistoryChartProps) {
  const { t } = usePreferences();
  const data = metrics.map((metric) => {
    const week = weeks.find((item) => item.id === metric.week_id);

    return {
      name: week ? `W${week.week_number}` : metric.week_id,
      fixed: metric.fixed_count,
      reported: metric.reported_count,
      isSelected: metric.week_id === selectedWeekId
    };
  });
  const selectedLabel = data.find((point) => point.isSelected)?.name ?? null;

  return (
    <section className="chart-card issue-history-chart">
      <div className="chart-card__header">
        <div className="section-heading">{t(copy.issueHistory)}</div>
        <div className="issue-history-chart__range" aria-label="Issue history range">
          <button
            type="button"
            className={`issue-history-chart__range-button ${rangeWeeks === 5 ? 'issue-history-chart__range-button--active' : ''}`}
            onClick={() => onRangeChange(5)}
          >
            {t(copy.last5Weeks)}
          </button>
          <button
            type="button"
            className={`issue-history-chart__range-button ${rangeWeeks === 10 ? 'issue-history-chart__range-button--active' : ''}`}
            onClick={() => onRangeChange(10)}
          >
            {t(copy.last10Weeks)}
          </button>
        </div>
      </div>
      {!metrics.length ? (
        <EmptyState title={t(copy.issueHistory)} body={t(copy.emptyGeneric)} />
      ) : (
        <div className="chart-card__canvas">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid stroke="var(--border-subtle)" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              {selectedLabel ? <ReferenceLine x={selectedLabel} stroke="var(--brand-primary)" strokeDasharray="4 4" /> : null}
              <Line dataKey="fixed" name={t(copy.fixedIssues)} stroke="var(--status-pass)" strokeWidth={3} />
              <Line dataKey="reported" name={t(copy.reportedIssues)} stroke="var(--status-fail)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
