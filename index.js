import alfy from "alfy";
import { formatRelative } from "date-fns";
import { queryAsync } from "./history.js";
import fzy from "fzy.js";
import _ from "lodash";
const { sortBy } = _;

const ICON_PATH = "./icon.png";
const QUERY_LIMIT = 10000;
const OUTPUT_LIMIT = 15;

const domainKeywordRegex = /(?:^|\s)@(\b[^@\s]+)(?:$|\s)/gm;

function processInput(input) {
  const domainKeywords = [];
  let nextGroup = domainKeywordRegex.exec(input);
  while (nextGroup != null) {
    domainKeywords.push(nextGroup[1]);
    nextGroup = domainKeywordRegex.exec(input);
  }

  const query = input.replace(domainKeywordRegex, "");
  return { domainKeywords, query };
}

const input = (alfy.input ?? "").trim();
const { domainKeywords, query } = processInput(input);
const domainSqlLikeExpression = domainKeywords.join("%");
const fzyQuery = query.trim(); // trim spaces when query is in between domain keywords

const historyItems = await queryAsync(domainSqlLikeExpression, QUERY_LIMIT);
let results = historyItems.filter((item) => fzy.hasMatch(fzyQuery, item.title));
results = sortBy(results, (item) => -fzy.score(fzyQuery, item.title));

const now = Date.now();

const outputItems = results.slice(0, OUTPUT_LIMIT).map((item) => {
  const relativeVisitTime = formatRelative(new Date(item.visit_time), now);

  return {
    quicklookurl: item.url,
    uid: item.url,
    title: item.title,
    subtitle: `${relativeVisitTime} - ${item.url}`,
    arg: item.url,
    icon: { path: ICON_PATH },
    mods: {
      ctrl: {
        arg: item.url,
        subtitle: `Copy & Paste ${item.url} `,
      },
    },
  };
});

alfy.output(outputItems);
