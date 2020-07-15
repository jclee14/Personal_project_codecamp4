const passport = require('passport');
const { Op } = require("sequelize");

module.exports = (app, db) => {

  app.get('/projects', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.project.findAll({ include: [{ model: db.worker }] })
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
    async function (req, res) {

      let targetProject = await db.project.findOne({ where: { name: req.body.name } });
      if (targetProject) {
        const topic = "Registration Unsuccessful"
        const message = "This project's name is already registered!";
        console.log(message);
        res.status(404).send({ topic: topic, message: message })
      } else {
        try {
          let result = await db.project.create({
            name: req.body.name,
            location: req.body.location,
            start_date: req.body.start_date,
            end_date: req.body.end_date
          });
          res.status(201).send(result);
        }
        catch (err) {
          console.error(err);
          const topic = "Error";
          const message = "Register Unsuccessful";
          res.status(400).send({ topic: topic, message: message })
        }
      }
    }
  )

  app.put('/update-project/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {

      let targetProject = await db.project.findOne({ where: { name: req.body.name, [Op.not]: [{ id: req.params.id }]}});
      if (targetProject) {
        const topic = "Update Unsuccessful"
        const message = "This project's name is already registered!";
        console.log(message);
        res.status(404).send({ topic: topic, message: message })
      } else {
        try {
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
          );
          res.status(200).send({ message: 'Project updated' });
        } catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
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