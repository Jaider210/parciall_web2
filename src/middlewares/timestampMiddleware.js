import dayjs from 'dayjs';

const timestampMiddleware = (req, res, next) => {
    const currentTime = dayjs().format('HH:mm DD-MM-YYYY');
    req.body.created_at = req.method === 'POST' ? currentTime : req.body.created_at;
    req.body.updated_at = req.method === 'PUT' ? currentTime : req.body.updated_at;
    req.body.ip_address = req.ip;
    next();
};

export default timestampMiddleware;
