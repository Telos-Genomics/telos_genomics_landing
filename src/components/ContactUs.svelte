<script lang="ts">
  // Campos adaptados al contexto B2B de Telos Genomics
  let nombre = $state("");
  let empresa = $state("");
  let email = $state("");
  let sector = $state("");
  let mensaje = $state("");

  let statusMessage = $state("");
  let isLoading = $state(false);
  let isSuccess = $state<boolean | null>(null);

  const SECTORES = [
    "Reinsurance / Insurance",
    "Supply Chain / Logistics",
    "Airlines / Aviation",
    "Laboratories / Pharma",
    "Investment / Sovereign Risk",
    "Other",
  ];

  async function handleSubmit() {
    isLoading = true;
    statusMessage = "";
    isSuccess = null;

    if (!nombre || !email || !sector || !mensaje) {
      statusMessage = "Please fill in all required fields.";
      isSuccess = false;
      isLoading = false;
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      statusMessage = "Please enter a valid email address.";
      isSuccess = false;
      isLoading = false;
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido: empresa, // reutiliza el campo apellido del API como empresa
          email,
          subject: `[Telos-S] ${sector} · ${nombre}`,
          message: `Sector: ${sector}\nCompany: ${empresa}\n\n${mensaje}`,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        statusMessage = "Message sent. We'll be in touch shortly.";
        isSuccess = true;
        nombre = empresa = email = sector = mensaje = "";
      } else {
        statusMessage =
          result.error || "Something went wrong. Please try again.";
        isSuccess = false;
      }
    } catch {
      statusMessage = "Connection error. Please try again later.";
      isSuccess = false;
    } finally {
      isLoading = false;
    }
  }
</script>

<section
  id="contact_us"
  class="relative bg-[#0a0a0a] px-6 md:px-20 py-24 overflow-hidden"
>
  <!-- Textura de fondo sutil -->
  <div
    class="absolute inset-0 pointer-events-none opacity-[0.025]"
    style="background-image:linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px);background-size:60px 60px;"
  ></div>

  <div class="relative max-w-7xl mx-auto">
    <!-- Header -->
    <div
      class="border-t border-[#2a2a2a] pt-8 mb-16 flex flex-col md:flex-row md:items-end gap-6 md:gap-16"
    >
      <div class="flex flex-col gap-3">
        <span
          class="text-[0.65rem] font-bold tracking-[0.25em] text-[#555] uppercase"
          style="font-family:'Syne',sans-serif;">CONTACT US</span
        >
        <h2
          class="text-[clamp(2rem,5vw,4rem)] font-extrabold leading-tight tracking-tight text-[#f5f3ee]"
        >
          Get early access.<br />Start a conversation.
        </h2>
      </div>
      <p class="text-sm text-[#555] max-w-sm leading-relaxed md:mb-2">
        We're currently onboarding select partners for pilot programs. Tell us
        about your organization and we'll follow up within 48 hours.
      </p>
    </div>

    <!-- Grid: formulario + info lateral -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
      <!-- Formulario — 2/3 -->
      <form
        onsubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        class="md:col-span-2 flex flex-col gap-5"
      >
        <!-- Fila: nombre + empresa -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label
              class="text-[0.6rem] font-mono tracking-widest uppercase text-[#555]"
            >
              Full name <span class="text-[#ef5b5b]">*</span>
            </label>
            <input
              type="text"
              bind:value={nombre}
              placeholder="Richard Armuelles"
              required
              class="bg-transparent border border-[#2a2a2a] px-4 py-3 text-sm text-[#f5f3ee] placeholder-[#444]
                     focus:outline-none focus:border-[#ef5b5b] transition-colors duration-200 rounded-none font-mono"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label
              class="text-[0.6rem] font-mono tracking-widest uppercase text-[#555]"
            >
              Company
            </label>
            <input
              type="text"
              bind:value={empresa}
              placeholder="Telos Genomics"
              class="bg-transparent border border-[#2a2a2a] px-4 py-3 text-sm text-[#f5f3ee] placeholder-[#444]
                     focus:outline-none focus:border-[#ef5b5b] transition-colors duration-200 rounded-none font-mono"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-[0.6rem] font-mono tracking-widest uppercase text-[#555]"
          >
            Corporate email <span class="text-[#ef5b5b]">*</span>
          </label>
          <input
            type="email"
            bind:value={email}
            placeholder="you@company.com"
            required
            class="bg-transparent border border-[#2a2a2a] px-4 py-3 text-sm text-[#f5f3ee] placeholder-[#444]
                   focus:outline-none focus:border-[#ef5b5b] transition-colors duration-200 rounded-none font-mono"
          />
        </div>

        <!-- Sector dropdown -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-[0.6rem] font-mono tracking-widest uppercase text-[#555]"
          >
            Sector <span class="text-[#ef5b5b]">*</span>
          </label>
          <div class="relative">
            <select
              bind:value={sector}
              required
              class="w-full appearance-none bg-transparent border border-[#2a2a2a] px-4 py-3 text-sm
                     text-[#f5f3ee] focus:outline-none focus:border-[#ef5b5b] transition-colors duration-200
                     rounded-none font-mono cursor-pointer"
              style="background-color:#0a0a0a;"
            >
              <option
                value=""
                disabled
                selected
                style="background:#111; color:#555;">Select your sector</option
              >
              {#each SECTORES as s}
                <option value={s} style="background:#111; color:#f5f3ee;"
                  >{s}</option
                >
              {/each}
            </select>
            <!-- Flecha custom -->
            <div
              class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path
                  d="M1 1L5 5L9 1"
                  stroke="#555"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Mensaje -->
        <div class="flex flex-col gap-1.5">
          <label
            class="text-[0.6rem] font-mono tracking-widest uppercase text-[#555]"
          >
            Message <span class="text-[#ef5b5b]">*</span>
          </label>
          <textarea
            bind:value={mensaje}
            placeholder="Tell us about your organization and what you're trying to solve..."
            rows="5"
            required
            class="bg-transparent border border-[#2a2a2a] px-4 py-3 text-sm text-[#f5f3ee] placeholder-[#444]
                   focus:outline-none focus:border-[#ef5b5b] transition-colors duration-200 rounded-none
                   font-mono resize-none"
          ></textarea>
        </div>

        <!-- Submit + status -->
        <div class="flex flex-col gap-3 mt-2">
          <button
            type="submit"
            disabled={isLoading}
            class="flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-widest
                   transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style="
              font-family:'Syne',sans-serif;
              background:{isLoading ? '#555' : '#ef5b5b'};
              color:white;
            "
          >
            {#if isLoading}
              <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  stroke-width="2"
                  opacity="0.25"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              Sending...
            {:else}
              Send message
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            {/if}
          </button>

          {#if statusMessage}
            <p
              class="text-[0.75rem] font-mono px-1"
              style="color:{isSuccess ? '#10b981' : '#ef5b5b'}"
            >
              {isSuccess ? "✓" : "✗"}
              {statusMessage}
            </p>
          {/if}
        </div>
      </form>

      <!-- Info lateral — 1/3 -->
      <div class="flex flex-col gap-8 md:border-l md:border-[#1a1a1a] md:pl-10">
        <div class="flex flex-col gap-2">
          <span
            class="text-[0.6rem] font-mono tracking-widest uppercase text-[#555]"
            >Direct contact</span
          >
          <a
            href="mailto:richard@telosgenomics.bio"
            class="text-sm font-mono text-[#f5f3ee] hover:text-[#ef5b5b] transition-colors duration-200"
          >
            richard@telosgenomics.bio
          </a>
        </div>

        <div class="flex flex-col gap-2">
          <span
            class="text-[0.6rem] font-mono tracking-widest uppercase text-[#555]"
            >Based in</span
          >
          <span class="text-sm font-mono text-[#555]">Panama City, Panama</span>
          <span class="text-[0.65rem] font-mono text-[#555]"
            >Hub Tocumen · UTC-5</span
          >
        </div>

        <div class="flex flex-col gap-3 mt-auto pt-8 border-t border-[#1a1a1a]">
          <span
            class="text-[0.6rem] font-mono tracking-widest uppercase text-[#555]"
            >Current status</span
          >
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"
            ></span>
            <span class="text-[0.7rem] font-mono text-[#10b981]"
              >Accepting pilot partners</span
            >
          </div>
          <p class="text-[0.65rem] font-mono text-[#555] leading-relaxed">
            Pre-seed stage. Selective onboarding for reinsurance, supply chain,
            and aviation sectors.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
