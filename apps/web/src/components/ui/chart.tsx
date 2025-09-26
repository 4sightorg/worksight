'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';
import type { LegendPayload, LegendProps } from 'recharts';
import * as RechartsPrimitive from 'recharts';

// Themes mapping
const THEMES = { light: '', dark: '.dark' } as const;
const ChartLegend = RechartsPrimitive.Legend;
const ChartTooltip = RechartsPrimitive.Tooltip;

// ------------------ Types ------------------

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType<any>;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = { config: ChartConfig };

// ------------------ Context ------------------

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error('useChart must be used within <ChartContainer />');
  return context;
}

// ------------------ Container ------------------

interface ChartContainerProps extends React.ComponentProps<'div'> {
  id?: string;
  config: ChartConfig;
  children: React.ReactElement; // ResponsiveContainer expects a ReactElement, not just ReactNode
}

function ChartContainer({ id, className, children, config, ...props }: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {React.isValidElement(children) ? children : <>{children}</>}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// ------------------ ChartStyle ------------------

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, cfg]) => Boolean(cfg.color) || Boolean(cfg.theme));

  if (!colorConfig.length) return null;

  const cssString = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const body = colorConfig
        .map(([key, cfg]) => {
          const t = (cfg as any).theme as Record<string, string> | undefined;
          const color = t?.[theme] || (cfg as any).color;
          return color ? `  --color-${key}: ${color};` : '';
        })
        .filter(Boolean)
        .join('\n');

      return `${prefix} [data-chart=${id}] {\n${body}\n}`;
    })
    .join('\n');

  return <style dangerouslySetInnerHTML={{ __html: cssString }} />;
};

// ------------------ Tooltip ------------------

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<Record<string, any>> | null;
  className?: string;
  indicator?: 'dot' | 'line' | 'dashed';
  hideLabel?: boolean;
  hideIndicator?: boolean;
  nameKey?: string;
  labelKey?: string;
  color?: string;
  label?: any;
  labelFormatter?: (value: any, ...rest: any[]) => React.ReactNode;
  labelClassName?: string;
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload || !payload.length) return null;
    const item = payload[0];
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);

    const value =
      !labelKey && typeof label === 'string'
        ? (config[label as keyof typeof config]?.label as React.ReactNode) || label
        : (itemConfig?.label as React.ReactNode);

    if (!value) return null;

    return (
      <div className={cn('font-medium', labelClassName)}>
        {labelFormatter ? labelFormatter(value, payload) : value}
      </div>
    );
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

  if (!active || !payload?.length) return null;

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      className={cn(
        'border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || 'value'}`;
          const indicatorColor = color || item.payload?.fill || item.color;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={`${String(item.dataKey ?? item.name ?? index)}-${index}`}
              className={cn(
                '[&>svg]:text-muted-foreground flex w-full flex-wrap gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
                indicator === 'dot' && 'items-center'
              )}
            >
              {!hideIndicator && (
                <div
                  style={{
                    backgroundColor: indicatorColor,
                    borderColor: indicatorColor,
                  }}
                  className={cn('shrink-0 rounded-[2px]', {
                    'h-2.5 w-2.5': indicator === 'dot',
                    'w-1': indicator === 'line',
                    'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
                  })}
                />
              )}
              <div
                className={cn(
                  'flex flex-1 justify-between leading-none',
                  nestLabel ? 'items-end' : 'items-center'
                )}
              >
                <div className="grid gap-1.5">{nestLabel ? tooltipLabel : null}</div>
                {item.value !== undefined && (
                  <span className="text-foreground font-mono font-medium tabular-nums">
                    {typeof item.value === 'number' ? item.value.toLocaleString() : String(item.value)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ------------------ Legend ------------------

export interface ChartLegendContentProps extends LegendProps {
  payload?: LegendPayload[];
  hideIcon?: boolean;
  className?: string;
  nameKey?: string;
}

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className
      )}
    >
      {(payload as LegendPayload[]).map((item) => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div
            key={String(item.value ?? item.dataKey ?? Math.random())}
            className={cn(
              '[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3'
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
}


// ------------------ Helper ------------------

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (!payload || typeof payload !== 'object') return undefined;

  const payloadObj = payload as Record<string, any>;

  const payloadData =
    'payload' in payloadObj && typeof payloadObj.payload === 'object' && payloadObj.payload !== null
      ? (payloadObj.payload as Record<string, any>)
      : undefined;

  let configKey = key;

  if (typeof payloadObj[key] === 'string') {
    configKey = payloadObj[key] as string;
  } else if (payloadData && typeof payloadData[key] === 'string') {
    configKey = payloadData[key] as string;
  }

  return configKey in config ? config[configKey] : undefined;
}

// ------------------ Exports ------------------

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent
};

