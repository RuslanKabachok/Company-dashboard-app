export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        console.log('🔐 Перевірка ролі:', userRole);

        if (allowedRoles.includes(userRole)) {
            return next();
        }

        return res.status(403).json({ message: 'Доступ заборонено' });
    };
};
