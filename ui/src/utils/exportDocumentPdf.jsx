import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Renders a DOM node (the signed template document) to a PDF exactly as
 * it appears on screen — signatures, layout, logo, everything — rather
 * than reconstructing the data as a table. This is the "official record"
 * export, distinct from RequestsTable's bulk data-table export.
 */
export async function exportDocumentPdf(nodeRef, filename = "request") {
  const node = nodeRef.current;
  if (!node) return;

  const canvas = await html2canvas(node, {
    scale: 2, // sharper output for a document meant to be printed/filed
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20; // 10mm margin each side
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // If content is taller than one page, add extra pages by slicing the canvas
  let heightLeft = imgHeight;
  let position = 10;

  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - 20;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;
  }

  pdf.save(`${filename}.pdf`);
}