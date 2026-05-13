const RATE_KEY = "eur-jpy-rate-v1";

const rateInput = document.querySelector("#rateInput");
const euroInput = document.querySelector("#euroInput");
const yenOutput = document.querySelector("#yenOutput");
const rateStatus = document.querySelector("#rateStatus");

const yenFormatter = new Intl.NumberFormat("ja-JP", {
  maximumFractionDigits: 0,
});

function parseDecimal(value) {
  const normalized = value.trim().replace(",", ".");

  if (normalized === "") {
    return null;
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function setStatus(message, isWarning = false) {
  rateStatus.textContent = message;
  rateStatus.classList.toggle("is-warning", isWarning);
}

function updateRateState() {
  const rate = parseDecimal(rateInput.value);

  if (rateInput.value.trim() === "") {
    localStorage.removeItem(RATE_KEY);
    setStatus("レート未入力", true);
    return null;
  }

  if (rate === null || rate <= 0) {
    setStatus("有効なレートを入力してください", true);
    return null;
  }

  localStorage.setItem(RATE_KEY, rateInput.value.trim());
  setStatus("保存済み");
  return rate;
}

function updateResult() {
  const rate = updateRateState();
  const euro = parseDecimal(euroInput.value);

  if (rate === null || euro === null) {
    yenOutput.textContent = "--";
    return;
  }

  const yen = Math.round(rate * euro);
  yenOutput.textContent = `${yenFormatter.format(yen)}円`;
}

function restoreRate() {
  const savedRate = localStorage.getItem(RATE_KEY);

  if (savedRate) {
    rateInput.value = savedRate;
    setStatus("保存済み");
  } else {
    setStatus("レート未入力", true);
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

restoreRate();
updateResult();

rateInput.addEventListener("input", updateResult);
euroInput.addEventListener("input", updateResult);

window.addEventListener("pageshow", updateResult);

setTimeout(() => {
  if (rateInput.value.trim() === "") {
    rateInput.focus();
  } else {
    euroInput.focus();
  }
}, 150);
