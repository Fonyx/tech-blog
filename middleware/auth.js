const clog = require('../utils/cLogger');

/**
 * middleware function that redirects to login if user isn't logged in
 * @param {http req} req 
 * @param {http res} res 
 * @param {middleware call stack} next 
 */
 const onlyIfLoggedIn = (req, res, next) => {
    // if user isn't logged in, redirect to /login route
    if(!req.session.loggedIn){
        const redirectEmoji = String.fromCodePoint(0x21AA);
        clog(`${redirectEmoji} Redirecting to login as user not logged in`, 'yellow')
        res.redirect('/login');
    // otherwise call next to move through other middleware functions
    } else {
        next();
    }
}


module.exports = {
    onlyIfLoggedIn,
}