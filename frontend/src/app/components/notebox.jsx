const pdfDataExample = {
  courses_id: "1",
  courses_name: "Wow",
  faculties: "engineering",
  courses_type: "inter",
  u_id: 1,
  name: "yes",
  is_anonymous: true,
  pdf_name: "string.pdf",
  pdf_path: "/abc/string.pdf",
};

export default function NoteBox({data}) {
  const pdfName = data['pdf_name'];
  const pdfURL = data['pdf_path'];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfURL;
    link.download = pdfName;
    link.click()
  };

  return (
    <div className="border p-4 rounded-md shadow-md bg-white">
      {/* info */}
      <p><strong>{data.faculties}</strong></p>
      <p><strong>หลักสูตร:</strong> {data.courses_type}</p>
      <p><strong>
        โดย:</strong> {data.name} ({data.is_anonymous ? "Anonymous" : "Public"})
      </p>

      <div className="flex gap-4 mt-4">
        {/* view */}
        <a
          href={pdfURL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          ดู PDF
        </a>

        {/* download */}
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
        >
          ดาวน์โหลด PDF
        </button>
      </div>
    </div>
  )
}