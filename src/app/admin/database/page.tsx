import Link from 'next/link';
import { db } from '@/lib/db';
import * as schema from '../../../../schemas/index';
import { Shield, ArrowRight, Database, CheckCircle2, AlertCircle, Edit, Table as TableIcon, X, Check, Plus, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import SaveButton from '@/components/SaveButton';
import { updateDatabaseEntry, createDatabaseEntry, deleteDatabaseEntry } from '../actions';

const ALL_KNOWN_TABLES = [
  'guilds', 'guildSettings', 'users', 'members', 'modCases', 'warnings',
  'warningAutomations', 'modLogSettings', 'wordFilterRules', 'giveaways',
  'giveawayEntries', 'ticketPanels', 'tickets', 'ticketMessages', 'userXp',
  'xpRewards', 'xpMultipliers', 'xpSettings', 'economyBalances',
  'economyTransactions', 'economyShopItems', 'economyUserItems', 'economyCooldowns',
  'economyGamblingStats', 'economySettings', 'securityLogs', 'blacklist',
  'auditLogs', 'rateLimitViolations', 'securityIncidents', 'apiKeys',
  'jtcConfigs', 'jtcChannels', 'autoModRules', 'autoModInfractions',
  'quarantineVault', 'achievements', 'userAchievements', 'engagementQuests',
  'userQuestProgress', 'userReputation', 'ticketDepartments', 'ticketRatings'
];

function getTables(): string[] {
  const tableNames: string[] = [];
  for (const t of ALL_KNOWN_TABLES) {
    if ((schema as any)[t]) {
      tableNames.push(t);
    }
  }
  return tableNames;
}

function getTableColumns(tableName: string): { name: string; dataType: string; isPrimary: boolean; defaultVal: any }[] {
  const table = (schema as any)[tableName];
  if (!table) return [];
  
  const cols: { name: string; dataType: string; isPrimary: boolean; defaultVal: any }[] = [];
  
  for (const key of Object.keys(table)) {
    if (key === '_' || key === 'getSQL' || key === 'config') continue;
    const colObj = table[key];
    if (colObj && typeof colObj === 'object') {
      const dataType = (colObj as any).dataType || (colObj as any).columnType || 'string';
      const isPrimary = (colObj as any).primary || false;
      
      let defaultVal: any = '';
      if (dataType === 'number' || dataType === 'integer' || dataType === 'bigint') defaultVal = 0;
      if (dataType === 'boolean') defaultVal = false;
      if (dataType === 'json' || dataType === 'jsonb') defaultVal = JSON.stringify({}, null, 2);
      if (key === 'id' && dataType === 'string') defaultVal = 'ID-' + Math.floor(Math.random() * 90000 + 10000);
      
      cols.push({
        name: key,
        dataType,
        isPrimary,
        defaultVal,
      });
    }
  }
  return cols;
}

function getPrimaryKeyCols(tableName: string, row: any): string[] {
  if (!row) return [];
  if ('id' in row) return ['id'];
  if ('warnId' in row) return ['warnId'];
  if ('caseId' in row) return ['caseId'];
  if ('guildId' in row && 'userId' in row && 'commandType' in row) return ['guildId', 'userId', 'commandType'];
  if ('guildId' in row && 'userId' in row && 'gameType' in row) return ['guildId', 'userId', 'gameType'];
  if ('guildId' in row && 'userId' in row) return ['guildId', 'userId'];
  if ('guildId' in row && 'targetId' in row) return ['guildId', 'targetId'];
  if ('guildId' in row) return ['guildId'];
  if ('userId' in row) return ['userId'];
  const keys = Object.keys(row);
  return [keys[0]];
}

function getRowKey(tableName: string, row: any): string {
  const pkCols = getPrimaryKeyCols(tableName, row);
  const keyObj: Record<string, any> = {};
  for (const col of pkCols) {
    keyObj[col] = row[col];
  }
  return JSON.stringify(keyObj);
}

export default async function AdminDatabasePage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string; edit?: string; create?: string; msg?: string; q?: string; page?: string; limit?: string }>;
}) {
  const { table, edit, create, msg, q, page, limit } = await searchParams;
  const searchQuery = q || '';
  const currentPage = parseInt(page || '1', 10) || 1;
  const pageSize = parseInt(limit || '10', 10) || 10;

  // Load Tables & Selected Table Rows
  const tables = getTables();
  const currentTable = table || tables[0] || '';
  const tableColumns = getTableColumns(currentTable);

  let rows: any[] = [];
  let fetchError: string | null = null;

  if (currentTable && ALL_KNOWN_TABLES.includes(currentTable) && (schema as any)[currentTable]) {
    try {
      rows = await db.select().from((schema as any)[currentTable]);
    } catch (e: any) {
      fetchError = e.message || 'Failed to fetch table rows';
    }
  }

  // Filter rows based on search query
  const filteredRows = rows.filter(row => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return Object.values(row).some(val => {
      if (val instanceof Date) return val.toISOString().toLowerCase().includes(query);
      if (typeof val === 'object' && val !== null) return JSON.stringify(val).toLowerCase().includes(query);
      return String(val ?? '').toLowerCase().includes(query);
    });
  });

  // Calculate Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedRows = filteredRows.slice((validPage - 1) * pageSize, validPage * pageSize);

  // Handle Selected Row for Editing
  let selectedRow: any = null;
  if (edit && rows.length > 0) {
    try {
      const editKeyObj = JSON.parse(decodeURIComponent(edit));
      selectedRow = rows.find(r => {
        return Object.entries(editKeyObj).every(([k, v]) => r[k] === v);
      });
    } catch (e) {}
  }

  const queryParamsPreserved = `table=${encodeURIComponent(currentTable)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}&limit=${pageSize}&page=${validPage}`;

  return (
    <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 font-mono">
      {/* Header */}
      <div className="border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 border border-[#5E5CE6]/20 px-3 py-1 bg-[#5E5CE6]/10 mb-4 text-xs tracking-wide text-[#5E5CE6]">
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL Direct Inspection</span>
          </div>
          <h1 className="text-4xl font-light tracking-tight text-white mb-2 font-sans uppercase">Master Database Console</h1>
          <p className="text-sm text-neutral-400 tracking-wide">
            Inspect, modify, create, or drop entries across all 43 Drizzle ORM mapped PostgreSQL entities.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {msg && (
        <div className={`border p-4 flex items-center justify-between text-xs animate-pulse ${
          msg === 'successfully_deleted'
            ? 'border-red-500/30 bg-red-500/10 text-red-400'
            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
        }`}>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {msg === 'successfully_created' && 'Database entry successfully created and broadcasted across shards.'}
              {msg === 'successfully_updated' && 'Database entry successfully updated and broadcasted across shards.'}
              {msg === 'successfully_deleted' && 'Database entry successfully deleted from the database.'}
            </span>
          </div>
          <Link href={`/admin/database?table=${encodeURIComponent(currentTable)}&limit=${pageSize}&page=${validPage}`} className="hover:text-white">
            <X className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Table List */}
        <div className="lg:col-span-1 space-y-2">
          <div className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-wider mb-4 px-2 font-semibold">
            <Database className="w-3.5 h-3.5 text-[#5E5CE6]" />
            <span>Database Tables ({tables.length})</span>
          </div>
          <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {tables.map(t => {
              const isSelected = t === currentTable;
              return (
                <Link
                  key={t}
                  href={`/admin/database?table=${encodeURIComponent(t)}&limit=${pageSize}`}
                  className={`flex items-center justify-between p-3.5 text-xs transition-all rounded-none border ${
                    isSelected
                      ? 'border-[#5E5CE6] bg-[#5E5CE6]/10 text-white font-semibold'
                      : 'border-white/5 bg-white/[0.005] text-neutral-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <TableIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#5E5CE6]' : 'text-neutral-500'}`} />
                    <span className="truncate">{t}</span>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isSelected ? 'text-[#5E5CE6] translate-x-0.5' : 'text-neutral-600'}`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main Table / Edit / Create View */}
        <div className="lg:col-span-3 space-y-8">
          {/* Create Entry Form Panel */}
          {create === 'true' && (
            <div className="border border-emerald-500/30 bg-emerald-500/[0.02] p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-xl font-light tracking-tight text-white font-sans">
                    Create New Entry // <span className="font-mono text-xs text-emerald-500">{currentTable}</span>
                  </h2>
                </div>
                <Link
                  href={`/admin/database?${queryParamsPreserved}`}
                  className="border border-white/10 bg-white/[0.02] p-2 hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Link>
              </div>

              <form
                action={createDatabaseEntry.bind(null, currentTable)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tableColumns.map(col => {
                    const isProtected = col.name === '_' || col.name === 'createdAt' || col.name === 'updatedAt';

                    return (
                      <div key={col.name} className={`space-y-2 ${col.dataType.startsWith('json') ? 'md:col-span-2' : ''}`}>
                        <label htmlFor={`create_${col.name}`} className="flex items-center justify-between text-xs text-neutral-400">
                          <span>{col.name}</span>
                          {col.isPrimary && <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5">Primary Key</span>}
                          {isProtected && !col.isPrimary && <span className="text-[10px] text-neutral-500 bg-white/5 border border-white/10 px-2 py-0.5">Auto Timestamp</span>}
                        </label>

                        {isProtected ? (
                          <input
                            type="text"
                            id={`create_${col.name}`}
                            name={col.name}
                            defaultValue="Auto-generated by Database"
                            disabled
                            className="w-full border border-white/5 bg-white/[0.005] px-4 py-3.5 text-xs text-neutral-500 cursor-not-allowed rounded-none"
                          />
                        ) : col.dataType === 'boolean' ? (
                          <select
                            id={`create_${col.name}`}
                            name={col.name}
                            defaultValue="false"
                            className="w-full border border-white/10 bg-white/[0.01] px-4 py-3.5 text-xs text-white focus:border-emerald-500 focus:outline-none rounded-none"
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        ) : col.dataType.startsWith('json') ? (
                          <textarea
                            id={`create_${col.name}`}
                            name={col.name}
                            defaultValue={col.defaultVal}
                            rows={4}
                            className="w-full border border-white/10 bg-white/[0.01] p-4 text-xs text-white focus:border-emerald-500 focus:outline-none rounded-none"
                          />
                        ) : (
                          <input
                            type={col.dataType === 'number' || col.dataType === 'integer' || col.dataType === 'bigint' ? 'number' : 'text'}
                            id={`create_${col.name}`}
                            name={col.name}
                            defaultValue={col.defaultVal}
                            className="w-full border border-white/10 bg-white/[0.01] px-4 py-3.5 text-xs text-white focus:border-emerald-500 focus:outline-none rounded-none"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-end">
                  <SaveButton
                    label="Insert Database Entry"
                    savingLabel="Inserting Entry..."
                    savedLabel="Entry Created!"
                    className="px-10 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black"
                    icon="plus"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Edit Entry Form Panel */}
          {selectedRow && (
            <div className="border border-[#5E5CE6]/30 bg-[#5E5CE6]/[0.02] p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#5E5CE6]" />
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5 text-[#5E5CE6]" />
                  <h2 className="text-xl font-light tracking-tight text-white font-sans">
                    Edit Entry // <span className="font-mono text-xs text-[#5E5CE6]">{currentTable}</span>
                  </h2>
                </div>
                <Link
                  href={`/admin/database?${queryParamsPreserved}`}
                  className="border border-white/10 bg-white/[0.02] p-2 hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Link>
              </div>

              <form
                action={updateDatabaseEntry.bind(null, currentTable, getRowKey(currentTable, selectedRow), JSON.stringify(selectedRow))}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.keys(selectedRow).map(colName => {
                    const existingVal = selectedRow[colName];
                    const pkCols = getPrimaryKeyCols(currentTable, selectedRow);
                    const isPk = pkCols.includes(colName);
                    const isProtected = colName === '_' || colName === 'createdAt' || colName === 'updatedAt';

                    let displayVal = '';
                    if (existingVal instanceof Date) {
                      displayVal = existingVal.toISOString();
                    } else if (typeof existingVal === 'object' && existingVal !== null) {
                      displayVal = JSON.stringify(existingVal, null, 2);
                    } else if (existingVal !== null && existingVal !== undefined) {
                      displayVal = String(existingVal);
                    }

                    return (
                      <div key={colName} className={`space-y-2 ${typeof existingVal === 'object' && existingVal !== null ? 'md:col-span-2' : ''}`}>
                        <label htmlFor={`edit_${colName}`} className="flex items-center justify-between text-xs text-neutral-400">
                          <span>{colName}</span>
                          {isPk && <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5">Primary Key</span>}
                          {isProtected && !isPk && <span className="text-[10px] text-neutral-500 bg-white/5 border border-white/10 px-2 py-0.5">Automated</span>}
                        </label>

                        {isPk || isProtected ? (
                          <input
                            type="text"
                            id={`edit_${colName}`}
                            name={colName}
                            defaultValue={displayVal}
                            disabled
                            className="w-full border border-white/5 bg-white/[0.005] px-4 py-3.5 text-xs text-neutral-500 cursor-not-allowed rounded-none"
                          />
                        ) : typeof existingVal === 'boolean' ? (
                          <select
                            id={`edit_${colName}`}
                            name={colName}
                            defaultValue={existingVal ? 'true' : 'false'}
                            className="w-full border border-white/10 bg-white/[0.01] px-4 py-3.5 text-xs text-white focus:border-[#5E5CE6] focus:outline-none rounded-none"
                          >
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        ) : typeof existingVal === 'object' && existingVal !== null ? (
                          <textarea
                            id={`edit_${colName}`}
                            name={colName}
                            defaultValue={displayVal}
                            rows={4}
                            className="w-full border border-white/10 bg-white/[0.01] p-4 text-xs text-white focus:border-[#5E5CE6] focus:outline-none rounded-none"
                          />
                        ) : (
                          <input
                            type={typeof existingVal === 'number' ? 'number' : 'text'}
                            id={`edit_${colName}`}
                            name={colName}
                            defaultValue={displayVal}
                            className="w-full border border-white/10 bg-white/[0.01] px-4 py-3.5 text-xs text-white focus:border-[#5E5CE6] focus:outline-none rounded-none"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-end">
                  <SaveButton
                    label="Save Database Entry"
                    savingLabel="Saving Entry..."
                    savedLabel="Entry Saved!"
                    className="px-10"
                    icon="save"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Table Rows Explorer */}
          <div className="border border-white/10 bg-white/[0.01] p-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-[#5E5CE6]" />
                <h2 className="text-xl font-light tracking-tight text-white font-sans">
                  Table Explorer // <span className="font-mono text-xs text-[#5E5CE6]">{currentTable}</span>
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {/* Search Bar Form */}
                <form method="get" action="/admin/database" className="flex items-center border border-white/10 bg-white/[0.01] px-3 py-1.5 focus-within:border-[#5E5CE6] transition-colors">
                  <input type="hidden" name="table" value={currentTable} />
                  <input type="hidden" name="limit" value={pageSize} />
                  <Search className="w-4 h-4 text-neutral-500 mr-2" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search records..."
                    defaultValue={searchQuery}
                    className="bg-transparent text-xs text-white focus:outline-none w-48 lg:w-64 placeholder:text-neutral-600"
                  />
                  {searchQuery && (
                    <Link href={`/admin/database?table=${encodeURIComponent(currentTable)}&limit=${pageSize}`} className="text-neutral-500 hover:text-white ml-2">
                      <X className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </form>

                <span className="border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-neutral-400">
                  {filteredRows.length} {filteredRows.length === 1 ? 'Entry' : 'Entries'} Found
                </span>
                <Link
                  href={`/admin/database?table=${encodeURIComponent(currentTable)}&create=true&limit=${pageSize}&page=${validPage}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`}
                  className="inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all uppercase tracking-wider font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Entry</span>
                </Link>
              </div>
            </div>

            {fetchError ? (
              <div className="border border-red-500/20 bg-red-500/10 p-8 text-center text-red-400 text-xs">
                {fetchError}
              </div>
            ) : rows.length === 0 ? (
              <div className="border border-white/5 bg-white/[0.005] p-16 text-center text-xs space-y-4">
                <p className="text-neutral-500">No records found in table <code className="text-[#5E5CE6]">{currentTable}</code>.</p>
                <p className="text-neutral-400 text-sm">Click <Link href={`/admin/database?table=${encodeURIComponent(currentTable)}&create=true&limit=${pageSize}`} className="text-emerald-400 underline hover:text-emerald-300">Create New Entry</Link> above to insert the first record.</p>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="border border-white/5 bg-white/[0.005] p-16 text-center text-xs space-y-4">
                <p className="text-neutral-500">No records matching <code className="text-[#5E5CE6]">"{searchQuery}"</code> found in table <code className="text-[#5E5CE6]">{currentTable}</code>.</p>
                <p className="text-neutral-400 text-sm">Click <Link href={`/admin/database?table=${encodeURIComponent(currentTable)}&limit=${pageSize}`} className="text-emerald-400 underline hover:text-emerald-300">Clear Search</Link> to view all {rows.length} records.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="overflow-x-auto custom-scrollbar border border-white/5">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02] text-neutral-400 uppercase tracking-wider text-[10px]">
                        <th className="p-4 py-3 min-w-[160px]">Actions</th>
                        {tableColumns.map(col => (
                          <th key={col.name} className="p-4 py-3">{col.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-neutral-300">
                      {paginatedRows.map((row, idx) => {
                        const rowKey = getRowKey(currentTable, row);
                        const isBeingEdited = edit && rowKey === decodeURIComponent(edit);
                        return (
                          <tr
                            key={idx}
                            className={`hover:bg-white/[0.02] transition-colors ${isBeingEdited ? 'bg-[#5E5CE6]/10 font-semibold' : ''}`}
                          >
                            <td className="p-4 whitespace-nowrap flex items-center gap-2">
                              <Link
                                href={`/admin/database?table=${encodeURIComponent(currentTable)}&edit=${encodeURIComponent(rowKey)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}&limit=${pageSize}&page=${validPage}`}
                                className="inline-flex items-center gap-1.5 border border-[#5E5CE6]/40 bg-[#5E5CE6]/10 px-3 py-1.5 text-[10px] text-[#5E5CE6] hover:bg-[#5E5CE6] hover:text-black transition-all uppercase tracking-wider"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Edit</span>
                              </Link>
                              <form action={deleteDatabaseEntry.bind(null, currentTable, rowKey)}>
                                <button
                                  type="submit"
                                  className="inline-flex items-center gap-1.5 border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-[10px] text-red-400 hover:bg-red-500 hover:text-black transition-all uppercase tracking-wider"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </form>
                            </td>
                            {tableColumns.map(col => {
                              const val = row[col.name];
                              let textVal = '';
                              if (val instanceof Date) {
                                textVal = val.toLocaleDateString() + ' ' + val.toLocaleTimeString();
                              } else if (typeof val === 'boolean') {
                                textVal = val ? 'True' : 'False';
                              } else if (typeof val === 'object' && val !== null) {
                                textVal = JSON.stringify(val);
                              } else {
                                textVal = String(val ?? '');
                              }

                              return (
                                <td key={col.name} className="p-4 max-w-[200px] truncate whitespace-nowrap">
                                  {typeof val === 'boolean' ? (
                                    <span className={`px-2 py-0.5 text-[10px] border ${val ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-neutral-500/30 bg-neutral-500/10 text-neutral-400'}`}>
                                      {textVal}
                                    </span>
                                  ) : (
                                    textVal
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-white/5 pt-6 gap-4 text-xs text-neutral-400">
                  <div className="flex flex-wrap items-center gap-4">
                    <span>
                      Showing {(validPage - 1) * pageSize + 1} - {Math.min(validPage * pageSize, filteredRows.length)} of {filteredRows.length} entries
                    </span>
                    <div className="flex items-center gap-2">
                      <label htmlFor="perPage">Rows per page:</label>
                      <form method="get" action="/admin/database" className="flex items-center gap-1">
                        <input type="hidden" name="table" value={currentTable} />
                        {searchQuery && <input type="hidden" name="q" value={searchQuery} />}
                        <select
                          id="perPage"
                          name="limit"
                          defaultValue={pageSize}
                          className="bg-white/[0.02] border border-white/10 text-white px-2 py-1.5 text-xs focus:border-[#5E5CE6] focus:outline-none"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        <button type="submit" className="border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[10px] text-neutral-300 hover:border-[#5E5CE6] hover:text-white transition-colors uppercase tracking-wider font-semibold">
                          Set
                        </button>
                      </form>
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/database?table=${encodeURIComponent(currentTable)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}&limit=${pageSize}&page=${validPage - 1}`}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 border transition-colors ${validPage <= 1 ? 'border-white/5 text-neutral-600 pointer-events-none' : 'border-white/10 bg-white/[0.02] text-neutral-300 hover:border-[#5E5CE6] hover:text-white'}`}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Prev</span>
                      </Link>
                      <span className="px-4 py-1.5 border border-[#5E5CE6]/40 bg-[#5E5CE6]/10 text-[#5E5CE6] font-semibold">
                        Page {validPage} of {totalPages}
                      </span>
                      <Link
                        href={`/admin/database?table=${encodeURIComponent(currentTable)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}&limit=${pageSize}&page=${validPage + 1}`}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 border transition-colors ${validPage >= totalPages ? 'border-white/5 text-neutral-600 pointer-events-none' : 'border-white/10 bg-white/[0.02] text-neutral-300 hover:border-[#5E5CE6] hover:text-white'}`}
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
