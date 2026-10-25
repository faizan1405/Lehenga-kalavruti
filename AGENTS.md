<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All demo content (products, collections, journal, images) lives in src/data/catalog.ts — swap real assets there without touching page layouts.
- 3D/WebGL scenes live in src/components/experience and are lazy-loaded behind ClientOnly; scroll scrubbing uses GSAP ScrollTrigger loaded dynamically; every effect has a prefers-reduced-motion static fallback.
- Home page sections for the Navratri lehenga brand live in src/components/experience/NavratriSections.tsx (pinned GSAP sections share a usePinned helper); keep products and prices visible early in the page flow.
