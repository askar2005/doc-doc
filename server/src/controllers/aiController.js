import prisma from '../config/prisma.js';
import { generateAIResponse } from '../services/ai/aiService.js';
import { getOrCreateTodayTask, summarizeTasks } from '../services/taskService.js';
import { currentStreak } from '../services/scoreService.js';

function getAIChatDelegate() {
  if (!prisma?.aIChat) {
    throw new Error('Prisma client is missing the aIChat accessor. Run prisma generate and restart the backend.');
  }

  return prisma.aIChat;
}

export async function chat(req, res, next) {
  try {
    const { message, context } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const todayTask = await getOrCreateTodayTask(req.user.id);
    const tasks = await prisma.dailyTask.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 14
    });
    const recentConversation = await getAIChatDelegate().findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    const weeklyTasks = tasks.slice(0, 7);
    const streakSummary = await prisma.userStats.findUnique({ where: { userId: req.user.id } });
    const weeklySummary = summarizeTasks(weeklyTasks);
    const recentPatterns = tasks.slice(0, 3).map((task) => `${task.dayKey}: score ${task.score}, water ${task.waterCompleted ? 'done' : 'missed'}`);

    const response = await generateAIResponse({
      user,
      todayTask,
      weeklySummary,
      streakSummary: streakSummary || { streak: currentStreak(tasks), longestStreak: currentStreak(tasks) },
      question: message,
      recentPatterns,
      context,
      recentConversation: recentConversation.reverse()
    });

    const chat = await getAIChatDelegate().create({
      data: {
        userId: req.user.id,
        message,
        response
      }
    });

    res.json({ response, chat });
  } catch (error) {
    console.error('AI CHAT ERROR:', error);
    next(error);
  }
}

export async function history(req, res, next) {
  try {
    const chats = await getAIChatDelegate().findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({
      chats
    });
  } catch (error) {
    console.error('AI HISTORY ERROR:', error);
    next(error);
  }
}
