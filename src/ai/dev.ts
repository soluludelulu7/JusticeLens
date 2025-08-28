import { config } from 'dotenv';
config();

import '@/ai/flows/extract-court-data.ts';
import '@/ai/flows/generate-appeal-advice.ts';
import '@/ai/flows/detect-bias.ts';