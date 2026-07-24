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

export function parseCommandsDocs(): CommandCategory[] {
  const filePath = path.join(process.cwd(), 'docs', 'COMMANDS_DOC.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const categories: CommandCategory[] = [];
  let currentCategory: CommandCategory | null = null;
  let currentCommand: CommandItem | null = null;
  let currentSubcommand: CommandItem | null = null;
  let currentGroup: CommandItem | null = null;
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      i++;
      continue;
    }
    
    // Category match: ## 1. Admin
    const catMatch = line.match(/^##\s+\d+\.\s+(.+)$/);
    if (catMatch) {
      currentCategory = {
        name: catMatch[1],
        description: '',
        commands: []
      };
      categories.push(currentCategory);
      currentCommand = null;
      currentSubcommand = null;
      currentGroup = null;
      
      // Read description
      i++;
      const desc = [];
      while (i < lines.length && !lines[i].startsWith('###') && !lines[i].startsWith('## ')) {
        if (lines[i].trim()) {
           desc.push(lines[i].trim());
        }
        i++;
      }
      currentCategory.description = desc.join(' ');
      continue; // loop without incrementing i because we might have hit a ###
    }
    
    // Command match: ### `/auditlog`
    const cmdMatch = line.match(/^###\s+`\/(.+)`$/);
    if (cmdMatch && currentCategory) {
      currentCommand = {
        name: cmdMatch[1],
        description: '',
        params: [],
        subcommands: []
      };
      currentCategory.commands.push(currentCommand);
      currentSubcommand = null;
      currentGroup = null;
      
      // Read description
      i++;
      const desc = [];
      while (i < lines.length && !lines[i].startsWith('###') && !lines[i].startsWith('## ') && !lines[i].trim().startsWith('* **')) {
        if (lines[i].trim()) {
           desc.push(lines[i].trim());
        }
        i++;
      }
      currentCommand.description = desc.join(' ');
      continue;
    }

    const indent = line.length - line.trimStart().length;
    
    if (trimmed.startsWith('* **Subcommands:**') || trimmed.startsWith('* **Subcommands & Groups:**') || trimmed.startsWith('* **Options:**')) {
      i++;
      continue;
    }
    
    // Subcommand group match: * **`gamble` (Subcommand Group):**
    const groupMatch = line.match(/^\s*\*\s+\*\*\`(.+?)\`\s+\(Subcommand Group\):\*\*$/);
    if (groupMatch && currentCommand) {
      currentGroup = {
        name: groupMatch[1],
        description: '',
        params: [],
        subcommands: [],
        isGroup: true
      };
      currentCommand.subcommands = currentCommand.subcommands || [];
      currentCommand.subcommands.push(currentGroup);
      currentSubcommand = null;
      i++;
      continue;
    }
    
    // Subcommand match: * `view`: View audit logs.
    const subMatch = line.match(/^\s*\*\s+\`([^`]+)\`:\s*(.+)$/);
    if (subMatch && currentCommand) {
       const subItem: CommandItem = {
         name: subMatch[1],
         description: subMatch[2],
         params: []
       };
       if (currentGroup && indent > 2) {
         currentGroup.subcommands = currentGroup.subcommands || [];
         currentGroup.subcommands.push(subItem);
         currentSubcommand = subItem;
       } else {
         currentCommand.subcommands = currentCommand.subcommands || [];
         currentCommand.subcommands.push(subItem);
         currentSubcommand = subItem;
         currentGroup = null; 
       }
       i++;
       continue;
    }
    
    // Option match: * `<user>` (User) **[Required]**: The user...
    const optMatch = line.match(/^\s*\*\s+\`([<\[])([^>\]]+)[>\]]\`\s+\((.+?)\)\s+\*\*\[(.+?)\]\*\*:\s*(.+)$/);
    if (optMatch) {
       const isRequired = optMatch[1] === '<' || optMatch[4].toLowerCase() === 'required';
       const param: CommandParam = {
         name: optMatch[2],
         type: optMatch[3],
         required: isRequired,
         description: optMatch[5]
       };
       
       if (currentSubcommand) {
         currentSubcommand.params.push(param);
       } else if (currentCommand) {
         currentCommand.params.push(param);
       }
       i++;
       continue;
    }

    i++;
  }
  
  return categories;
}
