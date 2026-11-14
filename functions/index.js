const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");

initializeApp();

const database = getDatabase();
const ADMIN_UID = process.env.ADMIN_UID || "";

function requireUser(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Faça login para continuar.");
  }
  return request.auth.uid;
}

function requireAdmin(request) {
  const uid = requireUser(request);
  if (!ADMIN_UID || uid !== ADMIN_UID) {
    throw new HttpsError("permission-denied", "Acesso administrativo não autorizado.");
  }
  return uid;
}

function validateAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 1 || amount > 100000) {
    throw new HttpsError("invalid-argument", "Informe um valor entre R$ 1,00 e R$ 100.000,00.");
  }
  return Math.round(amount * 100) / 100;
}

// Registra apenas uma solicitação. Não credita saldo nem confirma pagamento.
exports.createDepositRequest = onCall(async (request) => {
  const uid = requireUser(request);
  const amount = validateAmount(request.data && request.data.amount);
  const ref = database.ref("depositRequests").push();
  const record = {
    uid,
    amount,
    currency: "BRL",
    status: "pending_review",
    createdAt: Date.now()
  };
  await ref.set(record);
  return { requestId: ref.key, status: record.status };
});

// Registra apenas um pedido de saque para análise. Não envia dinheiro.
exports.createWithdrawalRequest = onCall(async (request) => {
  const uid = requireUser(request);
  const amount = validateAmount(request.data && request.data.amount);
  const ref = database.ref("withdrawalRequests").push();
  const record = {
    uid,
    amount,
    currency: "BRL",
    status: "pending_review",
    createdAt: Date.now()
  };
  await ref.set(record);
  return { requestId: ref.key, status: record.status };
});

// Registra a conferência manual do administrador. Não altera saldo nem executa pagamento.
exports.reviewDepositRequest = onCall(async (request) => {
  const adminUid = requireAdmin(request);
  const requestId = String((request.data && request.data.requestId) || "");
  const decision = String((request.data && request.data.decision) || "");
  const bankReference = String((request.data && request.data.bankReference) || "").trim();

  if (!/^[A-Za-z0-9_-]{8,100}$/.test(requestId)) {
    throw new HttpsError("invalid-argument", "Identificador de solicitação inválido.");
  }
  if (!["verified", "rejected"].includes(decision)) {
    throw new HttpsError("invalid-argument", "Decisão inválida.");
  }
  if (decision === "verified" && bankReference.length < 4) {
    throw new HttpsError("invalid-argument", "Informe a referência da conferência bancária.");
  }

  const ref = database.ref("depositRequests").child(requestId);
  let outcome = "not_found";
  await ref.transaction((current) => {
    if (!current || current.status !== "pending_review") return;
    current.status = decision;
    current.reviewedAt = Date.now();
    current.reviewedBy = adminUid;
    current.bankReference = decision === "verified" ? bankReference.slice(0, 120) : null;
    outcome = "updated";
    return current;
  });

  if (outcome !== "updated") {
    throw new HttpsError("failed-precondition", "Solicitação inexistente ou já analisada.");
  }
  await database.ref("auditLog").push({
    action: "deposit_request_reviewed",
    requestId,
    decision,
    adminUid,
    createdAt: Date.now()
  });
  return { requestId, status: decision, balanceChanged: false };
});
