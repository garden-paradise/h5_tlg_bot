process.env.NTBA_FIX_319 = 1;
const TelegramApi = require('node-telegram-bot-api');
const {
  menuOptions,
  supportOptions,
  mainOptions,
  productOptions,
  dillerOptions,
  arrangeOptions,
  shopOptions,
  referralOptions,
} = require('./options');
const mongoose = require('mongoose');
const Product = require('./api/models/product');
const UserData = require('./api/models/userData');
const sendEmail = require('./mail');
const { getUserPromocode } = require('./utils/utils');

// mongoose.connect(
//   'mongodb+srv://cryptmine:cryptadmin461@h5.nntpg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

const token = '7033734328:AAEHwNuW074mQ-azEZskRQG9OXCFtw_W4rs'; 
const bot = new TelegramApi(token, { polling: true });
let numberItem = 0;
let productsLength;
let count = 1;
let basket = [];
let product = null;
let changeInputText = true;
let dataForm = {};
let closeOnText = false;
let myOrder = null;
let myCheck = null;
let showMyOrder = false;
let itog = null;

let setProduct = (chatId, operation) => {
  if (operation === 'plus')
    (numberItem < productsLength ? numberItem++ : (numberItem = 0)) &&
      (count = 1);
  if (operation === 'minus')
    (numberItem > 0 ? numberItem-- : (numberItem = productsLength)) &&
      (count = 1);

  Product.find()
    .select('name price taste productImage')
    .exec()
    .then((docs) => {
      const response = docs.map((doc) => {
        return {
          name: doc.name,
          price: doc.price,
          taste: doc.taste,
          productImage: doc.productImage,
        };
      });
      productsLength = response.length - 1;
      product = { ...response[numberItem], count };
      bot.sendPhoto(
        chatId,
        `https://h5russia.ew.r.appspot.com/images/productImagesTelegram/${response[numberItem].productImage}`,
        {
          caption: `<b>H5 ${response[numberItem].name}</b> \n\n 💎 Вкус: <b>${
            response[numberItem].taste
          }</b> \n 🔥 Цена: <b>${response[numberItem].price} руб.</b> \n\n ${
            count >= 1 ? `⚡️ Количество: <b>${count} шт.</b>` : ``
          } \n ${
            count >= 1
              ? `💵 Итог: <b>${response[numberItem].price * count} руб.</b>`
              : ``
          }`,
          parse_mode: 'HTML',
          ...productOptions,
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
};
let catalogTaste = (chatId) => {
  Product.find()
    .select('name price taste productImage')
    .exec()
    .then((docs) => {
      const response = docs.map((doc) => {
        return {
          name: doc.name,
          price: doc.price,
          taste: doc.taste,
          productImage: doc.productImage,
        };
      });
      bot.sendMessage(chatId, '<b>🎁  H5 Store Каталог</b>\n\nВсе вкусы', {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
          inline_keyboard: [
            ...response.map((item, i) => {
              return [
                {
                  text: `${item.taste}`,
                  callback_data: `/taste${i}`,
                },
              ];
            }),
            [
              { text: '🏷 По одиночке', callback_data: '/catalogOne' },
              {
                text: '📜 Меню',
                callback_data: '/menu',
              },
            ],
          ],
        }),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
let icrement = (chatId, operation, messageId) => {
  count > 1 && count--;
  return setProduct(chatId, operation, messageId);
};
let dicrement = (chatId, operation, messageId) => {
  count++;
  return setProduct(chatId, operation, messageId);
};
let myBasket = (chatId, messageId) => {
  let totalCount =
    basket.length > 0 &&
    basket
      .map((product) => product.count)
      .reduce((total, amount) => total + amount);
  let totalPrice =
    basket.length > 0 &&
    basket
      .map((product) => product.count * product.price)
      .reduce((total, amount) => total + amount);
  myCheck = totalPrice;
  let productItems = basket.map((product) => {
    return `<b>H5 ${product.name}</b> \n\n 💎 Вкус: <b>${
      product.taste
    }</b> \n 🔥 Цена: <b>${product.price} руб.</b> \n\n ${
      count >= 1 ? `⚡️ Количество: <b>${product.count} шт.</b>` : ``
    } \n ${
      count >= 1 ? `💵 Итог: <b>${product.price * product.count} руб.</b>` : ``
    }`.replace(/\n/g, '');
  });

  myOrder = productItems.map((item, i) => `\n ${i + 1}. 🔹 ${item}`);

  itog = `\n\n<i>Итог:</i>\nКол-во: <b>${totalCount} шт.</b>\nСумма: <b>${totalPrice} руб.</b>`;

  bot.sendMessage(
    chatId,
    `'<b>🛒  H5 Store Корзина</b>\n\n<b>Ваш заказ:</b>\n${
      productItems.length > 0
        ? `${productItems.map(
            (item, i) => `\n ${i + 1}. 🔹 ${item}`
          )}\n\n<i>Итог:</i>\nКол-во: <b>${totalCount} шт.</b>\nСумма: <b>${totalPrice} руб.</b>\n\n<b>*</b> <i>Чтобы удалить товар, нажмите на его номер</i>`
        : '\nКорзина пуста'
    } `,
    {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          basket.map((item, i) => {
            return {
              text: `${i + 1}`,
              callback_data: `/delete${i + 1}`,
            };
          }),
          basket.length > 0
            ? [{ text: '📝 Оформить заказ', callback_data: '/arrange' }]
            : [],
          [
            {
              text: '📜 Меню',
              callback_data: '/menu',
            },
            { text: '🚀 Магазин', callback_data: '/shop' },
          ],
        ],
      }),
    }
  );
};
let menu = async (chatId) => {
  await bot.sendSticker(
    chatId,
    'CAACAgIAAxkBAAEDrydh4Z9ienL04VgVmpScho8xiyZ4JQACchUAApQ4EUuWJcDeP9RGciME'
  );
  return bot.sendMessage(chatId, '<b> H5 Store </b>', {
    parse_mode: 'HTML',
    ...menuOptions,
  });
};
let support = (chatId) => {
  bot.sendMessage(chatId, '<b>💬  H5 Store Поддержка </b>', {
    parse_mode: 'HTML',
    ...supportOptions,
  });
};
let dealer = async (msg, chatId) => {
  await bot.sendMessage(
    chatId,
    '<b>💼  H5 Store Дистрибьюция \n\n</b>Чтобы стать дистрибьютером, оставьте свои контактные данные.',
    {
      parse_mode: 'HTML',
      ...mainOptions,
    }
  );
  changeInputText = false;
  closeOnText = true;
  bot.sendMessage(chatId, '<b>👤  Ваше имя: \n\n</b>', {
    parse_mode: 'HTML',
  });
};
let arrange = async (msg, chatId) => {
  await bot.sendMessage(
    chatId,
    '<b>💼  H5 Store Оформить заказ \n\n</b>Чтобы оформить заказ, оставьте свои контактные данные.',
    {
      parse_mode: 'HTML',
      ...mainOptions,
    }
  );
  changeInputText = false;
  closeOnText = true;
  showMyOrder = true;
  bot.sendMessage(chatId, '<b>👤  Ваше имя: \n\n</b>', {
    parse_mode: 'HTML',
  });
};
let buy = (msg, chatId, title) => {
  bot.answerCallbackQuery(msg.id, {
    text: 'Ваш запрос отправлен. Ожидайте звонка!',
    show_alert: true,
  });
  menu(chatId);
  changeInputText = true;
  sendEmail(
    title,
    dataForm.name,
    dataForm.phone,
    dataForm.mail,
    !!dataForm.addres && dataForm.addres,
    !!dataForm.product && dataForm.product,
    !!dataForm.check && dataForm.check
  );
  dataForm = {};
  closeOnText = false;
};
let bonuses = (chatId) => {
  bot.sendMessage(
    chatId,
    '<b>🎁  H5 Store Акции</b>\n\nАктуальная информация о наших акциях и скидках!',
    {
      parse_mode: 'HTML',
      ...mainOptions,
    }
  );
};
let store = (chatId) => {
  bot.sendMessage(
    chatId,
    '<b>🚀  H5 Store Каталог</b>\n\nВыберите способ отображения продукции.',
    {
      parse_mode: 'HTML',
      ...shopOptions,
    }
  );
  changeInputText = true;
  closeOnText = false;
};
let getCode = async (chatId, userId) => {
  let user = await UserData.findOne({ userId: userId });
  if (user === null) {
    user = new UserData({
      userId: userId,
      ref_code: getUserPromocode(),
    });
    user.save();
  }
  await bot.sendMessage(
    chatId,
    `<b>🚀  H5 Store Реферальная система</b>\n\nВаш реферальный код:\n\n <b>${user.ref_code}</b>`,
    {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              text: '👤 Отправить код другу',
              switch_inline_query: `Реферальный код: ${user.ref_code}`,
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
    }
  );
};
let enterCode = async (chatId, userId) => {
  bot.sendMessage(
    chatId,
    '<b>🚀  H5 Store Реферальная система</b>\n\nВведите реферальный код: ',
    {
      parse_mode: 'HTML',
    }
  );
};
let referral = (chatId) => {
  bot.sendMessage(
    chatId,
    '<b>🎁  H5 Store Реферальная система</b>\n\nПриведи друга и получи скидки!',
    {
      parse_mode: 'HTML',
      ...referralOptions,
    }
  );
};

const start = () => {
  bot.setMyCommands([
    { command: '/menu', description: 'Меню' },
    { command: '/shop', description: 'Магазин' },
    { command: '/basket', description: 'Корзина' },
    { command: '/bonuses', description: 'Акции' },
    { command: '/dealer', description: 'Дистрибьюция' },
    { command: '/referral', description: 'Реферальная система' },
    { command: '/support', description: 'Поддержка' },
  ]);

  bot.onText(/\@H5TESTbot (.+)/, async (msg, match) => {
    let userId = msg.from.id;
    let chatId = msg.chat.id;
    let refCode = match[1].split(' ')[1];
    // closeOnText && ()
    let owner = await UserData.findOne({
      ref_code: refCode,
      userId: { $ne: userId },
    });
    if (owner === null) {
      bot.sendMessage(
        chatId,
        '<b>🚀  H5 Store Реферальная система</b>\n\nВы ввели неверный код ',
        {
          parse_mode: 'HTML',
        }
      );
    } else {
      let guest = await UserData.findOne({
        userId: userId,
      });
      if (guest !== null) {
        guest.invite_ref_code = refCode;
        guest.save();
        bot.sendMessage(
          chatId,
          '<b>🚀  H5 Store Реферальная система</b>\n\nРеферальная ссылка активирована ',
          {
            parse_mode: 'HTML',
          }
        );
      } else {
        bot.sendMessage(
          chatId,
          '<b>🚀  H5 Store Реферальная система</b>\n\nОшибка сервера. Повторите позже ',
          {
            parse_mode: 'HTML',
          }
        );
      }
    }
  });

  bot.onText(/^[а-яА-ЯёЁa-zA-Z]+$/, (msg) => {
    const chatId = msg.chat.id;
    closeOnText &&
      bot.sendMessage(chatId, '<b>📞  Ваш телефон:</b>', {
        parse_mode: 'HTML',
      }) &&
      (dataForm.name = msg.text);
  });
  bot.onText(/^((8|\+7)[\-]?)?(\(?\d{3}\)?[\-]?)?[\d\-]{7,10}$/, (msg) => {
    const chatId = msg.chat.id;
    closeOnText &&
      bot.sendMessage(chatId, '<b>💌  Ваша почта:</b>', {
        parse_mode: 'HTML',
      }) &&
      (dataForm.phone = msg.text);
  });
  bot.onText(
    /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
    (msg) => {
      const chatId = msg.chat.id;
      let reply_markup = showMyOrder ? arrangeOptions : dillerOptions;
      closeOnText &&
        (dataForm.mail = msg.text) &&
        bot.sendMessage(
          chatId,
          `<b>Ваши данные:</b>\n\n👤  <b>Имя:</b>  ${
            dataForm.name
          }\n📞  <b>Телефон:</b>  ${dataForm.phone}\n💌  <b>Почта:</b>  ${
            dataForm.mail
          } ${showMyOrder ? `\n\n\n<b>Ваш заказ:\n</b>${myOrder}${itog}` : ``}`,
          {
            parse_mode: 'HTML',
            ...reply_markup,
          }
        );
    }
  );
  bot.onText(/^[а-яА-ЯёЁa-zA-Z0-9]+$/, (msg) => {
    // console.log('aaaaa');
    // const chatId = msg.chat.id;
    // closeOnText &&
    //   bot.sendMessage(chatId, '<b>📞  Ваш телефон:</b>', {
    //     parse_mode: 'HTML',
    //   }) &&
    //   (dataForm.adress = msg.text);
  });
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    // bot.deleteMessage(chatId, messageId - 1);
    // bot.deleteMessage(chatId, messageId);

    switch (text) {
      case '/menu':
        menu(chatId);
        break;
      case '/start':
        menu(chatId);
        break;
      case '/shop':
        store(chatId);
        break;
      case '/bonuses':
        bonuses(chatId);
        break;
      case '/basket':
        myBasket(chatId, messageId);
        break;
      case '/dealer':
        dealer(msg, chatId);
        break;
      case '/support':
        support(chatId);
        break;
      case `/referral`:
        referral(chatId);
        break;
      default:
        changeInputText &&
          bot.sendMessage(
            chatId,
            'Я Вас не понимаю! Введите указанные команды!'
          );
        break;
    }
  });

  bot.on('callback_query', (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    const userId = msg.from.id;
    const messageId = msg.message.message_id;
    let deleteNumber = msg.data.replace(/[\D]+/, '');

    // bot.deleteMessage(chatId, messageId - 2);
    // bot.deleteMessage(chatId, messageId - 1);
    // bot.deleteMessage(chatId, messageId);

    switch (data) {
      case '/menu':
        menu(chatId);
        break;
      case '/shop':
        store(chatId);
        break;
      case '/basket':
        myBasket(chatId);
        break;
      case '/bonuses':
        bonuses(chatId);
        break;
      case '/dealer':
        dealer(msg, chatId);
        break;
      case '/support':
        support(chatId);
        break;
      case '/left':
        setProduct(chatId, 'minus', messageId);
        break;
      case '/right':
        setProduct(chatId, 'plus', messageId);
        break;
      case '/icrement':
        icrement(chatId, '', messageId);
        break;
      case '/dicrement':
        dicrement(chatId, '', messageId);
        break;
      case '/arrange':
        arrange(msg, chatId);
        break;
      case '/buy':
        buy(msg, chatId, 'Хочу стать диллером');
        break;
      case '/order':
        showMyOrder = false;
        dataForm.product = myOrder.map((item) => item.replace(/\n/g, ''));
        dataForm.check = myCheck;
        buy(msg, chatId, 'Хочу сделать заказ');
        break;
      case `/delete${deleteNumber}`:
        basket.splice(deleteNumber - 1, 1);
        myBasket(chatId);
        break;
      case '/addBasket':
        basket.push(product);
        bot.answerCallbackQuery(msg.id, {
          text: 'Товар добавлен в корзину!',
        });
        bot.deleteMessage(chatId, messageId);
        setProduct(chatId);
        break;
      case `/taste${deleteNumber}`:
        numberItem = deleteNumber;
        setProduct(chatId);
        break;
      case `/catalogTaste`:
        catalogTaste(chatId);
        break;
      case `/catalogOne`:
        setProduct(chatId);
        break;
      case `/get_code`:
        getCode(chatId, userId);
        break;
      case `/enter_code`:
        enterCode(chatId, userId);
        break;
      case `/referral`:
        referral(chatId);
        break;
      default:
        break;
    }
  });

  bot.on('polling_error', (msg) => console.log(msg));
};

start();
