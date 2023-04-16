module.exports = (req, res, next) => {
    const { user: { role } } = req;
    if (role !== 'ADMIN') {
        const error = new Error('Forbidden');
        error.statusCode = 403;
        return next(error);
    }
    next();
};