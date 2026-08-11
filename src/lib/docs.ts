import fs from 'fs';
import path from 'path';

export interface CommandParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface CommandItem {
  name: string;
  description: string;
  params: CommandParam[];
  subcommands?: CommandItem[];
  isGroup?: boolean;
}

export interface CommandCategory {
  name: string;
  description: string;
  commands: CommandItem[];
}

export function parseCommandsDocs(locale: string = 'en'): CommandCategory[] {
  try {
    const outFileName = `commands-${locale}.json`;
    const filePath = path.join(process.cwd(), 'docs', outFileName);
    if (!fs.existsSync(filePath)) {
      // fallback to en
      const fallbackPath = path.join(process.cwd(), 'docs', 'commands-en.json');
      const content = fs.readFileSync(fallbackPath, 'utf-8');
      return JSON.parse(content) as CommandCategory[];
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as CommandCategory[];
  } catch (error) {
    console.error('Error parsing commands JSON:', error);
    return [];
  }
}
