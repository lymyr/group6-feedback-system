import { database, auth } from './firebase.js';
import { ref, onValue } from 'https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js';

// Fetch feedback count for Dashboard
function setElementTextContent(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        const uid = user.uid;

        // Fetch the admin's college from the database
        const userRef = ref(database, 'users/' + uid);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            const userCollege = userData && userData.college ? userData.college : '';

            // Fetch feedbacks and calculate counts
            const feedbackRef = ref(database, 'feedbacks');
            onValue(feedbackRef, (snapshot) => {
                const feedbacks = snapshot.val();

                if (feedbacks) {
                    // Student Dashboard Counters
                    let studentTotalFeedback = 0;
                    let studentPendingCount = 0;
                    let studentOngoingCount = 0;
                    let studentResolvedCount = 0;

                    // Admin Dashboard Counters
                    let adminTotalFeedback = 0;
                    let adminPendingCount = 0;
                    let adminOngoingCount = 0;
                    let adminResolvedCount = 0;
                    let suggestionCount = 0;
                    let concernCount = 0;

                    Object.values(feedbacks).forEach(feedback => {
                        // For Students: Count feedbacks with their UID
                        if (feedback.student === uid) {
                            studentTotalFeedback++;
                            if (feedback.status === 'Pending') studentPendingCount++;
                            if (feedback.status === 'Ongoing') studentOngoingCount++;
                            if (feedback.status === 'Resolved') studentResolvedCount++;
                        }

                        // For Admins: Count feedbacks in their college
                        if (feedback.college === userCollege) {
                            adminTotalFeedback++;
                            if (feedback.status === 'Pending') adminPendingCount++;
                            if (feedback.status === 'Ongoing') adminOngoingCount++;
                            if (feedback.status === 'Resolved') adminResolvedCount++;
                            if (feedback.type === 'Suggestion') suggestionCount++;
                            if (feedback.type === 'Concern') concernCount++;
                        }
                    });

                    // Display Student Dashboard Values
                    setElementTextContent('total-feedback', studentTotalFeedback);
                    setElementTextContent('pending-feedback', studentPendingCount);
                    setElementTextContent('ongoing-feedback', studentOngoingCount);
                    setElementTextContent('resolved-feedback', studentResolvedCount);

                    // Display Admin Dashboard Values
                    setElementTextContent('admin-total-feedback', adminTotalFeedback);
                    setElementTextContent('admin-pending-feedback', adminPendingCount);
                    setElementTextContent('admin-ongoing-feedback', adminOngoingCount);
                    setElementTextContent('admin-resolved-feedback', adminResolvedCount);
                    setElementTextContent('suggestion-feedback', suggestionCount);
                    setElementTextContent('concern-feedback', concernCount);
                }
            });
        });
    }
});