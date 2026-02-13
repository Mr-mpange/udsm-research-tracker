// OAI-PMH Harvester for UDSM Journals
// Fetches metadata from Open Journal Systems (OJS)

export interface OAIRecord {
  identifier: string;
  title: string;
  authors: string[];
  abstract?: string;
  doi?: string;
  journal: string;
  publishedDate: string;
  subjects?: string[];
  language?: string;
}

export interface OAIHarvestResult {
  records: OAIRecord[];
  resumptionToken?: string;
  error?: string;
}

/**
 * Parse OAI-PMH XML response and extract article metadata
 */
function parseOAIResponse(xmlText: string): OAIHarvestResult {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  // Check for errors
  const errorNode = xmlDoc.querySelector("error");
  if (errorNode) {
    return {
      records: [],
      error: errorNode.textContent || "Unknown OAI-PMH error",
    };
  }

  const records: OAIRecord[] = [];
  const recordNodes = xmlDoc.querySelectorAll("record");

  recordNodes.forEach((recordNode) => {
    const header = recordNode.querySelector("header");
    const metadata = recordNode.querySelector("metadata > oai_dc\\:dc, metadata > dc");

    if (!header || !metadata) return;

    const identifier = header.querySelector("identifier")?.textContent || "";
    const datestamp = header.querySelector("datestamp")?.textContent || "";

    // Extract Dublin Core metadata
    const getMetadata = (tag: string): string[] => {
      const nodes = metadata.querySelectorAll(`dc\\:${tag}, ${tag}`);
      return Array.from(nodes).map((n) => n.textContent?.trim() || "").filter(Boolean);
    };

    const titles = getMetadata("title");
    const creators = getMetadata("creator");
    const descriptions = getMetadata("description");
    const identifiers = getMetadata("identifier");
    const subjects = getMetadata("subject");
    const languages = getMetadata("language");
    const sources = getMetadata("source");

    // Extract DOI from identifiers
    const doi = identifiers.find((id) => id.includes("doi.org") || id.startsWith("10."))
      ?.replace(/^https?:\/\/doi\.org\//, "");

    // Extract journal name from source or publisher
    const journal = sources[0] || getMetadata("publisher")[0] || "Unknown Journal";

    if (titles.length > 0) {
      records.push({
        identifier,
        title: titles[0],
        authors: creators,
        abstract: descriptions[0],
        doi,
        journal,
        publishedDate: datestamp,
        subjects,
        language: languages[0],
      });
    }
  });

  // Check for resumption token (for paginated results)
  const resumptionToken = xmlDoc.querySelector("resumptionToken")?.textContent || undefined;

  return { records, resumptionToken };
}

/**
 * Harvest metadata from OAI-PMH endpoint
 */
export async function harvestOAI(
  baseUrl: string,
  options: {
    verb?: "ListRecords" | "GetRecord";
    metadataPrefix?: string;
    from?: string;
    until?: string;
    set?: string;
    resumptionToken?: string;
    identifier?: string;
  } = {}
): Promise<OAIHarvestResult> {
  const {
    verb = "ListRecords",
    metadataPrefix = "oai_dc",
    from,
    until,
    set,
    resumptionToken,
    identifier,
  } = options;

  // Build query parameters
  const params = new URLSearchParams({ verb });

  if (resumptionToken) {
    params.append("resumptionToken", resumptionToken);
  } else {
    if (verb === "GetRecord" && identifier) {
      params.append("identifier", identifier);
      params.append("metadataPrefix", metadataPrefix);
    } else if (verb === "ListRecords") {
      params.append("metadataPrefix", metadataPrefix);
      if (from) params.append("from", from);
      if (until) params.append("until", until);
      if (set) params.append("set", set);
    }
  }

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return {
        records: [],
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const xmlText = await response.text();
    return parseOAIResponse(xmlText);
  } catch (error) {
    return {
      records: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Harvest all records from an OAI-PMH endpoint (handles pagination)
 */
export async function harvestAllRecords(
  baseUrl: string,
  options: {
    metadataPrefix?: string;
    from?: string;
    until?: string;
    set?: string;
    maxRecords?: number;
  } = {}
): Promise<OAIHarvestResult> {
  const { maxRecords = 1000, ...harvestOptions } = options;
  const allRecords: OAIRecord[] = [];
  let resumptionToken: string | undefined;
  let hasMore = true;

  while (hasMore && allRecords.length < maxRecords) {
    const result = await harvestOAI(baseUrl, {
      ...harvestOptions,
      verb: "ListRecords",
      resumptionToken,
    });

    if (result.error) {
      return { records: allRecords, error: result.error };
    }

    allRecords.push(...result.records);
    resumptionToken = result.resumptionToken;
    hasMore = !!resumptionToken;

    // Avoid overwhelming the server
    if (hasMore) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return { records: allRecords };
}

/**
 * Get list of available sets (journals) from OAI-PMH endpoint
 */
export async function listSets(baseUrl: string): Promise<{ setSpec: string; setName: string }[]> {
  const params = new URLSearchParams({ verb: "ListSets" });
  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const sets: { setSpec: string; setName: string }[] = [];
    const setNodes = xmlDoc.querySelectorAll("set");

    setNodes.forEach((setNode) => {
      const setSpec = setNode.querySelector("setSpec")?.textContent || "";
      const setName = setNode.querySelector("setName")?.textContent || "";
      if (setSpec && setName) {
        sets.push({ setSpec, setName });
      }
    });

    return sets;
  } catch (error) {
    console.error("Error listing sets:", error);
    return [];
  }
}

/**
 * Identify OAI-PMH repository
 */
export async function identifyRepository(baseUrl: string): Promise<{
  repositoryName?: string;
  baseURL?: string;
  protocolVersion?: string;
  earliestDatestamp?: string;
  deletedRecord?: string;
  granularity?: string;
  error?: string;
}> {
  const params = new URLSearchParams({ verb: "Identify" });
  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const identify = xmlDoc.querySelector("Identify");
    if (!identify) {
      return { error: "Invalid Identify response" };
    }

    return {
      repositoryName: identify.querySelector("repositoryName")?.textContent || undefined,
      baseURL: identify.querySelector("baseURL")?.textContent || undefined,
      protocolVersion: identify.querySelector("protocolVersion")?.textContent || undefined,
      earliestDatestamp: identify.querySelector("earliestDatestamp")?.textContent || undefined,
      deletedRecord: identify.querySelector("deletedRecord")?.textContent || undefined,
      granularity: identify.querySelector("granularity")?.textContent || undefined,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
