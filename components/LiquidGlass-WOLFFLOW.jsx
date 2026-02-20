'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';

// ─── Dark Mode Parameters ───────────────────────────────────────────────────
const DARK_MODE_PARAMS = {
    displacementScale: 70,
    aberration: 1.5,
    bezelFraction: 0.16,
    blur: 24,
    brightness: 115,
    saturation: 160,
    frostOpacity: 0.04,
};

// ─── WOLF FLOW Color Tokens ─────────────────────────────────────────────────
// Created and Authored by Johnathon Moulds © 2026
const WOLFFLOW = {
    purple: '#C41DF2',
    purpleMedium: '#5241BF',
    purpleDeep: '#5A278C',
    purpleDark: '#1E0E40',
    purpleGlow: 'rgba(196, 29, 242, 0.25)',
    blue: '#555BD9',
    blueLight: '#9C9AD9',
    pink: '#FF69B4',
};

// ─── SDF Displacement Map Utilities ─────────────────────────────────────────

function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}

function surfaceHeight(t) {
    const v = 1 - t;
    return Math.pow(Math.max(0, 1 - v * v * v * v), 0.25);
}

// ─── Map Cache ─────────────────────────────────────────────────────────────
const MAP_CACHE = new Map();

function generateDisplacementMap(w, h, radius, bezelFraction) {
    const cacheKey = `${w}-${h}-${radius}-${bezelFraction.toFixed(4)}`;
    if (MAP_CACHE.has(cacheKey)) return MAP_CACHE.get(cacheKey);

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    const minDim = Math.min(w, h);
    const bezelPx = minDim * bezelFraction;

    const rawDx = new Float32Array(w * h);
    const rawDy = new Float32Array(w * h);
    let maxDisp = 0.0001;

    const innerL = radius;
    const innerR = w - radius;
    const innerT = radius;
    const innerB = h - radius;

    for (let py = 0; py < h; py++) {
        const pyInB = py > innerB;
        const pyInT = py < innerT;
        const pyInInner = py >= innerT && py <= innerB;
        const hMinusPy = h - py;

        for (let px = 0; px < w; px++) {
            const idx = py * w + px;
            let dist;

            if (px >= innerL && px <= innerR && pyInInner) {
                dist = Math.min(px, w - px, py, hMinusPy);
            } else if (px < innerL && pyInT) {
                dist = radius - Math.sqrt((innerL - px) ** 2 + (innerT - py) ** 2);
            } else if (px > innerR && pyInT) {
                dist = radius - Math.sqrt((px - innerR) ** 2 + (innerT - py) ** 2);
            } else if (px < innerL && pyInB) {
                dist = radius - Math.sqrt((innerL - px) ** 2 + (py - innerB) ** 2);
            } else if (px > innerR && pyInB) {
                dist = radius - Math.sqrt((px - innerR) ** 2 + (py - innerB) ** 2);
            } else if (px < innerL) {
                dist = px;
            } else if (px > innerR) {
                dist = w - px;
            } else if (pyInT) {
                dist = py;
            } else {
                dist = hMinusPy;
            }

            if (dist < bezelPx && dist > 0) {
                const height = surfaceHeight(Math.max(0, dist / bezelPx));
                const displacement = 1 - height;
                const dx = px - w / 2;
                const dy = py - h / 2;
                const dirLen = Math.sqrt(dx * dx + dy * dy) || 1;

                rawDx[idx] = -(dx / dirLen) * displacement;
                rawDy[idx] = -(dy / dirLen) * displacement;
                const mag = Math.sqrt(rawDx[idx] ** 2 + rawDy[idx] ** 2);
                if (mag > maxDisp) maxDisp = mag;
            }
        }
    }

    for (let i = 0; i < w * h; i++) {
        const off = i * 4;
        data[off] = ((rawDx[i] / maxDisp * 0.5 + 0.5) * 255) | 0;
        data[off + 1] = ((rawDy[i] / maxDisp * 0.5 + 0.5) * 255) | 0;
        data[off + 2] = 128;
        data[off + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    const result = { dataUrl: canvas.toDataURL(), maxDisplacement: maxDisp };
    MAP_CACHE.set(cacheKey, result);
    return result;
}

// ─── SVG Filter Builder ─────────────────────────────────────────────────────

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgElement(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
    return el;
}

function buildLiquidGlassFilter(filterId, w, h, dataUrl, params) {
    const { displacementScale: scale, aberration: ab, saturation } = params;

    const filter = createSvgElement('filter', {
        id: filterId,
        x: '0%',
        y: '0%',
        width: '100%',
        height: '100%',
        'color-interpolation-filters': 'sRGB',
    });

    // Displacement map as feImage
    filter.appendChild(
        createSvgElement('feImage', {
            href: dataUrl,
            x: '0',
            y: '0',
            width: w,
            height: h,
            result: 'DMAP',
        })
    );

    if (ab > 0) {
        // RED channel displacement
        filter.appendChild(
            createSvgElement('feDisplacementMap', {
                in: 'SourceGraphic',
                in2: 'DMAP',
                scale: scale,
                xChannelSelector: 'R',
                yChannelSelector: 'G',
                result: 'DISP_R',
            })
        );

        // GREEN channel displacement (slightly offset)
        filter.appendChild(
            createSvgElement('feDisplacementMap', {
                in: 'SourceGraphic',
                in2: 'DMAP',
                scale: scale * (1 + ab * 0.04),
                xChannelSelector: 'R',
                yChannelSelector: 'G',
                result: 'DISP_G',
            })
        );

        // BLUE channel displacement (even more offset)
        filter.appendChild(
            createSvgElement('feDisplacementMap', {
                in: 'SourceGraphic',
                in2: 'DMAP',
                scale: scale * (1 + ab * 0.08),
                xChannelSelector: 'R',
                yChannelSelector: 'G',
                result: 'DISP_B',
            })
        );

        // Extract R channel
        filter.appendChild(
            createSvgElement('feColorMatrix', {
                in: 'DISP_R',
                type: 'matrix',
                values: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
                result: 'R_ONLY',
            })
        );

        // Extract G channel
        filter.appendChild(
            createSvgElement('feColorMatrix', {
                in: 'DISP_G',
                type: 'matrix',
                values: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
                result: 'G_ONLY',
            })
        );

        // Extract B channel
        filter.appendChild(
            createSvgElement('feColorMatrix', {
                in: 'DISP_B',
                type: 'matrix',
                values: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0',
                result: 'B_ONLY',
            })
        );

        // Recombine R+G
        filter.appendChild(
            createSvgElement('feBlend', {
                in: 'R_ONLY',
                in2: 'G_ONLY',
                mode: 'screen',
                result: 'RG',
            })
        );

        // Recombine RG+B
        filter.appendChild(
            createSvgElement('feBlend', {
                in: 'RG',
                in2: 'B_ONLY',
                mode: 'screen',
                result: 'COMBINED',
            })
        );

        // Saturation boost
        filter.appendChild(
            createSvgElement('feColorMatrix', {
                in: 'COMBINED',
                type: 'saturate',
                values: (saturation / 100).toString(),
            })
        );
    } else {
        // Simple single displacement (no chromatic aberration)
        filter.appendChild(
            createSvgElement('feDisplacementMap', {
                in: 'SourceGraphic',
                in2: 'DMAP',
                scale: scale,
                xChannelSelector: 'R',
                yChannelSelector: 'G',
                result: 'DISPLACED',
            })
        );

        filter.appendChild(
            createSvgElement('feColorMatrix', {
                in: 'DISPLACED',
                type: 'saturate',
                values: (saturation / 100).toString(),
            })
        );
    }

    return filter;
}

// ─── applyLiquidGlass (React-adapted) ───────────────────────────────────────

function applyLiquidGlass(el, svgDefs, counterRef, params, skipSvg = false) {
    const filterLayer = el.querySelector('.lg-filter-layer');
    if (!filterLayer) return;

    const rect = el.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w < 10 || h < 10) return;

    const radius = parseFloat(el.dataset.radius) || 24;
    const bezel = parseFloat(el.dataset.bezel) || params.bezelFraction;

    let filterId = el.dataset.lgFilterId;

    if (!skipSvg || !filterId) {
        const { dataUrl } = generateDisplacementMap(w, h, radius, bezel);
        filterId = `lg-${counterRef.current++}`;
        const filterEl = buildLiquidGlassFilter(filterId, w, h, dataUrl, params);
        svgDefs.appendChild(filterEl);
        el.dataset.lgFilterId = filterId;
    } else {
        // Just update attributes on existing filter if it exists in DOM
        const filterEl = svgDefs.querySelector(`#${filterId}`);
        if (filterEl) {
            const { displacementScale: scale, aberration: ab, saturation } = params;
            const dmps = filterEl.querySelectorAll('feDisplacementMap');
            if (dmps.length > 0) {
                if (ab > 0 && dmps.length >= 3) {
                    dmps[0].setAttribute('scale', scale);
                    dmps[1].setAttribute('scale', scale * (1 + ab * 0.04));
                    dmps[2].setAttribute('scale', scale * (1 + ab * 0.08));
                } else if (dmps[0]) {
                    dmps[0].setAttribute('scale', scale);
                }
            }
            const saturationMatrix = filterEl.querySelector('feColorMatrix[type="saturate"]');
            if (saturationMatrix) {
                saturationMatrix.setAttribute('values', (saturation / 100).toString());
            }
        }
    }

    const backdropValue =
        `url(#${filterId}) blur(${params.blur}px) brightness(${params.brightness}%)`;
    filterLayer.style.backdropFilter = backdropValue;
    filterLayer.style.webkitBackdropFilter = backdropValue;
}

// ─── useLiquidGlass Hook ────────────────────────────────────────────────────

function useLiquidGlass(params = DARK_MODE_PARAMS) {
    const svgDefsRef = useRef(null);
    const filterCounterRef = useRef(0);
    const panelRefs = useRef([]);

    const lastParamsRef = useRef(params);

    const rebuild = useCallback((forceSvg = false) => {
        const defs = svgDefsRef.current;
        if (!defs) return;

        // Check which params changed
        const pChanged = lastParamsRef.current.displacementScale !== params.displacementScale ||
            lastParamsRef.current.aberration !== params.aberration ||
            lastParamsRef.current.saturation !== params.saturation ||
            lastParamsRef.current.bezelFraction !== params.bezelFraction;

        const needsSvgRebuild = forceSvg || pChanged || !defs.firstChild;

        if (needsSvgRebuild) {
            while (defs.firstChild) defs.removeChild(defs.firstChild);
            filterCounterRef.current = 0;
            panelRefs.current.forEach(el => { if (el) delete el.dataset.lgFilterId; });
        }

        lastParamsRef.current = params;

        // Update frost layers
        panelRefs.current.forEach((el) => {
            if (!el) return;
            const frost = el.querySelector('.lg-frost-layer');
            if (frost) {
                frost.style.background = `rgba(255,255,255, ${params.frostOpacity})`;
            }
        });

        // Apply glass to all registered panels
        panelRefs.current.forEach((el) => {
            if (!el) return;
            applyLiquidGlass(el, defs, filterCounterRef, params, !needsSvgRebuild);
        });
    }, [params]);

    useEffect(() => {
        // Small delay to ensure panels are rendered and have dimensions
        const timer = setTimeout(rebuild, 50);

        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => rebuild(true), 200);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(timer);
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
        };
    }, [rebuild]);

    const registerPanel = useCallback((el) => {
        if (el && !panelRefs.current.includes(el)) {
            panelRefs.current.push(el);
        }
    }, []);

    const unregisterAll = useCallback(() => {
        panelRefs.current = [];
    }, []);

    return { svgDefsRef, registerPanel, rebuild, unregisterAll };
}

// ─── SVG Defs Container ─────────────────────────────────────────────────────

function LiquidGlassSvgDefs({ svgDefsRef }) {
    return (
        <svg
            style={{
                position: 'absolute',
                width: 0,
                height: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
            aria-hidden="true"
        >
            <defs ref={svgDefsRef} />
        </svg>
    );
}

// ─── Tier 1: Full Liquid Glass Panel ────────────────────────────────────────

function LiquidGlassPanel({
    children,
    radius = 24,
    bezel,
    className = '',
    style = {},
    registerRef,
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...props
}) {
    const elRef = useRef(null);

    useEffect(() => {
        if (elRef.current && registerRef) {
            registerRef(elRef.current);
        }
    }, [registerRef]);

    return (
        <div
            ref={elRef}
            className={`lg-glass-panel ${className}`}
            data-radius={radius}
            data-bezel={bezel}
            style={{ position: 'relative', borderRadius: radius, overflow: 'hidden', ...style }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...props}
        >
            <div className="lg-filter-layer" />
            <div className="lg-frost-layer" />
            <div className="lg-specular-layer" />
            <div className="lg-edge-layer" />
            <div className="lg-content-layer">{children}</div>
        </div>
    );
}

// ─── Tier 2: Simplified Glass (no SDF displacement) ────────────────────────

function SimpleGlassPanel({
    children,
    radius = 16,
    className = '',
    style = {},
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...props
}) {
    return (
        <div
            className={`lg-glass-panel lg-simple ${className}`}
            style={{ position: 'relative', borderRadius: radius, overflow: 'hidden', ...style }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...props}
        >
            <div
                className="lg-filter-layer"
                style={{
                    backdropFilter: 'blur(24px) brightness(115%)',
                    WebkitBackdropFilter: 'blur(24px) brightness(115%)',
                }}
            />
            <div className="lg-frost-layer" />
            <div className="lg-specular-layer" />
            <div className="lg-edge-layer" />
            <div className="lg-content-layer">{children}</div>
        </div>
    );
}

// ─── Tier 3: Lightweight Glass (buttons, toggles) ──────────────────────────

function LightGlassPanel({
    children,
    radius = 12,
    className = '',
    style = {},
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...props
}) {
    return (
        <div
            className={`lg-glass-panel lg-light ${className}`}
            style={{ position: 'relative', borderRadius: radius, overflow: 'hidden', ...style }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...props}
        >
            <div
                className="lg-filter-layer"
                style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                }}
            />
            <div className="lg-frost-layer" />
            <div className="lg-content-layer">{children}</div>
        </div>
    );
}

// ─── Shared CSS (injected once) ─────────────────────────────────────────────

const LIQUID_GLASS_STYLES = `
/* ─── Liquid Glass Layer Stack ─────────────────────────────────────────── */

.lg-glass-panel {
  position: relative;
  transition: transform 0.3s ease;
}

/* Filter layer — receives the SVG displacement + blur */
.lg-filter-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 0;
}

/* Frost layer — glass tint */
.lg-frost-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 1;
  pointer-events: none;
  background: rgba(255, 255, 255, 0.04);
  transition: background 0.3s ease;
}

/* Specular layer — diagonal highlight */
.lg-specular-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.02) 30%,
    transparent 60%
  );
  transition: background 0.3s ease;
}

/* Edge layer — beveled border illusion */
.lg-edge-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 3;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(0, 0, 0, 0.15),
    inset 1px 0 0 rgba(255, 255, 255, 0.05),
    inset -1px 0 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

/* Content layer */
.lg-content-layer {
  position: relative;
  z-index: 4;
}

/* ─── Hover States ─────────────────────────────────────────────────────── */

.lg-glass-panel:hover .lg-frost-layer {
  background: rgba(255, 255, 255, 0.08);
}

.lg-glass-panel:hover .lg-specular-layer {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.14) 0%,
    rgba(255, 255, 255, 0.04) 30%,
    transparent 55%
  );
}

.lg-glass-panel:hover .lg-edge-layer {
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2),
    inset 1px 0 0 rgba(255, 255, 255, 0.1),
    inset -1px 0 0 rgba(255, 255, 255, 0.1);
}

/* Simplified glass — no specular/edge hover change needed */
.lg-glass-panel.lg-simple:hover .lg-frost-layer {
  background: rgba(255, 255, 255, 0.06);
}

/* Lightweight glass — minimal hover */
.lg-glass-panel.lg-light:hover .lg-frost-layer {
  background: rgba(255, 255, 255, 0.06);
}
`;

function LiquidGlassStyles() {
    return <style dangerouslySetInnerHTML={{ __html: LIQUID_GLASS_STYLES }} />;
}

export {
    DARK_MODE_PARAMS,
    WOLFFLOW,
    useLiquidGlass,
    LiquidGlassSvgDefs,
    LiquidGlassPanel,
    SimpleGlassPanel,
    LightGlassPanel,
    LiquidGlassStyles,
    generateDisplacementMap,
};
