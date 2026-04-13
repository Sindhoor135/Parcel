document.addEventListener("DOMContentLoaded", calculateCost);

// New: global payment details
let paymentDetails = {
  paymentId: "",
  transactionId: "",
  transDate: "",
  transType: "",
  bookingId: "",
  amount: 0,
  status: ""
};
const inputs = ["weightInGram", "deliveryType", "packingPreference"];
inputs.forEach((id) => {
    document.getElementById(id).addEventListener("input", calculateCost);
});

const formInputs = document.querySelectorAll("input, textarea, select");
formInputs.forEach((input) => {
    input.addEventListener("blur", validateField);
    input.addEventListener("change", validateField);
});

function validateField(e) {
    const field = e.target;
    let isValid = true;
    let errorDiv = null;
    if (field.id === "senderEmail") {
        errorDiv = document.getElementById("senderEmailError");
        isValid =
            field.value === "" || /^[a-zA-Z1-9][a-zA-Z0-9]*(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/.test(field.value);
    } else if (field.id === "senderName" || field.id === "receiverName") {
        errorDiv = document.getElementById(field.id + "Error");
        isValid = /^[A-Za-z\s]{2,}$/.test(field.value);
    } else if (field.id === "senderMobile" || field.id === "receiverMobile") {
        errorDiv = document.getElementById(field.id + "Error");
        isValid = /^[6-9][0-9]{9}$/.test(field.value) && Number(field.value) >= 6000000000 && Number(field.value) <= 9999999999;
    } else if (field.id === "receiverPin") {
        errorDiv = document.getElementById("pinError");
        isValid = /^[0-9]{6}$/.test(field.value) && Number(field.value) >= 110001 && Number(field.value) <= 999999;
    } else if (field.id === "weightInGram") {
        isValid = parseFloat(field.value) >= 1 ;
    } else if (field.id === "deliveryType") {
        errorDiv = document.getElementById("deliveryError");
        isValid = field.value !== "";
    } else if (field.id === "packingPreference") {
        errorDiv = document.getElementById("packingError");
        isValid = field.value !== "";
    } else if (field.id === "contents") {
        errorDiv = document.getElementById("contentsError");
        isValid = field.value.trim().length >= 3;
    } else if (field.id === "senderAddress") {
        errorDiv = document.getElementById("senderAddressError");
        isValid = 
            /^[A-Za-z0-9-,.'"-/\s]*$/.test(field.value) && field.value.trim().length > 0;
    } else if (field.id === "receiverAddress") {
        errorDiv = document.getElementById("receiverAddressError");
        isValid =
            /^[A-Za-z0-9-,.'"-/\s]*$/.test(field.value) && field.value.trim().length > 0;
    }
    if (field.required || field.value || isValid === false) {
        field.classList.toggle("is-invalid", !isValid);
        field.classList.toggle("is-valid", isValid && field.value);
        if (errorDiv) {
            errorDiv.classList.toggle("d-none", isValid);
        }
        if (document.getElementById("senderAddressError").style.display !== "none") {
            document.getElementById("senderAddressMessage").classList.toggle("d-block", false);
            document.getElementById("senderAddressMessage").classList.toggle("d-none", true);
        }
        if (document.getElementById("receiverAddressError").style.display !== "none") {
            document.getElementById("receiverAddressMessage").classList.toggle("d-block", false);
            document.getElementById("receiverAddressMessage").classList.toggle("d-none", true);
        }
    }
    if (
        [
            "senderMobile",
            "receiverMobile",
            "senderAddress",
            "receiverAddress",
        ].includes(field.id)
    ) {
        checkCrossFieldValidation();
    }
}
function calculateCost() {
    const weight = parseFloat(document.getElementById("weightInGram").value) || 0;
    const deliveryType = document.getElementById("deliveryType").value;
    const packingPreference = document.getElementById("packingPreference").value;
    if (weight === 0 || deliveryType === "" || packingPreference === "") {
        document.getElementById("estimatedCostDisplay").innerText = "0.00";
        document.getElementById("detailWeight").innerText = "0.00";
        document.getElementById("detailDelivery").innerText = "0";
        document.getElementById("detailPacking").innerText = "0";
        document.getElementById("detailTax").innerText = "0.00";
        document.getElementById("detailTotal").innerText = "0.00"; return;
    }
    const baseRate = 50;
    const weightCharge = 0.02 * weight;
    let deliveryCharge = 30;
    if (deliveryType === "Express") deliveryCharge = 80;
    if (deliveryType === "Same-Day") deliveryCharge = 150;
    let packingCharge = 10;
    if (packingPreference === "Premium") packingCharge = 30;
    const subtotal = baseRate + weightCharge + deliveryCharge + packingCharge;
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    document.getElementById("estimatedCostDisplay").innerText = total.toFixed(2);
    document.getElementById("detailWeight").innerText = weightCharge.toFixed(2);
    document.getElementById("detailDelivery").innerText = deliveryCharge;
    document.getElementById("detailPacking").innerText = packingCharge;
    document.getElementById("detailTax").innerText = tax.toFixed(2);
    document.getElementById("detailTotal").innerText = total.toFixed(2);
}
function toggleCostDetails() {
    const detailCard = document.getElementById("costDetailsCard");
    detailCard.classList.toggle("d-none");
}
function resetForm() {
    document.getElementById("bookingForm").reset();
    // document.getElementById("senderName").value = "";
    // document.getElementById("senderMobile").value ="";
    // document.getElementById("senderAddress").value = "";

    calculateCost();
}
function normalizeText(str) {
    return str.trim().toLowerCase().replace(/\s+/g, " ");
}
function showPopup(message) {
    const modal = document.getElementById("popupModal");
    const popupMessage = document.getElementById("popupMessage");
    if (!modal || !popupMessage) {
        window.alert(message);
        return;
    }
    popupMessage.innerText = message;
    modal.classList.remove("d-none");
}
function hidePopup() {
    const modal = document.getElementById("popupModal");
    if (modal) {
        modal.classList.add("d-none");
    }
}
function checkCrossFieldValidation() {
    const senderMobile = document.getElementById("senderMobile").value.trim();
    const receiverMobile = document.getElementById("receiverMobile").value.trim();
    const senderAddress = normalizeText(
        document.getElementById("senderAddress").value,
    );
    const receiverAddress = normalizeText(
        document.getElementById("receiverAddress").value,
    );
    const mobileMatchError = document.getElementById("mobileMatchError");
    const addressMatchError = document.getElementById("addressMatchError");
    let isCrossValid = true;
    if (senderMobile && receiverMobile && senderMobile === receiverMobile) {
        document.getElementById("senderMobile").classList.add("is-invalid");
        document.getElementById("receiverMobile").classList.add("is-invalid");
        if (mobileMatchError) mobileMatchError.classList.remove("d-none");
        isCrossValid = false;
    } else {
        document.getElementById("senderMobile").classList.remove("is-invalid");
        document.getElementById("receiverMobile").classList.remove("is-invalid");
        if (mobileMatchError) mobileMatchError.classList.add("d-none");
    }
    if (senderAddress && receiverAddress && senderAddress === receiverAddress) {
        document.getElementById("senderAddress").classList.add("is-invalid");
        document.getElementById("receiverAddress").classList.add("is-invalid");
        if (addressMatchError) addressMatchError.classList.remove("d-none");
        isCrossValid = false;
    } else {
        document.getElementById("senderAddress").classList.remove("is-invalid");
        document.getElementById("receiverAddress").classList.remove("is-invalid");
        if (addressMatchError) addressMatchError.classList.add("d-none");
    }
    return isCrossValid;
}
document.getElementById("bookingForm").onsubmit = function (e) {
    e.preventDefault(); const requiredFields = [
        "senderName",
        "senderMobile",
        "senderEmail",
        "senderAddress",
        "receiverName",
        "receiverMobile",
        "receiverAddress",
        "receiverPin",
        "weightInGram",
        "deliveryType",
        "packingPreference",
        "contents",
    ];
    let allValid = true;
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.dispatchEvent(new Event('blur'));
        if (field.classList.contains('is-invalid') || !field.value) {
            allValid = false;
        }
    });
    if (!allValid) {
        console.log("popup error");
        showPopup("Please fill in all required fields correctly.");
        return;
    }
    if (!checkCrossFieldValidation()) {
        return;
    }
    console.log("popup error");
    openPaymentModal(); // ADDED 👉
};

// ==========================
// 💳 PAYMENT SYSTEM (FINAL)
// ==========================

let paymentTimerInterval;
let timeLeft = 300; // 5 minutes

// ==========================
// OPEN / CLOSE MODAL
// ==========================
function openPaymentModal() {
    document.getElementById('paymentModal').classList.remove('d-none');

    // reset sections
    document.getElementById('cardSection').classList.add('d-none');
    document.getElementById('upiSection').classList.add('d-none');

    startPaymentTimer();
}

function closePayment() {
    document.getElementById('paymentModal').classList.add('d-none');
    clearInterval(paymentTimerInterval);
}

// ==========================
// PAYMENT METHOD SWITCH
// ==========================
function selectPayment(method) {
    document.getElementById('cardSection').classList.add('d-none');
    document.getElementById('upiSection').classList.add('d-none');

    if (method === 'card') {
        document.getElementById('cardSection').classList.remove('d-none');
    } else {
        document.getElementById('upiSection').classList.remove('d-none');
    }
}

// ==========================
// ⏱ TIMER
// ==========================
function startPaymentTimer() {
    timeLeft = 300;

    paymentTimerInterval = setInterval(() => {
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;

        document.getElementById("paymentTimer").innerText =
            ` ${min}:${sec < 10 ? '0' : ''}${sec}`;

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(paymentTimerInterval);
            closePayment();
            showPopup("⏳ Payment session expired!");
        }
    }, 1000);
}

// ==========================
// 🔄 LOADING + BANK SIMULATION
// ==========================
function showLoading() {
    document.getElementById('paymentLoading').classList.remove('d-none');
}

function hideLoading() {
    document.getElementById('paymentLoading').classList.add('d-none');
}

function simulateBankRedirect(callback) {
    document.getElementById('bankRedirect').classList.remove('d-none');

    setTimeout(() => {
        document.getElementById('bankRedirect').classList.add('d-none');
        callback();
    }, 2000); // bank delay
}

// ==========================
// 💳 CARD VALIDATION (UNCHANGED)
// ==========================
function isValidCardNumber(num) {
    let sum = 0, alt = false;

    for (let i = num.length - 1; i >= 0; i--) {
        let n = parseInt(num[i]);

        if (alt) {
            n *= 2;
            if (n > 9) n -= 9;
        }

        sum += n;
        alt = !alt;
    }

    return sum % 10 === 0;
}

function isValidExpiry(exp) {
    const m = exp.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
    if (!m) return false;

    const [month, year] = exp.split('/');
    return new Date(20`${year}`, month) > new Date();
}

// ==========================
// 💳 CARD PAYMENT
// ==========================
function processPayment() {
    const name = document.getElementById('cardName').value.trim();
    const number = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    if (!/^[A-Za-z\s]{2,}$/.test(name)) return alert("Invalid Name");
    if (!/^\d{16}$/.test(number) || !isValidCardNumber(number)) return alert("Invalid Card Number");
    if (!isValidExpiry(expiry)) return alert("Invalid Expiry Date");
    if (!/^\d{3}$/.test(cvv)) return alert("Invalid CVV");

    clearInterval(paymentTimerInterval);

    simulateBankRedirect(() => {
        showLoading();

        setTimeout(() => {
            hideLoading();
            closePayment();

            showPaymentSuccessPopup();

            resetForm();
        }, 2000);
    });
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, ''); // remove non-digits

    if (value.length > 4) {
        value = value.slice(0, 4);
    }

    if (value.length >= 3) {
        input.value = value.slice(0, 2) + '/' + value.slice(2);
    } else {
        input.value = value;
    }
}

// ==========================
// 📱 UPI PAYMENT
// ==========================
function processUPIPayment() {
  const upi = document.getElementById('upiId').value.trim();

  if (!/^[\w.-]+@[\w]+$/.test(upi)) {
    return alert("Invalid UPI ID");
  }

  clearInterval(paymentTimerInterval);

  simulateBankRedirect(() => {
    showLoading();

    setTimeout(() => {
      hideLoading();
      closePayment();

      showPaymentSuccessPopup();   // ✅ show payment‑details popup

      resetForm();
    }, 2000);
  });
}

// ==========================
// INVOICE (UNCHANGED)
// ==========================
function generateInvoice() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const sender = document.getElementById('senderName').value;
    const receiver = document.getElementById('receiverName').value;
    const total = document.getElementById('detailTotal').innerText;
    const tax = document.getElementById('detailTax').innerText;

    const id = "INV" + Math.floor(Math.random() * 100000);

    doc.text("ShipIt Tax Invoice", 70, 10);
    doc.text(`Invoice ID: ${id}`, 10, 20);
    doc.text("Sender: " + sender, 10, 30);
    doc.text("Receiver: " + receiver, 10, 40);
    doc.text("Cost Breakdown:", 10, 60);
    doc.text("Base: 50", 10, 70);
    doc.text("Tax: " + tax, 10, 80);
    doc.text("Total: " + total, 10, 90);
    doc.save(`Invoice_${id}`.pdf);
}
// Show payment‑success popup with all details
function showPaymentSuccessPopup() {
  const cost = document.getElementById("detailTotal")?.innerText || "0.00";
  const amount = parseFloat(cost);
  const method = document.querySelector(".selection.active")?.textContent.includes("UPI") ? "UPI" : "Card";

  paymentDetails = {
    paymentId: "PY" + Date.now(),
    transactionId: "TXN" + Date.now(),
    transDate: new Date().toLocaleString("en-IN"),
    transType: "DEBIT",
    bookingId: "BK" + Date.now(),
    amount: amount.toFixed(2),
    status: "SUCCESS"
  };

  // Hide payment modal and loading
  document.getElementById("paymentModal")?.classList.add("d-none");
  document.getElementById("paymentLoading")?.classList.add("d-none");

  // Show success popup
  const popup = document.getElementById("paymentSuccessPopup");
  if (popup) {
    popup.classList.remove("d-none");
    popup.classList.add("d-block");
  }

  // Populate fields
  const p = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  p("psPaymentId", paymentDetails.paymentId);
  p("psTransactionId", paymentDetails.transactionId);
  p("psTransDate", paymentDetails.transDate);
  p("psTransType", paymentDetails.transType);
  p("psBookingId", paymentDetails.bookingId);
  p("psAmount", paymentDetails.amount);
  p("psStatus", paymentDetails.status);

  // Extra booking info for invoice
  const map = {
    psSenderName: "senderName",
    psReceiverName: "receiverName",
    psWeight: "weightInGram",
    psDeliveryType: "deliveryType",
    psPacking: "packingPreference",
    psTotalCost: "detailTotal"
  };

  Object.entries(map).forEach(([popupId, formId]) => {
    const elPopup = document.getElementById(popupId);
    const elForm = document.getElementById(formId);
    if (elPopup && elForm) {
      const val = elForm.tagName === "SELECT"
        ? elForm.options[elForm.selectedIndex]?.text || ""
        : elForm.value || "";
      elPopup.textContent = val;
    }
  });

  // Buttons
  const btnPrev = document.getElementById("btnPrevBookings");
  const btnHome = document.getElementById("btnReturnHome");
  const btnInvoice = document.getElementById("btnGenerateInvoice");

  if (btnPrev) {
    btnPrev.onclick = () => {
      window.location.href = "../UserOrders/User_Orders.html";
    };
  }

  if (btnHome) {
    btnHome.onclick = () => {
      window.location.href = "../UserHome/User_Home.html";
    };
  }

  if (btnInvoice) {
    btnInvoice.onclick = () => {
      generateInvoicePDF();
    };
  }
}
function generateInvoicePDF() {
  if (!window.jspdf) {
    alert("PDF library not loaded.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("ShipIt – Invoice", 20, 20);

  doc.setFontSize(10);
  doc.text("Payment Details", 20, 30);

  const fields = [
    { label: "Payment ID:", value: document.getElementById("psPaymentId")?.textContent || "" },
    { label: "Transaction ID:", value: document.getElementById("psTransactionId")?.textContent || "" },
    { label: "Transaction Date:", value: document.getElementById("psTransDate")?.textContent || "" },
    { label: "Transaction Type:", value: document.getElementById("psTransType")?.textContent || "" },
    { label: "Booking ID:", value: document.getElementById("psBookingId")?.textContent || "" },
    { label: "Amount Paid:", value: "₹" + (document.getElementById("psAmount")?.textContent || "0") },
    { label: "Status:", value: document.getElementById("psStatus")?.textContent || "" }
  ];

  let y = 40;
  fields.forEach((f) => {
    doc.text(f.label, 20, y);
    doc.text(f.value, 70, y);
    y += 8;
  });

  y += 10;
  doc.text("Booking Details", 20, y);

  y += 10;
  const bookingFields = [
    { label: "Sender Name:", value: document.getElementById("psSenderName")?.textContent || "" },
    { label: "Receiver Name:", value: document.getElementById("psReceiverName")?.textContent || "" },
    { label: "Weight:", value: document.getElementById("psWeight")?.textContent || "" + " g" },
    { label: "Delivery Type:", value: document.getElementById("psDeliveryType")?.textContent || "" },
    { label: "Packing Preference:", value: document.getElementById("psPacking")?.textContent || "" },
    { label: "Estimated Cost:", value: "₹" + (document.getElementById("psTotalCost")?.textContent || "0.00") }
  ];

  bookingFields.forEach((f) => {
    doc.text(f.label, 20, y);
    doc.text(f.value, 70, y);
    y += 8;
  });

  y += 15;
  doc.setFontSize(8);
  doc.text("Generated automatically by ShipIt on " + new Date().toLocaleString("en-IN"), 20, y);

  doc.save(`Invoice_${paymentDetails.bookingId}_${paymentDetails.transactionId}.pdf`);
}
/* Date Validation */
const pickup = document.getElementById("dateinput");
const today = new Date();

function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;  // No spaces around dashes
}

const formattoday = formatDate(today);
pickup.value = formattoday;
pickup.min = formattoday;

let maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 2);
const formattedmax = formatDate(maxDate);
pickup.max = formattedmax;

/* Weight validation */
function validateWeight() {
    const warn = document.getElementById("weightError");
    const val = document.getElementById("weightInGram").value;

    let isValid = true;
    console.log(val);

    if (val < 1 || val > 15000) {
        warn.classList.remove("d-none");
        isValid = false;
    } else {
        warn.classList.add("d-none");
        isValid = true;
    }
}
  const btnPrev = document.getElementById("btnPrevBookings");
  const btnHome = document.getElementById("btnReturnHome");
  const btnInvoice = document.getElementById("btnGenerateInvoice");

  if (btnPrev) {
    btnPrev.onclick = () => {
      window.location.href = "../UserOrders/User_Orders.html";
    };
  }

  if (btnHome) {
    btnHome.onclick = () => {
      window.location.href = "../UserHome/User_Home.html";
    };
  }

  if (btnInvoice) {
    btnInvoice.onclick = () => {
      generateInvoicePDF();
    };
  }