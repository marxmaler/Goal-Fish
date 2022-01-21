export const postPreviousWeekly = async (req, res) => {
  const date = req.params.date;
  const changedSubId = req.body.changed;
  if (changedSubId) {
    const changedSub = await WeeklySub.findById(changedSubId);
    if (changedSub.completed) {
      changedSub.completed = false;
      await changedSub.save();
    } else {
      changedSub.completed = true;
      await changedSub.save();
    }
  }
  return res.redirect(`/weekly/${date}`);
};

export const postPreviousDaily = async (req, res) => {
  const date = req.params.date;
  const changedSubId = req.body.changed;
  if (changedSubId) {
    const changedSub = await DailySub.findById(changedSubId);
    if (changedSub.completed) {
      changedSub.completed = false;
      await changedSub.save();
    } else {
      changedSub.completed = true;
      await changedSub.save();
    }
  }
  return res.redirect(`/daily/${date}`);
};
