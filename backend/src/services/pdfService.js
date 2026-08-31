import PDFDocument from 'pdfkit';

/**
 * Generate a professional PDF for a quote
 * @param {Object} quoteData - Quote data with lead, lineItems, totals, etc.
 * @returns {Buffer} PDF buffer
 */
export const generateQuotePDF = async (quoteData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Company branding
      const companyName = quoteData.companyName || 'Hulul Al Madina Interiors';
      const companyAddress = quoteData.companyAddress || 'Dubai, United Arab Emirates';
      const companyContact = [quoteData.companyEmail, quoteData.companyPhone].filter(Boolean).join(' | ') || '';
      
      doc.fontSize(24).font('Helvetica-Bold').fill('#1A1817').text(companyName, 50, 50);
      doc.fontSize(10).font('Helvetica').fill('#666').text(companyAddress, 50, 80);
      if (companyContact) {
        doc.fontSize(10).font('Helvetica').fill('#666').text(companyContact, 50, 95);
      }

      // Quote title and number
      doc.fontSize(18).font('Helvetica-Bold').fill('#C4795A').text('OFFICIAL QUOTATION', 400, 50, { align: 'right' });
      doc.fontSize(12).font('Helvetica-Bold').fill('#1A1817').text(`Quote #: ${quoteData.quoteNumber}`, 400, 75, { align: 'right' });
      
      // Date and validity
      const issueDate = quoteData.createdAt ? new Date(quoteData.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('en-GB');
      const validUntil = quoteData.validUntil ? new Date(quoteData.validUntil).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';
      
      doc.fontSize(10).font('Helvetica').fill('#666').text(`Issue Date: ${issueDate}`, 400, 95, { align: 'right' });
      doc.fontSize(10).font('Helvetica').fill('#666').text(`Valid Until: ${validUntil}`, 400, 110, { align: 'right' });

      // Horizontal line
      doc.moveTo(50, 130).lineTo(550, 130).strokeColor('#E5E5E5').lineWidth(1).stroke();

      // Client information
      doc.fontSize(14).font('Helvetica-Bold').fill('#1A1817').text('Bill To:', 50, 150);
      doc.fontSize(12).font('Helvetica-Bold').fill('#333').text(quoteData.leadName || 'Client Name', 50, 170);
      doc.fontSize(10).font('Helvetica').fill('#666').text(quoteData.leadEmail || 'client@email.com', 50, 185);
      if (quoteData.leadPhone) {
        doc.fontSize(10).font('Helvetica').fill('#666').text(quoteData.leadPhone, 50, 200);
      }

      // Line items table header
      const tableTop = 250;
      doc.moveTo(50, tableTop - 10).lineTo(550, tableTop - 10).strokeColor('#1A1817').lineWidth(1).stroke();
      
      doc.fontSize(10).font('Helvetica-Bold').fill('#1A1817');
      doc.text('Description', 50, tableTop, { width: 200 });
      doc.text('Category', 260, tableTop, { width: 80 });
      doc.text('Qty', 350, tableTop, { width: 40, align: 'center' });
      doc.text('Unit Price', 400, tableTop, { width: 70, align: 'right' });
      doc.text('Total', 480, tableTop, { width: 70, align: 'right' });

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).strokeColor('#E5E5E5').lineWidth(0.5).stroke();

      // Line items
      let y = tableTop + 25;
      const items = quoteData.lineItems || quoteData.items || [];
      
      items.forEach((item, index) => {
        const lineTotal = (item.quantity || 1) * (item.unitPrice || 0);
        
        doc.fontSize(9).font('Helvetica').fill('#333');
        doc.text(item.description || '', 50, y, { width: 200 });
        doc.text(item.category || '', 260, y, { width: 80 });
        doc.text(String(item.quantity || 1), 350, y, { width: 40, align: 'center' });
        doc.text(`${(item.unitPrice || 0).toLocaleString()} ${quoteData.currency || 'AED'}`, 400, y, { width: 70, align: 'right' });
        doc.text(`${lineTotal.toLocaleString()} ${quoteData.currency || 'AED'}`, 480, y, { width: 70, align: 'right' });
        
        y += 20;
        
        // Alternate row background
        if (index % 2 === 0) {
          doc.rect(50, y - 20, 500, 20).fill('#F9F9F9');
        }
      });

      // Table bottom line
      doc.moveTo(50, y).lineTo(550, y).strokeColor('#1A1817').lineWidth(1).stroke();

      // Totals section
      const totalsX = 400;
      let totalsY = y + 20;
      
      const subtotal = quoteData.subtotal || 0;
      const discount = quoteData.discount || 0;
      const tax = quoteData.tax || 0;
      const grandTotal = quoteData.grandTotal || 0;

      doc.fontSize(10).font('Helvetica').fill('#666');
      doc.text('Subtotal:', totalsX, totalsY, { width: 70, align: 'right' });
      doc.text(`${subtotal.toLocaleString()} ${quoteData.currency || 'AED'}`, totalsX + 80, totalsY, { width: 70, align: 'right' });
      
      totalsY += 20;
      if (discount > 0) {
        doc.fontSize(10).font('Helvetica').fill('#DC2626');
        doc.text('Discount:', totalsX, totalsY, { width: 70, align: 'right' });
        doc.text(`-${discount.toLocaleString()} ${quoteData.currency || 'AED'}`, totalsX + 80, totalsY, { width: 70, align: 'right' });
        totalsY += 20;
      }
      
      doc.fontSize(10).font('Helvetica').fill('#666');
      doc.text('UAE VAT (5%):', totalsX, totalsY, { width: 70, align: 'right' });
      doc.text(`${tax.toLocaleString()} ${quoteData.currency || 'AED'}`, totalsX + 80, totalsY, { width: 70, align: 'right' });
      
      totalsY += 25;
      doc.moveTo(totalsX, totalsY - 10).lineTo(550, totalsY - 10).strokeColor('#C4795A').lineWidth(2).stroke();
      
      doc.fontSize(14).font('Helvetica-Bold').fill('#C4795A');
      doc.text('Grand Total:', totalsX, totalsY, { width: 70, align: 'right' });
      doc.text(`${grandTotal.toLocaleString()} ${quoteData.currency || 'AED'}`, totalsX + 80, totalsY, { width: 70, align: 'right' });

      // Terms and conditions
      doc.fontSize(10).font('Helvetica-Bold').fill('#1A1817');
      doc.text('Terms & Conditions:', 50, totalsY + 50);
      
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
        doc.text(term, 50, totalsY + 65 + (index * 12), { width: 500 });
      });

      // Footer
      const footerEmail = quoteData.companyEmail || 'hello.hamts@yahoo.com';
      doc.fontSize(8).font('Helvetica').fill('#999');
      doc.text(`Thank you for your business. For questions, contact us at ${footerEmail}`, 50, 750, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
