// Growth (timeline area) + Size distribution
const { AreaChart, Area, BarChart: RBarChart, Bar: RBar, XAxis: RXAxis, YAxis: RYAxis, CartesianGrid: RGrid, Tooltip: RT, ResponsiveContainer: RC, ReferenceLine } = window.Recharts;

function GrowthSection({ data, yearRange, fullYearRange }) {
  const allYears = Object.entries(data.by_year)
    .map(([y, v]) => ({ year: +y, total: v.total, funded: v.funded, active: v.active, cum: v.cumulative_funded }))
    .sort((a,b) => a.year - b.year);

  const years = allYears.filter(y => y.year >= yearRange.start && y.year <= yearRange.end);
  const peakYear = years.length ? years.reduce((a, b) => b.total > a.total ? b : a) : { year: "—", total: 0 };
  const totalAcrossYears = years.reduce((s, y) => s + y.total, 0);
  const fundedInPeriod = years.reduce((s, y) => s + y.funded, 0);
  const activeInPeriod = years.reduce((s, y) => s + y.active, 0);
  const survivalPct = totalAcrossYears ? Math.round((activeInPeriod / totalAcrossYears) * 100) : 0;

  const isFullRange = yearRange.start === fullYearRange.start && yearRange.end === fullYearRange.end;

  return (
    <section className="section" id="growth">
      <span className="section-num">03 / Growth</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">03 — Founding cohorts</span>
            <h2 style={{marginTop: 14}}>A decade of founding data.</h2>
          </div>
          <p className="lede">
            2020 was peak formation. 2022 reflects the funding-market correction;
            2023–25 show a real-volume decline compounded by classification lag.
          </p>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <div>
              <div className="card-title">Companies founded by year</div>
              <div className="card-sub">
                Founded vs. funded · Peak year: <strong style={{color: "var(--fg)"}}>{peakYear.year}</strong> ({peakYear.total.toLocaleString()})
              </div>
            </div>
            <div className="chip-row">
              <span className="chip" style={{background: "var(--accent-soft)", color: "var(--accent)", borderColor: "var(--accent-line)"}}>● Total</span>
              <span className="chip">● Funded</span>
            </div>
          </div>

          <div style={{height: 320}}>
            <RC width="100%" height="100%">
              <AreaChart data={allYears} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
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
                {!isFullRange && (
                  <>
                    <ReferenceLine x={yearRange.start} stroke="var(--accent)" strokeDasharray="3 3" strokeWidth={1} />
                    <ReferenceLine x={yearRange.end}   stroke="var(--accent)" strokeDasharray="3 3" strokeWidth={1} />
                  </>
                )}
                <Area type="monotone" dataKey="total" stroke="var(--accent)" strokeWidth={2} fill="url(#gTotal)" />
                <Area type="monotone" dataKey="funded" stroke="var(--fg-2)" strokeWidth={1.5} fill="url(#gFunded)" />
              </AreaChart>
            </RC>
          </div>

          <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 28, borderTop: "1px solid var(--border)", paddingTop: 24}}>
            {[
              {l: `Founded (${yearRange.start}–${String(yearRange.end).slice(-2)})`, v: totalAcrossYears.toLocaleString()},
              {l: "Funded in period",  v: fundedInPeriod.toLocaleString()},
              {l: "Active today",       v: survivalPct + "%" },
              {l: "Peak year",           v: String(peakYear.year) },
            ].map((s, i) => (
              <div key={i} style={{padding: "0 16px", borderRight: i < 3 ? "1px solid var(--border)" : "0"}}>
                <div className="mono" style={{fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 8}}>{s.l}</div>
                <div className="serif tabular" style={{fontSize: 26, lineHeight: 1}}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{marginTop: 16, fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em"}}>
            * 2024–25 cohorts under-counted — classification of newly-incorporated companies lags by 6–12 months.
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

function SizeRevenueSection({ data }) {
  const sizes = [
    { key: "small",  label: "Small",  range: "11–50 employees" },
    { key: "medium", label: "Medium", range: "51–500 employees" },
    { key: "large",  label: "Large",  range: "500+ employees" },
  ];
  const sizeTotal = sizes.reduce((s, x) => s + (data.by_size[x.key]?.total || 0), 0);

  return (
    <section className="section" id="size">
      <span className="section-num">04 / Scale</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">04 — Company scale</span>
            <h2 style={{marginTop: 14}}>Funding rates climb sharply with scale.</h2>
          </div>
          <p className="lede">
            Among companies with reported headcount above 10, small companies dominate volume
            but large companies fund at far higher rates. The ratio is the story.
          </p>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <div>
              <div className="card-title">By company size</div>
              <div className="card-sub">Headcount tiers (11+) · funded share within each</div>
            </div>
          </div>
          {sizes.map(s => {
            const v = data.by_size[s.key];
            if (!v) return null;
            const fundedPct = v.total ? (v.funded / v.total) * 100 : 0;
            return (
              <div key={s.key} style={{padding: "16px 0", borderBottom: "1px solid var(--border)"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10}}>
                  <div>
                    <div style={{fontSize: 14, fontWeight: 500}}>{s.label}</div>
                    <div className="mono" style={{fontSize: 11, color: "var(--fg-muted)", marginTop: 2}}>
                      {s.range}
                    </div>
                  </div>
                  <div style={{textAlign: "right"}}>
                    <div className="serif tabular" style={{fontSize: 22, lineHeight: 1}}>{v.total.toLocaleString()}</div>
                    <div className="mono" style={{fontSize: 11, color: "var(--fg-muted)", marginTop: 4}}>
                      {((v.total/sizeTotal)*100).toFixed(1)}% · {fundedPct.toFixed(1)}% funded
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
      </div>
    </section>
  );
}

Object.assign(window, { GrowthSection, SizeRevenueSection });
