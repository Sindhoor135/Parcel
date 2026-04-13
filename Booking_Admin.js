let isRegistered = true;
function showPopup(message) {
    const modal = document.getElementById('popupModal');
    const popupMessage = document.getElementById('popupMessage');
    if (!modal || !popupMessage) {
        window.alert(message);
        return;
    }
    popupMessage.innerText = message;
    modal.classList.remove('d-none');
}
function hidePopup() {
    const modal = document.getElementById('popupModal');
    if (modal) {
        modal.classList.add('d-none');
    }
}
function toggleCustomerType(val) {
    isRegistered = val;
    const idSection = document.getElementById('idSelectionSection');
    const form = document.getElementById('officerForm');
    const fetchAlert = document.getElementById('fetchAlert');
    idSection.classList.toggle('d-none', !isRegistered);
    fetchAlert.classList.add('d-none');
    document.getElementById('selectedCustomerId').value = '';
    if (!isRegistered) {
        form.classList.remove('d-none');
        setSenderData('Walk-in-Sender', '8888888888', '78 Station Road, Pune');
    } else {
        form.classList.add('d-none');
    }
}
function fetchCustomerDetails() {
    const customerId = document.getElementById('selectedCustomerId').value;
    const customerIdError = document.getElementById('customerIdError');
    const fetchAlert = document.getElementById('fetchAlert');
    if (!customerId) {
        customerIdError.classList.remove('d-none');
        fetchAlert.classList.add('d-none');
        document.getElementById('officerForm').classList.add('d-none');
        return;
    }
    customerIdError.classList.add('d-none');
    const customerData = {
        'CUST001': { name: 'Jane Smith', contact: '9998887776', address: '456 Tech Park Electronic City Bangalore' },
        'CUST002': { name: 'John Doe', contact: '8765432109', address: '123 Main Street Bangalore Karnataka' }, 'CUST003': { name: 'Sarah Wilson', contact: '9123456789', address: '789 Park Avenue Mumbai Maharashtra' }
    };
    const customer = customerData[customerId];
    if (customer) {
        setSenderData(customer.name, customer.contact, customer.address);
        fetchAlert.classList.remove('d-none');
        document.getElementById('profileInfo').innerText = `Profile Loaded: ✓ ${customer.name} | ${customer.contact}`;
        document.getElementById('officerForm').classList.remove('d-none');
    }
}
function setSenderData(name, contact, address) {
    const senderName = document.getElementById('senderName');
    const senderContact = document.getElementById('senderContact');
    const senderAddress = document.getElementById('senderAddress');
    senderName.value = name;
    senderContact.value = contact;
    senderAddress.value = address;
    validateOfficerField({ target: senderName });
    validateOfficerField({ target: senderContact });
    validateOfficerField({ target: senderAddress });
    calculateCost();
}
function normalizeText(str) {
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
}
function checkCrossFieldValidation() {
    const senderMobile = document.getElementById('senderContact').value.trim();
    const receiverMobile = document.getElementById('receiverMobile').value.trim();
    const senderAddress =
        normalizeText(document.getElementById('senderAddress').value);
    const receiverAddress =
        normalizeText(document.getElementById('receiverAddress').value);
    const mobileMatchError = document.getElementById('mobileMatchError');
    const addressMatchError = document.getElementById('addressMatchError');
    let isCrossValid = true;
    if (senderMobile && receiverMobile && senderMobile === receiverMobile) {
        document.getElementById('senderContact').classList.add('is-invalid');
        document.getElementById('receiverMobile').classList.add('is-invalid');
        if (mobileMatchError) mobileMatchError.classList.remove('d-none');
        isCrossValid = false;
    } else {
        document.getElementById('senderContact').classList.remove('is-invalid');
        document.getElementById('receiverMobile').classList.remove('is-invalid');
        if (mobileMatchError) mobileMatchError.classList.add('d-none');
    }
    if (senderAddress && receiverAddress && senderAddress === receiverAddress) {
        document.getElementById('senderAddress').classList.add('is-invalid');
        document.getElementById('receiverAddress').classList.add('is-invalid');
        if (addressMatchError) addressMatchError.classList.remove('d-none');
        isCrossValid = false;
    } else {
        document.getElementById('senderAddress').classList.remove('is-invalid');
        document.getElementById('receiverAddress').classList.remove('is-invalid');
        if (addressMatchError) addressMatchError.classList.add('d-none');
    }
    return isCrossValid;
}
function validateOfficerField(e) {
    const field = e.target;
    let isValid = true;
    let errorDiv = null;
    if (field.id === 'senderName' || field.id === 'receiverName') {
        errorDiv = document.getElementById(field.id + 'Error');
        isValid = /^[A-Za-z\s]{2,}$/.test(field.value);
    } else if (field.id === 'senderEmail') {
        errorDiv = document.getElementById('senderEmailError');
        isValid = field.value === '' ||
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    } else if (field.id === 'senderContact' || field.id === 'receiverMobile') {
        errorDiv = document.getElementById(field.id + 'Error');
        isValid = /^[6-9][0-9]{9}$/.test(field.value);
    } else if (field.id === 'receiverPin') {
        errorDiv = document.getElementById('pinError');
        isValid = /^[0-9]{6}$/.test(field.value);
    } else if (field.id === 'weightInGram') {
        isValid = parseFloat(field.value) >= 1;
    } else if (field.id === 'deliveryType') {
        errorDiv = document.getElementById('deliveryError');
        isValid = field.value !== '';
    } else if (field.id === 'packingPreference') {
        errorDiv = document.getElementById('packingError');
        isValid = field.value !== '';
    } else if (field.id === 'contents') {
        errorDiv = document.getElementById('contentsError');
        isValid = field.value.trim().length >= 3;
    } else if (field.id === 'senderAddress') {
        errorDiv = document.getElementById('senderAddressError');
        isValid = /^[A-Za-z0-9\s]*$/.test(field.value) && field.value.trim().length
            > 0;
    } else if (field.id === 'receiverAddress') {
        errorDiv = document.getElementById('receiverAddressError');
        isValid = /^[A-Za-z0-9\s]*$/.test(field.value) && field.value.trim().length
            > 0;
    }
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid && field.value);
    if (errorDiv) {
        errorDiv.classList.toggle('d-none', isValid);
    }
    if (['senderContact', 'receiverMobile', 'senderAddress',
        'receiverAddress'].includes(field.id)) {
        checkCrossFieldValidation();
    }
}
function calculateCost() {
    const weight = parseFloat(document.getElementById('weightInGram').value) || 0;
    const deliveryType = document.getElementById('deliveryType').value;
    const packingType = document.getElementById('packingPreference').value;
    if (weight === 0 || deliveryType === '' || packingType === '') {
        document.getElementById('totalCostDisplay').innerText = '0.00';
        document.getElementById('detBase').innerText = '0';
        document.getElementById('detWeight').innerText = '0.00';
        document.getElementById('detDelivery').innerText = '0';
        document.getElementById('detPacking').innerText = '0';
        document.getElementById('detTax').innerText = '0.00';
        document.getElementById('detTotal').innerText = '0.00';
        return;
    }
    const baseRate = 50;
    const adminFee = 50;
    const weightCharge = 0.02 * weight;
    let deliveryCharge = 30;
    if (deliveryType === 'Express') deliveryCharge = 80;
    if (deliveryType === 'Same-Day') deliveryCharge = 150;
    let packingCharge = 10;
    if (packingType === 'Premium') packingCharge = 30;
    const subtotal = baseRate + adminFee + weightCharge + deliveryCharge +
        packingCharge;
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    document.getElementById('totalCostDisplay').innerText = total.toFixed(2);
    document.getElementById('detBase').innerText = (baseRate + adminFee);
    document.getElementById('detWeight').innerText = weightCharge.toFixed(2);
    document.getElementById('detDelivery').innerText = deliveryCharge;
    document.getElementById('detPacking').innerText = packingCharge;
    document.getElementById('detTax').innerText = tax.toFixed(2);
    document.getElementById('detTotal').innerText = total.toFixed(2);
}
function toggleCostDetails() {
    document.getElementById('costDetailsSection').classList.toggle('d-none');
}
function resetForm() {
    const form = document.getElementById('officerForm');
    form.reset();
    document.getElementById('selectedCustomerId').value = '';
    document.getElementById('fetchAlert').classList.add('d-none');
    if (isRegistered) {
        form.classList.add('d-none');
    }
    calculateCost();
}
function initBookingForm() {
    const formInputs = document.querySelectorAll('#officerForm input, #officerForm textarea, #officerForm select');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateOfficerField);
        input.addEventListener('change', validateOfficerField);
    });
    const form = document.getElementById('officerForm');
    form.onsubmit = function (e) {
        e.preventDefault();
        const requiredFields = ['senderName', 'senderContact', 'senderEmail',
            'senderAddress',
            'receiverName', 'receiverMobile', 'receiverAddress',
            'receiverPin',
            'weightInGram', 'deliveryType', 'packingPreference',
            'contents'];
        let allValid = true;
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field) return;
            validateOfficerField({ target: field });
            if (!field.value || field.classList.contains('is-invalid')) {
                allValid = false;
            }
        });
        if (!allValid) {
            showPopup('Please fill in all required fields correctly.');
            return;
        }
        if (!checkCrossFieldValidation()) {
            showPopup('Sender and receiver details must not match for mobile and address.');
            return;
        }
        showPopup('Booking confirmed offline. Status: Assigned');
        resetForm();
    };
}
document.addEventListener('DOMContentLoaded', initBookingForm);