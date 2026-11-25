/* Сценарий «Школа» — собираемся в школу, дорога, урок и перемена */
(function () {
  // v(id, текст, текст_для_мальчика)
  function v(id, text, boyText) {
    return {
      id: 'school.' + id,
      text: text,
      boyText: boyText || null,
      boyId: boyText ? 'school.' + id + '.boy' : null
    };
  }

  const steps = [

    /* 1. ДОМА — ПОРА ВСТАВАТЬ */
    {
      id: 'greet',
      type: 'info',
      scene: 'bedroom',
      char: 'girl',
      nextLabel: 'Дальше',
      next: 'alarm',
      bubble: v('s1.intro', 'Привет! Сегодня надо в школу. Пора вставать и собираться!'),
      adult: 'Скажи: «Сегодня идём в школу. Начнём собираться. Нажми сюда.»'
    },

    /* 2. ПРОЗВЕНЕЛ БУДИЛЬНИК */
    {
      id: 'alarm',
      type: 'pick',
      scene: 'bedroom',
      char: 'girl',
      speaker: '⏰ Будильник',
      cols: 3,
      bubble: v('s2.intro', 'Динь-динь… доброе утро! Пора вставать.'),
      adult: 'Скажи: «Прозвенел будильник! Пора вставать. Покажи, где будильник — выключи его.»',
      options: [
        { id: 'alarm', group: 'items', label: 'Выключить' },
        { id: 'bed', group: 'items', label: 'Спать дальше' },
        { id: 'phone', group: 'items', label: 'Взять телефон' }
      ],
      correct: ['alarm'],
      sayCorrect: { alarm: v('s2.ok', 'Щёлк! Будильник выключен!') },
      hint: v('s2.hint', 'Нельзя спать дальше — опоздаешь в школу! Выключи будильник.'),
      completeVoice: v('s2.done', 'Доброе утро! Пора вставать!'),
      doneText: 'Молодец! Ты выключила будильник!',
      boyDoneText: 'Молодец! Ты выключил будильник!',
      next: 'bed'
    },

    /* 3. ЗАПРАВИТЬ КРОВАТЬ (строго по порядку) */
    {
      id: 'bed',
      type: 'pick',
      scene: 'bedroom',
      char: 'girl',
      cols: 3,
      bubble: v('s3.intro', 'Кровать не заправлена. Давай заправим по порядку!'),
      adult: 'Скажи: «Сначала расправим одеяло. Покажи, где одеяло?»',
      adultByPending: {
        blanket: 'Скажи: «Сначала расправим одеяло. Покажи, где одеяло?»',
        pillow: 'Скажи: «Теперь подушка. Покажи, где подушка?»',
        cover: 'Скажи: «Теперь покрывало. Покажи, где покрывало?»'
      },
      options: [
        { id: 'blanket', group: 'items', label: 'Одеяло' },
        { id: 'pillow', group: 'items', label: 'Подушка' },
        { id: 'cover', group: 'items', label: 'Покрывало' },
        { id: 'game', group: 'items', label: 'Играть' },
        { id: 'candy', group: 'items', label: 'Конфета' }
      ],
      correct: ['blanket', 'pillow', 'cover'],
      sayCorrect: {
        blanket: v('s3.blanket', 'Одеяло!'),
        pillow: v('s3.pillow', 'Подушка!'),
        cover: v('s3.cover', 'Покрывало!')
      },
      hints: {
        blanket: v('s3.hint.blanket', 'Сначала одеяло. Найди одеяло.'),
        pillow: v('s3.hint.pillow', 'Теперь подушка. Найди подушку.'),
        cover: v('s3.hint.cover', 'Теперь покрывало. Найди покрывало.')
      },
      bubbleByPending: {
        pillow: v('s3.next.pillow', 'Что дальше? Подушка! Где подушка?'),
        cover: v('s3.next.cover', 'Что дальше? Покрывало! Где покрывало?')
      },
      completeVoice: v('s3.done', 'Кровать заправлена! Красиво и аккуратно!'),
      doneText: 'Молодец! Кровать заправлена!',
      next: 'wash'
    },

    /* 4. УМЫТЬСЯ */
    {
      id: 'wash',
      type: 'pick',
      scene: 'bathroom',
      char: 'girl',
      cols: 3,
      bubble: v('s4.intro', 'Теперь умоемся! Что нужно взять?'),
      adult: 'Скажи: «Умываемся. Покажи, где кран с водой.»',
      adultByPending: {
        tap: 'Скажи: «Умываемся. Покажи, где кран с водой?»',
        soap: 'Скажи: «Теперь мыло. Покажи, где мыло?»',
        towel: 'Скажи: «Теперь полотенце. Покажи, где полотенце?»'
      },
      options: [
        { id: 'tap', group: 'items', label: 'Кран' },
        { id: 'soap', group: 'items', label: 'Мыло' },
        { id: 'towel', group: 'items', label: 'Полотенце' },
        { id: 'toy', group: 'items', label: 'Игрушка' },
        { id: 'candy', group: 'items', label: 'Конфета' }
      ],
      correct: ['tap', 'soap', 'towel'],
      sayCorrect: {
        tap: v('s4.tap', 'Вода!'),
        soap: v('s4.soap', 'Мыло!'),
        towel: v('s4.towel', 'Полотенце!')
      },
      hints: {
        tap: v('s4.hint.tap', 'Это не для умывания. Нужен кран с водой.'),
        soap: v('s4.hint.soap', 'Это не для умывания. Нужно мыло.'),
        towel: v('s4.hint.towel', 'Это не для умывания. Нужно полотенце.')
      },
      bubbleByPending: {
        soap: v('s4.next.soap', 'Что ещё? Мыло! Где мыло?'),
        towel: v('s4.next.towel', 'Что ещё? Полотенце! Где полотенце?')
      },
      completeVoice: v('s4.done', 'Умылась! Лицо чистое, глазки блестят!', 'Умылся! Лицо чистое, глазки блестят!'),
      doneText: 'Молодец! Ты умылась!',
      boyDoneText: 'Молодец! Ты умылся!',
      next: 'breakfast'
    },

    /* 5. ЗАВТРАК С МАМОЙ */
    {
      id: 'breakfast',
      type: 'pick',
      scene: 'kitchen',
      char: 'girl',
      char2: 'mom',
      speaker: '👩 Мама',
      cols: 3,
      bubble: v('s5.intro', 'Доброе утро, солнышко! Садись завтракать. Что будешь кушать?'),
      adult: 'Скажи: «Мама зовёт завтракать. Покажи, где каша.»',
      adultByPending: {
        porridge: 'Скажи: «Мама зовёт завтракать. Покажи, где каша?»',
        milk: 'Скажи: «Теперь молоко. Покажи, где молоко?»',
        apple: 'Скажи: «Теперь яблоко. Покажи, где яблоко?»'
      },
      options: [
        { id: 'porridge', group: 'items', label: 'Каша' },
        { id: 'milk', group: 'items', label: 'Молоко' },
        { id: 'apple', group: 'items', label: 'Яблоко' },
        { id: 'candy', group: 'items', label: 'Конфета' },
        { id: 'soda', group: 'items', label: 'Газировка' }
      ],
      correct: ['porridge', 'milk', 'apple'],
      sayCorrect: {
        porridge: v('s5.porridge', 'Каша!'),
        milk: v('s5.milk', 'Молоко!'),
        apple: v('s5.apple', 'Яблоко!')
      },
      hints: {
        porridge: v('s5.hint.porridge', 'На завтрак лучше кашу, а не сладкое.'),
        milk: v('s5.hint.milk', 'На завтрак полезно молоко.'),
        apple: v('s5.hint.apple', 'На завтрак полезно яблоко.')
      },
      bubbleByPending: {
        milk: v('s5.next.milk', 'Что ещё? Молоко! Где молоко?'),
        apple: v('s5.next.apple', 'Что ещё? Яблоко! Где яблоко?')
      },
      completeVoice: v('s5.done', 'Спасибо, мама! Я позавтракала!', 'Спасибо, мама! Я позавтракал!'),
      doneText: 'Молодец! Ты позавтракала!',
      boyDoneText: 'Молодец! Ты позавтракал!',
      next: 'backpack'
    },

    /* 6. СОБРАТЬ РЮКЗАК */
    {
      id: 'backpack',
      type: 'pick',
      scene: 'room',
      char: 'girl',
      cols: 3,
      bubble: v('s6.intro', 'Ты сегодня идёшь в школу. Собрала рюкзак? Давай проверим вместе!',
                'Ты сегодня идёшь в школу. Собрал рюкзак? Давай проверим вместе!'),
      adult: 'Скажи: «Соберём рюкзак. Покажи, где учебник.»',
      adultByPending: {
        textbook: 'Скажи: «Соберём рюкзак. Покажи, где учебник?»',
        notebook: 'Скажи: «Теперь тетрадь. Покажи, где тетрадь?»',
        pencilCase: 'Скажи: «Теперь пенал. Покажи, где пенал?»'
      },
      options: [
        { id: 'textbook', group: 'items', label: 'Учебник' },
        { id: 'notebook', group: 'items', label: 'Тетрадь' },
        { id: 'pencilCase', group: 'items', label: 'Пенал' },
        { id: 'toy', group: 'items', label: 'Игрушка' },
        { id: 'candy', group: 'items', label: 'Конфета' },
        { id: 'game', group: 'items', label: 'Игра' }
      ],
      correct: ['textbook', 'notebook', 'pencilCase'],
      sayCorrect: {
        textbook: v('s6.textbook', 'Учебник!'),
        notebook: v('s6.notebook', 'Тетрадь!'),
        pencilCase: v('s6.pencilCase', 'Пенал!')
      },
      hints: {
        textbook: v('s6.hint.textbook', 'Это не для школы. Нужен учебник.'),
        notebook: v('s6.hint.notebook', 'Это не для школы. Нужна тетрадь.'),
        pencilCase: v('s6.hint.pencilCase', 'Это не для школы. Нужен пенал.')
      },
      bubbleByPending: {
        notebook: v('s6.next.notebook', 'Что ещё? Тетрадь! Где тетрадь?'),
        pencilCase: v('s6.next.pencilCase', 'Что ещё? Пенал! Где пенал?')
      },
      completeVoice: v('s6.done', 'Рюкзак собран! Всё на месте!'),
      doneText: 'Молодец! Рюкзак собран!',
      next: 'weather'
    },

    /* 7. ПОГОДА (4 ветки) */
    {
      id: 'weather',
      type: 'pick',
      scene: 'window',
      char: 'girl',
      cols: 4,
      single: true,
      bubble: v('s7.intro', 'Смотри, какая погода! Какая сегодня погода?'),
      adult: 'Скажи: «Смотри, какая погода! Покажи, где солнышко (тучка, дождик, снег)?»',
      options: [
        { id: 'sun', group: 'items', label: 'Солнечно' },
        { id: 'cloud', group: 'items', label: 'Пасмурно' },
        { id: 'rain', group: 'items', label: 'Дождь' },
        { id: 'snow', group: 'items', label: 'Зима' }
      ],
      correct: ['sun', 'cloud', 'rain', 'snow'],
      sayCorrect: {
        sun: v('s7.sun', 'Солнечно! Светит солнышко, тепло!'),
        cloud: v('s7.cloud', 'Пасмурно! Серо и прохладно, но без дождя.'),
        rain: v('s7.rain', 'Дождь! Капает дождик, нужен зонт и сапожки.'),
        snow: v('s7.snow', 'Зима! Мороз и снег, надо утеплиться!')
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
      next: 'keys',
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
      next: 'keys',
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
      next: 'keys',
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
      adult: 'Скажи: «Мороз! Давай шапку. Покажи, где шапка?»',
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
      next: 'keys',
      completeVoice: v('w4.done', 'Я оделась! Ух, тепло!', 'Я оделся! Ух, тепло!'),
      doneText: 'Молодец! Ты оделась по погоде!',
      boyDoneText: 'Молодец! Ты оделся по погоде!'
    },

    /* 9. КЛЮЧИ И ТЕЛЕФОН */
    {
      id: 'keys',
      type: 'pick',
      scene: 'room',
      char: 'girlDressed',
      cols: 4,
      bubble: v('s9.intro', 'Надо взять ключи и телефон. Где ключи? Где телефон?'),
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
        keys: v('s9.keys', 'Ключи!'),
        phone: v('s9.phone', 'Телефон!')
      },
      hints: {
        keys: v('s9.hint.keys', 'Это не ключи. Нужны ключи.'),
        phone: v('s9.hint.phone', 'Это не телефон. Нужен телефон.')
      },
      bubbleByPending: {
        phone: v('s9.next.phone', 'Теперь телефон. Где телефон?')
      },
      completeVoice: v('s9.done', 'Ключи и телефон — со мной!'),
      doneText: 'Молодец! Ты взяла ключи и телефон!',
      boyDoneText: 'Молодец! Ты взял ключи и телефон!',
      next: 'leave'
    },

    /* 10. ВЫХОДИМ ИЗ ДОМА */
    {
      id: 'leave',
      type: 'pick',
      scene: 'hallway',
      char: 'girlDressed',
      cols: 2,
      bubble: v('s10.intro', 'Выходим из дома! Дверь закрываем, но на ключ не запираем — дома кто-то есть.'),
      adult: 'Скажи: «Выходим из дома. Покажи, где дверь.»',
      options: [
        { id: 'door', group: 'items', label: 'Выйти' },
        { id: 'home', group: 'items', label: 'Остаться' }
      ],
      correct: ['door'],
      sayCorrect: { door: v('s10.ok', 'Щёлк! Дверь закрыта!') },
      hint: v('s10.hint', 'Пора выходить, а то опоздаем в школу!'),
      completeVoice: v('s10.done', 'Дверь закрыта. Идём в школу!'),
      doneText: 'Молодец! Дверь закрыта!',
      next: 'transport'
    },

    /* 11. КАК ДОБРАТЬСЯ ДО ШКОЛЫ (ветвление) */
    {
      id: 'transport',
      type: 'pick',
      scene: 'street',
      char: 'girlDressed',
      cols: 2,
      single: true,
      bubble: v('s11.intro', 'Как доберёмся до школы — пешком или на автобусе?'),
      adult: 'Скажи: «Как дойдём до школы? Покажи пешехода (автобус).»',
      options: [
        { id: 'pedestrian', group: 'items', label: 'Пешком' },
        { id: 'bus', group: 'items', label: 'Автобус' }
      ],
      correct: ['pedestrian', 'bus'],
      sayCorrect: {
        pedestrian: v('s11.pedestrian', 'Пешком!'),
        bus: v('s11.bus', 'На автобусе!')
      },
      branch: { pedestrian: 'crosswalk', bus: 'bus1' },
      doneText: 'Хорошо! В путь!'
    },

    /* ===== ВЕТКА «ПЕШКОМ» ===== */
    {
      id: 'crosswalk',
      type: 'pick',
      scene: 'crosswalk',
      char: 'girlDressed',
      cols: 3,
      bubble: v('s12.intro', 'Вот дорога. Как перейдём?'),
      adult: 'Скажи: «Переходим дорогу. Покажи зелёный свет.»',
      options: [
        { id: 'greenLight', group: 'items', label: 'Зелёный' },
        { id: 'redLight', group: 'items', label: 'Красный' },
        { id: 'run', group: 'gestures', label: 'Бегом' }
      ],
      correct: ['greenLight'],
      sayCorrect: { greenLight: v('s12.ok', 'Смотрим налево, направо — идём!') },
      hint: v('s12.hint', 'Нельзя! Ждём зелёный свет!'),
      completeVoice: v('s12.done', 'Перешли дорогу по правилам!'),
      doneText: 'Молодец! Перешли дорогу!',
      next: 'friends'
    },

    /* ===== ВЕТКА «АВТОБУС» ===== */
    {
      id: 'bus1',
      type: 'pick',
      scene: 'busStop',
      char: 'girlDressed',
      cols: 3,
      bubble: v('s13a1.intro', 'Вот автобус! Что делаем?'),
      adult: 'Скажи: «Автобус приехал. Покажи, где дверь — заходи.»',
      options: [
        { id: 'door', group: 'items', label: 'Зайти' },
        { id: 'run', group: 'gestures', label: 'Бежать за автобусом' },
        { id: 'wait', group: 'gestures', label: 'Ждать следующий' }
      ],
      correct: ['door'],
      sayCorrect: { door: v('s13a1.ok', 'Заходим в автобус!') },
      hint: v('s13a1.hint', 'Нельзя бежать за автобусом — опасно!'),
      completeVoice: v('s13a1.done', 'Зашла в автобус.', 'Зашёл в автобус.'),
      doneText: 'Молодец! Ты вошла в автобус!',
      boyDoneText: 'Молодец! Ты вошёл в автобус!',
      next: 'bus2'
    },
    {
      id: 'bus2',
      type: 'pick',
      scene: 'bus',
      char: 'girlDressed',
      speaker: '🧑‍✈️ Кондуктор',
      cols: 3,
      single: true,
      bubble: v('s13a2.intro', 'Оплатите проезд, пожалуйста!'),
      adult: 'Скажи: «Надо оплатить проезд. Покажи, где карта.»',
      options: [
        { id: 'card', group: 'items', label: 'Карта' },
        { id: 'money', group: 'items', label: 'Деньги' },
        { id: 'run', group: 'gestures', label: 'Пройти так' }
      ],
      correct: ['card', 'money'],
      sayCorrect: {
        card: v('s13a2.card', 'Оплатила картой!', 'Оплатил картой!'),
        money: v('s13a2.money', 'Оплатила деньгами!', 'Оплатил деньгами!')
      },
      hint: v('s13a2.hint', 'Проезд надо оплатить!'),
      completeVoice: v('s13a2.done', 'Проезд оплачен!'),
      doneText: 'Молодец! Проезд оплачен!',
      next: 'bus3'
    },
    {
      id: 'bus3',
      type: 'pick',
      scene: 'bus',
      char: 'girlDressed',
      cols: 3,
      single: true,
      bubble: v('s13a3.intro', 'Есть свободное место. Что делаем?'),
      adult: 'Скажи: «Найди свободное место. Покажи, где сиденье.»',
      options: [
        { id: 'seat', group: 'items', label: 'Сесть' },
        { id: 'stand', group: 'gestures', label: 'Стоять' },
        { id: 'run', group: 'gestures', label: 'Бегать по салону' }
      ],
      correct: ['seat', 'stand'],
      sayCorrect: {
        seat: v('s13a3.seat', 'Села на место, держусь!', 'Сел на место, держусь!'),
        stand: v('s13a3.stand', 'Держусь за поручень!')
      },
      hint: v('s13a3.hint', 'В автобусе нельзя бегать — опасно!'),
      completeVoice: v('s13a3.done', 'Сижу, держусь за поручень!'),
      doneText: 'Молодец! Ты села и держишься!',
      boyDoneText: 'Молодец! Ты сел и держишься!',
      next: 'bus4'
    },
    {
      id: 'bus4',
      type: 'pick',
      scene: 'bus',
      char: 'girlDressed',
      speaker: '🔊 Объявление',
      cols: 3,
      bubble: v('s13a4.intro', 'Остановка „Школа"!'),
      adult: 'Скажи: «Наша остановка „Школа". Покажи, где дверь — выходи.»',
      options: [
        { id: 'door', group: 'items', label: 'Выйти' },
        { id: 'seat', group: 'items', label: 'Сидеть дальше' },
        { id: 'run', group: 'gestures', label: 'Бежать к двери' }
      ],
      correct: ['door'],
      sayCorrect: { door: v('s13a4.ok', 'Вышла на остановке „Школа"!', 'Вышел на остановке „Школа"!') },
      hint: v('s13a4.hint', 'Это наша остановка, надо выходить!'),
      completeVoice: v('s13a4.done', 'Я на остановке „Школа"!'),
      doneText: 'Молодец! Ты вышла на остановке!',
      boyDoneText: 'Молодец! Ты вышел на остановке!',
      next: 'friends'
    },

    /* 13. ШКОЛА — ВСТРЕЧА С ДРУЗЬЯМИ */
    {
      id: 'friends',
      type: 'pick',
      scene: 'schoolYard',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Петя',
      cols: 3,
      bubble: v('s13.intro', 'Привет! Ты пришла! Пойдём вместе в класс?', 'Привет! Ты пришёл! Пойдём вместе в класс?'),
      adult: 'Скажи: «Друзья тебя встретили. Что скажем? Покажи руку, которая машет.»',
      options: [
        { id: 'wave', group: 'gestures', label: 'Поздороваться' },
        { id: 'silence', group: 'gestures', label: 'Молчать' },
        { id: 'nod', group: 'gestures', label: 'Кивнуть' }
      ],
      correct: ['wave'],
      sayCorrect: { wave: v('s13.ok', 'Привет, Петя! Привет, Маша!') },
      hint: v('s13.hint', 'Друзья ждут приветствия! Поздоровайся.'),
      completeVoice: v('s13.done', 'Привет, друзья! Пойдём вместе!'),
      doneText: 'Молодец! Ты поздоровалась с друзьями!',
      boyDoneText: 'Молодец! Ты поздоровался с друзьями!',
      next: 'where'
    },

    /* 14. ШКОЛА — КУДА ИДЁМ */
    {
      id: 'where',
      type: 'pick',
      scene: 'schoolYard',
      char: 'girlDressed',
      cols: 4,
      bubble: v('s14.intro', 'Вот и школа! Куда идём?'),
      adult: 'Скажи: «Мы пришли в школу. Покажи, где вход.»',
      options: [
        { id: 'door', group: 'items', label: 'Вход' },
        { id: 'school', group: 'items', label: 'Класс' },
        { id: 'toilet', group: 'items', label: 'Туалет' },
        { id: 'canteen', group: 'items', label: 'Столовая' }
      ],
      correct: ['door'],
      sayCorrect: { door: v('s14.ok', 'Вход!') },
      hint: v('s14.hint', 'Нам надо в школу. Покажи вход.'),
      completeVoice: v('s14.done', 'Заходим в школу!'),
      doneText: 'Молодец! Ты нашла вход!',
      boyDoneText: 'Молодец! Ты нашёл вход!',
      next: 'teacher'
    },

    /* 15. ЗДРАВСТВУЙ, УЧИТЕЛЬ */
    {
      id: 'teacher',
      type: 'pick',
      scene: 'classroom',
      char: 'girlDressed',
      char2: 'teacher',
      speaker: '👩‍🏫 Учитель',
      cols: 3,
      bubble: v('s15.intro', 'Здравствуйте, дети!'),
      adult: 'Скажи: «Учитель говорит: здравствуйте! Покажи руку, которая машет.»',
      options: [
        { id: 'wave', group: 'gestures', label: 'Поздороваться' },
        { id: 'silence', group: 'gestures', label: 'Молчание' },
        { id: 'angry', group: 'gestures', label: 'Сердитое лицо' }
      ],
      correct: ['wave'],
      sayCorrect: { wave: v('s15.ok', 'Здравствуйте!') },
      hint: v('s15.hint', 'Нужно поздороваться с учителем.'),
      completeVoice: v('s15.done', 'Здравствуйте!'),
      doneText: 'Молодец! Ты поздоровалась с учителем!',
      boyDoneText: 'Молодец! Ты поздоровался с учителем!',
      next: 'desk'
    },

    /* 16. СЕСТЬ ЗА ПАРТУ */
    {
      id: 'desk',
      type: 'pick',
      scene: 'classroom',
      char: 'girlDressed',
      char2: 'teacher',
      speaker: '👩‍🏫 Учитель',
      cols: 3,
      bubble: v('s16.intro', 'Садитесь, пожалуйста.'),
      adult: 'Скажи: «Учитель говорит: садитесь. Покажи, где парта.»',
      options: [
        { id: 'desk', group: 'items', label: 'Сесть за парту' },
        { id: 'run', group: 'gestures', label: 'Бегать' },
        { id: 'talk', group: 'gestures', label: 'Кричать' }
      ],
      correct: ['desk'],
      sayCorrect: { desk: v('s16.ok', 'Сажусь за парту, спина ровно!') },
      hint: v('s16.hint', 'Надо сесть за парту.'),
      completeVoice: v('s16.done', 'Я за партой, готова учиться!', 'Я за партой, готов учиться!'),
      doneText: 'Молодец! Ты села за парту!',
      boyDoneText: 'Молодец! Ты сел за парту!',
      next: 'lesson'
    },

    /* 17. УРОК */
    {
      id: 'lesson',
      type: 'pick',
      scene: 'classroom',
      char: 'girlDressed',
      char2: 'teacher',
      speaker: '👩‍🏫 Учитель',
      cols: 3,
      bubble: v('s17.intro', 'Откройте учебник!'),
      adult: 'Скажи: «Учитель просит учебник. Покажи, где учебник?»',
      options: [
        { id: 'textbook', group: 'items', label: 'Учебник' },
        { id: 'toy', group: 'items', label: 'Игрушка' },
        { id: 'phone', group: 'items', label: 'Телефон' }
      ],
      correct: ['textbook'],
      sayCorrect: { textbook: v('s17.ok', 'Достаю учебник, открываю!') },
      hint: v('s17.hint', 'На уроке нужен учебник, а не игрушка.'),
      completeVoice: v('s17.done', 'Учебник открыт!'),
      doneText: 'Молодец! Учебник открыт!',
      next: 'break'
    },

    /* 18. ПЕРЕМЕНА */
    {
      id: 'break',
      type: 'pick',
      scene: 'corridor',
      char: 'girlDressed',
      cols: 3,
      bubble: v('s18.intro', 'Звонок! Перемена. Что будем делать?'),
      adult: 'Скажи: «Перемена. Что нужно сделать? Покажи, где туалет.»',
      adultByPending: {
        toilet: 'Скажи: «Перемена. Покажи, где туалет?»',
        water: 'Скажи: «Теперь вода. Покажи, где вода?»',
        apple: 'Скажи: «Теперь перекус. Покажи, где перекус?»'
      },
      options: [
        { id: 'toilet', group: 'items', label: 'Туалет' },
        { id: 'water', group: 'items', label: 'Вода' },
        { id: 'apple', group: 'items', label: 'Перекус' },
        { id: 'run', group: 'gestures', label: 'Бегать' },
        { id: 'talk', group: 'gestures', label: 'Кричать' }
      ],
      correct: ['toilet', 'water', 'apple'],
      sayCorrect: {
        toilet: v('s18.toilet', 'Туалет!'),
        water: v('s18.water', 'Вода!'),
        apple: v('s18.apple', 'Перекус!')
      },
      hints: {
        toilet: v('s18.hint.toilet', 'В школе по коридору не бегаем и не кричим.'),
        water: v('s18.hint.water', 'В школе по коридору не бегаем и не кричим.'),
        apple: v('s18.hint.apple', 'В школе по коридору не бегаем и не кричим.')
      },
      bubbleByPending: {
        water: v('s18.next.water', 'Что ещё? Вода! Где вода?'),
        apple: v('s18.next.apple', 'Что ещё? Перекус! Где перекус?')
      },
      completeVoice: v('s18.done', 'Молодец! На перемене надо успеть по делам.'),
      doneText: 'Молодец! Ты успела по делам!',
      boyDoneText: 'Молодец! Ты успел по делам!',
      next: 'game'
    },

    /* 18б. ПЕРЕМЕНА — ДРУЗЬЯ ЗОВУТ (ветвление) */
    {
      id: 'game',
      type: 'pick',
      scene: 'corridor',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Петя',
      cols: 3,
      single: true,
      bubble: v('s18b.intro', 'Ура, перемена! Пойдём поиграем? А Маша говорит: «А может, просто поболтаем?»'),
      adult: 'Скажи: «Друзья зовут на перемене. Давай поиграем и поболтаем. Покажи, где друзья вместе.»',
      options: [
        { id: 'play', group: 'gestures', label: 'Поиграть с Петей' },
        { id: 'talk', group: 'gestures', label: 'Поболтать с Машей' },
        { id: 'together', group: 'gestures', label: 'И то и другое' }
      ],
      correct: ['play', 'talk', 'together'],
      sayCorrect: {
        play: v('s18b.play', 'Давай поиграем!'),
        talk: v('s18b.talk', 'Давай поболтаем!'),
        together: v('s18b.together', 'Давайте и поиграем, и поболтаем!')
      },
      branch: { play: 'gameChoice', talk: 'talk', together: 'together' },
      doneText: 'Отлично! Перемена — время для друзей!'
    },

    /* 18в. ВЫБОР ИГРЫ (ветвление) */
    {
      id: 'gameChoice',
      type: 'pick',
      scene: 'corridor',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Петя',
      cols: 3,
      single: true,
      bubble: v('s18c.intro', 'А в какую игру играем?'),
      adult: 'Скажи: «Петя спрашивает, во что играем. Покажи, где крестики-нолики.»',
      options: [
        { id: 'ticTacToe', group: 'items', label: 'Крестики-нолики' },
        { id: 'sea', group: 'items', label: 'Море волнуется' },
        { id: 'riddle', group: 'items', label: 'Угадайка' }
      ],
      correct: ['ticTacToe', 'sea', 'riddle'],
      sayCorrect: {
        ticTacToe: v('s18c.ticTacToe', 'Крестики-нолики!'),
        sea: v('s18c.sea', 'Море волнуется раз!'),
        riddle: v('s18c.riddle', 'Угадайка!')
      },
      branch: { ticTacToe: 'ttt', sea: 'sea', riddle: 'guess1' },
      doneText: 'Отлично! Играем!'
    },

    /* ===== ИГРА «КРЕСТИКИ-НОЛИКИ» ===== */
    {
      id: 'ttt',
      type: 'pick',
      scene: 'corridor',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Петя',
      cols: 3,
      bubble: v('ttt.intro', 'Отлично! Я принёс поле для крестиков-ноликов. Ты — ❌ крестики, я — ⭕ нолики. Твой ход!'),
      adult: 'Скажи: «Играем в крестики-нолики. Поставь крестик в свободную клетку.»',
      options: [
        { id: 'ticTacToe', group: 'items', label: 'Поставить крестик' },
        { id: 'cross', group: 'gestures', label: 'Сдаться' },
        { id: 'wait', group: 'gestures', label: 'Ждать' }
      ],
      correct: ['ticTacToe'],
      sayCorrect: { ticTacToe: v('ttt.ok', 'Три крестика в ряд! Я выиграла!', 'Три крестика в ряд! Я выиграл!') },
      hint: v('ttt.hint', 'Поставь крестик в свободную клетку.'),
      completeVoice: v('ttt.done', 'Весело с Петей! Я выиграла в крестики-нолики!', 'Весело с Петей! Я выиграл в крестики-нолики!'),
      doneText: 'Молодец! Ты выиграла в крестики-нолики!',
      boyDoneText: 'Молодец! Ты выиграл в крестики-нолики!',
      next: 'final'
    },

    /* ===== ИГРА «МОРЕ ВОЛНУЕТСЯ РАЗ» ===== */
    {
      id: 'sea',
      type: 'pick',
      scene: 'corridor',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Петя',
      cols: 3,
      single: true,
      bubble: v('sea.intro', 'Давай в „Море волнуется раз"! Я веду! Море волнуется три — фигура замри!'),
      adult: 'Скажи: «Играем в „Море волнуется раз". Покажи фигуру.»',
      options: [
        { id: 'stand', group: 'gestures', label: 'Стоять ровно' },
        { id: 'squat', group: 'gestures', label: 'Присесть' },
        { id: 'handsUp', group: 'gestures', label: 'Руки вверх' }
      ],
      correct: ['stand', 'squat', 'handsUp'],
      sayCorrect: {
        stand: v('sea.stand', 'Стою ровно!'),
        squat: v('sea.squat', 'Присела!', 'Присел!'),
        handsUp: v('sea.handsUp', 'Руки вверх!')
      },
      completeVoice: v('sea.done', 'Здорово поиграли! Я умею замирать!'),
      doneText: 'Молодец! Ты играла в „Море волнуется раз"!',
      boyDoneText: 'Молодец! Ты играл в „Море волнуется раз"!',
      next: 'final'
    },

    /* ===== ИГРА «УГАДАЙКА» ===== */
    {
      id: 'guess1',
      type: 'pick',
      scene: 'corridor',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Петя',
      cols: 3,
      bubble: v('guess1.intro', 'Я загадаю, а ты отгадывай! Загадка первая: „Зимой и летом одним цветом". Что это?'),
      adult: 'Скажи: «Отгадай загадку. Покажи ёлку.»',
      options: [
        { id: 'tree', group: 'items', label: 'Ёлка' },
        { id: 'sun', group: 'items', label: 'Солнце' },
        { id: 'rainbow', group: 'items', label: 'Радуга' }
      ],
      correct: ['tree'],
      sayCorrect: { tree: v('guess1.ok', 'Правильно! Ёлка! Молодец!') },
      hint: v('guess1.hint', 'Подумай ещё! Подсказка: она зелёная.'),
      doneText: 'Правильно! Ёлка!',
      next: 'guess2'
    },
    {
      id: 'guess2',
      type: 'pick',
      scene: 'corridor',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Петя',
      cols: 3,
      bubble: v('guess2.intro', 'Загадка вторая: „Сто одёжек и все без застёжек". Что это?'),
      adult: 'Скажи: «Отгадай загадку. Покажи капусту.»',
      options: [
        { id: 'cabbage', group: 'items', label: 'Капуста' },
        { id: 'jacket', group: 'items', label: 'Куртка' },
        { id: 'socks', group: 'items', label: 'Носки' }
      ],
      correct: ['cabbage'],
      sayCorrect: { cabbage: v('guess2.ok', 'Точно! Капуста! Ты умница!') },
      hint: v('guess2.hint', 'Подумай ещё! Подсказка: она хрустит и растёт в огороде.'),
      doneText: 'Точно! Капуста!',
      next: 'guess3'
    },
    {
      id: 'guess3',
      type: 'pick',
      scene: 'corridor',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Петя',
      cols: 3,
      bubble: v('guess3.intro', 'Загадка третья: „Висит груша — нельзя скушать". Что это?'),
      adult: 'Скажи: «Отгадай загадку. Покажи лампочку.»',
      options: [
        { id: 'bulb', group: 'items', label: 'Лампочка' },
        { id: 'pear', group: 'items', label: 'Груша' },
        { id: 'balloon', group: 'items', label: 'Шарик' }
      ],
      correct: ['bulb'],
      sayCorrect: { bulb: v('guess3.ok', 'Правильно! Лампочка! Ты отгадала все загадки!', 'Правильно! Лампочка! Ты отгадал все загадки!') },
      hint: v('guess3.hint', 'Подумай ещё! Подсказка: она светит.'),
      completeVoice: v('guess3.done', 'Весело с Петей! Я отгадала все загадки!', 'Весело с Петей! Я отгадал все загадки!'),
      doneText: 'Молодец! Ты отгадала все загадки!',
      boyDoneText: 'Молодец! Ты отгадал все загадки!',
      next: 'final'
    },

    /* ===== ВЕТКА «ПОБОЛТАТЬ С МАШЕЙ» ===== */
    {
      id: 'talk',
      type: 'pick',
      scene: 'corridor',
      char: 'girlDressed',
      char2: 'friendGirl',
      speaker: '👧 Маша',
      cols: 3,
      single: true,
      bubble: v('talk.intro', 'Здорово! А что нового? А что тебе больше всего нравится в школе?'),
      adult: 'Скажи: «Маша спрашивает, что нравится в школе. Покажи, где друзья.»',
      options: [
        { id: 'textbook', group: 'items', label: 'Уроки' },
        { id: 'together', group: 'items', label: 'Друзья' },
        { id: 'apple', group: 'items', label: 'Перемена и столовая' }
      ],
      correct: ['textbook', 'together', 'apple'],
      sayCorrect: {
        textbook: v('talk.textbook', 'Уроки!'),
        together: v('talk.together', 'Друзья!'),
        apple: v('talk.apple', 'Перемена и столовая!')
      },
      completeVoice: v('talk.done', 'Мне нравится в школе! Спасибо, Маша!'),
      doneText: 'Молодец! Ты поговорила с Машей!',
      next: 'final'
    },

    /* ===== ВЕТКА «И ПОИГРАЕМ, И ПОБОЛТАЕМ» ===== */
    {
      id: 'together',
      type: 'pick',
      scene: 'corridor',
      char: 'girlDressed',
      char2: 'friendBoy',
      speaker: '🧒 Петя',
      cols: 3,
      bubble: v('together.intro', 'Ура! Тогда поиграем и поболтаем вместе!'),
      adult: 'Скажи: «Давай и поиграем, и поболтаем. Покажи, где друзья вместе.»',
      options: [
        { id: 'together', group: 'gestures', label: 'Вместе' },
        { id: 'play', group: 'gestures', label: 'Поиграть' },
        { id: 'talk', group: 'gestures', label: 'Поболтать' }
      ],
      correct: ['together'],
      sayCorrect: { together: v('together.ok', 'Давайте вместе!') },
      hint: v('together.hint', 'Давай и поиграем, и поболтаем!'),
      completeVoice: v('together.done', 'Мы и поиграли, и поболтали! Здорово!'),
      doneText: 'Молодец! Ты и поиграла, и поболтала с друзьями!',
      boyDoneText: 'Молодец! Ты и поиграл, и поболтал с друзьями!',
      next: 'final'
    },

    /* 19. ФИНАЛ */
    {
      id: 'final',
      type: 'info',
      scene: 'classroom',
      char: 'girl',
      final: true,
      nextLabel: 'Завершить',
      bubble: v('s19.final',
        'Ура! Я всё успела! Проснулась, заправила кровать, умылась, позавтракала, собрала рюкзак и пришла в школу! И даже поиграла с друзьями на перемене!',
        'Ура! Я всё успел! Проснулся, заправил кровать, умылся, позавтракал, собрал рюкзак и пришёл в школу! И даже поиграл с друзьями на перемене!'),
      adult: 'Скажи: «Молодец! Ты сегодня всё сделала сама! Умница!»',
      boyAdult: 'Скажи: «Молодец! Ты сегодня всё сделал сам! Умница!»'
    }
  ];

  window.SCENARIOS = window.SCENARIOS || {};
  window.SCENARIOS.school = {
    id: 'school',
    title: 'Школа',
    subtitle: 'Собираемся и идём в школу',
    thumbEmoji: '🏫',
    thumbChar: 'girl',
    totalSteps: 24,
    steps: steps
  };
})();
