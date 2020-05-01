const passport = require('passport')

module.exports = (app, db) => {

  app.get('/worksbyproject/:projectId', passport.authenticate('jwt', { session: false }),
    function (req, res) {
      db.work.findAll({ where: { projectId: req.params.projectId }})
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          console.error(err);
          res.status(400).send({ message: err.message })
        })
    }
  )

  app.post('/create-work', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetWork = await db.work.findOne({ where: { projectId: req.body.projectId, workerId: req.body.workerId, date: req.body.date } });
      if (targetWork) {
        res.status(404).send({ message: "The record is already recorded!" })
      } else {
        let data = await db.worker.findOne({ attributes: ['wage_rate'], where: { id: req.body.workerId } });
        let current_rate = parseFloat(data.dataValues.wage_rate);

        let workHR = parseFloat(req.body.normal_morning_hr) + parseFloat(req.body.normal_afternoon_hr);
        let otDayHR = parseFloat(req.body.ot_early_hr) + parseFloat(req.body.ot_noon_hr);
        let otNightHR = parseFloat(req.body.ot_evening_hr) + parseFloat(req.body.ot_night_hr);

        let normal_earn = (current_rate / 9) * workHR;
        let ot_day_earn = (current_rate / 8) * otDayHR;
        let ot_night_earn = ((current_rate / 8) * otNightHR) * 1.5;

        let wage_earning = Math.round(normal_earn + ot_day_earn + ot_night_earn);

        try {
          let result = await db.work.create({
            projectId: req.body.projectId,
            workerId: req.body.workerId,
            // workerjobId: req.body.workerjobId,
            date: req.body.date,
            current_rate: current_rate,
            normal_morning_hr: req.body.normal_morning_hr,
            normal_afternoon_hr: req.body.normal_afternoon_hr,
            ot_early_hr: req.body.ot_early_hr,
            ot_noon_hr: req.body.ot_noon_hr,
            ot_evening_hr: req.body.ot_evening_hr,
            ot_night_hr: req.body.ot_night_hr,
            wage_earning: wage_earning
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

  app.put('/update-work/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      /* let targetWork = await db.work.findOne({ where: { projectId: req.params.projectId, workerId: req.params.workerId, date: req.params.date } }); */
      let targetWork = await db.work.findOne({ where: { id: req.params.id } });
      if (!targetWork) {
        res.status(404).send({ message: "The record is not found." })
      } else {

        /* let data = await db.work.findOne({ attributes: ['current_rate'], where: { projectId: req.params.projectId, workerId: req.params.workerId, date: req.params.date } }); */
        let data = await db.work.findOne({ attributes: ['current_rate'], where: { id: req.params.id } });
        let current_rate = parseFloat(data.dataValues.current_rate);

        let workHR = parseFloat(req.body.normal_morning_hr) + parseFloat(req.body.normal_afternoon_hr);
        let otDayHR = parseFloat(req.body.ot_early_hr) + parseFloat(req.body.ot_noon_hr);
        let otNightHR = parseFloat(req.body.ot_evening_hr) + parseFloat(req.body.ot_night_hr);

        let normal_earn = (current_rate / 9) * workHR;
        let ot_day_earn = (current_rate / 8) * otDayHR;
        let ot_night_earn = ((current_rate / 8) * otNightHR) * 1.5;

        let wage_earning = Math.round(normal_earn + ot_day_earn + ot_night_earn);

        try {
          let result = db.work.update(
            {
              // workerjobId: req.body.workerjobId,
              normal_morning_hr: req.body.normal_morning_hr,
              normal_afternoon_hr: req.body.normal_afternoon_hr,
              ot_early_hr: req.body.ot_early_hr,
              ot_noon_hr: req.body.ot_noon_hr,
              ot_evening_hr: req.body.ot_evening_hr,
              ot_night_hr: req.body.ot_night_hr,
              wage_earning: wage_earning
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
  )

  app.delete('/delete-work/:id', passport.authenticate('jwt', { session: false }),
    async function (req, res) {
      let targetWork = await db.work.findOne({ where: { id: req.params.id } });
      if (!targetWork) {
        res.status(404).send({ message: "The record is not found." })
      } else {
        try {
          let result = await db.work.destroy({ where: { id: req.params.id } });
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