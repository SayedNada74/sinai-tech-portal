"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useAdmin } from "@/context/admin-context";
import { Roadmap, RoadmapNode } from "@/lib/roadmaps-data";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  Clock,
  BookOpen,
  X,
  Check,
  Layers
} from "lucide-react";

export default function AdminRoadmapsPage() {
  const { t, dir, lang } = useApp();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const { roadmaps, addRoadmap, updateRoadmap, deleteRoadmap } = useAdmin();

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = React.useState("");
  const [formDesc, setFormDesc] = React.useState("");
  const [formDuration, setFormDuration] = React.useState("");

  // Nodes field state
  const [nodes, setNodes] = React.useState<RoadmapNode[]>([]);
  const [nodeLabel, setNodeLabel] = React.useState("");
  const [nodeDesc, setNodeDesc] = React.useState("");
  const [nodeDuration, setNodeDuration] = React.useState("");

  const openCreateModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setFormDuration("3 - 6 أشهر");
    setNodes([
      {
        id: `node-1`,
        label: "الأساسيات والمبادئ",
        labelEn: "Basics & Fundamentals",
        description: "تعلم المفاهيم التأسيسية للمجال والمصطلحات الرئيسية.",
        descriptionEn: "Learn foundational concepts and primary terminology.",
        duration: "2-3 أسابيع",
        durationEn: "2-3 weeks",
        resources: []
      }
    ]);
    setModalOpen(true);
  };

  const openEditModal = (r: Roadmap) => {
    setEditingId(r.id);
    setFormTitle(r.title);
    setFormDesc(r.description);
    setFormDuration(r.duration);
    setNodes(r.nodes || []);
    setModalOpen(true);
  };

  const addNodeToForm = () => {
    if (!nodeLabel) return;
    const newNode: RoadmapNode = {
      id: `node-${Date.now()}`,
      label: nodeLabel,
      labelEn: nodeLabel,
      description: nodeDesc || "تطبيق عملي واكتساب المهارة الأساسية.",
      descriptionEn: nodeDesc || "Practical application and skill mastery.",
      duration: nodeDuration || "أسبوعان",
      durationEn: nodeDuration || "2 weeks",
      resources: []
    };
    setNodes([...nodes, newNode]);
    setNodeLabel("");
    setNodeDesc("");
    setNodeDuration("");
  };

  const removeNodeFromForm = (idx: number) => {
    setNodes(nodes.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) {
      alert(t("يرجى إدخال عنوان مسار التعلم.", "Please enter roadmap title."));
      return;
    }

    if (editingId) {
      updateRoadmap(editingId, {
        title: formTitle,
        titleEn: formTitle,
        description: formDesc || "مسار تعليمي متكامل للمبتدئين والمتقدمين.",
        descriptionEn: formDesc || "Comprehensive learning path for students.",
        duration: formDuration || "6 أشهر",
        durationEn: formDuration || "6 months",
        nodes
      });
      alert(t("✅ تم تحديث مسار التعلم بنجاح.", "✅ Learning roadmap updated successfully."));
    } else {
      addRoadmap({
        title: formTitle,
        titleEn: formTitle,
        description: formDesc || "مسار تعليمي متكامل للمبتدئين والمتقدمين.",
        descriptionEn: formDesc || "Comprehensive learning path for students.",
        duration: formDuration || "6 أشهر",
        durationEn: formDuration || "6 months",
        nodes
      });
      alert(t("✨ تم إضافة مسار التعلم الجديد بنجاح.", "✨ New learning roadmap added successfully."));
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("إدارة وخريطة مسارات التعلّم", "Career Roadmaps Management")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "تصميم وتنسيق خطط التعلم التفاعلية للطلاب والمراحل التأسيسية للمجالات التقنية.",
              "Design and structure interactive learning paths and technical career stages."
            )}
          </p>
        </div>

        <Button onClick={openCreateModal} className="gap-2 text-xs font-bold shrink-0">
          <Plus className="h-4 w-4" />
          {t("إنشاء مسار تعلم جديد", "Create New Roadmap")}
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmaps.map((r) => (
          <Card key={r.id} className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {r.nodes.length} {t("مراحل دراسية", "stages")}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold">
                  <Clock className="h-3 w-3" />
                  <span>{lang === "ar" ? r.duration : (r.durationEn || r.duration)}</span>
                </div>
              </div>

              <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50 mt-2">
                {lang === "ar" ? r.title : (r.titleEn || r.title)}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 line-clamp-2">
                {lang === "ar" ? r.description : (r.descriptionEn || r.description)}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-3 text-xs space-y-2">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl space-y-1.5 border border-zinc-100 dark:border-zinc-850">
                <span className="text-[9px] font-bold text-zinc-400 block">{t("المرحلة الأولى البارزة:", "First Stage:")}</span>
                <span className="font-bold text-xs text-violet-600 dark:text-violet-400 block">
                  {r.nodes[0] ? (lang === "ar" ? r.nodes[0].label : (r.nodes[0].labelEn || r.nodes[0].label)) : t("لا توجد مراحل", "No stages")}
                </span>
              </div>
            </CardContent>

            <div className="p-4 pt-0 flex gap-2 border-t border-transparent">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal(r)}
                className="flex-1 text-[10px] font-bold h-8 gap-1 cursor-pointer"
              >
                <Edit2 className="h-3 w-3" />
                {t("تعديل الخطوات", "Edit Steps")}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm(t(`حذف مسار [${r.title}] نهائياً؟`, `Permanently delete [${r.title}]?`))) {
                    deleteRoadmap(r.id);
                  }
                }}
                className="text-[10px] h-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {modalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-hidden">
          <Card className="w-full max-w-xl max-h-[85vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <CardTitle className="text-base font-bold">
                {editingId ? t("تعديل مسار التعلم الأكاديمي", "Edit Learning Roadmap") : t("تصميم مسار تعلم جديد", "Design New Learning Roadmap")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 overflow-y-auto flex-1 space-y-4">
              <form id="roadmap-form" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("عنوان المسار", "Roadmap Title")}</label>
                    <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Web Development Roadmap" className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("المدة الزمنية المتوقعة", "Expected Duration")}</label>
                    <Input value={formDuration} onChange={(e) => setFormDuration(e.target.value)} placeholder="3-6 months" className="text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الوصف والهدف من المسار", "Description & Goal")}</label>
                  <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
                </div>

                {/* Nodes builder */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-3">
                  <h4 className="font-extrabold text-xs text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-violet-600" />
                    {t(`مراحل وخطوات التعلم (${nodes.length})`, `Learning Stages (${nodes.length})`)}
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {nodes.map((nd, index) => (
                      <div key={nd.id} className="flex justify-between items-center p-2.5 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800 text-xs">
                        <div>
                          <span className="font-bold text-zinc-800 dark:text-zinc-200 block">{index + 1}. {nd.label}</span>
                          <span className="text-[10px] text-zinc-400">{nd.duration} · {nd.description}</span>
                        </div>
                        <button type="button" onClick={() => removeNodeFromForm(index)} className="text-red-500 p-1 cursor-pointer">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add node inline */}
                  <div className="p-3 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2 bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div className="grid grid-cols-2 gap-2">
                      <Input value={nodeLabel} onChange={(e) => setNodeLabel(e.target.value)} placeholder={t("اسم المرحلة (مثال: تعلم React)", "Stage Label (e.g. Learn React)")} className="text-xs" />
                      <Input value={nodeDuration} onChange={(e) => setNodeDuration(e.target.value)} placeholder={t("المدة (مثال: أسبوعان)", "Duration (e.g. 2 weeks)")} className="text-xs" />
                    </div>
                    <div className="flex gap-2">
                      <Input value={nodeDesc} onChange={(e) => setNodeDesc(e.target.value)} placeholder={t("وصف مهارات المرحلة...", "Stage skills description...")} className="text-xs flex-1" />
                      <Button type="button" size="sm" onClick={addNodeToForm} className="text-xs font-bold shrink-0">
                        + {t("إضافة مرحلة", "Add Stage")}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex gap-2 justify-end bg-zinc-50/50 dark:bg-zinc-950/50">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)} className="text-xs font-bold cursor-pointer">
                {t("إلغاء", "Cancel")}
              </Button>
              <Button type="submit" form="roadmap-form" size="sm" className="text-xs font-bold cursor-pointer">
                {editingId ? t("حفظ التغييرات", "Save Changes") : t("نشر الخريطة", "Publish Roadmap")}
              </Button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
