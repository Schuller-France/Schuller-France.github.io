let allClients = [];
let products = [];
let prenetClients = [];
let tariffConfig = { ...(window.TARIF_CONFIG || {}) };
let localStatsData = {};
let clientArticleStats360 = { available: false, sourceFile: "", updatedAt: "", byClient: {} };
let prenetDataMeta = { updatedAt: "" };
let secureDataLoaded = false;
let promotionsRefreshInProgress = false;
let lastPromotionsRefreshAt = 0;
const initialBacklogItems = window.RELIQUATS_DATA?.items || [];

let selectedClient = null;
let selectedClient360 = null;
let selectedQuoteClient = null;
let selectedPrenetClient = null;
let lines = [];
let quoteLineItems = [];
let expenseLineItems = [];
let activeExpenseDraftId = null;
let currentUser = null;
let visibleClients = [];
let activeHistoryOrderId = null;
let selectedNotesClient = null;
let editingNoteId = null;
let notesHistoryMode = "client";
let dashboardStatsOverride = null;
let dashboardStatsLoading = false;
let voiceRecognition = null;
let voiceNoteListening = false;
let selectedTariff = null;
let activeDashboardSector = null;
let currentSessionToken = "";
let backlogItemsCache = Array.isArray(initialBacklogItems) ? initialBacklogItems : [];
let selectedTourCodes = new Set();
let tourMapInstance = null;
let tourMarkersLayer = null;
let tourRouteLayer = null;
let tourMarkerByCode = new Map();
let driveAutoRefreshTimer = null;
const sessionStorageKey = "orderEntryUser";
const rememberedSessionKey = "schullerRememberedSession";
const adminResetKey = "schullerAdminResetAt";
const savedToursStorageKey = "schullerSavedTours";
const displayModeStorageKey = "schullerDisplayMode";
const secureDataCachePrefix = "schullerSecureDataCache:";
const secureDataCacheMaxAgeMs = 12 * 60 * 60 * 1000;
const driveAutoRefreshMs = 10 * 60 * 1000;
const backlogDoneStorageKey = "schullerBacklogDone";
const backlogHiddenStorageKey = "schullerBacklogHidden";
const quoteHistoryStorageKey = "schullerQuoteHistory";
const expenseDraftStorageKey = "schullerExpenseDrafts";

const formatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});
const wholeCurrencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});
const expenseTypes = ["HOTEL", "REPAS SOIR", "REPAS MIDI", "INVITATION CLIENT", "PARKING", "CARBURANT", "DIVERS"];
const expenseLunchLimit = 20;
const expenseDinnerLimit = 20;
const expenseHotelDinnerLimit = 115;

const clientSearch = document.querySelector("#clientSearch");
const clientSuggestions = document.querySelector("#clientSuggestions");
const selectedClientBox = document.querySelector("#selectedClient");
const clientStatus = document.querySelector("#clientStatus");
const orderLines = document.querySelector("#orderLines");
const productRefs = document.querySelector("#productRefs");
const summaryClient = document.querySelector("#summaryClient");
const summaryLines = document.querySelector("#summaryLines");
const summaryTotal = document.querySelector("#summaryTotal");
const orderNote = document.querySelector("#orderNote");
const loginView = document.querySelector("#loginView");
const appView = document.querySelector("#appView");
const loginForm = document.querySelector("#loginForm");
const loginId = document.querySelector("#loginId");
const loginPassword = document.querySelector("#loginPassword");
const rememberLogin = document.querySelector("#rememberLogin");
const loginError = document.querySelector("#loginError");
const loginSubmitButton = document.querySelector("#loginSubmitButton");
const forgotPasswordButton = document.querySelector("#forgotPasswordButton");
const passwordResetCard = document.querySelector("#passwordResetCard");
const passwordResetRequestForm = document.querySelector("#passwordResetRequestForm");
const passwordResetConfirmForm = document.querySelector("#passwordResetConfirmForm");
const passwordResetEmail = document.querySelector("#passwordResetEmail");
const passwordResetCode = document.querySelector("#passwordResetCode");
const newPassword = document.querySelector("#newPassword");
const confirmNewPassword = document.querySelector("#confirmNewPassword");
const passwordResetStatus = document.querySelector("#passwordResetStatus");
const requestResetButton = document.querySelector("#requestResetButton");
const confirmResetButton = document.querySelector("#confirmResetButton");
const backToLoginButton = document.querySelector("#backToLoginButton");
const logoutButton = document.querySelector("#logoutButton");
const displayModeToggle = document.querySelector("#displayModeToggle");
const offlineStatus = document.querySelector("#offlineStatus");
const globalSearchInput = document.querySelector("#globalSearchInput");
const globalSearchResults = document.querySelector("#globalSearchResults");
const sessionLabel = document.querySelector("#sessionLabel");
const appTabs = document.querySelector(".app-tabs");
const homeTab = document.querySelector("#homeTab");
const client360Tab = document.querySelector("#client360Tab");
const orderTab = document.querySelector("#orderTab");
const historyTab = document.querySelector("#historyTab");
const quoteTab = document.querySelector("#quoteTab");
const expensesTab = document.querySelector("#expensesTab");
const notesTab = document.querySelector("#notesTab");
const notesReminderBadge = document.querySelector("#notesReminderBadge");
const tourTab = document.querySelector("#tourTab");
const backlogTab = document.querySelector("#backlogTab");
const prenetTab = document.querySelector("#prenetTab");
const tarifTab = document.querySelector("#tarifTab");
const promotionTab = document.querySelector("#promotionTab");
const adminTab = document.querySelector("#adminTab");
const homeView = document.querySelector("#homeView");
const client360View = document.querySelector("#client360View");
const orderView = document.querySelector("#orderView");
const quoteView = document.querySelector("#quoteView");
const expensesView = document.querySelector("#expensesView");
const historyView = document.querySelector("#historyView");
const notesView = document.querySelector("#notesView");
const tourView = document.querySelector("#tourView");
const backlogView = document.querySelector("#backlogView");
const prenetView = document.querySelector("#prenetView");
const tarifView = document.querySelector("#tarifView");
const promotionView = document.querySelector("#promotionView");
const adminView = document.querySelector("#adminView");
const refreshAdminLogs = document.querySelector("#refreshAdminLogs");
const adminLogBody = document.querySelector("#adminLogBody");
const adminLogStatus = document.querySelector("#adminLogStatus");
const adminActivityCount = document.querySelector("#adminActivityCount");
const adminOrderCount = document.querySelector("#adminOrderCount");
const adminDocumentCount = document.querySelector("#adminDocumentCount");
const adminClientCount = document.querySelector("#adminClientCount");
const adminNoteCount = document.querySelector("#adminNoteCount");
const adminReminderCount = document.querySelector("#adminReminderCount");
const adminExpenseCount = document.querySelector("#adminExpenseCount");
const adminExpenseTotal = document.querySelector("#adminExpenseTotal");
const adminExpenseBody = document.querySelector("#adminExpenseBody");
const adminScopeFilter = document.querySelector("#adminScopeFilter");
const adminActivityFeed = document.querySelector("#adminActivityFeed");
const adminTypeSummary = document.querySelector("#adminTypeSummary");
const resetAdminDashboard = document.querySelector("#resetAdminDashboard");
const adminOpenTourButton = document.querySelector("#adminOpenTourButton");
const historyList = document.querySelector("#historyList");
const historyDetail = document.querySelector("#historyDetail");
const historyCount = document.querySelector("#historyCount");
const clearHistoryOrders = document.querySelector("#clearHistoryOrders");
const quoteClientSearch = document.querySelector("#quoteClientSearch");
const quoteClientSuggestions = document.querySelector("#quoteClientSuggestions");
const quoteSelectedClient = document.querySelector("#quoteSelectedClient");
const quoteStatus = document.querySelector("#quoteStatus");
const quoteLines = document.querySelector("#quoteLines");
const quoteNote = document.querySelector("#quoteNote");
const addQuoteLine = document.querySelector("#addQuoteLine");
const sendQuoteRequest = document.querySelector("#sendQuoteRequest");
const quoteSendStatus = document.querySelector("#quoteSendStatus");
const quoteHistorySearch = document.querySelector("#quoteHistorySearch");
const quoteHistoryList = document.querySelector("#quoteHistoryList");
const expensesPeriod = document.querySelector("#expensesPeriod");
const expensesNote = document.querySelector("#expensesNote");
const expensesLines = document.querySelector("#expensesLines");
const addExpenseLine = document.querySelector("#addExpenseLine");
const newExpenseDraft = document.querySelector("#newExpenseDraft");
const saveExpenseDraft = document.querySelector("#saveExpenseDraft");
const sendExpenseReport = document.querySelector("#sendExpenseReport");
const expensesSendStatus = document.querySelector("#expensesSendStatus");
const expensesStatus = document.querySelector("#expensesStatus");
const expensesTotalAmount = document.querySelector("#expensesTotalAmount");
const expensesTotalVat = document.querySelector("#expensesTotalVat");
const expensesTotalRefund = document.querySelector("#expensesTotalRefund");
const expenseHistorySearch = document.querySelector("#expenseHistorySearch");
const expenseHistoryList = document.querySelector("#expenseHistoryList");
const notesClientSearch = document.querySelector("#notesClientSearch");
const notesClientSuggestions = document.querySelector("#notesClientSuggestions");
const showAllNotesButton = document.querySelector("#showAllNotesButton");
const notesReminderFocus = document.querySelector("#notesReminderFocus");
const notesStatus = document.querySelector("#notesStatus");
const notesSelectedClient = document.querySelector("#notesSelectedClient");
const notesForm = document.querySelector("#notesForm");
const notesDate = document.querySelector("#notesDate");
const notesText = document.querySelector("#notesText");
const startVoiceNote = document.querySelector("#startVoiceNote");
const voiceNoteStatus = document.querySelector("#voiceNoteStatus");
const saveNoteButton = document.querySelector("#saveNoteButton");
const finishVisitButton = document.querySelector("#finishVisitButton");
const exportVisitReportButton = document.querySelector("#exportVisitReportButton");
const cancelEditNote = document.querySelector("#cancelEditNote");
const notesCount = document.querySelector("#notesCount");
const notesList = document.querySelector("#notesList");
const notesHistoryTitle = document.querySelector("#notesHistoryTitle");
const reportStartDate = document.querySelector("#reportStartDate");
const reportEndDate = document.querySelector("#reportEndDate");
const exportPeriodReportButton = document.querySelector("#exportPeriodReportButton");
const sendVisitReportButton = document.querySelector("#sendVisitReportButton");
const tourSearch = document.querySelector("#tourSearch");
const tourMap = document.querySelector("#tourMap");
const tourClientList = document.querySelector("#tourClientList");
const tourSelectedList = document.querySelector("#tourSelectedList");
const tourSelectionCount = document.querySelector("#tourSelectionCount");
const tourResultCount = document.querySelector("#tourResultCount");
const tourMapTitle = document.querySelector("#tourMapTitle");
const tourRouteSummary = document.querySelector("#tourRouteSummary");
const openGoogleMapsRoute = document.querySelector("#openGoogleMapsRoute");
const openWazeRoute = document.querySelector("#openWazeRoute");
const clearTourSelection = document.querySelector("#clearTourSelection");
const tourName = document.querySelector("#tourName");
const savedTourSelect = document.querySelector("#savedTourSelect");
const saveTourButton = document.querySelector("#saveTourButton");
const loadTourButton = document.querySelector("#loadTourButton");
const deleteTourButton = document.querySelector("#deleteTourButton");
const backlogStatus = document.querySelector("#backlogStatus");
const backlogRemainderCount = document.querySelector("#backlogRemainderCount");
const backlogReturnCount = document.querySelector("#backlogReturnCount");
const backlogTotalCount = document.querySelector("#backlogTotalCount");
const backlogSearch = document.querySelector("#backlogSearch");
const backlogTypeFilter = document.querySelector("#backlogTypeFilter");
const refreshBacklog = document.querySelector("#refreshBacklog");
const backlogBody = document.querySelector("#backlogBody");
const prenetClientSearch = document.querySelector("#prenetClientSearch");
const prenetClientSuggestions = document.querySelector("#prenetClientSuggestions");
const prenetResult = document.querySelector("#prenetResult");
const prenetSector = document.querySelector("#prenetSector");
const selectTarif5010 = document.querySelector("#selectTarif5010");
const selectTarifBase = document.querySelector("#selectTarifBase");
const selectCatalogue2026 = document.querySelector("#selectCatalogue2026");
const promotionGrid = document.querySelector("#promotionGrid");
const promotionRecipient = document.querySelector("#promotionRecipient");
const promotionSendStatus = document.querySelector("#promotionSendStatus");
const sendSelectedPromotions = document.querySelector("#sendSelectedPromotions");
const promotionModal = document.querySelector("#promotionModal");
const promotionModalTitle = document.querySelector("#promotionModalTitle");
const promotionPreviewFrame = document.querySelector("#promotionPreviewFrame");
const closePromotionModal = document.querySelector("#closePromotionModal");
const tarifSendForm = document.querySelector("#tarifSendForm");
const tarifRecipient = document.querySelector("#tarifRecipient");
const tarifSendStatus = document.querySelector("#tarifSendStatus");
const sendTarifButton = document.querySelector("#sendTarifButton");
const selectedTarifName = document.querySelector("#selectedTarifName");
const dashboardSectorSwitch = document.querySelector("#dashboardSectorSwitch");
const homeRemindersPanel = document.querySelector("#homeRemindersPanel");
const homeRemindersCount = document.querySelector("#homeRemindersCount");
const homeRemindersList = document.querySelector("#homeRemindersList");
const client360Search = document.querySelector("#client360Search");
const client360Suggestions = document.querySelector("#client360Suggestions");
const client360Status = document.querySelector("#client360Status");
const client360Summary = document.querySelector("#client360Summary");
const client360NotesCount = document.querySelector("#client360NotesCount");
const client360QuotesCount = document.querySelector("#client360QuotesCount");
const client360PrenetCount = document.querySelector("#client360PrenetCount");
const client360OrdersCount = document.querySelector("#client360OrdersCount");
const client360Notes = document.querySelector("#client360Notes");
const client360Quotes = document.querySelector("#client360Quotes");
const client360Prenets = document.querySelector("#client360Prenets");
const client360Orders = document.querySelector("#client360Orders");
const noteReminderEnabled = document.querySelector("#noteReminderEnabled");
const noteReminderFields = document.querySelector("#noteReminderFields");
const noteReminderDate = document.querySelector("#noteReminderDate");
const noteReminderText = document.querySelector("#noteReminderText");
const visitNextAction = document.querySelector("#visitNextAction");
const visitFollowupDays = document.querySelector("#visitFollowupDays");
const visitFollowupDaysLabel = document.querySelector("#visitFollowupDaysLabel");
let adminLogsCache = [];
let adminExpenseReportsCache = [];

async function postService(parameters) {
  if (!tariffConfig.endpoint) throw new Error("Service indisponible.");
  const payload = { ...parameters };
  if (currentSessionToken && !payload.token) payload.token = currentSessionToken;
  const response = await fetch(tariffConfig.endpoint, {
    method: "POST",
    body: new URLSearchParams(payload),
  });
  const result = JSON.parse(await response.text());
  if (!result.ok) throw new Error(result.message || "Opération impossible.");
  return result;
}

function applySecureAppData(result) {
  if (!result) return;
  const previousEndpoint = tariffConfig.endpoint || "";
  allClients = Array.isArray(result.appData?.clients) ? result.appData.clients : [];
  products = Array.isArray(result.appData?.products) ? result.appData.products : [];
  prenetClients = Array.isArray(result.prenetData?.clients) ? result.prenetData.clients : [];
  prenetDataMeta = {
    updatedAt: result.prenetData?.updatedAt || "",
    sourceFile: result.prenetData?.sourceFile || "",
  };
  localStatsData = result.stats || {};
  clientArticleStats360 = result.clientArticleStats || { available: false, sourceFile: "", updatedAt: "", byClient: {} };
  tariffConfig = {
    ...tariffConfig,
    ...(result.tariffConfig || {}),
    endpoint: previousEndpoint,
  };
  secureDataLoaded = true;
  populateProductRefs();
  renderPromotions();
}

function secureDataCacheKey(userId) {
  return `${secureDataCachePrefix}${userId || "default"}`;
}

function saveSecureDataCache(userId, result) {
  if (!userId || !result?.appData) return;
  try {
    localStorage.setItem(secureDataCacheKey(userId), JSON.stringify({ savedAt: Date.now(), result }));
  } catch (error) {
    localStorage.removeItem(secureDataCacheKey(userId));
  }
}

function restoreSecureDataCache(userId) {
  try {
    const cached = JSON.parse(localStorage.getItem(secureDataCacheKey(userId)) || "null");
    if (!cached?.result || Date.now() - Number(cached.savedAt || 0) > secureDataCacheMaxAgeMs) return false;
    applySecureAppData(cached.result);
    return true;
  } catch (error) {
    localStorage.removeItem(secureDataCacheKey(userId));
    return false;
  }
}

async function loadSecureAppData(token, userId = "") {
  if (secureDataLoaded && allClients.length && products.length) return;
  const result = await postService({ action: "getAppData", token });
  applySecureAppData(result);
  saveSecureDataCache(userId || currentUser?.id || "", result);
}

async function refreshSecureAppDataInBackground(token, userId) {
  try {
    const result = await postService({ action: "getAppData", token });
    applySecureAppData(result);
    saveSecureDataCache(userId || currentUser?.id || "", result);
    if (currentUser) {
      visibleClients = filterClientsForUser(currentUser);
      populateProductRefs();
      renderDashboard(currentUser);
      renderDashboardSectorSwitch(currentUser);
      renderPromotions();
      if (selectedClient360) selectClient360(selectedClient360);
    }
  } catch (error) {
    // La copie locale permet de continuer à travailler même si Google répond lentement.
  }
}

async function refreshPromotionsFromDrive(force = false) {
  if (!currentSessionToken || promotionsRefreshInProgress) return;
  if (!force && Date.now() - lastPromotionsRefreshAt < 30000) return;
  promotionsRefreshInProgress = true;
  lastPromotionsRefreshAt = Date.now();
  if (promotionSendStatus) {
    promotionSendStatus.textContent = "Actualisation des promotions Drive…";
    promotionSendStatus.className = "tarif-send-status";
  }
  try {
    const result = await postService({ action: "getAppData", token: currentSessionToken });
    applySecureAppData(result);
    saveSecureDataCache(currentUser?.id || "", result);
    if (promotionSendStatus) {
      promotionSendStatus.textContent = "Promotions Drive à jour.";
      promotionSendStatus.classList.add("is-success");
    }
  } catch (error) {
    if (promotionSendStatus) {
      promotionSendStatus.textContent = "Impossible d'actualiser Drive pour l'instant. Dernière liste conservée.";
      promotionSendStatus.classList.add("is-warning");
    }
  } finally {
    promotionsRefreshInProgress = false;
  }
}

function clearSecureAppData() {
  allClients = [];
  products = [];
  prenetClients = [];
  localStatsData = {};
  clientArticleStats360 = { available: false, sourceFile: "", updatedAt: "", byClient: {} };
  prenetDataMeta = { updatedAt: "" };
  tariffConfig = { endpoint: tariffConfig.endpoint || "" };
  secureDataLoaded = false;
  populateProductRefs();
}

function recordActivity(type, detail = "") {
  if (!currentSessionToken || currentUser?.role === "admin") return;
  postService({ action: "logActivity", token: currentSessionToken, type, detail }).catch(() => {});
}

function setDisplayMode(mode) {
  const tablet = mode === "tablet";
  document.body.classList.toggle("tablet-mode", tablet);
  localStorage.setItem(displayModeStorageKey, tablet ? "tablet" : "pc");
  displayModeToggle.textContent = tablet ? "Mode PC" : "Mode tablette";
}

function toggleDisplayMode() {
  setDisplayMode(document.body.classList.contains("tablet-mode") ? "pc" : "tablet");
}

async function loadAdminLogs() {
  if (currentUser?.role !== "admin") return;
  adminLogStatus.textContent = "Actualisation…";
  refreshAdminLogs.disabled = true;
  try {
    const [result, expenseResult] = await Promise.all([
      postService({ action: "getAdminLogs", token: currentSessionToken }),
      postService({ action: "getExpenseReports", token: currentSessionToken }),
    ]);
    adminLogsCache = (result.logs || []).filter((log) => log.userId !== "admin");
    adminExpenseReportsCache = expenseResult.reports || [];
    renderAdminScopeOptions(adminLogsCache, adminExpenseReportsCache);
    renderAdminDashboard();
    adminLogStatus.textContent = "À jour";
  } catch (error) {
    adminLogStatus.textContent = "Erreur d’actualisation";
    adminLogBody.innerHTML = '<tr><td colspan="5" class="admin-empty">Impossible de charger le journal. Reconnectez-vous.</td></tr>';
    adminActivityFeed.innerHTML = '<div class="admin-empty">Impossible de charger le journal. Reconnectez-vous.</div>';
    adminExpenseBody.innerHTML = '<tr><td colspan="7" class="admin-empty">Impossible de charger les frais. Reconnectez-vous.</td></tr>';
  } finally {
    refreshAdminLogs.disabled = false;
  }
}

function renderAdminScopeOptions(logs, expenseReports = []) {
  const selected = adminScopeFilter.value || "all";
  const options = [{ value: "all", label: "Tous les commerciaux" }];
  const users = new Map();
  const sectors = new Set();
  [...logs, ...expenseReports].forEach((item) => {
    if (item.userId) users.set(item.userId, item.userName || item.userId);
    String(item.sectors || "").split("+").map((sector) => sector.trim()).filter(Boolean).forEach((sector) => sectors.add(sector));
  });
  [...users.entries()].sort((a, b) => a[1].localeCompare(b[1], "fr")).forEach(([id, name]) => options.push({ value: `user:${id}`, label: name }));
  [...sectors].sort((a, b) => a.localeCompare(b, "fr", { numeric: true })).forEach((sector) => options.push({ value: `sector:${sector}`, label: sector }));
  adminScopeFilter.innerHTML = options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join("");
  adminScopeFilter.value = options.some((option) => option.value === selected) ? selected : "all";
}

function getFilteredAdminLogs() {
  const scope = adminScopeFilter.value || "all";
  const resetAt = Number(localStorage.getItem(adminResetKey) || 0);
  const recentLogs = resetAt ? adminLogsCache.filter((log) => parseFrenchDateTime(log.date) >= resetAt) : adminLogsCache;
  if (scope === "all") return recentLogs;
  if (scope.startsWith("user:")) return recentLogs.filter((log) => log.userId === scope.slice(5));
  if (scope.startsWith("sector:")) return recentLogs.filter((log) => String(log.sectors || "").includes(scope.slice(7)));
  return recentLogs;
}

function getFilteredAdminExpenses() {
  const scope = adminScopeFilter.value || "all";
  if (scope === "all") return adminExpenseReportsCache;
  if (scope.startsWith("user:")) return adminExpenseReportsCache.filter((report) => report.userId === scope.slice(5));
  if (scope.startsWith("sector:")) return adminExpenseReportsCache.filter((report) => String(report.sectors || "").includes(scope.slice(7)));
  return adminExpenseReportsCache;
}

function parseFrenchDateTime(value = "") {
  const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) return 0;
  const [, day, month, year, hour, minute, second] = match;
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)).getTime();
}

function resetAdminLogDisplay() {
  localStorage.setItem(adminResetKey, String(Date.now()));
  renderAdminDashboard();
  adminLogStatus.textContent = "Affichage remis à zéro";
}

function adminActionClass(type = "") {
  const cleanType = normalize(type);
  if (cleanType.includes("commande")) return "is-order";
  if (cleanType.includes("prix")) return "is-price";
  if (cleanType.includes("document")) return "is-document";
  if (cleanType.includes("connexion")) return "is-login";
  return "is-navigation";
}

function renderAdminDashboard() {
  const logs = getFilteredAdminLogs();
  const counts = logs.reduce((result, log) => {
    const type = log.type || "Activité";
    result[type] = (result[type] || 0) + 1;
    return result;
  }, {});

  adminActivityCount.textContent = String(logs.length);
  adminOrderCount.textContent = String(logs.filter((log) => normalize(log.type || "").includes("commande")).length);
  adminDocumentCount.textContent = String(logs.filter((log) => normalize(log.type || "").includes("document")).length);
  adminClientCount.textContent = String(logs.filter((log) => normalize(log.type || "").includes("client")).length);
  adminNoteCount.textContent = String(logs.filter((log) => normalize(log.type || "").includes("note")).length);
  adminReminderCount.textContent = String(logs.filter((log) => normalize(log.type || "").includes("relance")).length);
  renderAdminExpenses();

  adminTypeSummary.innerHTML = Object.keys(counts).length
    ? Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([type, count]) => `
      <div class="admin-type-row">
        <span class="admin-action-badge ${adminActionClass(type)}">${escapeHtml(type)}</span>
        <strong>${count}</strong>
      </div>`).join("")
    : '<div class="admin-empty">Aucune activité sur ce filtre.</div>';

  adminActivityFeed.innerHTML = logs.length
    ? logs.slice(0, 40).map((log) => `
      <article class="admin-feed-item">
        <div class="admin-feed-top">
          <span class="admin-action-badge ${adminActionClass(log.type)}">${escapeHtml(log.type || "Activité")}</span>
          <small>${escapeHtml(log.date || "-")}</small>
        </div>
        <strong>${escapeHtml(log.userName || log.userId || "-")}</strong>
        <p>${escapeHtml(log.detail || "-")}</p>
        <small>${escapeHtml(log.sectors || "-")}</small>
      </article>`).join("")
    : '<div class="admin-empty">Aucune activité sur ce filtre.</div>';

  adminLogBody.innerHTML = logs.length ? logs.map((log) => `
    <tr>
      <td>${escapeHtml(log.date || "-")}</td>
      <td><strong>${escapeHtml(log.userName || log.userId || "-")}</strong></td>
      <td>${escapeHtml(log.sectors || "-")}</td>
      <td><span class="admin-action-badge ${adminActionClass(log.type)}">${escapeHtml(log.type || "Activité")}</span></td>
      <td>${escapeHtml(log.detail || "-")}</td>
    </tr>`).join("") : '<tr><td colspan="5" class="admin-empty">Aucune activité enregistrée pour ce filtre.</td></tr>';
}

function renderAdminExpenses() {
  const reports = getFilteredAdminExpenses();
  const total = reports.reduce((sum, report) => sum + (Number(report.totals?.refund) || 0), 0);
  adminExpenseCount.textContent = String(reports.length);
  adminExpenseTotal.textContent = formatter.format(roundMoney(total));
  adminExpenseBody.innerHTML = reports.length ? reports.map((report) => {
    const lines = Array.isArray(report.lines) ? report.lines : [];
    const lineDetails = lines.length ? `
      <details class="admin-expense-details">
        <summary>${lines.length} ligne${lines.length > 1 ? "s" : ""}</summary>
        <ul>
          ${lines.map((line) => `
            <li>
              <strong>${escapeHtml(line.date || "-")} · ${escapeHtml(line.type || "-")}</strong>
              <span>${escapeHtml(line.precision || "Sans précision")}</span>
              <em>${escapeHtml(formatter.format(roundMoney(line.refund || 0)))} / ${escapeHtml(formatter.format(roundMoney(line.amount || 0)))} TTC${line.receiptName ? ` · justificatif : ${escapeHtml(line.receiptName)}` : ""}</em>
            </li>
          `).join("")}
        </ul>
      </details>
    ` : "Aucune ligne";
    return `
      <tr>
        <td>${escapeHtml(report.updatedAt || report.createdAt || "-")}</td>
        <td><strong>${escapeHtml(report.userName || report.userId || "-")}</strong></td>
        <td>${escapeHtml(report.sectors || "-")}</td>
        <td><span class="admin-action-badge ${normalize(report.status || "").includes("envoye") ? "is-document" : "is-navigation"}">${escapeHtml(report.status || "Enregistré")}</span></td>
        <td><strong>${escapeHtml(report.title || "Note de frais")}</strong><br><small>${escapeHtml(report.note || "")}</small></td>
        <td><strong>${escapeHtml(formatter.format(roundMoney(report.totals?.refund || 0)))}</strong><br><small>TVA ${escapeHtml(formatter.format(roundMoney(report.totals?.vat || 0)))}</small></td>
        <td>${lineDetails}</td>
      </tr>
    `;
  }).join("") : '<tr><td colspan="7" class="admin-empty">Aucune note de frais enregistrée pour ce filtre.</td></tr>';
}

function resetTarifForm() {
  tarifSendForm.reset();
  tarifSendForm.classList.add("is-hidden");
  tarifSendStatus.textContent = "";
  tarifSendStatus.className = "tarif-send-status";
  sendTarifButton.disabled = false;
  sendTarifButton.textContent = "Envoyer le document";
}

function openTarifForm(tariffId) {
  selectedTariff = (tariffConfig.tariffs || []).find((tariff) => tariff.id === tariffId) || null;
  if (!selectedTariff) return;
  selectedTarifName.textContent = selectedTariff.name;
  tarifSendForm.classList.remove("is-hidden");
  tarifSendStatus.textContent = tariffConfig.endpoint
    ? ""
    : "L’envoi sera disponible après l’autorisation Google de l’adresse expéditrice.";
  requestAnimationFrame(() => tarifRecipient.focus());
}

async function sendTarif(event) {
  event.preventDefault();
  const recipient = tarifRecipient.value.trim();
  tarifSendStatus.className = "tarif-send-status";

  if (!tarifRecipient.checkValidity()) {
    tarifSendStatus.textContent = "Saisissez une adresse e-mail valide.";
    tarifSendStatus.classList.add("is-error");
    tarifRecipient.focus();
    return;
  }

  if (!tariffConfig.endpoint) {
    tarifSendStatus.textContent = "L’adresse d’envoi doit d’abord être autorisée par Google.";
    tarifSendStatus.classList.add("is-warning");
    return;
  }

  sendTarifButton.disabled = true;
  sendTarifButton.textContent = "Envoi en cours…";
  tarifSendStatus.textContent = "";

  try {
    await postService({ action: "sendTariff", recipient, tariff: selectedTariff?.id || "" });
    tarifSendStatus.textContent = `${selectedTariff.name} envoyé à ${recipient}.`;
    tarifSendStatus.classList.add("is-success");
    recordActivity("Document envoyé", `${selectedTariff.name} envoyé à ${recipient}`);
    tarifRecipient.value = "";
  } catch (error) {
    tarifSendStatus.textContent = "L’envoi n’a pas pu être effectué. Réessayez dans quelques instants.";
    tarifSendStatus.classList.add("is-error");
  } finally {
    sendTarifButton.disabled = false;
    sendTarifButton.textContent = "Envoyer le document";
  }
}

function getPromotions() {
  return Array.isArray(tariffConfig.promotions) ? tariffConfig.promotions : [];
}

function drivePreviewUrl(fileId) {
  return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
}

function renderPromotions() {
  const promotions = getPromotions();
  promotionSendStatus.textContent = "";
  promotionSendStatus.className = "tarif-send-status";
  if (!promotions.length) {
    promotionGrid.innerHTML = `
      <div class="promotion-empty">
        <strong>Aucune promotion configurée pour le moment.</strong>
        <span>Ajoute les PDF dans le Drive, puis indique leurs fichiers dans la configuration pour les afficher ici.</span>
      </div>`;
    return;
  }

  promotionGrid.innerHTML = promotions.map((promotion) => `
    <article class="promotion-card">
      <label class="promotion-check">
        <input type="checkbox" value="${escapeHtml(promotion.id)}" />
        <span>Sélectionner</span>
      </label>
      <div class="promotion-preview-thumb">
        <iframe src="${escapeHtml(drivePreviewUrl(promotion.driveFileId))}" title="${escapeHtml(promotion.name)}"></iframe>
      </div>
      <div class="tarif-card-copy">
        <span>Promotions</span>
        <h3>${escapeHtml(promotion.name)}</h3>
        <p>${escapeHtml(promotion.description || "PDF promotionnel prêt à présenter ou envoyer.")}</p>
      </div>
      <div class="promotion-card-actions">
        <button class="ghost-button compact" type="button" data-preview-promotion="${escapeHtml(promotion.id)}">Aperçu plein écran</button>
        <button class="primary-button compact" type="button" data-send-promotion="${escapeHtml(promotion.id)}">Envoyer</button>
      </div>
    </article>`).join("");
}

function selectedPromotionIds(forcedId = "") {
  if (forcedId) return [forcedId];
  return [...promotionGrid.querySelectorAll(".promotion-check input:checked")].map((input) => input.value);
}

function openPromotionPreview(promotionId) {
  const promotion = getPromotions().find((item) => item.id === promotionId);
  if (!promotion) return;
  promotionModalTitle.textContent = promotion.name;
  promotionPreviewFrame.src = drivePreviewUrl(promotion.driveFileId);
  promotionModal.classList.remove("is-hidden");
  recordActivity("Promotion consultée", promotion.name);
}

function closePromotionPreview() {
  promotionModal.classList.add("is-hidden");
  promotionPreviewFrame.src = "";
}

async function sendPromotions(forcedId = "") {
  promotionSendStatus.className = "tarif-send-status";
  const recipient = promotionRecipient.value.trim();
  const ids = selectedPromotionIds(forcedId);
  if (!promotionRecipient.checkValidity() || !recipient) {
    promotionSendStatus.textContent = "Saisissez une adresse e-mail valide.";
    promotionSendStatus.classList.add("is-error");
    promotionRecipient.focus();
    return;
  }
  if (!ids.length) {
    promotionSendStatus.textContent = "Sélectionnez au moins une promotion.";
    promotionSendStatus.classList.add("is-error");
    return;
  }

  sendSelectedPromotions.disabled = true;
  promotionSendStatus.textContent = "Envoi en cours…";
  try {
    await postService({ action: "sendDocuments", recipient, documents: ids.join(",") });
    const names = getPromotions().filter((item) => ids.includes(item.id)).map((item) => item.name).join(", ");
    promotionSendStatus.textContent = `${ids.length} promotion${ids.length > 1 ? "s" : ""} envoyée${ids.length > 1 ? "s" : ""} à ${recipient}.`;
    promotionSendStatus.classList.add("is-success");
    recordActivity("Promotion envoyée", `${names} envoyé à ${recipient}`);
    promotionGrid.querySelectorAll(".promotion-check input:checked").forEach((input) => { input.checked = false; });
  } catch (error) {
    promotionSendStatus.textContent = error.message || "L’envoi n’a pas pu être effectué. Vérifiez que les promotions sont bien activées côté Drive.";
    promotionSendStatus.classList.add("is-error");
  } finally {
    sendSelectedPromotions.disabled = false;
  }
}

function getVisiblePrenetClients() {
  if (!currentUser) return [];
  const allowedCodes = new Set(visibleClients.map((client) => normalize(client.code)));
  const allowedSectors = new Set((currentUser.sectors || [currentUser.sector]).map(normalize));
  return prenetClients.filter((client) => {
    const sameSector = allowedSectors.has(normalize(client.sector || ""));
    const allowedClient = !client.code || allowedCodes.has(normalize(client.code));
    return sameSector && allowedClient;
  });
}

function renderPrenetEmpty() {
  selectedPrenetClient = null;
  prenetClientSearch.value = "";
  prenetClientSuggestions.innerHTML = "";
  prenetClientSuggestions.classList.remove("is-open");
  prenetSector.textContent = currentUser?.sectors?.join(" + ") || currentUser?.sector || "Secteur";
  prenetResult.innerHTML = `
    <div class="prenet-empty">
      <strong>Sélectionnez un client</strong>
      <span>Ses nouveaux prix nets apparaîtront ici, classés par référence.</span>
    </div>`;
}

function renderPrenetSuggestions(query) {
  const cleanQuery = normalize(query.trim());
  prenetClientSuggestions.innerHTML = "";
  if (!cleanQuery) {
    renderPrenetEmpty();
    prenetClientSuggestions.classList.remove("is-open");
    return;
  }

  const matches = getVisiblePrenetClients()
    .filter((client) => normalize(`${client.code || ""} ${client.name || ""}`).includes(cleanQuery))
    .slice(0, 12);

  if (!matches.length) {
    prenetClientSuggestions.innerHTML = '<div class="suggestion-empty">Aucun client avec des prix nets dans votre secteur.</div>';
    prenetClientSuggestions.classList.add("is-open");
    return;
  }

  matches.forEach((client) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion";
    button.innerHTML = `<strong>${escapeHtml(client.name || "Client")}</strong><span>${escapeHtml(client.code || "")}</span>`;
    button.addEventListener("click", () => selectPrenetClient(client));
    prenetClientSuggestions.appendChild(button);
  });
  prenetClientSuggestions.classList.add("is-open");
}

function renderPrenetTable(title, entries, statusClass) {
  if (!entries.length) return "";
  return `
    <section class="prenet-group">
      <div class="prenet-group-heading">
        <h3>${escapeHtml(title)}</h3>
        <span class="prenet-count">${entries.length} référence${entries.length > 1 ? "s" : ""}</span>
      </div>
      <div class="prenet-table-wrap">
        <table class="prenet-table">
          <thead><tr><th>Référence</th><th>Quantité</th><th>Prix net</th><th>Statut</th></tr></thead>
          <tbody>${entries.map((entry) => `
            <tr>
              <td><strong>${escapeHtml(entry.ref || "-")}</strong>${entry.designation ? `<small>${escapeHtml(entry.designation)}</small>` : ""}</td>
              <td>${formatNumber(entry.quantity)}</td>
              <td><strong>${escapeHtml(formatter.format(Number(entry.price) || 0))}</strong></td>
              <td><span class="prenet-badge ${statusClass}">${escapeHtml(entry.status || title)}</span></td>
            </tr>`).join("")}</tbody>
        </table>
      </div>
    </section>`;
}

function getPrenetNewEntries(client) {
  const entries = Array.isArray(client?.entries) ? [...client.entries] : [];
  entries.sort((a, b) => (a.ref || "").localeCompare(b.ref || "", "fr", { numeric: true }));
  return entries.filter((entry) => !normalize(entry.status || "").startsWith("ancien"));
}

function filterPrenetEntries(entries, query) {
  const cleanQuery = normalize(query || "");
  if (!cleanQuery) return entries;
  return entries.filter((entry) => normalize([
    entry.ref,
    entry.designation,
    entry.quantity,
    entry.price,
    entry.status,
  ].join(" ")).includes(cleanQuery));
}

function renderPrenetReferenceResults(client, query = "") {
  const allEntries = getPrenetNewEntries(client);
  const visibleEntries = filterPrenetEntries(allEntries, query);
  if (!allEntries.length) {
    return '<div class="prenet-empty"><strong>Aucun prix net</strong><span>Aucune ligne disponible pour ce client.</span></div>';
  }
  if (!visibleEntries.length) {
    return '<div class="prenet-empty"><strong>Aucune référence trouvée</strong><span>Essayez une autre référence ou une partie du nom produit.</span></div>';
  }
  return renderPrenetTable("Nouveaux prix nets", visibleEntries, "is-new");
}

function selectPrenetClient(client) {
  selectedPrenetClient = client;
  prenetClientSearch.value = `${client.name || ""}${client.code ? ` · ${client.code}` : ""}`;
  prenetClientSuggestions.classList.remove("is-open");
  const newEntries = getPrenetNewEntries(client);
  recordActivity("Prix nets consultés", `${client.name || "Client"}${client.code ? ` (${client.code})` : ""} - ${newEntries.length} référence(s)`);

  prenetResult.innerHTML = `
    <header class="prenet-client-header">
      <div><p class="step">${escapeHtml(client.code || currentUser.sector)}</p><h2>${escapeHtml(client.name || "Client")}</h2></div>
      <div class="prenet-update"><span>Mise à jour</span><strong>${escapeHtml(prenetDataMeta.updatedAt || "-")}</strong></div>
    </header>
    <div class="prenet-reference-search">
      <label for="prenetReferenceSearch">Rechercher une référence</label>
      <input id="prenetReferenceSearch" type="search" autocomplete="off" placeholder="Tapez une référence ou un nom produit…" />
    </div>
    <div id="prenetReferenceResults">
      ${renderPrenetReferenceResults(client)}
    </div>`;
}

function findStatsClient(row) {
  const rowCode = normalize(row.clientCode || row.codeClient || row.code || "");
  const rowName = normalize(row.clientName || row.client || row.nomClient || "");
  return allClients.find((client) => {
    if (rowCode && normalize(client.code) === rowCode) return true;
    return rowName && normalize(client.name) === rowName;
  });
}

function normalizeStatsSector(value) {
  const clean = normalize(value || "").replace(/^secteur\s*/, "").replace(/^0+/, "");
  if (!clean) return "";
  if (clean.endsWith("a")) return `Secteur ${clean.slice(0, -1).toUpperCase()}A`;
  return `Secteur ${clean.toUpperCase()}`;
}

function getStatsDepartment(client) {
  const zip = String(client?.deliveryZip || client?.billingZip || "").replace(/\D/g, "");
  if (!zip) return "Autres";
  if (zip.length === 4) return zip.slice(0, 1);
  return zip.slice(0, 2);
}

function formatSignedCurrency(value) {
  const amount = Number(value) || 0;
  return `${amount >= 0 ? "+" : "-"}${formatter.format(Math.abs(amount))}`;
}

function formatSignedPercent(value) {
  const amount = Number(value) || 0;
  return `${amount >= 0 ? "+" : "-"}${Math.abs(amount).toFixed(1).replace(".", ",")}%`;
}

function monthNameFromObjectiveLabel(label) {
  return String(label || "mois").replace(/\s+20\d{2}\b/g, "").trim() || "mois";
}

function buildComparisonNote(current, target, suffix) {
  const diff = Number(current || 0) - Number(target || 0);
  const pct = target ? (diff / Number(target || 0)) * 100 : 0;
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${formatter.format(diff)} - ${sign}${pct.toFixed(1).replace(".", ",")}% ${suffix || ""}`.trim();
}

function buildGoal(label, current, target, options = {}) {
  const diff = Number(current || 0) - Number(target || 0);
  const percent = target ? (Number(current || 0) / Number(target || 0)) * 100 : 0;
  const remaining = Math.max(0, Number(target || 0) - Number(current || 0));
  const sign = diff >= 0 ? "+" : "";
  return {
    label,
    current,
    target,
    percent: typeof options.percent === "number" ? options.percent : percent,
    format: options.format || "currency",
    valueLabel: options.valueLabel || `${formatter.format(Number(current) || 0)} / ${formatter.format(Number(target) || 0)}`,
    note: options.note || `${sign}${formatter.format(diff)} · ${sign}${percent.toFixed(1).replace(".", ",")}%`,
    remaining,
  };
}

function getFallbackStatsForSector(sector) {
  if (localStatsData.bySector?.[sector]) return localStatsData.bySector[sector];
  if (normalizeStatsSector(sector) === "Secteur 9" && localStatsData.default) return localStatsData.default;
  return {};
}

function buildStatsForSector(sector, rows, sourceInfo, fallbackStats = {}) {
  const clientTotals = new Map();
  const departmentTotals = new Map();
  let totalRevenue = 0;
  let totalObjective = 0;
  let totalPrevious = 0;
  let totalPreviousMonth = 0;

  rows.forEach((row) => {
    const client = row.__client || findStatsClient(row);
    const revenue = Number(row.revenue) || 0;
    const objective = Number(row.objective) || 0;
    const previous = Number(row.previousRevenue) || 0;
    const previousMonth = Number(row.previousMonthRevenue) || 0;
    totalRevenue += revenue;
    totalObjective += objective;
    totalPrevious += previous;
    totalPreviousMonth += previousMonth;
    const code = client?.code || row.clientCode || row.id;
    const existing = clientTotals.get(code) || {
      code,
      name: client?.name || row.clientName || "Client",
      revenue: 0,
    };
    existing.revenue += revenue;
    clientTotals.set(code, existing);
    const department = getStatsDepartment(client);
    departmentTotals.set(department, (departmentTotals.get(department) || 0) + revenue);
  });

  const topClients = [...clientTotals.values()].filter((client) => client.revenue > 0).sort((a, b) => b.revenue - a.revenue);
  const values = topClients.map((client) => client.revenue).sort((a, b) => a - b);
  const median = values.length ? values[Math.floor(values.length / 2)] : 0;
  const goals = [];
  const monthlyObjective = Number(sourceInfo.monthlyObjectives?.[sector]) || 0;
  const ytdObjective = Number(sourceInfo.ytdObjectives?.[sector]) || 0;
  const annualObjective = Number(sourceInfo.annualObjectives?.[sector]) || 0;
  const objectiveTarget = monthlyObjective || totalObjective;
  const objectiveRemaining = Math.max(0, objectiveTarget - totalRevenue);
  const objectivePercent = objectiveTarget > 0 ? (totalRevenue / objectiveTarget) * 100 : 0;
  const objectiveMonthLabel = sourceInfo.objectiveMonthLabel || "mois";
  const monthName = monthNameFromObjectiveLabel(objectiveMonthLabel);
  const monthTitle = `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)}`;
  const cumulativeLabel = `janvier-${monthName}`;
  const projectionValue = totalObjective > 0 ? totalObjective : totalRevenue;

  if (ytdObjective > 0 || projectionValue > 0) {
    goals.push(buildGoal(`Projection ${cumulativeLabel}`, projectionValue, ytdObjective, {
      note: ytdObjective > 0 ? buildComparisonNote(projectionValue, ytdObjective, "vs objectif") : "Objectif cumule absent du fichier previsionnel.",
    }));
  }
  if (totalPrevious > 0) {
    goals.push(buildGoal(`Comparaison N-1 ${cumulativeLabel}`, projectionValue, totalPrevious, {
      note: buildComparisonNote(projectionValue, totalPrevious, "vs 2025"),
    }));
  } else {
    goals.push(buildGoal(`Comparaison N-1 ${cumulativeLabel}`, 0, 0, {
      percent: 0,
      valueLabel: "Donnee N-1 absente",
      note: "Le fichier CA actualise ne contient pas de colonne N-1 cumulee exploitable.",
    }));
  }
  if (monthlyObjective > 0) {
    goals.push(buildGoal(`Previsionnel ${monthName}`, totalRevenue, monthlyObjective, {
      note: buildComparisonNote(totalRevenue, monthlyObjective, "vs objectif"),
    }));
  } else if (totalRevenue > 0) {
    goals.push(buildGoal(`Previsionnel ${monthName}`, totalRevenue, 0, {
      percent: 0,
      valueLabel: "Objectif mois absent",
      note: "Ajoute le mois dans le fichier Previsionnel 2026 pour afficher l objectif.",
    }));
  }
  if (totalPreviousMonth > 0) {
    goals.push(buildGoal(`${monthTitle} vs N-1`, totalRevenue, totalPreviousMonth, {
      note: buildComparisonNote(totalRevenue, totalPreviousMonth, "vs 2025"),
    }));
  } else {
    goals.push(buildGoal(`${monthTitle} vs N-1`, 0, 0, {
      percent: 0,
      valueLabel: "Donnee N-1 mois absente",
      note: "Il faut une colonne N-1 du mois dans le fichier CA pour cette ligne.",
    }));
  }
  const safeGoals = goals.length
    ? goals
    : (Array.isArray(fallbackStats.goals) ? fallbackStats.goals.map((goal) => ({
        ...goal,
        note: goal.note ? `${goal.note} · référence prévisionnelle` : "Référence prévisionnelle",
      })) : []);

  return {
    updatedAt: sourceInfo.updatedAt || "Drive",
    periodLabel: `CA depuis le début du mois · ${sector} · ${sourceInfo.sourceFile || "fichier Drive"}`,
    kpis: {
      revenue: totalRevenue,
      clients: topClients.length,
      monthlyObjective,
      ytdObjective,
      annualObjective,
      objectiveRemaining,
      objectivePercent,
      objectiveMonthLabel: sourceInfo.objectiveMonthLabel || "mois",
      averageClient: topClients.length ? totalRevenue / topClients.length : 0,
      medianClient: median,
      revenueNote: "CA fichier Drive",
      clientsNote: monthlyObjective > 0
        ? `${Math.min(999, Math.max(0, objectivePercent)).toFixed(1).replace(".", ",")}% atteint · reste ${formatter.format(objectiveRemaining)}`
        : `${topClients.length} client${topClients.length > 1 ? "s" : ""} avec CA`,
      averageNote: `Médiane : ${formatter.format(median)}`,
    },
    salesTrend: [...departmentTotals.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8),
    goals: safeGoals,
    allClientsStats: topClients,
    topClients: topClients.slice(0, 8),
  };
}

function buildDashboardStatsFromRows(rows, sourceInfo) {
  const grouped = {};
  (rows || []).forEach((row) => {
    const client = findStatsClient(row);
    const sector = normalizeStatsSector(row.sector) || client?.sector || "";
    if (!sector) return;
    if (!grouped[sector]) grouped[sector] = [];
    grouped[sector].push({ ...row, __client: client });
  });

  const bySector = {};
  Object.keys(grouped).forEach((sector) => {
    bySector[sector] = buildStatsForSector(sector, grouped[sector], sourceInfo, getFallbackStatsForSector(sector));
  });

  return {
    bySector,
    default: bySector["Secteur 9"] || Object.values(bySector)[0] || localStatsData.default || {},
  };
}

async function loadDashboardStatsFromDrive() {
  if (!currentSessionToken || dashboardStatsLoading || currentUser?.role === "admin") return;
  dashboardStatsLoading = true;
  const previousUpdatedAt = document.querySelector("#dashboardUpdatedAt").textContent;
  document.querySelector("#dashboardUpdatedAt").textContent = "Actualisation Drive…";
  try {
    const result = await postService({ action: "getDashboardStats", token: currentSessionToken });
    dashboardStatsOverride = buildDashboardStatsFromRows(result.rows || [], {
      updatedAt: result.updatedAt,
      sourceFile: result.sourceFile,
      monthlyObjectives: result.monthlyObjectives || {},
      ytdObjectives: result.ytdObjectives || {},
      annualObjectives: result.annualObjectives || {},
      objectiveMonthLabel: result.objectiveMonthLabel || "",
      objectiveMonthKey: result.objectiveMonthKey || "",
    });
    renderDashboardSectorSwitch(currentUser);
    renderDashboard(currentUser);
  } catch (error) {
    document.querySelector("#dashboardUpdatedAt").textContent = previousUpdatedAt || "Données locales";
  } finally {
    dashboardStatsLoading = false;
  }
}

async function loadClientArticleStatsFromDrive() {
  if (!currentSessionToken) return;
  try {
    const result = await postService({ action: "getClientArticleStats", token: currentSessionToken });
    clientArticleStats360 = result.clientArticleStats || { available: false, sourceFile: "", updatedAt: "", byClient: {} };
    if (selectedClient360) selectClient360(selectedClient360);
  } catch (error) {
    // On garde la derniere version chargee pour ne pas bloquer le terrain.
  }
}

function getDashboardStats(user) {
  const stats = dashboardStatsOverride || localStatsData || {};
  if (activeDashboardSector && stats.bySector?.[activeDashboardSector]) return stats.bySector[activeDashboardSector];
  if (stats.byUser?.[user.id]) return stats.byUser[user.id];
  if (user.id === "flo") return stats.default || {};
  return {
    updatedAt: "À venir",
    periodLabel: `Les statistiques ${user.sectors.join(" + ")} seront affichées dès leur import.`,
    kpis: { revenue: 0, clients: visibleClients.length, averageClient: 0 },
    salesTrend: [],
    goals: [],
    topClients: [],
  };
}

function renderDashboardSectorSwitch(user) {
  const sectors = user.sectors || [];
  dashboardSectorSwitch.innerHTML = "";
  dashboardSectorSwitch.classList.toggle("is-hidden", sectors.length < 2);
  if (sectors.length < 2) return;

  sectors.forEach((sector) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dashboard-sector-button${sector === activeDashboardSector ? " is-active" : ""}`;
    button.textContent = sector;
    button.addEventListener("click", () => {
      activeDashboardSector = sector;
      renderDashboardSectorSwitch(user);
      renderDashboard(user);
    });
    dashboardSectorSwitch.appendChild(button);
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("fr-FR").format(Number(value) || 0);
}

function renderDashboard(user) {
  const stats = getDashboardStats(user);
  const kpis = stats.kpis || {};
  const trend = Array.isArray(stats.salesTrend) ? stats.salesTrend : [];
  const goals = Array.isArray(stats.goals) ? stats.goals : [];
  const topClients = Array.isArray(stats.topClients) ? stats.topClients : [];

  document.querySelector("#dashboardUpdatedAt").textContent = stats.updatedAt || "En attente";
  document.querySelector("#dashboardPeriod").textContent = stats.periodLabel || "Vue synthétique de votre activité commerciale.";
  document.querySelector("#metricOrders").previousElementSibling.textContent = "CA réalisé";
  document.querySelector("#metricOrders").textContent = formatter.format(Number(kpis.revenue) || 0);
  const monthlyObjective = Number(kpis.monthlyObjective) || 0;
  const objectivePercent = Number(kpis.objectivePercent) || 0;
  const objectiveRemaining = Number(kpis.objectiveRemaining) || 0;
  document.querySelector("#metricRevenue").previousElementSibling.textContent = monthlyObjective ? `Objectif ${kpis.objectiveMonthLabel || "mois"}` : "Objectif mois";
  document.querySelector("#metricRevenue").textContent = monthlyObjective ? formatter.format(monthlyObjective) : "--";
  document.querySelector("#metricClients").textContent = formatter.format(Number(kpis.averageClient) || 0);
  document.querySelector("#metricOrdersNote").textContent = kpis.revenueNote || "Secteur du commercial";
  document.querySelector("#metricRevenueNote").textContent = kpis.clientsNote || "Clients avec CA prévisionnel";
  document.querySelector("#metricClientsNote").textContent = kpis.averageNote || "Valeur moyenne du portefeuille";
  document.querySelector("#metricRevenueNote").textContent = monthlyObjective
    ? `${Math.max(0, objectivePercent).toFixed(1).replace(".", ",")}% atteint · reste ${formatter.format(objectiveRemaining)}`
    : (kpis.clientsNote || "Objectif mensuel non trouvé");

  const maxTrend = Math.max(...trend.map((item) => Number(item.value) || 0), 1);
  document.querySelector("#trendTotal").textContent = trend.length
    ? formatter.format(trend.reduce((sum, item) => sum + (Number(item.value) || 0), 0))
    : "Aucune donnée";
  document.querySelector("#salesChart").innerHTML = trend.length
    ? trend.map((item) => {
        const value = Number(item.value) || 0;
        const height = Math.max((value / maxTrend) * 100, value > 0 ? 6 : 0);
        return `<div class="chart-column"><span class="chart-value">${escapeHtml(formatter.format(value))}</span><div class="chart-bar-track"><div class="chart-bar" style="height:${height}%"></div></div><strong>${escapeHtml(item.label || "-")}</strong></div>`;
      }).join("")
    : '<div class="dashboard-empty">Aucune donnée géographique.</div>';

  document.querySelector("#goalList").innerHTML = goals.length
    ? goals.map((goal) => {
        const current = Number(goal.current) || 0;
        const target = Number(goal.target) || 0;
        const percent = typeof goal.percent === "number" ? Math.min(Math.max(goal.percent, 0), 100) : (target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0);
        const displayCurrent = goal.format === "currency" ? formatter.format(current) : formatNumber(current);
        const displayTarget = goal.format === "currency" ? formatter.format(target) : formatNumber(target);
        const valueLabel = goal.valueLabel || `${displayCurrent} / ${displayTarget}`;
        return `<div class="goal-item"><div><strong>${escapeHtml(goal.label || "Indicateur")}</strong><span>${escapeHtml(valueLabel)}</span></div><div class="goal-track"><span style="width:${percent}%"></span></div><small>${escapeHtml(goal.note || `${percent}% du CA total`)}</small></div>`;
      }).join("")
    : '<div class="dashboard-empty">Aucun objectif renseigné.</div>';

  document.querySelector("#topClientsBody").innerHTML = topClients.length
    ? topClients.slice(0, 8).map((client) => `<tr><td><strong>${escapeHtml(client.name || "-")}</strong><small>${escapeHtml(client.code || "")}</small></td><td>${escapeHtml(formatter.format(Number(client.revenue) || 0))}</td></tr>`).join("")
    : '<tr><td colspan="2" class="dashboard-empty">Aucune donnée client.</td></tr>';

  renderHomeReminders();
}

function escapeHtml(value) {
  return value
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function actionLabel(value) {
  const labels = {
    relance: "Relance client",
    devis: "Devis a faire",
    commande: "Commande probable",
    rien: "Rien a faire",
  };
  return labels[value] || "";
}

function setVisitActionVisibility() {
  if (!visitFollowupDaysLabel || !visitNextAction) return;
  const needsDelay = ["relance", "devis", "commande"].includes(visitNextAction.value);
  visitFollowupDaysLabel.classList.toggle("is-hidden", !needsDelay);
}

function appendVisitSummaryToNote(action) {
  const currentText = notesText.value.trim();
  const label = actionLabel(action);
  const dateLabel = formatNoteDate(notesDate.value || todayInputDate());
  const summaryLines = [
    "---- Resume fin de visite ----",
    `Client : ${selectedNotesClient.name} (${selectedNotesClient.code})`,
    `Date : ${dateLabel}`,
    `Prochaine action : ${label}`,
  ];
  if (action !== "rien") {
    summaryLines.push(`Delai prevu : ${Math.max(0, Number(visitFollowupDays.value) || 0)} jour(s)`);
  }
  const summary = summaryLines.join("\n");
  return currentText ? `${currentText}\n\n${summary}` : summary;
}

function getClientStats360(client) {
  const stats = getDashboardStats(currentUser || {});
  const list = Array.isArray(stats.allClientsStats) ? stats.allClientsStats : Array.isArray(stats.topClients) ? stats.topClients : [];
  return list.find((item) => normalize(item.code || "") === normalize(client.code || "") || normalize(item.name || "") === normalize(client.name || ""));
}

function getClientArticleStats360(client) {
  const byClient = clientArticleStats360?.byClient || {};
  const codeKey = normalize(client.code || "");
  if (codeKey && byClient[codeKey]) return byClient[codeKey];
  const nameKey = normalize(client.name || "");
  if (nameKey && byClient[nameKey]) return byClient[nameKey];
  return null;
}

function buildClientArticleFallbackSummary(articleStats) {
  const articles = Array.isArray(articleStats?.topArticles) ? articleStats.topArticles : [];
  if (!articles.length) return null;
  const ca2026 = articles.reduce((sum, article) => sum + (Number(article.ca2026) || 0), 0);
  const ca2025 = articles.reduce((sum, article) => sum + (Number(article.ca2025) || 0), 0);
  return {
    ca2026,
    ca2025,
    gapCa: ca2026 - ca2025,
  };
}

function getClientPrenet360(client) {
  return getVisiblePrenetClients().find((item) =>
    normalize(item.code || "") === normalize(client.code || "") ||
    normalize(item.name || "") === normalize(client.name || "")
  );
}

function getClient360Data(client) {
  const notes = getVisibleVisitNotes().filter((note) => note.clientCode === client.code);
  const quotes = getQuoteHistory().filter((item) => item.clientCode === client.code || normalize(item.clientName || "") === normalize(client.name || ""));
  const prenet = getClientPrenet360(client);
  return {
    stats: getClientStats360(client),
    articleStats: getClientArticleStats360(client),
    notes,
    quotes,
    orders: [],
    prenetEntries: prenet?.entries || [],
  };
}

function renderClient360Empty(message = "Recherchez un client pour afficher sa vue complete.") {
  selectedClient360 = null;
  if (client360Status) client360Status.textContent = "Client non selectionne";
  document.querySelector("#client360Grid")?.classList.add("is-empty");
  if (client360Summary) client360Summary.innerHTML = `
    <div class="client360-empty-state">
      <strong>Rechercher un client</strong>
      <span>${escapeHtml(message)}</span>
      <small>La fiche regroupera ensuite le CA, les notes, les devis, les prix nets et les futurs top articles.</small>
    </div>
  `;
  [client360Notes, client360Quotes, client360Prenets, client360Orders].forEach((container) => {
    if (container) container.innerHTML = '<div class="dashboard-empty">Aucune donnee.</div>';
  });
  [client360NotesCount, client360QuotesCount, client360PrenetCount, client360OrdersCount].forEach((badge) => {
    if (badge) badge.textContent = "0";
  });
}

function renderClient360Suggestions(query) {
  const cleanQuery = normalize(query.trim());
  if (!client360Suggestions) return;
  client360Suggestions.innerHTML = "";
  if (!cleanQuery) {
    renderClient360Empty();
    client360Suggestions.classList.remove("is-open");
    return;
  }
  const matches = visibleClients
    .filter((client) => normalize([
      client.code,
      client.name,
      client.billingCity,
      client.billingZip,
      client.deliveryCity,
      client.deliveryZip,
      client.sector,
    ].join(" ")).includes(cleanQuery))
    .slice(0, 12);
  if (!matches.length) {
    client360Suggestions.classList.remove("is-open");
    return;
  }
  matches.forEach((client) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion";
    button.innerHTML = `
      <strong>${escapeHtml(client.name)}</strong>
      <span>${escapeHtml(client.code)} - ${escapeHtml(client.billingZip)} ${escapeHtml(client.billingCity)} - ${escapeHtml(client.sector)}</span>
    `;
    button.addEventListener("click", () => selectClient360(client));
    client360Suggestions.appendChild(button);
  });
  client360Suggestions.classList.add("is-open");
}

function renderClient360List(container, items, emptyText, renderer) {
  if (!container) return;
  container.innerHTML = items.length
    ? items.map(renderer).join("")
    : `<div class="dashboard-empty">${escapeHtml(emptyText)}</div>`;
}

function renderClient360PrenetStats(entries) {
  if (!entries.length) return '<div class="dashboard-empty">Aucun prix net trouvé pour ce client.</div>';
  return `
    <div class="client360-table-wrap">
      <table class="client360-prenet-table">
        <colgroup>
          <col class="prenet-ref-col" />
          <col class="prenet-qty-col" />
          <col class="prenet-price-col" />
        </colgroup>
        <thead>
          <tr><th>Référence</th><th>Quantité</th><th>Prix net</th></tr>
        </thead>
        <tbody>${entries.map((entry) => `
          <tr>
            <td><strong>${escapeHtml(entry.ref || "-")}</strong><small>${escapeHtml(entry.designation || "")}</small></td>
            <td class="numeric">${escapeHtml(formatNumber(entry.quantity || 0))}</td>
            <td class="numeric"><strong>${escapeHtml(formatter.format(Number(entry.price) || 0))}</strong></td>
          </tr>
        `).join("")}</tbody>
      </table>
    </div>
  `;
}

function formatEvolutionPercent(value) {
  if (value === null || value === undefined || !isFinite(Number(value))) return "--";
  const percent = Number(value) * 100;
  return `${percent >= 0 ? "+" : ""}${percent.toFixed(1).replace(".", ",")}%`;
}

function formatCurrencyDelta(value) {
  const number = Number(value) || 0;
  const label = formatter.format(Math.abs(number));
  if (number > 0) return `+${label}`;
  if (number < 0) return `-${label}`;
  return formatter.format(0);
}

function formatWholeCurrency(value) {
  return wholeCurrencyFormatter.format(Number(value) || 0);
}

function formatWholeCurrencyDelta(value) {
  const number = Number(value) || 0;
  const label = wholeCurrencyFormatter.format(Math.abs(number));
  if (number > 0) return `+${label}`;
  if (number < 0) return `-${label}`;
  return wholeCurrencyFormatter.format(0);
}

function formatNumberDelta(value) {
  const number = Number(value) || 0;
  const label = formatNumber(Math.abs(number));
  if (number > 0) return `+${label}`;
  if (number < 0) return `-${label}`;
  return "0";
}

function client360StatTrendClass(value) {
  const number = Number(value);
  if (!isFinite(number) || number === 0) return "is-neutral";
  return number > 0 ? "is-up" : "is-down";
}

function renderClient360ArticleStats(topArticles) {
  if (!topArticles.length) {
    return clientArticleStats360?.available
      ? '<div class="dashboard-empty">Aucun achat trouve pour ce client dans le fichier Drive.</div>'
      : '<div class="dashboard-empty">Aucun fichier stats client/article charge depuis Drive.</div>';
  }
  const rows = topArticles.map((article, index) => {
    const gapCa = Number(article.gapCa) || ((Number(article.ca2026) || 0) - (Number(article.ca2025) || 0));
    const gapQty = Number(article.gapQuantity) || ((Number(article.quantity2026) || 0) - (Number(article.quantity2025) || 0));
    const trendClass = client360StatTrendClass(gapCa || gapQty);
    return `
      <tr>
        <td><span class="client360-rank">${index + 1}</span></td>
        <td>
          <strong>${escapeHtml(article.articleCode || "")}</strong>
          <small>${escapeHtml(article.articleName || "Article sans designation")}</small>
          ${article.family ? `<em>${escapeHtml(article.family)}</em>` : ""}
        </td>
        <td class="numeric">${escapeHtml(formatWholeCurrency(article.ca2026))}</td>
        <td class="numeric muted">${escapeHtml(formatWholeCurrency(article.ca2025))}</td>
        <td class="numeric ${trendClass}">${escapeHtml(formatWholeCurrencyDelta(gapCa))}</td>
        <td class="numeric">${escapeHtml(formatNumber(article.quantity2026 || 0))}</td>
        <td class="numeric muted">${escapeHtml(formatNumber(article.quantity2025 || 0))}</td>
        <td class="numeric ${trendClass}">${escapeHtml(formatNumberDelta(gapQty))}</td>
      </tr>
    `;
  }).join("");
  return `
    <div class="client360-article-dashboard">
      <div class="client360-table-wrap">
        <table class="client360-article-table">
          <colgroup>
            <col class="article-rank-col" />
            <col class="article-name-col" />
            <col class="article-ca-col" />
            <col class="article-ca-col" />
            <col class="article-gap-col" />
            <col class="article-qty-col" />
            <col class="article-qty-col" />
            <col class="article-qty-gap-col" />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>Article</th>
              <th>CA 2026</th>
              <th>CA N-1</th>
              <th>Écart €</th>
              <th>Qté 2026</th>
              <th>Qté N-1</th>
              <th>Écart Qté</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function selectClient360(client) {
  selectedClient360 = client;
  if (client360Search) client360Search.value = client.name;
  client360Suggestions?.classList.remove("is-open");
  document.querySelector("#client360Grid")?.classList.remove("is-empty");
  if (client360Status) client360Status.textContent = "Client selectionne";
  const data = getClient360Data(client);
  const articleSummary = data.articleStats?.summary || buildClientArticleFallbackSummary(data.articleStats) || null;
  const caLabel = articleSummary ? formatWholeCurrency(articleSummary.ca2026) : data.stats ? formatWholeCurrency(data.stats.revenue) : "--";
  const caPreviousLabel = articleSummary ? formatWholeCurrency(articleSummary.ca2025) : "--";
  const gapCa = articleSummary ? Number(articleSummary.gapCa || ((Number(articleSummary.ca2026) || 0) - (Number(articleSummary.ca2025) || 0))) : null;
  const evolutionLabel = articleSummary ? formatWholeCurrencyDelta(gapCa) : "--";
  const topArticles = Array.isArray(data.articleStats?.topArticles) ? data.articleStats.topArticles : [];
  client360Summary.innerHTML = `
    <article class="selected-client client360-identity">
      <div>
        <strong>${escapeHtml(client.name)}</strong>
        <span>${escapeHtml(client.code)} - ${escapeHtml(client.sector || "")}</span>
        <span>${escapeHtml(client.deliveryAddress || client.billingAddress || "")}</span>
        <span>${escapeHtml(client.deliveryZip || client.billingZip || "")} ${escapeHtml(client.deliveryCity || client.billingCity || "")}</span>
      </div>
      <div class="client360-kpis">
        <span><small>CA 2026</small><strong>${escapeHtml(caLabel)}</strong></span>
        <span><small>CA N-1</small><strong>${escapeHtml(caPreviousLabel)}</strong></span>
        <span class="${client360StatTrendClass(gapCa)}"><small>Écart CA</small><strong>${escapeHtml(evolutionLabel)}</strong></span>
        <span><small>Prix nets</small><strong>${data.prenetEntries.length}</strong></span>
      </div>
    </article>
  `;
  if (client360PrenetCount) client360PrenetCount.textContent = String(data.prenetEntries.length);
  if (client360OrdersCount) client360OrdersCount.textContent = String(topArticles.length);
  if (client360Prenets) client360Prenets.innerHTML = renderClient360PrenetStats(data.prenetEntries.slice(0, 14));
  if (client360Orders) client360Orders.innerHTML = renderClient360ArticleStats(topArticles);
  recordActivity("Fiche client consultee", `${client.name} (${client.code})`);
}

function openClient360LinkedTab(target, orderId = "") {
  if (!selectedClient360) return;
  if (target === "notes") {
    setActiveTab("notes");
    selectNotesClient(selectedClient360);
    return;
  }
  if (target === "quote") {
    setActiveTab("quote");
    selectQuoteClient(selectedClient360);
    renderQuoteHistory();
    return;
  }
  if (target === "prenet") {
    const prenet = getClientPrenet360(selectedClient360);
    setActiveTab("prenet");
    if (prenet) selectPrenetClient(prenet);
    return;
  }
  if (target === "order") {
    setActiveTab("order");
    if (orderId) activeHistoryOrderId = orderId;
    renderOrderHistory();
    requestAnimationFrame(() => document.querySelector(".order-history-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }
}

function buildGlobalSearchResults(query) {
  if (!currentUser) return [];
  const cleanQuery = normalize(query.trim());
  if (cleanQuery.length < 2) return [];
  const results = [];

  visibleClients
    .filter((client) => normalize([
      client.code,
      client.name,
      client.billingCity,
      client.billingZip,
      client.deliveryCity,
      client.deliveryZip,
      client.deliveryAddress,
      client.sector,
    ].join(" ")).includes(cleanQuery))
    .slice(0, 8)
    .forEach((client) => {
      results.push({
        type: "client",
        title: client.name,
        meta: `${client.code} - ${client.deliveryZip || client.billingZip || ""} ${client.deliveryCity || client.billingCity || ""}`,
        action: () => {
          setActiveTab("client360");
          selectClient360(client);
        },
      });
    });

  getVisibleStoredOrders()
    .filter((order) => normalize([
      order.orderNumber,
      order.client?.name,
      order.client?.code,
      order.note,
      ...(order.lines || []).flatMap((line) => [line.ref, line.name]),
    ].join(" ")).includes(cleanQuery))
    .slice(0, 5)
    .forEach((order) => {
      results.push({
        type: "commande",
        title: order.orderNumber,
        meta: `${order.client?.name || "Client"} - ${formatStoredDate(order.dayKey || order.orderDate || todayInputDate())}`,
        action: () => {
          setActiveTab("order");
          activeHistoryOrderId = order.id;
          renderOrderHistory();
          requestAnimationFrame(() => document.querySelector(".order-history-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }));
        },
      });
    });

  getVisibleVisitNotes()
    .filter((note) => normalize([note.clientName, note.clientCode, note.text, note.reminderText].join(" ")).includes(cleanQuery))
    .slice(0, 5)
    .forEach((note) => {
      results.push({
        type: "note",
        title: note.clientName,
        meta: `${formatNoteDate(note.date)} - ${(note.text || "").slice(0, 90)}`,
        action: () => {
          const client = findVisibleClientByCode(note.clientCode);
          setActiveTab("notes");
          if (client) selectNotesClient(client);
        },
      });
    });

  products
    .filter((product) => normalize([product.ref, product.gencod, product.name].join(" ")).includes(cleanQuery))
    .slice(0, 5)
    .forEach((product) => {
      results.push({
        type: "reference",
        title: product.ref,
        meta: `${product.name || ""}${product.price ? ` - ${formatter.format(product.price)}` : ""}`,
        action: () => {
          setActiveTab("order");
          productRefs.value = product.ref;
          clientSearch.focus();
        },
      });
    });

  getVisiblePrenetClients()
    .filter((client) => normalize([
      client.code,
      client.name,
      ...(client.entries || []).flatMap((entry) => [entry.ref, entry.designation]),
    ].join(" ")).includes(cleanQuery))
    .slice(0, 4)
    .forEach((client) => {
      results.push({
        type: "prix net",
        title: client.name || client.code,
        meta: `${client.code || ""} - ${(client.entries || []).length} reference(s)`,
        action: () => {
          setActiveTab("prenet");
          selectPrenetClient(client);
        },
      });
    });

  Object.entries(tariffConfig.documents || {})
    .filter(([, doc]) => normalize([doc.name, doc.id].join(" ")).includes(cleanQuery))
    .slice(0, 4)
    .forEach(([id, doc]) => {
      results.push({
        type: "document",
        title: doc.name,
        meta: "Tarifs & Documents",
        action: () => {
          setActiveTab("tarif");
          openTarifForm(id);
        },
      });
    });

  return results.slice(0, 18);
}

function renderGlobalSearchResults() {
  if (!globalSearchInput || !globalSearchResults) return;
  const results = buildGlobalSearchResults(globalSearchInput.value);
  if (!results.length) {
    globalSearchResults.classList.toggle("is-hidden", globalSearchInput.value.trim().length < 2);
    globalSearchResults.innerHTML = globalSearchInput.value.trim().length >= 2
      ? `<div class="global-search-empty">Aucun resultat trouve.</div>`
      : "";
    return;
  }
  globalSearchResults.innerHTML = results.map((item, index) => `
    <button type="button" data-global-result="${index}">
      <span>${escapeHtml(item.type)}</span>
      <strong>${escapeHtml(item.title || "-")}</strong>
      <small>${escapeHtml(item.meta || "")}</small>
    </button>
  `).join("");
  globalSearchResults._results = results;
  globalSearchResults.classList.remove("is-hidden");
}

function openGlobalSearchResult(index) {
  const item = globalSearchResults?._results?.[index];
  if (!item) return;
  item.action();
  globalSearchInput.value = "";
  globalSearchResults.classList.add("is-hidden");
  globalSearchResults.innerHTML = "";
  recordActivity("Recherche globale", `${item.type} - ${item.title}`);
}

function populateProductRefs() {
  productRefs.innerHTML = "";
  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.ref;
    option.label = `${product.ref} - ${product.name} - ${product.gencod}`;
    productRefs.appendChild(option);
  });
}

function renderClientSuggestions(query) {
  const cleanQuery = normalize(query.trim());
  clientSuggestions.innerHTML = "";

  if (!cleanQuery) {
    resetOrder();
    clientSuggestions.classList.remove("is-open");
    return;
  }

  const matches = visibleClients
    .filter((client) => {
      const searchable = [
        client.code,
        client.name,
        client.billingCity,
        client.billingZip,
        client.deliveryCity,
        client.deliveryZip,
        client.sector,
      ].join(" ");
      return normalize(searchable).includes(cleanQuery);
    })
    .slice(0, 10);

  if (!matches.length) {
    clientSuggestions.classList.remove("is-open");
    return;
  }

  matches.forEach((client) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion";
    button.innerHTML = `
      <strong>${escapeHtml(client.name)}</strong>
      <span>${escapeHtml(client.code)} - ${escapeHtml(client.billingZip)} ${escapeHtml(client.billingCity)} - ${escapeHtml(client.sector)}</span>
    `;
    button.addEventListener("click", () => selectClient(client));
    clientSuggestions.appendChild(button);
  });

  clientSuggestions.classList.add("is-open");
}

function getClientsForUser(user) {
  if (user?.role === "admin") {
    return allClients.filter(isAllowedTourClient);
  }
  const allowedSectors = new Set((user.sectors || [user.sector]).map(normalize));
  return allClients.filter((client) => allowedSectors.has(normalize(client.sector)));
}

function arrangeTabsForUser(user) {
  if (!appTabs) return;
  if (user?.role === "admin") {
    appTabs.insertBefore(adminTab, tourTab);
    return;
  }
  [
    homeTab,
    client360Tab,
    orderTab,
    quoteTab,
    expensesTab,
    notesTab,
    promotionTab,
    tarifTab,
    tourTab,
    prenetTab,
    backlogTab,
  ].forEach((tab) => appTabs.appendChild(tab));
  appTabs.appendChild(adminTab);
}

function normalizeBacklogType(value) {
  const clean = normalize(value || "");
  if (clean.includes("repris") || clean.includes("retour") || clean.includes("recuper")) return "reprise";
  return "reliquat";
}

function getBacklogSectorKey(value) {
  return normalize(value || "").replace(/^secteur\s*/, "").replace(/^0+/, "").toLowerCase();
}

function getBacklogClientMatch(item) {
  const itemClientCode = normalize(item.clientCode || item.codeClient || item.code || item.referenceClient || item.refClient || "");
  const itemClientName = normalize(item.clientName || item.client || item.nomClient || "");
  return visibleClients.find((client) => {
    if (itemClientCode && normalize(client.code) === itemClientCode) return true;
    return itemClientName && normalize(client.name) === itemClientName;
  });
}

function isBacklogItemForCurrentUser(item) {
  if (!currentUser) return false;
  if (currentUser.role === "admin") return true;
  const allowedSectors = new Set((currentUser.sectors || [currentUser.sector]).map(getBacklogSectorKey));
  const itemSector = getBacklogSectorKey(item.sector || item.secteur || "");
  if (itemSector && allowedSectors.has(itemSector)) return true;
  const client = getBacklogClientMatch(item);
  return client ? allowedSectors.has(getBacklogSectorKey(client.sector)) : false;
}

function normalizeBacklogItem(item) {
  const client = getBacklogClientMatch(item);
  const id = item.id || `${item.date || ""}-${item.orderNumber || item.numeroCommande || item.commande || ""}-${item.clientCode || item.client || ""}-${item.reference || item.ref || ""}-${item.product || item.produit || ""}-${item.quantity || item.quantite || ""}`;
  return {
    id,
    type: normalizeBacklogType(item.type || item.nature || item.statut || ""),
    date: item.date || item.createdAt || item.jour || "",
    orderNumber: item.orderNumber || item.numeroCommande || item.commande || item.order || "",
    sector: item.sector || item.secteur || client?.sector || "",
    clientCode: item.clientCode || item.codeClient || item.code || item.referenceClient || item.refClient || client?.code || "",
    clientName: item.clientName || item.client || item.nomClient || client?.name || "",
    product: item.product || item.produit || item.designation || item.article || "",
    reference: item.reference || item.ref || item.codeArticle || "",
    quantity: item.quantity || item.quantite || item.qty || "",
    detail: item.detail || item.commentaire || item.note || item.motif || "",
  };
}

function backlogUserKey(baseKey) {
  return `${baseKey}:${currentUser?.id || "default"}`;
}

function readBacklogState(baseKey) {
  try {
    return JSON.parse(localStorage.getItem(backlogUserKey(baseKey)) || "{}");
  } catch (error) {
    localStorage.removeItem(backlogUserKey(baseKey));
    return {};
  }
}

function writeBacklogState(baseKey, state) {
  localStorage.setItem(backlogUserKey(baseKey), JSON.stringify(state || {}));
}

function isBacklogDone(id) {
  return Boolean(readBacklogState(backlogDoneStorageKey)[id]);
}

function isBacklogHidden(id) {
  return Boolean(readBacklogState(backlogHiddenStorageKey)[id]);
}

function setBacklogDone(id, done) {
  const state = readBacklogState(backlogDoneStorageKey);
  if (done) state[id] = true;
  else delete state[id];
  writeBacklogState(backlogDoneStorageKey, state);
}

function hideBacklogItem(id) {
  const hidden = readBacklogState(backlogHiddenStorageKey);
  hidden[id] = true;
  writeBacklogState(backlogHiddenStorageKey, hidden);
  const done = readBacklogState(backlogDoneStorageKey);
  delete done[id];
  writeBacklogState(backlogDoneStorageKey, done);
}

function getFilteredBacklogItems() {
  const query = normalize(backlogSearch?.value || "");
  const typeFilter = backlogTypeFilter?.value || "all";
  return backlogItemsCache
    .map(normalizeBacklogItem)
    .filter(isBacklogItemForCurrentUser)
    .filter((item) => !isBacklogHidden(item.id))
    .filter((item) => typeFilter === "all" || item.type === typeFilter)
    .filter((item) => {
      if (!query) return true;
      return normalize([
        item.date,
        item.type,
        item.orderNumber,
        item.sector,
        item.clientCode,
        item.clientName,
        item.reference,
        item.product,
        item.quantity,
        item.detail,
      ].join(" ")).includes(query);
    })
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""), "fr", { numeric: true }));
}

function renderBacklog() {
  if (!backlogBody) return;
  const sectorItems = backlogItemsCache.map(normalizeBacklogItem).filter(isBacklogItemForCurrentUser).filter((item) => !isBacklogHidden(item.id));
  const filteredItems = getFilteredBacklogItems();
  const reliquatCount = sectorItems.filter((item) => item.type === "reliquat").length;
  const repriseCount = sectorItems.filter((item) => item.type === "reprise").length;
  backlogRemainderCount.textContent = String(reliquatCount);
  backlogReturnCount.textContent = String(repriseCount);
  backlogTotalCount.textContent = String(filteredItems.length);

  if (!backlogItemsCache.length) {
    backlogBody.innerHTML = `<tr><td colspan="9" class="backlog-empty">Aucune donnée chargée pour le moment. Clique sur Actualiser pour lire le fichier Drive.</td></tr>`;
    return;
  }

  backlogBody.innerHTML = filteredItems.length
    ? filteredItems.map((item) => `
      <tr>
        <td><strong>${escapeHtml(item.date || "-")}</strong><small>${escapeHtml(item.sector || "")}</small></td>
        <td><span class="backlog-badge ${item.type === "reprise" ? "is-return" : "is-remainder"}">${item.type === "reprise" ? "Reprise" : "Reliquat"}</span></td>
        <td><strong>${escapeHtml(item.orderNumber || "-")}</strong></td>
        <td><strong>${escapeHtml(item.clientName || "-")}</strong><small>${escapeHtml(item.clientCode || "")}</small></td>
        <td><strong>${escapeHtml(item.product || "-")}</strong><small>${escapeHtml(item.reference || "")}</small></td>
        <td><strong>${escapeHtml(item.quantity || "-")}</strong></td>
        <td>${escapeHtml(item.detail || "-")}</td>
        <td class="backlog-done-cell">
          <label class="backlog-done-check">
            <input type="checkbox" data-backlog-done="${escapeHtml(item.id)}" ${isBacklogDone(item.id) ? "checked" : ""} />
            <span>Fait</span>
          </label>
        </td>
        <td class="backlog-action-cell"><button class="icon-button backlog-delete-button" type="button" data-backlog-hide="${escapeHtml(item.id)}" aria-label="Masquer cette ligne">&times;</button></td>
      </tr>
    `).join("")
    : `<tr><td colspan="9" class="backlog-empty">Aucun reliquat ou reprise trouvé avec ce filtre.</td></tr>`;
}

async function loadBacklogItems(silent = false) {
  if (!backlogStatus || !refreshBacklog) return;
  if (!silent) {
    backlogStatus.textContent = "Actualisation…";
    refreshBacklog.disabled = true;
  }
  try {
    const result = await postService({ action: "getReliquatsReprises", token: currentSessionToken });
    backlogItemsCache = Array.isArray(result.items) ? result.items : [];
    const updatedAt = result.updatedAt || window.RELIQUATS_DATA?.updatedAt || "Drive";
    backlogStatus.textContent = `À jour · ${updatedAt}`;
  } catch (error) {
    if (!silent) backlogStatus.textContent = backlogItemsCache.length ? "Données locales" : "Drive à connecter";
  } finally {
    if (!silent) refreshBacklog.disabled = false;
    renderBacklog();
  }
}

function stopDriveAutoRefresh() {
  if (driveAutoRefreshTimer) {
    clearInterval(driveAutoRefreshTimer);
    driveAutoRefreshTimer = null;
  }
}

function startDriveAutoRefresh() {
  stopDriveAutoRefresh();
  if (!currentSessionToken || currentUser?.role === "admin") return;
  driveAutoRefreshTimer = setInterval(() => {
    if (document.hidden || !currentSessionToken || currentUser?.role === "admin") return;
    loadDashboardStatsFromDrive();
    loadBacklogItems(true);
    loadClientArticleStatsFromDrive();
  }, driveAutoRefreshMs);
}

function closePasswordReset() {
  passwordResetCard.classList.add("is-hidden");
  loginForm.classList.remove("is-hidden");
  passwordResetRequestForm.reset();
  passwordResetConfirmForm.reset();
  passwordResetRequestForm.classList.remove("is-hidden");
  passwordResetConfirmForm.classList.add("is-hidden");
  passwordResetStatus.textContent = "";
  passwordResetStatus.className = "reset-status";
  requestAnimationFrame(() => loginId.focus());
}

function openPasswordReset() {
  loginForm.classList.add("is-hidden");
  passwordResetCard.classList.remove("is-hidden");
  passwordResetStatus.textContent = "";
  passwordResetStatus.className = "reset-status";
  if (loginId.value.includes("@")) passwordResetEmail.value = loginId.value.trim();
  requestAnimationFrame(() => passwordResetEmail.focus());
}

function showLogin() {
  stopDriveAutoRefresh();
  currentUser = null;
  currentSessionToken = "";
  visibleClients = [];
  activeHistoryOrderId = null;
  sessionStorage.removeItem(sessionStorageKey);
  localStorage.removeItem(rememberedSessionKey);
  loginView.classList.remove("is-hidden");
  appView.classList.add("is-hidden");
  loginId.value = "";
  loginPassword.value = "";
  rememberLogin.checked = false;
  loginError.textContent = "";
  loginError.className = "login-error";
  closePasswordReset();
  resetOrder();
  renderPrenetEmpty();
  renderNotesEmpty();
  resetTarifForm();
  clearSecureAppData();
  requestAnimationFrame(() => loginId.focus());
}

function showApp(user, token = user.token || "") {
  const sectors = Array.isArray(user.sectors) && user.sectors.length ? user.sectors : [user.sector].filter(Boolean);
  currentSessionToken = token;
  currentUser = { ...user, sectors, sector: sectors[0] || "Secteur", token };
  activeDashboardSector = currentUser.sectors[0] || null;
  visibleClients = getClientsForUser(currentUser);
  const remembered = Boolean(user.remember || rememberLogin.checked);
  const storedUser = { ...currentUser, remember: remembered };
  sessionStorage.setItem(sessionStorageKey, JSON.stringify(storedUser));
  if (remembered) {
    localStorage.setItem(rememberedSessionKey, JSON.stringify(storedUser));
  } else {
    localStorage.removeItem(rememberedSessionKey);
  }
  sessionLabel.textContent = currentUser.role === "admin" ? "Schuller France - Administration" : `${currentUser.name} - ${currentUser.sectors.join(" + ")}`;
  loginView.classList.add("is-hidden");
  appView.classList.remove("is-hidden");

  const isAdmin = currentUser.role === "admin";
  arrangeTabsForUser(currentUser);
  [homeTab, orderTab, quoteTab, expensesTab, notesTab, prenetTab, tarifTab, promotionTab].forEach((tab) => tab.classList.toggle("is-hidden", isAdmin));
  tourTab.classList.remove("is-hidden");
  adminTab.classList.toggle("is-hidden", !isAdmin);
  if (isAdmin) {
    selectedTourCodes = new Set();
    renderTourPlanner();
    setActiveTab("admin");
    return;
  }

  resetOrder();
  renderDashboardSectorSwitch(currentUser);
  renderDashboard(currentUser);
  loadDashboardStatsFromDrive();
  startDriveAutoRefresh();
  renderHomeReminders();
  resetQuoteRequest();
  renderQuoteLines();
  renderQuoteHistory();
  resetExpenses();
  renderPrenetEmpty();
  renderNotesEmpty();
  selectedTourCodes = new Set();
  renderTourPlanner();
  setActiveTab("home");
  renderOrderHistory();
}

async function submitLogin() {
  loginError.textContent = "";
  loginError.className = "login-error";
  loginSubmitButton.disabled = true;
  loginSubmitButton.textContent = "Connexion…";
  try {
    const result = await postService({
      action: "login",
      identifier: loginId.value.trim(),
      password: loginPassword.value,
      remember: rememberLogin.checked ? "1" : "",
    });
    const cached = restoreSecureDataCache(result.user?.id || "");
    if (!cached) {
      loginSubmitButton.textContent = "Chargement des données…";
      await loadSecureAppData(result.token, result.user?.id || "");
    }
    showApp({ ...result.user, remember: rememberLogin.checked }, result.token);
    if (cached) refreshSecureAppDataInBackground(result.token, result.user?.id || "");
  } catch (error) {
    loginError.textContent = error.message || "Connexion impossible.";
    loginPassword.select();
  } finally {
    loginSubmitButton.disabled = false;
    loginSubmitButton.textContent = "Se connecter";
  }
}

async function requestPasswordReset(event) {
  event.preventDefault();
  passwordResetStatus.textContent = "";
  passwordResetStatus.className = "reset-status";
  requestResetButton.disabled = true;
  requestResetButton.textContent = "Envoi en cours…";
  try {
    const result = await postService({ action: "requestReset", email: passwordResetEmail.value.trim() });
    passwordResetStatus.textContent = result.message;
    passwordResetStatus.classList.add("is-success");
    passwordResetRequestForm.classList.add("is-hidden");
    passwordResetConfirmForm.classList.remove("is-hidden");
    requestAnimationFrame(() => passwordResetCode.focus());
  } catch (error) {
    passwordResetStatus.textContent = error.message || "La demande n’a pas pu être envoyée.";
    passwordResetStatus.classList.add("is-error");
  } finally {
    requestResetButton.disabled = false;
    requestResetButton.textContent = "Recevoir mon code";
  }
}

async function confirmPasswordReset(event) {
  event.preventDefault();
  passwordResetStatus.textContent = "";
  passwordResetStatus.className = "reset-status";
  if (newPassword.value !== confirmNewPassword.value) {
    passwordResetStatus.textContent = "Les deux mots de passe ne correspondent pas.";
    passwordResetStatus.classList.add("is-error");
    confirmNewPassword.focus();
    return;
  }

  confirmResetButton.disabled = true;
  confirmResetButton.textContent = "Modification…";
  try {
    const result = await postService({
      action: "confirmReset",
      email: passwordResetEmail.value.trim(),
      code: passwordResetCode.value.trim(),
      newPassword: newPassword.value,
    });
    loginId.value = result.identifier || passwordResetEmail.value.trim();
    closePasswordReset();
    loginError.textContent = "Mot de passe modifié. Vous pouvez vous connecter.";
    loginError.classList.add("is-success");
    loginPassword.focus();
  } catch (error) {
    passwordResetStatus.textContent = error.message || "Le mot de passe n’a pas pu être modifié.";
    passwordResetStatus.classList.add("is-error");
  } finally {
    confirmResetButton.disabled = false;
    confirmResetButton.textContent = "Modifier mon mot de passe";
  }
}

async function restoreSession() {
  try {
    const savedUser = JSON.parse(localStorage.getItem(rememberedSessionKey) || sessionStorage.getItem(sessionStorageKey) || "null");
    if (savedUser?.id) {
      rememberLogin.checked = Boolean(savedUser.remember);
      loginError.textContent = "Reconnexion sécurisée...";
      loginError.className = "login-error";
      const cached = restoreSecureDataCache(savedUser.id);
      if (!cached) await loadSecureAppData(savedUser.token || "", savedUser.id);
      showApp(savedUser, savedUser.token || "");
      if (cached) refreshSecureAppDataInBackground(savedUser.token || "", savedUser.id);
      return;
    }
  } catch (error) {
    sessionStorage.removeItem(sessionStorageKey);
    localStorage.removeItem(rememberedSessionKey);
    clearSecureAppData();
  }

  loginView.classList.remove("is-hidden");
  appView.classList.add("is-hidden");
  requestAnimationFrame(() => loginId.focus());
}

function selectClient(client) {
  selectedClient = client;
  clientSearch.value = client.name;
  clientSuggestions.classList.remove("is-open");
  recordActivity("Client sélectionné", `${client.name} (${client.code}) - ${client.sector}`);
  clientStatus.textContent = "Client selectionne";
  clientStatus.classList.add("is-ready");
  selectedClientBox.innerHTML = `
    <strong>${escapeHtml(client.name)}</strong>
    <span>${escapeHtml(client.code)}</span>
    <span>Facturation : ${escapeHtml(client.billingAddress)}</span>
    <span>${escapeHtml(client.billingZip)} ${escapeHtml(client.billingCity)}</span>
    <span>Livraison : ${escapeHtml(client.deliveryAddress)}</span>
    <span>${escapeHtml(client.deliveryZip)} ${escapeHtml(client.deliveryCity)}</span>
    <span>${escapeHtml(client.sector)}</span>
    <span>${escapeHtml(client.phone)} - ${escapeHtml(client.email)}</span>
  `;
  updateSummary();
}

function clearSelectedClient() {
  if (!selectedClient && !clientSearch.value) return;
  selectedClient = null;
  clientStatus.textContent = "Client non selectionne";
  clientStatus.classList.remove("is-ready");
  selectedClientBox.innerHTML = "<span>Aucun client choisi pour le moment.</span>";
  updateSummary();
}

function renderQuoteClientSuggestions(query) {
  const cleanQuery = normalize(query.trim());
  quoteClientSuggestions.innerHTML = "";

  if (!cleanQuery) {
    resetQuoteRequest();
    quoteClientSuggestions.classList.remove("is-open");
    return;
  }

  const matches = visibleClients
    .filter((client) => normalize([
      client.code,
      client.name,
      client.billingCity,
      client.billingZip,
      client.deliveryCity,
      client.deliveryZip,
      client.sector,
    ].join(" ")).includes(cleanQuery))
    .slice(0, 10);

  if (!matches.length) {
    quoteClientSuggestions.classList.remove("is-open");
    return;
  }

  matches.forEach((client) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion";
    button.innerHTML = `
      <strong>${escapeHtml(client.name)}</strong>
      <span>${escapeHtml(client.code)} - ${escapeHtml(client.billingZip)} ${escapeHtml(client.billingCity)} - ${escapeHtml(client.sector)}</span>
    `;
    button.addEventListener("click", () => selectQuoteClient(client));
    quoteClientSuggestions.appendChild(button);
  });

  quoteClientSuggestions.classList.add("is-open");
}

function selectQuoteClient(client) {
  selectedQuoteClient = client;
  quoteClientSearch.value = client.name;
  quoteClientSuggestions.classList.remove("is-open");
  quoteStatus.textContent = "Client sélectionné";
  quoteStatus.classList.add("is-ready");
  quoteSelectedClient.innerHTML = `
    <strong>${escapeHtml(client.name)}</strong>
    <span>${escapeHtml(client.code)}</span>
    <span>${escapeHtml(client.billingAddress || client.deliveryAddress || "")}</span>
    <span>${escapeHtml(client.billingZip || client.deliveryZip || "")} ${escapeHtml(client.billingCity || client.deliveryCity || "")}</span>
    <span>${escapeHtml(client.sector)}</span>
  `;
  quoteSendStatus.textContent = "";
  recordActivity("Client devis sélectionné", `${client.name} (${client.code}) - ${client.sector}`);
}

function resetQuoteRequest() {
  selectedQuoteClient = null;
  quoteStatus.textContent = "Client non sélectionné";
  quoteStatus.classList.remove("is-ready");
  quoteSelectedClient.innerHTML = "<span>Aucun client choisi pour le moment.</span>";
  quoteSendStatus.textContent = "";
  quoteSendStatus.className = "tarif-send-status";
}

function addQuoteLineItem() {
  quoteLineItems.push({ id: crypto.randomUUID(), ref: "", qty: 1, comment: "" });
  renderQuoteLines();
}

function isQuoteLineEmpty(line) {
  return !String(line?.ref || "").trim() && !String(line?.comment || "").trim();
}

function ensureQuoteTrailingBlankLine() {
  if (!quoteLineItems.length) {
    quoteLineItems.push({ id: crypto.randomUUID(), ref: "", qty: 1, comment: "" });
    return;
  }
  while (quoteLineItems.length > 1 && isQuoteLineEmpty(quoteLineItems[quoteLineItems.length - 1]) && isQuoteLineEmpty(quoteLineItems[quoteLineItems.length - 2])) {
    quoteLineItems.pop();
  }
  const lastLine = quoteLineItems[quoteLineItems.length - 1];
  if (String(lastLine.ref || "").trim()) {
    quoteLineItems.push({ id: crypto.randomUUID(), ref: "", qty: 1, comment: "" });
  }
}

function removeQuoteLineItem(id) {
  quoteLineItems = quoteLineItems.filter((line) => line.id !== id);
  if (!quoteLineItems.length) addQuoteLineItem();
  else renderQuoteLines();
}

function updateQuoteLine(id, field, value) {
  const line = quoteLineItems.find((item) => item.id === id);
  if (!line) return;
  line[field] = value;
}

function applyQuoteReference(id, value) {
  const line = quoteLineItems.find((item) => item.id === id);
  if (!line) return;
  const product = findProduct(value);
  line.ref = product ? product.ref : value;
  if (product) {
    line.qty = defaultQuantityForProduct(product);
    recordActivity("Référence devis consultée", `${product.ref} - ${product.name} - UDV ${product.udv || 1}`);
  }
  renderQuoteLines();
}

function renderQuoteLines() {
  ensureQuoteTrailingBlankLine();
  quoteLines.innerHTML = quoteLineItems.map((line, index) => `
    <tr data-quote-line="${escapeHtml(line.id)}">
      ${(() => {
        const product = findProduct(line.ref);
        return `
          <td class="quote-ref-cell"><input type="text" value="${escapeHtml(line.ref)}" list="productRefs" placeholder="Référence ${index + 1}" data-quote-field="ref" /></td>
          <td class="quote-name-cell ${product ? "" : "empty-product"}">${product ? escapeHtml(product.name) : "Saisir une référence"}</td>
          <td class="quote-udv-cell">${product ? escapeHtml(product.udv || "-") : "-"}</td>
        `;
      })()}
      <td class="quote-qty-cell"><input type="text" inputmode="numeric" pattern="[0-9]*" value="${escapeHtml(line.qty)}" data-quote-field="qty" aria-label="Quantité" /></td>
      <td><input type="text" value="${escapeHtml(line.comment || "")}" placeholder="Option, couleur, précision..." data-quote-field="comment" /></td>
      <td><button class="icon-button" type="button" data-remove-quote-line="${escapeHtml(line.id)}" aria-label="Supprimer la ligne">&times;</button></td>
    </tr>
  `).join("");
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function newExpenseLine() {
  return {
    id: crypto.randomUUID(),
    date: todayIsoDate(),
    type: "REPAS MIDI",
    precision: "",
    amount: "",
    vat: "",
    receiptName: "",
    receiptDataUrl: "",
    receiptMimeType: "",
    receiptFile: null,
  };
}

function expenseDraftKey() {
  return `${expenseDraftStorageKey}:${currentUser?.id || "default"}`;
}

function getExpenseDrafts() {
  try {
    const drafts = JSON.parse(localStorage.getItem(expenseDraftKey()) || "[]");
    return Array.isArray(drafts) ? drafts : [];
  } catch (error) {
    localStorage.removeItem(expenseDraftKey());
    return [];
  }
}

function saveExpenseDrafts(drafts) {
  localStorage.setItem(expenseDraftKey(), JSON.stringify(Array.isArray(drafts) ? drafts : []));
}

function getExpenseDraftTitle() {
  const period = expensesPeriod?.value.trim();
  if (period) return period;
  const date = new Date();
  return `Frais du ${date.toLocaleDateString("fr-FR")}`;
}

function getExpenseDraftTotals(linesToUse = expenseLineItems) {
  const refunds = getExpenseRefunds(linesToUse);
  return linesToUse.reduce((acc, line, index) => {
    acc.amount += parseAmount(line.amount);
    acc.vat += getExpenseVatForTotals(line);
    acc.refund += refunds[index] || 0;
    return acc;
  }, { amount: 0, vat: 0, refund: 0 });
}

function serializeExpenseLine(line) {
  return {
    id: line.id || crypto.randomUUID(),
    date: line.date || todayIsoDate(),
    type: line.type || "REPAS MIDI",
    precision: line.precision || "",
    amount: line.amount || "",
    vat: line.vat || "",
    receiptName: line.receiptName || "",
    receiptDataUrl: line.receiptDataUrl || "",
    receiptMimeType: line.receiptMimeType || "",
  };
}

function normalizeExpenseLine(line) {
  return {
    ...newExpenseLine(),
    ...serializeExpenseLine(line || {}),
    receiptFile: null,
  };
}

function parseAmount(value) {
  if (value === null || value === undefined || value === "") return 0;
  const normalizedValue = String(value).replace(/\s/g, "").replace(",", ".");
  const number = Number(normalizedValue);
  return Number.isFinite(number) ? number : 0;
}

function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function getExpenseRefunds(linesToCompute = expenseLineItems) {
  const dinnerByDate = new Map();
  const hasHotelByDate = new Map();
  linesToCompute.forEach((line) => {
    const amount = parseAmount(line.amount);
    if (!line.date || !amount) return;
    if (line.type === "REPAS SOIR") dinnerByDate.set(line.date, roundMoney((dinnerByDate.get(line.date) || 0) + amount));
    if (line.type === "HOTEL") hasHotelByDate.set(line.date, true);
  });
  return linesToCompute.map((line) => {
    const amount = parseAmount(line.amount);
    if (!amount) return 0;
    if (line.type === "REPAS MIDI") return roundMoney(Math.min(amount, expenseLunchLimit));
    if (line.type === "REPAS SOIR") return roundMoney(hasHotelByDate.get(line.date) ? amount : Math.min(amount, expenseDinnerLimit));
    if (line.type === "HOTEL") {
      const dinnerAmount = dinnerByDate.get(line.date) || 0;
      return roundMoney(Math.min(amount, Math.max(0, expenseHotelDinnerLimit - dinnerAmount)));
    }
    return roundMoney(amount);
  });
}

function getExpenseVatForTotals(line) {
  const amount = parseAmount(line.amount);
  const vat = parseAmount(line.vat);
  if (line.type === "REPAS MIDI" && amount >= expenseLunchLimit) return 2;
  return vat;
}

function renderExpenses() {
  if (!expensesLines) return;
  const refunds = getExpenseRefunds();
  expensesLines.innerHTML = expenseLineItems.map((line, index) => {
    const refunded = refunds[index] || 0;
    const amount = parseAmount(line.amount);
    const warning = amount && refunded < amount ? `<small class="expense-warning">Plafond appliqué : ${escapeHtml(formatter.format(refunded))}</small>` : "";
    return `
      <tr data-expense-line="${escapeHtml(line.id)}">
        <td><input type="date" value="${escapeHtml(line.date)}" data-expense-field="date" /></td>
        <td><select data-expense-field="type">${expenseTypes.map((type) => `<option value="${escapeHtml(type)}" ${line.type === type ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}</select></td>
        <td><input type="text" value="${escapeHtml(line.precision)}" placeholder="Client, hôtel, détail..." data-expense-field="precision" /></td>
        <td><input type="text" inputmode="decimal" value="${escapeHtml(line.amount)}" placeholder="0,00" data-expense-field="amount" /></td>
        <td><input type="text" inputmode="decimal" value="${escapeHtml(line.vat)}" placeholder="0,00" data-expense-field="vat" /></td>
        <td><strong>${escapeHtml(formatter.format(refunded))}</strong>${warning}</td>
        <td>
          <label class="expense-upload">
            <input type="file" accept="image/*,.pdf" capture="environment" data-expense-field="receipt" />
            <span>${line.receiptName ? escapeHtml(line.receiptName) : "Ajouter photo"}</span>
          </label>
        </td>
        <td><button class="icon-button" type="button" data-remove-expense-line="${escapeHtml(line.id)}" aria-label="Supprimer la ligne">&times;</button></td>
      </tr>`;
  }).join("");
  updateExpenseSummary();
  renderExpenseHistory();
}

function updateExpenseSummary() {
  if (!expensesTotalAmount || !expensesTotalVat || !expensesTotalRefund || !expensesStatus) return;
  const totals = getExpenseDraftTotals();
  expensesTotalAmount.textContent = formatter.format(roundMoney(totals.amount));
  expensesTotalVat.textContent = formatter.format(roundMoney(totals.vat));
  expensesTotalRefund.textContent = formatter.format(roundMoney(totals.refund));
  const filledCount = expenseLineItems.filter((line) => parseAmount(line.amount) > 0).length;
  const draftLabel = activeExpenseDraftId ? " · brouillon ouvert" : "";
  expensesStatus.textContent = `${filledCount} ligne${filledCount > 1 ? "s" : ""}${draftLabel}`;
}

function resetExpenses() {
  activeExpenseDraftId = null;
  expenseLineItems = [newExpenseLine()];
  if (expensesPeriod) expensesPeriod.value = "";
  if (expensesNote) expensesNote.value = "";
  if (expensesSendStatus) {
    expensesSendStatus.textContent = "";
    expensesSendStatus.className = "tarif-send-status";
  }
  renderExpenses();
}

function renderExpenseHistory() {
  if (!expenseHistoryList) return;
  const query = normalize(expenseHistorySearch?.value || "");
  const drafts = getExpenseDrafts()
    .filter((draft) => !query || normalize(`${draft.title} ${draft.note} ${draft.updatedLabel}`).includes(query))
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
  if (!drafts.length) {
    expenseHistoryList.innerHTML = `<p class="empty-state">Aucune note de frais enregistrée pour le moment.</p>`;
    return;
  }
  expenseHistoryList.innerHTML = drafts.map((draft) => {
    const totals = draft.totals || getExpenseDraftTotals((draft.lines || []).map(normalizeExpenseLine));
    const receiptCount = (draft.lines || []).filter((line) => line.receiptName).length;
    const active = draft.id === activeExpenseDraftId ? " is-active" : "";
    return `
      <article class="expense-history-item${active}" data-expense-draft="${escapeHtml(draft.id)}">
        <button class="expense-history-open" type="button" data-open-expense-draft="${escapeHtml(draft.id)}">
          <strong>${escapeHtml(draft.title || "Note de frais")}</strong>
          <span>${escapeHtml(draft.updatedLabel || "Non datée")} · ${(draft.lines || []).length} ligne(s) · ${receiptCount} justificatif(s)</span>
          <em>${escapeHtml(formatter.format(roundMoney(totals.refund || 0)))} net à payer</em>
        </button>
        <div class="expense-history-actions">
          <button type="button" data-rename-expense-draft="${escapeHtml(draft.id)}">Renommer</button>
          <button type="button" data-delete-expense-draft="${escapeHtml(draft.id)}" aria-label="Supprimer la note">&times;</button>
        </div>
      </article>
    `;
  }).join("");
}

function updateExpenseLine(id, field, value) {
  const line = expenseLineItems.find((item) => item.id === id);
  if (!line) return;
  line[field] = value;
  renderExpenses();
}

function setExpenseLineField(id, field, value) {
  const line = expenseLineItems.find((item) => item.id === id);
  if (!line) return;
  line[field] = value;
  updateExpenseSummary();
}

function addExpenseLineItem() {
  expenseLineItems.push(newExpenseLine());
  renderExpenses();
}

function removeExpenseLine(id) {
  expenseLineItems = expenseLineItems.filter((line) => line.id !== id);
  if (!expenseLineItems.length) expenseLineItems.push(newExpenseLine());
  renderExpenses();
}

async function hydrateExpenseLineForDraft(line) {
  const base = serializeExpenseLine(line);
  if (line.receiptFile) {
    const dataUrl = line.receiptFile.type.startsWith("image/") ? await resizeImageDataUrl(line.receiptFile, 1200, 0.72) : await fileToDataUrl(line.receiptFile);
    base.receiptDataUrl = dataUrl;
    base.receiptMimeType = line.receiptFile.type.includes("pdf") ? "application/pdf" : "image/jpeg";
    base.receiptName = line.receiptName || line.receiptFile.name || "justificatif";
  }
  return base;
}

async function saveCurrentExpenseDraft() {
  if (!currentUser || currentUser.role === "admin") return;
  if (expensesSendStatus) {
    expensesSendStatus.textContent = "Enregistrement de la note de frais…";
    expensesSendStatus.className = "tarif-send-status";
  }
  try {
    const linesToSave = [];
    for (const line of expenseLineItems) {
      linesToSave.push(await hydrateExpenseLineForDraft(line));
    }
    const now = new Date();
    const title = getExpenseDraftTitle();
    const draft = {
      id: activeExpenseDraftId || crypto.randomUUID(),
      title,
      period: expensesPeriod?.value.trim() || title,
      note: expensesNote?.value.trim() || "",
      lines: linesToSave,
      totals: getExpenseDraftTotals(linesToSave),
      createdAt: activeExpenseDraftId ? undefined : now.toISOString(),
      updatedAt: now.toISOString(),
      updatedLabel: now.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
    };
    const drafts = getExpenseDrafts();
    const existingIndex = drafts.findIndex((item) => item.id === draft.id);
    if (existingIndex >= 0) {
      draft.createdAt = drafts[existingIndex].createdAt || draft.updatedAt;
      drafts[existingIndex] = draft;
    } else {
      draft.createdAt = draft.updatedAt;
      drafts.unshift(draft);
    }
    saveExpenseDrafts(drafts.slice(0, 40));
    activeExpenseDraftId = draft.id;
    try {
      await postService({
        action: "saveExpenseDraftSummary",
        report: JSON.stringify({
          id: draft.id,
          title: draft.title,
          period: draft.period,
          note: draft.note,
          lines: draft.lines,
        }),
      });
    } catch (error) {
      // Le brouillon reste sauvegardé localement même si Google répond lentement.
    }
    if (expensesSendStatus) {
      expensesSendStatus.textContent = `Note de frais enregistrée : ${title}.`;
      expensesSendStatus.classList.add("is-success");
    }
    renderExpenses();
  } catch (error) {
    if (expensesSendStatus) {
      expensesSendStatus.textContent = "Impossible d'enregistrer les justificatifs. Essaie avec moins de photos ou envoie la note directement.";
      expensesSendStatus.classList.add("is-error");
    }
  }
}

function openExpenseDraft(id) {
  const draft = getExpenseDrafts().find((item) => item.id === id);
  if (!draft) return;
  activeExpenseDraftId = draft.id;
  expenseLineItems = (draft.lines || []).map(normalizeExpenseLine);
  if (!expenseLineItems.length) expenseLineItems = [newExpenseLine()];
  if (expensesPeriod) expensesPeriod.value = draft.period || draft.title || "";
  if (expensesNote) expensesNote.value = draft.note || "";
  if (expensesSendStatus) {
    expensesSendStatus.textContent = `Brouillon ouvert : ${draft.title || "note de frais"}.`;
    expensesSendStatus.className = "tarif-send-status is-success";
  }
  renderExpenses();
  expensesView?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renameExpenseDraft(id) {
  const drafts = getExpenseDrafts();
  const draft = drafts.find((item) => item.id === id);
  if (!draft) return;
  const title = window.prompt("Nouveau nom de la note de frais :", draft.title || "");
  if (!title || !title.trim()) return;
  draft.title = title.trim();
  draft.period = title.trim();
  draft.updatedAt = new Date().toISOString();
  draft.updatedLabel = new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
  saveExpenseDrafts(drafts);
  if (activeExpenseDraftId === id && expensesPeriod) expensesPeriod.value = draft.period;
  renderExpenseHistory();
}

function deleteExpenseDraft(id) {
  const draft = getExpenseDrafts().find((item) => item.id === id);
  if (!draft) return;
  if (!window.confirm(`Supprimer la note de frais "${draft.title || "sans nom"}" ?`)) return;
  saveExpenseDrafts(getExpenseDrafts().filter((item) => item.id !== id));
  if (activeExpenseDraftId === id) resetExpenses();
  else renderExpenseHistory();
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImageDataUrl(file, maxSize = 1600, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const ratio = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * ratio));
        canvas.height = Math.max(1, Math.round(image.height * ratio));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      image.onerror = reject;
      image.src = String(reader.result || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function prepareExpenseReceipt(line, index) {
  if (!line.receiptFile && !line.receiptDataUrl) return null;
  const file = line.receiptFile;
  const dataUrl = file ? (file.type.startsWith("image/") ? await resizeImageDataUrl(file) : await fileToDataUrl(file)) : line.receiptDataUrl;
  const mimeType = file ? (file.type.includes("pdf") ? "application/pdf" : "image/jpeg") : (line.receiptMimeType || "image/jpeg");
  const extension = mimeType.includes("pdf") ? "pdf" : "jpg";
  const safeDate = (line.date || "sans-date").replaceAll("/", "-");
  const safeType = normalize(line.type || "frais").replace(/[^a-z0-9]+/g, "-") || "frais";
  return {
    name: line.receiptName || `${String(index + 1).padStart(2, "0")}-${safeDate}-${safeType}.${extension}`,
    mimeType,
    dataUrl,
  };
}

async function sendExpenseReportDraft() {
  if (!currentUser || currentUser.role === "admin") return;
  const filledLines = expenseLineItems
    .map((line, index) => ({ ...line, index, amountNumber: parseAmount(line.amount), vatNumber: parseAmount(line.vat) }))
    .filter((line) => line.date || line.type || line.precision || line.amountNumber || line.vatNumber || line.receiptFile || line.receiptDataUrl);
  if (!filledLines.length || !filledLines.some((line) => line.amountNumber > 0)) {
    expensesSendStatus.textContent = "Ajoute au moins une ligne de frais avec un montant.";
    expensesSendStatus.classList.add("is-error");
    return;
  }
  sendExpenseReport.disabled = true;
  sendExpenseReport.textContent = "Envoi en cours…";
  expensesSendStatus.textContent = "Préparation du fichier Excel et des justificatifs…";
  expensesSendStatus.className = "tarif-send-status";
  try {
    const refunds = getExpenseRefunds(expenseLineItems);
    const receiptEntries = [];
    for (const line of filledLines) {
      const receipt = await prepareExpenseReceipt(line, line.index);
      if (receipt) receiptEntries.push({ lineId: line.id, ...receipt });
    }
    const payloadLines = filledLines.map((line) => ({
      date: line.date,
      type: line.type,
      precision: line.precision,
      amount: line.amountNumber,
      vat: getExpenseVatForTotals(line),
      refund: refunds[line.index] || 0,
      receiptName: receiptEntries.find((receipt) => receipt.lineId === line.id)?.name || "",
    }));
    const result = await postService({
      action: "sendExpenseReport",
      draftId: activeExpenseDraftId || "",
      period: expensesPeriod.value.trim(),
      note: expensesNote.value.trim(),
      lines: JSON.stringify(payloadLines),
      receipts: JSON.stringify(receiptEntries.map(({ lineId, ...receipt }) => receipt)),
    });
    const successMessage = result.message || "Frais envoyés.";
    recordActivity("Frais envoyés", `${payloadLines.length} ligne(s) - ${formatter.format(payloadLines.reduce((sum, line) => sum + (Number(line.refund) || 0), 0))}`);
    resetExpenses();
    expensesSendStatus.textContent = successMessage;
    expensesSendStatus.classList.add("is-success");
  } catch (error) {
    expensesSendStatus.textContent = error.message || "L'envoi des frais a échoué.";
    expensesSendStatus.classList.add("is-error");
  } finally {
    sendExpenseReport.disabled = false;
    sendExpenseReport.textContent = "Envoyer mes frais";
  }
}

function quoteHistoryKey() {
  return `${quoteHistoryStorageKey}:${currentUser?.id || "default"}`;
}

function getQuoteHistory() {
  try {
    return JSON.parse(localStorage.getItem(quoteHistoryKey()) || "[]");
  } catch (error) {
    localStorage.removeItem(quoteHistoryKey());
    return [];
  }
}

function saveQuoteHistory(items) {
  localStorage.setItem(quoteHistoryKey(), JSON.stringify(Array.isArray(items) ? items : []));
}

function quoteStatusLabel(status) {
  return {
    pending: "En attente",
    relaunched: "Relancé",
    accepted: "Validé",
    refused: "Refusé",
  }[status] || "En attente";
}

function quoteStatusClass(status) {
  return {
    pending: "is-pending",
    relaunched: "is-relaunched",
    accepted: "is-accepted",
    refused: "is-refused",
  }[status] || "is-pending";
}

function addQuoteHistoryItem(client, lines, note) {
  const items = getQuoteHistory();
  const now = new Date();
  const item = {
    id: crypto.randomUUID(),
    date: now.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
    timestamp: now.toISOString(),
    status: "pending",
    clientCode: client.code || "",
    clientName: client.name || "",
    sector: client.sector || "",
    note: note || "",
    lines: lines.map((line) => ({
      ref: line.ref,
      designation: line.designation || "",
      udv: line.udv || "",
      qty: line.qty,
      comment: line.comment || "",
    })),
  };
  items.unshift(item);
  saveQuoteHistory(items.slice(0, 200));
  renderQuoteHistory();
}

function updateQuoteHistoryStatus(id, status) {
  const items = getQuoteHistory();
  const item = items.find((entry) => entry.id === id);
  if (!item) return;
  item.status = status;
  item.statusUpdatedAt = new Date().toISOString();
  saveQuoteHistory(items);
  renderQuoteHistory();
  recordActivity("Statut devis modifié", `${item.clientName} - ${quoteStatusLabel(status)}`);
}

function deleteQuoteHistoryItem(id) {
  saveQuoteHistory(getQuoteHistory().filter((item) => item.id !== id));
  renderQuoteHistory();
}

function renderQuoteHistory() {
  if (!quoteHistoryList) return;
  const query = normalize(quoteHistorySearch?.value || "");
  const items = getQuoteHistory().filter((item) => {
    if (!query) return true;
    return normalize([
      item.date,
      item.status,
      quoteStatusLabel(item.status),
      item.clientName,
      item.clientCode,
      item.sector,
      item.note,
      ...(item.lines || []).flatMap((line) => [line.ref, line.designation, line.qty, line.comment]),
    ].join(" ")).includes(query);
  });

  quoteHistoryList.innerHTML = items.length
    ? items.map((item) => {
        const refs = (item.lines || []).map((line) => `${line.ref} x${line.qty}`).join(", ");
        return `
          <article class="quote-history-item">
            <div class="quote-history-main">
              <span class="quote-status-pill ${quoteStatusClass(item.status)}">${escapeHtml(quoteStatusLabel(item.status))}</span>
              <strong>${escapeHtml(item.clientName || "Client")}</strong>
              <small>${escapeHtml(item.date || "")} · ${escapeHtml(item.clientCode || "")} · ${escapeHtml(item.sector || "")}</small>
              <p>${escapeHtml(refs || "Aucune référence")}</p>
              ${item.note ? `<small class="quote-history-note">${escapeHtml(item.note)}</small>` : ""}
            </div>
            <div class="quote-history-actions">
              <button type="button" data-quote-status="${escapeHtml(item.id)}" data-status="pending">En attente</button>
              <button type="button" data-quote-status="${escapeHtml(item.id)}" data-status="relaunched">Relancé</button>
              <button type="button" data-quote-status="${escapeHtml(item.id)}" data-status="accepted">Validé</button>
              <button type="button" data-quote-status="${escapeHtml(item.id)}" data-status="refused">Refusé</button>
              <button class="quote-history-delete" type="button" data-quote-delete="${escapeHtml(item.id)}">×</button>
            </div>
          </article>
        `;
      }).join("")
    : '<div class="dashboard-empty">Aucune demande de devis enregistrée pour le moment.</div>';
}

async function sendQuoteRequestDraft() {
  quoteSendStatus.className = "tarif-send-status";
  const validLines = quoteLineItems
    .map((line) => {
      const ref = String(line.ref || "").trim();
      const product = findProduct(ref);
      return {
        ref,
        designation: product?.name || "",
        udv: product?.udv || "",
        qty: Math.max(1, Number(line.qty) || 1),
        comment: String(line.comment || "").trim(),
      };
    })
    .filter((line) => line.ref);

  if (!selectedQuoteClient) {
    quoteSendStatus.textContent = "Sélectionnez d’abord le client.";
    quoteSendStatus.classList.add("is-error");
    quoteClientSearch.focus();
    return;
  }

  if (!validLines.length) {
    quoteSendStatus.textContent = "Ajoutez au moins une référence à chiffrer.";
    quoteSendStatus.classList.add("is-error");
    quoteLines.querySelector("input")?.focus();
    return;
  }

  const refs = validLines.slice(0, 6).map((line) => `${line.ref} x${line.qty}`).join(", ");
  const more = validLines.length > 6 ? ` + ${validLines.length - 6} autre(s)` : "";
  if (!tariffConfig.endpoint) {
    quoteSendStatus.textContent = "L’envoi doit d’abord être autorisé côté Google.";
    quoteSendStatus.classList.add("is-warning");
    return;
  }

  sendQuoteRequest.disabled = true;
  sendQuoteRequest.textContent = "Envoi en cours…";
  quoteSendStatus.textContent = "";

  try {
    await postService({
      action: "sendQuoteRequest",
      client: JSON.stringify({
        code: selectedQuoteClient.code || "",
        name: selectedQuoteClient.name || "",
        sector: selectedQuoteClient.sector || "",
        address: selectedQuoteClient.billingAddress || selectedQuoteClient.deliveryAddress || "",
        zip: selectedQuoteClient.billingZip || selectedQuoteClient.deliveryZip || "",
        city: selectedQuoteClient.billingCity || selectedQuoteClient.deliveryCity || "",
      }),
      lines: JSON.stringify(validLines),
      note: quoteNote.value.trim(),
    });
    recordActivity("Demande de devis envoyée", `${selectedQuoteClient.name} - ${refs}${more} - envoyé à flogilet44@gmail.com`);
    addQuoteHistoryItem(selectedQuoteClient, validLines, quoteNote.value.trim());
    quoteSendStatus.textContent = "Demande envoyée à flogilet44@gmail.com avec le fichier Excel.";
    quoteSendStatus.classList.add("is-success");
  } catch (error) {
    quoteSendStatus.textContent = error.message || "L’envoi n’a pas pu être effectué. Réessayez dans quelques instants.";
    quoteSendStatus.classList.add("is-error");
  } finally {
    sendQuoteRequest.disabled = false;
    sendQuoteRequest.textContent = "Envoyer la demande de devis";
  }
}

function addLine() {
  const line = {
    id: crypto.randomUUID(),
    ref: "",
    qty: 1,
  };
  lines.push(line);
  renderLines();
  return line.id;
}

function findProduct(ref) {
  const query = normalize(ref.trim());
  return products.find((product) => normalize(product.ref) === query || normalize(product.gencod) === query);
}

function defaultQuantityForProduct(product) {
  return Math.max(Number(product?.udv) || 1, 1);
}

function setLineReference(id, ref) {
  lines = lines.map((line) => {
    if (line.id !== id) {
      return line;
    }

    const product = findProduct(ref);
    const referenceChanged = normalize(line.ref) !== normalize(ref);
    return {
      ...line,
      ref,
      qty: product && referenceChanged ? defaultQuantityForProduct(product) : line.qty,
    };
  });
  const product = findProduct(ref);
  if (product) recordActivity("Référence consultée", `${product.ref} - ${product.name} - ${formatter.format(product.price)}`);
  renderLines();
}

function updateLine(id, changes) {
  lines = lines.map((line) => (line.id === id ? { ...line, ...changes } : line));
  renderLines();
}

function removeLine(id) {
  lines = lines.filter((line) => line.id !== id);
  if (!lines.length) {
    addLine();
    return;
  }
  renderLines();
}

function focusLineRef(id) {
  requestAnimationFrame(() => {
    const row = [...orderLines.querySelectorAll("tr")].find((item) => item.dataset.lineId === id);
    const input = row?.querySelector(".ref-cell input");
    if (input) {
      input.focus();
      input.select();
    }
  });
}

function focusLineQty(id) {
  requestAnimationFrame(() => {
    const row = [...orderLines.querySelectorAll("tr")].find((item) => item.dataset.lineId === id);
    const input = row?.querySelector(".qty-cell input");
    if (input) {
      input.focus();
      input.select();
    }
  });
}

function getNextLineId(currentId) {
  const index = lines.findIndex((line) => line.id === currentId);
  const currentLine = lines[index];

  if (!currentLine || !findProduct(currentLine.ref) || Number(currentLine.qty) <= 0) {
    return null;
  }

  const nextLine = lines[index + 1];
  if (nextLine) {
    return nextLine.id;
  }

  const newLine = {
    id: crypto.randomUUID(),
    ref: "",
    qty: 1,
  };
  lines.push(newLine);
  return newLine.id;
}

function completeQuantity(id, qty) {
  lines = lines.map((line) => (line.id === id ? { ...line, qty } : line));
  const nextLineId = getNextLineId(id);
  renderLines();
  if (nextLineId) {
    focusLineRef(nextLineId);
  }
}

function renderLines() {
  orderLines.innerHTML = "";

  lines.forEach((line) => {
    const product = findProduct(line.ref);
    const quantity = Math.max(Number(line.qty) || 0, 0);
    const lineTotal = product ? product.price * quantity : 0;
    const row = document.createElement("tr");
    row.dataset.lineId = line.id;

    row.innerHTML = `
      <td class="ref-cell">
        <input value="${escapeHtml(line.ref)}" list="productRefs" inputmode="numeric" aria-label="Reference produit" />
      </td>
      <td class="gencod-cell">${product ? escapeHtml(product.gencod) : "-"}</td>
      <td class="name-cell ${product ? "" : "empty-product"}">${product ? escapeHtml(product.name) : "Saisir une reference"}</td>
      <td class="udv-cell">${product ? escapeHtml(product.udv || "-") : "-"}</td>
      <td class="qty-cell">
        <input value="${escapeHtml(line.qty)}" type="number" min="1" step="1" aria-label="Quantite" />
      </td>
      <td class="price-cell">${product ? formatter.format(product.price) : "-"}</td>
      <td class="line-total-cell">${product ? formatter.format(lineTotal) : "-"}</td>
      <td>
        <button class="remove-line" type="button" aria-label="Supprimer la ligne">x</button>
      </td>
    `;

    const refInput = row.querySelector("td:first-child input");
    const qtyInput = row.querySelector(".qty-cell input");
    const removeButton = row.querySelector(".remove-line");

    refInput.addEventListener("change", (event) => setLineReference(line.id, event.target.value.trim()));
    refInput.addEventListener("blur", (event) => setLineReference(line.id, event.target.value.trim()));
    refInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        setLineReference(line.id, event.target.value.trim());
        focusLineQty(line.id);
      }
    });
    qtyInput.addEventListener("change", (event) => {
      completeQuantity(line.id, Number(event.target.value) || 1);
    });
    qtyInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const qty = Number(event.target.value) || 1;
        completeQuantity(line.id, qty);
      }
    });
    qtyInput.addEventListener("blur", (event) => {
      const qty = Number(event.target.value) || 1;
      completeQuantity(line.id, qty);
    });
    removeButton.addEventListener("click", () => removeLine(line.id));

    orderLines.appendChild(row);
  });

  updateSummary();
}

function getValidLines() {
  return lines
    .map((line) => ({
      ...line,
      product: findProduct(line.ref),
      qty: Math.max(Number(line.qty) || 0, 0),
    }))
    .filter((line) => line.product && line.qty > 0);
}

function getTotal() {
  return getValidLines().reduce((sum, line) => sum + line.product.price * line.qty, 0);
}

function updateSummary() {
  const validLines = getValidLines();
  summaryClient.textContent = selectedClient ? selectedClient.name : "Non selectionne";
  summaryLines.textContent = validLines.length.toString();
  summaryTotal.textContent = formatter.format(getTotal());
}

function getStoredOrders() {
  try {
    return JSON.parse(localStorage.getItem("schullerOrders") || "[]");
  } catch {
    return [];
  }
}

function saveStoredOrders(orders) {
  localStorage.setItem("schullerOrders", JSON.stringify(orders));
}

function deleteStoredOrder(orderId) {
  saveStoredOrders(getStoredOrders().filter((order) => order.id !== orderId));
  if (activeHistoryOrderId === orderId) activeHistoryOrderId = null;
  renderOrderHistory();
}

function clearCurrentUserOrders() {
  if (!currentUser) return;
  const visibleOrders = getVisibleStoredOrders();
  if (!visibleOrders.length) return;
  if (!confirm(`Effacer ${visibleOrders.length} commande${visibleOrders.length > 1 ? "s" : ""} de votre historique ?`)) return;
  const visibleIds = new Set(visibleOrders.map((order) => order.id));
  saveStoredOrders(getStoredOrders().filter((order) => !visibleIds.has(order.id)));
  activeHistoryOrderId = null;
  renderOrderHistory();
}

function buildOrderSnapshot({ orderNumber, orderDate, note, validLines }) {
  const isoDate = new Date().toISOString();
  return {
    id: orderNumber,
    orderNumber,
    orderDate,
    isoDate,
    dayKey: isoDate.slice(0, 10),
    user: currentUser ? { id: currentUser.id, name: currentUser.name, sector: currentUser.sector } : null,
    client: { ...selectedClient },
    note,
    total: getTotal(),
    lines: validLines.map((line) => ({
      ref: line.product.ref,
      gencod: line.product.gencod,
      name: line.product.name,
      udv: line.product.udv || "",
      qty: line.qty,
      price: line.product.price,
      total: line.product.price * line.qty,
    })),
  };
}

function storeOrder(order) {
  const orders = getStoredOrders().filter((item) => item.id !== order.id);
  orders.push(order);
  saveStoredOrders(orders);
  const refs = order.lines.slice(0, 8).map((line) => `${line.ref} x${line.qty}`).join(", ");
  const more = order.lines.length > 8 ? ` + ${order.lines.length - 8} autre(s)` : "";
  recordActivity("Commande enregistrée", `${order.orderNumber} - ${order.client.name} (${order.client.code}) - ${formatter.format(order.total)} - ${order.lines.length} ligne(s) : ${refs}${more}`);
  activeHistoryOrderId = order.id;
  renderOrderHistory();
}

function formatStoredDate(dayKey) {
  const [year, month, day] = dayKey.split("-");
  return `${day}/${month}/${year}`;
}

function getVisibleStoredOrders() {
  const orders = getStoredOrders();
  if (!currentUser) {
    return [];
  }

  return orders
    .filter((order) => order.user?.id === currentUser.id)
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate));
}

function renderOrderHistory() {
  const orders = getVisibleStoredOrders();
  historyCount.textContent = `${orders.length} commande${orders.length > 1 ? "s" : ""}`;
  historyList.innerHTML = "";

  if (!orders.length) {
    historyList.innerHTML = '<div class="history-day">Aucune commande enregistrée</div>';
    historyDetail.innerHTML = "<span>Les commandes générées apparaîtront ici.</span>";
    return;
  }

  let currentDay = "";
  orders.forEach((order) => {
    if (order.dayKey !== currentDay) {
      currentDay = order.dayKey;
      const day = document.createElement("div");
      day.className = "history-day";
      day.textContent = formatStoredDate(order.dayKey);
      historyList.appendChild(day);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = `history-item${order.id === activeHistoryOrderId ? " is-active" : ""}`;
    button.innerHTML = `
      <span>
        <strong>${escapeHtml(order.client.name)}</strong>
        <small>${escapeHtml(order.orderNumber)} - ${escapeHtml(order.lines.length)} ligne${order.lines.length > 1 ? "s" : ""}</small>
      </span>
      <span class="history-item-total">${formatter.format(order.total)}</span>
      <span class="history-delete" title="Effacer cette commande">×</span>
    `;
    button.addEventListener("click", () => {
      activeHistoryOrderId = order.id;
      renderOrderHistory();
      renderOrderDetail(order);
    });
    button.querySelector(".history-delete").addEventListener("click", (event) => {
      event.stopPropagation();
      deleteStoredOrder(order.id);
    });
    historyList.appendChild(button);
  });

  const activeOrder = orders.find((order) => order.id === activeHistoryOrderId) || orders[0];
  activeHistoryOrderId = activeOrder.id;
  renderOrderDetail(activeOrder);
}

function renderOrderDetail(order) {
  historyDetail.innerHTML = `
    <div class="history-detail-header">
      <div>
        <p class="step">${escapeHtml(order.orderDate)}</p>
        <h3>${escapeHtml(order.orderNumber)}</h3>
      </div>
      <strong>${formatter.format(order.total)}</strong>
    </div>
    <div class="history-detail-grid">
      <div class="history-detail-box">
        <strong>${escapeHtml(order.client.name)}</strong>
        <span>${escapeHtml(order.client.code)}</span>
        <span>${escapeHtml(order.client.sector)}</span>
        <span>${escapeHtml(order.client.phone)} - ${escapeHtml(order.client.email)}</span>
      </div>
      <div class="history-detail-box">
        <strong>Livraison</strong>
        <span>${escapeHtml(order.client.deliveryAddress)}</span>
        <span>${escapeHtml(order.client.deliveryZip)} ${escapeHtml(order.client.deliveryCity)}</span>
      </div>
    </div>
    <table class="history-table">
      <thead>
        <tr>
          <th>Réf.</th>
          <th>Désignation</th>
          <th>Qté</th>
          <th>Prix U.</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.lines
          .map(
            (line) => `
              <tr>
                <td>${escapeHtml(line.ref)}</td>
                <td>${escapeHtml(line.name)}</td>
                <td>${escapeHtml(line.qty)}</td>
                <td>${formatter.format(line.price)}</td>
                <td>${formatter.format(line.total)}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
    ${order.note ? `<div class="history-detail-box"><strong>Note</strong><span>${escapeHtml(order.note)}</span></div>` : ""}
  `;
}

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

function getStoredNotes() {
  try {
    return JSON.parse(localStorage.getItem("schullerClientNotes") || "[]");
  } catch {
    return [];
  }
}

function saveStoredNotes(notes) {
  localStorage.setItem("schullerClientNotes", JSON.stringify(notes));
}

function getVisibleVisitNotes() {
  if (!currentUser) return [];
  const allowedCodes = new Set(visibleClients.map((client) => client.code));
  return getStoredNotes()
    .filter((note) => note.userId === currentUser.id && allowedCodes.has(note.clientCode))
    .sort((a, b) => String(a.clientName || "").localeCompare(String(b.clientName || ""), "fr") || String(a.date || "").localeCompare(String(b.date || "")));
}

function noteMatchesReportPeriod(note) {
  const date = String(note.date || "").slice(0, 10);
  const start = reportStartDate?.value || "";
  const end = reportEndDate?.value || "";
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
}

function exportVisitReport(clientOnly = false) {
  if (!currentUser) return;
  const notes = getVisibleVisitNotes()
    .filter((note) => !clientOnly || note.clientCode === selectedNotesClient?.code)
    .filter(noteMatchesReportPeriod);
  if (!notes.length) {
    alert(clientOnly ? "Aucune visite enregistrée pour ce client sur cette période." : "Aucune visite enregistrée à exporter sur cette période.");
    return;
  }
  const rows = [
    ["Commercial", "Secteur", "Code client", "Client", "Date visite", "Compte-rendu", "Relance prévue", "Motif relance", "Relance faite"],
    ...notes.map((note) => [
      note.userName || currentUser.name,
      note.clientSector || "",
      note.clientCode || "",
      note.clientName || "",
      formatNoteDate(note.date),
      note.text || "",
      note.reminderDate ? formatNoteDate(note.reminderDate) : "",
      note.reminderText || "",
      note.reminderDone ? "Oui" : "Non",
    ]),
  ];
  const scope = clientOnly && selectedNotesClient ? selectedNotesClient.code : currentUser.id;
  downloadCsv(`compte-rendu-visites-${scope}-${todayInputDate()}.csv`, rows);
  recordActivity("Compte-rendu exporté", `${notes.length} visite(s) exportée(s)${clientOnly && selectedNotesClient ? ` - ${selectedNotesClient.name}` : ""}`);
}

async function sendVisitReport(clientOnly = false) {
  if (!currentUser || !sendVisitReportButton) return;
  const notes = getVisibleVisitNotes()
    .filter((note) => !clientOnly || note.clientCode === selectedNotesClient?.code)
    .filter(noteMatchesReportPeriod);
  if (!notes.length) {
    alert(clientOnly ? "Aucune visite enregistrée pour ce client sur cette période." : "Aucune visite enregistrée à envoyer sur cette période.");
    return;
  }
  sendVisitReportButton.disabled = true;
  const previousText = sendVisitReportButton.textContent;
  sendVisitReportButton.textContent = "Envoi…";
  notesStatus.textContent = "Envoi du compte-rendu en cours…";
  try {
    const result = await postService({
      action: "sendVisitReport",
      token: currentSessionToken,
      startDate: reportStartDate?.value || "",
      endDate: reportEndDate?.value || "",
      clientOnly: clientOnly ? "1" : "",
      notes: JSON.stringify(notes.map((note) => ({
        userName: note.userName || currentUser.name,
        clientSector: note.clientSector || "",
        clientCode: note.clientCode || "",
        clientName: note.clientName || "",
        date: note.date || "",
        text: note.text || "",
        reminderDate: note.reminderDate || "",
        reminderText: note.reminderText || "",
        reminderDone: Boolean(note.reminderDone),
      }))),
    });
    notesStatus.textContent = result.message || "Compte-rendu envoyé.";
    recordActivity("Compte-rendu envoyé", `${notes.length} visite(s) envoyée(s)${clientOnly && selectedNotesClient ? ` - ${selectedNotesClient.name}` : ""}`);
  } catch (error) {
    notesStatus.textContent = error.message || "Envoi impossible pour le moment.";
  } finally {
    sendVisitReportButton.disabled = false;
    sendVisitReportButton.textContent = previousText;
  }
}

function finishVisit() {
  if (!selectedNotesClient) {
    notesStatus.textContent = "Sélectionnez un client avant de terminer le rendez-vous.";
    notesClientSearch.focus();
    return;
  }
  if (!notesText.value.trim()) {
    notesText.value = "Rendez-vous terminé";
  }
  recordActivity("Rendez-vous terminé", `${selectedNotesClient.name} (${selectedNotesClient.code})`);
  notesForm.requestSubmit();
}

function formatNoteDate(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

function finishVisit() {
  if (!selectedNotesClient) {
    notesStatus.textContent = "Selectionnez un client avant de terminer le rendez-vous.";
    notesClientSearch.focus();
    return;
  }
  const action = visitNextAction?.value || "";
  if (!action) {
    notesStatus.textContent = "Choisissez la prochaine action avant de terminer le rendez-vous.";
    visitNextAction?.focus();
    return;
  }
  notesText.value = appendVisitSummaryToNote(action);
  if (["relance", "devis", "commande"].includes(action)) {
    const days = Math.max(0, Number(visitFollowupDays?.value) || 0);
    const reminder = new Date();
    reminder.setDate(reminder.getDate() + days);
    setReminderFieldsEnabled(true);
    noteReminderDate.value = reminder.toISOString().slice(0, 10);
    noteReminderText.value = action === "relance"
      ? "Relancer le client suite au rendez-vous"
      : action === "devis"
        ? "Faire ou envoyer le devis"
        : "Reprendre contact pour commande probable";
  } else {
    resetReminderFields();
  }
  recordActivity("Rendez-vous termine", `${selectedNotesClient.name} (${selectedNotesClient.code}) - ${actionLabel(action)}`);
  notesForm.requestSubmit();
  visitNextAction.value = "";
  if (visitFollowupDays) visitFollowupDays.value = "7";
  setVisitActionVisibility();
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getNoteActionLabel(note) {
  const text = normalize([note.text || "", note.reminderText || ""].join(" "));
  if (text.includes("devis a faire")) return "Devis a faire";
  if (text.includes("commande probable")) return "Commande probable";
  if (text.includes("a relancer") || text.includes("relance client") || text.includes("relancer le client")) return "A relancer";
  return "";
}

function reminderStatus(note) {
  if (note.reminderDone) return "none";
  if (!note.reminderDate) return getNoteActionLabel(note) ? "action" : "none";
  const today = getTodayKey();
  if (note.reminderDate < today) return "late";
  if (note.reminderDate === today) return "today";
  return "upcoming";
}

function getVisibleReminders(includeUpcoming = false) {
  if (!currentUser) return [];
  const allowedCodes = new Set(visibleClients.map((client) => client.code));
  return getStoredNotes()
    .filter((note) => note.userId === currentUser.id && allowedCodes.has(note.clientCode) && !note.reminderDone && (note.reminderDate || getNoteActionLabel(note)))
    .filter((note) => includeUpcoming || reminderStatus(note) === "late" || reminderStatus(note) === "today" || reminderStatus(note) === "action")
    .sort((a, b) => {
      const dateCompare = String(a.reminderDate || a.date || "").localeCompare(String(b.reminderDate || b.date || ""));
      if (dateCompare !== 0) return dateCompare;
      return a.clientName.localeCompare(b.clientName);
    });
}

function updateReminderBadge() {
  const dueCount = getVisibleReminders(false).length;
  notesReminderBadge.textContent = String(dueCount);
  notesReminderBadge.classList.toggle("is-hidden", dueCount === 0);
  notesTab.classList.toggle("has-reminder", dueCount > 0);
}

function setReminderFieldsEnabled(enabled) {
  noteReminderEnabled.checked = enabled;
  noteReminderFields.classList.toggle("is-open", enabled);
  noteReminderDate.disabled = !enabled;
  noteReminderText.disabled = !enabled;
  if (enabled && !noteReminderDate.value) noteReminderDate.value = getTodayKey();
}

function resetReminderFields() {
  setReminderFieldsEnabled(false);
  noteReminderDate.value = "";
  noteReminderText.value = "";
}

function findVisibleClientByCode(code) {
  return visibleClients.find((client) => client.code === code);
}

function renderHomeReminders() {
  const reminders = getVisibleReminders(false);
  updateReminderBadge();

  homeRemindersPanel.classList.toggle("is-hidden", reminders.length === 0);
  homeRemindersCount.textContent = `${reminders.length} relance${reminders.length > 1 ? "s" : ""}`;
  if (!reminders.length) {
    homeRemindersList.innerHTML = "";
    return;
  }

  homeRemindersList.innerHTML = reminders
    .map((note) => {
      const status = reminderStatus(note);
      const label = status === "late" ? "En retard" : "Aujourd’hui";
      return `
        <article class="home-reminder-card ${status}">
          <div>
            <span class="reminder-pill">${label}</span>
            <strong>${escapeHtml(note.clientName)}</strong>
            <small>${escapeHtml(formatNoteDate(note.reminderDate))} - ${escapeHtml(note.reminderText || "Relance client")}</small>
          </div>
          <div class="home-reminder-actions">
            <button class="ghost-button compact" type="button" data-open-reminder="${escapeHtml(note.id)}">Voir</button>
            <button class="primary-button compact" type="button" data-done-reminder="${escapeHtml(note.id)}">Fait</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function markReminderDone(noteId) {
  const notes = getStoredNotes();
  const index = notes.findIndex((note) => note.id === noteId && note.userId === currentUser?.id);
  if (index === -1) return;
  notes[index] = { ...notes[index], reminderDone: true, reminderDoneAt: new Date().toISOString() };
  saveStoredNotes(notes);
  recordActivity("Relance client faite", `${notes[index].clientName} (${notes[index].clientCode}) - ${notes[index].reminderText || "Relance client"}`);
  renderHomeReminders();
  if (selectedNotesClient?.code === notes[index].clientCode) renderClientNotes();
  if (!selectedNotesClient) renderNotesReminderInbox();
  if (selectedNotesClient && notesReminderFocus.textContent.includes(notes[index].clientName)) hideReminderFocus();
}

function openReminderNote(noteId) {
  const note = getStoredNotes().find((item) => item.id === noteId && item.userId === currentUser?.id);
  if (!note) return;
  const client = findVisibleClientByCode(note.clientCode);
  if (!client) return;
  selectNotesClient(client);
  showReminderFocus(note);
  setActiveTab("notes");
  requestAnimationFrame(() => {
    document.querySelector(`[data-note-id="${CSS.escape(noteId)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function showReminderFocus(note) {
  notesReminderFocus.classList.remove("is-hidden");
  notesReminderFocus.innerHTML = `
    <div>
      <span class="reminder-pill">${reminderStatus(note) === "late" ? "En retard" : "Relance"}</span>
      <strong>${escapeHtml(note.clientName)}</strong>
      <small>${escapeHtml(formatNoteDate(note.reminderDate))} - ${escapeHtml(note.reminderText || "Relance client")}</small>
    </div>
    <div class="home-reminder-actions">
      <button class="primary-button compact" type="button" data-done-reminder="${escapeHtml(note.id)}">Marquer fait</button>
    </div>
  `;
}

function hideReminderFocus() {
  notesReminderFocus.classList.add("is-hidden");
  notesReminderFocus.innerHTML = "";
}

function renderNotesReminderInbox() {
  const reminders = getVisibleReminders(false);
  if (!reminders.length) {
    hideReminderFocus();
    return;
  }
  notesReminderFocus.classList.remove("is-hidden");
  notesReminderFocus.innerHTML = `
    <div class="notes-reminder-inbox-header">
      <div>
        <span class="reminder-pill">${reminders.length} à traiter</span>
        <strong>Relances clients</strong>
        <small>Voici les clients à rappeler aujourd’hui ou en retard.</small>
      </div>
    </div>
    <div class="notes-reminder-inbox-list">
      ${reminders.map((note) => `
        <article class="home-reminder-card ${reminderStatus(note)}">
          <div>
            <span class="reminder-pill">${reminderStatus(note) === "late" ? "En retard" : "Aujourd’hui"}</span>
            <strong>${escapeHtml(note.clientName)}</strong>
            <small>${escapeHtml(formatNoteDate(note.reminderDate))} - ${escapeHtml(note.reminderText || "Relance client")}</small>
          </div>
          <div class="home-reminder-actions">
            <button class="ghost-button compact" type="button" data-open-reminder="${escapeHtml(note.id)}">Voir</button>
            <button class="primary-button compact" type="button" data-done-reminder="${escapeHtml(note.id)}">Fait</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function getVisibleNotesForClient(client = selectedNotesClient) {
  if (!currentUser || !client) return [];
  return getStoredNotes()
    .filter((note) => note.userId === currentUser.id && note.clientCode === client.code)
    .sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.createdAt.localeCompare(a.createdAt);
    });
}

function renderNotesSuggestions(query) {
  const cleanQuery = normalize(query.trim());
  notesClientSuggestions.innerHTML = "";

  if (!cleanQuery) {
    renderNotesEmpty();
    notesClientSuggestions.classList.remove("is-open");
    return;
  }

  const matches = visibleClients
    .filter((client) => {
      const searchable = [
        client.code,
        client.name,
        client.billingCity,
        client.billingZip,
        client.deliveryCity,
        client.deliveryZip,
        client.sector,
      ].join(" ");
      return normalize(searchable).includes(cleanQuery);
    })
    .slice(0, 12);

  if (!matches.length) {
    notesClientSuggestions.classList.remove("is-open");
    return;
  }

  matches.forEach((client) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion";
    button.innerHTML = `
      <strong>${escapeHtml(client.name)}</strong>
      <span>${escapeHtml(client.code)} - ${escapeHtml(client.billingZip)} ${escapeHtml(client.billingCity)} - ${escapeHtml(client.sector)}</span>
    `;
    button.addEventListener("click", () => selectNotesClient(client));
    notesClientSuggestions.appendChild(button);
  });

  notesClientSuggestions.classList.add("is-open");
}

function selectNotesClient(client) {
  selectedNotesClient = client;
  editingNoteId = null;
  notesClientSearch.value = client.name;
  hideReminderFocus();
  notesClientSuggestions.classList.remove("is-open");
  notesStatus.textContent = `${client.name} - ${client.code}`;
  notesSelectedClient.innerHTML = `
    <strong>${escapeHtml(client.name)}</strong>
    <span>${escapeHtml(client.code)} - ${escapeHtml(client.billingZip)} ${escapeHtml(client.billingCity)}</span>
    <span>${escapeHtml(client.sector)}${client.phone ? ` - ${escapeHtml(client.phone)}` : ""}</span>
  `;
  notesDate.value = todayInputDate();
  notesText.value = "";
  resetReminderFields();
  saveNoteButton.textContent = "Enregistrer la note";
  cancelEditNote.classList.add("is-hidden");
  renderClientNotes();
  recordActivity("Client consulté en notes", `${client.name} (${client.code})`);
  requestAnimationFrame(() => notesText.focus());
}

function renderNotesEmpty(message = "Recherchez un client pour afficher ses notes de rendez-vous.") {
  selectedNotesClient = null;
  editingNoteId = null;
  notesHistoryMode = "client";
  hideReminderFocus();
  notesStatus.textContent = "Aucun client sélectionné";
  notesCount.textContent = "0 note";
  notesHistoryTitle.textContent = "Notes du client";
  notesSelectedClient.innerHTML = `
    <strong>Sélectionnez un client</strong>
    <span>Choisissez un client en haut pour ajouter ou consulter ses notes de rendez-vous.</span>
  `;
  notesList.innerHTML = `<div class="notes-empty">${escapeHtml(message)}</div>`;
  notesForm.reset();
  notesDate.value = todayInputDate();
  resetReminderFields();
  saveNoteButton.textContent = "Enregistrer la note";
  cancelEditNote.classList.add("is-hidden");
  renderNotesReminderInbox();
}

function renderAllNotes() {
  notesHistoryMode = "all";
  hideReminderFocus();
  const notes = getVisibleVisitNotes().filter(noteMatchesReportPeriod).sort((a, b) => {
    const dateCompare = String(b.date || "").localeCompare(String(a.date || ""));
    if (dateCompare !== 0) return dateCompare;
    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  });
  notesStatus.textContent = "Toutes vos notes";
  notesHistoryTitle.textContent = "Mes notes";
  notesCount.textContent = `${notes.length} note${notes.length > 1 ? "s" : ""}`;

  if (!notes.length) {
    notesList.innerHTML = `
      <div class="notes-empty">
        <strong>Aucune note trouvée.</strong>
        <span>Modifiez la période ou sélectionnez un client pour ajouter une nouvelle note.</span>
      </div>
    `;
    return;
  }

  notesList.innerHTML = notes.map((note) => `
    <article class="note-card all-note-card" data-note-id="${escapeHtml(note.id)}">
      <div class="note-card-header">
        <div>
          <span class="note-date">${escapeHtml(formatNoteDate(note.date))}</span>
          <strong>${escapeHtml(note.clientName || "Client")}</strong>
          <small>${escapeHtml(note.clientCode || "")}${note.clientSector ? ` - ${escapeHtml(note.clientSector)}` : ""}</small>
        </div>
        <div class="note-actions">
          <button class="ghost-button compact" type="button" data-edit-note="${escapeHtml(note.id)}">Modifier</button>
          <button class="history-delete" type="button" data-delete-note="${escapeHtml(note.id)}" title="Supprimer cette note">×</button>
        </div>
      </div>
      <p>${escapeHtml(note.text).replaceAll("\n", "<br>")}</p>
      ${note.reminderDate ? `
        <div class="note-reminder ${reminderStatus(note)}">
          <div>
            <strong>${note.reminderDone ? "Relance faite" : "Relance prévue"}</strong>
            <span>${escapeHtml(formatNoteDate(note.reminderDate))} - ${escapeHtml(note.reminderText || "Relance client")}</span>
          </div>
          ${!note.reminderDone ? `<button class="primary-button compact" type="button" data-done-reminder="${escapeHtml(note.id)}">Marquer fait</button>` : ""}
        </div>
      ` : ""}
    </article>
  `).join("");
}

function renderClientNotes() {
  notesHistoryMode = "client";
  const notes = getVisibleNotesForClient();
  notesCount.textContent = `${notes.length} note${notes.length > 1 ? "s" : ""}`;
  notesHistoryTitle.textContent = "Notes du client";

  if (!selectedNotesClient) {
    renderNotesEmpty();
    return;
  }

  if (!notes.length) {
    notesList.innerHTML = `
      <div class="notes-empty">
        <strong>Aucune note pour ce client.</strong>
        <span>Ajoutez le compte-rendu du rendez-vous à gauche.</span>
      </div>
    `;
    return;
  }

  notesList.innerHTML = notes
    .map((note) => `
      <article class="note-card" data-note-id="${escapeHtml(note.id)}">
        <div class="note-card-header">
          <div>
            <span class="note-date">${escapeHtml(formatNoteDate(note.date))}</span>
            <small>Ajoutée le ${escapeHtml(formatNoteDate(note.createdAt))}</small>
          </div>
          <div class="note-actions">
            <button class="ghost-button compact" type="button" data-edit-note="${escapeHtml(note.id)}">Modifier</button>
            <button class="history-delete" type="button" data-delete-note="${escapeHtml(note.id)}" title="Supprimer cette note">×</button>
          </div>
        </div>
        <p>${escapeHtml(note.text).replaceAll("\n", "<br>")}</p>
        ${note.reminderDate ? `
          <div class="note-reminder ${reminderStatus(note)}">
            <div>
              <strong>${note.reminderDone ? "Relance faite" : "Relance prévue"}</strong>
              <span>${escapeHtml(formatNoteDate(note.reminderDate))} - ${escapeHtml(note.reminderText || "Relance client")}</span>
            </div>
            ${!note.reminderDone ? `<button class="primary-button compact" type="button" data-done-reminder="${escapeHtml(note.id)}">Marquer fait</button>` : ""}
          </div>
        ` : ""}
      </article>
    `)
    .join("");
}

function saveClientNote(event) {
  event.preventDefault();
  if (!currentUser || !selectedNotesClient) {
    notesStatus.textContent = "Sélectionnez un client avant d’enregistrer.";
    requestAnimationFrame(() => notesClientSearch.focus());
    return;
  }

  const text = notesText.value.trim();
  if (!text) {
    notesText.focus();
    return;
  }

  const notes = getStoredNotes();
  const now = new Date().toISOString();
  if (editingNoteId) {
    const index = notes.findIndex((note) => note.id === editingNoteId && note.userId === currentUser.id);
    if (index !== -1) {
      const reminderChanged = notes[index].reminderDate !== (noteReminderEnabled.checked ? noteReminderDate.value : "") ||
        notes[index].reminderText !== (noteReminderEnabled.checked ? noteReminderText.value.trim() : "");
      notes[index] = {
        ...notes[index],
        date: notesDate.value || todayInputDate(),
        text,
        reminderDate: noteReminderEnabled.checked ? noteReminderDate.value : "",
        reminderText: noteReminderEnabled.checked ? noteReminderText.value.trim() : "",
        reminderDone: noteReminderEnabled.checked ? (reminderChanged ? false : Boolean(notes[index].reminderDone)) : false,
        reminderDoneAt: noteReminderEnabled.checked && !reminderChanged ? (notes[index].reminderDoneAt || "") : "",
        updatedAt: now,
      };
      recordActivity("Note client modifiée", `${selectedNotesClient.name} (${selectedNotesClient.code})`);
    }
  } else {
    notes.push({
      id: `note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      clientCode: selectedNotesClient.code,
      clientName: selectedNotesClient.name,
      clientSector: selectedNotesClient.sector,
      date: notesDate.value || todayInputDate(),
      text,
      reminderDate: noteReminderEnabled.checked ? noteReminderDate.value : "",
      reminderText: noteReminderEnabled.checked ? noteReminderText.value.trim() : "",
      reminderDone: false,
      reminderDoneAt: "",
      createdAt: now,
      updatedAt: now,
    });
    recordActivity("Note client ajoutée", `${selectedNotesClient.name} (${selectedNotesClient.code}) - ${text.slice(0, 120)}`);
  }

  saveStoredNotes(notes);
  editingNoteId = null;
  notesText.value = "";
  notesDate.value = todayInputDate();
  resetReminderFields();
  if (visitNextAction) visitNextAction.value = "";
  if (visitFollowupDays) visitFollowupDays.value = "7";
  setVisitActionVisibility();
  saveNoteButton.textContent = "Enregistrer la note";
  cancelEditNote.classList.add("is-hidden");
  if (notesHistoryMode === "all") {
    renderAllNotes();
  } else {
    renderClientNotes();
  }
  renderHomeReminders();
}

function editClientNote(noteId) {
  const note = getVisibleVisitNotes().find((item) => item.id === noteId);
  if (!note) return;
  const client = visibleClients.find((item) => item.code === note.clientCode);
  if (client && selectedNotesClient?.code !== client.code) {
    selectedNotesClient = client;
    notesClientSearch.value = client.name;
    notesStatus.textContent = `${client.name} - ${client.code}`;
    notesSelectedClient.innerHTML = `
      <strong>${escapeHtml(client.name)}</strong>
      <span>${escapeHtml(client.code)} - ${escapeHtml(client.billingZip)} ${escapeHtml(client.billingCity)}</span>
      <span>${escapeHtml(client.sector)}${client.phone ? ` - ${escapeHtml(client.phone)}` : ""}</span>
    `;
  }
  editingNoteId = note.id;
  notesDate.value = note.date;
  notesText.value = note.text;
  if (note.reminderDate) {
    setReminderFieldsEnabled(true);
    noteReminderDate.value = note.reminderDate;
    noteReminderText.value = note.reminderText || "";
  } else {
    resetReminderFields();
  }
  saveNoteButton.textContent = "Modifier la note";
  cancelEditNote.classList.remove("is-hidden");
  requestAnimationFrame(() => notesText.focus());
}

function cancelNoteEdit() {
  editingNoteId = null;
  notesText.value = "";
  notesDate.value = todayInputDate();
  resetReminderFields();
  saveNoteButton.textContent = "Enregistrer la note";
  cancelEditNote.classList.add("is-hidden");
}

function deleteClientNote(noteId) {
  const note = getVisibleVisitNotes().find((item) => item.id === noteId);
  if (!note) return;
  const wasAllNotes = notesHistoryMode === "all";
  const client = visibleClients.find((item) => item.code === note.clientCode);
  if (client && selectedNotesClient?.code !== client.code) selectedNotesClient = client;
  if (!confirm(`Supprimer la note du ${formatNoteDate(note.date)} pour ${selectedNotesClient.name} ?`)) return;
  saveStoredNotes(getStoredNotes().filter((item) => item.id !== noteId));
  if (editingNoteId === noteId) cancelNoteEdit();
  recordActivity("Note client supprimée", `${selectedNotesClient.name} (${selectedNotesClient.code}) - ${formatNoteDate(note.date)}`);
  renderClientNotes();
  if (wasAllNotes) renderAllNotes();
  renderHomeReminders();
}

function setupVoiceNotes() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    startVoiceNote.disabled = true;
    startVoiceNote.classList.add("is-disabled");
    voiceNoteStatus.textContent = "Dictée vocale non disponible sur ce navigateur.";
    return;
  }

  voiceRecognition = new SpeechRecognition();
  voiceRecognition.lang = "fr-FR";
  voiceRecognition.continuous = true;
  voiceRecognition.interimResults = true;

  voiceRecognition.addEventListener("start", () => {
    voiceNoteListening = true;
    startVoiceNote.classList.add("is-listening");
    startVoiceNote.innerHTML = '<span aria-hidden="true">ðŸ”´</span> Arrêter la dictée';
    voiceNoteStatus.textContent = "J’écoute… parlez clairement, le texte s’ajoute à la note.";
  });

  voiceRecognition.addEventListener("result", (event) => {
    let finalText = "";
    let interimText = "";
    for (let index = event.resultIndex; index < event.results.length; index++) {
      const transcript = event.results[index][0].transcript.trim();
      if (event.results[index].isFinal) {
        finalText += transcript + " ";
      } else {
        interimText += transcript + " ";
      }
    }

    if (finalText) {
      const separator = notesText.value.trim() ? "\n" : "";
      notesText.value = `${notesText.value.trimEnd()}${separator}${finalText.trim()}`;
      notesText.dispatchEvent(new Event("input", { bubbles: true }));
    }
    voiceNoteStatus.textContent = interimText ? `En cours : ${interimText.trim()}` : "J’écoute…";
  });

  voiceRecognition.addEventListener("end", () => {
    voiceNoteListening = false;
    startVoiceNote.classList.remove("is-listening");
    startVoiceNote.innerHTML = '<span aria-hidden="true">ðŸŽ™ï¸</span> Dicter la note';
    if (voiceNoteStatus.textContent.startsWith("En cours")) {
      voiceNoteStatus.textContent = "Dictée terminée. Relisez puis enregistrez la note.";
    } else if (!voiceNoteStatus.textContent.includes("non disponible")) {
      voiceNoteStatus.textContent = "Dictée arrêtée. Vous pouvez relire puis enregistrer.";
    }
  });

  voiceRecognition.addEventListener("error", (event) => {
    voiceNoteListening = false;
    startVoiceNote.classList.remove("is-listening");
    startVoiceNote.innerHTML = '<span aria-hidden="true">ðŸŽ™ï¸</span> Dicter la note';
    const messages = {
      "not-allowed": "Micro refusé. Autorisez le micro dans Chrome pour utiliser la dictée.",
      "no-speech": "Je n’ai pas entendu de voix. Réessayez en parlant plus près de la tablette.",
      "audio-capture": "Aucun micro détecté sur cet appareil.",
      network: "La dictée vocale a besoin d’une connexion internet.",
    };
    voiceNoteStatus.textContent = messages[event.error] || "La dictée vocale s’est arrêtée. Réessayez.";
  });
}

function toggleVoiceNote() {
  if (!voiceRecognition) {
    voiceNoteStatus.textContent = "Dictée vocale non disponible sur ce navigateur.";
    return;
  }
  if (!selectedNotesClient) {
    voiceNoteStatus.textContent = "Sélectionnez d’abord un client avant de dicter une note.";
    notesClientSearch.focus();
    return;
  }
  if (voiceNoteListening) {
    voiceRecognition.stop();
    return;
  }
  try {
    voiceRecognition.start();
    recordActivity("Dictée vocale lancée", `${selectedNotesClient.name} (${selectedNotesClient.code})`);
  } catch {
    voiceNoteStatus.textContent = "La dictée est déjà en cours.";
  }
}

const departmentMapPositions = {
  "01": [67, 55], "02": [58, 28], "03": [56, 55], "04": [70, 76], "05": [73, 73], "06": [79, 78], "07": [64, 69], "08": [64, 25], "09": [49, 84], "10": [59, 35],
  "11": [55, 84], "12": [52, 72], "13": [68, 82], "14": [35, 34], "15": [53, 66], "16": [37, 63], "17": [33, 62], "18": [52, 50], "19": [48, 67],
  "21": [62, 49], "22": [24, 43], "23": [50, 61], "24": [42, 68], "25": [72, 51], "26": [64, 68], "27": [41, 33], "28": [45, 40], "29": [18, 44],
  "30": [62, 78], "31": [48, 86], "32": [43, 81], "33": [36, 73], "34": [57, 82], "35": [27, 42], "36": [48, 55], "37": [42, 51], "38": [69, 65], "39": [70, 55],
  "40": [36, 80], "41": [45, 48], "42": [59, 62], "43": [57, 67], "44": [28, 52], "45": [49, 45], "46": [48, 73], "47": [41, 76], "48": [57, 73], "49": [33, 51],
  "50": [31, 33], "51": [60, 31], "52": [63, 40], "53": [32, 45], "54": [70, 35], "55": [66, 34], "56": [22, 50], "57": [73, 33], "58": [56, 51], "59": [56, 19],
  "60": [51, 31], "61": [37, 39], "62": [52, 21], "63": [55, 61], "64": [38, 86], "65": [44, 87], "66": [55, 90], "67": [78, 37], "68": [78, 44], "69": [63, 61],
  "70": [70, 47], "71": [61, 55], "72": [38, 46], "73": [73, 65], "74": [75, 60], "75": [49, 36], "76": [43, 28], "77": [54, 37], "78": [47, 37], "79": [36, 58],
  "80": [51, 25], "81": [51, 81], "82": [47, 78], "83": [73, 82], "84": [66, 78], "85": [29, 58], "86": [39, 56], "87": [45, 61], "88": [72, 42], "89": [57, 44],
  "90": [73, 48], "91": [49, 39], "92": [48, 36], "93": [50, 36], "94": [50, 37], "95": [48, 34],
};

const allowedTourSectorKeys = new Set(["1", "2", "3", "4", "4a", "5", "5a", "6", "7", "8", "9"]);

function getSectorKey(sector) {
  return normalize(sector || "")
    .replace(/^secteur\s*/, "")
    .replace(/^0+/, "")
    .toLowerCase();
}

function isAllowedTourClient(client) {
  const sectorText = normalize(client.sector || "");
  if (!sectorText || sectorText.includes("belg") || sectorText.includes("purecrea")) return false;
  return allowedTourSectorKeys.has(getSectorKey(client.sector));
}

function clientAddressParts(client) {
  return [
    client.deliveryAddress,
    `${client.deliveryZip || ""} ${client.deliveryCity || ""}`.trim(),
  ].filter((part) => part && !normalize(part).includes("none"));
}

function getClientRouteAddress(client) {
  const parts = clientAddressParts(client);
  if (!parts.length) return "";
  const country = /belg|belgi|bruxelles|brussel|herentals|anvers|antwerp/i.test(parts.join(" ")) ? "Belgique" : "France";
  return [...parts, country].join(", ");
}

function getTourClients() {
  return visibleClients.filter(isAllowedTourClient).sort((a, b) => {
    const cityCompare = (a.deliveryCity || a.billingCity || "").localeCompare(b.deliveryCity || b.billingCity || "", "fr");
    if (cityCompare !== 0) return cityCompare;
    return (a.name || "").localeCompare(b.name || "", "fr");
  });
}

function getFilteredTourClients() {
  const query = normalize(tourSearch?.value || "");
  const clients = getTourClients();
  if (!query) return clients;
  return clients.filter((client) => normalize([
    client.code,
    client.name,
    client.billingCity,
    client.billingZip,
    client.deliveryCity,
    client.deliveryZip,
    client.deliveryAddress,
    client.sector,
  ].join(" ")).includes(query));
}

function getSelectedTourClients() {
  return Array.from(selectedTourCodes)
    .map((code) => visibleClients.find((client) => client.code === code))
    .filter(Boolean)
    .filter(isAllowedTourClient);
}

function getDepartmentFromZip(zip) {
  const cleanZip = String(zip || "").trim().toUpperCase();
  if (/^2A/.test(cleanZip)) return "2A";
  if (/^2B/.test(cleanZip)) return "2B";
  const match = cleanZip.match(/\d{2}/);
  return match ? match[0] : "";
}

function hashClientCode(value) {
  return String(value || "").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getClientMapPosition(client, scopeClients = visibleClients) {
  const dept = getDepartmentFromZip(client.deliveryZip || client.billingZip);
  const base = departmentMapPositions[dept] || [50, 52];
  const sameDepartmentClients = scopeClients.filter((item) => getDepartmentFromZip(item.deliveryZip || item.billingZip) === dept);
  const index = Math.max(0, sameDepartmentClients.findIndex((item) => item.code === client.code));
  const count = Math.max(1, sameDepartmentClients.length);
  const angle = index * 2.399963229728653;
  const ring = Math.sqrt(index + 1);
  const radius = Math.min(8.5, 1.6 + count * 0.16);
  const hash = hashClientCode(client.code);
  const jitterX = Math.cos(angle) * ring * radius * 0.34 + ((hash % 3) - 1) * 0.35;
  const jitterY = Math.sin(angle) * ring * radius * 0.26 + (((hash / 5) % 3) - 1) * 0.35;
  return {
    x: Math.max(8, Math.min(92, base[0] + jitterX)),
    y: Math.max(10, Math.min(92, base[1] + jitterY)),
  };
}

function parseCoordinate(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(String(value).replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

function getClientCoordinates(client, scopeClients = visibleClients) {
  const latitude = parseCoordinate(client.latitude ?? client.lat);
  const longitude = parseCoordinate(client.longitude ?? client.lng ?? client.lon);
  if (latitude !== null && longitude !== null) {
    return { lat: latitude, lng: longitude, precise: true };
  }
  return null;
}

function distanceKmBetweenPoints(a, b) {
  if (!a || !b) return 0;
  const earthRadius = 6371;
  const toRad = (value) => value * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

function getSelectedTourStats(codes = Array.from(selectedTourCodes)) {
  const clients = codes
    .map((code) => visibleClients.find((client) => client.code === code))
    .filter(Boolean)
    .filter(isAllowedTourClient);
  const coordinates = clients.map((client) => getClientCoordinates(client)).filter(Boolean);
  let straightDistance = 0;
  for (let index = 1; index < coordinates.length; index += 1) {
    straightDistance += distanceKmBetweenPoints(coordinates[index - 1], coordinates[index]);
  }
  const estimatedDistance = straightDistance ? Math.round(straightDistance * 1.28) : 0;
  const estimatedMinutes = estimatedDistance ? Math.round((estimatedDistance / 55) * 60 + clients.length * 8) : 0;
  return {
    clients,
    clientCount: clients.length,
    gpsCount: coordinates.length,
    distanceKm: estimatedDistance,
    minutes: estimatedMinutes,
  };
}

function formatDuration(minutes) {
  if (!minutes) return "--";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return `${hours} h ${String(rest).padStart(2, "0")}`;
}

function initTourMap() {
  if (!tourMap) return false;
  if (!window.L) {
    tourMap.innerHTML = `<div class="tour-map-unavailable">Carte interactive indisponible. Vérifiez la connexion internet puis rechargez la page.</div>`;
    return false;
  }
  if (tourMapInstance) return true;
  tourMap.innerHTML = "";
  tourMapInstance = L.map(tourMap, { scrollWheelZoom: true, preferCanvas: true }).setView([46.7, 2.4], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(tourMapInstance);
  tourMarkersLayer = L.layerGroup().addTo(tourMapInstance);
  tourRouteLayer = L.layerGroup().addTo(tourMapInstance);
  setTimeout(() => tourMapInstance.invalidateSize(), 150);
  return true;
}

function renderInteractiveTourMap(clients) {
  if (!initTourMap()) return;
  tourMarkersLayer.clearLayers();
  tourRouteLayer.clearLayers();
  tourMarkerByCode = new Map();
  const selectedClients = getSelectedTourClients();
  const bounds = [];
  const selectedCoordinates = [];

  clients.forEach((client) => {
    const coordinates = getClientCoordinates(client, clients);
    if (!coordinates) return;
    const selected = selectedTourCodes.has(client.code);
    const marker = L.circleMarker([coordinates.lat, coordinates.lng], {
      radius: selected ? 8 : 5,
      color: selected ? "#e70013" : "#111827",
      weight: selected ? 3 : 2,
      fillColor: selected ? "#e70013" : "#111827",
      fillOpacity: selected ? 0.9 : 0.75,
    }).addTo(tourMarkersLayer);
    marker.bindTooltip(client.name, { direction: "top", sticky: true });
    marker.bindPopup(`
      <strong>${escapeHtml(client.name)}</strong><br>
      <span>${escapeHtml(client.code)} - ${escapeHtml(client.sector || "")}</span><br>
      <small>${escapeHtml(getClientRouteAddress(client) || "Adresse incomplète")}</small><br>
      <small>Position GPS vérifiée</small>
    `);
    marker.on("click", () => toggleTourClient(client.code));
    tourMarkerByCode.set(client.code, marker);
    bounds.push([coordinates.lat, coordinates.lng]);
  });

  selectedClients.forEach((client) => {
    const coordinates = getClientCoordinates(client, clients);
    if (!coordinates) return;
    selectedCoordinates.push([coordinates.lat, coordinates.lng]);
  });

  if (selectedCoordinates.length > 1) {
    L.polyline(selectedCoordinates, { color: "#e70013", weight: 4, opacity: 0.72, dashArray: "8 8" }).addTo(tourRouteLayer);
  }

  const fitPoints = selectedCoordinates.length ? selectedCoordinates : bounds;
  if (fitPoints.length === 1) {
    tourMapInstance.setView(fitPoints[0], 11);
  } else if (fitPoints.length > 1) {
    tourMapInstance.fitBounds(fitPoints, { padding: [26, 26], maxZoom: selectedCoordinates.length ? 12 : 8 });
  }
  updateTourRouteSummary();
}

function updateTourRouteSummary() {
  if (!tourRouteSummary) return;
  const stats = getSelectedTourStats();
  const distanceText = stats.distanceKm && stats.gpsCount >= 2 ? `env. ${stats.distanceKm} km` : "--";
  const timeText = stats.minutes && stats.gpsCount >= 2 ? formatDuration(stats.minutes) : "--";
  const gpsText = stats.clientCount ? `${stats.gpsCount}/${stats.clientCount} avec GPS` : "Aucun client coche";
  tourRouteSummary.innerHTML = `
    <strong>${stats.clientCount} client${stats.clientCount > 1 ? "s" : ""}</strong>
    <span>Distance estimee : ${escapeHtml(distanceText)}</span>
    <span>Temps estime : ${escapeHtml(timeText)}</span>
    <small>${escapeHtml(gpsText)}</small>
  `;
}

function getAllSavedTours() {
  try {
    return JSON.parse(localStorage.getItem(savedToursStorageKey) || "{}");
  } catch {
    return {};
  }
}

function getCurrentUserSavedTours() {
  if (!currentUser) return [];
  const saved = getAllSavedTours();
  return Array.isArray(saved[currentUser.id]) ? saved[currentUser.id] : [];
}

function saveCurrentUserTours(tours) {
  if (!currentUser) return;
  const saved = getAllSavedTours();
  saved[currentUser.id] = tours;
  localStorage.setItem(savedToursStorageKey, JSON.stringify(saved));
}

function renderSavedTours() {
  if (!savedTourSelect) return;
  const tours = getCurrentUserSavedTours();
  savedTourSelect.innerHTML = tours.length
    ? `<option value="">Choisir une tournée</option>${tours.map((tour) => `<option value="${escapeHtml(tour.id)}">${escapeHtml(tour.name)} (${tour.codes.length})</option>`).join("")}`
    : `<option value="">Aucune tournée enregistrée</option>`;
  loadTourButton.disabled = tours.length === 0;
  deleteTourButton.disabled = tours.length === 0;
}

function saveCurrentTour() {
  const codes = Array.from(selectedTourCodes);
  if (!codes.length) {
    alert("Sélectionnez au moins un client avant de sauvegarder une tournée.");
    return;
  }
  const name = tourName.value.trim();
  if (!name) {
    alert("Donnez un nom à la tournée avant de la sauvegarder.");
    tourName.focus();
    return;
  }
  const tours = getCurrentUserSavedTours();
  const existingIndex = tours.findIndex((tour) => normalize(tour.name) === normalize(name));
  const payload = {
    id: existingIndex >= 0 ? tours[existingIndex].id : `tour-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    codes,
    updatedAt: new Date().toISOString(),
    createdAt: existingIndex >= 0 ? tours[existingIndex].createdAt : new Date().toISOString(),
  };
  if (existingIndex >= 0) tours[existingIndex] = payload;
  else tours.push(payload);
  saveCurrentUserTours(tours.sort((a, b) => a.name.localeCompare(b.name, "fr", { numeric: true })));
  renderSavedTours();
  savedTourSelect.value = payload.id;
  recordActivity("Tournée sauvegardée", `${payload.name} - ${payload.codes.length} client(s)`);
}

function loadSavedTour() {
  const id = savedTourSelect.value;
  const tour = getCurrentUserSavedTours().find((item) => item.id === id);
  if (!tour) return;
  const allowedCodes = new Set(getTourClients().map((client) => client.code));
  selectedTourCodes = new Set(tour.codes.filter((code) => allowedCodes.has(code)));
  tourName.value = tour.name;
  renderTourPlanner();
  recordActivity("Tournée chargée", `${tour.name} - ${selectedTourCodes.size} client(s)`);
}

function deleteSavedTour() {
  const id = savedTourSelect.value;
  const tours = getCurrentUserSavedTours();
  const tour = tours.find((item) => item.id === id);
  if (!tour) return;
  if (!confirm(`Supprimer la tournée "${tour.name}" ?`)) return;
  saveCurrentUserTours(tours.filter((item) => item.id !== id));
  savedTourSelect.value = "";
  renderSavedTours();
  recordActivity("Tournée supprimée", tour.name);
}

function focusTourClientOnMap(code) {
  const client = visibleClients.find((item) => item.code === code);
  if (!client || !tourMapInstance) return;
  const coordinates = getClientCoordinates(client, getFilteredTourClients());
  if (!coordinates) return;
  tourMapInstance.setView([coordinates.lat, coordinates.lng], 15);
  tourMarkerByCode.get(code)?.openPopup();
}

function renderSavedTours() {
  if (!savedTourSelect) return;
  const tours = getCurrentUserSavedTours();
  savedTourSelect.innerHTML = tours.length
    ? `<option value="">Choisir une tournee</option>${tours.map((tour) => {
        const stats = tour.stats || getSelectedTourStats(tour.codes);
        const distance = stats.distanceKm ? ` - env. ${stats.distanceKm} km` : "";
        return `<option value="${escapeHtml(tour.id)}">${escapeHtml(tour.name)} (${tour.codes.length})${distance}</option>`;
      }).join("")}`
    : `<option value="">Aucune tournee enregistree</option>`;
  loadTourButton.disabled = tours.length === 0;
  deleteTourButton.disabled = tours.length === 0;
}

function saveCurrentTour() {
  const codes = Array.from(selectedTourCodes);
  if (!codes.length) {
    alert("Selectionnez au moins un client avant de sauvegarder une tournee.");
    return;
  }
  const name = tourName.value.trim();
  if (!name) {
    alert("Donnez un nom a la tournee avant de la sauvegarder.");
    tourName.focus();
    return;
  }
  const tours = getCurrentUserSavedTours();
  const existingIndex = tours.findIndex((tour) => normalize(tour.name) === normalize(name));
  const stats = getSelectedTourStats(codes);
  const payload = {
    id: existingIndex >= 0 ? tours[existingIndex].id : `tour-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    codes,
    stats: {
      clientCount: stats.clientCount,
      gpsCount: stats.gpsCount,
      distanceKm: stats.distanceKm,
      minutes: stats.minutes,
    },
    updatedAt: new Date().toISOString(),
    createdAt: existingIndex >= 0 ? tours[existingIndex].createdAt : new Date().toISOString(),
  };
  if (existingIndex >= 0) tours[existingIndex] = payload;
  else tours.push(payload);
  saveCurrentUserTours(tours.sort((a, b) => a.name.localeCompare(b.name, "fr", { numeric: true })));
  renderSavedTours();
  savedTourSelect.value = payload.id;
  updateTourRouteSummary();
  recordActivity("Tournee sauvegardee", `${payload.name} - ${payload.codes.length} client(s) - ${payload.stats.distanceKm || 0} km estimes`);
}

function renderTourPlanner() {
  if (!tourMap || !tourClientList || !tourSelectedList) return;
  const filteredClients = getFilteredTourClients();
  const allowedCodes = new Set(getTourClients().map((client) => client.code));
  selectedTourCodes = new Set(Array.from(selectedTourCodes).filter((code) => allowedCodes.has(code)));
  const selectedClients = getSelectedTourClients();
  const selectedCount = selectedClients.length;
  const mappedCount = filteredClients.filter((client) => getClientCoordinates(client)).length;
  if (tourMapTitle) {
    tourMapTitle.textContent = currentUser?.role === "admin" ? "Tous les clients France" : "Clients du secteur";
  }
  tourSelectionCount.textContent = `${selectedCount} client${selectedCount > 1 ? "s" : ""} sélectionné${selectedCount > 1 ? "s" : ""}`;
  tourResultCount.textContent = `${filteredClients.length} client${filteredClients.length > 1 ? "s" : ""} · ${mappedCount} sur la carte`;
  openGoogleMapsRoute.disabled = selectedCount === 0;
  openWazeRoute.disabled = selectedCount === 0;
  clearTourSelection.disabled = selectedCount === 0;

  tourSelectedList.innerHTML = selectedClients.length
    ? selectedClients.map((client, index) => `
        <article class="tour-route-item">
          <strong>${index + 1}. ${escapeHtml(client.name)}</strong>
          <span>${escapeHtml(getClientRouteAddress(client) || "Adresse incomplète")}</span>
          <button class="tour-remove" type="button" title="Retirer" data-tour-toggle="${escapeHtml(client.code)}">×</button>
        </article>
      `).join("")
    : `<div class="tour-empty">Cochez les clients à visiter. Ils apparaîtront ici dans l'ordre de sélection.</div>`;

  tourClientList.innerHTML = filteredClients.length
    ? filteredClients.map((client) => {
        const selected = selectedTourCodes.has(client.code);
        const address = getClientRouteAddress(client);
        const hasGps = Boolean(getClientCoordinates(client));
        return `
          <article class="tour-client-card ${selected ? "is-selected" : ""}" data-tour-card="${escapeHtml(client.code)}" data-tour-toggle="${escapeHtml(client.code)}">
            <label>
              <input type="checkbox" ${selected ? "checked" : ""} data-tour-toggle="${escapeHtml(client.code)}" />
              <span>
                <strong>${escapeHtml(client.name)}</strong>
                <small>${escapeHtml(client.code)} - ${escapeHtml(client.deliveryZip || client.billingZip || "")} ${escapeHtml(client.deliveryCity || client.billingCity || "")}</small>
              </span>
            </label>
            <em>${escapeHtml(address || "Adresse incomplète")}${hasGps ? "" : " · GPS à corriger"}</em>
          </article>
        `;
      }).join("")
    : `<div class="tour-empty">Aucun client trouvé. Effacez la recherche pour revenir à la liste complète.</div>`;

  renderInteractiveTourMap(filteredClients);
  renderSavedTours();
}

function toggleTourClient(code) {
  if (!code) return;
  if (selectedTourCodes.has(code)) selectedTourCodes.delete(code);
  else selectedTourCodes.add(code);
  renderTourPlanner();
  focusTourClientOnMap(code);
}

function clearTour() {
  selectedTourCodes = new Set();
  renderTourPlanner();
}

function openGoogleRoute() {
  const routeClients = getSelectedTourClients().filter((client) => getClientRouteAddress(client)).slice(0, 10);
  if (!routeClients.length) return;
  const addresses = routeClients.map(getClientRouteAddress);
  const destination = addresses[addresses.length - 1];
  const waypoints = addresses.slice(0, -1).join("|");
  const url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${encodeURIComponent(destination)}${waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ""}`;
  recordActivity("Tournée Google Maps ouverte", `${routeClients.length} client(s) - ${routeClients.map((client) => client.name).join(", ")}`);
  window.open(url, "_blank", "noopener");
}

function openWazeNextClient() {
  const client = getSelectedTourClients().find((item) => getClientRouteAddress(item));
  if (!client) return;
  const url = `https://waze.com/ul?q=${encodeURIComponent(getClientRouteAddress(client))}&navigate=yes`;
  recordActivity("Tournée Waze ouverte", `${client.name} (${client.code})`);
  window.open(url, "_blank", "noopener");
}

function setActiveTab(tabName) {
  const showHome = tabName === "home";
  const showClient360 = tabName === "client360";
  const showOrder = tabName === "order";
  const showQuote = tabName === "quote";
  const showExpenses = tabName === "expenses";
  const showNotes = tabName === "notes";
  const showTour = tabName === "tour";
  const showBacklog = tabName === "backlog";
  const showPrenet = tabName === "prenet";
  const showTarif = tabName === "tarif";
  const showPromotion = tabName === "promotion";
  const showAdmin = tabName === "admin";
  homeTab.classList.toggle("is-active", showHome);
  client360Tab.classList.toggle("is-active", showClient360);
  orderTab.classList.toggle("is-active", showOrder);
  quoteTab.classList.toggle("is-active", showQuote);
  expensesTab.classList.toggle("is-active", showExpenses);
  notesTab.classList.toggle("is-active", showNotes);
  tourTab.classList.toggle("is-active", showTour);
  backlogTab.classList.toggle("is-active", showBacklog);
  prenetTab.classList.toggle("is-active", showPrenet);
  tarifTab.classList.toggle("is-active", showTarif);
  promotionTab.classList.toggle("is-active", showPromotion);
  adminTab.classList.toggle("is-active", showAdmin);
  homeView.classList.toggle("is-hidden", !showHome);
  client360View.classList.toggle("is-hidden", !showClient360);
  orderView.classList.toggle("is-hidden", !showOrder);
  quoteView.classList.toggle("is-hidden", !showQuote);
  expensesView.classList.toggle("is-hidden", !showExpenses);
  notesView.classList.toggle("is-hidden", !showNotes);
  tourView.classList.toggle("is-hidden", !showTour);
  backlogView.classList.toggle("is-hidden", !showBacklog);
  prenetView.classList.toggle("is-hidden", !showPrenet);
  tarifView.classList.toggle("is-hidden", !showTarif);
  promotionView.classList.toggle("is-hidden", !showPromotion);
  adminView.classList.toggle("is-hidden", !showAdmin);

  if (!showAdmin && currentUser?.role !== "admin") {
    const names = { home: "Accueil", order: "Saisie commande", quote: "Demande de devis", expenses: "Frais", notes: "Prise de notes", tour: "Tournées", backlog: "Reliquats & reprise", prenet: "Prix nets", tarif: "Tarifs & Documents", promotion: "Promotions" };
    recordActivity("Onglet consulté", names[tabName] || tabName);
  }

  if (showClient360) {
    loadClientArticleStatsFromDrive();
    if (selectedClient360) selectClient360(selectedClient360);
    else renderClient360Empty();
    requestAnimationFrame(() => client360Search?.focus());
  }

  if (showOrder) {
    renderOrderHistory();
    requestAnimationFrame(() => clientSearch.focus());
  }

  if (showExpenses) {
    renderExpenses();
    requestAnimationFrame(() => expensesPeriod?.focus());
  }

  if (showNotes) {
    if (selectedNotesClient) renderClientNotes();
    else renderNotesReminderInbox();
    requestAnimationFrame(() => notesClientSearch.focus());
  }

  if (showTour) {
    renderTourPlanner();
    requestAnimationFrame(() => {
      tourMapInstance?.invalidateSize();
      tourSearch.focus();
    });
  }

  if (showBacklog) {
    loadBacklogItems();
    requestAnimationFrame(() => backlogSearch.focus());
  }

  if (showPrenet) {
    requestAnimationFrame(() => prenetClientSearch.focus());
  }

  if (showAdmin) loadAdminLogs();

  if (showPromotion) {
    renderPromotions();
    refreshPromotionsFromDrive();
  }
}

function csvValue(value) {
  return `"${value.toString().replaceAll('"', '""')}"`;
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(csvValue).join(";")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  downloadBlob(filename, blob);
}

function buildErpCsvRows(validLines) {
  const rows = ["Référence (SKU)"];
  validLines.forEach((line) => {
    rows.push(line.product.ref);
  });
  return rows;
}

function downloadErpCsv(filename, rows) {
  const csv = rows.join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  downloadBlob(filename, blob);
}

function pdfText(value) {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’]/g, "'")
    .replace(/[€]/g, "EUR")
    .replace(/[°]/g, "o")
    .replace(/\s+/g, " ")
    .trim();
}

function toUtf16Hex(value) {
  const text = pdfText(value).replace(/[\\()]/g, "\\$&");
  return `(${text})`;
}

function pdfEscapeNumber(value) {
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function createPdfBlob({ orderNumber, orderDate, validLines, note }) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 36;
  const pages = [];
  let commands = [];
  let y = pageHeight - margin;
  let pageNumber = 0;
  const pdfTotal = validLines.reduce((sum, line) => sum + line.product.price * line.qty, 0);

  function addPage() {
    if (commands.length) {
      drawFooter();
      pages.push(commands.join("\n"));
    }
    commands = [];
    pageNumber += 1;
    y = pageHeight - margin;
    drawHeader();
  }

  function ensureSpace(height) {
    if (y - height < 74) {
      addPage();
    }
  }

  function textAt(x, currentY, size, value, options = {}) {
    const font = options.bold ? "F2" : "F1";
    commands.push(`BT /${font} ${size} Tf ${pdfEscapeNumber(x)} ${pdfEscapeNumber(currentY)} Td ${toUtf16Hex(value)} Tj ET`);
  }

  function textLine(x, size, value, options = {}) {
    textAt(x, y, size, value, options);
    y -= options.lineHeight || 13;
  }

  function setColor(hex) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    commands.push(`${pdfEscapeNumber(r)} ${pdfEscapeNumber(g)} ${pdfEscapeNumber(b)} rg`);
  }

  function setStroke(hex) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.slice(0, 2), 16) / 255;
    const g = parseInt(clean.slice(2, 4), 16) / 255;
    const b = parseInt(clean.slice(4, 6), 16) / 255;
    commands.push(`${pdfEscapeNumber(r)} ${pdfEscapeNumber(g)} ${pdfEscapeNumber(b)} RG`);
  }

  function fillRect(x, rectY, width, height, color) {
    setColor(color);
    commands.push(`${pdfEscapeNumber(x)} ${pdfEscapeNumber(rectY)} ${pdfEscapeNumber(width)} ${pdfEscapeNumber(height)} re f`);
    setColor("#1E1E22");
  }

  function strokeRect(x, rectY, width, height, color = "#DEDFE3") {
    setStroke(color);
    commands.push(`${pdfEscapeNumber(x)} ${pdfEscapeNumber(rectY)} ${pdfEscapeNumber(width)} ${pdfEscapeNumber(height)} re S`);
    setStroke("#1E1E22");
  }

  function hline(x1, x2, currentY, color = "#DEDFE3") {
    setStroke(color);
    commands.push(`${pdfEscapeNumber(x1)} ${pdfEscapeNumber(currentY)} m ${pdfEscapeNumber(x2)} ${pdfEscapeNumber(currentY)} l S`);
    setStroke("#1E1E22");
  }

  function drawHeader() {
    fillRect(margin, pageHeight - 50, 76, 4, "#E30613");
    textAt(margin, pageHeight - 30, 18, "Schuller Eh'klar", { bold: true });
    textAt(margin, pageHeight - 45, 7.5, "BROSSERIE ET OUTILLAGE POUR PEINTRES");
    textAt(margin, pageHeight - 58, 7.5, "4 rue Jean Marie Lhen - 67560 ROSHEIM - Tel. 03 88 04 68 04");
    textAt(margin, pageHeight - 70, 7.5, "www.schuller.eu - france@schuller.eu");

    textAt(pageWidth - 198, pageHeight - 30, 18, "BON DE COMMANDE", { bold: true });
    fillRect(pageWidth - 198, pageHeight - 54, 162, 22, "#F5F5F5");
    strokeRect(pageWidth - 198, pageHeight - 54, 162, 22);
    textAt(pageWidth - 190, pageHeight - 47, 8.5, `N° ${orderNumber}`, { bold: true });
    textAt(pageWidth - 190, pageHeight - 66, 8.5, `Date : ${orderDate}`);
    hline(margin, pageWidth - margin, pageHeight - 82, "#E30613");
    y = pageHeight - 104;
  }

  function drawFooter() {
    hline(margin, pageWidth - margin, 48, "#DEDFE3");
    textAt(margin, 34, 6.5, "SARL au capital de 24.000 Euros - RCS Saverne 2002 B 113 - SIRET 429542392 00031 - TVA FR36429542392");
    textAt(margin, 24, 6.5, "Banque CCM Strasbourg FR76 1027 8010 0400 0576 5794 597 - BIC CMCIFR2A");
    textAt(pageWidth - 58, 24, 7, `${pageNumber}`);
  }

  function drawInfoBoxes() {
    const boxY = y - 96;
    const boxW = (pageWidth - margin * 2 - 14) / 2;
    fillRect(margin, boxY + 74, boxW, 22, "#1E1E22");
    fillRect(margin + boxW + 14, boxY + 74, boxW, 22, "#1E1E22");
    strokeRect(margin, boxY, boxW, 96);
    strokeRect(margin + boxW + 14, boxY, boxW, 96);
    setColor("#FFFFFF");
    textAt(margin + 10, boxY + 82, 9, "Adresse de facturation", { bold: true });
    textAt(margin + boxW + 24, boxY + 82, 9, "Adresse de livraison", { bold: true });
    setColor("#1E1E22");

    const leftX = margin + 10;
    const rightX = margin + boxW + 24;
    textAt(leftX, boxY + 60, 10, selectedClient.name, { bold: true });
    textAt(leftX, boxY + 45, 8, selectedClient.billingAddress || "-");
    textAt(leftX, boxY + 33, 8, `${selectedClient.billingZip} ${selectedClient.billingCity}`);
    textAt(leftX, boxY + 18, 8, `Code client : ${selectedClient.code}`);
    textAt(leftX, boxY + 7, 8, selectedClient.sector || "");

    textAt(rightX, boxY + 60, 10, selectedClient.name, { bold: true });
    textAt(rightX, boxY + 45, 8, selectedClient.deliveryAddress || "-");
    textAt(rightX, boxY + 33, 8, `${selectedClient.deliveryZip} ${selectedClient.deliveryCity}`);
    textAt(rightX, boxY + 18, 8, selectedClient.phone || "");
    textAt(rightX, boxY + 7, 8, selectedClient.email || "");
    y = boxY - 26;
  }

  function drawTableHeader() {
    fillRect(margin, y - 4, pageWidth - margin * 2, 21, "#E30613");
    setColor("#FFFFFF");
    textAt(margin + 6, y + 3, 7.5, "Réf.", { bold: true });
    textAt(88, y + 3, 7.5, "Gencod", { bold: true });
    textAt(172, y + 3, 7.5, "Désignation", { bold: true });
    textAt(382, y + 3, 7.5, "UDV", { bold: true });
    textAt(417, y + 3, 7.5, "Qté", { bold: true });
    textAt(456, y + 3, 7.5, "Prix U.", { bold: true });
    textAt(515, y + 3, 7.5, "Total", { bold: true });
    setColor("#1E1E22");
    y -= 22;
  }

  function drawProductRow(line, index) {
    ensureSpace(24);
    if (y > pageHeight - 110) {
      drawTableHeader();
    }
    if (index % 2 === 1) {
      fillRect(margin, y - 8, pageWidth - margin * 2, 20, "#F8F8F9");
    }
    const lineTotal = line.product.price * line.qty;
    textAt(margin + 6, y, 7.5, line.product.ref);
    textAt(88, y, 7.2, line.product.gencod);
    textAt(172, y, 7.6, line.product.name.slice(0, 42), { bold: true });
    textAt(386, y, 7.5, line.product.udv || "-");
    textAt(419, y, 7.5, line.qty);
    textAt(456, y, 7.5, formatter.format(line.product.price));
    textAt(515, y, 7.5, formatter.format(lineTotal));
    y -= 20;
    hline(margin, pageWidth - margin, y + 7, "#E5E5E8");
  }

  addPage();
  drawInfoBoxes();
  textLine(margin, 12, "Produits commandés", { bold: true, lineHeight: 17 });
  drawTableHeader();
  validLines.forEach((line, index) => drawProductRow(line, index));

  y -= 10;
  ensureSpace(92);
  const recapX = pageWidth - 210;
  fillRect(recapX, y - 55, 174, 66, "#F5F5F5");
  strokeRect(recapX, y - 55, 174, 66);
  fillRect(recapX, y - 55, 4, 66, "#E30613");
  textAt(recapX + 14, y - 6, 9, "Récapitulatif", { bold: true });
  textAt(recapX + 14, y - 25, 8, "Total HT");
  textAt(recapX + 90, y - 25, 8, formatter.format(pdfTotal), { bold: true });
  textAt(recapX + 14, y - 42, 8, "Total TTC");
  textAt(recapX + 90, y - 42, 8, formatter.format(pdfTotal), { bold: true });
  y -= 76;

  if (note) {
    ensureSpace(46);
    fillRect(margin, y - 28, pageWidth - margin * 2 - 190, 38, "#F8F8F9");
    strokeRect(margin, y - 28, pageWidth - margin * 2 - 190, 38);
    textAt(margin + 10, y - 4, 8, "Note", { bold: true });
    textAt(margin + 10, y - 18, 8, note.slice(0, 95));
    y -= 48;
  }

  textAt(margin, 74, 7, "Tous nos prix sont indiqués en Euros. Prix nets valables uniquement pour cette commande.");
  textAt(margin, 64, 7, "Document généré automatiquement par l'outil de saisie de commande Schuller Eh'klar France.");
  setColor("#1E1E22");

  addPage();

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };

  const fontRegular = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const fontBold = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageRefs = [];

  pages.forEach((pageCommands) => {
    const stream = pageCommands;
    const contentRef = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const pageRef = addObject(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${contentRef} 0 R >>`
    );
    pageRefs.push(pageRef);
  });

  const pagesRef = addObject(`<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(" ")}] /Count ${pageRefs.length} >>`);
  pageRefs.forEach((pageRef) => {
    objects[pageRef - 1] = objects[pageRef - 1].replace("/Parent 0 0 R", `/Parent ${pagesRef} 0 R`);
  });
  const catalogRef = addObject(`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogRef} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function generateOrderFiles() {
  const validLines = getValidLines();

  if (!selectedClient) {
    alert("Selectionne d'abord un client.");
    clientSearch.focus();
    return;
  }

  if (!validLines.length) {
    alert("Ajoute au moins un produit valide.");
    return;
  }

  const orderDate = new Date().toLocaleDateString("fr-FR");
  const orderNumber = `CMD-${Date.now().toString().slice(-6)}`;
  const note = orderNote.value.trim();
  const safeClientCode = selectedClient.code.replace(/[^a-z0-9_-]/gi, "_");
  const baseName = `${orderNumber}_${safeClientCode}`;
  const orderSnapshot = buildOrderSnapshot({ orderNumber, orderDate, note, validLines });
  const pdfBlob = createPdfBlob({ orderNumber, orderDate, validLines, note });

  storeOrder(orderSnapshot);
  downloadErpCsv(`${baseName}_ERP_REFERENCES.csv`, buildErpCsvRows(validLines));
  downloadBlob(`${baseName}_COMMANDE_COMPLETE.pdf`, pdfBlob);
}

function resetOrder() {
  selectedClient = null;
  lines = [];
  clientSearch.value = "";
  orderNote.value = "";
  clientStatus.textContent = "Client non selectionne";
  clientStatus.classList.remove("is-ready");
  selectedClientBox.innerHTML = "<span>Aucun client choisi pour le moment.</span>";
  addLine();
  updateSummary();
}

function refreshNotesHistoryFromCurrentMode() {
  if (notesHistoryMode === "all") {
    renderAllNotes();
  } else if (selectedNotesClient) {
    renderClientNotes();
  } else {
    renderNotesReminderInbox();
  }
}

function updateOfflineStatus() {
  if (!offlineStatus) return;
  const online = navigator.onLine !== false;
  offlineStatus.textContent = online ? "En ligne" : "Hors ligne";
  offlineStatus.classList.toggle("is-online", online);
  offlineStatus.classList.toggle("is-offline", !online);
}

clientSearch.addEventListener("input", (event) => renderClientSuggestions(event.target.value));
document.querySelector("#addLine").addEventListener("click", addLine);
document.querySelector("#generateOrderFiles").addEventListener("click", generateOrderFiles);
homeTab.addEventListener("click", () => setActiveTab("home"));
client360Tab.addEventListener("click", () => setActiveTab("client360"));
orderTab.addEventListener("click", () => setActiveTab("order"));
quoteTab.addEventListener("click", () => setActiveTab("quote"));
expensesTab.addEventListener("click", () => setActiveTab("expenses"));
notesTab.addEventListener("click", () => setActiveTab("notes"));
tourTab.addEventListener("click", () => setActiveTab("tour"));
backlogTab.addEventListener("click", () => setActiveTab("backlog"));
prenetTab.addEventListener("click", () => setActiveTab("prenet"));
tarifTab.addEventListener("click", () => setActiveTab("tarif"));
promotionTab.addEventListener("click", () => setActiveTab("promotion"));
adminTab.addEventListener("click", () => setActiveTab("admin"));
refreshAdminLogs.addEventListener("click", loadAdminLogs);
adminScopeFilter.addEventListener("change", renderAdminDashboard);
resetAdminDashboard.addEventListener("click", resetAdminLogDisplay);
adminOpenTourButton.addEventListener("click", () => setActiveTab("tour"));
document.querySelectorAll("[data-tablet-tab]").forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tabletTab));
});
refreshBacklog.addEventListener("click", loadBacklogItems);
backlogSearch.addEventListener("input", renderBacklog);
backlogTypeFilter.addEventListener("change", renderBacklog);
backlogBody.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-backlog-done]");
  if (!checkbox) return;
  setBacklogDone(checkbox.dataset.backlogDone, checkbox.checked);
  renderBacklog();
});
backlogBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-backlog-hide]");
  if (!button) return;
  hideBacklogItem(button.dataset.backlogHide);
  renderBacklog();
});
clearHistoryOrders.addEventListener("click", clearCurrentUserOrders);
client360Search?.addEventListener("input", (event) => renderClient360Suggestions(event.target.value));
document.querySelector("#client360Grid")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-client360-open]");
  if (!button) return;
  openClient360LinkedTab(button.dataset.client360Open, button.dataset.orderId || "");
});
quoteClientSearch.addEventListener("input", (event) => renderQuoteClientSuggestions(event.target.value));
addQuoteLine.addEventListener("click", addQuoteLineItem);
sendQuoteRequest.addEventListener("click", sendQuoteRequestDraft);
quoteHistorySearch?.addEventListener("input", renderQuoteHistory);
quoteHistoryList?.addEventListener("click", (event) => {
  const statusButton = event.target.closest("[data-quote-status]");
  if (statusButton) {
    updateQuoteHistoryStatus(statusButton.dataset.quoteStatus, statusButton.dataset.status);
    return;
  }
  const deleteButton = event.target.closest("[data-quote-delete]");
  if (deleteButton) deleteQuoteHistoryItem(deleteButton.dataset.quoteDelete);
});
quoteLines.addEventListener("input", (event) => {
  const row = event.target.closest("[data-quote-line]");
  const field = event.target.dataset.quoteField;
  if (!row || !field) return;
  updateQuoteLine(row.dataset.quoteLine, field, event.target.value);
});
quoteLines.addEventListener("change", (event) => {
  const row = event.target.closest("[data-quote-line]");
  if (!row || event.target.dataset.quoteField !== "ref") return;
  applyQuoteReference(row.dataset.quoteLine, event.target.value);
});
quoteLines.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-quote-line]");
  if (!button) return;
  removeQuoteLineItem(button.dataset.removeQuoteLine);
});
addExpenseLine.addEventListener("click", addExpenseLineItem);
newExpenseDraft.addEventListener("click", resetExpenses);
saveExpenseDraft.addEventListener("click", saveCurrentExpenseDraft);
sendExpenseReport.addEventListener("click", sendExpenseReportDraft);
expenseHistorySearch.addEventListener("input", renderExpenseHistory);
expensesLines.addEventListener("input", (event) => {
  const row = event.target.closest("[data-expense-line]");
  const field = event.target.dataset.expenseField;
  if (!row || !field || field === "receipt") return;
  setExpenseLineField(row.dataset.expenseLine, field, event.target.value);
});
expensesLines.addEventListener("change", (event) => {
  const row = event.target.closest("[data-expense-line]");
  const field = event.target.dataset.expenseField;
  if (!row || !field) return;
  const line = expenseLineItems.find((item) => item.id === row.dataset.expenseLine);
  if (!line) return;
  if (field === "receipt") {
    const file = event.target.files?.[0] || null;
    line.receiptFile = file;
    line.receiptName = file ? file.name : "";
    line.receiptDataUrl = "";
    line.receiptMimeType = "";
    renderExpenses();
    return;
  }
  updateExpenseLine(line.id, field, event.target.value);
});
expensesLines.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-expense-line]");
  if (!button) return;
  removeExpenseLine(button.dataset.removeExpenseLine);
});
expenseHistoryList.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-expense-draft]");
  if (openButton) {
    openExpenseDraft(openButton.dataset.openExpenseDraft);
    return;
  }
  const renameButton = event.target.closest("[data-rename-expense-draft]");
  if (renameButton) {
    renameExpenseDraft(renameButton.dataset.renameExpenseDraft);
    return;
  }
  const deleteButton = event.target.closest("[data-delete-expense-draft]");
  if (deleteButton) deleteExpenseDraft(deleteButton.dataset.deleteExpenseDraft);
});
notesClientSearch.addEventListener("input", (event) => renderNotesSuggestions(event.target.value));
showAllNotesButton.addEventListener("click", renderAllNotes);
notesForm.addEventListener("submit", saveClientNote);
cancelEditNote.addEventListener("click", cancelNoteEdit);
startVoiceNote.addEventListener("click", toggleVoiceNote);
finishVisitButton.addEventListener("click", finishVisit);
exportVisitReportButton.addEventListener("click", () => exportVisitReport(false));
reportStartDate.addEventListener("change", refreshNotesHistoryFromCurrentMode);
reportEndDate.addEventListener("change", refreshNotesHistoryFromCurrentMode);
exportPeriodReportButton.addEventListener("click", () => exportVisitReport(notesHistoryMode === "client" && Boolean(selectedNotesClient)));
sendVisitReportButton.addEventListener("click", () => sendVisitReport(notesHistoryMode === "client" && Boolean(selectedNotesClient)));
noteReminderEnabled.addEventListener("change", () => setReminderFieldsEnabled(noteReminderEnabled.checked));
notesForm.addEventListener("click", (event) => {
  const templateButton = event.target.closest("[data-note-template]");
  if (!templateButton) return;
  const text = templateButton.dataset.noteTemplate;
  const separator = notesText.value.trim() ? "\n" : "";
  notesText.value = `${notesText.value.trimEnd()}${separator}${text}`;
  if (templateButton.dataset.templateReminder === "1") {
    setReminderFieldsEnabled(true);
    if (!noteReminderDate.value) {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      noteReminderDate.value = date.toISOString().slice(0, 10);
    }
    if (!noteReminderText.value.trim()) noteReminderText.value = "Relancer le client";
  }
  notesText.focus();
});
notesList.addEventListener("click", (event) => {
  const editId = event.target.closest("[data-edit-note]")?.dataset.editNote;
  const deleteId = event.target.closest("[data-delete-note]")?.dataset.deleteNote;
  const doneId = event.target.closest("[data-done-reminder]")?.dataset.doneReminder;
  if (editId) editClientNote(editId);
  if (deleteId) deleteClientNote(deleteId);
  if (doneId) markReminderDone(doneId);
});
notesReminderFocus.addEventListener("click", (event) => {
  const openId = event.target.closest("[data-open-reminder]")?.dataset.openReminder;
  const doneId = event.target.closest("[data-done-reminder]")?.dataset.doneReminder;
  if (openId) openReminderNote(openId);
  if (doneId) markReminderDone(doneId);
});
tourSearch.addEventListener("input", renderTourPlanner);
tourClientList.addEventListener("click", (event) => {
  const code = event.target.closest("[data-tour-toggle]")?.dataset.tourToggle;
  if (code) toggleTourClient(code);
});
tourMap.addEventListener("click", (event) => {
  const code = event.target.closest("[data-tour-toggle]")?.dataset.tourToggle;
  if (code) toggleTourClient(code);
});
tourSelectedList.addEventListener("click", (event) => {
  const code = event.target.closest("[data-tour-toggle]")?.dataset.tourToggle;
  if (code) toggleTourClient(code);
});
clearTourSelection.addEventListener("click", clearTour);
openGoogleMapsRoute.addEventListener("click", openGoogleRoute);
openWazeRoute.addEventListener("click", openWazeNextClient);
saveTourButton.addEventListener("click", saveCurrentTour);
loadTourButton.addEventListener("click", loadSavedTour);
deleteTourButton.addEventListener("click", deleteSavedTour);
savedTourSelect.addEventListener("change", () => {
  const tour = getCurrentUserSavedTours().find((item) => item.id === savedTourSelect.value);
  if (tour) tourName.value = tour.name;
});
homeRemindersList.addEventListener("click", (event) => {
  const openId = event.target.closest("[data-open-reminder]")?.dataset.openReminder;
  const doneId = event.target.closest("[data-done-reminder]")?.dataset.doneReminder;
  if (openId) openReminderNote(openId);
  if (doneId) markReminderDone(doneId);
});
prenetClientSearch.addEventListener("input", (event) => renderPrenetSuggestions(event.target.value));
prenetResult.addEventListener("input", (event) => {
  if (event.target?.id !== "prenetReferenceSearch" || !selectedPrenetClient) return;
  const results = document.querySelector("#prenetReferenceResults");
  if (results) results.innerHTML = renderPrenetReferenceResults(selectedPrenetClient, event.target.value);
});
selectTarif5010.addEventListener("click", () => openTarifForm("tarif-50-plus-10"));
selectTarifBase.addEventListener("click", () => openTarifForm("tarif-de-base"));
selectCatalogue2026.addEventListener("click", () => openTarifForm("catalogue-2026"));
tarifSendForm.addEventListener("submit", sendTarif);
sendSelectedPromotions.addEventListener("click", () => sendPromotions());
promotionGrid.addEventListener("click", (event) => {
  const previewId = event.target.closest("[data-preview-promotion]")?.dataset.previewPromotion;
  const sendId = event.target.closest("[data-send-promotion]")?.dataset.sendPromotion;
  if (previewId) openPromotionPreview(previewId);
  if (sendId) sendPromotions(sendId);
});
closePromotionModal.addEventListener("click", closePromotionPreview);
displayModeToggle.addEventListener("click", toggleDisplayMode);
globalSearchInput?.addEventListener("input", renderGlobalSearchResults);
globalSearchResults?.addEventListener("click", (event) => {
  const resultButton = event.target.closest("[data-global-result]");
  if (!resultButton) return;
  openGlobalSearchResult(Number(resultButton.dataset.globalResult));
});
globalSearchInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const first = globalSearchResults?._results?.[0];
  if (!first) return;
  event.preventDefault();
  openGlobalSearchResult(0);
});
visitNextAction?.addEventListener("change", setVisitActionVisibility);
logoutButton.addEventListener("click", showLogin);
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitLogin();
});
forgotPasswordButton.addEventListener("click", openPasswordReset);
backToLoginButton.addEventListener("click", closePasswordReset);
passwordResetRequestForm.addEventListener("submit", requestPasswordReset);
passwordResetConfirmForm.addEventListener("submit", confirmPasswordReset);
loginPassword.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitLogin();
  }
});
loginId.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loginPassword.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-block")) {
    clientSuggestions.classList.remove("is-open");
  }
  if (!event.target.closest(".prenet-search-block")) {
    prenetClientSuggestions.classList.remove("is-open");
  }
  if (!event.target.closest(".notes-search")) {
    notesClientSuggestions.classList.remove("is-open");
  }
  if (!event.target.closest(".global-search")) {
    globalSearchResults?.classList.add("is-hidden");
  }
  if (!event.target.closest(".client360-search")) {
    client360Suggestions?.classList.remove("is-open");
  }
});

setupVoiceNotes();
updateOfflineStatus();
window.addEventListener("online", updateOfflineStatus);
window.addEventListener("offline", updateOfflineStatus);
setDisplayMode(localStorage.getItem(displayModeStorageKey) === "tablet" ? "tablet" : "pc");
setVisitActionVisibility();
restoreSession();
