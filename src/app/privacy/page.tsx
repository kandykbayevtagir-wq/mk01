import type { Metadata } from "next";
import { contacts, legal, site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/sections/page-hero";

export const metadata: Metadata = pageMetadata({
  title: "Политика обработки персональных данных",
  description: `Как «${site.name}» обрабатывает и защищает персональные данные, переданные через формы сайта.`,
  path: "/privacy",
});

/*
 * ЗАПОЛНИТЬ: базовый шаблон политики. Перед запуском согласуйте текст с
 * юристом с учётом Закона РК «О персональных данных и их защите» и укажите
 * реквизиты оператора в `src/data/site.ts` (legal.entity, legal.bin).
 */
export default function PrivacyPage() {
  const operator = legal.entity ? `${legal.entity}${legal.bin ? `, БИН/ИИН ${legal.bin}` : ""}` : `«${site.name}»`;
  return (
    <Container className="pb-24 pt-6 sm:pt-8 lg:pb-32 lg:pt-10">
      <Breadcrumbs items={[{ href: "/privacy", label: "Политика конфиденциальности" }]} />
      <article className="mt-10 max-w-3xl lg:mt-16">
        <h1 className="text-h1 font-semibold">Политика обработки персональных данных</h1>
        <div className="mt-10 space-y-8 text-[1.0625rem] leading-relaxed text-ink/85 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink">
          <section>
            <h2>1. Оператор</h2>
            <p>Оператором персональных данных является {operator}.</p>
          </section>
          <section>
            <h2>2. Какие данные мы получаем</h2>
            <p>
              Имя, номер телефона, адрес электронной почты, город и текст сообщения — только те данные, которые вы
              указываете в формах сайта.
            </p>
          </section>
          <section>
            <h2>3. Цели обработки</h2>
            <p>
              Данные используются исключительно для связи с вами по вашему обращению: запись на обучение, запись в центр,
              консультация по продукции или сотрудничество.
            </p>
          </section>
          <section>
            <h2>4. Хранение и передача</h2>
            <p>
              Мы не продаём и не передаём ваши данные третьим лицам, за исключением сервисов, необходимых для доставки
              заявки (например, мессенджера или почтового сервиса), и случаев, предусмотренных законодательством
              Республики Казахстан.
            </p>
          </section>
          <section>
            <h2>5. Ваши права</h2>
            <p>
              Вы можете запросить уточнение, изменение или удаление своих данных, а также отозвать согласие на их
              обработку
              {contacts.email ? (
                <>
                  , написав на{" "}
                  <a href={`mailto:${contacts.email}`} className="underline underline-offset-4">
                    {contacts.email}
                  </a>
                </>
              ) : (
                ", обратившись к нам через страницу «Контакты»"
              )}
              .
            </p>
          </section>
        </div>
      </article>
    </Container>
  );
}
