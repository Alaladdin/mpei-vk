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
      description: 'расписание',
      arguments: {
        today: 'сегодня',
        todayFull: 'на сегодня',
        tomorrow: 'завтра',
        tomorrowFull: 'на завтра',
        week: 'неделю',
        weekFull: 'на неделю',
        nextWeek: 'следующую неделю',
        nextWeekFull: 'на следующую неделю',
        month: 'месяц',
        monthFull: 'на месяц',
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
      description: 'cтатистика по командуcам',
      status: {
        noCommandStats: 'Статистики по этой команде не найдено',
        noStats: 'Статистика по командам пуста 😔',
        statsCleared: 'Статистика очищена',
      },
    },
  },
};
