const passport = require('passport')

module.exports = (app, db) => {

  app.get('/manages', passport.authenticate('jwt',
    { session: false }),
    function (req, res) {
      db.manage.findAll()
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.post('/create-manage', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetManage = await db.manage.findOne({ where: { projectId: req.body.projectId, workerId: req.body.workerId } });
      if (targetManage) {
        res.status(404).send({ message: "The record is already recorded!" })
      } else {
        try {
          let result = await db.manage.create({
            projectId: req.body.projectId,
            workerId: req.body.workerId,
            workerjobId: req.body.workerjobId,
            start_date: req.body.start_date
          });
          res.status(201).send(result)
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )

  app.put('/update-manage/:projectId/:workerId' , passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetManage = await db.manage.findOne({ where: { projectId: req.params.projectId, workerId: req.params.workerId } });
      if (!targetManage) {
        res.status(404).send({ message: "The record is not found!" })
      } else {
        try {
          let result = db.manage.update(
            {
              workerjobId: req.body.workerjobId,
              start_date: req.body.start_date
            },
            {
              where: { projectId: req.params.projectId, workerId: req.params.workerId }
            }
          );
          res.status(200).send({ message: 'Record updated' });
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )

  app.delete('/delete-manage/:projectId/:workerId', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetManage = await db.manage.findOne({ where: { projectId: req.params.projectId, workerId: req.params.workerId } });
      if (!targetManage) {
        res.status(404).send({ message: "The record is not found." })
      } else {
        try {
          let result = await db.manage.destroy({ where: { projectId: req.params.projectId, workerId: req.params.workerId } });
          res.status(200).send({ message: 'Record deleted' });
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )
}