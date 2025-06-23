export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Недостатньо прав доступу' });
        }
        next();
    };
};
