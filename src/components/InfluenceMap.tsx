import { useEffect, useRef } from 'react';
import { Stakeholder } from '../lib/supabase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ScatterController,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, Tooltip, Legend, ScatterController);

interface InfluenceMapProps {
  stakeholders: Stakeholder[];
}

const TIER_COLORS = {
  champion: 'rgba(124, 201, 74, 0.85)',
  supporter: 'rgba(91, 163, 232, 0.85)',
  neutral: 'rgba(136, 135, 128, 0.85)',
  skeptic: 'rgba(232, 122, 74, 0.85)',
};

export default function InfluenceMap({ stakeholders }: InfluenceMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const quadrantPlugin = {
      id: 'quadrantPlugin',
      afterDraw: (chart: any) => {
        const { ctx, chartArea: { left, right, top, bottom } } = chart;
        const midX = (left + right) / 2;
        const midY = (top + bottom) / 2;

        ctx.save();
        ctx.strokeStyle = 'rgba(201, 146, 42, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(midX, top);
        ctx.lineTo(midX, bottom);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(left, midY);
        ctx.lineTo(right, midY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '500 10px DM Sans, sans-serif';
        ctx.fillStyle = 'rgba(201, 146, 42, 0.4)';
        ctx.textAlign = 'center';

        ctx.fillText('MONITOR', left + (midX - left) / 2, top + 16);
        ctx.fillText('KEEP SATISFIED', midX + (right - midX) / 2, top + 16);
        ctx.fillText('KEEP INFORMED', left + (midX - left) / 2, bottom - 8);
        ctx.fillText('KEY PLAYERS', midX + (right - midX) / 2, bottom - 8);

        ctx.restore();
      },
    };

    const datasets = Object.entries(TIER_COLORS).map(([tier, color]) => ({
      label: tier.charAt(0).toUpperCase() + tier.slice(1),
      data: stakeholders
        .filter(s => s.tier === tier)
        .map(s => ({
          x: s.interest,
          y: s.influence,
          name: s.name,
          organization: s.organization,
        })),
      backgroundColor: color,
      pointRadius: 9,
      pointHoverRadius: 12,
    }));

    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 15, 19, 0.9)',
            borderColor: 'rgba(201, 146, 42, 0.4)',
            borderWidth: 0.5,
            padding: 10,
            callbacks: {
              title: () => '',
              label: (context: any) => [
                context.raw.name,
                context.raw.organization,
                `Influence: ${context.raw.y}  Interest: ${context.raw.x}`,
              ],
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Interest →',
              color: 'rgba(201, 146, 42, 0.5)',
              font: { size: 12 },
            },
            min: 0.5,
            max: 10.5,
            ticks: { stepSize: 1, color: 'rgba(160, 157, 147, 0.5)' },
            grid: { color: 'rgba(201, 146, 42, 0.06)' },
            border: { color: 'rgba(201, 146, 42, 0.15)' },
          },
          y: {
            title: {
              display: true,
              text: 'Influence →',
              color: 'rgba(201, 146, 42, 0.5)',
              font: { size: 12 },
            },
            min: 0.5,
            max: 10.5,
            ticks: { stepSize: 1, color: 'rgba(160, 157, 147, 0.5)' },
            grid: { color: 'rgba(201, 146, 42, 0.06)' },
            border: { color: 'rgba(201, 146, 42, 0.15)' },
          },
        },
      },
      plugins: [quadrantPlugin],
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [stakeholders]);

  return (
    <div>
      <p className="map-hint">
        Each point is a stakeholder. Hover for details. Dashed lines divide the four engagement quadrants.
      </p>
      <div style={{ position: 'relative', height: '460px', background: 'var(--ink2)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '8px' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="legend">
        <div className="leg-item">
          <div className="dot" style={{ background: '#7cc94a' }}></div>
          Champion
        </div>
        <div className="leg-item">
          <div className="dot" style={{ background: '#5ba3e8' }}></div>
          Supporter
        </div>
        <div className="leg-item">
          <div className="dot" style={{ background: '#888780' }}></div>
          Neutral
        </div>
        <div className="leg-item">
          <div className="dot" style={{ background: '#e87a4a' }}></div>
          Skeptic
        </div>
      </div>
    </div>
  );
}
