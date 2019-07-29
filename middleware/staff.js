
module.exports = function (req, res, next) {
    if (req.user.type !== 'Staff') {
        res.status(403).json({ Alert: 'YOU ARE NOT AUTHORIZED TO BE HERE!!' })
    }
    next();
}