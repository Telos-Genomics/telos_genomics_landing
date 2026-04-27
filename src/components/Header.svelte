<script>
  import { onMount } from "svelte";
  import { Menu } from "@lucide/svelte";
  import Logo from "../images/logo.svg";
  import LogoWhite from "../images/logo_white.svg";

  let menuOpen = $state(false);
  let currentPath = $state("/");
  let darkBackground = $state(true);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#who_is_it_for", label: "Who is it for?" },
    { href: "#how_does_it_work", label: "How does it work?" },
    { href: "#why_now", label: "Why now?" },
    { href: "#contact_us", label: "Contact us" },
  ];

  onMount(() => {
    // ── 1. Logo swap: hero oscuro vs resto claro ──────────────────────────
    const hero = document.querySelector("#hero");
    if (hero) {
      const heroObs = new IntersectionObserver(
        ([entry]) => {
          darkBackground = entry.isIntersecting;
        },
        { threshold: 0.1 },
      );
      heroObs.observe(hero);
    }

    // ── 2. Active link: qué sección ocupa el viewport ────────────────────
    // Mapeamos cada href de ancla a su elemento en el DOM.
    // "/" se activa cuando ninguna sección está visible (top de página).
    const sectionIds = navLinks
      .filter((l) => l.href.startsWith("#"))
      .map((l) => l.href.slice(1)); // quitar el #

    const sectionEls = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    // Threshold bajo para que se active en cuanto la sección
    // ocupe al menos el 20% del viewport
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentPath = `#${entry.target.id}`;
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    sectionEls.forEach((el) => sectionObs.observe(el));

    // Scroll al top → activar Home
    const topObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) currentPath = "/";
      },
      { threshold: 0.5 },
    );
    if (hero) topObs.observe(hero);

    return () => {
      sectionObs.disconnect();
      topObs.disconnect();
    };
  });

  function toggleMenu() {
    menuOpen = !menuOpen;
  }
</script>

<header class="fixed w-full z-50">
  <nav
    class="flex items-center justify-between border-b px-6 py-4 text-sm font-medium uppercase tracking-wider backdrop-blur-sm transition-colors duration-300
           {darkBackground
      ? 'bg-gray-900/10 border-gray-700'
      : 'bg-white/90 border-gray-200'}"
  >
    <!-- Logo -->
    <a href="/">
      <img
        src={darkBackground ? LogoWhite.src : Logo.src}
        alt="Telos Genomics"
        class="h-8 transition-opacity duration-300"
      />
    </a>

    <!-- Desktop links -->
    <ul class="hidden md:flex items-center space-x-6">
      {#each navLinks as link}
        <li>
          <a
            href={link.href}
            class="transition-colors
                   {darkBackground
              ? 'text-gray-300 hover:text-blue-400'
              : 'text-gray-700 hover:text-blue-600'}
                   {currentPath === link.href ? 'underline font-bold' : ''}"
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>

    <!-- Mobile hamburger -->
    <button
      class="md:hidden transition-colors {darkBackground
        ? 'text-gray-300'
        : 'text-gray-700'}"
      onclick={() => toggleMenu()}
      aria-label="Toggle menu"
    >
      <Menu class="w-6 h-6" />
    </button>
  </nav>

  <!-- Mobile dropdown -->
  {#if menuOpen}
    <ul
      class="md:hidden absolute top-full left-0 w-full backdrop-blur-sm border-t px-6 py-4 space-y-4 text-sm z-50
             {darkBackground
        ? 'bg-gray-900/90 border-gray-700'
        : 'bg-white/95 border-gray-200'}"
    >
      {#each navLinks as link}
        <li>
          <a
            href={link.href}
            class="block transition-colors
                   {darkBackground
              ? 'text-gray-300 hover:text-blue-400'
              : 'text-gray-700 hover:text-blue-600'}
                   {currentPath === link.href ? 'underline font-bold' : ''}"
            onclick={() => (menuOpen = false)}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</header>
