import { useEffect, useMemo, useRef } from 'react';
import {
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
  CandlestickSeries,
  createChart,
  HistogramSeries,
} from 'lightweight-charts';
import type { Kline } from '../types';

function getCssVar(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function KlineChart({ candles, locale }: { candles: Kline[]; locale: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const mapped = useMemo(() => {
    const candleData = (candles || []).map((k) => {
      return {
        time: (Math.floor(k.open_time / 1000) as UTCTimestamp) || (0 as UTCTimestamp),
        open: k.open,
        high: k.high,
        low: k.low,
        close: k.close,
      };
    });

    const volumeData = (candles || []).map((k) => {
      const up = k.close >= k.open;
      return {
        time: (Math.floor(k.open_time / 1000) as UTCTimestamp) || (0 as UTCTimestamp),
        value: k.volume,
        color: up ? 'rgba(27, 154, 170, 0.35)' : 'rgba(230, 57, 70, 0.35)',
      };
    });

    return { candleData, volumeData };
  }, [candles]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stroke = getCssVar('--stroke', '#1c130c');
    const ink = getCssVar('--ink', '#1c130c');
    const bg = getCssVar('--tile', '#fff9ef');

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { color: bg },
        textColor: ink,
        fontFamily: "'Space Grotesk', 'Noto Sans SC', sans-serif",
        fontSize: 12,
      },
      localization: {
        locale,
      },
      grid: {
        vertLines: { color: 'rgba(28, 19, 12, 0.08)' },
        horzLines: { color: 'rgba(28, 19, 12, 0.08)' },
      },
      rightPriceScale: {
        borderVisible: true,
        borderColor: stroke,
      },
      timeScale: {
        borderVisible: true,
        borderColor: stroke,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: { color: 'rgba(28, 19, 12, 0.25)' },
        horzLine: { color: 'rgba(28, 19, 12, 0.25)' },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#1b9aaa',
      downColor: '#e63946',
      borderUpColor: '#1b9aaa',
      borderDownColor: '#e63946',
      wickUpColor: '#1b9aaa',
      wickDownColor: '#e63946',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      color: 'rgba(27, 154, 170, 0.35)',
      base: 0,
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });

    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    chartRef.current?.applyOptions({ localization: { locale } });
  }, [locale]);

  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    const volumeSeries = volumeSeriesRef.current;
    if (!candleSeries || !volumeSeries) return;

    candleSeries.setData(mapped.candleData);
    volumeSeries.setData(mapped.volumeData);

    chartRef.current?.timeScale().fitContent();
  }, [mapped]);

  return <div className="kline-chart" ref={containerRef} />;
}
