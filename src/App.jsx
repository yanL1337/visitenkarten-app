import React, { useState, useMemo, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "./assets/logo.png";
import './App.css';

export default function BusinessCardGenerator() {
  const [formData, setFormData] = useState({
    firstName: "Yan Luka",
    lastName: "Keita",
    position: "Verwaltung - Öffentlichkeitsarbeit",
    company: "Reha-Zentrum Bad Pyrmont",
    phone: "+49 5281 2419",
    fax: "+49 5281 9126490",
    email: "yan-luka.keita@rehazentrum-bp.de",
    website: "www.deutsche-rentenversicherung-bund.de",
    address: "Schulstraße 2, 31812 Bad Pyrmont, Germany",
  });
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateVCard = useMemo(() => {
    return `BEGIN:VCARD\nVERSION:3.0\nN:${formData.lastName};${formData.firstName};;;\nFN:${formData.firstName} ${formData.lastName}\nORG:${formData.company}\nTITLE:${formData.position}\nTEL;WORK:${formData.phone}\nTEL;FAX:${formData.fax}\nEMAIL:${formData.email}\nADR;WORK:;;${formData.address.replace(/,/g, ";")}\nURL:${formData.website}\nEND:VCARD`;
  }, [formData]);

  const downloadPDF = async () => {
    const pdf = new jsPDF({ unit: "mm", format: [85, 55], orientation: "landscape" });

    if (frontRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const frontCanvas = await html2canvas(frontRef.current, { scale: 3, useCORS: true });
      const frontImgData = frontCanvas.toDataURL("image/png");
      pdf.addImage(frontImgData, "PNG", 0, 0, 85, 55);
    }

    pdf.addPage();

    backRef.current.style.display = "flex";
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (backRef.current) {
      const backCanvas = await html2canvas(backRef.current, { scale: 3, useCORS: true });
      const backImgData = backCanvas.toDataURL("image/png");
      pdf.addImage(backImgData, "PNG", 0, 0, 85, 55);
    }

    backRef.current.style.display = "none";

    pdf.save("visitenkarte.pdf");
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Visitenkarte erstellen</h2>

      <div className="w-96 p-4 shadow-lg bg-white border">
        <div className="flex flex-col gap-3">
          <input type="text" name="firstName" placeholder="Vorname" className="p-2 border rounded" value={formData.firstName} onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Nachname" className="p-2 border rounded" value={formData.lastName} onChange={handleChange} />
          <input type="text" name="position" placeholder="Position" className="p-2 border rounded" value={formData.position} onChange={handleChange} />
          <input type="text" name="phone" placeholder="Telefon" className="p-2 border rounded" value={formData.phone} onChange={handleChange} />
          <input type="text" name="fax" placeholder="Fax" className="p-2 border rounded" value={formData.fax} onChange={handleChange} />
          <input type="email" name="email" placeholder="E-Mail" className="p-2 border rounded" value={formData.email} onChange={handleChange} />
          <button onClick={downloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded">PDF herunterladen</button>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center bg-white p-6 shadow-lg">
        <h3 className="text-xl font-semibold">Visitenkarten-Vorschau</h3>

        <div ref={frontRef} className="w-[85mm] h-[55mm] bg-white p-4 shadow-lg flex flex-col justify-end text-left relative pb-4">
          <img src={logo} alt="Firmenlogo" className="absolute top-2 right-2 w-48" />
          <h2 className="text-[10px] font-bold">{formData.firstName} {formData.lastName}</h2>
          <p className="text-[8px] font-semibold">{formData.position}</p>
          <p className="text-[8px]">{formData.company}</p>
          <p className="text-[8px]">{formData.address}</p>
          <p className="text-[8px]">Telefon: {formData.phone}</p>
          <p className="text-[8px]">Fax: {formData.fax}</p>
          <p className="text-[8px]">{formData.email}</p>
          <p className="text-[8px]">{formData.website}</p>
        </div>
      </div>

      <div ref={backRef} className="hidden w-[85mm] h-[55mm] bg-white p-4 shadow-lg flex justify-center items-center">
        <QRCodeSVG value={generateVCard} size={100} />
      </div>
    </div>
  );
}
