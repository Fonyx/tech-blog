const clog = require('../utils/cLogger');

/**
 * Custom middleware that logs out the type and path of each request to the server as well as an emoji
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const cRequests = (req, res, next) => {
  const openHands = String.fromCodePoint(0x1f932);
  const handWriting = String.fromCodePoint(0x270d);
  const pointing = String.fromCodePoint(0x1f446);
  const bomb = String.fromCodePoint(0x1f631);
  switch (req.method) {
  case 'GET': {
    clog(`${openHands}  ${req.method} request to ${req.path}`, 'green');
    // clog.logGreen(`${openHands}  ${req.method} request to ${req.path}`);
    break;
  }
  case 'POST': {
    clog(`${handWriting}  ${req.method} request to ${req.path}`, 'blue');
    // clog.logBlue(`${handWriting}  ${req.method} request to ${req.path}`);
    break;
  }
  case 'PUT': {
    clog(`${pointing}  ${req.method} request to ${req.path}`, 'magenta');
    // clog.logMagenta(`${pointing}  ${req.method} request to ${req.path}`)
    break;
  }
  case 'DELETE': {
    clog(`${bomb}  ${req.method} request to ${req.path}`, 'red');
    // clog.logRed(`${bomb}  ${req.method} request to ${req.path}`)
    break;
  }
  default:
    clog(`${req.method} request to ${req.path}`, 'white');
}
  next();
};

module.exports = cRequests;
