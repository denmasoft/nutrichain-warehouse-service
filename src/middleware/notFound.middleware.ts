import { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    const message = req.t('errors.notFound');
    res.status(404).json({ message });
};