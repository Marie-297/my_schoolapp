"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { TbFiltersFilled } from "react-icons/tb";
import { FaSort } from "react-icons/fa6";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface FilterSortControlsProps {
  grades?: number[];
  subjects?: string[];
  gradeId?: number[];
  filters: ("grade" | "subject" | "gradeId")[];
}

const FilterSortControls: React.FC<FilterSortControlsProps> = ({ grades = [], subjects = [], gradeId = [], filters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleFilter = (grade: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if ( grade !== null ) {
      params.set("grade", grade.toString());
      } else {
      params.delete("grade");
    }
    router.push(`?${params.toString()}`);
  };
  const handleGradeId = (gradeId: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if ( gradeId!== null ) {
      params.set("gradeId", gradeId.toString());
      } else {
      params.delete("gradeId");
    }
    router.push(`?${params.toString()}`);
  }
  const handleSubjectFilter = (subject: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if ( subject !== null ) {
      params.set("subject", subject.toString());
      } else {
      params.delete("subject");
    }
    router.push(`?${params.toString()}`);
  };

  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4 self-end">
      {filters.includes("grade") && grades.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300">
            <TbFiltersFilled size={20} title="Filter by Grade" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem key="all" onClick={() => handleFilter(null)}>
              All Grades
            </DropdownMenuItem>
            {grades.map((grade) => (
              <DropdownMenuItem key={grade} onClick={() => handleFilter(grade)}>
                Grade {grade}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {filters.includes("gradeId") && gradeId.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300">
            <TbFiltersFilled size={20} title="Filter by Grade" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem key="all" onClick={() => handleGradeId(null)}>
              All Grades
            </DropdownMenuItem>
            {gradeId.map((gradeid) => (
              <DropdownMenuItem key={gradeid} onClick={() => handleGradeId(gradeid)}>
                Grade {gradeid}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {filters.includes("subject") && subjects.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300">
            <TbFiltersFilled size={20} title="Filter by Subjects" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem key="all" onClick={() => handleFilter(null)}>
              All Subjects
            </DropdownMenuItem>
            {subjects.map((subject) => (
              <DropdownMenuItem key={subject} onClick={() => handleSubjectFilter(subject)}>
                {subject}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
        title="Sort"
        onClick={() => {
          const currentSort = searchParams.get("sort");
          const newSort = currentSort === "asc" ? "desc" : "asc";
          updateQuery("sort", newSort);
        }}
      >
        <FaSort size={20} />
      </button>
    </div>
  );
};

export default FilterSortControls;
