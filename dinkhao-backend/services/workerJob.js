const passport = require('passport')

module.exports = (app, db) => {

  app.get('/workerJobs', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.workerjob.findAll()
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.post('/create-workerJob', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.workerjob.create({
        name: req.body.name
      })
        .then((result) => {
          res.status(201).send(result)
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.put('/update-workerJob/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.workerjob.update(
        {
          name: req.body.name
        },
        {
          where: { id: req.params.id }
        }
      )
        .then((result) => {
          res.status(200).send({ message: 'Job updated' })
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.delete('/delete-workerJob/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetWorkerJob = await db.workerjob.findOne({ where: { id: req.params.id } })
      if (!targetWorkerJob) {
        res.status(404).send({ message: "The role is not found." })
      } else {
        try {
          let result = await db.workerjob.destroy({ where: { id: req.params.id } });
          res.status(200).send({ message: 'Job deleted' })
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )
}