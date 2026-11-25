/* Сценарий «Магазин» — 11 этапов по методичке */
(function () {
  // v(id, текст, текст_для_мальчика) — если есть третий аргумент, будет использован
  // вариант с мужским окончанием и отдельная озвучка <id>.boy
  function v(id, text, boyText) {
    return {
      id: 'shop.' + id,
      text: text,
      boyText: boyText || null,
      boyId: boyText ? 'shop.' + id + '.boy' : null
    };
  }

  const steps = [

    /* 1. ЧТО КУПИТЬ */
    {
      type: 'pick',
      scene: 'room',
      char: 'girl',
      cols: 3,
      bubble: v('s1.intro', 'Ой, дома нет еды! Надо сходить в магазин. Что купить?'),
      adult: 'Скажи: «Надо в магазин. Что купим? Давай хлеб. Покажи, где хлеб?»',
      adultByPending: {
        bread: 'Скажи: «Что купим? Давай хлеб. Покажи, где хлеб?»',
        milk: 'Скажи: «Что ещё? Давай молоко. Покажи, где молоко?»',
        apple: 'Скажи: «Что ещё? Давай яблоко. Покажи, где яблоко?»'
      },
      options: [
        { id: 'bread', group: 'items', label: 'Хлеб' },
        { id: 'milk', group: 'items', label: 'Молоко' },
        { id: 'apple', group: 'items', label: 'Яблоко' }
      ],
      correct: ['bread', 'milk', 'apple'],
      sayCorrect: {
        bread: v('s1.bread', 'Хлеб!'),
        milk: v('s1.milk', 'Молоко!'),
        apple: v('s1.apple', 'Яблоко!')
      },
      bubbleByPending: {
        milk: v('s1.next.milk', 'Что ещё купить? Молоко! Где молоко?'),
        apple: v('s1.next.apple', 'Что ещё? Яблоко! Где яблоко?')
      },
      completeVoice: v('s1.done', 'Всё! Список готов!'),
      doneText: 'Молодец! Мы купим хлеб, молоко и яблоко!'
    },

    /* 2. ПОГОДА */
    {
      type: 'info',
      scene: 'window',
      char: 'girl',
      nextLabel: 'Дальше',
      bubble: v('s2.weather', 'Смотри, какая погода! Сегодня прохладно. Надо одеться тепло.'),
      adult: 'Скажи: «Смотри, на улице прохладно. Надо одеться тепло. Нажми сюда.»'
    },

    /* 3. ОДЕТЬСЯ */
    {
      type: 'pick',
      scene: 'hallway',
      char: 'girl',
      cols: 3,
      bubble: v('s3.intro', 'Надо одеться. На улице прохладно. Что наденем?'),
      adult: 'Скажи: «На улице прохладно. Что наденем? Давай куртку. Покажи, где куртка?»',
      adultByPending: {
        jacket: 'Скажи: «На улице прохладно. Давай куртку. Покажи, где куртка?»',
        pants: 'Скажи: «Теперь штаны. Покажи, где штаны?»',
        boots: 'Скажи: «Теперь ботинки. Покажи, где ботинки?»'
      },
      options: [
        { id: 'jacket', group: 'items', label: 'Куртка' },
        { id: 'pants', group: 'items', label: 'Штаны' },
        { id: 'boots', group: 'items', label: 'Ботинки' },
        { id: 'shorts', group: 'items', label: 'Шорты' },
        { id: 'skirt', group: 'items', label: 'Юбка' }
      ],
      correct: ['jacket', 'pants', 'boots'],
      sayCorrect: {
        jacket: v('s3.jacket', 'Куртка!'),
        pants: v('s3.pants', 'Штаны!'),
        boots: v('s3.boots', 'Ботинки!')
      },
      hint: v('s3.hint', 'Холодно! Нужна тёплая одежда.'),
      bubbleByPending: {
        pants: v('s3.next.pants', 'Что ещё наденем?'),
        boots: v('s3.next.boots', 'Что ещё?')
      },
      completeVoice: v('s3.done', 'Я оделась! Легко и тепло!', 'Я оделся! Легко и тепло!'),
      doneText: 'Молодец! Ты оделась!',
      boyDoneText: 'Молодец! Ты оделся!'
    },

    /* 4. ВСЁ ГОТОВО КО ВЫХОДУ */
    {
      type: 'info',
      scene: 'hallway',
      char: 'girlDressed',
      nextLabel: 'Дальше',
      bubble: v('s4.ready', 'Я оделась! На улице прохладно, но мне тепло.',
                'Я оделся! На улице прохладно, но мне тепло.'),
      adult: 'Скажи: «Молодец! Ты оделась. Теперь возьмём деньги и ключи.»',
      boyAdult: 'Скажи: «Молодец! Ты оделся. Теперь возьмём деньги и ключи.»'
    },

    /* 5. ДЕНЬГИ И КЛЮЧИ */
    {
      type: 'pick',
      scene: 'hallway',
      char: 'girlDressed',
      cols: 4,
      bubble: v('s5.intro', 'Надо взять деньги и ключи, чтобы закрыть дом. Где деньги? Где ключи?'),
      adult: 'Скажи: «Надо взять деньги и ключи. Покажи, где деньги?»',
      adultByPending: {
        wallet: 'Скажи: «Надо взять деньги и ключи. Покажи, где деньги? Где кошелёк?»',
        keys: 'Скажи: «Теперь ключи. Покажи, где ключи?»'
      },
      options: [
        { id: 'wallet', group: 'items', label: 'Кошелёк' },
        { id: 'keys', group: 'items', label: 'Ключи' },
        { id: 'toy', group: 'items', label: 'Игрушка' },
        { id: 'umbrella', group: 'items', label: 'Зонт' }
      ],
      correct: ['wallet', 'keys'],
      sayCorrect: {
        wallet: v('s5.wallet', 'Деньги!'),
        keys: v('s5.keys', 'Ключи!')
      },
      hints: {
        wallet: v('s5.hint.wallet', 'Это не деньги. Нужен кошелёк.'),
        keys: v('s5.hint.keys', 'Это не ключи. Нужны ключи.')
      },
      bubbleByPending: {
        keys: v('s5.next.keys', 'Теперь ключи. Где ключи?')
      },
      completeVoice: v('s5.done', 'Я готова! Можно идти!', 'Я готов! Можно идти!'),
      doneText: 'Молодец! Ты взяла деньги и ключи!',
      boyDoneText: 'Молодец! Ты взял деньги и ключи!'
    },

    /* 6. КУДА ИДЁМ */
    {
      type: 'pick',
      scene: 'street',
      char: 'girlDressed',
      cols: 3,
      bubble: v('s6.intro', 'Куда нам идти? Мы собрались за продуктами.'),
      adult: 'Скажи: «Куда нам идти? Мы идём за продуктами. Покажи, где магазин?»',
      options: [
        { id: 'hospital', group: 'items', label: 'Больница' },
        { id: 'school', group: 'items', label: 'Школа' },
        { id: 'shop', group: 'items', label: 'Магазин' }
      ],
      correct: ['shop'],
      sayCorrect: { shop: v('s6.ok', 'Магазин!') },
      hint: v('s6.hint', 'Мы идём за продуктами. Нужен магазин.'),
      doneText: 'Молодец! Идём в магазин!'
    },

    /* 7. ТЕЛЕЖКА */
    {
      type: 'pick',
      scene: 'shopEntrance',
      char: 'girlDressed',
      cols: 3,
      bubble: v('s7.intro', 'Надо взять тележку. Где тележка?'),
      adult: 'Скажи: «Надо взять тележку. Покажи, где тележка?»',
      options: [
        { id: 'cart', group: 'items', label: 'Тележка' },
        { id: 'basket', group: 'items', label: 'Корзина' },
        { id: 'bag', group: 'items', label: 'Сумка' }
      ],
      correct: ['cart'],
      sayCorrect: { cart: v('s7.ok', 'Тележка!') },
      hint: v('s7.hint', 'Это не тележка. Нужна тележка.'),
      doneText: 'Молодец! Тележка!'
    },

    /* 8. ПОИСК ПРОДУКТОВ НА ПОЛКЕ */
    {
      type: 'pick',
      scene: 'shopHall',
      char: null,
      shelf: true,
      cols: 3,
      bubble: v('s8.intro', 'Где мой список? Давай вспомним, что нужно купить. Хлеб! Где хлеб?'),
      adult: 'Скажи: «Хлеб! Где хлеб? Покажи, где хлеб?»',
      adultByPending: {
        bread: 'Скажи: «Хлеб! Где хлеб? Покажи, где хлеб?»',
        milk: 'Скажи: «Теперь молоко. Покажи, где молоко?»',
        apple: 'Скажи: «Теперь яблоко. Покажи, где яблоко?»'
      },
      options: [
        { id: 'bread', group: 'items', label: 'Хлеб' },
        { id: 'milk', group: 'items', label: 'Молоко' },
        { id: 'apple', group: 'items', label: 'Яблоко' },
        { id: 'candy', group: 'items', label: 'Конфеты' },
        { id: 'toy', group: 'items', label: 'Игрушка' },
        { id: 'juice', group: 'items', label: 'Сок' }
      ],
      correct: ['bread', 'milk', 'apple'],
      sayCorrect: {
        bread: v('s8.bread', 'Хлеб!'),
        milk: v('s8.milk', 'Молоко!'),
        apple: v('s8.apple', 'Яблоко!')
      },
      hints: {
        bread: v('s8.hint.bread', 'Это не хлеб. Нам нужен хлеб.'),
        milk: v('s8.hint.milk', 'Это не молоко. Нам нужно молоко.'),
        apple: v('s8.hint.apple', 'Это не яблоко. Нам нужно яблоко.')
      },
      bubbleByPending: {
        milk: v('s8.next.milk', 'Что ещё? Молоко! Где молоко?'),
        apple: v('s8.next.apple', 'Что ещё? Яблоко! Где яблоко?')
      },
      completeVoice: v('s8.done', 'Всё взяли! Отправляемся на кассу!'),
      doneText: 'Молодец! Мы взяли хлеб, молоко и яблоко!'
    },

    /* 9. К КАССЕ */
    {
      type: 'info',
      scene: 'shopHall',
      char: 'girlDressed',
      nextLabel: 'Дальше',
      bubble: v('s9.tocash', 'Мы всё взяли! Отправляемся на кассу!'),
      adult: 'Скажи: «Молодец! Идём на кассу. Нажми сюда.»'
    },

    /* 10. ЗДРАВСТВУЙТЕ */
    {
      type: 'pick',
      scene: 'cashier',
      char: 'girlDressed',
      char2: 'cashier',
      cols: 3,
      speaker: '🧑‍💼 Кассир',
      bubble: v('s10.greet', 'Здравствуйте!'),
      adult: 'Скажи: «Кассир говорит: здравствуйте! Что скажем? Давай поздороваемся. Покажи, где рука машет.»',
      options: [
        { id: 'wave', group: 'gestures', label: 'Поздороваться' },
        { id: 'silence', group: 'gestures', label: 'Молчание' },
        { id: 'angry', group: 'gestures', label: 'Сердитое лицо' }
      ],
      correct: ['wave'],
      sayCorrect: { wave: v('s10.ok', 'Здравствуйте!') },
      hint: v('s10.hint', 'Нужно поздороваться.'),
      doneText: 'Молодец! Ты поздоровалась!',
      boyDoneText: 'Молодец! Ты поздоровался!'
    },

    /* 11. ПАКЕТ */
    {
      type: 'pick',
      scene: 'cashier',
      char: 'girlDressed',
      char2: 'cashier',
      cols: 3,
      speaker: '🧑‍💼 Кассир',
      bubble: v('s11.bag', 'Пакет нужен?'),
      adult: 'Скажи: «Кассир спрашивает: пакет нужен? Покажи галочку — да.»',
      options: [
        { id: 'check', group: 'gestures', label: 'Да' },
        { id: 'cross', group: 'gestures', label: 'Нет' },
        { id: 'silence', group: 'gestures', label: 'Молчание' }
      ],
      correct: ['check'],
      sayCorrect: { check: v('s11.ok', 'Да, пакет мне нужен!') },
      hint: v('s11.hint', 'Скажи: да, пакет мне нужен.'),
      doneText: 'Молодец! Ты сказала да!',
      boyDoneText: 'Молодец! Ты сказал да!'
    },

    /* 12. СКЛАДЫВАЕМ ПРОДУКТЫ (drag & drop) */
    {
      type: 'drag',
      scene: 'cashier',
      char: 'girlDressed',
      char2: 'cashier',
      speaker: '🧑‍💼 Кассир',
      bubble: v('s12.pack', 'Складывайте продукты в пакет.'),
      adult: 'Скажи: «Давай сложим продукты в пакет. Перетащи хлеб в пакет. Потом молоко и яблоко.»',
      dragHint: 'Перетащи продукты в пакет (или нажми на продукт, потом на пакет)',
      items: ['bread', 'milk', 'apple'],
      target: 'packet',
      completeVoice: v('s12.done', 'Молодец! Всё сложили!'),
      doneText: 'Молодец! Всё сложили!'
    },

    /* 13. ОПЛАТА */
    {
      type: 'pick',
      scene: 'cashier',
      char: 'girlDressed',
      char2: 'cashier',
      cols: 3,
      speaker: '🧑‍💼 Кассир',
      bubble: v('s13.pay', 'С вас сто рублей.'),
      adult: 'Скажи: «Кассир говорит: с вас сто рублей. Надо заплатить. Покажи, где рука даёт деньги?»',
      options: [
        { id: 'pay', group: 'gestures', label: 'Заплатить' },
        { id: 'run', group: 'gestures', label: 'Убежать' },
        { id: 'stand', group: 'gestures', label: 'Стоять' }
      ],
      correct: ['pay'],
      sayCorrect: { pay: v('s13.ok', 'Заплатила!', 'Заплатил!') },
      hint: v('s13.hint', 'Нужно заплатить.'),
      doneText: 'Молодец! Ты заплатила!',
      boyDoneText: 'Молодец! Ты заплатил!'
    },

    /* 14. ПРОЩАНИЕ */
    {
      type: 'pick',
      scene: 'cashier',
      char: 'girlDressed',
      char2: 'cashier',
      cols: 3,
      speaker: '🧑‍💼 Кассир',
      bubble: v('s14.bye', 'Спасибо за покупку! До свидания!'),
      adult: 'Скажи: «Кассир говорит: до свидания! Давай попрощаемся. Покажи, где рука машет.»',
      options: [
        { id: 'wave', group: 'gestures', label: 'Помахать' },
        { id: 'silence', group: 'gestures', label: 'Молчание' },
        { id: 'run', group: 'gestures', label: 'Убежать' }
      ],
      correct: ['wave'],
      sayCorrect: { wave: v('s14.ok', 'До свидания!') },
      hint: v('s14.hint', 'Нужно попрощаться.'),
      doneText: 'Молодец! Ты попрощалась!',
      boyDoneText: 'Молодец! Ты попрощался!'
    },

    /* 15. ДОМОЙ */
    {
      type: 'pick',
      scene: 'street',
      char: 'girlDressed',
      cols: 3,
      bubble: v('s15.intro', 'Мы всё купили! Куда нам идти?'),
      adult: 'Скажи: «Куда нам идти? Мы идём домой. Покажи, где дом?»',
      options: [
        { id: 'home', group: 'items', label: 'Дом' },
        { id: 'school', group: 'items', label: 'Школа' },
        { id: 'hospital', group: 'items', label: 'Больница' }
      ],
      correct: ['home'],
      sayCorrect: { home: v('s15.ok', 'Дом!') },
      hint: v('s15.hint', 'Мы идём домой. Нужен дом.'),
      doneText: 'Молодец! Мы пришли домой!'
    },

    /* 16. ФИНАЛ */
    {
      type: 'info',
      scene: 'room',
      char: 'girl',
      final: true,
      nextLabel: 'Завершить',
      bubble: v('s16.final', 'Молодец! Ты сходила в магазин! Ура!',
                'Молодец! Ты сходил в магазин! Ура!'),
      adult: 'Скажи: «Молодец! Ты сходила в магазин! Ты купила хлеб, молоко и яблоко! Умница!»',
      boyAdult: 'Скажи: «Молодец! Ты сходил в магазин! Ты купил хлеб, молоко и яблоко! Умница!»'
    }
  ];

  window.SCENARIOS = window.SCENARIOS || {};
  window.SCENARIOS.shop = {
    id: 'shop',
    title: 'Магазин',
    subtitle: 'Сходим за продуктами',
    thumbEmoji: '🛒',
    thumbChar: 'girl',
    steps: steps
  };
})();
