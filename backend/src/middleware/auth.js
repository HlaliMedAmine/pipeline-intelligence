import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pipeline-intelligence-secret-2024';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.orgUrl = decoded.orgUrl;
    req.pat = decoded.pat;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
