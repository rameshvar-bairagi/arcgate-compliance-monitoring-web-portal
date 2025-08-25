'use client';

import AddRulePage from "@/app/rules/add/page"; // reuse same component
import { useParams } from "next/navigation";

export default function EditRule() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // normalize

  console.log('edit id', id);

  return <AddRulePage id={id} />;
}
