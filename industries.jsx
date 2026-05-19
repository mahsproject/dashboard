// Industry breakdown — donut / radial bars / treemap variants
const { PieChart, Pie, Cell, ResponsiveContainer, Tooltip: RTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Treemap } = window.Recharts;

function IndustrySection({ data, filters, setFilters, chartStyle = "donut" }) {
  const colors = window.SCALEME_THEME.industries;
  const entries = Object.entries(data.by_industry)
    .filter(([, v]) => v.total > 0)
    .sort((a, b) => b[1].total - a[1].total);

  const donutData = entries.map(([name, v]) => ({
    name, value: v.total, color: colors[name] || "#888",
    funded_pct: v.funded_pct, active_pct: v.active_pct,
    funded: v.funded, active: v.active,
  }));

  const selected = filters.industry;
  const onSelect = (name) => setFilters({ ...filters, industry: filters.industry === name ? null : name });

  const subSectors = selected
    ? Object.entries(data.by_industry_subsectors[selected] || {})
        .sort((a, b) => b[1] - a[1]).slice(0, 12)
        .map(([name, count]) => ({ name, count }))
    : [];

  return (
    <section className="section" id="industries">
      <span className="section-num">02 / Industries</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">02 — Composition</span>
            <h2 style={{marginTop: 14}}>The shape of the ecosystem.</h2>
          </div>
          <p className="lede">
            Eleven industry buckets, ten of them substantive. IT Services & Software remains the gravitational center —
            but Healthcare, Consumer, and FinTech together are nearly its match.
          </p>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <div>
              <div className="card-title">Industry breakdown</div>
              <div className="card-sub">Click a slice or row to drill into sub-sectors.</div>
            </div>
            <ChartStyleSwitch />
          </div>

          <div className="chart-grid">
            <div>
              {chartStyle === "donut" && <DonutView donutData={donutData} selected={selected} onSelect={onSelect} />}
              {chartStyle === "radial" && <RadialView donutData={donutData} selected={selected} onSelect={onSelect} />}
              {chartStyle === "treemap" && <TreemapView donutData={donutData} selected={selected} onSelect={onSelect} />}
            </div>
            <div>
              {selected ? (
                <SubSectorList industry={selected} subSectors={subSectors} color={colors[selected]} />
              ) : (
                <IndustryLegend donutData={donutData} onSelect={onSelect} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Toolbar to switch chart style — reads from window-scoped tweak
function ChartStyleSwitch() {
  return null; // controlled by Tweaks panel
}

function DonutView({ donutData, selected, onSelect }) {
  const total = donutData.reduce((a, b) => a + b.value, 0);
  return (
    <div style={{position: "relative"}}>
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            data={donutData} cx="50%" cy="50%"
            innerRadius={88} outerRadius={140}
            paddingAngle={1.5} dataKey="value"
            stroke="none"
            onClick={(d) => onSelect(d.name)}
            style={{cursor: "pointer"}}
          >
            {donutData.map((e) => (
              <Cell key={e.name} fill={e.color}
                opacity={selected && selected !== e.name ? 0.22 : 1} />
            ))}
          </Pie>
          <RTooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none"}}>
        <div className="mono" style={{fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-muted)", textTransform: "uppercase"}}>
          {selected ? selected : "Total"}
        </div>
        <div className="serif tabular" style={{fontSize: 38, lineHeight: 1, marginTop: 6}}>
          {(selected ? donutData.find(d => d.name === selected).value : total).toLocaleString()}
        </div>
        <div className="mono" style={{fontSize: 11, color: "var(--fg-faint)", marginTop: 6}}>
          companies
        </div>
      </div>
    </div>
  );
}

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="tooltip">
      <div className="tooltip-name">{d.name}</div>
      <div className="tooltip-row"><span>Companies</span><span className="v">{d.value.toLocaleString()}</span></div>
      <div className="tooltip-row"><span>Active</span><span className="v">{d.active_pct}%</span></div>
      <div className="tooltip-row"><span>Funded</span><span className="v">{d.funded_pct}%</span></div>
    </div>
  );
}

function RadialView({ donutData, selected, onSelect }) {
  const max = Math.max(...donutData.map(d => d.value));
  return (
    <div style={{padding: "8px 4px"}}>
      {donutData.map((d) => {
        const pct = (d.value / max) * 100;
        const isMuted = selected && selected !== d.name;
        return (
          <button key={d.name} onClick={() => onSelect(d.name)}
            style={{display: "grid", gridTemplateColumns: "180px 1fr 70px", gap: 12, alignItems: "center", padding: "9px 0",
                    width: "100%", textAlign: "left", color: "var(--fg)", borderBottom: "1px solid var(--border)",
                    opacity: isMuted ? 0.35 : 1, cursor: "pointer"}}>
            <span style={{fontSize: 13, color: "var(--fg-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
              <span style={{display: "inline-block", width: 8, height: 8, borderRadius: 2, background: d.color, marginRight: 8}}></span>
              {d.name}
            </span>
            <div style={{height: 8, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden"}}>
              <div style={{height: "100%", width: pct + "%", background: d.color, borderRadius: 999, transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)"}}></div>
            </div>
            <span className="mono tabular" style={{fontSize: 12, textAlign: "right"}}>{d.value.toLocaleString()}</span>
          </button>
        );
      })}
    </div>
  );
}

function TreemapView({ donutData, selected, onSelect }) {
  // Simple custom treemap (squarified-ish columns)
  const total = donutData.reduce((a, b) => a + b.value, 0);
  // 2-row treemap: top row holds top 4, bottom row remainder
  const sorted = [...donutData];
  const top = sorted.slice(0, 4);
  const bottom = sorted.slice(4);
  const topTotal = top.reduce((a, b) => a + b.value, 0);
  const bottomTotal = bottom.reduce((a, b) => a + b.value, 0);
  const topShare = topTotal / total;

  return (
    <div style={{height: 340, display: "flex", flexDirection: "column", gap: 4}}>
      <div style={{display: "flex", gap: 4, height: (topShare * 100) + "%"}}>
        {top.map(d => (
          <button key={d.name} onClick={() => onSelect(d.name)}
            style={{flex: d.value, background: d.color, opacity: selected && selected !== d.name ? 0.3 : 0.92, borderRadius: 6,
                    padding: 14, color: "#0a0d14", textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "space-between",
                    overflow: "hidden", cursor: "pointer", transition: "opacity 0.2s"}}>
            <div style={{fontSize: 12, fontWeight: 600, lineHeight: 1.15}}>{d.name}</div>
            <div className="serif tabular" style={{fontSize: 26, lineHeight: 1}}>{d.value.toLocaleString()}</div>
          </button>
        ))}
      </div>
      <div style={{display: "flex", gap: 4, flex: 1}}>
        {bottom.map(d => (
          <button key={d.name} onClick={() => onSelect(d.name)}
            style={{flex: d.value, background: d.color, opacity: selected && selected !== d.name ? 0.3 : 0.92, borderRadius: 6,
                    padding: 10, color: "#0a0d14", textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "space-between",
                    overflow: "hidden", cursor: "pointer", minWidth: 60, transition: "opacity 0.2s"}}>
            <div style={{fontSize: 11, fontWeight: 600, lineHeight: 1.15}}>{d.name}</div>
            <div className="mono tabular" style={{fontSize: 14}}>{d.value.toLocaleString()}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function IndustryLegend({ donutData, onSelect }) {
  return (
    <div>
      <div className="eyebrow no-bar" style={{marginBottom: 16, display: "block"}}>Top sectors at a glance</div>
      {donutData.slice(0, 6).map(d => (
        <button key={d.name} onClick={() => onSelect(d.name)} className="bar-row" style={{width: "100%", textAlign: "left", border: 0, borderBottom: "1px solid var(--border)", color: "var(--fg)"}}>
          <span className="name">
            <span style={{display: "inline-block", width: 8, height: 8, borderRadius: 2, background: d.color, marginRight: 8}}></span>
            {d.name}
          </span>
          <span style={{display: "flex", gap: 10, alignItems: "center"}}>
            <span style={{fontSize: 11, color: "var(--fg-muted)", fontFamily: "var(--font-mono)"}}>
              {d.funded_pct}% funded
            </span>
            <div style={{flex: 1, height: 6, background: "var(--surface-2)", borderRadius: 999, minWidth: 60}}>
              <div style={{height: "100%", width: d.active_pct + "%", background: d.color, borderRadius: 999, opacity: 0.7}}></div>
            </div>
          </span>
          <span className="num">{d.value.toLocaleString()}</span>
        </button>
      ))}
      <div style={{marginTop: 18, fontSize: 12, color: "var(--fg-muted)"}}>
        Bar shows <strong style={{color: "var(--fg)"}}>active rate</strong> · Click a row to filter the dashboard
      </div>
    </div>
  );
}

function SubSectorList({ industry, subSectors, color }) {
  const max = Math.max(...subSectors.map(s => s.count));
  return (
    <div>
      <div className="eyebrow no-bar" style={{marginBottom: 16, color}}>
        Sub-sectors / {industry}
      </div>
      {subSectors.map((s, i) => (
        <div key={s.name} className="bar-row">
          <span className="name">
            <span className="mono" style={{color: "var(--fg-faint)", marginRight: 8, fontSize: 11}}>{String(i+1).padStart(2, "0")}</span>
            {s.name}
          </span>
          <div className="bar-track">
            <div className="bar-fill" style={{width: (s.count/max*100) + "%", background: color}}></div>
          </div>
          <span className="num">{s.count.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { IndustrySection });
