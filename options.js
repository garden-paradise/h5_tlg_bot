module.exports = {
  shopOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: '🗂 Все вкусы', callback_data: '/catalogTaste' },
          { text: '🏷 По одиночке', callback_data: '/catalogOne' },
        ],
        [
          {
            text: '📜 Меню',
            callback_data: '/menu',
          },
        ],
      ],
    }),
  },
  mainOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: '📜 Меню',
            callback_data: '/menu',
          },
          { text: '🚀 Магазин', callback_data: '/shop' },
        ],
      ],
    }),
  },
  referralOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: '📥 Получить код',
            callback_data: '/get_code',
          },
          {
            text: '📤 Ввести код',
            switch_inline_query_current_chat: '/referral ',
          },
        ],
        [
          {
            text: '📜 Меню',
            callback_data: '/menu',
          },
          { text: '🚀 Магазин', callback_data: '/shop' },
        ],
      ],
    }),
  },
  dillerOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: '🖋 Заново',
            callback_data: '/dealer',
          },
          { text: '📨 Отправить', callback_data: '/buy' },
        ],
      ],
    }),
  },
  arrangeOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: '🖋 Заново',
            callback_data: '/dealer',
          },
          { text: '🛍 Заказать', callback_data: '/order' },
        ],
      ],
    }),
  },
  menuOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: '🚀 Магазин', callback_data: '/shop' }],
        [{ text: '🎁 Акции', callback_data: '/bonuses' }],
        [{ text: '🛒 Корзина', callback_data: '/basket' }],
        [{ text: '⚡️ Дистрибьюция', callback_data: '/dealer' }],
        [{ text: '👥 Реферальная система', callback_data: '/referral' }],
        [{ text: '💬 Поддержка', callback_data: '/support' }],
      ],
    }),
  },
  supportOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'H5 Site',
            url: 'https://h5russia.com/home',
          },
          { text: 'Instagram', url: 'https://www.instagram.com/h5russia/' },
        ],
        [
          {
            text: 'H5 Addres',
            url: 'https://yandex.ru/maps/213/moscow/house/presnenskaya_naberezhnaya_6s2/Z04YcwNgS0ECQFtvfXt1eX1kbQ==/?ll=37.540246%2C55.748179&z=16',
          },
          {
            text: 'Задать вопрос',
            url: 'https://instagram.com/h5russia?utm_medium=copy_link',
          },
        ],
        [
          {
            text: '📜 Меню',
            callback_data: '/menu',
          },
          { text: '🚀 Магазин', callback_data: '/shop' },
        ],
      ],
    }),
  },
  productOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: '⬅️ ', callback_data: '/left' },
          { text: '➖', callback_data: '/icrement' },
          { text: '➕', callback_data: '/dicrement' },
          { text: '➡️', callback_data: '/right' },
        ],
        [
          { text: '📌 Добавить', callback_data: '/addBasket' },
          { text: '🛒 Корзина', callback_data: '/basket' },
        ],
        [
          { text: '🗂 Все вкусы', callback_data: '/catalogTaste' },
          {
            text: '📜 Меню',
            callback_data: '/menu',
          },
        ],
      ],
    }),
  },
};

//
