export const postSetTimeDiff = (req, res) => {
  const { diff } = req.params;
  req.session.timeDiff = diff;
  return res.sendStatus(200);
};
