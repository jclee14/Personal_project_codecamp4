const passport = require('passport')

module.exports = (app, db) => {

  app.get('/projects', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.project.findAll()
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.post('/create-project', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.project.create({
        name: req.body.name,
        location: req.body.location,
        start_date: req.body.start_date,
        end_date: req.body.end_date
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

  app.put('/update-project/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.project.update(
        {
          name: req.body.name,
          location: req.body.location,
          start_date: req.body.start_date,
          end_date: req.body.end_date
        },
        {
          where: { id: req.params.id }
        }
      )
        .then((result) => {
          res.status(200).send({ message: 'Project updated' })
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.delete('/delete-project/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.project.destroy({ where: { id: req.params.id } })
        .then((result) => {
          res.status(200).send({ message: 'Project deleted!' })
        })
        .catch((err) => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

}