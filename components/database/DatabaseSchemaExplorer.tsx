'use client';

import React, { useState } from 'react';
import { MONGO_SCHEMAS, SCHEMA_RELATIONSHIPS } from '@/lib/schema-metadata';
import {
  Database,
  Key,
  Link as LinkIcon,
  Search,
  Code2,
  Table as TableIcon,
  FileJson,
  Copy,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';

interface DatabaseSchemaExplorerProps {
  liveData: {
    user: any[];
    menu: any[];
    food: any[];
    table: any[];
    order: any[];
    orderItem: any[];
    invoice: any[];
    notes: any[];
  };
}

export const DatabaseSchemaExplorer: React.FC<DatabaseSchemaExplorerProps> = ({
  liveData,
}) => {
  const [activeCollection, setActiveCollection] = useState<string>('food');
  const [activeTab, setActiveTab] = useState<'SCHEMA' | 'LIVE_DOCUMENTS' | 'ER_RELATIONSHIPS' | 'PIPELINES'>('SCHEMA');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  const currentSchema = MONGO_SCHEMAS[activeCollection];
  const currentDocs = (liveData as any)[activeCollection] || [];

  const filteredDocs = currentDocs.filter((doc: any) => {
    if (!searchTerm) return true;
    const str = JSON.stringify(doc).toLowerCase();
    return str.includes(searchTerm.toLowerCase());
  });

  const handleCopyJson = (doc: any, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(doc, null, 2));
    setCopiedDocId(id);
    setTimeout(() => setCopiedDocId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-5 lg:p-6 gap-6 bg-[#f1f5f9] overflow-y-auto font-sans">
      {/* Top Banner matching NEW PROJECT */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              MongoDB Database & BSON Schema Explorer
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Engine: MongoDB 7.0+ • Driver: <code className="text-blue-700 font-bold">go.mongodb.org/mongo-driver</code> • Database: <code className="text-blue-700 font-bold">booking_oq</code>
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {[
            { id: 'SCHEMA', label: 'Field Schema', icon: <TableIcon className="w-3.5 h-3.5" /> },
            { id: 'LIVE_DOCUMENTS', label: 'Live Documents', icon: <FileJson className="w-3.5 h-3.5" /> },
            { id: 'ER_RELATIONSHIPS', label: 'Entity Graph', icon: <GitBranch className="w-3.5 h-3.5" /> },
            { id: 'PIPELINES', label: 'Aggregation Pipelines', icon: <Code2 className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Collections Rail on Left + Detailed View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left Rail: Collections List */}
        <div className="lg:col-span-3 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block px-1 font-mono">
            MongoDB Collections (8)
          </span>

          {Object.entries(MONGO_SCHEMAS).map(([key, schema]) => {
            const isSelected = activeCollection === key;
            const docCount = (liveData as any)[key]?.length || 0;

            return (
              <button
                key={key}
                onClick={() => setActiveCollection(key)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-300 shadow-2xs'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    <strong className={`text-xs font-mono ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                      {schema.collectionName}
                    </strong>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5 truncate max-w-[180px]">
                    {schema.displayTitle}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    {docCount} docs
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Content: Schema Specs / Documents / ER Diagram */}
        <div className="lg:col-span-9 bg-white border border-slate-200/90 rounded-xl p-5 flex flex-col justify-between shadow-2xs overflow-hidden">
          {/* TAB 1: FIELD SCHEMA TABLE */}
          {activeTab === 'SCHEMA' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 uppercase font-mono">
                      Collection: {currentSchema.collectionName} ({currentSchema.displayTitle})
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-200 font-mono font-semibold">
                      API: {currentSchema.endpoint}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentSchema.description}
                  </p>
                </div>
              </div>

              {/* Fields Table matching NEW PROJECT */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase border-b border-slate-200">
                      <th className="py-2.5 px-3">Field Name</th>
                      <th className="py-2.5 px-3">BSON Type</th>
                      <th className="py-2.5 px-3">Key Constraint</th>
                      <th className="py-2.5 px-3">Validation Rules</th>
                      <th className="py-2.5 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {currentSchema.fields.map((f) => (
                      <tr key={f.name} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-bold text-slate-900 font-mono flex items-center gap-1.5">
                          {f.isPrimaryKey && <Key className="w-3 h-3 text-amber-500" />}
                          {f.isForeignKey && <LinkIcon className="w-3 h-3 text-blue-500" />}
                          <span>{f.name}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium">
                            {f.bsonType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {f.isPrimaryKey ? (
                            <span className="text-amber-700 font-bold text-[10px]">PRIMARY KEY</span>
                          ) : f.isForeignKey ? (
                            <span className="text-blue-700 font-semibold text-[10px]">
                              FK → {f.references}
                            </span>
                          ) : f.required ? (
                            <span className="text-slate-700 text-[10px]">REQUIRED</span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">OPTIONAL</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-[10px] text-slate-600 font-mono">
                          {f.validationRules ? (
                            <code className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-800">
                              {f.validationRules}
                            </code>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-slate-600 leading-relaxed">
                          {f.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Indexes */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 font-mono">
                  Configured Collection Indexes:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {currentSchema.indexes.map((idx) => (
                    <div
                      key={idx.name}
                      className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 flex items-center gap-1.5"
                    >
                      <span className="text-blue-700 font-semibold">{idx.name}</span>
                      <span className="text-slate-400">({idx.keys.join(', ')})</span>
                      {idx.unique && (
                        <span className="text-[9px] px-1 rounded bg-amber-100 text-amber-800 border border-amber-200 font-bold">
                          UNIQUE
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE DOCUMENTS BROWSER */}
          {activeTab === 'LIVE_DOCUMENTS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 uppercase font-mono">
                    Collection Documents: {currentSchema.collectionName}
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {filteredDocs.length} Documents Loaded
                  </span>
                </div>

                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search documents JSON..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredDocs.map((doc: any, index: number) => {
                  const docId = doc._id || doc.food_id || doc.table_id || doc.order_id || index;
                  const isCopied = copiedDocId === docId;

                  return (
                    <div
                      key={docId}
                      className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 transition-all"
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Doc #{index + 1}</span>
                          <span className="text-slate-900 font-bold">
                            _id: {doc._id || 'primitive.ObjectID'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleCopyJson(doc, docId)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-sans font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                        >
                          {isCopied ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy JSON</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="text-[11px] font-mono text-slate-800 overflow-x-auto p-2.5 bg-white rounded-lg border border-slate-200 leading-relaxed">
                        {JSON.stringify(doc, null, 2)}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: ER RELATIONSHIPS GRAPH */}
          {activeTab === 'ER_RELATIONSHIPS' && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase font-mono">
                  Entity Relationships & Foreign Key Graph
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual mapping of relational constraints maintained across Go application layer and MongoDB collections.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SCHEMA_RELATIONSHIPS.map((rel, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all font-mono"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
                      <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                        {rel.from}
                      </span>
                      <span className="text-slate-400 text-xs font-bold">──────►</span>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {rel.to}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div>
                        <span className="text-slate-400">Foreign Key:</span>{' '}
                        <code className="text-blue-700 font-bold">{rel.from}.{rel.fromField}</code>
                      </div>
                      <div>
                        <span className="text-slate-400">References:</span>{' '}
                        <code className="text-emerald-700 font-bold">{rel.to}.{rel.toField}</code>
                      </div>
                      <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200 font-sans">
                        Constraint: <strong className="text-slate-800">{rel.label}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed font-sans">
                <span className="text-slate-900 font-bold block uppercase font-mono">
                  Architecture Overview:
                </span>
                <p>
                  1. A <strong>Table</strong> hosts an active <strong>Order</strong> session.<br />
                  2. The <strong>Order</strong> contains multiple <strong>OrderItems</strong>, each referencing a <strong>Food</strong> item.<br />
                  3. Each <strong>Food</strong> item belongs to a parent <strong>Menu</strong> category.<br />
                  4. The <strong>Order</strong> is settled through a single <strong>Invoice</strong> (Cash or Card tender).<br />
                  5. <strong>Users</strong> (Staff / Admin) authenticate with JWT tokens to supervise and operate all collections.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: MONGODB AGGREGATION PIPELINES */}
          {activeTab === 'PIPELINES' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 uppercase font-mono">
                  Golang Gin MongoDB Aggregation Pipelines
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect the native MongoDB aggregation pipelines executed inside <code className="text-blue-700 font-mono">controllers/orderItemsController.go</code> and <code className="text-blue-700 font-mono">controllers/foodController.go</code>.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-900">
                      ItemsByOrder(order_id) Pipeline — Multi-Collection Lookup & Calculation
                    </span>
                    <span className="text-[10px] text-slate-400">
                      orderItemsController.go : L59
                    </span>
                  </div>

                  <pre className="text-[11px] text-slate-800 p-3 bg-white rounded-lg border border-slate-200 overflow-x-auto leading-relaxed">
{`mongo.Pipeline{
  // 1. Filter line items for specific order
  bson.D{{"$match", bson.D{{"order_id", id}}}},

  // 2. Join Food details
  bson.D{{"$lookup", bson.D{{"from", "food"}, {"localField", "food_id"}, {"foreignField", "food_id"}, {"as", "food"}}}},
  bson.D{{"$unwind", bson.D{{"path", "$food"}, {"preserveNullAndEmptyArrays", true}}}},

  // 3. Join Order header
  bson.D{{"$lookup", bson.D{{"from", "order"}, {"localField", "order_id"}, {"foreignField", "order_id"}, {"as", "order"}}}},
  bson.D{{"$unwind", bson.D{{"path", "$order"}, {"preserveNullAndEmptyArrays", true}}}},

  // 4. Join Table details
  bson.D{{"$lookup", bson.D{{"from", "table"}, {"localField", "order.table_id"}, {"foreignField", "table_id"}, {"as", "table"}}}},
  bson.D{{"$unwind", bson.D{{"path", "$table"}, {"preserveNullAndEmptyArrays", true}}}},

  // 5. Calculate Payment Due with $sum and group line items
  bson.D{{"$group", bson.D{
    {"_id", bson.D{{"order_id", "$order_id"}, {"table_id", "$table_id"}, {"table_number", "$table_number"}}},
    {"payment_due", bson.D{{"$sum", "$amount"}}},
    {"total_count", bson.D{{"$sum", 1}}},
    {"order_items", bson.D{{"$push", "$$ROOT"}}},
  }}},
}`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-900">
                      GetFoods() Pipeline — Server-side Slicing & Total Counting
                    </span>
                    <span className="text-[10px] text-slate-400">
                      foodController.go : L43
                    </span>
                  </div>

                  <pre className="text-[11px] text-slate-800 p-3 bg-white rounded-lg border border-slate-200 overflow-x-auto leading-relaxed">
{`mongo.Pipeline{
  bson.D{{"$match", bson.D{{}}}},
  bson.D{{"$group", bson.D{
    {"_id", nil},
    {"total_count", bson.D{{"$sum", 1}}},
    {"data", bson.D{{"$push", "$$ROOT"}}},
  }}},
  bson.D{{"$project", bson.D{
    {"_id", 0},
    {"total_count", 1},
    {"food_items", bson.D{{"$slice", []interface{}{"$data", startIndex, recordPerPage}}}},
  }}},
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
