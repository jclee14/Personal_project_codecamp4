const passport = require('passport')

module.exports = (app, db) => {

  app.get('/extracharges', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.extracharge.findAll()
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.post('/create-extracharge', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetExtraCharge = await db.extracharge.findOne({ where: { task: req.body.task } });
      if (targetExtraCharge) {
        res.status(404).send({ message: "The task is already recorded!" })
      } else {
        try {
          let result = await db.extracharge.create({ task: req.body.task });
          res.status(201).send(result)
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )

  app.put('/update-extracharge/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetExtraCharge = await db.extracharge.findOne({ where: { id: req.params.id } });
      if (!targetExtraCharge) {
        res.status(404).send({ message: "The task is not found!" })
      } else {
        try {
          let result = await db.extracharge.update(
            {
              task: req.body.task
            },
            {
              where: { id: req.params.id }
            }
          );
          res.status(201).send(result);
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message });
        }
      }
    }
  )

  app.delete('/delete-extracharge/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetExtraCharge = await db.extracharge.findOne({ where: { id: req.params.id } });
      if (!targetExtraCharge) {
        res.status(404).send({ message: "The task is not found!" })
      } else {
        try {
          let result = await db.extracharge.destroy({ where: { id: req.params.id } });
          res.status(201).send(result);
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message });
        }
      }
    }
  )

}