exports.getUserPromocode = () =>
  'X0XX0XX00X'
    .replace(/X|0/g, (v) =>
      v === 'X'
        ? String.fromCharCode(Math.floor(Math.random() * 26) + 97)
        : Math.floor(Math.random() * 10)
    )
    .toUpperCase();
