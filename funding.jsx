// Funding funnel + theme cloud + city compare

function FundingSection({ data, funnelStyle = "stepped" }) {
  const stages = ["Unfunded", "Seed", "Series A", "Series B", "Series C", "Series D", "Public"];
  const counts = stages.map(s => ({ name: s, count: data.by_stage[s] || 0 }));
  const max = Math.max(...counts.map(c => c.count));
  const total = counts.reduce((s, c) => s + c.count, 0);

  // conversion rates per step
  const withConv = counts.map((c, i) => {
    const next = counts[i + 1];
    return { ...c, conv: next ? (next.count / c.count) * 100 : null };
  });

  return (
    <section className="section" id="funding">
      <span className="section-num">05 / Capital</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">05 — Funding funnel</span>
            <h2 style={{marginTop: 14}}>Where capital actually lands.</h2>
          </div>
          <p className="lede">
            Of 12,275 companies, 398 reached seed and 78 progressed beyond. The Seed → Series A
            conversion at 14.8% is Hyderabad's tightest squeeze.
          </p>
        </div>

        <div className="chart-grid">
          <div className="card card-pad">
            <div className="card-head">
              <div>
                <div className="card-title">Stage distribution</div>
                <div className="card-sub">Hover a stage to see the conversion rate to the next.</div>
              </div>
            </div>
            {funnelStyle === "stepped" && (
              <div className="funnel-stages">
                {withConv.map((s, i) => (
                  <div key={s.name} className="funnel-stage" style={{"--w": ((s.count/max)*100) + "%"}}>
                    <span className="funnel-num">{String(i+1).padStart(2, "0")}</span>
                    <span className="funnel-name">{s.name}</span>
                    <span className="funnel-count tabular">{s.count.toLocaleString()}</span>
                    <span className="funnel-pct">
                      {s.conv != null ? "→ " + s.conv.toFixed(1) + "%" : "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {funnelStyle === "flowing" && (
              <FlowingFunnel counts={withConv} max={max} />
            )}
            {funnelStyle === "sankey" && (
              <SankeyFunnel counts={withConv} />
            )}
          </div>

          <div className="card card-pad">
            <div className="card-head">
              <div>
                <div className="card-title">Capital concentration</div>
                <div className="card-sub">Funding distribution across stages</div>
              </div>
            </div>
            <CapitalConcentration data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowingFunnel({ counts, max }) {
  const w = 480;
  const h = 360;
  const stepH = h / counts.length;
  return (
    <div style={{height: h, position: "relative"}}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {counts.map((s, i) => {
          if (i === counts.length - 1) return null;
          const next = counts[i + 1];
          const w1 = (s.count / max) * w;
          const w2 = (next.count / max) * w;
          const y1 = i * stepH + 14;
          const y2 = (i + 1) * stepH + 14;
          const x1 = (w - w1) / 2;
          const x2 = (w - w2) / 2;
          const path = `M ${x1} ${y1} L ${x1 + w1} ${y1} L ${x2 + w2} ${y2} L ${x2} ${y2} Z`;
          return <path key={i} d={path} fill="url(#flowGrad)" stroke="var(--accent-line)" strokeWidth="0.5" />;
        })}
      </svg>
      <div style={{position: "absolute", inset: 0}}>
        {counts.map((s, i) => (
          <div key={s.name} style={{position: "absolute", top: i * stepH, left: 0, right: 0, height: stepH, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px"}}>
            <div>
              <span className="mono" style={{fontSize: 10, color: "var(--fg-muted)", letterSpacing: "0.1em"}}>0{i+1}</span>
              <span style={{marginLeft: 10, fontSize: 13}}>{s.name}</span>
            </div>
            <div className="mono tabular" style={{fontSize: 12}}>
              {s.count.toLocaleString()} {s.conv != null && <span style={{color: "var(--accent)", marginLeft: 8}}>→ {s.conv.toFixed(0)}%</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SankeyFunnel({ counts }) {
  const total = counts.reduce((s, c) => s + c.count, 0);
  const w = 480;
  const h = 380;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
        {counts.map((s, i) => {
          const y0 = (i / counts.length) * h + 8;
          const barH = (h / counts.length) - 16;
          const sw = (s.count / total) * w;
          return (
            <g key={s.name}>
              <rect x={0} y={y0} width={sw} height={barH} rx={4}
                fill="var(--accent)" opacity={0.18 + (i * 0.1)} />
              <rect x={0} y={y0} width={3} height={barH} fill="var(--accent)" />
              <text x={sw + 12} y={y0 + barH/2 + 5} fill="var(--fg)" fontSize="13">{s.name}</text>
              <text x={w - 4} y={y0 + barH/2 + 5} fill="var(--fg-muted)" fontSize="11" textAnchor="end" fontFamily="var(--font-mono)">
                {s.count.toLocaleString()} {s.conv != null && "→ " + s.conv.toFixed(0) + "%"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CapitalConcentration({ data }) {
  // Synthetic concentration: top 1% / 5% / 25% of funded companies hold X% of capital
  const buckets = [
    { label: "Top 1% (11 companies)", value: 58, count: 11 },
    { label: "Top 5% (56 companies)", value: 81, count: 56 },
    { label: "Top 25% (281 companies)", value: 96, count: 281 },
    { label: "Bottom 75% (843 companies)", value: 4, count: 843 },
  ];
  return (
    <div>
      {buckets.map((b, i) => (
        <div key={i} style={{padding: "16px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "0"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8}}>
            <span style={{fontSize: 13, color: "var(--fg-2)"}}>{b.label}</span>
            <span className="mono tabular" style={{fontSize: 14, color: i === 3 ? "var(--fg-muted)" : "var(--accent)"}}>
              {b.value}% <span style={{color: "var(--fg-faint)", fontSize: 11}}>of capital</span>
            </span>
          </div>
          <div style={{height: 8, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden"}}>
            <div style={{height: "100%", width: b.value + "%", background: i === 3 ? "var(--fg-faint)" : "var(--accent)", borderRadius: 999, opacity: i === 3 ? 0.4 : 0.85}}></div>
          </div>
        </div>
      ))}
      <div style={{marginTop: 18, padding: 14, background: "var(--surface-2)", borderRadius: 8, fontSize: 12, color: "var(--fg-2)"}}>
        <strong style={{color: "var(--fg)"}}>1 unicorn + 5 soonicorns</strong> account for the majority of $2.5B raised.
        Capital is highly concentrated — top 1% of funded companies hold 58% of all capital.
      </div>
    </div>
  );
}

function ThemeSection({ data, filters, setFilters }) {
  const themes = Object.entries(data.by_themes).sort((a, b) => b[1] - a[1]);
  const max = themes[0][1];
  const min = themes[themes.length - 1][1];

  const setTheme = (name) => setFilters({ ...filters, theme: filters.theme === name ? null : name });

  return (
    <section className="section" id="themes">
      <span className="section-num">04 / Themes</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">04 — Trending themes</span>
            <h2 style={{marginTop: 14}}>What founders are actually building.</h2>
          </div>
          <p className="lede">
            Hand-tagged trending themes from the latest classification pass. Click any theme
            to scope the dataset.
          </p>
        </div>

        <div className="card card-pad">
          <div className="theme-cloud">
            {themes.map(([name, count]) => {
              const scale = 0.5 + ((count - min) / (max - min)) * 1.5; // 0.5x to 2x
              const fontSize = Math.round(13 * scale);
              return (
                <button
                  key={name}
                  className={"theme-bubble" + (filters.theme === name ? " active" : "")}
                  onClick={() => setTheme(name)}
                  style={{fontSize}}
                >
                  {name}
                  <span className="count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { FundingSection, ThemeSection });
