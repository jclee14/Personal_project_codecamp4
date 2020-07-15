const passport = require('passport');
const { Op } = require("sequelize");

module.exports = (app, db) => {

  app.get('/workers', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.worker.findAll()
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.get('/worker/:id', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.worker.findOne({ where: { id: req.params.id } })
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.post('/create-worker', passport.authenticate('jwt', { session: false }),
    async function (req, res) {

      let picture;
      let pictureName = '';

      if (req.files) {
        picture = await req.files.photoPost
        pictureName = await `${(new Date()).getTime()}.jpeg`;
        await picture.mv('./upload/' + pictureName)
      }

      let targetWorker = await db.worker.findOne({ where: { fname: req.body.fname, lname: req.body.lname } });
      if (targetWorker) {
        console.log("This worker is already registered!");
        res.status(404).send({ message: "This worker is already registered!" })
      } else {
        try {
          let result = await db.worker.create({
            fname: req.body.fname,
            lname: req.body.lname,
            wage_rate: req.body.wage_rate,
            gender: req.body.gender,
            race: req.body.race,
            bank_account_id: req.body.bank_account_id,
            image_url: pictureName === '' ? '' : pictureName,
            phone: req.body.phone,
            isEmployed: req.body.isEmployed
          })
          res.status(201).send(result)
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )

  app.put('/update-worker/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetWorker = await db.worker.findOne({ where: { id: req.params.id } })
      let namedWorker = await db.worker.findOne({ where: { fname: req.body.fname, lname: req.body.lname, [Op.not]: [{ id: req.params.id}]}});
      if (!targetWorker) {
        res.status(404).send({ message: "The worker is not found." })
      } else if (namedWorker) {
        console.log("This worker is already registered!");
        res.status(404).send({ message: "This worker is already registered!" })
      } else {

        let data = await db.worker.findOne({ attributes: ['image_url'], where: { id: req.params.id } });
        let picture;
        let pictureName = '';

        if (req.files) {
          picture = await req.files.photoPost
          pictureName = await `${(new Date()).getTime()}.jpeg`;
          await picture.mv('./upload/' + pictureName)
        }

        try {
          let result = await db.worker.update(
            {
              fname: req.body.fname,
              lname: req.body.lname,
              wage_rate: req.body.wage_rate,
              gender: req.body.gender,
              race: req.body.race,
              bank_account_id: req.body.bank_account_id,
              image_url: pictureName === '' ? data.image_url : pictureName,
              phone: req.body.phone,
              isEmployed: req.body.isEmployed
            },
            {
              where: { id: req.params.id }
            }
          )
          res.status(200).send({ message: 'Worker updated' })
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )

  app.delete('/delete-worker/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetWorker = await db.worker.findOne({ where: { id: req.params.id } })
      if (!targetWorker) {
        res.status(404).send({ message: "The worker is not found." })
      } else {
        try {
          let result = await db.worker.destroy({ where: { id: req.params.id } });
          res.status(200).send({ message: 'Worker deleted' })
        }
        catch (err) {
          console.error(err);
          res.status(400).send({ message: err.message })
        }
      }
    }
  )
}