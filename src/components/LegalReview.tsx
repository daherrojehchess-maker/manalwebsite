import { TriangleAlert } from "lucide-react";

export function LegalReviewBanner() {
  return (
    <div role="note" className="mb-8 flex gap-3 rounded-lg border-2 border-warning bg-[#FFF7E6] p-4 text-[15px]">
      <TriangleAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
      <p>
        <strong>טיוטה — נדרשת בדיקה של בעל העסק ושל עורך דין.</strong> העמוד כולל רשימת נושאים בלבד ואינו נוסח משפטי. אין לפרסם את האתר לפני החלפת התוכן בנוסח מאושר.
      </p>
    </div>
  );
}
