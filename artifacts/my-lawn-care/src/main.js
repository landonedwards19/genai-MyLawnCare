import "./styles.css";
import { lawnGuide } from "./lawnGuide.js";
import { generatePlan } from "./generatePlan.js";

const $ = (id) => document.getElementById(id);
const screens = { start: $("screen-start"), form: $("screen-form"), results: $("screen-results") };
const form = $("lawn-form");

const photoUrls = { current: [], desired: [] };

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

function renderPlan(values, plan) {
  $("plan-summary").textContent = plan.summary;
  const dl = $("input-summary");
  dl.innerHTML = "";
  dl.append(
    summaryItem("ZIP and region", `${values.zip} - ${plan.region.name}`),
    summaryItem("Grass type", plan.grassLabel),
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
    li.append(head, tasks);
    ol.append(li);
  });
}

// Events
$("start-btn").addEventListener("click", () => show("form", $("zip")));
$("back-btn").addEventListener("click", () => show("start", $("start-btn")));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { values, errors } = validate();
  const firstBad = Object.keys(errors)[0];
  if (firstBad) { $(firstBad).focus(); return; }
  const plan = await generatePlan({
    ...values,
    currentPhotoCount: photoUrls.current.length,
    desiredPhotoCount: photoUrls.desired.length,
  });
  renderPlan(values, plan);
  show("results", $("results-title"));
});

$("restart-btn").addEventListener("click", () => {
  form.reset();
  ["zip", "grassType", "currentDescription", "desiredDescription"].forEach((k) => setError(k, ""));
  Object.keys(photoUrls).forEach((k) => { photoUrls[k].forEach((u) => URL.revokeObjectURL(u)); photoUrls[k] = []; });
  $("currentThumbs").innerHTML = "";
  $("desiredThumbs").innerHTML = "";
  $("weeks").innerHTML = "";
  $("input-summary").innerHTML = "";
  show("start", $("start-btn"));
});
