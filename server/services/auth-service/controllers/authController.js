const authTest = (req, res) => {
    res.json({ message: "Auth route working!", user: req.auth });
};

module.exports = { authTest };
