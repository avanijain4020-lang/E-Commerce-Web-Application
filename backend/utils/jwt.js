import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_apex_cart_12345';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '30d',
  });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_apex_cart_12345';
  return jwt.verify(token, secret);
};
