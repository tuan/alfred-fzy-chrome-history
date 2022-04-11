import alfy from "alfy";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Script filter copies chrome History DB file to this location,
// to get around permission issue
const CHROME_HISTORY_DB_PATH = "/tmp/chrome-history.db";
const DB_CACHE_KEY_PREFIX = "DB_CACHE_KEY_PREFIX";

const db = await open({
  filename: CHROME_HISTORY_DB_PATH,
  driver: sqlite3.cached.Database,
});

export async function queryAsync(domainSqlLikeExpression, historyResultLimit) {
  const dbCacheKey = `${DB_CACHE_KEY_PREFIX}-${domainSqlLikeExpression}-${historyResultLimit}`;
  const cachedData = alfy.cache.get(dbCacheKey);
  if (cachedData != null) {
    return cachedData;
  }

  const sqlQuery = `
  SELECT
    title,
    url,
    (last_visit_time/1000000-11644473600)*1000 as visit_time
  FROM
    urls
  WHERE
    CASE WHEN INSTR(url, "?") > 0 THEN SUBSTR(url, 0, INSTR(url, "?") - 1) ELSE url END LIKE '%${domainSqlLikeExpression}%' AND
    title IS NOT NULL
  GROUP BY
    title
  ORDER BY
    last_visit_time DESC
  LIMIT ${historyResultLimit}
  `;

  const data = await db.all(sqlQuery);
  alfy.cache.set(dbCacheKey, data, { maxAge: 60000 });

  return data;
}
