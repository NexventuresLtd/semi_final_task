import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function waitForImages(node) {
  const images = Array.from(node.querySelectorAll("img"));
  return Promise.all(
    images.map((img) => {
      // img.complete is true once loading has finished, success OR failure —
      // if that already happened before this function ran, onload/onerror
      // will never fire again, so we must resolve immediately here instead
      // of waiting on events that already happened in the past.
      if (img.complete) return Promise.resolve();

      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    })
  );
}
export async function exportDocumentPdf(nodeRef, filename = "request") {
  const node = nodeRef.current;
  if (!node) return;

  await waitForImages(node); // ← new — ensures signatures are actually painted first

  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

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