# Fatoora Lite

A lightweight invoicing and quotation tool for Saudi businesses, built to automate the paperwork SMEs and freelancers redo every week: quotations, ZATCA-compliant tax invoices, VAT calculations, and client/product records.

## Features

- **Bilingual (English/Arabic) UI** with full RTL support
- **Clients & Products/Services catalog** — reusable records so invoices take seconds, not minutes
- **Quotations → Invoices** — draft a quotation, then convert it to an invoice in one click, keeping a link between the two
- **Automatic VAT (15%) calculation** per line item, with discounts and per-line VAT rate overrides
- **ZATCA-compliant QR code** on every tax invoice (Phase 1 simplified tax invoice TLV encoding: seller name, VAT number, timestamp, invoice total, VAT total)
- **Sequential document numbering** per year (`INV-2026-0001`, `QTN-2026-0001`)
- **Printable bilingual invoice/quotation template** — print to PDF straight from the browser
- **Dashboard** — total invoiced, VAT collected, outstanding balance, open quotations
- **CSV export** of invoices/quotations for bookkeeping or VAT return prep
- **Company profile** (name, VAT/CR numbers, logo) used across every document
- All data is stored locally in the browser (`localStorage`) — no backend required

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL, fill in your **Company Settings** first (VAT number, CR number, logo), then add clients and products before creating your first invoice or quotation.

## Tech stack

React + TypeScript + Vite + Tailwind CSS, with the `qrcode` package for rendering ZATCA QR codes client-side.

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/ahmedalwasim/sb1-xg2nit)
