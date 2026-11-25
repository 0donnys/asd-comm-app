/* Сценарий «Площадка» — собираемся и гуляем на детской площадке */
(function () {
  function v(id, text, boyText) {
    return {
      id: 'playground.' + id,
      text: text,
      boyText: boyText || null,
      boyId: boyText ? 'playground.' + id + '.boy' : null
    };
  }

  const steps = [

    /* 1. ПОРА СОБИРАТЬСЯ */
    {
      id: 'greet',
      type: 'info',
      scene: 'room',
      char: 'girl',
      nextLabel: 'Дальше',
      next: 'look',
      bubble: v('s1.intro', 'Привет! Сегодня отличный день, чтобы сходить на площадку! Пора собираться!'),
      adult: 'Скажи: «Сегодня пойдём на площадку. Пора собираться. Нажми сюда.»'
    },

    /* 2. СМОТРИМ В ОКНО */
    {
      id: 'look',
      type: 'info',
      scene: 'room',
      char: 'girl',
      nextLabel: 'Посмотреть в окно',
      next: 'weather',
      bubble: v('s2.window', 'Сначала посмотрим в окно — какая сегодня погода?'),
      adult: 'Скажи: «Пора собираться. Посмотрим в окно. Нажми сюда.»'
    },

    /* 3. ПОГОДА (ветвление) */
    {
      id: 'weather',
      type: 'pick',
      scene: 'window',
      char: 'girl',
      cols: 4,
      single: true,
      bubble: v('s3.intro', 'Смотри, какая погода! Какая сегодня погода?'),
      adult: 'Скажи: «Смотри, какая погода! Покажи, где солнышко (тучка, дождик, снег)?»',
      options: [
        { id: 'sun', group: 'items', label: 'Солнечно' },
        { id: 'cloud', group: 'items', label: 'Пасмурно' },
        { id: 'rain', group: 'items', label: 'Дождь' },
        { id: 'snow', group: 'items', label: 'Зима' }
      ],
      correct: ['sun', 'cloud', 'rain', 'snow'],
      sayCorrect: {
        sun: v('s3.sun', 'Солнечно! Светит солнышко, тепло!'),
        cloud: v('s3.cloud', 'Пасмурно! Серо и прохладно, но без дождя.'),
        rain: v('s3.rain', 'Дождь! Капает дождик, нужен зонт и сапожки.'),
        snow: v('s3.snow', 'Зима! Мороз и снег, надо утеплиться!')
      },
      branch: { sun: 'w1', cloud: 'w2', rain: 'w3', snow: 'w4' },
      doneText: 'Хорошо! Теперь оденемся по погоде!'
    },

    /* ===== ОДЕЖДА ПО ПОГОДЕ ===== */
    {
      id: 'w1',
      type: 'pick',
      scene: 'hallway',
      char: 'girl',
      cols: 3,
      bubble: v('w1.intro', 'Сегодня солнечно и тепло. Что наденем?'),
      adult: 'Скажи: «На улице тепло. Давай шорты. Покажи, где шорты?»',
      adultByPending: {
        shorts: 'Скажи: «Давай шорты. Покажи, где шорты?»',
        tshirt: 'Скажи: «Теперь футболку. Покажи, где футболка?»',
        cap: 'Скажи: «Теперь кепку. Покажи, где кепка?»'
      },
      options: [
        { id: 'shorts', group: 'items', label: 'Шорты' },
        { id: 'tshirt', group: 'items', label: 'Футболка' },
        { id: 'cap', group: 'items', label: 'Кепка' },
        { id: 'jacket', group: 'items', label: 'Куртка' },
        { id: 'boots', group: 'items', label: 'Сапоги' }
      ],
      correct: ['shorts', 'tshirt', 'cap'],
      sayCorrect: {
        shorts: v('w1.shorts', 'Шорты!'),
        tshirt: v('w1.tshirt', 'Футболка!'),
        cap: v('w1.cap', 'Кепка!')
      },
      hints: {
        shorts: v('w1.hint.shorts', 'Тепло! Тёплая одежда не нужна.'),
        tshirt: v('w1.hint.tshirt', 'Тепло! Тёплая одежда не нужна.'),
        cap: v('w1.hint.cap', 'Тепло! Тёплая одежда не нужна.')
      },
      bubbleByPending: {
        tshirt: v('w1.next.tshirt', 'Что ещё? Футболку! Где футболка?'),
        cap: v('w1.next.cap', 'Что ещё? Кепку! Где кепка?')
      },
      next: 'checkFlat',
      completeVoice: v('w1.done', 'Я оделась! Легко и не жарко!', 'Я оделся! Легко и не жарко!'),
      doneText: 'Молодец! Ты оделась по погоде!',
      boyDoneText: 'Молодец! Ты оделся по погоде!'
    },
    {
      id: 'w2',
      type: 'pick',
      scene: 'hallway',
      char: 'girl',
      cols: 3,
      bubble: v('w2.intro', 'Сегодня пасмурно и прохладно. Что наденем?'),
      adult: 'Скажи: «Прохладно. Давай кофту. Покажи, где кофта?»',
      adultByPending: {
        sweater: 'Скажи: «Давай кофту. Покажи, где кофта?»',
        jeans: 'Скажи: «Теперь джинсы. Покажи, где джинсы?»',
        raincoat: 'Скажи: «Теперь курточку. Покажи, где курточка?»'
      },
      options: [
        { id: 'sweater', group: 'items', label: 'Кофта' },
        { id: 'jeans', group: 'items', label: 'Джинсы' },
        { id: 'raincoat', group: 'items', label: 'Курточка' },
        { id: 'shorts', group: 'items', label: 'Шорты' },
        { id: 'skirt', group: 'items', label: 'Юбка' }
      ],
      correct: ['sweater', 'jeans', 'raincoat'],
      sayCorrect: {
        sweater: v('w2.sweater', 'Кофта!'),
        jeans: v('w2.jeans', 'Джинсы!'),
        raincoat: v('w2.raincoat', 'Курточка!')
      },
      hints: {
        sweater: v('w2.hint.sweater', 'Прохладно! Нужна одежда потеплее.'),
        jeans: v('w2.hint.jeans', 'Прохладно! Нужна одежда потеплее.'),
        raincoat: v('w2.hint.raincoat', 'Прохладно! Нужна одежда потеплее.')
      },
      bubbleByPending: {
        jeans: v('w2.next.jeans', 'Что ещё? Джинсы! Где джинсы?'),
        raincoat: v('w2.next.raincoat', 'Что ещё? Курточку! Где курточка?')
      },
      next: 'checkFlat',
      completeVoice: v('w2.done', 'Я оделась! Не замёрзну!', 'Я оделся! Не замёрзну!'),
      doneText: 'Молодец! Ты оделась по погоде!',
      boyDoneText: 'Молодец! Ты оделся по погоде!'
    },
    {
      id: 'w3',
      type: 'pick',
      scene: 'hallway',
      char: 'girl',
      cols: 3,
      bubble: v('w3.intro', 'На улице дождь. Что наденем?'),
      adult: 'Скажи: «Дождь! Давай плащ. Покажи, где плащ?»',
      adultByPending: {
        raincoat: 'Скажи: «Давай плащ. Покажи, где плащ?»',
        boots: 'Скажи: «Теперь сапоги. Покажи, где сапоги?»',
        umbrella: 'Скажи: «Теперь зонт. Покажи, где зонт?»'
      },
      options: [
        { id: 'raincoat', group: 'items', label: 'Плащ' },
        { id: 'boots', group: 'items', label: 'Сапоги' },
        { id: 'umbrella', group: 'items', label: 'Зонт' },
        { id: 'shorts', group: 'items', label: 'Шорты' },
        { id: 'cap', group: 'items', label: 'Кепка' }
      ],
      correct: ['raincoat', 'boots', 'umbrella'],
      sayCorrect: {
        raincoat: v('w3.raincoat', 'Плащ!'),
        boots: v('w3.boots', 'Сапоги!'),
        umbrella: v('w3.umbrella', 'Зонт!')
      },
      hints: {
        raincoat: v('w3.hint.raincoat', 'Дождь! Промокнешь! Нужен плащ.'),
        boots: v('w3.hint.boots', 'Дождь! Промокнешь! Нужны сапоги.'),
        umbrella: v('w3.hint.umbrella', 'Дождь! Промокнешь! Нужен зонт.')
      },
      bubbleByPending: {
        boots: v('w3.next.boots', 'Что ещё? Сапоги! Где сапоги?'),
        umbrella: v('w3.next.umbrella', 'Что ещё? Зонт! Где зонт?')
      },
      next: 'checkFlat',
      completeVoice: v('w3.done', 'Я оделась! Дождь мне не страшен!', 'Я оделся! Дождь мне не страшен!'),
      doneText: 'Молодец! Ты оделась по погоде!',
      boyDoneText: 'Молодец! Ты оделся по погоде!'
    },
    {
      id: 'w4',
      type: 'pick',
      scene: 'hallway',
      char: 'girl',
      cols: 3,
      bubble: v('w4.intro', 'На улице мороз и снег. Что наденем?'),
      adult: 'Скажи: «Мороз! Давай тёплую куртку. Покажи, где куртка?»',
      adultByPending: {
        winterJacket: 'Скажи: «Давай тёплую куртку. Покажи, где куртка?»',
        pants: 'Скажи: «Теперь тёплые штаны. Покажи, где штаны?»',
        scarf: 'Скажи: «Теперь шарф. Покажи, где шарф?»',
        mittens: 'Скажи: «Теперь варежки. Покажи, где варежки?»',
        hat: 'Скажи: «Теперь шапку. Покажи, где шапка?»'
      },
      options: [
        { id: 'winterJacket', group: 'items', label: 'Тёплая куртка' },
        { id: 'pants', group: 'items', label: 'Тёплые штаны' },
        { id: 'scarf', group: 'items', label: 'Шарф' },
        { id: 'mittens', group: 'items', label: 'Варежки' },
        { id: 'hat', group: 'items', label: 'Шапка' },
        { id: 'shorts', group: 'items', label: 'Шорты' }
      ],
      correct: ['winterJacket', 'pants', 'scarf', 'mittens', 'hat'],
      sayCorrect: {
        winterJacket: v('w4.winterJacket', 'Куртка!'),
        pants: v('w4.pants', 'Штаны!'),
        scarf: v('w4.scarf', 'Шарф!'),
        mittens: v('w4.mittens', 'Варежки!'),
        hat: v('w4.hat', 'Шапка!')
      },
      hints: {
        winterJacket: v('w4.hint.jacket', 'Мороз! Замёрзнешь! Утеплимся!'),
        pants: v('w4.hint.pants', 'Мороз! Замёрзнешь! Утеплимся!'),
        scarf: v('w4.hint.scarf', 'Мороз! Замёрзнешь! Утеплимся!'),
        mittens: v('w4.hint.mittens', 'Мороз! Замёрзнешь! Утеплимся!'),
        hat: v('w4.hint.hat', 'Мороз! Замёрзнешь! Утеплимся!')
      },
      bubbleByPending: {
        pants: v('w4.next.pants', 'Что ещё? Штаны! Где штаны?'),
        scarf: v('w4.next.scarf', 'Что ещё? Шарф! Где шарф?'),
        mittens: v('w4.next.mittens', 'Что ещё? Варежки! Где варежки?'),
        hat: v('w4.next.hat', 'Что ещё? Шапку! Где шапка?')
      },
      next: 'checkFlat',
      completeVoice: v('w4.done', 'Я оделась! Ух, тепло!', 'Я оделся! Ух, тепло!'),
      doneText: 'Молодец! Ты оделась по погоде!',
      boyDoneText: 'Молодец! Ты оделся по погоде!'
    },

    /* 5. ПРОВЕРЯЕМ КВАРТИРУ */
    {
      id: 'checkFlat',
      type: 'pick',
      scene: 'hallway',
      char: 'girlDressed',
      cols: 4,
      bubble: v('s5.intro', 'Перед выходом проверим квартиру! Всё ли выключено? Где свет?'),
      adult: 'Скажи: «Проверим квартиру. Покажи, где свет. Выключен? Молодец!»',
      adultByPending: {
        light: 'Скажи: «Проверим квартиру. Покажи, где свет?»',
        water: 'Скажи: «Теперь вода. Покажи, где вода?»',
        gas: 'Скажи: «Теперь газ. Покажи, где газ?»',
        socket: 'Скажи: «Теперь розетки. Покажи, где розетки?»'
      },
      options: [
        { id: 'light', group: 'items', label: 'Свет' },
        { id: 'water', group: 'items', label: 'Вода' },
        { id: 'gas', group: 'items', label: 'Газ' },
        { id: 'socket', group: 'items', label: 'Розетки' }
      ],
      correct: ['light', 'water', 'gas', 'socket'],
      sayCorrect: {
        light: v('s5.light', 'Свет выключен!'),
        water: v('s5.water', 'Вода закрыта!'),
        gas: v('s5.gas', 'Газ выключен!'),
        socket: v('s5.socket', 'Приборы выключены!')
      },
      bubbleByPending: {
        water: v('s5.next.water', 'Что ещё? Вода! Где вода?'),
        gas: v('s5.next.gas', 'Что ещё? Газ! Где газ?'),
        socket: v('s5.next.socket', 'Что ещё? Розетки! Где розетки?')
      },
      completeVoice: v('s5.done', 'Свет, вода, газ, приборы — всё выключено!'),
      doneText: 'Молодец! Всё выключено!'
    },

    /* 6. КЛЮЧИ И ТЕЛЕФОН */
    {
      id: 'keys',
      type: 'pick',
      scene: 'room',
      char: 'girlDressed',
      cols: 4,
      bubble: v('s6.intro', 'Надо взять ключи и телефон. Где ключи? Где телефон?'),
      adult: 'Скажи: «Надо взять ключи и телефон. Покажи, где ключи?»',
      adultByPending: {
        keys: 'Скажи: «Надо взять ключи и телефон. Покажи, где ключи?»',
        phone: 'Скажи: «Теперь телефон. Покажи, где телефон?»'
      },
      options: [
        { id: 'keys', group: 'items', label: 'Ключи' },
        { id: 'phone', group: 'items', label: 'Телефон' },
        { id: 'toy', group: 'items', label: 'Игрушка' },
        { id: 'umbrella', group: 'items', label: 'Зонт' }
      ],
      correct: ['keys', 'phone'],
      sayCorrect: {
        keys: v('s6.keys', 'Ключи!'),
        phone: v('s6.phone', 'Телефон!')
      },
      hints: {
        keys: v('s6.hint.keys', 'Это не ключи. Нужны ключи.'),
        phone: v('s6.hint.phone', 'Это не телефон. Нужен телефон.')
      },
      bubbleByPending: {
        phone: v('s6.next.phone', 'Теперь телефон. Где телефон?')
      },
      completeVoice: v('s6.done', 'Ключи и телефон — со мной!'),
      doneText: 'Молодец! Ты взяла ключи и телефон!',
      boyDoneText: 'Молодец! Ты взял ключи и телефон!'
    },

    /* 7. ЗАКРЫВАЕМ ДВЕРЬ */
    {
      id: 'closeDoor',
      type: 'pick',
      scene: 'hallway',
      char: 'girlDressed',
      cols: 3,
      bubble: v('s7.intro', 'Выходим и закрываем дверь на ключ.'),
      adult: 'Скажи: «Закроем дверь на ключ. Покажи, где ключ?»',
      options: [
        { id: 'keys', group: 'items', label: 'Закрыть' },
        { id: 'door', group: 'items', label: 'Открыть' },
        { id: 'run', group: 'gestures', label: 'Уйти так' }
      ],
      correct: ['keys'],
      sayCorrect: { keys: v('s7.ok', 'Дверь заперта!') },
      hint: v('s7.hint', 'Дверь надо закрыть на ключ!'),
      completeVoice: v('s7.done', 'Дверь заперта, ручка не поддаётся. Можно идти!'),
      doneText: 'Молодец! Дверь заперта!'
    },

    /* 8. КАК СПУСТИМСЯ */
    {
      id: 'down',
      type: 'pick',
      scene: 'entrance',
      char: 'girlDressed',
      cols: 2,
      single: true,
      bubble: v('s8.intro', 'Как спустимся — на лифте или по ступенькам?'),
      adult: 'Скажи: «Как спустимся? Покажи лифт (ступеньки).»',
      options: [
        { id: 'elevator', group: 'items', label: 'Лифт' },
        { id: 'stairs', group: 'items', label: 'Ступеньки' }
      ],
      correct: ['elevator', 'stairs'],
      sayCorrect: {
        elevator: v('s8.elevator', 'Нажимаю кнопку один… вот и первый этаж!'),
        stairs: v('s8.stairs', 'Топ-топ по ступенькам… спустились!')
      },
      doneText: 'Молодец! Мы вышли из подъезда!'
    },

    /* 9. КУДА ПОЙДЁМ */
    {
      id: 'place',
      type: 'pick',
      scene: 'playground',
      char: 'girlDressed',
      cols: 4,
      single: true,
      bubble: v('s9.intro', 'Ура! Мы выбрались на площадку! Куда сначала?'),
      adult: 'Скажи: «Мы на площадке! Куда пойдём? Покажи качели.»',
      options: [
        { id: 'swing', group: 'items', label: 'Качели' },
        { id: 'carousel', group: 'items', label: 'Карусели' },
        { id: 'sandbox', group: 'items', label: 'Песочница' },
        { id: 'slide', group: 'items', label: 'Горка' }
      ],
      correct: ['swing', 'carousel', 'sandbox', 'slide'],
      sayCorrect: {
        swing: v('s9.swing', 'Качели!'),
        carousel: v('s9.carousel', 'Карусели!'),
        sandbox: v('s9.sandbox', 'Песочница!'),
        slide: v('s9.slide', 'Горка!')
      },
      branch: { swing: 'p1', carousel: 'p2', sandbox: 'p3', slide: 'p4' },
      doneText: 'Отлично! Идём играть!'
    },

    /* ===== АТТРАКЦИОНЫ ===== */
    {
      id: 'p1',
      type: 'pick',
      scene: 'playground',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Мальчик',
      cols: 2,
      bubble: v('p1.intro', 'Привет! Я тут качаюсь. Хочешь покачаться вместе?'),
      adult: 'Скажи: «Мальчик предлагает покачаться. Покажи галочку — да.»',
      options: [
        { id: 'check', group: 'gestures', label: 'Да' },
        { id: 'cross', group: 'gestures', label: 'Нет' }
      ],
      correct: ['check'],
      sayCorrect: { check: v('p1.ok', 'Давай покачаемся вместе!') },
      hint: v('p1.hint', 'Давай согласимся — вместе веселее!'),
      next: 'final',
      doneText: 'Молодец! Класс, вдвоём веселее!'
    },
    {
      id: 'p2',
      type: 'pick',
      scene: 'playground',
      char: 'girlDressed',
      char2: 'friendGirl',
      speaker: '👧 Девочка',
      cols: 2,
      bubble: v('p2.intro', 'Я кручусь на карусели! Хочешь со мной?'),
      adult: 'Скажи: «Давай покатаемся вместе. Покажи галочку.»',
      options: [
        { id: 'check', group: 'gestures', label: 'Да' },
        { id: 'cross', group: 'gestures', label: 'Нет' }
      ],
      correct: ['check'],
      sayCorrect: { check: v('p2.ok', 'Давай вместе крутиться!') },
      hint: v('p2.hint', 'Давай вместе — веселее!'),
      next: 'final',
      doneText: 'Молодец! Крутитесь вместе, смеётесь!'
    },
    {
      id: 'p3',
      type: 'pick',
      scene: 'playground',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Мальчик',
      cols: 3,
      bubble: v('p3.intro', 'Привет! Я строю замок. Хочешь поиграть вместе? У меня есть лишняя лопатка и ведёрко.'),
      adult: 'Скажи: «Давай поиграем вместе. Покажи галочку.»',
      options: [
        { id: 'together', group: 'gestures', label: 'Вместе' },
        { id: 'stand', group: 'gestures', label: 'Рядом' },
        { id: 'play', group: 'gestures', label: 'Один' }
      ],
      correct: ['together'],
      sayCorrect: { together: v('p3.ok', 'Давай построим замок вместе!') },
      hint: v('p3.hint', 'Давай вместе — веселее!'),
      next: 'final',
      doneText: 'Молодец! Строите замок вместе!'
    },
    {
      id: 'p4',
      type: 'pick',
      scene: 'playground',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Мальчик',
      cols: 3,
      bubble: v('p4.intro', 'Я катаюсь с горки! Хочешь со мной?'),
      adult: 'Скажи: «Давай по очереди. Покажи галочку.»',
      options: [
        { id: 'check', group: 'gestures', label: 'Да' },
        { id: 'wait', group: 'gestures', label: 'Подожду' },
        { id: 'cross', group: 'gestures', label: 'Нет' }
      ],
      correct: ['check'],
      sayCorrect: { check: v('p4.ok', 'Давай кататься по очереди!') },
      hint: v('p4.hint', 'Давай по очереди — вместе веселее!'),
      next: 'final',
      doneText: 'Молодец! Катаетесь по очереди!'
    },

    /* 11. ФИНАЛ */
    {
      id: 'final',
      type: 'info',
      scene: 'playground',
      char: 'girl',
      final: true,
      nextLabel: 'Завершить',
      bubble: v('s11.final', 'Молодец! Ты собралась и погуляла на площадке! Ура!',
                'Молодец! Ты собрался и погулял на площадке! Ура!'),
      adult: 'Скажи: «Молодец! Ты собралась на площадку, всё проверила и поиграла! Умница!»',
      boyAdult: 'Скажи: «Молодец! Ты собрался на площадку, всё проверил и поиграл! Умница!»'
    }
  ];

  window.SCENARIOS = window.SCENARIOS || {};
  window.SCENARIOS.playground = {
    id: 'playground',
    title: 'Площадка',
    subtitle: 'Собираемся и гуляем',
    thumbEmoji: '🛝',
    thumbChar: 'girl',
    totalSteps: 11,
    steps: steps
  };
})();
