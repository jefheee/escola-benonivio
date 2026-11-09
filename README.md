# **🏫 EEB Professor Benonívio João Martins School Portal**

Welcome to the official repository of the new digital ecosystem for **E.E.B. Professor Benonívio João Martins**, located in Palhoça/SC.

This project was built to modernize school communication, replacing legacy systems with a fast, responsive, and easy-to-manage platform for the school staff.

## **🎯 Project Overview**

The platform is divided into two distinct universes to ensure security, performance, and the best user experience:

1. **Public Portal:** Aimed at students, parents, and the community. Focused on speed and accessibility, where users can check the school's history, access public documents, see recent announcements, and quickly find the contact channels for each class.
2. **Administrative Dashboard:** A restricted and secure area, designed specifically for the secretarial and management staff. It allows full management of the website's content in a visual way, without requiring technical knowledge.

## **🏗️ Architecture and Features**

The project uses the **Next.js App Router** and is structured through *Route Groups* to completely isolate the logic and layout of the public area from the administrative area.

### **🌐 Public Area (app/(public))**

* **Home:** School overview, quick shortcuts, and institutional highlights.
* **Announcements:** Digital bulletin board for important notices to the school community.
* **About:** Institutional information, School Census data, location, and the Patron's biography.
* **Archive:** Rescuing the school's memory, with historical photo galleries and past projects.
* **Documents:** Repository of public files (Notices, Minutes, Study Guides) available for direct download.
* **Classes:** Organized mapping to facilitate access to the communication groups for each grade.

### **🔒 Administrative Area (app/(admin))**

Access protected by authentication (Supabase) via Middleware. The panel includes intuitive managers (CRUDs) for:

* **Announcements Manager:** Creation and editing of notices on the home page.
* **Documents Manager:** Upload and organization of files (PDFs, Docx).
* **Notifications Manager:** System alerts control.
* **Pages Manager:** Dynamic content control.
* **Classes Manager:** Quick update of WhatsApp links and class information.

## **🛠️ Technologies Used**

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling and UI:** Tailwind CSS, Radix UI / shadcn/ui (Components)
* **Database & Authentication:** Supabase (PostgreSQL, Auth SSR)
* **Animations and Scroll:** Framer Motion, Lenis (Smooth Scroll)
* **State/Data Management:** React Query / Next Server Actions

## **🔗 Deploy**

The platform is hosted on Vercel, taking full advantage of Next.js Edge and Serverless rendering capabilities.

**Access the production site:** [https://escolabenonivio.vercel.app](https://escolabenonivio.vercel.app)

## **⚖️ Compliance and Privacy**

This portal was designed respecting **LGPD** (Brazilian General Data Protection Law) regulations and guidelines for the protection of minors. Features that require handling sensitive student data are always delegated and redirected to the official systems of the State Government of Santa Catarina (SED/SC).
