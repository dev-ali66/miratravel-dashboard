# Documentation Analysis & Project Roadmap

## 📂 Documentation Reorganization
All scattered `.md` files have been successfully organized into a structured `docs/` folder in the root directory:
- **`docs/dashboard/`**: Contains frontend UI/UX, CMS flows, and dashboard analysis.
- **`docs/backend/`**: Contains API references, database schemas, and SDLC docs.
- **`docs/frontend/`**: Contains legacy frontend rules (like `CLAUDE.md`).
- **`AGENTS.md` (Root)**: Kept at the root and updated to index the new structure. It remains the Single Source of Truth for agent behavior.

## 🔍 Data Analysis & Duplicates
During the move, I analyzed the markdown files for duplication:
- **`CODEBASE_OVERVIEW.md`**: Exists in both `docs/dashboard/` and `docs/backend/`. The backend one is specific to the backend architecture, while the dashboard one covers the full stack. They are distinct enough to keep, but could be merged later.
- **`AGENTS.md` vs `frontend/AGENTS.md`**: The root `AGENTS.md` is the master version. The one inside `docs/frontend/AGENTS.md` is older and should be deprecated/ignored.
- **`CMS_HOME_*` & `CMS_FOOTER_*`**: These are highly detailed, section-wise guides. They are dense but not duplicates; they serve as strict rules for CMS implementation.
- **`PRD.md` vs `LOCATION_MODULE_REFACTOR_BRIEF.md`**: PRD contains the overarching goals, while the refactor brief has specific technical tasks.

*Action Taken*: I kept everything intact but isolated them in `docs/` so they don't clutter the root workspace.

---

## 🚀 Unified Feature Roadmap (TODOs)
Based on the PRD and current progress (IAM is complete), here is the roadmap for upcoming features:

### 1. Booking Module (Priority: High)
- [ ] Implement Booking Listing Table (similar to IAM/User lists).
- [ ] Implement Booking Detail View Modal.
- [ ] Add Status Management (Confirm, Cancel, Complete).
- [ ] Export functionality (CSV/PDF) for bookings.

### 2. CRM Module (Priority: Medium)
- [ ] Lead Tracking Table.
- [ ] Inquiry Form Data Viewer.
- [ ] Customer Interaction History.

### 3. CMS Refinements (Priority: Medium)
- [ ] Location Module: Implement complete CRUD operations following the `LOCATION_MODULE_REFACTOR_BRIEF.md`.
- [ ] Journeys Module: Refactor to adhere to `UniversalMultimediaForm` and `DynamicStyledField` standards.
- [ ] General: Ensure all CMS sections properly use the single-source-of-truth components outlined in `AGENTS.md`.

### 4. Advanced Features (Ideas / Future Enhancements)
- **Analytics Dashboard**: Add charts (using Recharts or similar) on the Home page to show booking trends and active users.
- **Activity Logs**: Track which admin user performed which action (e.g., "User X updated Role Y").
- **Bulk Actions**: Add checkbox selection to tables for bulk delete or bulk status updates.
- **Dark Mode Optimization**: Ensure all new components (especially charts and complex forms) look perfect in both light and dark themes.

---
*Ready to start the next module? I recommend beginning with the **Booking Module** to establish the core business logic view.*
