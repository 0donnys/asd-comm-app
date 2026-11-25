/* Сценарий «Друг» — в гости приходит Миша, вместе готовим угощение */
(function () {
  // v(id, текст, текст_для_мальчика)
  function v(id, text, boyText) {
    return {
      id: 'friend.' + id,
      text: text,
      boyText: boyText || null,
      boyId: boyText ? 'friend.' + id + '.boy' : null
    };
  }

  const steps = [

    /* 1. ЗВОНОК В ДВЕРЬ */
    {
      id: 'door',
      type: 'pick',
      scene: 'room',
      char: 'girl',
      cols: 2,
      bubble: v('s1.intro', 'Ой! Кто-то пришёл! Это же мой друг Миша! Я звал его в гости. Открыть дверь?'),
      adult: 'Скажи: «Миша пришёл. Надо открыть дверь. Нажми на руку, которая открывает дверь».',
      options: [
        { id: 'door', group: 'items', label: 'Открыть' },
        { id: 'cross', group: 'gestures', label: 'Не открывать' }
      ],
      correct: ['door'],
      sayCorrect: { door: v('s1.ok', 'Открываю дверь!') },
      hint: v('s1.hint', 'Миша ждёт. Надо открыть дверь.'),
      completeVoice: v('s1.done', 'Привет, Миша! Заходи!'),
      doneText: 'Молодец! Ты открыла дверь!',
      boyDoneText: 'Молодец! Ты открыл дверь!'
    },

    /* 2. ПРИВЕТСТВИЕ */
    {
      id: 'hello',
      type: 'pick',
      scene: 'hallway',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      cols: 3,
      bubble: v('s2.intro', 'Привет!'),
      adult: 'Скажи: «Миша говорит: привет! Надо поздороваться. Нажми на руку, которая машет».',
      options: [
        { id: 'wave', group: 'gestures', label: 'Поздороваться' },
        { id: 'silence', group: 'gestures', label: 'Молчание' },
        { id: 'angry', group: 'gestures', label: 'Сердитое лицо' }
      ],
      correct: ['wave'],
      sayCorrect: { wave: v('s2.ok', 'Привет! Я так рад тебя видеть!') },
      hint: v('s2.hint', 'Надо поздороваться. Нажми на руку, которая машет.'),
      completeVoice: v('s2.done', 'Привет, Миша! Проходи!'),
      doneText: 'Молодец! Ты поздоровалась!',
      boyDoneText: 'Молодец! Ты поздоровался!'
    },

    /* 3. МИША ГОЛОДНЫЙ */
    {
      id: 'hungry',
      type: 'pick',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      cols: 2,
      bubble: v('s3.intro', 'Я проголодался. Давай приготовим покушать?'),
      adult: 'Скажи: «Миша говорит, что проголодался. Давай приготовим покушать. Нажми на галочку».',
      options: [
        { id: 'check', group: 'gestures', label: 'Да' },
        { id: 'cross', group: 'gestures', label: 'Нет' }
      ],
      correct: ['check'],
      sayCorrect: { check: v('s3.ok', 'Да! Ура! Что приготовим?') },
      hint: v('s3.hint', 'Миша голодный. Надо приготовить. Нажми на галочку.'),
      doneText: 'Молодец! Ты сказала да!',
      boyDoneText: 'Молодец! Ты сказал да!'
    },

    /* 4. ЧТО ПРИГОТОВИМ? (ветвление) */
    {
      id: 'dish',
      type: 'pick',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      cols: 3,
      single: true,
      bubble: v('s4.intro', 'Что приготовим?'),
      adult: 'Скажи: «Миша спрашивает, что приготовим. Что ты хочешь приготовить? Нажми на картинку».',
      options: [
        { id: 'sandwich', group: 'items', label: 'Бутерброд' },
        { id: 'salad', group: 'items', label: 'Салат' },
        { id: 'cupcakes', group: 'items', label: 'Кексы' }
      ],
      correct: ['sandwich', 'salad', 'cupcakes'],
      sayCorrect: {
        sandwich: v('s4.sandwich', 'Бутерброд!'),
        salad: v('s4.salad', 'Салат!'),
        cupcakes: v('s4.cupcakes', 'Кексы!')
      },
      branch: { sandwich: 'a1', salad: 'b1', cupcakes: 'c1' },
      doneText: 'Отлично! Будем готовить вместе!'
    },

    /* ===== ВЕТКА «БУТЕРБРОД» ===== */
    {
      id: 'a1',
      type: 'info',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      nextLabel: 'Дальше',
      next: 'a2',
      bubble: v('a1.list', 'Для бутерброда нам понадобится: хлеб, масло, сыр и колбаса. Вот наш список.'),
      adult: 'Скажи: «Для бутерброда нужны хлеб, масло, сыр и колбаса. Теперь найдём продукты».'
    },
    {
      id: 'a2',
      type: 'pick',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      shelf: true,
      cols: 3,
      bubble: v('a2.intro', 'Найдём продукты. Где хлеб?'),
      adult: 'Скажи: «Найдём хлеб. Покажи, где хлеб?»',
      adultByPending: {
        bread: 'Скажи: «Найдём хлеб. Покажи, где хлеб?»',
        butter: 'Скажи: «Теперь масло. Покажи, где масло?»',
        cheese: 'Скажи: «Теперь сыр. Покажи, где сыр?»',
        sausage: 'Скажи: «Теперь колбаса. Покажи, где колбаса?»'
      },
      options: [
        { id: 'bread', group: 'items', label: 'Хлеб' },
        { id: 'butter', group: 'items', label: 'Масло' },
        { id: 'cheese', group: 'items', label: 'Сыр' },
        { id: 'sausage', group: 'items', label: 'Колбаса' },
        { id: 'candy', group: 'items', label: 'Конфеты' },
        { id: 'juice', group: 'items', label: 'Сок' }
      ],
      correct: ['bread', 'butter', 'cheese', 'sausage'],
      sayCorrect: {
        bread: v('a2.bread', 'Хлеб!'),
        butter: v('a2.butter', 'Масло!'),
        cheese: v('a2.cheese', 'Сыр!'),
        sausage: v('a2.sausage', 'Колбаса!')
      },
      hints: {
        bread: v('a2.hint.bread', 'Нам это не нужно. Нам нужен хлеб.'),
        butter: v('a2.hint.butter', 'Нам это не нужно. Нам нужно масло.'),
        cheese: v('a2.hint.cheese', 'Нам это не нужно. Нам нужен сыр.'),
        sausage: v('a2.hint.sausage', 'Нам это не нужно. Нам нужна колбаса.')
      },
      bubbleByPending: {
        butter: v('a2.next.butter', 'Что ещё? Масло! Где масло?'),
        cheese: v('a2.next.cheese', 'Что ещё? Сыр! Где сыр?'),
        sausage: v('a2.next.sausage', 'Что ещё? Колбаса! Где колбаса?')
      },
      doneText: 'Молодец! Все продукты на столе!'
    },
    {
      id: 'a3',
      type: 'pick',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      cols: 3,
      bubble: v('a3.intro', 'Подготовим всё для готовки. Где доска?'),
      adult: 'Скажи: «Для бутерброда нужны доска, нож и тарелка. Покажи, где доска?»',
      adultByPending: {
        board: 'Скажи: «Возьми доску. Покажи, где доска?»',
        knife: 'Скажи: «Теперь нож. Покажи, где нож?»',
        plate: 'Скажи: «Теперь тарелка. Покажи, где тарелка?»'
      },
      options: [
        { id: 'board', group: 'items', label: 'Доска' },
        { id: 'knife', group: 'items', label: 'Нож' },
        { id: 'plate', group: 'items', label: 'Тарелка' },
        { id: 'bowl', group: 'items', label: 'Миска' },
        { id: 'spoon', group: 'items', label: 'Ложка' },
        { id: 'molds', group: 'items', label: 'Формочки' }
      ],
      correct: ['board', 'knife', 'plate'],
      sayCorrect: {
        board: v('a3.board', 'Доска!'),
        knife: v('a3.knife', 'Нож!'),
        plate: v('a3.plate', 'Тарелка!')
      },
      hints: {
        board: v('a3.hint.board', 'Нам это не нужно. Нам нужна доска.'),
        knife: v('a3.hint.knife', 'Нам это не нужно. Нам нужен нож.'),
        plate: v('a3.hint.plate', 'Нам это не нужно. Нам нужна тарелка.')
      },
      bubbleByPending: {
        knife: v('a3.next.knife', 'Теперь возьми нож. Где нож?'),
        plate: v('a3.next.plate', 'Теперь возьми тарелку. Где тарелка?')
      },
      doneText: 'Молодец! Всё готово!'
    },
    {
      id: 'a4',
      type: 'drag',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      next: 'cooked',
      bubble: v('a4.intro', 'Готовим бутерброд. Положи продукты на тарелку.'),
      adult: 'Скажи: «Сложи продукты на тарелку: хлеб, масло, сыр и колбасу».',
      dragHint: 'Перетащи продукты на тарелку (или нажми на продукт, потом на тарелку)',
      items: ['bread', 'butter', 'cheese', 'sausage'],
      target: 'plate',
      sayCorrect: { bread: v('a4.bread', 'Хлеб!'), butter: v('a4.butter', 'Масло!'), cheese: v('a4.cheese', 'Сыр!'), sausage: v('a4.sausage', 'Колбаса!') },
      completeVoice: v('a4.done', 'Молодец! Бутерброд готов!'),
      doneText: 'Молодец! Бутерброд готов!'
    },

    /* ===== ВЕТКА «САЛАТ» ===== */
    {
      id: 'b1',
      type: 'info',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      nextLabel: 'Дальше',
      next: 'b2',
      bubble: v('b1.list', 'Для салата нам понадобится: огурец, помидор, лук и масло. Вот наш список.'),
      adult: 'Скажи: «Для салата нужны огурец, помидор, лук и масло. Теперь найдём продукты».'
    },
    {
      id: 'b2',
      type: 'pick',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      shelf: true,
      cols: 3,
      bubble: v('b2.intro', 'Найдём продукты. Где огурец?'),
      adult: 'Скажи: «Найдём огурец. Покажи, где огурец?»',
      adultByPending: {
        cucumber: 'Скажи: «Найдём огурец. Покажи, где огурец?»',
        tomato: 'Скажи: «Теперь помидор. Покажи, где помидор?»',
        onion: 'Скажи: «Теперь лук. Покажи, где лук?»',
        butter: 'Скажи: «Теперь масло. Покажи, где масло?»'
      },
      options: [
        { id: 'cucumber', group: 'items', label: 'Огурец' },
        { id: 'tomato', group: 'items', label: 'Помидор' },
        { id: 'onion', group: 'items', label: 'Лук' },
        { id: 'butter', group: 'items', label: 'Масло' },
        { id: 'candy', group: 'items', label: 'Конфеты' },
        { id: 'juice', group: 'items', label: 'Сок' }
      ],
      correct: ['cucumber', 'tomato', 'onion', 'butter'],
      sayCorrect: {
        cucumber: v('b2.cucumber', 'Огурец!'),
        tomato: v('b2.tomato', 'Помидор!'),
        onion: v('b2.onion', 'Лук!'),
        butter: v('b2.butter', 'Масло!')
      },
      hints: {
        cucumber: v('b2.hint.cucumber', 'Нам это не нужно. Нам нужен огурец.'),
        tomato: v('b2.hint.tomato', 'Нам это не нужно. Нам нужен помидор.'),
        onion: v('b2.hint.onion', 'Нам это не нужно. Нам нужен лук.'),
        butter: v('b2.hint.butter', 'Нам это не нужно. Нам нужно масло.')
      },
      bubbleByPending: {
        tomato: v('b2.next.tomato', 'Что ещё? Помидор! Где помидор?'),
        onion: v('b2.next.onion', 'Что ещё? Лук! Где лук?'),
        butter: v('b2.next.butter', 'Что ещё? Масло! Где масло?')
      },
      doneText: 'Молодец! Все продукты на столе!'
    },
    {
      id: 'b3',
      type: 'pick',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      cols: 3,
      bubble: v('b3.intro', 'Подготовим всё для готовки. Где доска?'),
      adult: 'Скажи: «Для салата нужны доска, нож, миска и ложка. Покажи, где доска?»',
      adultByPending: {
        board: 'Скажи: «Возьми доску. Покажи, где доска?»',
        knife: 'Скажи: «Теперь нож. Покажи, где нож?»',
        bowl: 'Скажи: «Теперь миска. Покажи, где миска?»',
        spoon: 'Скажи: «Теперь ложка. Покажи, где ложка?»'
      },
      options: [
        { id: 'board', group: 'items', label: 'Доска' },
        { id: 'knife', group: 'items', label: 'Нож' },
        { id: 'bowl', group: 'items', label: 'Миска' },
        { id: 'spoon', group: 'items', label: 'Ложка' },
        { id: 'plate', group: 'items', label: 'Тарелка' },
        { id: 'molds', group: 'items', label: 'Формочки' }
      ],
      correct: ['board', 'knife', 'bowl', 'spoon'],
      sayCorrect: {
        board: v('b3.board', 'Доска!'),
        knife: v('b3.knife', 'Нож!'),
        bowl: v('b3.bowl', 'Миска!'),
        spoon: v('b3.spoon', 'Ложка!')
      },
      hints: {
        board: v('b3.hint.board', 'Нам это не нужно. Нам нужна доска.'),
        knife: v('b3.hint.knife', 'Нам это не нужно. Нам нужен нож.'),
        bowl: v('b3.hint.bowl', 'Нам это не нужно. Нам нужна миска.'),
        spoon: v('b3.hint.spoon', 'Нам это не нужно. Нам нужна ложка.')
      },
      bubbleByPending: {
        knife: v('b3.next.knife', 'Теперь возьми нож. Где нож?'),
        bowl: v('b3.next.bowl', 'Теперь возьми миску. Где миска?'),
        spoon: v('b3.next.spoon', 'Теперь возьми ложку. Где ложка?')
      },
      doneText: 'Молодец! Всё готово!'
    },
    {
      id: 'b4',
      type: 'drag',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      next: 'cooked',
      bubble: v('b4.intro', 'Готовим салат. Сложи продукты в миску.'),
      adult: 'Скажи: «Сложи продукты в миску: огурец, помидор, лук и масло».',
      dragHint: 'Перетащи продукты в миску (или нажми на продукт, потом на миску)',
      items: ['cucumber', 'tomato', 'onion', 'butter'],
      target: 'bowl',
      sayCorrect: { cucumber: v('b4.cucumber', 'Огурец!'), tomato: v('b4.tomato', 'Помидор!'), onion: v('b4.onion', 'Лук!'), butter: v('b4.butter', 'Масло!') },
      completeVoice: v('b4.done', 'Молодец! Салат готов!'),
      doneText: 'Молодец! Салат готов!'
    },

    /* ===== ВЕТКА «КЕКСЫ» ===== */
    {
      id: 'c1',
      type: 'info',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      nextLabel: 'Дальше',
      next: 'c2',
      bubble: v('c1.list', 'Для кексов нам понадобится: мука, сахар, яйцо и молоко. Вот наш список.'),
      adult: 'Скажи: «Для кексов нужны мука, сахар, яйцо и молоко. Теперь найдём продукты».'
    },
    {
      id: 'c2',
      type: 'pick',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      shelf: true,
      cols: 3,
      bubble: v('c2.intro', 'Найдём продукты. Где мука?'),
      adult: 'Скажи: «Найдём муку. Покажи, где мука?»',
      adultByPending: {
        flour: 'Скажи: «Найдём муку. Покажи, где мука?»',
        sugar: 'Скажи: «Теперь сахар. Покажи, где сахар?»',
        egg: 'Скажи: «Теперь яйцо. Покажи, где яйцо?»',
        milk: 'Скажи: «Теперь молоко. Покажи, где молоко?»'
      },
      options: [
        { id: 'flour', group: 'items', label: 'Мука' },
        { id: 'sugar', group: 'items', label: 'Сахар' },
        { id: 'egg', group: 'items', label: 'Яйцо' },
        { id: 'milk', group: 'items', label: 'Молоко' },
        { id: 'candy', group: 'items', label: 'Конфеты' },
        { id: 'juice', group: 'items', label: 'Сок' }
      ],
      correct: ['flour', 'sugar', 'egg', 'milk'],
      sayCorrect: {
        flour: v('c2.flour', 'Мука!'),
        sugar: v('c2.sugar', 'Сахар!'),
        egg: v('c2.egg', 'Яйцо!'),
        milk: v('c2.milk', 'Молоко!')
      },
      hints: {
        flour: v('c2.hint.flour', 'Нам это не нужно. Нам нужна мука.'),
        sugar: v('c2.hint.sugar', 'Нам это не нужно. Нам нужен сахар.'),
        egg: v('c2.hint.egg', 'Нам это не нужно. Нам нужно яйцо.'),
        milk: v('c2.hint.milk', 'Нам это не нужно. Нам нужно молоко.')
      },
      bubbleByPending: {
        sugar: v('c2.next.sugar', 'Что ещё? Сахар! Где сахар?'),
        egg: v('c2.next.egg', 'Что ещё? Яйцо! Где яйцо?'),
        milk: v('c2.next.milk', 'Что ещё? Молоко! Где молоко?')
      },
      doneText: 'Молодец! Все продукты на столе!'
    },
    {
      id: 'c3',
      type: 'pick',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      cols: 3,
      bubble: v('c3.intro', 'Подготовим всё для готовки. Где миска?'),
      adult: 'Скажи: «Для кексов нужны миска, ложка и формочки. Покажи, где миска?»',
      adultByPending: {
        bowl: 'Скажи: «Возьми миску. Покажи, где миска?»',
        spoon: 'Скажи: «Теперь ложка. Покажи, где ложка?»',
        molds: 'Скажи: «Теперь формочки. Покажи, где формочки?»'
      },
      options: [
        { id: 'bowl', group: 'items', label: 'Миска' },
        { id: 'spoon', group: 'items', label: 'Ложка' },
        { id: 'molds', group: 'items', label: 'Формочки' },
        { id: 'board', group: 'items', label: 'Доска' },
        { id: 'knife', group: 'items', label: 'Нож' },
        { id: 'plate', group: 'items', label: 'Тарелка' }
      ],
      correct: ['bowl', 'spoon', 'molds'],
      sayCorrect: {
        bowl: v('c3.bowl', 'Миска!'),
        spoon: v('c3.spoon', 'Ложка!'),
        molds: v('c3.molds', 'Формочки!')
      },
      hints: {
        bowl: v('c3.hint.bowl', 'Нам это не нужно. Нам нужна миска.'),
        spoon: v('c3.hint.spoon', 'Нам это не нужно. Нам нужна ложка.'),
        molds: v('c3.hint.molds', 'Нам это не нужно. Нам нужны формочки.')
      },
      bubbleByPending: {
        spoon: v('c3.next.spoon', 'Теперь возьми ложку. Где ложка?'),
        molds: v('c3.next.molds', 'Теперь возьми формочки. Где формочки?')
      },
      doneText: 'Молодец! Всё готово!'
    },
    {
      id: 'c4',
      type: 'drag',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      next: 'cooked',
      bubble: v('c4.intro', 'Готовим кексы. Сложи продукты в миску.'),
      adult: 'Скажи: «Сложи продукты в миску: муку, сахар, яйцо и молоко».',
      dragHint: 'Перетащи продукты в миску (или нажми на продукт, потом на миску)',
      items: ['flour', 'sugar', 'egg', 'milk'],
      target: 'bowl',
      sayCorrect: { flour: v('c4.flour', 'Мука!'), sugar: v('c4.sugar', 'Сахар!'), egg: v('c4.egg', 'Яйцо!'), milk: v('c4.milk', 'Молоко!') },
      completeVoice: v('c4.done', 'Молодец! Кексы готовы!'),
      doneText: 'Молодец! Кексы готовы!'
    },

    /* 10. ВСЁ ГОТОВО */
    {
      id: 'cooked',
      type: 'info',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      nextLabel: 'Дальше',
      next: 'offer',
      bubble: v('s10.done', 'Мы всё приготовили! Молодец!'),
      adult: 'Скажи: «Мы всё приготовили! Молодец! Теперь угостим Мишу».'
    },

    /* 11. УГОЩАЕМ ДРУГА */
    {
      id: 'offer',
      type: 'pick',
      scene: 'kitchen',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      cols: 3,
      bubble: v('s11.intro', 'Спасибо! Очень вкусно!'),
      adult: 'Скажи: «Миша говорит: спасибо! Надо сказать пожалуйста».',
      options: [
        { id: 'give', group: 'gestures', label: 'Пожалуйста' },
        { id: 'silence', group: 'gestures', label: 'Молчание' },
        { id: 'angry', group: 'gestures', label: 'Сердитое лицо' }
      ],
      correct: ['give'],
      sayCorrect: { give: v('s11.ok', 'Пожалуйста! Очень вкусно!') },
      hint: v('s11.hint', 'Надо сказать пожалуйста.'),
      doneText: 'Молодец! Ты сказала пожалуйста!',
      boyDoneText: 'Молодец! Ты сказал пожалуйста!'
    },

    /* 12. ДРУГ УХОДИТ */
    {
      id: 'bye',
      type: 'pick',
      scene: 'hallway',
      char: 'girl',
      char2: 'friendBoy',
      speaker: '🧒 Миша',
      cols: 3,
      bubble: v('s12.intro', 'Спасибо! Мне пора домой. До свидания!'),
      adult: 'Скажи: «Миша говорит: до свидания! Надо попрощаться. Нажми на руку, которая машет».',
      options: [
        { id: 'wave', group: 'gestures', label: 'Попрощаться' },
        { id: 'silence', group: 'gestures', label: 'Молчание' },
        { id: 'run', group: 'gestures', label: 'Убежать' }
      ],
      correct: ['wave'],
      sayCorrect: { wave: v('s12.ok', 'До свидания, Миша!') },
      hint: v('s12.hint', 'Надо попрощаться. Нажми на руку, которая машет.'),
      doneText: 'Молодец! Ты попрощалась!',
      boyDoneText: 'Молодец! Ты попрощался!'
    },

    /* 13. ФИНАЛ */
    {
      id: 'final',
      type: 'info',
      scene: 'room',
      char: 'girl',
      final: true,
      nextLabel: 'Завершить',
      bubble: v('s13.final', 'Мы приготовили и угостили Мишу! Молодец!',
                'Мы приготовили и угостили Мишу! Молодец!'),
      adult: 'Скажи: «Молодец! Ты приготовила и угостила друга! Умница!»',
      boyAdult: 'Скажи: «Молодец! Ты приготовил и угостил друга! Умница!»'
    }
  ];

  window.SCENARIOS = window.SCENARIOS || {};
  window.SCENARIOS.friend = {
    id: 'friend',
    title: 'Друг',
    subtitle: 'Готовим угощение для Миши',
    thumbEmoji: '🧸',
    thumbChar: 'girl',
    totalSteps: 12,
    steps: steps
  };
})();
