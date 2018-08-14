module.exports = function (app) {
  const home = require('../controllers/home_controller')
  const data = require('../controllers/data_controller')
  const leads = require('../controllers/leads_controller')
  const salesReps = require('../controllers/salesreps_controller')

  app.use('/', home)
  app.use('/data', data)
  app.use('/leads', leads)
  app.use('/sales', salesReps)
}