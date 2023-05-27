const debug = require("debug")("app:errorLogger");

const vocab = [
  {
    type: "E11000",
    message: "Email or phone already registered! ",
  },
];

function logger(err, msg) {
  console.error(err);
  let msgtemp = "";
  vocab.forEach((item) => {
    if (msg.includes(item.type)) {
      msgtemp += item.message;
    }
  });
  return { message: msgtemp || msg };
}

module.exports = { logger };
