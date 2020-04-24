const express = require('express');
const bodyParser = require('body-parser');
const userService = require('./services/user');
const administerService = require('./services/administer');
const projectService = require('./services/project');
const workerService = require('./services/worker');
const projectmemberService = require('./services/projectMember');
const workService = require('./services/work');
const manageService = require('./services/manage');
const workerJob = require('./services/workerJob');
const extrachargeService = require('./services/extraCharge');
const paybackService = require('./services/payback');
const fileService = require('./services/files');
const db = require('./models');
const cors = require('cors');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const app = express();

app.use(fileUpload());

app.use(express.static('upload'))

app.use(passport.initialize());
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./config/passport/passport')

db.sequelize.sync({ force: false }).then(() => {

  userService(app, db);
  administerService(app, db);
  projectService(app, db);
  workerService(app, db);
  projectmemberService(app, db);
  workService(app, db);
  manageService(app, db);
  workerJob(app, db);
  extrachargeService(app, db);
  paybackService(app, db);
  fileService(app, db);

  app.get('/protected', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      res.send(req.user);
    });

  app.listen(8080, () => {
    console.log("Server is running on port 8080")
  });
})