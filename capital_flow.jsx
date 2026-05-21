// Section 06 — Capital Flow Over Time
// Bars: funding-round count by year (2015–2025) · Line: median round size (secondary axis)
const { ComposedChart, Bar: CBar, Line: CLine, XAxis: CXAxis, YAxis: CYAxis, CartesianGrid: CGrid, Tooltip: CT, ResponsiveContainer: CRC, ReferenceDot } = window.Recharts;

function CapitalFlowSection({ data }) {
  const years = Object.entries(data.funding_events_by_year || {})
    .map(([y, v]) => ({ year: y, rounds: v.rounds, median_round: v.median_round, total_usd: v.total_usd }))
    .sort((a, b) => +a.year - +b.year);

  const peak = years.reduce((a, b) => b.rounds > a.rounds ? b : a, years[0] || { year: "2022", rounds: 0 });
  const lastFull = years.length > 1 ? years[years.length - 2] : null;
  const peakMed = years.find(y => y.year === "2021")?.median_round || 0;
  const recentMed = lastFull?.median_round || 0;
  const compressionPct = peakMed ? Math.round((1 - recentMed / peakMed) * 100) : 0;

  return (
    <section className="section" id="capital-flow">
      <span className="section-num">06 / Capital flow</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">06 — Capital flow</span>
          </div>
          <p className="lede">
            Funding-round volume peaked in {peak.year} at {peak.rounds} rounds and held above {lastFull?.rounds || 79} into {lastFull?.year || 2024}.
            Median round size compressed ~{compressionPct}% from 2021 to {lastFull?.year || 2024} — capital is more selective.
          </p>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <div>
              <div className="card-title">Capital flow, 2015–2025</div>
              <div className="card-sub">Bars · funding rounds per year · Line · median round size (right axis)</div>
            </div>
            <div className="chip-row">
              <span className="chip" style={{background: "var(--accent-soft)", color: "var(--accent)", borderColor: "var(--accent-line)"}}>● Rounds</span>
              <span className="chip" style={{color: "var(--fg-2)"}}>● Median round</span>
            </div>
          </div>

          <div style={{height: 360}}>
            <CRC width="100%" height="100%">
              <ComposedChart data={years} margin={{ top: 20, right: 24, left: -8, bottom: 0 }}>
                <CGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <CXAxis dataKey="year" tick={{fontSize: 10, fill: "var(--fg-muted)"}} axisLine={false} tickLine={false} />
                <CYAxis yAxisId="left" tick={{fontSize: 10, fill: "var(--fg-muted)"}} axisLine={false} tickLine={false} />
                <CYAxis yAxisId="right" orientation="right"
                  tick={{fontSize: 10, fill: "var(--fg-muted)"}}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => "$" + (v / 1e6).toFixed(1) + "M"} />
                <CT content={<FlowTooltip />} />
                <CBar yAxisId="left" dataKey="rounds" fill="var(--accent)" opacity={0.85} radius={[3, 3, 0, 0]} />
                <CLine yAxisId="right" type="monotone" dataKey="median_round"
                  stroke="var(--fg)" strokeWidth={2} dot={{ r: 3, fill: "var(--fg)" }} activeDot={{ r: 5 }} />
                <ReferenceDot yAxisId="left" x={peak.year} y={peak.rounds} r={5}
                  fill="var(--accent)" stroke="var(--bg)" strokeWidth={2} />
              </ComposedChart>
            </CRC>
          </div>

          <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginTop: 24, paddingTop: 22, borderTop: "1px solid var(--border)"}}>
            <Stat label="Peak year"        value={peak.year} sub={`${peak.rounds} rounds`} />
            <Stat label="2021 median"      value={"$" + (peakMed / 1e6).toFixed(1) + "M"} sub="ZIRP peak" />
            <Stat label={(lastFull?.year || 2024) + " median"} value={"$" + (recentMed / 1e6).toFixed(1) + "M"} sub={`↓ ${compressionPct}% from peak`} />
            <Stat label="Total rounds (decade)" value={years.reduce((s, y) => s + y.rounds, 0).toLocaleString()} sub="2015–2025" last />
          </div>
        </div>
      </div>
    </section>
  );
}

function FlowTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const rounds = payload.find(p => p.dataKey === "rounds")?.value || 0;
  const med = payload.find(p => p.dataKey === "median_round")?.value || 0;
  return (
    <div className="tooltip">
      <div className="tooltip-name">{label}</div>
      <div className="tooltip-row"><span>Rounds</span><span className="v">{rounds.toLocaleString()}</span></div>
      <div className="tooltip-row"><span>Median round</span><span className="v">${(med / 1e6).toFixed(2)}M</span></div>
    </div>
  );
}

function Stat({ label, value, sub, last }) {
  return (
    <div style={{padding: "0 18px", borderRight: last ? "0" : "1px solid var(--border)"}}>
      <div className="mono" style={{fontSize: 10, letterSpacing: "0.14em", color: "var(--fg-muted)", textTransform: "uppercase", marginBottom: 8}}>{label}</div>
      <div className="serif tabular" style={{fontSize: 26, lineHeight: 1}}>{value}</div>
      {sub && <div className="mono" style={{fontSize: 11, color: "var(--fg-faint)", marginTop: 6, letterSpacing: "0.02em"}}>{sub}</div>}
    </div>
  );
}

Object.assign(window, { CapitalFlowSection, Stat });
