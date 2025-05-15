import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthService {
  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Get user from database
      const result = await pool.query(
        'SELECT id, name, email, password_hash, role, team_id FROM users WHERE email = $1',
        [email]
      );

      const user = result.rows[0];
      if (!user) {
        throw new Error('User not found');
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Store session
      await pool.query(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'24 hours\')',
        [user.id, token]
      );

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          teamId: user.team_id
        },
        token
      };
    } catch (error) {
      throw new Error(`Login failed: ${(error as Error).message}`);
    }
  }

  // Register new user
  async register(name: string, email: string, password: string, teamId?: string): Promise<AuthResponse> {
    try {
      // Check if user exists
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      // If teamId provided, verify it exists
      if (teamId) {
        const teamExists = await pool.query('SELECT verify_team($1)', [teamId]);
        if (!teamExists.rows[0].verify_team) {
          throw new Error('Invalid team ID');
        }
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, team_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, team_id',
        [name, email, passwordHash, teamId]
      );

      const user = result.rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Store session
      await pool.query(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'24 hours\')',
        [user.id, token]
      );

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          teamId: user.team_id
        },
        token
      };
    } catch (error) {
      throw new Error(`Registration failed: ${(error as Error).message}`);
    }
  }

  // Verify team ID
  async verifyTeam(teamId: string): Promise<boolean> {
    try {
      const result = await pool.query('SELECT verify_team($1)', [teamId]);
      return result.rows[0].verify_team;
    } catch (error) {
      throw new Error(`Team verification failed: ${(error as Error).message}`);
    }
  }

  // Create new team
  async createTeam(name: string): Promise<string> {
    try {
      const result = await pool.query('SELECT create_team($1)', [name]);
      return result.rows[0].create_team;
    } catch (error) {
      throw new Error(`Team creation failed: ${(error as Error).message}`);
    }
  }

  // Logout user
  async logout(token: string): Promise<void> {
    try {
      await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
    } catch (error) {
      throw new Error(`Logout failed: ${(error as Error).message}`);
    }
  }
} 