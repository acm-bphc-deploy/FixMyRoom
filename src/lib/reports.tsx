// Dynamically import heavy pdf libraries when needed to reduce initial bundle size

type RequestForReport = {
  id: string
  name: string
  studentId: string
  email: string
  phone: string
  building: string
  roomNo: string
  category: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in-progress" | "completed"
  dateSubmitted: string
  assignedTo?: string
  isDeleted?: boolean
}

export async function exportRequestsPdf(
  requests: RequestForReport[],
  options?: { title?: string },
) {
  const title = options?.title ?? "Maintenance Report"
  const { default: jsPDF } = await import("jspdf")
  const { default: autoTable } = await import("jspdf-autotable")
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })

  // Header
  doc.setFontSize(16)
  doc.text(title, 40, 40)
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 58)

  // Summary
  const total = requests.length
  const pending = requests.filter((r) => r.status === "pending" && !r.isDeleted).length
  const inProgress = requests.filter((r) => r.status === "in-progress" && !r.isDeleted).length
  const completed = requests.filter((r) => r.status === "completed" && !r.isDeleted).length
  const deleted = requests.filter((r) => r.isDeleted).length

  const summary = `Total: ${total}   Pending: ${pending}   In Progress: ${inProgress}   Completed: ${completed}   Deleted: ${deleted}`
  doc.setFontSize(11)
  doc.text(summary, 40, 78)

  // Table
  autoTable(doc, {
    startY: 100,
    head: [
      ["Student ID", "Name", "Hostel", "Room", "Category", "Priority", "Status", "Assigned To", "Submitted", "Deleted"],
    ],
    body: requests.map((r) => [
      r.studentId,
      r.name,
      getHostelName(r.building),
      r.roomNo,
      capitalize(r.category),
      capitalize(r.priority),
      r.status === "in-progress" ? "In Progress" : capitalize(r.status),
      r.assignedTo || "-",
      new Date(r.dateSubmitted).toLocaleString(),
      r.isDeleted ? "Yes" : "No",
    ]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [37, 99, 235] }, // blue-600
    alternateRowStyles: { fillColor: [245, 247, 250] },
    didDrawPage: (data) => {
      // Footer
      const pageCount = doc.getNumberOfPages()
      doc.setFontSize(9)
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, 40, doc.internal.pageSize.getHeight() - 24)
    },
  })

  const filename = `maintenance-report-${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}

function capitalize(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function getHostelName(code: string) {
  const map: Record<string, string> = {
    A: "Hostel A",
    B: "Hostel B",
    C: "Hostel C",
    D: "Hostel D",
  }
  return map[code] ?? code
}