import express from 'express';
import { AuthService } from './authService';
import { body, validationResult } from 'express-validator';

const router = express.Router();
const authService = new AuthService();

// Validation middleware
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const registerValidation = [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('teamId').optional().isUUID()
];

// Login endpoint
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

// Register endpoint
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, teamId } = req.body;
    const result = await authService.register(name, email, password, teamId);
    
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Verify team endpoint
router.post('/verify-team', async (req, res) => {
  try {
    const { teamId } = req.body;
    const isValid = await authService.verifyTeam(teamId);
    
    res.json({ isValid });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Create team endpoint
router.post('/create-team', async (req, res) => {
  try {
    const { name } = req.body;
    const teamId = await authService.createTeam(name);
    
    res.status(201).json({ teamId });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    await authService.logout(token);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 