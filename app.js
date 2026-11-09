/* ===================================================================
 *  app.js – WebView MiniApp SuperSDK Bridge Agent
 *
 *  - postToMiniapp()  : safe cross-platform postMessage helper
 *  - functionCallback : global dispatcher called by native host
 *  - 8 button handlers: GetIdentity, GetPhoneNumber, GetMailAddress,
 *    GetCustomerNumber, GetCommercialCustomerNumber, GetLocation,
 *    OpenMap, sendPayment
 * =================================================================== */

"use strict";

// -------------------------------------------------------------------
// 1.  Safe postMessage helper (iOS / Android)
// -------------------------------------------------------------------
function postToMiniapp(payload) {
  const message = JSON.stringify(payload);

  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.miniapp) {
    // iOS
    window.webkit.messageHandlers.miniapp.postMessage(message);
    console.log("[Bridge] iOS postMessage sent:", message);
    return;
  }

  if (window.miniapp && typeof window.miniapp.postMessage === "function") {
    // Android
    window.miniapp.postMessage(message);
    console.log("[Bridge] Android postMessage sent:", message);
    return;
  }

  const errorMsg = "Miniapp bridge not found (no iOS/Android handler available).";
  console.error("[Bridge]", errorMsg);
  appendError(errorMsg);
}

// -------------------------------------------------------------------
// 2.  Error log helper
// -------------------------------------------------------------------
function appendError(message) {
  const el = document.getElementById("errorLog");
  if (!el) return;
  const entry = document.createElement("div");
  entry.textContent = "[" + new Date().toLocaleTimeString() + "] " + message;
  el.appendChild(entry);
}

// -------------------------------------------------------------------
// 3.  Result display helper
// -------------------------------------------------------------------
function showResult(elementId, data) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = JSON.stringify(data, null, 2);
}

// -------------------------------------------------------------------
// 4.  Global functionCallback – called by native SuperSDK host
// -------------------------------------------------------------------
function functionCallback(functionName, result) {
  console.log("[Bridge] functionCallback received:", functionName, result);

  let parsed;
  try {
    parsed = JSON.parse(result);
  } catch (e) {
    console.error("[Bridge] Callback parse error:", e, result);
    appendError("Callback parse error for " + functionName + ": " + e.message);
    return;
  }

  // If the host returned an error, log it globally
  if (!parsed.isSuccess) {
    const errMsg = (parsed.error && parsed.error.message) || "Unknown error";
    appendError(functionName + " failed: " + errMsg);
  }

  switch (functionName) {
    case "GetIdentity":
      GetIdentityCallback(parsed);
      break;
    case "GetPhoneNumber":
      GetPhoneNumberCallback(parsed);
      break;
    case "GetMailAddress":
      GetMailAddressCallback(parsed);
      break;
    case "GetCustomerNumber":
      GetCustomerNumberCallback(parsed);
      break;
    case "GetCommercialCustomerNumber":
      GetCommercialCustomerNumberCallback(parsed);
      break;
    case "GetLocation":
      GetLocationCallback(parsed);
      break;
    // NOTE: OpenMap is fire-and-forget — NO case here
    case "sendPayment":
      sendPaymentCallback(parsed);
      break;
    default:
      console.warn("[Bridge] Unhandled callback functionName:", functionName, parsed);
      appendError("Unhandled callback: " + functionName);
  }
}

// -------------------------------------------------------------------
// 5.  Individual Callback Handlers
// -------------------------------------------------------------------

// 5a. GetIdentity – Get* pattern: isSuccess && retVal.isApproved
function GetIdentityCallback(result) {
  try {
    if (result.isSuccess && result.retVal && result.retVal.isApproved) {
      const data = result.retVal.funcRetVal || {};
      showResult("resultIdentity", data);
    } else {
      showResult("resultIdentity", {
        error: "Not approved or request failed",
        detail: result
      });
    }
  } catch (error) {
    console.error("[Bridge] GetIdentityCallback error:", error);
    appendError("GetIdentityCallback: " + error.message);
  }
}

// 5b. GetPhoneNumber – Get* pattern
function GetPhoneNumberCallback(result) {
  try {
    if (result.isSuccess && result.retVal && result.retVal.isApproved) {
      const data = result.retVal.funcRetVal || {};
      showResult("resultPhoneNumber", data);
    } else {
      showResult("resultPhoneNumber", {
        error: "Not approved or request failed",
        detail: result
      });
    }
  } catch (error) {
    console.error("[Bridge] GetPhoneNumberCallback error:", error);
    appendError("GetPhoneNumberCallback: " + error.message);
  }
}

// 5c. GetMailAddress – Get* pattern
function GetMailAddressCallback(result) {
  try {
    if (result.isSuccess && result.retVal && result.retVal.isApproved) {
      const data = result.retVal.funcRetVal || {};
      showResult("resultMailAddress", data);
    } else {
      showResult("resultMailAddress", {
        error: "Not approved or request failed",
        detail: result
      });
    }
  } catch (error) {
    console.error("[Bridge] GetMailAddressCallback error:", error);
    appendError("GetMailAddressCallback: " + error.message);
  }
}

// 5d. GetCustomerNumber – Get* pattern
function GetCustomerNumberCallback(result) {
  try {
    if (result.isSuccess && result.retVal && result.retVal.isApproved) {
      const data = result.retVal.funcRetVal || {};
      showResult("resultCustomerNumber", data);
    } else {
      showResult("resultCustomerNumber", {
        error: "Not approved or request failed",
        detail: result
      });
    }
  } catch (error) {
    console.error("[Bridge] GetCustomerNumberCallback error:", error);
    appendError("GetCustomerNumberCallback: " + error.message);
  }
}

// 5e. GetCommercialCustomerNumber – Get* pattern
function GetCommercialCustomerNumberCallback(result) {
  try {
    if (result.isSuccess && result.retVal && result.retVal.isApproved) {
      const data = result.retVal.funcRetVal || {};
      showResult("resultCommercialCustomerNumber", data);
    } else {
      showResult("resultCommercialCustomerNumber", {
        error: "Not approved or request failed",
        detail: result
      });
    }
  } catch (error) {
    console.error("[Bridge] GetCommercialCustomerNumberCallback error:", error);
    appendError("GetCommercialCustomerNumberCallback: " + error.message);
  }
}

// 5f. GetLocation – Get* pattern
function GetLocationCallback(result) {
  try {
    if (result.isSuccess && result.retVal && result.retVal.isApproved) {
      const data = result.retVal.funcRetVal || {};
      showResult("resultLocation", data);
    } else {
      showResult("resultLocation", {
        error: "Not approved or request failed",
        detail: result
      });
    }
  } catch (error) {
    console.error("[Bridge] GetLocationCallback error:", error);
    appendError("GetLocationCallback: " + error.message);
  }
}

// 5g. sendPayment – sendPayment pattern: isSuccess only (no isApproved check)
function sendPaymentCallback(result) {
  try {
    if (result.isSuccess) {
      // sendPayment result is in retVal; display as JSON string
      showResult("resultSendPayment", result.retVal);
    } else {
      showResult("resultSendPayment", {
        error: "Payment failed",
        detail: result
      });
    }
  } catch (error) {
    console.error("[Bridge] sendPaymentCallback error:", error);
    appendError("sendPaymentCallback: " + error.message);
  }
}

// -------------------------------------------------------------------
// 6.  Button Event Handlers
// -------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function () {
  // 6a. GetIdentity
  document.getElementById("btnGetIdentity").addEventListener("click", function () {
    postToMiniapp({
      callFunction: {
        functionName: "GetIdentity",
        param: {}
      }
    });
  });

  // 6b. GetPhoneNumber
  document.getElementById("btnGetPhoneNumber").addEventListener("click", function () {
    postToMiniapp({
      callFunction: {
        functionName: "GetPhoneNumber",
        param: {}
      }
    });
  });

  // 6c. GetMailAddress
  document.getElementById("btnGetMailAddress").addEventListener("click", function () {
    postToMiniapp({
      callFunction: {
        functionName: "GetMailAddress",
        param: {}
      }
    });
  });

  // 6d. GetCustomerNumber
  document.getElementById("btnGetCustomerNumber").addEventListener("click", function () {
    postToMiniapp({
      callFunction: {
        functionName: "GetCustomerNumber",
        param: {}
      }
    });
  });

  // 6e. GetCommercialCustomerNumber
  document.getElementById("btnGetCommercialCustomerNumber").addEventListener("click", function () {
    postToMiniapp({
      callFunction: {
        functionName: "GetCommercialCustomerNumber",
        param: {}
      }
    });
  });

  // 6f. GetLocation
  document.getElementById("btnGetLocation").addEventListener("click", function () {
    postToMiniapp({
      callFunction: {
        functionName: "GetLocation",
        param: {}
      }
    });
  });

  // 6g. OpenMap – fire-and-forget, no callback expected
  document.getElementById("btnOpenMap").addEventListener("click", function () {
    postToMiniapp({
      callFunction: {
        functionName: "OpenMap",
        param: {
          latitude: 41.55,
          longitude: 29.33
        }
      }
    });
    showResult("resultOpenMap", { status: "OpenMap request sent (fire-and-forget)" });
  });

  // 6h. sendPayment
  document.getElementById("btnSendPayment").addEventListener("click", function () {
    postToMiniapp({
      callFunction: {
        functionName: "sendPayment",
        param: {
          amount: 100.45,
          orderId: "343432789721256274"
        }
      }
    });
  });
});