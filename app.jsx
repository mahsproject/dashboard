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
            <SizeRevenueSection data={data} />
            <FundingSection data={data} funnelStyle={tweaks.funnelStyle} />
            <ThemeSection data={data} filters={filters} setFilters={setFilters} />
            <RequestSection filters={filters} setFilters={setFilters} />
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
