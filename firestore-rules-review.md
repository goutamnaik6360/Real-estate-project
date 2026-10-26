# Firestore Rules Review (prototype)

## Application model and access paths
- `profiles/{uid}` stores `id`, `name`, `email`, `role`, `status`, `phone`, `aadhaar`, `location`, `experience`, and `createdAt`. Users read their own profile. Admins can read only pending Agent profiles and change only status from `pending` to `approved` or `rejected`. Profile deletion is denied. Public registration permits only `user/approved` or `agent/pending`.
- `requests/{requestId}` stores customer identity, service details, workflow status/progress, assignment, and creation metadata. Customers create and read their own. Approved agents read pending or assigned work, claim pending work, and progress only their assigned in-progress jobs. Admins have no request access.
- `support_tickets/{ticketId}` stores bounded help-form content. Guests may submit; signed-in owners can read their own ticket. Admins have no ticket access.
- `notifications/{notificationId}` are private to their recipient, who can change only `is_read`. Admins have no notification access.
- Queries found: own profile document; Admin profile query filtered by `role == agent` and `status == pending`; requests filtered by `user`, `status == pending_agent`, or `assignedAgent`; notifications filtered by `user`.
- No Firebase Storage operations remain. The app uses Firebase Auth email/password and Firestore client SDK.

## Static attack review
- Public reads/listing: denied; the guest help form can create a bounded ticket.
- Cross-user reads: profile, request, ticket, and notification reads are scoped to the owner, with pending Agent profiles visible only to Admins for review.
- Role escalation: profile creation disallows `admin`; an Admin can only approve/reject a pending Agent without changing role or other profile data. The initial Admin bootstrap is a one-time server-side callable guarded by a verified email and transaction lock.
- Admin scope: non-pending profiles, requests, support tickets, notifications, profile deletion, and any profile change beyond pending Agent status decisions are denied.
- Request ownership and state transitions: customer IDs are immutable; approved Agents can claim pending work and update only their assigned job.
- Schema pollution and oversized strings: collection validators allow only known fields and cap accepted text fields.

These checks are a static code review, not emulator or production permission tests. Validate with representative roles in the Firebase Emulator before broad release; these rules remain a prototype.