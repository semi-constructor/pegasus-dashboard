"use server";

import { db } from"@/lib/db";
import * as schemas from"../../../../../schemas";
import { sql, asc, desc, ilike, or, eq, isNull, and, getTableColumns } from"drizzle-orm";
import { PgTable } from"drizzle-orm/pg-core";

export async function getTablesList() {
 const tableNames = [];
 for (const [key, value] of Object.entries(schemas)) {
 if (value instanceof PgTable || (value && typeof value === 'object' && value.constructor && value.constructor.name.includes('Table'))) {
 tableNames.push(key);
 }
 }
 return tableNames;
}

export async function fetchTableData(
 tableName: string,
 page: number = 1,
 pageSize: number = 20,
 sortBy: string ="",
 sortOrder:"asc"|"desc"="asc",
 searchQuery: string =""
) {
 const table = (schemas as any)[tableName] as PgTable | undefined;
 if (!table) {
 throw new Error(`Table ${tableName} not found`);
 }

 const columns = getTableColumns(table);
 const offset = (page - 1) * pageSize;

 let queryBuilder = db.select().from(table);
 let countQueryBuilder = db.select({ count: sql<number>`count(*)` }).from(table);

 if (searchQuery) {
 const searchConditions = [];
 for (const [colName, colDef] of Object.entries(columns)) {
 if (colDef.dataType ==="string") {
 searchConditions.push(ilike(colDef, `%${searchQuery}%`));
 }
 }
 
 if (searchConditions.length > 0) {
 const orCondition = or(...searchConditions);
 queryBuilder = queryBuilder.where(orCondition) as any;
 countQueryBuilder = countQueryBuilder.where(orCondition) as any;
 }
 }

 if (sortBy && columns[sortBy]) {
 const orderFn = sortOrder ==="desc"? desc : asc;
 queryBuilder = queryBuilder.orderBy(orderFn(columns[sortBy])) as any;
 }

 queryBuilder = queryBuilder.limit(pageSize).offset(offset) as any;

 const [data, [{ count }]] = await Promise.all([
 queryBuilder,
 countQueryBuilder,
 ]);

 return {
 data,
 total: Number(count),
 columns: Object.keys(columns),
 };
}

// Basic helper to build where condition for CRUD from an identifier object
function buildWhereCondition(table: any, columns: any, identifier: Record<string, any>) {
 const conditions = [];
 for (const [key, value] of Object.entries(identifier)) {
 if (columns[key]) {
 if (value === null) {
 conditions.push(isNull(columns[key]));
 } else {
 conditions.push(eq(columns[key], value));
 }
 }
 }
 return conditions.length > 0 ? and(...conditions) : undefined;
}

export async function createRecord(tableName: string, data: Record<string, any>) {
 const table = (schemas as any)[tableName] as PgTable | undefined;
 if (!table) throw new Error(`Table ${tableName} not found`);

 // Remove empty strings if they are meant to be null for non-string types?
 // We'll let Drizzle handle type coercions or errors for now.
 await db.insert(table).values(data);
}

export async function updateRecord(tableName: string, identifier: Record<string, any>, data: Record<string, any>) {
 const table = (schemas as any)[tableName] as PgTable | undefined;
 if (!table) throw new Error(`Table ${tableName} not found`);

 const columns = getTableColumns(table);
 const condition = buildWhereCondition(table, columns, identifier);
 
 if (!condition) throw new Error("No valid identifier provided for update");

 await db.update(table).set(data).where(condition);
}

export async function deleteRecord(tableName: string, identifier: Record<string, any>) {
 const table = (schemas as any)[tableName] as PgTable | undefined;
 if (!table) throw new Error(`Table ${tableName} not found`);

 const columns = getTableColumns(table);
 const condition = buildWhereCondition(table, columns, identifier);
 
 if (!condition) throw new Error("No valid identifier provided for delete");

 await db.delete(table).where(condition);
}
