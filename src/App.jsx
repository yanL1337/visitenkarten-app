import React, { useState, useMemo, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "./assets/logo.png";
import './App.css';

export default function BusinessCardGenerator() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    company: "Reha-Zentrum Bad Pyrmont",
    phone: "",
    fax: "",
    email: "",
    website: "www.rehazentrum-badpyrmont.de",
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
    const pdf = new jsPDF({ unit: "mm", format: [85, 55], orientation: "landscape", pdfVersion: "1.4" });

    if (frontRef.current) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const frontCanvas = await html2canvas(frontRef.current, { scale: 5, backgroundColor: null, useCORS: true });
      const frontImgData = frontCanvas.toDataURL("image/png", 1.0);
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
    <div className="flex flex-col items-center p-4 bg-gray-900 text-gray-200 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Visitenkarte erstellen</h2>
  
      <div className="w-96 p-4 shadow-lg bg-gray-800 border border-gray-700 rounded-lg">
        <div className="flex flex-col gap-3">
          <input type="text" name="firstName" placeholder="Vorname" className="p-2 border rounded bg-gray-700 text-white" value={formData.firstName} onChange={handleChange} />
          <input type="text" name="lastName" placeholder="Nachname" className="p-2 border rounded bg-gray-700 text-white" value={formData.lastName} onChange={handleChange} />
          {/* Position als Dropdown-Menü */}

<select
  name="position"
  className="p-2 border rounded bg-gray-700 text-white"
  value={formData.position}
  onChange={handleChange}
>
  <option value="" disabled>Wähle eine Position</option>
  <option value="Stationsarzt">Stationsarzt</option>
  <option value="Physiotherapeut">Physiotherapeut</option>
  <option value="Ergotherapeut">Ergotherapeut</option>
  <option value="Pflegekraft">Pflegekraft</option>
  <option value="Sozialarbeiter">Sozialarbeiter</option>
  <option value="Psychologe">Psychologe</option>
  <option value="Verwaltung">Verwaltung</option>
  <option value="Rezeption">Rezeption</option>
  <option value="Ernährungsberater">Ernährungsberater</option>
</select>

          <div className="flex flex-col gap-3">
 
  <select
    name="location"
    className="p-2 border rounded bg-gray-700 text-white"
    onChange={(e) => {
      const selectedLocation = e.target.value;
      let newAddress = "";

      if (selectedLocation === "Klinik Weser") {
        newAddress = "Schulstraße 2, 31812 Bad Pyrmont";
      } else if (selectedLocation === "Brunswiek") {
        newAddress = "Auf der Schanze 5, 31812 Bad Pyrmont";
      } else if (selectedLocation === "Friedrichshöhe") {
        newAddress = "Forstweg 2, 31812 Bad Pyrmont";
      }

      setFormData((prev) => ({
        ...prev,
        address: newAddress,
      }));
    }}
  >
    <option value="" disabled selected>Wähle einen Standort</option>
    <option value="Klinik Weser">Klinik Weser</option>
    <option value="Brunswiek">Brunswiek</option>
    <option value="Friedrichshöhe">Friedrichshöhe</option>
  </select>

  {/* Zeigt die aktuelle Adresse basierend auf der Auswahl an */}
  <input type="text" name="address" className="p-2 border rounded bg-gray-700 text-white" value={formData.address} readOnly />
</div>

          <input type="text" name="phone" placeholder="Telefon" className="p-2 border rounded bg-gray-700 text-white" value={formData.phone} onChange={handleChange} />
          <input type="text" name="fax" placeholder="Fax" className="p-2 border rounded bg-gray-700 text-white" value={formData.fax} onChange={handleChange} />
          <input type="email" name="email" placeholder="E-Mail" className="p-2 border rounded bg-gray-700 text-white" value={formData.email} onChange={handleChange} />
          <button onClick={downloadPDF} className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600">
            PDF herunterladen
          </button>
        </div>
      </div>
  
      <div className="mt-8 flex flex-col items-center bg-gray-800 p-6 shadow-lg rounded-lg w-[90%] max-w-lg">
      <h3 className="text-xl font-semibold">Visitenkarten-Vorschau</h3>
  
        {/* Vorderseite der Visitenkarte bleibt weiß */}
        {formData.firstName || formData.lastName ? (
    <div ref={frontRef} className="w-[85mm] h-[55mm] bg-white text-black p-4 shadow-lg flex flex-col justify-end text-left relative pb-4 rounded-lg">
      <img src={logo} alt="Firmenlogo" crossOrigin="anonymous" className="absolute top-2 right-2 w-48" />
      <h2 className="text-[10px] font-bold">{formData.firstName} {formData.lastName}</h2>
      <p className="text-[8px] font-semibold">{formData.position}</p>
      <p className="text-[8px]">{formData.company}</p>
      <p className="text-[8px]">{formData.address}</p>
      <p className="text-[8px]">Telefon: {formData.phone}</p>
      <p className="text-[8px]">Fax: {formData.fax}</p>
      <p className="text-[8px]">{formData.email}</p>
      <p className="text-[8px]">{formData.website}</p>
    </div>
) : (
    <p className="text-gray-400 text-sm">Gib deine Daten ein, um eine Vorschau zu sehen.</p>
)}

      </div>
  
      {/* QR-Code auf der Rückseite */}
      <div ref={backRef} className="hidden w-[85mm] h-[55mm] bg-white text-black p-4 shadow-lg flex justify-center items-center rounded-lg">
        <QRCodeSVG value={generateVCard} size={100} />
      </div>
    </div>
  );
  
}