'use client';

import { useState } from 'react';
import { Trash2, Plus, Terminal } from 'lucide-react';
import SaveButton from '@/components/SaveButton';
import { updateCustomCommands } from '@/app/actions';

type Command = {
  prefix?: string;
  name: string;
  reply: string;
};

export default function CustomCommandsClient({ guildId, initialCommands }: { guildId: string, initialCommands: Command[] }) {
  const [commands, setCommands] = useState<Command[]>(initialCommands);

  const handleAddCommand = () => {
    setCommands([...commands, { prefix: '', name: '', reply: '' }]);
  };

  const handleRemoveCommand = (index: number) => {
    setCommands(commands.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Command, value: string) => {
    const newCommands = [...commands];
    newCommands[index] = { ...newCommands[index], [field]: value };
    setCommands(newCommands);
  };

  const handleSaveAction = async (formData: FormData) => {
    const validCommands = commands.filter(c => c.name.trim() !== '' && c.reply.trim() !== '');
    formData.append('customCommands', JSON.stringify(validCommands));
    await updateCustomCommands(guildId, formData);
    setCommands(validCommands);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-[#5E5CE6]" />
          <div>
            <h2 className="text-xl font-light text-white tracking-wide">Command Database</h2>
            <p className="text-neutral-500 font-mono text-xs mt-1">Add, edit, or remove custom text commands.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddCommand}
          className="bg-[#5E5CE6]/10 hover:bg-[#5E5CE6]/20 text-[#5E5CE6] border border-[#5E5CE6]/20 transition-colors px-4 py-2 font-mono text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Command</span>
        </button>
      </div>

      <div className="border border-white/5 bg-white/[0.01] backdrop-blur-md p-8 rounded-none">
        <form action={handleSaveAction} className="space-y-6 font-mono text-xs">
          {commands.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-neutral-500 bg-black/20 border border-white/5">
              No custom commands configured. Click &quot;Add Command&quot; to create one.
            </div>
          ) : (
            <div className="space-y-4">
              {commands.map((cmd, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 items-start p-4 bg-black/20 border border-white/5 relative group">
                  <div className="w-full md:w-32 flex-shrink-0">
                    <label className="block text-neutral-400 uppercase tracking-wider mb-2 text-[10px]">Prefix (Opt)</label>
                    <input
                      type="text"
                      value={cmd.prefix || ''}
                      onChange={(e) => handleChange(index, 'prefix', e.target.value)}
                      placeholder="e.g. !"
                      className="w-full bg-black border border-white/10 px-3 py-2 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="w-full md:w-48 flex-shrink-0">
                    <label className="block text-neutral-400 uppercase tracking-wider mb-2 text-[10px]">Command Name *</label>
                    <input
                      type="text"
                      value={cmd.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      required
                      placeholder="e.g. hello"
                      className="w-full bg-black border border-white/10 px-3 py-2 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="w-full flex-grow">
                    <label className="block text-neutral-400 uppercase tracking-wider mb-2 text-[10px]">Reply Text *</label>
                    <input
                      type="text"
                      value={cmd.reply}
                      onChange={(e) => handleChange(index, 'reply', e.target.value)}
                      required
                      placeholder="e.g. World!"
                      className="w-full bg-black border border-white/10 px-3 py-2 text-white rounded-none focus:border-[#5E5CE6] focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCommand(index)}
                    className="md:mt-7 p-2 text-neutral-500 hover:text-red-400 transition-colors border border-transparent hover:border-red-400/20 bg-transparent hover:bg-red-400/10"
                    title="Remove Command"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-white/5">
            <SaveButton
              label="Save Custom Commands"
              savingLabel="Saving Commands..."
              savedLabel="Commands Saved!"
              className="w-full"
              icon="save"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
