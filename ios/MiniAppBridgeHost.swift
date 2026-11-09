//
//  MiniAppBridgeHost.swift
//  SuperSDK – Native iOS Host Skeleton
//
//  This file mirrors the callMethod switch on the native side.
//  Every functionName handled in app.js must have a corresponding case here.
//
//  Usage:
//    - Called from WKUserContentController when the web layer sends
//      window.webkit.messageHandlers.miniapp.postMessage(...)
//    - The incoming message is a JSON string; parse it, extract
//      callFunction.functionName and callFunction.param, then dispatch.
//    - On success: callback([...])   → wrapped as { isSuccess: true, retVal: { ... } }
//    - On failure: errorCallback([:]) → wrapped as { isSuccess: false, error: { message, code } }
//

import Foundation

// MARK: - Bridge Call Dispatcher

func callMethod(
    functionName: String?,
    param: [String: Any]?,
    callback: @escaping ([String: Any]) -> Void,
    errorCallback: @escaping ([String: Any]) -> Void
) {
    guard let functionName else {
        errorCallback([
            "message": "functionName is empty",
            "code": "78"
        ])
        return
    }

    switch functionName {

    // -------------------------------------------------------------------
    // GetIdentity
    // -------------------------------------------------------------------
    case "GetIdentity":
        // TODO: Replace with real SDK call
        callback([
            "Name": "Test",
            "Surname": "User",
            "TCKN": "11111111111"
        ])

    // -------------------------------------------------------------------
    // GetPhoneNumber
    // -------------------------------------------------------------------
    case "GetPhoneNumber":
        // TODO: Replace with real SDK call
        callback([
            "PhoneNumber": "905551112233"
        ])

    // -------------------------------------------------------------------
    // GetMailAddress
    // -------------------------------------------------------------------
    case "GetMailAddress":
        // TODO: Replace with real SDK call
        callback([
            "Email": "test@example.com"
        ])

    // -------------------------------------------------------------------
    // GetCustomerNumber
    // -------------------------------------------------------------------
    case "GetCustomerNumber":
        // TODO: Replace with real SDK call
        callback([
            "CustomerNumber": "123456"
        ])

    // -------------------------------------------------------------------
    // GetCommercialCustomerNumber
    // -------------------------------------------------------------------
    case "GetCommercialCustomerNumber":
        // TODO: Replace with real SDK call
        callback([
            "CommercialCustomerNumber": "987654"
        ])

    // -------------------------------------------------------------------
    // GetLocation
    // -------------------------------------------------------------------
    case "GetLocation":
        // TODO: Replace with real CoreLocation call
        callback([
            "coords": [
                "latitude": 41.015,
                "longitude": 28.979
            ]
        ])

    // -------------------------------------------------------------------
    // OpenMap – fire-and-forget, no callback to web layer
    // -------------------------------------------------------------------
    case "OpenMap":
        // TODO: Open native Maps app with the coordinates from param
        //   guard let lat = param?["latitude"] as? Double,
        //         let lon = param?["longitude"] as? Double else {
        //       errorCallback(["message": "Missing latitude/longitude", "code": "70"])
        //       return
        //   }
        //   // Open Maps…
        callback([:])

    // -------------------------------------------------------------------
    // sendPayment
    // -------------------------------------------------------------------
    case "sendPayment":
        // TODO: Route to native payment SDK
        //   guard let amount = param?["amount"] as? Double,
        //         let orderId = param?["orderId"] as? String else {
        //       errorCallback(["message": "Missing amount or orderId", "code": "70"])
        //       return
        //   }
        // Optional: type, installment, paymentToken
        callback([
            "paymentStatus": "success",
            "transactionId": "TXN-20261108-001"
        ])

    // -------------------------------------------------------------------
    // Unknown functionName
    // -------------------------------------------------------------------
    default:
        errorCallback([
            "message": "Unsupported functionName: \(functionName)",
            "code": "70"
        ])
    }
}

// MARK: - WKScriptMessage Handler (example integration point)

/*
extension ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController,
                                didReceive message: WKScriptMessage) {
        guard message.name == "miniapp",
              let body = message.body as? String,
              let data = body.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let callFunction = json["callFunction"] as? [String: Any] else {
            return
        }

        let functionName = callFunction["functionName"] as? String
        let param = callFunction["param"] as? [String: Any]

        callMethod(
            functionName: functionName,
            param: param,
            callback: { retVal in
                let response: [String: Any] = [
                    "isSuccess": true,
                    "retVal": [
                        "consentName": functionName ?? "",
                        "isApproved": true,
                        "funcRetVal": retVal
                    ]
                ]
                // Send back via evaluateJavaScript:
                // let js = "functionCallback('\(functionName!)', '\(response.jsonString)')"
                // webView.evaluateJavaScript(js, completionHandler: nil)
            },
            errorCallback: { error in
                let response: [String: Any] = [
                    "isSuccess": false,
                    "error": error
                ]
                // Send back via evaluateJavaScript:
                // let js = "functionCallback('\(functionName!)', '\(response.jsonString)')"
                // webView.evaluateJavaScript(js, completionHandler: nil)
            }
        )
    }
}
*/