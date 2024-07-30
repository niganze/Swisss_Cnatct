import { User } from '../models/users.js';

const checkActive = async (req, res, next) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      // Check if the user is active
      if (user.role === 'schooll' && !user.active) {
        return res.status(403).json({ message: 'Account is inactive' });
      }

      // Attach user to the request object and proceed
      req.user = user;
      next();
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(409).json({ error: err.message });
  }
};

export default checkActive;
