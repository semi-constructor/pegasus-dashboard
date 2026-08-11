import fs from 'fs';
import path from 'path';

function getFiles(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const optionTypeToString = (type: number): string => {
  switch (type) {
    case 1: return 'Subcommand';
    case 2: return 'SubcommandGroup';
    case 3: return 'String';
    case 4: return 'Integer';
    case 5: return 'Boolean';
    case 6: return 'User';
    case 7: return 'Channel';
    case 8: return 'Role';
    case 9: return 'Mentionable';
    case 10: return 'Number';
    case 11: return 'Attachment';
    default: return 'Unknown';
  }
};

const LOCALES = ['en', 'de', 'es-ES', 'fr'];

async function main() {
  const botDir = path.join(process.cwd(), '../bot');
  const commandsDir = path.join(botDir, 'src/commands');
  
  // Need to use ts-node register or similar if we were to import dynamically here.
  // Actually, we can just run the bot's extract script, read the dump, and then transform.
  // We'll write this script as a standalone transform script assuming the dump is available.
  
  const dumpPath = path.join(botDir, 'scripts/commands-dump.json');
  if (!fs.existsSync(dumpPath)) {
    console.error(`Dump file not found at ${dumpPath}. Run extract-commands.ts first.`);
    process.exit(1);
  }

  const rawCommands = JSON.parse(fs.readFileSync(dumpPath, 'utf8'));

  const docsDir = path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Group by category first
  const groupedRaw: Record<string, any[]> = {};
  for (const rc of rawCommands) {
    if (!groupedRaw[rc.category]) {
      groupedRaw[rc.category] = [];
    }
    groupedRaw[rc.category].push(rc.data);
  }

  for (const locale of LOCALES) {
    const categories = [];

    for (const [catName, commandsList] of Object.entries(groupedRaw)) {
      const categoryObj = {
        name: catName.charAt(0).toUpperCase() + catName.slice(1),
        description: `Commands for ${catName}`,
        commands: []
      };

      for (const cmdData of commandsList) {
        const cmdObj = buildCommandItem(cmdData, locale);
        categoryObj.commands.push(cmdObj);
      }

      categories.push(categoryObj);
    }

    const outFileName = `commands-${locale === 'es-ES' ? 'es' : locale}.json`;
    fs.writeFileSync(path.join(docsDir, outFileName), JSON.stringify(categories, null, 2));
    console.log(`Generated ${outFileName}`);
  }
}

function getLocalizedStr(data: any, key: 'name' | 'description', locale: string): string {
  if (locale === 'en') return data[key] || '';
  const locMap = data[`${key}_localizations`];
  if (locMap && locMap[locale]) {
    return locMap[locale];
  }
  return data[key] || '';
}

function buildCommandItem(data: any, locale: string): any {
  const name = data.name; // Do not localize command names
  const description = getLocalizedStr(data, 'description', locale);
  
  const item: any = {
    name,
    description,
    params: [],
    subcommands: []
  };

  if (data.options && data.options.length > 0) {
    for (const opt of data.options) {
      if (opt.type === 1) {
        // Subcommand
        const sub = buildCommandItem(opt, locale);
        item.subcommands.push(sub);
      } else if (opt.type === 2) {
        // Subcommand group
        const group = buildCommandItem(opt, locale);
        group.isGroup = true;
        item.subcommands.push(group);
      } else {
        // Parameter
        item.params.push({
          name: opt.name, // Do not localize option names
          type: optionTypeToString(opt.type),
          required: !!opt.required,
          description: getLocalizedStr(opt, 'description', locale)
        });
      }
    }
  }

  return item;
}

main().catch(console.error);
