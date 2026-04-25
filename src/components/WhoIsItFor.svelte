<script>
  let activeIndex = $state(null);

  const sectors = [
    {
      num: "01",
      title: "Life & Health Reinsurers",
      short: "Anticipate pandemic loss spikes before they appear in claims.",
      detail:
        "COVID-19 generated over $72B in insured life and health losses globally. Those losses were priced after the fact. Telos-S gives you the structural risk profile of an emerging variant 3–6 weeks before hospitalization curves move — enough time to adjust underwriting conditions, reassess reserves, or trigger treaty clauses.",
      tag: "Reinsurance",
    },
    {
      num: "02",
      title: "Supply Chain Operators",
      short:
        "Identify viral risk in critical logistics nodes before disruption.",
      detail:
        "The 2021–2022 supply chain collapse cost the global economy an estimated $4T. Viral outbreaks at port cities and manufacturing hubs were a primary driver. Telos-S flags structural risk at origin before absenteeism and lockdowns cascade into your network.",
      tag: "Logistics",
    },
    {
      num: "03",
      title: "Airlines & Route Risk",
      short: "Monitor variant aggressiveness across high-connectivity routes.",
      detail:
        "Every major variant entered new continents through a small number of hub airports — Dubai, Frankfurt, Tocumen, Changi. Telos-S integrates with 200+ international airports and 400+ high-density urban points. You see the risk profile before the route becomes the vector.",
      tag: "Aviation",
    },
    {
      num: "04",
      title: "Laboratories & Pharma",
      short:
        "Structural mutation signals to orient antiviral and vaccine development.",
      detail:
        "Knowing which positions are most likely to mutate next — before those mutations circulate — compresses the development window. Telos Prophet predicts probable mutation pathways at key sites (RBM-452, RBM-484, RBM-501, Furin-681) with structural probability scores.",
      tag: "Biotech",
    },
    {
      num: "05",
      title: "Investment & Sovereign Risk Funds",
      short: "Epidemiological intelligence as input for systemic risk models.",
      detail:
        "Pandemic-sensitive sectors — aviation, hospitality, consumer discretionary, healthcare — move ahead of official WHO declarations. Telos-S provides a quantitative signal that feeds directly into portfolio risk models, giving fund managers a 3–6 week lead on sector reallocation decisions.",
      tag: "Finance",
    },
  ];
</script>

<section
  id="who_is_it_for"
  class="relative bg-[#f5f3ee] px-6 md:px-24 py-28 overflow-hidden"
>
  <!-- Grid texture -->
  <div
    class="absolute inset-0 pointer-events-none"
    style="background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 60px 60px;"
  ></div>

  <!-- Section header -->
  <div
    class="relative flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 mb-16 border-t-2 border-[#111] pt-8"
  >
    <span
      class="text-[0.65rem] font-bold tracking-[0.25em] text-[#888] uppercase whitespace-nowrap"
      style="font-family: 'Syne', sans-serif;"
    >
      WHO IS IT FOR
    </span>
    <h2
      class="text-[clamp(2.2rem,4vw,3.8rem)] font-extrabold leading-[1.05] tracking-tight text-[#0a0a0a]"
    >
      Every system that<br />breaks in a pandemic.
    </h2>
  </div>

  <!-- Sector rows -->
  <div class="relative flex flex-col">
    {#each sectors as sector, i}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="sector-row relative grid gap-4 md:gap-8 py-8 border-b border-[#d0cdc7] cursor-default transition-colors duration-200
               {i === 0 ? 'border-t border-[#d0cdc7]' : ''}
               {activeIndex === i
          ? 'bg-[#0a0a0a] px-6 -mx-6 md:px-8 md:-mx-8 border-transparent'
          : ''}"
        style="grid-template-columns: 3rem 1fr;"
        onmouseenter={() => (activeIndex = i)}
        onmouseleave={() => (activeIndex = null)}
      >
        <!-- Number -->
        <span
          class="text-[0.7rem] font-bold tracking-widest pt-1 transition-colors duration-200
                 {activeIndex === i ? 'text-[#555]' : 'text-[#bbb]'}"
          style="font-family: 'Syne', monospace;"
        >
          {sector.num}
        </span>

        <!-- Body -->
        <div class="flex flex-col gap-2">
          <!-- Title row -->
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <h3
              class="text-[clamp(1.1rem,2vw,1.5rem)] font-bold leading-tight tracking-tight transition-colors duration-200
                     {activeIndex === i ? 'text-[#f5f3ee]' : 'text-[#0a0a0a]'}"
              style="font-family: 'Syne', sans-serif;"
            >
              {sector.title}
            </h3>
            <span
              class="text-[0.6rem] font-bold tracking-[0.2em] uppercase px-2 py-1 rounded-sm border transition-all duration-200 shrink-0
                     {activeIndex === i
                ? 'text-[#555] border-[#333]'
                : 'text-[#aaa] border-[#d0cdc7]'}"
              style="font-family: 'Syne', monospace;"
            >
              {sector.tag}
            </span>
          </div>

          <!-- Short description -->
          <p
            class="text-[0.95rem] leading-relaxed max-w-[55ch] transition-colors duration-200
                   {activeIndex === i ? 'text-[#999]' : 'text-[#555]'}"
          >
            {sector.short}
          </p>

          <!-- Expandable detail -->
          <div class="detail-panel {activeIndex === i ? 'detail-open' : ''}">
            <p
              class="text-[0.9rem] leading-[1.75] text-[#777] max-w-[62ch] pt-3 mt-2 border-t border-[#222]"
            >
              {sector.detail}
            </p>
          </div>
        </div>

        <!-- Decorative right line -->
        <div
          class="side-line absolute right-0 top-0 w-[3px] bg-red-500 {activeIndex ===
          i
            ? 'side-line-active'
            : ''}"
        ></div>
      </div>
    {/each}
  </div>
</section>

<style>
  /* Only what Tailwind can't do: max-height animation and the growing line */
  .detail-panel {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition:
      max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.3s ease 0.05s;
  }

  .detail-open {
    max-height: 200px;
    opacity: 1;
  }

  .side-line {
    height: 0;
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .side-line-active {
    height: 100%;
  }
</style>
