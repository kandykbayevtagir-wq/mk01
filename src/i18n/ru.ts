/**
 * Interface strings shared across the site (navigation, buttons, forms).
 * Page-specific editorial copy lives next to the content in `src/data`.
 */
export const ru = {
  nav: {
    courses: "Курсы",
    about: "О преподавателе",
    center: "Центр",
    products: "Продукция",
    reviews: "Отзывы",
    partners: "Организаторам",
    contacts: "Контакты",
  },
  common: {
    enroll: "Записаться",
    chooseCourse: "Выбрать курс",
    allCourses: "Все курсы",
    details: "Подробнее",
    courseDetails: "Подробнее о курсе",
    priceOnRequest: "Стоимость уточняется",
    datesOnRequest: "Даты уточняются",
    menu: "Меню",
    closeMenu: "Закрыть меню",
    openMenu: "Открыть меню",
    skipToContent: "Перейти к содержанию",
    home: "Главная",
  },
  form: {
    name: "Имя и фамилия",
    namePlaceholder: "Как к вам обращаться",
    phone: "Телефон",
    phonePlaceholder: "+7 ___ ___ __ __",
    email: "Электронная почта",
    emailOptional: "Электронная почта (необязательно)",
    city: "Город",
    course: "Курс",
    preferredDate: "Удобная дата",
    preferredDateAny: "Любая / уточню позже",
    message: "Комментарий",
    messageOptional: "Комментарий (необязательно)",
    submit: "Отправить заявку",
    sending: "Отправляем…",
    consent: "Нажимая кнопку, вы соглашаетесь с",
    consentLink: "политикой обработки персональных данных",
    required: "Обязательное поле",
    successTitle: "Заявка отправлена",
    successText: "Мы получили вашу заявку и свяжемся с вами в ближайшее рабочее время.",
    sendAnother: "Отправить ещё одну",
    errorTitle: "Не удалось отправить заявку",
    errorGeneric: "Произошла ошибка. Попробуйте ещё раз или свяжитесь с нами напрямую.",
    errorNotConfigured:
      "Онлайн-приём заявок ещё не подключён. Пожалуйста, свяжитесь с нами напрямую — мы ответим лично.",
    errorValidation: "Проверьте выделенные поля.",
    errorRate: "Слишком много попыток. Пожалуйста, подождите минуту.",
    retry: "Попробовать снова",
  },
  validation: {
    name: "Укажите имя — не короче 2 символов",
    phone: "Укажите номер телефона полностью, например +7 700 000 00 00",
    email: "Проверьте адрес электронной почты",
    city: "Укажите город",
    course: "Выберите курс",
    background: "Расскажите коротко о себе или организации",
    tooLong: "Слишком длинный текст",
  },
} as const;

export type Dictionary = typeof ru;
