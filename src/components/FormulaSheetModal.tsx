import React from 'react';
import { MathRenderer, FormattedText } from './MathRenderer';

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[var(--card-bg)] text-[var(--text-primary)] retro-border overflow-hidden flex flex-col">
        {/* Title bar */}
        <div className="bg-[#2b3a32] text-[#f2efe9] px-4 py-2 flex items-center justify-between border-b-2 border-[#1c2321]">
          <div className="flex items-center space-x-2 text-sm font-bold tracking-wider font-pixel">
            <span className="w-2.5 h-2.5 bg-[#4af688] inline-block animate-pulse"></span>
            <span>REFERENCE: IDEAL PROJECTILE KINEMATICS HANDBOOK</span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 bg-[#d9534f] text-white hover:bg-[#c9302c] text-xs font-mono retro-border-sm cursor-pointer"
          >
            [X] CLOSE
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-sm font-mono leading-relaxed">
          {/* Section: Assumptions & Coordinates */}
          <div className="p-3 bg-[var(--bg-color)] border border-[var(--border-color)] retro-border-sm">
            <div className="font-bold text-[var(--highlight)] mb-1">
              [01] STANDARD COORDINATE SYSTEM & AXIOMS
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
              <li>
                <FormattedText text="Air resistance is completely neglected ($F_{\text{drag}} = 0$). Ideal free-flight model." className="inline" />
              </li>
              <li>
                <FormattedText text="Horizontal axis ($+x$): Forward in direction of launch. Horizontal acceleration $a_x = 0$." className="inline" />
              </li>
              <li>
                <FormattedText text="Vertical axis ($+y$): Upward. Gravitational acceleration $a_y = -g$ (where $g = 9.8\text{ m/s}^2$)." className="inline" />
              </li>
              <li>
                <FormattedText text="Independence of motion: $x(t)$ and $y(t)$ are completely decoupled, sharing only elapsed time $t$." className="inline" />
              </li>
            </ul>
          </div>

          {/* Section: Component Resolution */}
          <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)]">
            <div className="font-bold text-[var(--accent)] mb-2">
              <FormattedText text="[02] VELOCITY VECTOR RESOLUTION (Launch angle $\theta$ relative to horizontal)" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                <div className="font-semibold text-center mb-1">Horizontal Initial Velocity</div>
                <MathRenderer math="v_{ix} = v_i \cos\theta" block />
                <div className="text-[11px] text-[var(--text-muted)] text-center">
                  <FormattedText text="Constant for all time ($v_{fx} = v_{ix}$)" />
                </div>
              </div>
              <div className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                <div className="font-semibold text-center mb-1">Vertical Initial Velocity</div>
                <MathRenderer math="v_{iy} = v_i \sin\theta" block />
                <div className="text-[11px] text-[var(--text-muted)] text-center">
                  Changes continuously with gravity
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs">
              <div className="font-semibold">Reverse calculation (from components):</div>
              <MathRenderer math="v_i = \sqrt{v_{ix}^2 + v_{iy}^2}, \quad \theta = \arctan\left(\frac{v_{iy}}{v_{ix}}\right)" block />
            </div>
          </div>

          {/* Section: General Motion Equations */}
          <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)]">
            <div className="font-bold text-[var(--accent)] mb-2">
              <FormattedText text="[03] TIME-DEPENDENT KINEMATICS (Arbitrary time $t$)" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                <div className="font-semibold text-center mb-1">Horizontal Position</div>
                <MathRenderer math="\Delta x(t) = v_{ix} t" block />
              </div>
              <div className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                <div className="font-semibold text-center mb-1">Vertical Position</div>
                <MathRenderer math="\Delta y(t) = v_{iy} t - \frac{1}{2}gt^2" block />
              </div>
              <div className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                <div className="font-semibold text-center mb-1">Vertical Velocity</div>
                <MathRenderer math="v_y(t) = v_{iy} - gt" block />
              </div>
              <div className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                <div className="font-semibold text-center mb-1">Resultant Speed & Direction</div>
                <MathRenderer math="v(t) = \sqrt{v_x^2 + v_y(t)^2}, \quad \phi = \arctan\left(\frac{v_y(t)}{v_x}\right)" block />
              </div>
            </div>
          </div>

          {/* Section: Symmetrical vs Asymmetrical formulas */}
          <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)]">
            <div className="font-bold text-[var(--accent)] mb-2">
              [04] SPECIALIZED BOUNDARY CONDITIONS
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                <div className="font-semibold">
                  <FormattedText text="Level Ground Launch ($\Delta y = 0$):" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
                  <div>
                    <span className="text-[11px] block text-center">Time of Flight</span>
                    <MathRenderer math="T = \frac{2v_i\sin\theta}{g}" block />
                  </div>
                  <div>
                    <span className="text-[11px] block text-center">Apex Height</span>
                    <MathRenderer math="H = \frac{(v_i\sin\theta)^2}{2g}" block />
                  </div>
                  <div>
                    <span className="text-[11px] block text-center">Horizontal Range</span>
                    <MathRenderer math="R = \frac{v_i^2\sin(2\theta)}{g}" block />
                  </div>
                </div>
              </div>

              <div className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                <div className="font-semibold">
                  <FormattedText text="Pure Horizontal Launch from Height $h$ ($v_{iy} = 0$):" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[11px] block text-center">Time to Fall</span>
                    <MathRenderer math="t = \sqrt{\frac{2h}{g}}" block />
                  </div>
                  <div>
                    <span className="text-[11px] block text-center">Impact Speed</span>
                    <MathRenderer math="v_f = \sqrt{v_x^2 + 2gh}" block />
                  </div>
                </div>
              </div>

              <div className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)]">
                <div className="font-semibold">
                  <FormattedText text="Elevated Launch ($\Delta y = -h$):" />
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-1">
                  Must solve the quadratic equation:
                  <MathRenderer math="\frac{1}{2}gt^2 - (v_i\sin\theta)t - h = 0 \implies t = \frac{v_{iy} + \sqrt{v_{iy}^2 + 2gh}}{g}" block />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[var(--card-bg)] border-t-2 border-[var(--border-color)] text-right">
          <button onClick={onClose} className="px-4 py-1.5 retro-btn text-xs font-bold">
            CLOSE REFERENCE
          </button>
        </div>
      </div>
    </div>
  );
};
