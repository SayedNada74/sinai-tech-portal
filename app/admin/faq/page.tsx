"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useAdmin } from "@/context/admin-context";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  BookmarkCheck,
  Search,
  Settings,
  Save,
  MessageSquare,
  Activity,
  Play
} from "lucide-react";

import { useToast } from "@/components/ui/toast";

export default function FaqAndAiSettingsPage() {
  const { t, dir, lang } = useApp();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const {
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    aiConfig,
    updateAiConfig
  } = useAdmin();

  const [activeTab, setActiveTab] = React.useState<"faq" | "ai">("faq");
  const [searchTerm, setSearchTerm] = React.useState("");

  // FAQ Modal states
  const [faqModalOpen, setFaqModalOpen] = React.useState(false);
  const [editingFaqId, setEditingFaqId] = React.useState<string | null>(null);

  // FAQ Form fields
  const [faqQuestion, setFaqQuestion] = React.useState("");
  const [faqAnswer, setFaqAnswer] = React.useState("");
  const [faqCategory, setFaqCategory] = React.useState("التسجيل");
  const [faqPinned, setFaqPinned] = React.useState(false);

  // AI Prompt config fields
  const [sysPrompt, setSysPrompt] = React.useState(aiConfig.systemPrompt);
  const [tempVal, setTempVal] = React.useState(aiConfig.temperature || 0.7);
  const [suggestedPills, setSuggestedPills] = React.useState<string>(
    aiConfig.suggestedReplies.join("\n")
  );

  React.useEffect(() => {
    setSysPrompt(aiConfig.systemPrompt);
    setTempVal(aiConfig.temperature || 0.7);
    setSuggestedPills(aiConfig.suggestedReplies.join("\n"));
  }, [aiConfig]);

  // Filtering FAQs
  const filteredFaqs = React.useMemo(() => {
    return faqs.filter((f) => {
      const q = searchTerm.toLowerCase().trim();
      return !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    });
  }, [faqs, searchTerm]);

  const openAddFaqModal = () => {
    setEditingFaqId(null);
    setFaqQuestion("");
    setFaqAnswer("");
    setFaqCategory("التسجيل");
    setFaqPinned(false);
    setFaqModalOpen(true);
  };

  const openEditFaqModal = (f: any) => {
    setEditingFaqId(f.id);
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setFaqCategory(f.category);
    setFaqPinned(f.pinned);
    setFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion || !faqAnswer) {
      toast(t("⚠️ يرجى إدخال نص السؤال والإجابة الشاملة.", "⚠️ Please enter question and detailed answer."), "error");
      return;
    }

    if (editingFaqId) {
      updateFaq(editingFaqId, {
        question: faqQuestion,
        answer: faqAnswer,
        category: faqCategory,
        pinned: faqPinned
      });
      toast(t("✨ تم تحديث السؤال الشائع بنجاح!", "✨ FAQ item updated successfully!"), "success");
    } else {
      addFaq({
        question: faqQuestion,
        answer: faqAnswer,
        category: faqCategory,
        pinned: faqPinned
      });
      toast(t("✨ تم إضافة السؤال الشائع بنجاح!", "✨ FAQ item added successfully!"), "success");
    }
    setFaqModalOpen(false);
  };

  const handleSaveAiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const pills = suggestedPills.split("\n").map((s) => s.trim()).filter(Boolean);
    updateAiConfig({
      systemPrompt: sysPrompt,
      temperature: tempVal,
      suggestedReplies: pills
    });
    toast(t("⚙️ تم تحديث قواعد وإتاحة نموذج الذكاء الاصطناعي بنجاح!", "⚙️ AI model knowledge base updated successfully!"), "success");
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("قاعدة المعرفة والذكاء الاصطناعي", "Knowledge Base & AI Prompting")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "إدارة الأسئلة الشائعة للطلاب وتخصيص الملقن البرمجي للمساعد الذكي بالموقع.",
              "Manage student FAQs, system knowledge base, and AI Assistant system prompts."
            )}
          </p>
        </div>

        {/* Tab selector buttons */}
        <div className="flex gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
          <Button
            variant={activeTab === "faq" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("faq")}
            className="text-xs font-bold gap-1.5 h-8 cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {t("الأسئلة الشائعة (FAQ)", "FAQ Center")}
          </Button>

          <Button
            variant={activeTab === "ai" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("ai")}
            className="text-xs font-bold gap-1.5 h-8 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            {t("ملقن الذكاء الاصطناعي", "AI System Prompt")}
          </Button>
        </div>
      </div>

      {activeTab === "faq" ? (
        <div className="space-y-4">
          {/* Controls */}
          <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-3">
              <div className="relative flex-1">
                <Search className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                <Input
                  type="text"
                  placeholder={t("ابحث في نص الأسئلة والإجابات...", "Search questions or answers...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={lang === "ar" ? "pr-10" : "pl-10"}
                />
              </div>

              <Button onClick={openAddFaqModal} className="gap-2 text-xs font-bold shrink-0">
                <Plus className="h-4 w-4" />
                {t("إضافة سؤال شائع جديد", "Add New FAQ")}
              </Button>
            </CardContent>
          </Card>

          {/* FAQs List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFaqs.map((f) => (
              <Card key={f.id} className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {f.category}
                    </Badge>
                    {f.pinned && (
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/30 text-[9px] border-transparent">
                        📌 {t("مثبت بأعلى القائمة", "Pinned")}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-2">
                    {f.question}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-3 text-xs">
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {f.answer}
                  </p>
                </CardContent>

                <div className="p-4 pt-0 flex gap-2 border-t border-transparent">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditFaqModal(f)}
                    className="flex-1 text-[10px] font-bold h-8 gap-1 cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" />
                    {t("تعديل", "Edit")}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(t("حذف هذا السؤال نهائياً؟", "Delete this FAQ item?"))) {
                        deleteFaq(f.id);
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

          {faqModalOpen && mounted && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-hidden">
              <Card className="w-full max-w-lg max-h-[85vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
                  <CardTitle className="text-base font-bold">
                    {editingFaqId ? t("تعديل السؤال الشائع", "Edit FAQ Item") : t("إضافة سؤال شائع جديد", "Add New FAQ Item")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 overflow-y-auto flex-1 space-y-4">
                  <form id="faq-form" onSubmit={handleSaveFaq} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("نص السؤال الشائع", "FAQ Question")}</label>
                      <Input value={faqQuestion} onChange={(e) => setFaqQuestion(e.target.value)} placeholder="كيف يمكنني حساب معدلي الفصلي؟" className="text-xs" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الإجابة الشاملة والدقيقة", "Detailed Answer")}</label>
                      <textarea value={faqAnswer} onChange={(e) => setFaqAnswer(e.target.value)} rows={4} className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
                    </div>
                  </form>
                </CardContent>
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex gap-2 justify-end bg-zinc-50/50 dark:bg-zinc-950/50">
                  <Button type="button" variant="outline" size="sm" onClick={() => setFaqModalOpen(false)} className="text-xs font-bold cursor-pointer">
                    {t("إلغاء", "Cancel")}
                  </Button>
                  <Button type="submit" form="faq-form" size="sm" className="text-xs font-bold cursor-pointer">
                    {editingFaqId ? t("تحديث السؤال", "Update FAQ") : t("حفظ السؤال", "Save FAQ")}
                  </Button>
                </div>
              </Card>
            </div>,
            document.body
          )}
        </div>
      ) : (
        /* AI Config Form */
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-amber-500" />
              {t("إعدادات ملقن وقواعد المساعد الأكاديمي الذكي", "AI System Prompt & Assistant Configuration")}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("صياغة التوجيهات التي يعتمد عليها نموذج الذكاء الاصطناعي لإرشاد الطلاب.", "Configure system prompt rules and guidelines for AI student counselor.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            <form onSubmit={handleSaveAiConfig} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {t("الملقن الأساسي (System Prompt)", "System Prompt")}
                </label>
                <textarea
                  value={sysPrompt}
                  onChange={(e) => setSysPrompt(e.target.value)}
                  rows={5}
                  className="w-full p-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 font-mono leading-relaxed focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {t("الأسئلة والاقتراحات السريعة المقترحة (كل سؤال في سطر جديد)", "Suggested Quick Questions (One per line)")}
                </label>
                <textarea
                  value={suggestedPills}
                  onChange={(e) => setSuggestedPills(e.target.value)}
                  rows={4}
                  className="w-full p-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 leading-relaxed focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm" className="gap-2 text-xs font-bold">
                  <Save className="h-4 w-4" />
                  {t("حفظ إعدادات الملقن", "Save System Prompt Settings")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
