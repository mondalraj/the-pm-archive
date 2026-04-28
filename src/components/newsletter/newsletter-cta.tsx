import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { Reveal } from "@/components/motion/reveal";

/**
 * Violet CTA band on the home page. Edge-to-edge gradient panel with a
 * single decorative glow. Copy is intentionally short — the form does
 * the talking.
 */
export function NewsletterCta() {
  return (
    <section id="newsletter" className="py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden border border-primary/20 bg-[linear-gradient(135deg,#7c3aed_0%,#4c1d95_100%)] p-10 md:p-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-white/20 blur-[120px]"
          />
          <div className="relative z-10 max-w-2xl text-white">
            <p className="label-caps mb-5 text-white/70">The weekly builder brief</p>
            <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight md:text-5xl">
              Subscribe for free. Get the signal. Skip the noise.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/80 md:text-lg">
              Get one focused email each week with 5-minute reads on product,
              engineering, growth, and execution - built to help you make
              smarter roadmap and revenue decisions.
            </p>
            <p className="label-caps mt-4 text-white/70">
             Free forever. Takes 5 seconds. Unsubscribe anytime.
            </p>
            <NewsletterForm variant="dark" className="mt-8" />
            <p className="mt-6 text-white/50">
              Join 1,872+ product leaders, engineers & founders already getting better every Tuesday.
            </p>
          </div>
        </div>
        </Reveal>
      </Container>
    </section>
  );
}
