import PDFDocument from 'pdfkit';

export const generateQuotePDF = async (quoteData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const companyName = quoteData.companyName || 'Hulul Al Madina Interiors';
      const companyAddress = quoteData.companyAddress || 'Dubai, United Arab Emirates';
      const companyContact = [quoteData.companyEmail, quoteData.companyPhone].filter(Boolean).join(' | ') || '';
      const currency = quoteData.currency || 'AED';

      // ── Company branding ──
      doc.fontSize(24).font('Helvetica-Bold').fill('#1A1817').text(companyName, 50, 50);
      doc.fontSize(10).font('Helvetica').fill('#666').text(companyAddress, 50, 80);
      if (companyContact) doc.fontSize(10).font('Helvetica').fill('#666').text(companyContact, 50, 95);

      // ── Quote header ──
      doc.fontSize(18).font('Helvetica-Bold').fill('#C4795A').text('OFFICIAL QUOTATION', 400, 50, { align: 'right' });
      doc.fontSize(12).font('Helvetica-Bold').fill('#1A1817').text(`Quote #: ${quoteData.quoteNumber}`, 400, 75, { align: 'right' });

      const issueDate = quoteData.createdAt
        ? new Date(quoteData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const validUntil = quoteData.validUntil
        ? new Date(quoteData.validUntil).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : 'N/A';

      doc.fontSize(10).font('Helvetica').fill('#666').text(`Issue Date: ${issueDate}`, 400, 95, { align: 'right' });
      doc.fontSize(10).font('Helvetica').fill('#666').text(`Valid Until: ${validUntil}`, 400, 110, { align: 'right' });

      // ── Divider ──
      doc.moveTo(50, 130).lineTo(550, 130).strokeColor('#E5E5E5').lineWidth(1).stroke();

      // ── Bill To ──
      doc.fontSize(14).font('Helvetica-Bold').fill('#1A1817').text('Bill To:', 50, 150);
      doc.fontSize(12).font('Helvetica-Bold').fill('#333').text(quoteData.leadName || 'Client Name', 50, 170);
      doc.fontSize(10).font('Helvetica').fill('#666').text(quoteData.leadEmail || '', 50, 185);
      if (quoteData.leadPhone) doc.fontSize(10).font('Helvetica').fill('#666').text(quoteData.leadPhone, 50, 200);

      // ── Table header ──
      const tableTop = 250;
      doc.moveTo(50, tableTop - 10).lineTo(550, tableTop - 10).strokeColor('#1A1817').lineWidth(1).stroke();
      doc.fontSize(10).font('Helvetica-Bold').fill('#1A1817');
      doc.text('Description', 50, tableTop, { width: 200 });
      doc.text('Category', 260, tableTop, { width: 80 });
      doc.text('Qty', 350, tableTop, { width: 40, align: 'center' });
      doc.text('Unit Price', 400, tableTop, { width: 70, align: 'right' });
      doc.text('Total', 480, tableTop, { width: 70, align: 'right' });
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#E5E5E5').lineWidth(0.5).stroke();

      // ── Line items ──
      const items = quoteData.lineItems || quoteData.items || [];
      let y = tableTop + 25;

      // Pass 1: draw alternate row backgrounds
      items.forEach((item, index) => {
        if (index % 2 === 0) {
          doc.rect(50, y, 500, 20).fill('#F9F9F9');
        }
        y += 20;
      });

      // Pass 2: draw text on top of backgrounds
      y = tableTop + 25;
      items.forEach((item) => {
        const lineTotal = (item.quantity || 1) * (item.unitPrice || 0);
        doc.fontSize(9).font('Helvetica').fill('#333');
        doc.text(item.description || '', 50, y, { width: 200 });
        doc.text(item.category || '', 260, y, { width: 80 });
        doc.text(String(item.quantity || 1), 350, y, { width: 40, align: 'center' });
        doc.text(`${(item.unitPrice || 0).toLocaleString()} ${currency}`, 400, y, { width: 70, align: 'right' });
        doc.text(`${lineTotal.toLocaleString()} ${currency}`, 480, y, { width: 70, align: 'right' });
        y += 20;
      });

      // ── Table bottom line ──
      doc.moveTo(50, y).lineTo(550, y).strokeColor('#1A1817').lineWidth(1).stroke();

      // ── Calculation breakdown ──
      const subtotal = quoteData.subtotal || 0;
      const discount = quoteData.discount || 0;
      const tax = quoteData.tax || 0;
      const grandTotal = quoteData.grandTotal || 0;
      const taxableAmount = Math.max(0, subtotal - discount);

      const totalsX = 380;
      let totalsY = y + 20;

      // Show how subtotal was reached
      doc.fontSize(9).font('Helvetica').fill('#888');
      doc.text('Calculation Breakdown:', totalsX, totalsY, { width: 170, align: 'right' });
      totalsY += 15;

      items.forEach((item) => {
        const lineTotal = (item.quantity || 1) * (item.unitPrice || 0);
        doc.fontSize(8).font('Helvetica').fill('#999');
        doc.text(`${item.description}: ${lineTotal.toLocaleString()} ${currency}`, totalsX, totalsY, { width: 170, align: 'right' });
        totalsY += 12;
      });

      totalsY += 5;
      doc.moveTo(totalsX, totalsY).lineTo(550, totalsY).strokeColor('#E5E5E5').lineWidth(0.5).stroke();
      totalsY += 8;

      // Subtotal
      doc.fontSize(10).font('Helvetica').fill('#666');
      doc.text('Subtotal:', totalsX, totalsY, { width: 80, align: 'right' });
      doc.text(`${subtotal.toLocaleString()} ${currency}`, totalsX + 90, totalsY, { width: 60, align: 'right' });
      totalsY += 18;

      // Discount
      if (discount > 0) {
        doc.fontSize(10).font('Helvetica').fill('#DC2626');
        doc.text('Discount:', totalsX, totalsY, { width: 80, align: 'right' });
        doc.text(`-${discount.toLocaleString()} ${currency}`, totalsX + 90, totalsY, { width: 60, align: 'right' });
        totalsY += 18;

        doc.fontSize(9).font('Helvetica').fill('#999');
        doc.text(`Taxable: ${taxableAmount.toLocaleString()} ${currency}`, totalsX, totalsY, { width: 150, align: 'right' });
        totalsY += 15;
      }

      // VAT
      doc.fontSize(10).font('Helvetica').fill('#666');
      doc.text('UAE VAT (5%):', totalsX, totalsY, { width: 80, align: 'right' });
      doc.text(`${tax.toLocaleString()} ${currency}`, totalsX + 90, totalsY, { width: 60, align: 'right' });
      totalsY += 18;

      doc.fontSize(9).font('Helvetica').fill('#999');
      doc.text(`(${taxableAmount.toLocaleString()} × 5%)`, totalsX, totalsY, { width: 150, align: 'right' });
      totalsY += 20;

      // Grand Total
      doc.moveTo(totalsX, totalsY).lineTo(550, totalsY).strokeColor('#C4795A').lineWidth(2).stroke();
      totalsY += 5;
      doc.fontSize(14).font('Helvetica-Bold').fill('#C4795A');
      doc.text('Grand Total:', totalsX, totalsY, { width: 80, align: 'right' });
      doc.text(`${grandTotal.toLocaleString()} ${currency}`, totalsX + 90, totalsY, { width: 60, align: 'right' });

      // ── Terms & Conditions ──
      const termsY = totalsY + 50;
      doc.fontSize(10).font('Helvetica-Bold').fill('#1A1817');
      doc.text('Terms & Conditions:', 50, termsY);

      doc.fontSize(8).font('Helvetica').fill('#666');
      const terms = [
        '1. This quotation is valid for 30 days from the issue date.',
        '2. 50% advance payment required to commence work.',
        '3. Balance payment due upon completion before handover.',
        '4. Prices include materials, labor, and standard finishing.',
        '5. Additional work outside scope will be charged separately.',
        '6. Timeline excludes delays from client decisions or permit approvals.',
      ];
      terms.forEach((term, index) => {
        doc.text(term, 50, termsY + 15 + (index * 12), { width: 500 });
      });

      // ── Footer ──
      const footerEmail = quoteData.companyEmail || 'hello.hamts@yahoo.com';
      doc.fontSize(8).font('Helvetica').fill('#999');
      doc.text(`Thank you for your business. For questions, contact us at ${footerEmail}`, 50, 750, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
