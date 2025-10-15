"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Pdf {
  name: string;
  url: string;
}

interface Subject {
  name: string;
}

export default function TermPage() {
  const params = useParams();
  const yearParam = params.year;
  const gradeParam = params.grade;

  const decodedYear =
    typeof yearParam === "string" ? yearParam.replace("-", "/") : "";
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [pdfs, setPdfs] = useState<Record<string, Pdf[]>>({}); 
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subjects");
        const data = await res.json();
        const subjectsArray: Subject[] = Array.isArray(data) ? data : data.subjects || [];
        setSubjects(subjectsArray);
        const savedPdfs = JSON.parse(localStorage.getItem("pdfs") || "{}");
        const initialPdfs: Record<string, Pdf[]> = {};
        subjectsArray.forEach((subj) => {
          initialPdfs[subj.name] = savedPdfs[subj.name] || [];
        });
        setPdfs(initialPdfs);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

    const handleUpload = (subjectName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string; // base64 string
      const newPdf: Pdf = { name: file.name, url: base64 };
      setPdfs((prev) => {
        const updated = {
          ...prev,
          [subjectName]: [...prev[subjectName], newPdf],
        };
        localStorage.setItem("pdfs", JSON.stringify(updated));
        return updated;
      });
    };
      reader.readAsDataURL(file);
    };


  const handleDelete = (subjectName: string, pdfName: string) => {
    setPdfs((prev) => ({
      ...prev,
      [subjectName]: prev[subjectName].filter((pdf) => pdf.name !== pdfName),
    }));
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">{decodedYear} Exam Questions for Grade {gradeParam}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subjects.map((subject, index) => (
          <div key={subject.name} className={`p-4 rounded-md shadow-md ${
        index % 3 === 0 ? "bg-blue-100" : index % 3 === 1 ? "bg-purple-100" : "bg-green-100" }`} >
            <h2 className="text-xl font-semibold mb-3">{subject.name}</h2>

            <div className="space-y-2">
              {pdfs[subject.name]?.map((pdf) => (
                <div
                  key={pdf.name}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                >
                  <span>{pdf.name}</span>
                  <div className="space-x-2">
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 text-xs py-1 bg-blue-500 text-white rounded-md"
                    >
                      View
                    </a>
                    <a
                      href={pdf.url}
                      download={pdf.name}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded-md"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => handleDelete(subject.name, pdf.name)}
                      className="px-2 text-xs py-1 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              <label className="px-3 py-2 bg-yellow-500 text-white rounded-md cursor-pointer inline-block mt-2">
                Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleUpload(subject.name, e)}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
