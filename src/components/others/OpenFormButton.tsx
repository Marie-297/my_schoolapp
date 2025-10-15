"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FormModal from "@/components/others/FormModal";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FormModalBtn from "./FormModalButton";

type OpenFormButtonProps = {
  table: "teacher" | "student" | "parent" | "subject" | "class" | "lesson" | "exam" | "midterm" | "result" | "attendance" | "event" | "announcement";
  type: "create" | "update" | "delete";
};

const OpenFormButton = ({ table, type }: OpenFormButtonProps) => {
  const [open, setOpen] = useState(false);
  const [relatedData, setRelatedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/formButton", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, type }),
      });
      const data = await response.json();
      setRelatedData(data.relatedData);
      setOpen(true); // Open the modal only after data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={fetchData} className="flex items-center gap-2">
        <Plus size={16} /> {loading ? "Loading..." : `${type} a ${table}`}
      </Button>

      {/* Modal that opens FormModal after data is fetched */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{`Register to ${type} a ${table}`}</DialogTitle>
          {relatedData && <FormModalBtn table={table} type={type} relatedData={relatedData} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OpenFormButton;
