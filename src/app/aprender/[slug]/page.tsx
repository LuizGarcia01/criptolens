import { notFound } from "next/navigation";
import { getLessonBySlug, LESSONS } from "@/lib/lessons";
import LessonTemplate from "@/components/lesson/LessonTemplate";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();
  return <LessonTemplate lesson={lesson} />;
}
