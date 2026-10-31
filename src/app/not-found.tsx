import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ContourArt } from "@/components/ui/contour-art";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <ContourArt seed={13} className="absolute -right-32 top-0 h-full w-[70%] opacity-60 max-md:hidden" />
      <Container className="relative py-24 lg:py-40">
        <p className="text-sm font-semibold tabular-nums text-accent">404</p>
        <h1 className="mt-4 max-w-2xl text-h1 font-semibold">Страница не найдена</h1>
        <p className="mt-6 max-w-lg text-lead text-muted">
          Возможно, ссылка устарела или страница была перемещена. Начните с каталога программ.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/courses" variant="accent" size="lg" arrow>
            Смотреть курсы
          </ButtonLink>
          <ButtonLink href="/" variant="outline" size="lg">
            На главную
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
