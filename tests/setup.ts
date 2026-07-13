import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.mock('recharts', async () => {
  const React = await import('react');
  const serializeProps = (props: Record<string, unknown>) =>
    JSON.stringify(
      props,
      (_key, value) => {
        if (typeof value === 'function') return '[function]';
        return value;
      }
    );
  const passthrough =
    (name: string) =>
    ({ children, ...props }: any) =>
      React.createElement('div', { 'data-chart': name, 'data-props': serializeProps(props) }, children);

  return {
    ResponsiveContainer: passthrough('responsive'),
    LineChart: passthrough('line-chart'),
    Line: passthrough('line'),
    XAxis: passthrough('x-axis'),
    YAxis: passthrough('y-axis'),
    Tooltip: passthrough('tooltip'),
    Legend: passthrough('legend'),
    ReferenceLine: passthrough('reference-line'),
    CartesianGrid: passthrough('grid'),
    PieChart: passthrough('pie-chart'),
    Pie: passthrough('pie'),
    Cell: passthrough('cell')
  };
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

vi.stubGlobal('ResizeObserver', ResizeObserverMock);
