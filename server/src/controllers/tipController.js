import prisma from '../config/prisma.js';

const fallbackTips = [
  { title: 'Hydrate early', description: 'Drink water before caffeine to help your skin stay calm and fresh.', category: 'hydration' },
  { title: 'Protein anchor', description: 'Include protein in your first big meal to support hair growth routines.', category: 'protein' },
  { title: 'Glow stack', description: 'Pair fruits with vegetables today for better micronutrient coverage.', category: 'nutrition' },
  { title: 'Sleep reset', description: 'Keep a consistent bedtime to support recovery and skin balance.', category: 'sleep' }
];

export async function dailyTip(req, res, next) {
  try {
    const tips = await prisma.healthTip.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const pool = tips.length ? tips : fallbackTips;
    const index = new Date().getDate() % pool.length;
    const tip = pool[index];

    res.json({ tip });
  } catch (error) {
    next(error);
  }
}

