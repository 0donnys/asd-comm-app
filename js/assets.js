/* Каталог изображений. Пока картинки не сгенерированы — показываем эмодзи. */
window.ASSETS = (function () {
  const scenes = {
    room:        { file: 'bg-room.svg',          emoji: '🛋️', label: 'Комната' },
    window:      { file: 'bg-window.svg',        emoji: '🪟', label: 'Окно' },
    hallway:     { file: 'bg-hallway.svg',       emoji: '🚪', label: 'Прихожая' },
    street:      { file: 'bg-street.svg',        emoji: '🏙️', label: 'Улица' },
    shopEntrance:{ file: 'bg-shop-entrance.svg', emoji: '🛒', label: 'Вход в магазин' },
    shopHall:    { file: 'bg-shop-hall.svg',     emoji: '🏬', label: 'Торговый зал' },
    cashier:     { file: 'bg-cashier.svg',       emoji: '🧾', label: 'Касса' },
    kitchen:     { file: 'bg-kitchen.svg',       emoji: '🍳', label: 'Кухня' },
    bedroom:     { file: 'bg-bedroom.svg',       emoji: '🛏️', label: 'Спальня' },
    bathroom:    { file: 'bg-bathroom.svg',      emoji: '🛁', label: 'Ванная' },
    entrance:    { file: 'bg-entrance.svg',      emoji: '🛗', label: 'Подъезд' },
    playground:  { file: 'bg-playground.svg',    emoji: '🛝', label: 'Площадка' },
    busStop:     { file: 'bg-bus-stop.svg',      emoji: '🚏', label: 'Остановка' },
    bus:         { file: 'bg-bus.svg',           emoji: '🚌', label: 'Автобус' },
    crosswalk:   { file: 'bg-crosswalk.svg',     emoji: '🚦', label: 'Переход' },
    schoolYard:  { file: 'bg-school-yard.svg',   emoji: '🏫', label: 'Школьный двор' },
    classroom:   { file: 'bg-classroom.svg',     emoji: '📚', label: 'Класс' },
    corridor:    { file: 'bg-corridor.svg',      emoji: '🚪', label: 'Коридор' }
  };

  const chars = {
    girl:        { file: 'char-girl.svg',        emoji: '👧' },
    girlDressed: { file: 'char-girl-dressed.svg', emoji: '🧥' },
    boy:         { file: 'char-boy.svg',         emoji: '👦' },
    boyDressed:  { file: 'char-boy-dressed.svg',  emoji: '🧥' },
    cashier:     { file: 'char-cashier.svg',     emoji: '🧑‍💼' },
    friendBoy:   { file: 'char-friend-boy.svg',  emoji: '🧒' },
    friendGirl:  { file: 'char-friend-girl.svg', emoji: '👧' },
    mom:         { file: 'char-mom.svg',         emoji: '👩' },
    teacher:     { file: 'char-teacher.svg',     emoji: '👩‍🏫' }
  };

  const items = {
    bread:   { file: 'item-bread.svg',   emoji: '🍞', label: 'Хлеб' },
    milk:    { file: 'item-milk.svg',    emoji: '🥛', label: 'Молоко' },
    apple:   { file: 'item-apple.svg',   emoji: '🍎', label: 'Яблоко' },
    candy:   { file: 'item-candy.svg',   emoji: '🍬', label: 'Конфеты' },
    toy:     { file: 'item-toy.svg',     emoji: '🧸', label: 'Игрушка' },
    juice:   { file: 'item-juice.svg',   emoji: '🥤', label: 'Сок' },
    jacket:  { file: 'item-jacket.svg',  emoji: '🧥', label: 'Куртка' },
    pants:   { file: 'item-pants.svg',   emoji: '👖', label: 'Штаны' },
    boots:   { file: 'item-boots.svg',   emoji: '👟', label: 'Ботинки' },
    shorts:  { file: 'item-shorts.svg',  emoji: '🩳', label: 'Шорты' },
    skirt:   { file: 'item-skirt.svg',   emoji: '👗', label: 'Юбка' },
    wallet:  { file: 'item-wallet.svg',  emoji: '👛', label: 'Кошелёк' },
    keys:    { file: 'item-keys.svg',    emoji: '🔑', label: 'Ключи' },
    umbrella:{ file: 'item-umbrella.svg',emoji: '☂️', label: 'Зонт' },
    cart:    { file: 'item-cart.svg',    emoji: '🛒', label: 'Тележка' },
    basket:  { file: 'item-basket.svg',  emoji: '🧺', label: 'Корзина' },
    bag:     { file: 'item-bag.svg',     emoji: '👝', label: 'Сумка' },
    packet:  { file: 'item-packet.svg',  emoji: '🛍️', label: 'Пакет' },
    money:   { file: 'item-money.svg',   emoji: '💰', label: 'Деньги' },
    card:    { file: 'item-card.svg',    emoji: '💳', label: 'Карта' },
    shop:    { file: 'item-shop.svg',    emoji: '🏪', label: 'Магазин' },
    school:  { file: 'item-school.svg',  emoji: '🏫', label: 'Школа' },
    hospital:{ file: 'item-hospital.svg',emoji: '🏥', label: 'Больница' },
    home:    { file: 'item-home.svg',    emoji: '🏠', label: 'Дом' },

    /* --- кухня и готовка --- */
    sandwich:{ file: 'item-sandwich.svg', emoji: '🥪', label: 'Бутерброд' },
    salad:   { file: 'item-salad.svg',    emoji: '🥗', label: 'Салат' },
    cupcakes:{ file: 'item-cupcakes.svg', emoji: '🧁', label: 'Кексы' },
    butter:  { file: 'item-butter.svg',   emoji: '🧈', label: 'Масло' },
    cheese:  { file: 'item-cheese.svg',   emoji: '🧀', label: 'Сыр' },
    sausage: { file: 'item-sausage.svg',  emoji: '🥓', label: 'Колбаса' },
    cucumber:{ file: 'item-cucumber.svg', emoji: '🥒', label: 'Огурец' },
    tomato:  { file: 'item-tomato.svg',   emoji: '🍅', label: 'Помидор' },
    onion:   { file: 'item-onion.svg',    emoji: '🧅', label: 'Лук' },
    flour:   { file: 'item-flour.svg',    emoji: '🌾', label: 'Мука' },
    sugar:   { file: 'item-sugar.svg',    emoji: '🍬', label: 'Сахар' },
    egg:     { file: 'item-egg.svg',      emoji: '🥚', label: 'Яйцо' },
    board:   { file: 'item-board.svg',    emoji: '🪵', label: 'Доска' },
    knife:   { file: 'item-knife.svg',    emoji: '🔪', label: 'Нож' },
    plate:   { file: 'item-plate.svg',    emoji: '🍽️', label: 'Тарелка' },
    bowl:    { file: 'item-bowl.svg',     emoji: '🥣', label: 'Миска' },
    spoon:   { file: 'item-spoon.svg',    emoji: '🥄', label: 'Ложка' },
    molds:   { file: 'item-molds.svg',    emoji: '🧁', label: 'Формочки' },
    oven:    { file: 'item-oven.svg',     emoji: '🔥', label: 'Духовка' },
    fridge:  { file: 'item-fridge.svg',   emoji: '🧊', label: 'Холодильник' },

    /* --- одежда и сборы --- */
    tshirt:      { file: 'item-tshirt.svg',       emoji: '👕', label: 'Футболка' },
    cap:         { file: 'item-cap.svg',          emoji: '🧢', label: 'Кепка' },
    sweater:     { file: 'item-sweater.svg',      emoji: '🧶', label: 'Кофта' },
    jeans:       { file: 'item-jeans.svg',        emoji: '👖', label: 'Джинсы' },
    raincoat:    { file: 'item-raincoat.svg',     emoji: '🧥', label: 'Плащ' },
    winterJacket:{ file: 'item-winterJacket.svg',emoji: '🧥', label: 'Тёплая куртка' },
    scarf:       { file: 'item-scarf.svg',        emoji: '🧣', label: 'Шарф' },
    mittens:     { file: 'item-mittens.svg',      emoji: '🧤', label: 'Варежки' },
    hat:         { file: 'item-hat.svg',          emoji: '🎩', label: 'Шапка' },

    /* --- дом и безопасность --- */
    light:   { file: 'item-light.svg',   emoji: '💡', label: 'Свет' },
    water:   { file: 'item-water.svg',   emoji: '💧', label: 'Вода' },
    gas:     { file: 'item-gas.svg',     emoji: '🔥', label: 'Газ' },
    socket:  { file: 'item-socket.svg',  emoji: '🔌', label: 'Розетки' },
    phone:   { file: 'item-phone.svg',   emoji: '📱', label: 'Телефон' },

    /* --- подъезд и площадка --- */
    elevator:{ file: 'item-elevator.svg', emoji: '🛗', label: 'Лифт' },
    stairs:  { file: 'item-stairs.svg',   emoji: '🪜', label: 'Ступеньки' },
    swing:   { file: 'item-swing.svg',    emoji: '⛓️', label: 'Качели' },
    carousel:{ file: 'item-carousel.svg', emoji: '🎠', label: 'Карусели' },
    sandbox: { file: 'item-sandbox.svg',  emoji: '🏖️', label: 'Песочница' },
    slide:   { file: 'item-slide.svg',    emoji: '🛝', label: 'Горка' },

    /* --- школа --- */
    alarm:     { file: 'item-alarm.svg',      emoji: '⏰', label: 'Будильник' },
    blanket:   { file: 'item-blanket.svg',    emoji: '🛏️', label: 'Одеяло' },
    pillow:    { file: 'item-pillow.svg',     emoji: '🧸', label: 'Подушка' },
    cover:     { file: 'item-cover.svg',      emoji: '🟫', label: 'Покрывало' },
    tap:       { file: 'item-tap.svg',        emoji: '🚰', label: 'Кран' },
    soap:      { file: 'item-soap.svg',       emoji: '🧼', label: 'Мыло' },
    towel:     { file: 'item-towel.svg',      emoji: '🧻', label: 'Полотенце' },
    porridge:  { file: 'item-porridge.svg',   emoji: '🥣', label: 'Каша' },
    soda:      { file: 'item-soda.svg',       emoji: '🥤', label: 'Газировка' },
    textbook:  { file: 'item-textbook.svg',   emoji: '📚', label: 'Учебник' },
    notebook:  { file: 'item-notebook.svg',   emoji: '📓', label: 'Тетрадь' },
    pencilCase:{ file: 'item-pencilCase.svg',emoji: '✏️', label: 'Пенал' },
    game:      { file: 'item-game.svg',       emoji: '🎮', label: 'Игра' },
    backpack:  { file: 'item-backpack.svg',   emoji: '🎒', label: 'Рюкзак' },
    sun:       { file: 'item-sun.svg',        emoji: '☀️', label: 'Солнечно' },
    cloud:     { file: 'item-cloud.svg',      emoji: '☁️', label: 'Пасмурно' },
    rain:      { file: 'item-rain.svg',       emoji: '🌧️', label: 'Дождь' },
    snow:      { file: 'item-snow.svg',       emoji: '❄️', label: 'Зима' },
    pedestrian:{ file: 'item-pedestrian.svg', emoji: '🚶', label: 'Пешком' },
    bus:       { file: 'item-bus.svg',        emoji: '🚌', label: 'Автобус' },
    greenLight:{ file: 'item-greenLight.svg',emoji: '🟢', label: 'Зелёный' },
    redLight:  { file: 'item-redLight.svg',  emoji: '🔴', label: 'Красный' },
    desk:      { file: 'item-desk.svg',       emoji: '🪑', label: 'Парта' },
    toilet:    { file: 'item-toilet.svg',     emoji: '🚻', label: 'Туалет' },
    canteen:   { file: 'item-canteen.svg',    emoji: '🍽️', label: 'Столовая' },
    door:      { file: 'item-door.svg',       emoji: '🚪', label: 'Дверь' },
    play:      { file: 'item-play.svg',       emoji: '🧩', label: 'Поиграть' },
    talk:      { file: 'item-talk.svg',       emoji: '💬', label: 'Поболтать' },
    together:  { file: 'item-together.svg',   emoji: '🤝', label: 'Вместе' },
    bed:       { file: 'item-bed.svg',        emoji: '🛏️', label: 'Кровать' },

    /* --- транспорт и игры --- */
    seat:      { file: 'item-seat.svg',       emoji: '🪑', label: 'Сиденье' },
    ticTacToe: { file: 'item-ticTacToe.svg',emoji: '❌', label: 'Крестики-нолики' },
    sea:       { file: 'item-sea.svg',        emoji: '🌊', label: 'Море волнуется' },
    riddle:    { file: 'item-riddle.svg',     emoji: '❓', label: 'Угадайка' },
    tree:      { file: 'item-tree.svg',       emoji: '🎄', label: 'Ёлка' },
    rainbow:   { file: 'item-rainbow.svg',    emoji: '🌈', label: 'Радуга' },
    cabbage:   { file: 'item-cabbage.svg',    emoji: '🥬', label: 'Капуста' },
    socks:     { file: 'item-socks.svg',      emoji: '🧦', label: 'Носки' },
    bulb:      { file: 'item-bulb.svg',       emoji: '💡', label: 'Лампочка' },
    pear:      { file: 'item-pear.svg',       emoji: '🍐', label: 'Груша' },
    balloon:   { file: 'item-balloon.svg',    emoji: '🎈', label: 'Шарик' }
  };

  const gestures = {
    wave:       { file: 'gest-wave.svg',        emoji: '👋', label: 'Поздороваться' },
    silence:    { file: 'gest-silence.svg',     emoji: '🤐', label: 'Молчание' },
    angry:      { file: 'gest-angry.svg',       emoji: '😠', label: 'Сердитое лицо' },
    check:      { file: 'gest-check.svg',       emoji: '✅', label: 'Да' },
    cross:      { file: 'gest-cross.svg',       emoji: '❌', label: 'Нет' },
    pay:        { file: 'gest-pay.svg',         emoji: '🤲', label: 'Заплатить' },
    run:        { file: 'gest-run.svg',         emoji: '🏃', label: 'Убежать' },
    stand:      { file: 'gest-stand.svg',       emoji: '🧍', label: 'Стоять' },
    nod:        { file: 'gest-nod.svg',         emoji: '🙂', label: 'Кивнуть' },
    wait:       { file: 'gest-wait.svg',        emoji: '⏳', label: 'Подожду' },
    play:       { file: 'gest-play.svg',        emoji: '🧩', label: 'Поиграть' },
    talk:       { file: 'gest-talk.svg',        emoji: '💬', label: 'Поболтать' },
    together:   { file: 'gest-together.svg',    emoji: '🤝', label: 'Вместе' },
    give:       { file: 'gest-give.svg',        emoji: '🍽️', label: 'Пожалуйста' },
    squat:      { file: 'gest-squat.svg',       emoji: '🐸', label: 'Присесть' },
    handsUp:    { file: 'gest-handsUp.svg',     emoji: '🙌', label: 'Руки вверх' }
  };

  const all = { scenes, chars, items, gestures };

  function path(category, key) {
    const entry = all[category] && all[category][key];
    return entry ? 'assets/img/' + entry.file : '';
  }

  function info(category, key) {
    return (all[category] && all[category][key]) || { emoji: '❔', label: key };
  }

  return { scenes, chars, items, gestures, path, info };
})();
