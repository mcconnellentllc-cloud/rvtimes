// Airtable data access. All server-side only (uses the secret API key).
import Airtable from "airtable";

export type RvInfo = {
  id: string;
  category: string;
  item: string;
  value: string;
  notes?: string;
};

export type MaintenanceEntry = {
  id: string;
  date: string;
  service: string;
  mileage?: string;
  cost?: string;
  vendor?: string;
  notes?: string;
  status?: string;
};

export type RvDocument = {
  id: string;
  title: string;
  type?: string;
  url?: string;
  notes?: string;
};

export type KnowledgeEntry = {
  id: string;
  question: string;
  answer: string;
  tags?: string;
};

function base() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    throw new Error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID");
  }
  return new Airtable({ apiKey }).base(baseId);
}

function str(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

// Returns [] if the table doesn't exist yet, so pages render before setup.
async function safeSelect<T>(
  table: string,
  map: (rec: Airtable.Record<Airtable.FieldSet>) => T,
  options: Airtable.SelectOptions<Airtable.FieldSet> = {}
): Promise<T[]> {
  try {
    const records = await base()(table).select(options).all();
    return records.map(map);
  } catch (err: any) {
    console.error(`Airtable "${table}" fetch failed:`, err?.message || err);
    return [];
  }
}

export async function getRvInfo(): Promise<RvInfo[]> {
  return safeSelect("RV Info", (r) => ({
    id: r.id,
    category: str(r.get("Category")),
    item: str(r.get("Item")),
    value: str(r.get("Value")),
    notes: str(r.get("Notes")),
  }));
}

export async function getMaintenance(): Promise<MaintenanceEntry[]> {
  return safeSelect(
    "Maintenance Log",
    (r) => ({
      id: r.id,
      date: str(r.get("Date")),
      service: str(r.get("Service")),
      mileage: str(r.get("Mileage")),
      cost: str(r.get("Cost")),
      vendor: str(r.get("Vendor")),
      notes: str(r.get("Notes")),
      status: str(r.get("Status")),
    }),
    { sort: [{ field: "Date", direction: "desc" }] }
  );
}

export async function getDocuments(): Promise<RvDocument[]> {
  return safeSelect("Documents", (r) => {
    const attachments = r.get("File") as
      | Array<{ url: string; filename: string }>
      | undefined;
    const attachmentUrl = attachments?.[0]?.url;
    return {
      id: r.id,
      title: str(r.get("Title")),
      type: str(r.get("Type")),
      url: str(r.get("Link")) || attachmentUrl || "",
      notes: str(r.get("Notes")),
    };
  });
}

export async function getKnowledge(): Promise<KnowledgeEntry[]> {
  return safeSelect("Knowledge", (r) => ({
    id: r.id,
    question: str(r.get("Question")),
    answer: str(r.get("Answer")),
    tags: str(r.get("Tags")),
  }));
}
