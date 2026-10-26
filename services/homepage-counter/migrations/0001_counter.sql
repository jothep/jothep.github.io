-- Lifetime totals are independent of the short-lived request deduplication log.
-- statement
CREATE TABLE IF NOT EXISTS totals (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  views INTEGER NOT NULL DEFAULT 0,
  visitors INTEGER NOT NULL DEFAULT 0,
  started_at TEXT
);
-- statement
INSERT OR IGNORE INTO totals (id) VALUES (1);

-- Random browser identifiers only: no IP addresses, user agents or browsing paths.
-- statement
CREATE TABLE IF NOT EXISTS visitors (
  id TEXT PRIMARY KEY
);

-- statement
CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  visitor_id TEXT,
  created_at TEXT NOT NULL
);
-- statement
CREATE INDEX IF NOT EXISTS visits_created_at ON visits (created_at);

-- A duplicate request never fires this trigger. A new visit updates both counts
-- atomically; concurrent requests cannot lose increments or duplicate a visitor.
-- statement
CREATE TRIGGER IF NOT EXISTS count_new_visit
AFTER INSERT ON visits
BEGIN
  UPDATE totals SET
    views = views + 1,
    visitors = visitors + CASE
      WHEN NEW.visitor_id IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM visitors WHERE id = NEW.visitor_id)
      THEN 1 ELSE 0 END,
    started_at = COALESCE(started_at, NEW.created_at)
  WHERE id = 1;

  INSERT OR IGNORE INTO visitors (id)
    SELECT NEW.visitor_id WHERE NEW.visitor_id IS NOT NULL;
END;
