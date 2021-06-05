module.exports = {
  blacklist: [
    '@all',
    '@online',
  ],
  texts: {
    questions: [
      /(?=.*(запись|пишет|писал|записывал).*)(.*(пара|лекция|практика|лаба|кр)*.)(.*(есть|кто).*)?\?$/gim,
      /(?=.*(скин(ете|ьте|уть)|может).*)(.*(задание|файл|запись|лекция|практика|лаба|кр)*.)(.*(есть|кто).*)?(\?|!)$/gim, // non stable
    ],
    replies: {
      dontDoThat: 'Никогда так не делай',
      fuckThisQuestion: 'Пошел нахуй с такими вопросами',
    },
    commands: {
      commandsList: 'Список моих командуcов',
      unknownCommand: 'Я не нашел эту команду в своем крутейшем списке',
      unknownArgument: 'не знаю, что за аргумент такой',
    },
    status: {
      loginError: 'Кажется, не удалось залогиниться',
      mpeiServerError: 'Ебаные сервера МЭИ снова не отвечают',
      databaseError: 'Непредвиденская ошибка. Кто-то украл данные из БД',
      crashError: 'Тотальный краш',
    },
    schedule: {
      arguments: {
        today: 'сегодня',
        todayFull: 'Расписание на сегодня',
        tomorrow: 'завтра',
        tomorrowFull: 'Расписание на завтра',
        week: 'неделю',
        weekFull: 'Расписание на неделю',
      },
      scheduleFor: 'Расписание на',
      noClasses: 'Занятий нет 😎',
    },
    actuality: {
      arguments: {
        lazy: 'несрочная актуалочка',
      },
    },
    image: {
      status: {
        noArgument: 'Необходимо указать текст для фото аргументом',
      },
    },
    stats: {
      description: 'Статистика по командуcам',
      status: {
        noCommandStats: 'Статистики по этой команде не найдено',
        noStats: 'Статистика по командам пуста 😔',
      },
    },
  },
};
