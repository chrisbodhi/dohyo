module.exports = function index(router) {
  router.get('/', function getRoot(req, res) {
    res.render('login', {
      title: 'Login Page',
      message: req.flash('loginMessage')
    });
  });

  return router;
};
