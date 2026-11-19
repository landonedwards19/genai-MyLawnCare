import "./styles.css";
import { lawnGuide } from "@workspace/lawn-guide";
import { analyzeYard } from "./analyzeYard.js";
import { requestPlan } from "./requestPlan.js";

const $ = (id) => document.getElementById(id);
const screens = { start: $("screen-start"), form: $("screen-form"), review: $("screen-review"), results: $("screen-results") };
const form = $("lawn-form");

const photoUrls = { current: [], desired: [] };
// Form values and yard analysis from the last submit, kept for the plan step.
let reviewedValues = null;
let lastAnalysis = null;

function show(name, focusEl) {
  Object.entries(screens).forEach(([key, el]) => { el.hidden = key !== name; });
  window.scrollTo({ top: 0 });
  if (focusEl) focusEl.focus();
}

// Grass select options
const select = $("grassType");
select.append(new Option("Choose your grass", ""));
const groups = { cool: "Cool-season", warm: "Warm-season", unknown: "Other" };
Object.entries(groups).forEach(([season, label]) => {
  const og = document.createElement("optgroup");
  og.label = label;
  Object.entries(lawnGuide.grassTypes)
    .filter(([, g]) => g.season === season)
    .forEach(([key, g]) => og.append(new Option(g.label, key)));
  select.append(og);
});

// Photo thumbnails
function setupPhotos(inputId, listId, key) {
  $(inputId).addEventListener("change", (e) => {
    photoUrls[key].forEach((u) => URL.revokeObjectURL(u));
    photoUrls[key] = Array.from(e.target.files).map((f) => URL.createObjectURL(f));
    renderThumbs($(listId), photoUrls[key], key);
  });
}
function renderThumbs(list, urls, key) {
  list.innerHTML = "";
  urls.forEach((url, i) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.src = url;
    img.alt = `${key === "current" ? "Current" : "Desired"} yard photo ${i + 1}`;
    li.append(img);
    list.append(li);
  });
}
setupPhotos("currentPhotos", "currentThumbs", "current");
setupPhotos("desiredPhotos", "desiredThumbs", "desired");

// Validation
const messages = {
  zipMissing: "Just need your 5-digit ZIP code so we can match your climate.",
  zipInvalid: "That doesn't look quite right. A US ZIP is 5 numbers, like 43215.",
  grassType: "Pick your grass type, or choose \"Not sure\" and we'll keep it general.",
  currentDescription: "Tell me a little about your yard today, even a sentence helps.",
  desiredDescription: "What would you love your yard to look like? A sentence is plenty.",
};

function setError(id, msg) {
  const field = $(id);
  $(`${id}-error`).textContent = msg || "";
  if (msg) field.setAttribute("aria-invalid", "true");
  else field.removeAttribute("aria-invalid");
}

function validate() {
  const v = {
    zip: $("zip").value.trim(),
    grassType: select.value,
    currentDescription: $("currentDescription").value.trim(),
    desiredDescription: $("desiredDescription").value.trim(),
  };
  const errors = {};
  if (!v.zip) errors.zip = messages.zipMissing;
  else if (!/^\d{5}$/.test(v.zip)) errors.zip = messages.zipInvalid;
  if (!v.grassType) errors.grassType = messages.grassType;
  if (!v.currentDescription) errors.currentDescription = messages.currentDescription;
  if (!v.desiredDescription) errors.desiredDescription = messages.desiredDescription;
  ["zip", "grassType", "currentDescription", "desiredDescription"].forEach((k) => setError(k, errors[k]));
  return { values: v, errors };
}

// Clear an error once the user fixes the field
["zip", "grassType", "currentDescription", "desiredDescription"].forEach((id) => {
  $(id).addEventListener(id === "grassType" ? "change" : "input", () => {
    if ($(id).getAttribute("aria-invalid") === "true" && $(id).value.trim()) {
      if (id !== "zip" || /^\d{5}$/.test($(id).value.trim())) setError(id, "");
    }
  });
});

// Rendering
const shorten = (s, n = 110) => (s.length > n ? s.slice(0, n).trimEnd() + "..." : s);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

function summaryItem(label, value) {
  const div = el("div");
  div.append(el("dt", null, label));
  const dd = el("dd");
  if (typeof value === "string") dd.textContent = value;
  else dd.append(value);
  div.append(dd);
  return div;
}

function photoValue(key) {
  const urls = photoUrls[key];
  if (!urls.length) return "No photos";
  const wrap = el("div");
  wrap.append(el("span", null, `${urls.length} photo${urls.length === 1 ? "" : "s"}`));
  const list = el("ul", "thumbs");
  renderThumbs(list, urls, key);
  wrap.append(list);
  return wrap;
}

const PLAN_NOTES = {
  ai: "Plan written by AI from the issues you confirmed and our lawn-care rules. Weather is not live yet (planned).",
  fallback: "Basic rule-based plan",
};

function renderPlan(values, plan) {
  const grass = lawnGuide.grassTypes[values.grassType];
  const region = lawnGuide.regions[values.zip.charAt(0)];
  const isAi = plan.source === "ai";
  $("plan-banner").hidden = isAi;
  $("plan-note").textContent = PLAN_NOTES[isAi ? "ai" : "fallback"];
  $("plan-summary").textContent = plan.summary;
  const dl = $("input-summary");
  dl.innerHTML = "";
  dl.append(
    summaryItem("ZIP and region", `${values.zip} - ${region ? region.name : "Unknown region"}`),
    summaryItem("Grass type", grass ? grass.label : values.grassType),
    summaryItem("Your yard now", shorten(values.currentDescription)),
    summaryItem("The yard you want", shorten(values.desiredDescription)),
    summaryItem("Photos of now", photoValue("current")),
    summaryItem("Photos of the goal", photoValue("desired")),
  );

  const ol = $("weeks");
  ol.innerHTML = "";
  plan.weeks.forEach((w) => {
    const li = el("li", "week");
    const head = el("div", "week-head");
    head.append(el("span", "week-num", `Week ${w.week}`), el("h3", null, w.title));
    const tasks = el("dl", "tasks");
    const add = (cls, label, text) => {
      const d = el("div", `task ${cls}`);
      d.append(el("dt", null, label), el("dd", null, text));
      tasks.append(d);
    };
    add("task-mow", "Mow", w.mow);
    add("task-water", "Water", w.water);
    add("task-fert", "Fertilize", w.fertilize);
    if (w.extra && w.extra.length) add("task-extra", "Also this week", w.extra.join(" "));
    li.append(head);
    if (w.why) li.append(el("p", "week-why", w.why));
    li.append(tasks);
    ol.append(li);
  });
}

// Review screen
const SOURCE_LABELS = {
  ai: "Found by AI",
  fallback: "AI unavailable. Found by keyword matching, so please double-check.",
};

function issueRow(issue) {
  const li = el("li", "issue");
  const id = `issue-${issue.key}`;
  const box = el("input");
  box.type = "checkbox";
  box.id = id;
  box.name = "issue";
  box.value = issue.key;
  box.checked = issue.status === "present";
  const label = el("label");
  label.htmlFor = id;
  label.append(el("span", null, lawnGuide.issues[issue.key].label));
  if (issue.status === "present" && issue.evidence) {
    label.append(el("span", "issue-evidence", `You said: '${issue.evidence}'`));
  } else if (issue.status === "unclear") {
    label.append(el("span", "issue-note", "Not sure. Check this if it applies."));
  }
  li.append(box, label);
  return li;
}

function renderReview(analysis) {
  const tag = $("source-tag");
  const source = analysis.source === "ai" ? "ai" : "fallback";
  tag.textContent = SOURCE_LABELS[source];
  tag.className = `source-tag is-${source}`;

  const known = analysis.issues.filter((i) => lawnGuide.issues[i.key]);
  const main = known.filter((i) => i.status !== "absent");
  const absent = known.filter((i) => i.status === "absent");

  const list = $("issue-list");
  list.innerHTML = "";
  // Present issues first, then unclear ones.
  [...main.filter((i) => i.status === "present"), ...main.filter((i) => i.status === "unclear")]
    .forEach((i) => list.append(issueRow(i)));
  if (!main.length) list.append(el("li", "muted", "I didn't spot any of the usual problems. If something's bothering you, add it below."));

  const missedList = $("missed-list");
  missedList.innerHTML = "";
  absent.forEach((i) => missedList.append(issueRow(i)));
  $("missed").hidden = !absent.length;
  $("missed").open = false;

  const goals = $("review-goals");
  goals.hidden = !analysis.goals.length;
  goals.textContent = analysis.goals.length ? `Your goals: ${analysis.goals.join(", ")}.` : "";

  const other = $("review-other");
  other.hidden = !analysis.otherConcerns.length;
  other.textContent = analysis.otherConcerns.length
    ? `I can't plan for these yet: ${analysis.otherConcerns.join(", ")}.`
    : "";
}

function checkedIssueKeys() {
  return Array.from(document.querySelectorAll('#screen-review input[name="issue"]:checked')).map((b) => b.value);
}

function setLoading(on) {
  const btn = $("submit-btn");
  btn.disabled = on;
  $("loading").textContent = on ? "Reading your yard..." : "";
}

// Events
$("start-btn").addEventListener("click", () => show("form", $("zip")));
$("back-btn").addEventListener("click", () => show("start", $("start-btn")));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if ($("submit-btn").disabled) return;
  const { values, errors } = validate();
  const firstBad = Object.keys(errors)[0];
  if (firstBad) { $(firstBad).focus(); return; }
  setLoading(true);
  try {
    const analysis = await analyzeYard(values);
    reviewedValues = values;
    lastAnalysis = analysis;
    renderReview(analysis);
    show("review", $("review-title"));
  } finally {
    setLoading(false);
  }
});

$("edit-btn").addEventListener("click", () => show("form", $("currentDescription")));

$("confirm-btn").addEventListener("click", async () => {
  const btn = $("confirm-btn");
  if (btn.disabled) return;
  btn.disabled = true;
  $("edit-btn").disabled = true;
  $("plan-loading").textContent = "Writing your plan...";
  try {
    const values = reviewedValues;
    const plan = await requestPlan(values, checkedIssueKeys(), lastAnalysis);
    renderPlan(values, plan);
    show("results", $("results-title"));
  } finally {
    btn.disabled = false;
    $("edit-btn").disabled = false;
    $("plan-loading").textContent = "";
  }
});

$("restart-btn").addEventListener("click", () => {
  form.reset();
  ["zip", "grassType", "currentDescription", "desiredDescription"].forEach((k) => setError(k, ""));
  Object.keys(photoUrls).forEach((k) => { photoUrls[k].forEach((u) => URL.revokeObjectURL(u)); photoUrls[k] = []; });
  $("currentThumbs").innerHTML = "";
  $("desiredThumbs").innerHTML = "";
  $("weeks").innerHTML = "";
  $("input-summary").innerHTML = "";
  $("issue-list").innerHTML = "";
  $("missed-list").innerHTML = "";
  reviewedValues = null;
  lastAnalysis = null;
  show("start", $("start-btn"));
});
