export interface SchemaField {
  name: string;
  bsonType: 'objectId' | 'string' | 'int32' | 'double' | 'date' | 'array' | 'bool';
  required: boolean;
  validationRules?: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: string;
  description: string;
}

export interface CollectionSchema {
  collectionName: string;
  displayTitle: string;
  description: string;
  endpoint: string;
  primaryKey: string;
  indexes: { name: string; keys: string[]; unique?: boolean }[];
  fields: SchemaField[];
}

export const MONGO_SCHEMAS: Record<string, CollectionSchema> = {
  user: {
    collectionName: 'user',
    displayTitle: 'User Accounts & Roles',
    description: 'Stores authenticated staff, managers, and system administrators with bcrypt password hashes and dual JWT tokens.',
    endpoint: '/users',
    primaryKey: 'user_id',
    indexes: [
      { name: '_id_', keys: ['_id'], unique: true },
      { name: 'email_unique', keys: ['email'], unique: true },
      { name: 'phone_unique', keys: ['phone'], unique: true },
      { name: 'user_id_idx', keys: ['user_id'], unique: true },
    ],
    fields: [
      { name: '_id', bsonType: 'objectId', required: true, isPrimaryKey: true, description: 'MongoDB internal unique document identifier' },
      { name: 'user_id', bsonType: 'string', required: true, isPrimaryKey: true, description: 'Public UUID representation of the user entity' },
      { name: 'first_name', bsonType: 'string', required: true, validationRules: 'min=2, max=100', description: "User's legal given name" },
      { name: 'last_name', bsonType: 'string', required: true, validationRules: 'min=2, max=100', description: "User's family name" },
      { name: 'password', bsonType: 'string', required: true, validationRules: 'min=6, bcrypt salted hash (cost 14)', description: 'Cryptographic hash of user password' },
      { name: 'email', bsonType: 'string', required: true, validationRules: 'RFC 5322 Email regex, unique', description: 'Primary login and notification email' },
      { name: 'phone', bsonType: 'string', required: true, validationRules: 'Unique phone string', description: 'Contact telephone number' },
      { name: 'user_type', bsonType: 'string', required: true, validationRules: 'ADMIN | USER', description: 'Role-based access control level' },
      { name: 'token', bsonType: 'string', required: false, description: 'Active signed HS256 JWT access token (24h lifespan)' },
      { name: 'refresh_token', bsonType: 'string', required: false, description: 'Long-lived refresh token for token renewal (168h lifespan)' },
      { name: 'avatar', bsonType: 'string', required: false, description: 'URL or path to profile avatar' },
      { name: 'created_at', bsonType: 'date', required: true, description: 'Account creation timestamp (RFC3339)' },
      { name: 'updated_at', bsonType: 'date', required: true, description: 'Last record update timestamp' },
    ],
  },
  menu: {
    collectionName: 'menu',
    displayTitle: 'Menu Categories',
    description: 'High-level dining menu categorizations (e.g. Starters, Grills, Pastas, Beverages) with active seasonal date bounds.',
    endpoint: '/menus',
    primaryKey: 'menu_id',
    indexes: [
      { name: '_id_', keys: ['_id'], unique: true },
      { name: 'menu_id_idx', keys: ['menu_id'], unique: true },
    ],
    fields: [
      { name: '_id', bsonType: 'objectId', required: true, isPrimaryKey: true, description: 'MongoDB ObjectID' },
      { name: 'menu_id', bsonType: 'string', required: true, isPrimaryKey: true, description: 'Public identifier for menu grouping' },
      { name: 'name', bsonType: 'string', required: true, description: 'Menu title (e.g. Dinner Tasting Menu)' },
      { name: 'category', bsonType: 'string', required: true, description: 'Category identifier (e.g. Appetizer, Main, Dessert)' },
      { name: 'start_date', bsonType: 'date', required: false, description: 'Valid start date for seasonal offerings' },
      { name: 'end_date', bsonType: 'date', required: false, description: 'Valid end date for seasonal offerings' },
      { name: 'created_at', bsonType: 'date', required: true, description: 'Creation ISO date' },
      { name: 'updated_at', bsonType: 'date', required: true, description: 'Last modified ISO date' },
    ],
  },
  food: {
    collectionName: 'food',
    displayTitle: 'Food Items Catalog',
    description: 'Culinary items offered by the kitchen, associated with a parent menu category, baseline pricing, and portion metadata.',
    endpoint: '/foods',
    primaryKey: 'food_id',
    indexes: [
      { name: '_id_', keys: ['_id'], unique: true },
      { name: 'food_id_idx', keys: ['food_id'], unique: true },
      { name: 'menu_id_fk', keys: ['menu_id'] },
    ],
    fields: [
      { name: '_id', bsonType: 'objectId', required: true, isPrimaryKey: true, description: 'MongoDB ObjectID' },
      { name: 'food_id', bsonType: 'string', required: true, isPrimaryKey: true, description: 'Public Unique food reference' },
      { name: 'name', bsonType: 'string', required: true, validationRules: 'min=2, max=100', description: 'Dish name (e.g. Prime Black Angus Ribeye)' },
      { name: 'price', bsonType: 'double', required: true, validationRules: 'Decimal rounded to 2 digits', description: 'Base retail unit price' },
      { name: 'food_image', bsonType: 'string', required: true, description: 'URI or visual icon key for presentation' },
      { name: 'menu_id', bsonType: 'string', required: true, isForeignKey: true, references: 'menu.menu_id', description: 'Foreign key to parent Menu collection' },
      { name: 'created_at', bsonType: 'date', required: true, description: 'Creation timestamp' },
      { name: 'updated_at', bsonType: 'date', required: true, description: 'Last updated timestamp' },
    ],
  },
  table: {
    collectionName: 'table',
    displayTitle: 'Dining Tables & Floor Layout',
    description: 'Physical dining tables across floor sections with seating capacities, table numbers, and real-time occupancy states.',
    endpoint: '/tables',
    primaryKey: 'table_id',
    indexes: [
      { name: '_id_', keys: ['_id'], unique: true },
      { name: 'table_id_idx', keys: ['table_id'], unique: true },
      { name: 'table_number_unique', keys: ['table_number'], unique: true },
    ],
    fields: [
      { name: '_id', bsonType: 'objectId', required: true, isPrimaryKey: true, description: 'MongoDB ObjectID' },
      { name: 'table_id', bsonType: 'string', required: true, isPrimaryKey: true, description: 'Public UUID for table reference' },
      { name: 'table_number', bsonType: 'int32', required: true, validationRules: 'Positive integer', description: 'Physical floor table numbering (e.g. Table 1, Table 2)' },
      { name: 'number_of_guests', bsonType: 'int32', required: true, validationRules: 'Positive integer', description: 'Max seating capacity for the table' },
      { name: 'created_at', bsonType: 'date', required: true, description: 'Creation timestamp' },
      { name: 'updated_at', bsonType: 'date', required: true, description: 'Last updated timestamp' },
    ],
  },
  order: {
    collectionName: 'order',
    displayTitle: 'Order Headers',
    description: 'Parent order record linking an active dining party at a specific table with ordering timestamps.',
    endpoint: '/orders',
    primaryKey: 'order_id',
    indexes: [
      { name: '_id_', keys: ['_id'], unique: true },
      { name: 'order_id_idx', keys: ['order_id'], unique: true },
      { name: 'table_id_fk', keys: ['table_id'] },
    ],
    fields: [
      { name: '_id', bsonType: 'objectId', required: true, isPrimaryKey: true, description: 'MongoDB ObjectID' },
      { name: 'order_id', bsonType: 'string', required: true, isPrimaryKey: true, description: 'Public UUID identifying this table session' },
      { name: 'table_id', bsonType: 'string', required: true, isForeignKey: true, references: 'table.table_id', description: 'Foreign key to Table collection' },
      { name: 'order_date', bsonType: 'date', required: true, description: 'Timestamp when party commenced ordering' },
      { name: 'created_at', bsonType: 'date', required: true, description: 'Creation timestamp' },
      { name: 'updated_at', bsonType: 'date', required: true, description: 'Last modified timestamp' },
    ],
  },
  orderItem: {
    collectionName: 'orderItem',
    displayTitle: 'Order Line Items',
    description: 'Individual dish selections tied to a parent Order with portion size S/M/L and locked unit prices.',
    endpoint: '/orderItems',
    primaryKey: 'order_item_id',
    indexes: [
      { name: '_id_', keys: ['_id'], unique: true },
      { name: 'order_item_id_idx', keys: ['order_item_id'], unique: true },
      { name: 'order_id_fk', keys: ['order_id'] },
      { name: 'food_id_fk', keys: ['food_id'] },
    ],
    fields: [
      { name: '_id', bsonType: 'objectId', required: true, isPrimaryKey: true, description: 'MongoDB ObjectID' },
      { name: 'order_item_id', bsonType: 'string', required: true, isPrimaryKey: true, description: 'Unique line item identifier' },
      { name: 'order_id', bsonType: 'string', required: true, isForeignKey: true, references: 'order.order_id', description: 'Parent Order reference' },
      { name: 'food_id', bsonType: 'string', required: true, isForeignKey: true, references: 'food.food_id', description: 'Ordered Food item reference' },
      { name: 'quantity', bsonType: 'string', required: true, validationRules: 'eq=S | eq=M | eq=L', description: 'Portion sizing parameter (Small, Medium, Large)' },
      { name: 'unit_price', bsonType: 'double', required: true, description: 'Snapshot unit price locked at order time' },
      { name: 'created_at', bsonType: 'date', required: true, description: 'Item order timestamp' },
      { name: 'updated_at', bsonType: 'date', required: true, description: 'Item status update timestamp' },
    ],
  },
  invoice: {
    collectionName: 'invoice',
    displayTitle: 'Invoices & Billing',
    description: 'Settlement record containing payment status, payment method (CASH / CARD), and due date.',
    endpoint: '/invoices',
    primaryKey: 'invoice_id',
    indexes: [
      { name: '_id_', keys: ['_id'], unique: true },
      { name: 'invoice_id_idx', keys: ['invoice_id'], unique: true },
      { name: 'order_id_fk', keys: ['order_id'], unique: true },
    ],
    fields: [
      { name: '_id', bsonType: 'objectId', required: true, isPrimaryKey: true, description: 'MongoDB ObjectID' },
      { name: 'invoice_id', bsonType: 'string', required: true, isPrimaryKey: true, description: 'Tax & payment invoice unique code' },
      { name: 'order_id', bsonType: 'string', required: true, isForeignKey: true, references: 'order.order_id', description: 'Foreign key to settled Order' },
      { name: 'payment_method', bsonType: 'string', required: false, validationRules: 'CASH | CARD | <empty>', description: 'Tender payment method selected by patron' },
      { name: 'payment_status', bsonType: 'string', required: true, validationRules: 'PENDING | PAID', description: 'Settlement state of the bill' },
      { name: 'payment_due_date', bsonType: 'date', required: true, description: 'Payment settlement deadline' },
      { name: 'created_at', bsonType: 'date', required: true, description: 'Invoice emission timestamp' },
      { name: 'updated_at', bsonType: 'date', required: true, description: 'Payment confirmation timestamp' },
    ],
  },
  notes: {
    collectionName: 'notes',
    displayTitle: 'Kitchen & Operational Notes',
    description: 'Operational notes, dietary alerts, allergies, and table requests routed between dining room and kitchen staff.',
    endpoint: '/notes',
    primaryKey: 'note_id',
    indexes: [
      { name: '_id_', keys: ['_id'], unique: true },
      { name: 'note_id_idx', keys: ['note_id'], unique: true },
    ],
    fields: [
      { name: '_id', bsonType: 'objectId', required: true, isPrimaryKey: true, description: 'MongoDB ObjectID' },
      { name: 'note_id', bsonType: 'string', required: true, isPrimaryKey: true, description: 'Unique note identifier' },
      { name: 'title', bsonType: 'string', required: true, description: 'Note subject (e.g. Table 1 Nut & Shellfish Allergy Alert)' },
      { name: 'text', bsonType: 'string', required: true, description: 'Full body text of kitchen instructions' },
      { name: 'created_at', bsonType: 'date', required: true, description: 'Note timestamp' },
      { name: 'updated_at', bsonType: 'date', required: true, description: 'Last revision timestamp' },
    ],
  },
};

export const SCHEMA_RELATIONSHIPS = [
  { from: 'food', fromField: 'menu_id', to: 'menu', toField: 'menu_id', label: 'belongs to category (1:N)' },
  { from: 'order', fromField: 'table_id', to: 'table', toField: 'table_id', label: 'seated at table (1:N)' },
  { from: 'orderItem', fromField: 'order_id', to: 'order', toField: 'order_id', label: 'belongs to order (1:N)' },
  { from: 'orderItem', fromField: 'food_id', to: 'food', toField: 'food_id', label: 'references food item (N:1)' },
  { from: 'invoice', fromField: 'order_id', to: 'order', toField: 'order_id', label: 'settles order (1:1)' },
];
