const feedbacks = [
    {
        orderId: 'ORD001',
        customerName: 'Raj Kumar',
        rating: 5,
        description: 'Excellent service! Parcel delivered on time.',
        dateTime: '2026-03-20T10:30:00'
    },
    {
        orderId: 'ORD002',
        customerName: 'Priya Singh',
        rating: 4,
        description: 'Good service, minor delay in pickup.',
        dateTime: '2026-03-22T14:15:00'
    },
    {
        orderId: 'ORD003',
        customerName: 'Amit Patel',
        rating: 5,
        description: 'Perfect packaging and fast delivery!',
        dateTime: '2026-03-23T09:00:00'
    }
];
document.addEventListener('DOMContentLoaded', () => {
    renderFeedback();
});
function renderFeedback() {
    const tableContainer = document.getElementById('feedbackTableContainer');
    const tableBody = document.getElementById('feedbackTableBody');
    const emptyAlert = document.getElementById('noFeedbackAlert');
    if (feedbacks.length === 0) {
        emptyAlert.classList.remove('d-none');
        tableContainer.classList.add('d-none');
        return;
    }
    emptyAlert.classList.add('d-none');
    tableContainer.classList.remove('d-none');
    tableBody.innerHTML = '';
    let totalRating = 0;
    let excellentCount = 0;
    feedbacks.forEach(fb => {
        totalRating += fb.rating;
        if (fb.rating >= 4) excellentCount++;
        const row = document.createElement('tr');

        if (fb.rating >= 4) row.classList.add('table-success');
        else if (fb.rating === 3) row.classList.add('table-warning');
        const stars = '⭐'.repeat(fb.rating);
        const badgeClass = fb.rating >= 4 ? 'bg-success' : 'bg-warning';
        const formattedDate = new Date(fb.dateTime).toLocaleString([], {
            year:
                'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        row.innerHTML = `
        <td><strong>${fb.orderId}</strong></td>
        <td>${fb.customerName}</td>
        <td>
        <span class="badge ${badgeClass}">
        ${stars} ${fb.rating}/5
        </span>
        </td>
        <td>${fb.description}</td>
        <td>${formattedDate}</td>
        `
            ;
        tableBody.appendChild(row);
    });
    document.getElementById('statTotal').innerText = feedbacks.length;
    document.getElementById('statExcellent').innerText = excellentCount;
    document.getElementById('statAverage').innerText = (totalRating /
        feedbacks.length).toFixed(1);
}