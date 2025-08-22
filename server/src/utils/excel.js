import * as XLSX from "xlsx";

export function buildWorkbook(submissions) {
  const parents = submissions.map((s) => ({
    ID: s._id?.toString?.() || s.id,
    SubmittedAt: new Date(s.submittedAt).toISOString(),
    ParentName: s.parent.name,
    Email: s.parent.email,
    Phone: s.parent.phone,
    Address: s.parent.address,
    StudyPlan: s.parent.studyPlan,
    ChildrenCount: s.children.length,
    ChildSummary: Array.isArray(s.children)
      ? s.children
          .map((c, i) => `${i + 1}) ${c.name} (${c.age}, ${c.grade})`)
          .join(" | ")
      : "",
  }));

  const children = submissions.flatMap((s) =>
    s.children.map((c, idx) => ({
      ParentID: s._id?.toString?.() || s.id,
      ChildIndex: idx + 1,
      ChildName: c.name,
      Age: c.age,
      Grade: c.grade,
    }))
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(parents),
    "Parents"
  );
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(children),
    "Children"
  );
  return wb;
}
