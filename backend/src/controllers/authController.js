import jwt from 'jsonwebtoken';

export const authController = {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Hardcoded credentials as per requirements
      if (username === 'JawadS' && password === 'JawadS') {
        const token = jwt.sign(
          { username, role: 'admin' },
          process.env.JWT_SECRET || 'fallback-secret-for-dev',
          { expiresIn: process.env.JWT_EXPIRY || '7d' }
        );

        return res.json({
          success: true,
          message: 'Login successful',
          token
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    } catch (error) {
      next(error);
    }
  }
};
