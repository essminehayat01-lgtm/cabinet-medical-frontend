import { jsPDF } from 'jspdf';

export function exporterOrdonnancePDF(ordonnance, patient) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text('Cabinet médical', 105, y, { align: 'center' });
  y += 8;
  doc.setFontSize(12);
  doc.text(ordonnance.medecin ? ordonnance.medecin.nom : '', 105, y, { align: 'center' });
  y += 6;
  doc.line(20, y, 190, y);
  y += 14;

  doc.setFontSize(16);
  doc.text('ORDONNANCE', 105, y, { align: 'center' });
  y += 14;

  doc.setFontSize(12);
  doc.text(`Date : ${ordonnance.date}`, 20, y);
  y += 8;
  doc.text(`Patient : ${patient.nom} ${patient.prenom}`, 20, y);
  y += 8;
  doc.text(`Né(e) le : ${patient.date_naissance}`, 20, y);
  y += 14;

  doc.setFont('helvetica', 'bold');
  doc.text('Prescription :', 20, y);
  doc.setFont('helvetica', 'normal');
  y += 10;

  ordonnance.medicaments.forEach((m, i) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    const ligne =
      `${i + 1}. ${m.nom}` +
      (m.dosage ? ` - ${m.dosage}` : '') +
      (m.duree ? ` - ${m.duree}` : '');
    doc.text(ligne, 25, y);
    y += 8;
  });

  if (ordonnance.remarques) {
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('Remarques :', 20, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    const lignes = doc.splitTextToSize(ordonnance.remarques, 170);
    doc.text(lignes, 20, y);
    y += lignes.length * 6;
  }

  y += 20;
  if (y > 270) {
    doc.addPage();
    y = 30;
  }
  doc.text('Signature du médecin', 140, y);

  doc.save(`ordonnance_${patient.nom}_${ordonnance.date}.pdf`);
}