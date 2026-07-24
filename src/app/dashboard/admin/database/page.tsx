"use client";

import { useState, useEffect, useCallback } from"react";
import { Search, Database, ChevronLeft, ChevronRight, Edit2, Trash2, Plus, Loader2 } from"lucide-react";
import { getTablesList, fetchTableData, deleteRecord, createRecord, updateRecord } from"./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from"@/components/ui/dialog";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";

export default function DatabaseBrowser() {
 const [tables, setTables] = useState<string[]>([]);
 const [selectedTable, setSelectedTable] = useState<string | null>(null);
 
 const [data, setData] = useState<any[]>([]);
 const [columns, setColumns] = useState<string[]>([]);
 const [total, setTotal] = useState(0);
 const [page, setPage] = useState(1);
 const pageSize = 20;
 
 const [sortBy, setSortBy] = useState<string>("");
 const [sortOrder, setSortOrder] = useState<"asc"|"desc">("asc");

 const [searchQuery, setSearchQuery] = useState("");
 const [debouncedSearch, setDebouncedSearch] = useState("");
 const [isLoading, setIsLoading] = useState(true);

 // Dialog state
 const [isDialogOpen, setIsDialogOpen] = useState(false);
 const [editingRecord, setEditingRecord] = useState<any | null>(null); // null means create mode
 const [formData, setFormData] = useState<Record<string, string>>({});

 useEffect(() => {
 getTablesList().then(list => {
 setTables(list);
 if (list.length > 0) {
 setSelectedTable(list[0]);
 }
 });
 }, []);

 useEffect(() => {
 const handler = setTimeout(() => {
 setDebouncedSearch(searchQuery);
 setPage(1); // Reset page on new search
 }, 300);
 return () => clearTimeout(handler);
 }, [searchQuery]);

 const loadData = useCallback(async () => {
 if (!selectedTable) return;
 setIsLoading(true);
 try {
 const result = await fetchTableData(selectedTable, page, pageSize, sortBy, sortOrder, debouncedSearch);
 setData(result.data);
 setColumns(result.columns);
 setTotal(result.total);
 } catch (error) {
 console.error(error);
 } finally {
 setIsLoading(false);
 }
 }, [selectedTable, page, sortBy, sortOrder, debouncedSearch]);

 useEffect(() => {
 loadData();
 }, [loadData]);

 const handleDelete = async (record: any) => {
 if (!selectedTable) return;
 if (!confirm("Are you sure you want to delete this record?")) return;
 
 // Assume id is the primary key for deletion if it exists
 const identifier = record.id ? { id: record.id } : record;
 const previousData = [...data];
 
 // Optimistic UI update
 setData(data.filter(r => r !== record));
 setTotal(t => Math.max(0, t - 1));

 try {
 await deleteRecord(selectedTable, identifier);
 } catch (e) {
 // Revert on error
 setData(previousData);
 setTotal(t => t + 1);
 alert("Error deleting record");
 console.error(e);
 }
 };

 const openCreateDialog = () => {
 setEditingRecord(null);
 const initialForm: Record<string, string> = {};
 columns.forEach(col => { initialForm[col] =""; });
 setFormData(initialForm);
 setIsDialogOpen(true);
 };

 const openEditDialog = (record: any) => {
 setEditingRecord(record);
 const initialForm: Record<string, string> = {};
 columns.forEach(col => { 
 if (record[col] === null) {
 initialForm[col] ="";
 } else if (typeof record[col] === 'object') {
 initialForm[col] = JSON.stringify(record[col]);
 } else {
 initialForm[col] = String(record[col]); 
 }
 });
 setFormData(initialForm);
 setIsDialogOpen(true);
 };

 const handleSave = async () => {
 if (!selectedTable) return;
 
 const parsedData: Record<string, any> = { ...formData };
 for (const key in parsedData) {
 if (parsedData[key] ==="") parsedData[key] = null;
 }

 const previousData = [...data];
 if (editingRecord) {
 // Optimistic update
 setData(data.map(r => r === editingRecord ? { ...r, ...parsedData } : r));
 }

 try {
 if (editingRecord) {
 const identifier = editingRecord.id ? { id: editingRecord.id } : editingRecord;
 await updateRecord(selectedTable, identifier, parsedData);
 } else {
 await createRecord(selectedTable, parsedData);
 }
 setIsDialogOpen(false);
 loadData();
 } catch (e) {
 if (editingRecord) {
 setData(previousData); // revert
 }
 alert("Error saving record. Make sure all required fields are valid.");
 console.error(e);
 }
 };

 return (
 <div className="p-8 max-w-7xl mx-auto space-y-6">
 <div>
 <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
 <Database className="w-8 h-8 text-primary"/>
 Database Browser
 </h1>
 <p className="text-muted-foreground mt-2">Manage PostgreSQL tables and records.</p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
 {/* Table Selector */}
 <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col gap-2 h-[calc(100vh-200px)]">
 <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Tables</h3>
 <div className="space-y-1 overflow-y-auto flex-1">
 {tables.map(table => (
 <button 
 key={table}
 onClick={() => {
 setSelectedTable(table);
 setPage(1);
 }}
 className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedTable === table ? 'bg-primary/20 text-primary font-medium' : 'hover:bg-muted/50 text-foreground'}`}
 >
 {table}
 </button>
 ))}
 </div>
 </div>

 {/* Data View */}
 <div className="lg:col-span-3 bg-card border border-border/50 rounded-xl flex flex-col h-[calc(100vh-200px)]">
 <div className="p-4 border-b border-border/50 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <h2 className="text-xl font-bold text-foreground">{selectedTable ||"Select a table"}</h2>
 <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium text-muted-foreground">{total} records</span>
 </div>
 <div className="flex items-center gap-3">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
 <input 
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Filter records..."
 className="w-64 bg-background/50 border border-border/50 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
 />
 </div>
 <button 
 onClick={openCreateDialog}
 disabled={!selectedTable}
 className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
 <Plus className="w-4 h-4"/>
 New Record
 </button>
 </div>
 </div>
 
 <div className="flex-1 overflow-auto p-0">
 {isLoading ? (
 <div className="flex h-full items-center justify-center">
 <Loader2 className="w-8 h-8 animate-spin text-primary"/>
 </div>
 ) : (
 <table className="w-full text-sm text-left">
 <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0">
 <tr>
 {columns.map(col => (
 <th 
 key={col} 
 className="px-6 py-3 font-medium cursor-pointer hover:bg-muted/80 transition-colors"
 onClick={() => {
 if (sortBy === col) {
 setSortOrder(sortOrder ==="asc"?"desc":"asc");
 } else {
 setSortBy(col);
 setSortOrder("asc");
 }
 }}
 >
 <div className="flex items-center gap-1">
 {col}
 {sortBy === col && (
 <span className="text-[10px]">
 {sortOrder ==="asc"?"▲":"▼"}
 </span>
 )}
 </div>
 </th>
 ))}
 <th className="px-6 py-3 text-right font-medium">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border/50">
 {data.map((row, i) => (
 <tr key={i} className="hover:bg-muted/20 transition-colors group">
 {columns.map(col => (
 <td key={col} className="px-6 py-4 truncate max-w-[200px]"title={row[col] && typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ??"NULL")}>
 {row[col] === null ? <span className="text-muted-foreground italic">Null</span> : (typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col]))}
 </td>
 ))}
 <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
 <button 
 onClick={() => openEditDialog(row)}
 className="p-1.5 text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-primary/10 mr-2">
 <Edit2 className="w-4 h-4"/>
 </button>
 <button 
 onClick={() => handleDelete(row)}
 className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-destructive/10">
 <Trash2 className="w-4 h-4"/>
 </button>
 </td>
 </tr>
 ))}
 {data.length === 0 && (
 <tr>
 <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-muted-foreground">
 No records found
 </td>
 </tr>
 )}
 </tbody>
 </table>
 )}
 </div>
 
 <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/20">
 <p className="text-sm text-muted-foreground">
 Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total} records
 </p>
 <div className="flex items-center gap-2">
 <button 
 onClick={() => setPage(p => Math.max(1, p - 1))}
 disabled={page === 1}
 className="p-1.5 border border-border/50 rounded-md text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50">
 <ChevronLeft className="w-4 h-4"/>
 </button>
 <button 
 onClick={() => setPage(p => p + 1)}
 disabled={page * pageSize >= total}
 className="p-1.5 border border-border/50 rounded-md text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50">
 <ChevronRight className="w-4 h-4"/>
 </button>
 </div>
 </div>
 </div>
 </div>

 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
 <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
 <DialogHeader>
 <DialogTitle>{editingRecord ?"Edit Record":"New Record"}</DialogTitle>
 </DialogHeader>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
 {columns.map(col => (
 <div key={col} className="space-y-1">
 <label className="text-xs font-medium text-muted-foreground">{col}</label>
 <Input 
 value={formData[col] ||""}
 onChange={(e) => setFormData({ ...formData, [col]: e.target.value })}
 placeholder="NULL"
 className="bg-background/50"
 />
 </div>
 ))}
 </div>
 <DialogFooter>
 <Button variant="outline"onClick={() => setIsDialogOpen(false)}>Cancel</Button>
 <Button onClick={handleSave}>Save</Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </div>
 );
}
