import User from "../models/User";

export const getJoin = (req, res) => {
  const pageTitle = "Join";
  return res.render("join", { pageTitle });
};
export const postJoin = async (req, res) => {
  const { username, email, password } = req.body;
  const usernameOrEmailExists = await User.exists({
    $or: [{ username }, { email }],
  });
  if (usernameOrEmailExists) {
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: "Sorry, your username/email is already taken.",
    });
  }

  await User.create({
    username,
    email,
    password,
  });
  return res.redirect("/login");
};
export const getLogin = (req, res) => {
  return res.end();
};
export const postLogin = (req, res) => {
  return res.end();
};
