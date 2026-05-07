// Growth (timeline area) + Size distribution + Revenue distribution
const { AreaChart, Area, BarChart: RBarChart, Bar: RBar, XAxis: RXAxis, YAxis: RYAxis, CartesianGrid: RGrid, Tooltip: RT, ResponsiveContainer: RC } = window.Recharts;

function GrowthSection({ data, filters }) {
  const years = Object.entries(data.by_year)
    .map(([y, v]) => ({ year: +y, total: v.total, funded: v.funded, active: v.active, cum: v.cumulative_funded }))
    .sort((a,b) => a.year - b.year);

  const peakYear = years.reduce((a, b) => b.total > a.total ? b : a);
  const totalAcrossYears = years.reduce((s, y) => s + y.total, 0);

  return (
    <section className="section" id="growth">
      <span className="section-num">03 / Growth</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">03 — Founding cohort</span>
            <h2 style={{marginTop: 14}}>A two-decade arc, peaking in 2021.</h2>
          </div>
          <p className="lede">
            Hyderabad's founding cadence climbed for sixteen straight years before the post-pandemic correction.
            2024–2026 numbers are tracked through Jan 27.
          </p>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <div>
              <div className="card-title">Companies founded by year</div>
              <div className="card-sub">Stack: total founded vs. funded · Peak year: <strong style={{color: "var(--fg)"}}>{peakYear.year}</strong> ({peakYear.total.toLocaleString()})</div>
            </div>
            <div className="chip-row">
              <span className="chip" style={{background: "var(--accent-soft)", color: "var(--accent)", borderColor: "var(--accent-line)"}}>● Total</span>
              <span className="chip">● Funded</span>
            </div>
          </div>

          <div style={{height: 320}}>
            <RC width="100%" height="100%">
              <AreaChart data={years} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gFunded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--fg)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="var(--fg)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <RGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <RXAxis dataKey="year" tick={{fontSize: 10, fill: "var(--fg-muted)"}} axisLine={false} tickLine={false} />
                <RYAxis tick={{fontSize: 10, fill: "var(--fg-muted)"}} axisLine={false} tickLine={false} />
                <RT content={<YearTip />} />
                <Area type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={2} fill="url(#gTotal)" />
                <Area type="monotone" dataKey="funded" stroke="var(--fg-2)" strokeWidth={1.5} fill="url(#gFunded)" />
              </AreaChart>
            </RC>
          </div>

          <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 24}}>
            {[
              {l: "Founded in last 5y", v: years.filter(y => y.year >= 2021).reduce((s,y) => s+y.total, 0).toLocaleString()},
              {l: "Cumulative funded", v: peakYear.cum.toLocaleString() },
              {l: "Median age", v: "6 yr" },
              {l: "2026 YTD", v: years.find(y => y.year === 2026)?.total?.toLocaleString() || "—" },
            ].map((s, i) => (
              <div key={i} style={{padding: "0 16px", borderRight: i < 3 ? "1px solid var(--border)" : "0"}}>
                <div className="mono" style={{fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 8}}>{s.l}</div>
                <div className="serif tabular" style={{fontSize: 26, lineHeight: 1}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function YearTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const total = payload.find(p => p.dataKey === "total")?.value || 0;
  const funded = payload.find(p => p.dataKey === "funded")?.value || 0;
  return (
    <div className="tooltip">
      <div className="tooltip-name">{label}</div>
      <div className="tooltip-row"><span>Founded</span><span className="v">{total.toLocaleString()}</span></div>
      <div className="tooltip-row"><span>Funded</span><span className="v">{funded.toLocaleString()}</span></div>
      <div className="tooltip-row"><span>Funded rate</span><span className="v">{((funded/total)*100).toFixed(0)}%</span></div>
    </div>
  );
}

function SizeRevenueSection({ data, filters }) {
  const sizes = [
    { key: "micro",  label: "Micro",  range: "1–10 employees" },
    { key: "small",  label: "Small",  range: "11–50" },
    { key: "medium", label: "Medium", range: "51–500" },
    { key: "large",  label: "Large",  range: "500+" },
  ];
  const sizeTotal = sizes.reduce((s, x) => s + data.by_size[x.key].total, 0);

  const revenueBuckets = Object.entries(data.by_revenue);
  const revTotal = revenueBuckets.reduce((s, [, v]) => s + v, 0);

  return (
    <section className="section" id="size">
      <span className="section-num">04 / Scale</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">04 — Scale & revenue</span>
            <h2 style={{marginTop: 14}}>Mostly micro, increasingly mighty.</h2>
          </div>
          <p className="lede">
            Three out of five companies still operate under ten employees, but the medium and large tiers
            account for ~73% of all funded entities.
          </p>
        </div>

        <div className="chart-grid">
          <div className="card card-pad">
            <div className="card-head">
              <div>
                <div className="card-title">By company size</div>
                <div className="card-sub">Headcount tiers · funded share within each</div>
              </div>
            </div>
            {sizes.map(s => {
              const v = data.by_size[s.key];
              const fundedPct = (v.funded / v.total) * 100;
              return (
                <div key={s.key} style={{padding: "16px 0", borderBottom: "1px solid var(--border)"}}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10}}>
                    <div>
                      <div style={{fontSize: 14, fontWeight: 500}}>{s.label}</div>
                      <div className="mono" style={{fontSize: 11, color: "var(--fg-muted)", marginTop: 2}}>{s.range}</div>
                    </div>
                    <div style={{textAlign: "right"}}>
                      <div className="serif tabular" style={{fontSize: 22, lineHeight: 1}}>{v.total.toLocaleString()}</div>
                      <div className="mono" style={{fontSize: 11, color: "var(--fg-muted)", marginTop: 4}}>
                        {((v.total/sizeTotal)*100).toFixed(1)}% · {fundedPct.toFixed(0)}% funded
                      </div>
                    </div>
                  </div>
                  <div style={{height: 6, background: "var(--surface-2)", borderRadius: 999, position: "relative", overflow: "hidden"}}>
                    <div style={{height: "100%", width: ((v.total/sizeTotal)*100) + "%", background: "var(--fg-2)", borderRadius: 999}}></div>
                    <div style={{position: "absolute", top: 0, left: 0, height: "100%", width: ((v.funded/sizeTotal)*100) + "%", background: "var(--accent)", borderRadius: 999}}></div>
                  </div>
                </div>
              );
            })}
            <div style={{marginTop: 14, display: "flex", gap: 16, fontSize: 11, color: "var(--fg-muted)"}}>
              <span><span style={{display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--accent)", marginRight: 6}}></span>Funded</span>
              <span><span style={{display: "inline-block", width: 8, height: 8, borderRadius: 2, background: "var(--fg-2)", marginRight: 6}}></span>Total</span>
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-head">
              <div>
                <div className="card-title">Annual revenue distribution</div>
                <div className="card-sub">Reported revenue brackets · {revTotal.toLocaleString()} disclosed</div>
              </div>
            </div>
            {revenueBuckets.map(([bucket, count], i) => {
              const max = Math.max(...revenueBuckets.map(([, v]) => v));
              return (
                <div key={bucket} className="bar-row">
                  <span className="name">
                    <span className="mono" style={{color: "var(--fg-faint)", marginRight: 10, fontSize: 11}}>{String(i+1).padStart(2, "0")}</span>
                    {bucket}
                  </span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{width: (count/max*100) + "%", background: i >= 3 ? "var(--accent)" : "var(--fg-2)", opacity: i >= 3 ? 1 : 0.6}}></div>
                  </div>
                  <span className="num">{count.toLocaleString()}</span>
                </div>
              );
            })}
            <div style={{marginTop: 14, fontSize: 12, color: "var(--fg-muted)"}}>
              <strong style={{color: "var(--fg)"}}>{((revenueBuckets.slice(3).reduce((s,[,v])=>s+v,0)/revTotal)*100).toFixed(1)}%</strong> of disclosed companies report &gt; $10M ARR.
            </div>
          </div>
        </div>

        <div className="card card-pad" style={{marginTop: 24}}>
          <div className="card-head">
            <div>
              <div className="card-title">Size mix by industry</div>
              <div className="card-sub">% of each industry's companies in each size tier</div>
            </div>
          </div>
          <SizeHeatmap data={data} filters={filters} />
        </div>
      </div>
    </section>
  );
}

function SizeHeatmap({ data, filters }) {
  const industries = Object.keys(data.size_by_industry).filter(k => k !== "Other");
  const sizes = ["micro", "small", "medium", "large"];
  const sizeLabels = { micro: "Micro", small: "Small", medium: "Medium", large: "Large" };

  // pre-compute industry totals
  const rowTotals = {};
  industries.forEach(i => {
    rowTotals[i] = sizes.reduce((s, k) => s + data.size_by_industry[i][k], 0);
  });
  // find max pct across all cells for color scale
  let maxPct = 0;
  industries.forEach(i => {
    sizes.forEach(s => {
      const p = data.size_by_industry[i][s] / rowTotals[i];
      if (p > maxPct) maxPct = p;
    });
  });

  return (
    <div style={{overflowX: "auto"}}>
      <table className="heat-table">
        <thead>
          <tr>
            <th style={{width: "30%"}}>Industry</th>
            {sizes.map(s => <th key={s}>{sizeLabels[s]}</th>)}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {industries.map(i => (
            <tr key={i}>
              <td>{i}</td>
              {sizes.map(s => {
                const v = data.size_by_industry[i][s];
                const pct = v / rowTotals[i];
                const intensity = pct / maxPct; // 0..1
                const accent = `rgba(20,184,166, ${0.05 + intensity * 0.45})`;
                return (
                  <td key={s}>
                    <span className="heat-cell" style={{background: accent, color: intensity > 0.5 ? "var(--fg)" : "var(--fg-2)"}}>
                      {v.toLocaleString()}
                      <span style={{display: "block", fontSize: 9, color: "var(--fg-muted)", marginTop: 2}}>{(pct*100).toFixed(0)}%</span>
                    </span>
                  </td>
                );
              })}
              <td style={{color: "var(--fg)"}}>{rowTotals[i].toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { GrowthSection, SizeRevenueSection });
