# Staff / Salary Management — 30 Feature Ideas

For the Acrowell CRM (PCD pharma franchise). Covers the sales team (reps/managers) and back-office staff. Designed to reuse what's already in the app — profiles, roles, RLS, notifications, scheduled tasks, and the check-in you already have on the My Day screen.

## Staff records & onboarding
1. **Full employee profile** — extend the existing `profiles` with joining date, designation, department, address, emergency contact, blood group, and photo.
2. **Document vault per employee** — Aadhaar, PAN, bank proof, appointment letter, agreements — with expiry tags (reusing the party-documents pattern).
3. **Employee code + reporting manager** — a clean staff directory with who-reports-to-whom, extending the Team phone book.
4. **Employment status history** — probation → confirmed → on-leave → exited, auto-logged (reusing the party status-history trigger pattern).
5. **Role & access management** — beyond rep/manager/admin, finer permissions per module (who can see salaries, who can edit stock).

## Attendance & time
6. **Daily check-in / check-out** — build on the existing My Day "Start my day" button to capture in/out timestamps.
7. **GPS / field check-in** — reps mark attendance from the field with location, useful for on-tour staff.
8. **Attendance calendar** — monthly grid per employee (present / absent / half-day / leave / holiday).
9. **Leave management** — apply, approve, and track casual/sick/earned leave with balances, routed to the reporting manager via notifications.
10. **Holiday calendar** — company + regional holidays that feed attendance and payroll.
11. **Late-mark & short-day rules** — configurable grace times that flag lateness automatically.
12. **Tour / visit log** — reps log party visits per day (ties into leads/parties), doubling as fieldwork proof.

## Salary structure & payroll
13. **Salary structure per employee** — basic, HRA, DA, conveyance, allowances, and deductions as configurable components.
14. **Monthly payroll run** — generate salary for all staff for a month, with attendance/leave feeding paid days.
15. **Payslip PDF** — branded, shareable payslip per employee per month (reusing the invoice/PDF engine).
16. **Auto salary calculation** — gross → deductions (PF, ESI, TDS, advances) → net, computed from the structure and attendance.
17. **Statutory deductions** — PF, ESI, and professional tax handling with configurable rates.
18. **Salary register / muster** — a company-wide monthly payroll sheet, exportable to Excel for the accountant.
19. **Salary revision history** — track every increment/CTC change with effective date and reason.
20. **Bank transfer sheet** — export a payment file (name, account, IFSC, net amount) for bulk bank upload.

## Incentives & performance (sales-specific)
21. **Incentive / commission engine** — rules like ₹X per order, % of collection, or slabs on monthly sales, computed from real order and payment data already in the CRM.
22. **Target vs. achievement** — set monthly sales/collection targets per rep and show attainment (extends the Leaderboard scorecard).
23. **Collection-linked incentive** — reward money actually collected, not just billed, using the payments data.
24. **Rep expense / TA-DA claims** — submit travel and daily-allowance claims with bills, approved by managers.
25. **Performance review notes** — periodic manager notes/ratings per employee, kept in a private HR tab.

## Advances, loans & compliance
26. **Salary advance / loan tracking** — record advances and auto-deduct instalments from upcoming payslips.
27. **Full-and-final settlement** — exit workflow computing dues, leave encashment, and pending recoveries.
28. **Reimbursement register** — non-salary payouts (mobile, fuel, medical) tracked and reported.

## Reporting & automation
29. **HR dashboard** — headcount, attendance %, salary cost by department, upcoming document expiries, birthdays/anniversaries.
30. **Automated reminders** — scheduled nudges for payroll day, pending leave approvals, expiring staff documents, and probation-confirmation dates (reusing the scheduled-task + notification system).

---
*Suggested build order: start with 1–5 (records), then 6–9 (attendance + leave, since payroll depends on them), then 13–16 (salary structure + payroll + payslip), then 21–23 (the sales incentives, which are your biggest differentiator since the order/collection data is already live).*

*Compliance note: PF/ESI/TDS/PT rates and rules change and vary by state and headcount — treat the statutory pieces (17, 26–27) as configurable, and have them verified by your accountant before relying on the computed figures.*
