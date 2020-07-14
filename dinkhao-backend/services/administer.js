const passport = require('passport')

module.exports = (app, db) => {

  app.get('/administers', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.administer.findAll()
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.post('/create-administer', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetAdminister = await db.administer.findOne({ where: { projectId: req.body.projectId, userId: req.body.userId } });
      if (targetAdminister) {
        res.status(404).send({ title: "Error", message: "The record is already recorded!" })
      } else {
        try {
          let result = await db.administer.create({
            projectId: req.body.projectId,
            userId: req.body.userId,
          });
          res.status(201).send(result)
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ title: "Error", message: err.message })
        }
      }
    }
  )

  /*   app.put('/update-administer/:userId/:projectId' , passport.authenticate('jwt', { session: false }),
      async function (req, res) {
        let targetAdminister = await db.administer.findOne({ where: { projectId: req.params.projectId, userId: req.params.userId } });
        if (!targetAdminister) {
          res.status(404).send({ message: "The record is not found!" })
        } else {
          try {
            let result = db.administer.update(
              {
  
              },
              {
                where: { projectId: req.params.projectId, userId: req.params.userId }
              }
            );
            res.status(201).send(result);
          }
          catch (err) {
            console.error(err);
            res.status(400).send({ message: err.message })
          }
        }
      }
    ) */

  app.delete('/delete-administer/:userId/:projectId', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetAdminister = await db.administer.findOne({ where: { projectId: req.params.projectId, userId: req.params.userId } });
      if (!targetAdminister) {
        res.status(404).send({ message: "The record is not found." })
      } else {
        try {
          let result = await db.administer.destroy({ where: { projectId: req.params.projectId, userId: req.params.userId } });
          res.status(200).send({ message: 'Record deleted' });
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )

/*   app.delete('/delete-administerByProject/:projectId', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetAdminister = await db.administer.findOne({ where: { projectId: req.params.projectId } });
      if (!targetAdminister) {
        res.status(404).send({ message: "The project is not found." })
      } else {
        try {
          let result = await db.administer.destroy({ where: { projectId: req.params.projectId } });
          res.status(200).send({ message: 'Record deleted' });
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  ) */

}