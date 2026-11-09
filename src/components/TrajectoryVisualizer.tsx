import React from 'react';
import { DiagramData } from '../types/physics';

interface TrajectoryVisualizerProps {
  data: DiagramData;
  className?: string;
}

export const TrajectoryVisualizer: React.FC<TrajectoryVisualizerProps> = ({ data, className = '' }) => {
  const { v0, angleDeg, h0, g } = data;
  const rad = (angleDeg * Math.PI) / 180;
  const vix = v0 * Math.cos(rad);
  const viy = v0 * Math.sin(rad);

  // Calculate actual physics metrics
  // y(t) = h0 + viy*t - 0.5*g*t^2 = 0
  // 0.5*g*t^2 - viy*t - h0 = 0
  // t = [viy + sqrt(viy^2 + 2*g*h0)] / g
  const discriminant = viy * viy + 2 * g * h0;
  const tFlight = (viy + Math.sqrt(Math.max(0, discriminant))) / g;
  const range = Math.max(1, vix * tFlight);
  const apexTime = viy > 0 ? viy / g : 0;
  const apexH = h0 + (viy > 0 ? (viy * viy) / (2 * g) : 0);

  // SVG dimensions & margins
  const svgWidth = 420;
  const svgHeight = 170;
  const padLeft = 45;
  const padRight = 35;
  const padBottom = 28;
  const padTop = 22;

  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padBottom - padTop;

  const maxPhysX = range * 1.12;
  const maxPhysY = Math.max(apexH * 1.25, h0 + 5, 8);

  const scaleX = (x: number) => padLeft + (x / maxPhysX) * plotWidth;
  const scaleY = (y: number) => svgHeight - padBottom - (y / maxPhysY) * plotHeight;

  // Generate trajectory path points
  const steps = 40;
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tFlight;
    const px = vix * t;
    const py = Math.max(0, h0 + viy * t - 0.5 * g * t * t);
    points.push([scaleX(px), scaleY(py)]);
  }

  const pathD = points.length > 0 
    ? `M ${points[0][0]} ${points[0][1]} ` + points.slice(1).map(p => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
    : '';

  // Arrow vector for v0
  const arrowLen = 32;
  const launchScreenX = scaleX(0);
  const launchScreenY = scaleY(h0);
  const arrowEndX = launchScreenX + arrowLen * Math.cos(rad);
  const arrowEndY = launchScreenY - arrowLen * Math.sin(rad);

  return (
    <div className={`p-2 bg-[#1b251e] text-[#4af688] font-mono text-xs retro-border select-none overflow-x-auto ${className}`}>
      <div className="flex justify-between items-center mb-1 text-[11px] text-[#86efac] border-b border-[#2d4934] pb-1">
        <span>[SYS.DIAG: KINEMATIC TRAJECTORY MODEL]</span>
        <span>g = {g} m/s²</span>
      </div>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto max-h-[175px] block mx-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="v-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#facc15" />
          </marker>
        </defs>

        {/* Grid lines */}
        <line x1={padLeft} y1={svgHeight - padBottom} x2={svgWidth - padRight + 15} y2={svgHeight - padBottom} stroke="#2e4d37" strokeWidth="1.5" />
        <line x1={padLeft} y1={padTop - 5} x2={padLeft} y2={svgHeight - padBottom} stroke="#2e4d37" strokeWidth="1.5" />

        {/* Cliff / platform if h0 > 0 */}
        {h0 > 0 && (
          <g>
            <rect
              x={padLeft - 18}
              y={scaleY(h0)}
              width={18}
              height={scaleY(0) - scaleY(h0)}
              fill="#223b2c"
              stroke="#386646"
              strokeWidth="1"
            />
            {/* Height label */}
            <line
              x1={padLeft - 24}
              y1={scaleY(h0)}
              x2={padLeft - 24}
              y2={scaleY(0)}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            <text x={padLeft - 28} y={(scaleY(h0) + scaleY(0)) / 2 + 3} fill="#94a3b8" fontSize="9" textAnchor="end">
              h={h0.toFixed(0)}m
            </text>
          </g>
        )}

        {/* Parabolic path */}
        <path
          d={pathD}
          fill="none"
          stroke="#4af688"
          strokeWidth="2"
          strokeDasharray="3,3"
        />

        {/* Apex marker */}
        {viy > 0 && (
          <g>
            <circle cx={scaleX(vix * apexTime)} cy={scaleY(apexH)} r="3" fill="#38bdf8" />
            <line
              x1={scaleX(vix * apexTime)}
              y1={scaleY(apexH)}
              x2={scaleX(vix * apexTime)}
              y2={scaleY(0)}
              stroke="#38bdf8"
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />
            <text
              x={scaleX(vix * apexTime)}
              y={scaleY(apexH) - 6}
              fill="#7dd3fc"
              fontSize="9"
              textAnchor="middle"
            >
              H_max={apexH.toFixed(1)}m
            </text>
          </g>
        )}

        {/* Landing marker */}
        <circle cx={scaleX(range)} cy={scaleY(0)} r="3" fill="#f87171" />
        <text
          x={scaleX(range)}
          y={scaleY(0) + 14}
          fill="#fca5a5"
          fontSize="9"
          textAnchor="middle"
        >
          R={range.toFixed(1)}m
        </text>

        {/* Launch velocity arrow */}
        <line
          x1={launchScreenX}
          y1={launchScreenY}
          x2={arrowEndX}
          y2={arrowEndY}
          stroke="#facc15"
          strokeWidth="2.5"
          markerEnd="url(#v-arrow)"
        />

        {/* Angle arc if angleDeg != 0 */}
        {angleDeg !== 0 && (
          <g>
            <path
              d={`M ${launchScreenX + 16} ${launchScreenY} A 16 16 0 0 ${angleDeg > 0 ? 0 : 1} ${launchScreenX + 16 * Math.cos(rad)} ${launchScreenY - 16 * Math.sin(rad)}`}
              fill="none"
              stroke="#facc15"
              strokeWidth="1"
            />
            <text
              x={launchScreenX + 22}
              y={launchScreenY - 4}
              fill="#fde047"
              fontSize="9"
            >
              {angleDeg}°
            </text>
          </g>
        )}

        {/* Initial projectile origin */}
        <circle cx={launchScreenX} cy={launchScreenY} r="3.5" fill="#facc15" />
        <text x={launchScreenX - 5} y={launchScreenY - 7} fill="#fef08a" fontSize="9" textAnchor="end">
          v_i={v0}m/s
        </text>

        {/* Axes labels */}
        <text x={svgWidth - padRight + 12} y={svgHeight - padBottom + 12} fill="#6ee7b7" fontSize="9" textAnchor="end">
          +X (m)
        </text>
        <text x={padLeft - 8} y={padTop} fill="#6ee7b7" fontSize="9" textAnchor="end">
          +Y (m)
        </text>
      </svg>
    </div>
  );
};
