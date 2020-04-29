const passport = require('passport')

module.exports = (app, db) => {

  app.get('/project-members', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.projectmember.findAll()
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.get('/project-members/:projectId', passport.authenticate('jwt', { session: false }),
  function (req, res) {
    db.projectmember.findAll({ where: { projectId: req.params.projectId }})
      .then(result => {
        res.status(200).send(result)
      })
      .catch(err => {
        console.error(err);
        res.status(400).send({ message: err.message })
      })
  }
)

  app.post('/create-projectmember', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetMember = await db.projectmember.findOne({ where: { projectId: req.body.projectId, workerId: req.body.workerId } });
      if (targetMember) {
        res.status(404).send({ message: "The record is already recorded!" })
      } else {
        try {
          let result = await db.projectmember.create({
            projectId: req.body.projectId,
            workerId: req.body.workerId,
          });
/*           const project = await db.project.findByPk(req.body.projectId);
          const worker = await db.worker.findByPk(req.body.workerId);
          let result = await project.addWorker(worker); */
          res.status(201).send(result)
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )
  
  app.delete('/delete-projectmember/:projectId/:workerId', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetMember = await db.projectmember.findOne({ where: { projectId: req.params.projectId, workerId: req.params.workerId } });
      if (!targetMember) {
        res.status(404).send({ message: "The record is not found." })
      } else {
        try {
          let result = await db.projectmember.destroy({ where: { projectId: req.params.projectId, workerId: req.params.workerId } });
          res.status(200).send({ message: 'Member deleted' });
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )
}