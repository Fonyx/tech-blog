const clog = require('../utils/cLogger');
const redirectEmoji = String.fromCodePoint(0x21AA);

/**
 * middleware function that redirects to login if user isn't logged in
 * @param {http req} req 
 * @param {http res} res 
 * @param {middleware call stack} next 
 */
 const onlyIfLoggedIn = (req, res, next) => {
    // if user isn't logged in, redirect to /login route
    if(!req.session.logged_in){
        clog(`${redirectEmoji} Redirecting to login as user not logged in`, 'yellow');
        res.redirect('/login');
    // otherwise call next to move through other middleware functions
    } else {
        next();
    }
}

// /**
//  * Custom middleware that redirects to the home page if a session has timed out, upon a request
//  * @param {*} req
//  * @param {*} res
//  * @param {*} next
//  */
//  const homeRedirectOnSessionOut = (req, res, next) => {
//     if(!req.session.user){
//         clog(`${redirectEmoji} User no longer logged in (time limit expired) redirecting`, 'yellow');
//         // redirect to home url
//         res.render('home');
//     } else{
//         // all the request to move to the next middleware if the session is logged in
//         next();
//     }
// };


module.exports = {
    onlyIfLoggedIn
    // homeRedirectOnSessionOut
}