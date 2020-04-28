const passport = require('passport')

module.exports = (app, db) => {

  app.get('/paybacks', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.payback.findAll()
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.post('/create-payback', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetPayback = await db.payback.findOne({ where: { extrachargeId: req.body.extrachargeId, workerId: req.body.workerId, date: req.body.date } });
      if (targetPayback) {
        res.status(404).send({ message: "The charge is already recorded on the same date!" })
      } else {
        try {
          let result = await db.payback.create({
            extrachargeId: req.body.extrachargeId,
            workerId: req.body.workerId,
            date: req.body.date,
            price: req.body.price
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

  app.put('/update-payback/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let target = await db.payback.findOne({ where: { id: req.params.id } });
      if (!target) {
        res.status(404).send({ message: "The record is not found." })
      } else {
        let targetPayback = await db.payback.findOne({ where: { extrachargeId: req.body.extrachargeId, workerId: req.body.workerId, date: req.body.date } });
        if (targetPayback) {
          res.status(404).send({ message: "The charge is already recorded on the same date!" })
        } else {
          try {
            let result = db.payback.update(
              {
                extrachargeId: req.body.extrachargeId,
                workerId: req.body.workerId,
                date: req.body.date,
                price: req.body.price
              },
              {
                where: { id: req.params.id }
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
    }
  )

  app.delete('/delete-payback/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetPayback = await db.payback.findOne({ where: { id: req.params.id } });
      if (!targetPayback) {
        res.status(404).send({ message: "The record is not found." })
      } else {
        try {
          let result = await db.payback.destroy({ where: { id: req.params.id } });
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