// Main App — wires sections, state, tweaks panel

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "teal",
  "industryChartStyle": "donut",
  "heroMode": "particles",
  "funnelStyle": "stepped",
  "typeScale": "standard",
  "density": "comfortable"
}/*EDITMODE-END*/;

function App() {
  const data = window.SCALEME_DATA;
  const [themeMode, setThemeMode] = useThemeMode();
  const [filters, setFilters] = useState({ industry: null, size: null, stage: null, theme: null });

  // Tweaks
  const [tweaks, setTweak] = window.useTweaks ? window.useTweaks(TWEAK_DEFAULTS) : [TWEAK_DEFAULTS, () => {}];

  // Apply accent / density / typescale to root
  useEffect(() => { applyAccent(tweaks.accent); }, [tweaks.accent]);
  useEffect(() => { document.documentElement.dataset.density = tweaks.density; }, [tweaks.density]);
  useEffect(() => { document.documentElement.dataset.typescale = tweaks.typeScale; }, [tweaks.typeScale]);

  // Compute totalFiltered
  const totalFiltered = useMemo(() => {
    let n = data.kpis.total_companies;
    if (filters.industry) n = data.by_industry[filters.industry]?.total || n;
    if (filters.size) n = data.by_size[filters.size]?.total || n;
    if (filters.stage) n = data.by_stage[filters.stage] || n;
    if (filters.theme) n = data.by_themes[filters.theme] || n;
    return n;
  }, [filters, data]);

  // KPIs scoped to industry filter
  const scopedKpis = useMemo(() => {
    if (!filters.industry) return data.kpis;
    const ind = data.by_industry[filters.industry];
    if (!ind) return data.kpis;
    return {
      ...data.kpis,
      total_companies: ind.total,
      active_companies: ind.active,
      funded_companies: ind.funded,
    };
  }, [filters.industry, data]);

  return (
    <>
      <Topbar themeMode={themeMode} setThemeMode={setThemeMode} />
      <Hero
        kpis={scopedKpis}
        heroMode={tweaks.heroMode}
        industryFilter={filters.industry}
        sizeFilter={filters.size}
        stageFilter={filters.stage}
        themeFilter={filters.theme}
        totalFiltered={totalFiltered}
      />

      <div className="shell">
        <div className="main-layout">
          <Sidebar data={data} filters={filters} setFilters={setFilters} totalFiltered={totalFiltered} />
          <main style={{minWidth: 0}}>
            <IndustrySection data={data} filters={filters} setFilters={setFilters} chartStyle={tweaks.industryChartStyle} />
            <GrowthSection data={data} filters={filters} />
            <SizeRevenueSection data={data} filters={filters} />
            <FundingSection data={data} funnelStyle={tweaks.funnelStyle} />
            <ThemeSection data={data} filters={filters} setFilters={setFilters} />
            <CitySection data={data} />
            <RequestSection filters={filters} setFilters={setFilters} />
          </main>
        </div>
      </div>

      <Footer />

      {/* Tweaks panel */}
      <ScaleMeTweaks tweaks={tweaks} setTweak={setTweak} />
    </>
  );
}

function ScaleMeTweaks({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakColor } = window;

  // Map between accent name and hex (TweakColor takes hex options)
  const accentHex = { teal: "#14b8a6", coral: "#fb7e54", indigo: "#818cf8", amber: "#f5b455" };
  const hexAccent = Object.fromEntries(Object.entries(accentHex).map(([k, v]) => [v, k]));

  return (
    <TweaksPanel>
      <TweakSection label="Hero">
        <TweakRadio label="Background" value={tweaks.heroMode}
          options={[{value: "particles", label: "Network"}, {value: "scan", label: "Scan"}, {value: "off", label: "Off"}]}
          onChange={v => setTweak("heroMode", v)} />
      </TweakSection>
      <TweakSection label="Accent">
        <TweakColor label="Color" value={accentHex[tweaks.accent] || "#14b8a6"}
          options={["#14b8a6", "#fb7e54", "#818cf8", "#f5b455"]}
          onChange={hex => setTweak("accent", hexAccent[hex] || "teal")} />
      </TweakSection>
      <TweakSection label="Charts">
        <TweakSelect label="Industry" value={tweaks.industryChartStyle}
          options={[{value: "donut", label: "Donut"}, {value: "radial", label: "Bars"}, {value: "treemap", label: "Treemap"}]}
          onChange={v => setTweak("industryChartStyle", v)} />
        <TweakSelect label="Funnel" value={tweaks.funnelStyle}
          options={[{value: "stepped", label: "Stepped"}, {value: "flowing", label: "Flowing"}, {value: "sankey", label: "Sankey"}]}
          onChange={v => setTweak("funnelStyle", v)} />
      </TweakSection>
      <TweakSection label="Type & density">
        <TweakRadio label="Type" value={tweaks.typeScale}
          options={[{value: "standard", label: "Standard"}, {value: "editorial", label: "Editorial"}]}
          onChange={v => setTweak("typeScale", v)} />
        <TweakRadio label="Density" value={tweaks.density}
          options={[{value: "comfortable", label: "Comfy"}, {value: "compact", label: "Compact"}]}
          onChange={v => setTweak("density", v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
