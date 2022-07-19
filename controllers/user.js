export const register = async (req, res) => {
  console.log("req", req.body);
  res.status(200).json({ name: "demna" });
};
