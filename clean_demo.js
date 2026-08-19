// Clean demo students and their associated data
const res1 = db.students.deleteMany({ email: /^student\./ });
const res2 = db.users.deleteMany({ email: /^student\./ });
const res3 = db.assessment_responses.deleteMany({ studentEmail: /^student\./ });
const res4 = db.counseling_requests.deleteMany({ studentEmail: /^student\./ });
const res5 = db.appointments.deleteMany({ studentEmail: /^student\./ });
const res6 = db.notifications.deleteMany({ recipientEmail: /^student\./ });

print(`Deleted ${res1.deletedCount} demo students and ${res2.deletedCount} demo user accounts.`);
