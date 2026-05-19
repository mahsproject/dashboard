// Section 07 — The Investor Network
// Top 15 institutional investors by deal count, color-coded by type.

function InvestorsSection({ data }) {
  const list = data.top_investors || [];
  const max = Math.max(...list.map(i => i.deals), 1);

  // Type tallies
  const byType = list.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + i.deals;
    return acc;
  }, {});
  const tDeals = (k) => byType[k] || 0;

  const typeColor = {
    accelerator: "#14b8a6",
    govt_backed: "#f5b455",
    vc:          "#818cf8",
    angel_group: "#fb7e54",
    syndicate:   "#7dc4a3",
  };

  return (
    <section className="section" id="investors">
      <span className="section-num">07 / Investors</span>
      <div className="shell">
        <div className="section-head">
          <div>
            <span className="eyebrow">07 — Capital deployers</span>
            <h2 style={{marginTop: 14}}>Who actually writes the cheques.</h2>
          </div>
          <p className="lede">
            The top fifteen institutional investors in Hyderabad by disclosed deal count.
            Predominantly public-funded accelerators and incubators — the inverse of Bangalore's VC-led mix.
          </p>
        </div>

        <div className="card card-pad">
          <div className="card-head">
            <div>
              <div className="card-title">Top 15 by deal count</div>
              <div className="card-sub">Hyderabad-listed institutional investors · color-coded by type</div>
            </div>
            <div className="chip-row" style={{flexWrap: "wrap", maxWidth: 360}}>
              <TypeChip color={typeColor.accelerator} label={`Accelerator · ${tDeals("accelerator")}`} />
              <TypeChip color={typeColor.govt_backed} label={`Govt-backed · ${tDeals("govt_backed")}`} />
              <TypeChip color={typeColor.vc}          label={`VC · ${tDeals("vc")}`} />
              <TypeChip color={typeColor.angel_group} label={`Angel group · ${tDeals("angel_group")}`} />
              <TypeChip color={typeColor.syndicate}   label={`Syndicate · ${tDeals("syndicate")}`} />
            </div>
          </div>

          <div style={{marginTop: 8}}>
            {list.map((it, i) => {
              const pct = (it.deals / max) * 100;
              const color = typeColor[it.type] || "#888";
              return (
                <div key={it.name} className="inv-row">
                  <span className="inv-rank">{String(i + 1).padStart(2, "0")}</span>
                  <span className="inv-name">
                    <span className="name">{it.name}</span>
                    <span className={"inv-tag " + it.type}>{it.type.replace("_", " ")}</span>
                  </span>
                  <div className="inv-bar">
                    <div className="inv-bar-fill" style={{width: pct + "%", background: color}}></div>
                  </div>
                  <span className="inv-deals">{it.deals.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          <div style={{marginTop: 22, padding: 16, background: "var(--surface-2)", borderRadius: 8, fontSize: 13, color: "var(--fg-2)", lineHeight: 1.55, borderLeft: "2px solid var(--accent-line)"}}>
            Public-sector platforms (CIE IIITH, BIRAC, T-Hub, C-CAMP, AIC-CCMB, WE Hub) account for
            <strong style={{color: "var(--fg)"}}> {tDeals("accelerator") + tDeals("govt_backed")} of {list.reduce((s, i) => s + i.deals, 0)} top-15 deals</strong>.
            Private VCs and angel networks lead in cheque size but trail in volume — Hyderabad's funding stack is built around incubation and grants, not Series-A bets.
          </div>
        </div>
      </div>
    </section>
  );
}

function TypeChip({ color, label }) {
  return (
    <span className="chip" style={{display: "inline-flex", alignItems: "center", gap: 6, borderColor: "var(--border)"}}>
      <span style={{width: 7, height: 7, borderRadius: 2, background: color}}></span>
      {label}
    </span>
  );
}

Object.assign(window, { InvestorsSection });
