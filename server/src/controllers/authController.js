import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { signToken } from '../utils/jwt.js';
import { getOrCreateTodayTask } from '../services/taskService.js';
import { syncUserStats } from '../services/statsService.js';
import { requireFields } from '../utils/validation.js';

function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

async function createUserSession(user) {
  const todayTask = await getOrCreateTodayTask(user.id);
  const stats = await syncUserStats(user.id);

  return {
    user: sanitizeUser(user),
    todayTask,
    stats
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, age, gender, weight, skinGoals, hairGoals } = req.body;
    const missing = requireFields(req.body, ['name', 'email', 'password']);
    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }
    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        age: age ? Number(age) : null,
        gender,
        weight: weight ? Number(weight) : null,
        skinGoals,
        hairGoals
      }
    });

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    const session = await createUserSession(user);
    res.status(201).json({ ...session, token });
  } catch (error) {
    next(error);
  }
}

export const signup = register;

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const missing = requireFields(req.body, ['email', 'password']);
    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    const session = await createUserSession(user);
    res.json({ ...session, token });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const [todayTask, stats] = await Promise.all([
      getOrCreateTodayTask(user.id),
      syncUserStats(user.id)
    ]);

    res.json({
      user: sanitizeUser(user),
      todayTask,
      stats
    });
  } catch (error) {
    next(error);
  }
}
