const fs = require('fs');

let content = fs.readFileSync('src/app/actions.ts', 'utf8');

const schemaInjection = `
const economySettingsSchema = z.object({
  currencySymbol: z.string().min(1).max(10).default('🪙'),
  currencyName: z.string().min(1).max(50).default('coins'),
  startingBalance: z.coerce.number().min(0).default(100),
  dailyAmount: z.coerce.number().min(0).default(100),
  dailyStreak: z.coerce.boolean().default(true),
  dailyStreakBonus: z.coerce.number().min(0).default(10),
  workMinAmount: z.coerce.number().min(0).default(50),
  workMaxAmount: z.coerce.number().min(0).default(200),
  workCooldown: z.coerce.number().min(0).default(3600),
  robEnabled: z.coerce.boolean().default(true),
  robMinAmount: z.coerce.number().min(0).default(100),
  robSuccessRate: z.coerce.number().min(0).max(100).default(50),
  robCooldown: z.coerce.number().min(0).default(86400),
  robProtectionCost: z.coerce.number().min(0).default(1000),
  robProtectionDuration: z.coerce.number().min(0).default(86400),
  maxBet: z.coerce.number().min(0).default(10000),
  minBet: z.coerce.number().min(0).default(10),
});
`;

// Insert the schema after zod import or somewhere near the top
content = content.replace("import { z } from 'zod';", "import { z } from 'zod';\n" + schemaInjection);

const oldUpdateEconomySettings = `export async function updateEconomySettings(guildId: string, formData: FormData): Promise<void> {
  try {
    await requireGuildAdmin(guildId);
    const currencySymbol = formData.get('currencySymbol') as string || '🪙';
    const currencyName = formData.get('currencyName') as string || 'coins';
    const startingBalance = parseInt(formData.get('startingBalance') as string, 10) || 100;
    const dailyAmount = parseInt(formData.get('dailyAmount') as string, 10) || 100;
    const dailyStreak = formData.get('dailyStreak') === 'true';
    const dailyStreakBonus = parseInt(formData.get('dailyStreakBonus') as string, 10) || 10;
    const workMinAmount = parseInt(formData.get('workMinAmount') as string, 10) || 50;
    const workMaxAmount = parseInt(formData.get('workMaxAmount') as string, 10) || 200;
    const workCooldown = parseInt(formData.get('workCooldown') as string, 10) || 3600;
    const robEnabled = formData.get('robEnabled') === 'true';
    const robMinAmount = parseInt(formData.get('robMinAmount') as string, 10) || 100;
    const robSuccessRate = parseInt(formData.get('robSuccessRate') as string, 10) || 50;
    const robCooldown = parseInt(formData.get('robCooldown') as string, 10) || 86400;
    const robProtectionCost = parseInt(formData.get('robProtectionCost') as string, 10) || 1000;
    const robProtectionDuration = parseInt(formData.get('robProtectionDuration') as string, 10) || 86400;
    const maxBet = parseInt(formData.get('maxBet') as string, 10) || 10000;
    const minBet = parseInt(formData.get('minBet') as string, 10) || 10;`;

const newUpdateEconomySettings = `export async function updateEconomySettings(guildId: string, formData: FormData): Promise<void> {
  try {
    await requireGuildAdmin(guildId);
    const rawData = Object.fromEntries(formData.entries());
    
    // Convert boolean strings for coerce
    if (rawData.dailyStreak === 'true') rawData.dailyStreak = true as any;
    if (rawData.dailyStreak === 'false') rawData.dailyStreak = false as any;
    if (rawData.robEnabled === 'true') rawData.robEnabled = true as any;
    if (rawData.robEnabled === 'false') rawData.robEnabled = false as any;

    const parsed = economySettingsSchema.safeParse(rawData);
    if (!parsed.success) {
      console.error("Validation error updateEconomySettings:", parsed.error);
      throw new Error("Invalid input data");
    }

    const {
      currencySymbol, currencyName, startingBalance, dailyAmount, dailyStreak, dailyStreakBonus,
      workMinAmount, workMaxAmount, workCooldown, robEnabled, robMinAmount, robSuccessRate,
      robCooldown, robProtectionCost, robProtectionDuration, maxBet, minBet
    } = parsed.data;`;

// Some files might have the coin as a weird encoding due to powershell
content = content.replace(/as string \|\| 'YT'/g, "as string || '🪙'");
content = content.replace(/as string \|\| '\?\?'/g, "as string || '🪙'");

content = content.replace(oldUpdateEconomySettings, newUpdateEconomySettings);

fs.writeFileSync('src/app/actions.ts', content, 'utf8');
console.log('Update script finished successfully.');
