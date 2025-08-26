const fs = require('fs');

const users = JSON.parse(fs.readFileSync('data/data.json'));

const getuser = (req, res, next) => {
    if(!req.body.name) return res.status(400).json({ message: 'Name Field is required' });
    const user = users.filter(u => u.name === req.body.name);
    if (user.length > 0) {
        req.user = user[0];
        next();
    } else {
        res.status(404).json({ message: 'User not found' });
        return
    }
}

const getallusers = (req, res) => {
    res.json(users.map(u => u.name));
}

module.exports = {
    getuser,
    getallusers
};