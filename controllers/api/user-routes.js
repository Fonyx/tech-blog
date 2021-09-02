const { User } = require('../../models');
const router = require('express').Router();
const clog = require('../../utils/cLogger');

// CREATE new user
router.post('/', async (req, res) => {
    try {
      const dbUserData = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
  
      req.session.save(() => {
        req.session.logged_in = true;
        req.session.user_id = dbUserData.id;
        clog('User logged in', 'green');
        clog(`User: ${dbUserData.username} id: ${dbUserData.id}`, 'green');
        res.status(200).json(dbUserData);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
  
// Login
router.post('/login', async (req, res) => {
try {
    const dbUserData = await User.findOne({
      where: {
          email: req.body.email,
      },
    });

    if (!dbUserData) {
      res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    req.session.save(() => {
      req.session.logged_in = true;
      req.session.user_id = dbUserData.id;
      clog('User logged in', 'green');
      clog(`User: ${dbUserData.username} id: ${dbUserData.id}`, 'green');
      res.status(200).json({ user: dbUserData, message: 'You are now logged in!' });
    });
} catch (err) {
    console.log(err);
    res.status(500).json(err);
}
});

// Logout
router.post('/logout', (req, res) => {
if (req.session.logged_in) {
    req.session.destroy(() => {
      clog('User logged out and session destroyed', 'red');
      res.status(204).end();
    });
} else {
    res.status(404).end();
}
});

module.exports = router;