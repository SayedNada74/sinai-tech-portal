"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useAdmin } from "@/context/admin-context";
import { useAuth, UserProfile } from "@/context/auth-context";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  UserCheck,
  UserMinus,
  Trash2,
  Key,
  Shield,
  Edit2,
  CheckSquare,
  Square,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ExternalLink
} from "lucide-react";

import { useToast } from "@/components/ui/toast";

export default function UserManagementPage() {
  const { t, dir, lang } = useApp();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const {
    users,
    addUserAccount,
    updateUserRole,
    suspendUser,
    deleteUser,
    resetUserPassword,
    updateUserProfileAdmin,
    bulkUpdateRoles,
    bulkDeleteUsers
  } = useAdmin();
  const { user: currentUser } = useAuth();

  if (currentUser && currentUser.role !== "super-admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl">
          👑
        </div>
        <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
          {t("هذه الصفحة مخصصة فقط للمشرف الأعلى (Super Admin)", "Restricted to Super Admin only")}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          {t("لا تملك الصلاحية الكافية لإدارة الحسابات والرتب الإدارية.", "You do not have sufficient clearance to manage user accounts and admin roles.")}
        </p>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newRole, setNewRole] = React.useState<UserProfile["role"]>("admin");
  const [newDepartment, setNewDepartment] = React.useState("");
  const [newLevel, setNewLevel] = React.useState("");

  const handleCreateUser = () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast(t("⚠️ يرجى كتابة اسم الحساب والبريد الإلكتروني.", "⚠️ Please enter name and email."), "error");
      return;
    }
    addUserAccount({
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDepartment || (newRole === "student" ? "تكنولوجيا المعلومات (IT)" : "إدارة المنصة والسياسات"),
      level: newLevel || (newRole === "student" ? "الفرقة الأولى" : "الكادر الإداري والفني")
    });
    toast(t("✨ تم إنشاء وتعيين الحساب الجديد بنجاح!", "✨ New user account created successfully!"), "success");
    setIsAddModalOpen(false);
    setNewName("");
    setNewEmail("");
  };

  // Edit Modal State
  const [editingUser, setEditingUser] = React.useState<UserProfile | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editEmail, setEditEmail] = React.useState("");
  const [editLevel, setEditLevel] = React.useState("");
  const [editStudentId, setEditStudentId] = React.useState("");

  const getUserDisplayAvatar = React.useCallback((u: Partial<UserProfile> | any) => {
    const avatar = u.avatar;
    if (avatar && (avatar.startsWith("data:image/") || avatar.startsWith("http"))) {
      return (
        <div className="h-9 w-9 rounded-xl overflow-hidden shadow-inner border border-zinc-200/50 dark:border-zinc-700/50 shrink-0">
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        </div>
      );
    }
    let emoji = "🧑‍🎓";
    if (u.role === "super-admin") emoji = "👑";
    else if (u.role === "admin") emoji = "⚙️";
    else if (u.role === "moderator") emoji = "📚";
    else if (u.role === "student") {
      const lvl = u.level || "";
      const isSenior = lvl.includes("الرابعة") || lvl.includes("الرابعه") || lvl.includes("4") || lvl.includes("Fourth") || lvl.includes("Senior");
      if (isSenior) emoji = "🎓";
      else emoji = "🧑‍🎓";
    } else if (avatar) {
      emoji = avatar;
    }
    return (
      <div className="h-9 w-9 rounded-xl bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center text-lg shadow-inner shrink-0">
        <span>{emoji}</span>
      </div>
    );
  }, []);

  const getUserLocalizedName = React.useCallback((u: Partial<UserProfile> | any) => {
    if (!u) return "";
    const profile = users.find(user => user.email?.toLowerCase().trim() === u.email?.toLowerCase().trim() || user.id === u.userId || user.id === u.id) || u;
    if (lang === "ar") {
      return profile.nameAr || profile.name || profile.nameEn || "مستخدم";
    } else {
      return profile.nameEn || profile.name || profile.nameAr || "User";
    }
  }, [users, lang]);

  // Filtering
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const isSuspended = u.bio.includes("[SUSPENDED]");
      const query = searchTerm.toLowerCase().trim();
      const matchQuery =
        !query ||
        u.name.toLowerCase().includes(query) ||
        (u.nameAr && u.nameAr.toLowerCase().includes(query)) ||
        (u.nameEn && u.nameEn.toLowerCase().includes(query)) ||
        u.email.toLowerCase().includes(query) ||
        u.studentId.includes(query);

      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "suspended" && isSuspended) ||
        (statusFilter === "active" && !isSuspended);

      return matchQuery && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Handle Multi-select
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUsers.map((u) => u.id));
    }
  };

  // Bulk Actions
  const handleBulkRoleChange = (role: UserProfile["role"]) => {
    if (selectedIds.length === 0) return;
    if (role === "super-admin" && currentUser?.role !== "super-admin") {
      toast(t("⚠️ غير مسموح لك بترقية مستخدمين لدور المشرف الأعلى.", "⚠️ You are not authorized to promote users to Super Admin."), "error");
      return;
    }
    bulkUpdateRoles(selectedIds, role);
    setSelectedIds([]);
    toast(t("⚡ تم تحديث الصلاحيات للمستخدمين المحددين بنجاح.", "⚡ User roles updated successfully."), "success");
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(t(`هل أنت متأكد من حذف ${selectedIds.length} مستخدمين نهائياً؟`, `Are you sure you want to permanently delete ${selectedIds.length} users?`))) {
      bulkDeleteUsers(selectedIds);
      setSelectedIds([]);
      toast(t("🗑️ تم حذف الحسابات المحددة بنجاح.", "🗑️ Selected accounts deleted successfully."), "success");
    }
  };

  // Single Actions Guarded
  const handleRoleChange = (uid: string, targetRole: UserProfile["role"], uRole: string) => {
    if (targetRole === "super-admin" && currentUser?.role !== "super-admin") {
      toast(t("⚠️ فقط المشرف الأعلى (Super Admin) يملك صلاحية تعيين مشرفين أعلى.", "⚠️ Only Super Admins can assign Super Admin role."), "error");
      return;
    }
    if (uRole === "super-admin" && currentUser?.role !== "super-admin") {
      toast(t("⚠️ لا يمكنك تعديل صلاحيات المشرف الأعلى.", "⚠️ You cannot edit Super Admin permissions."), "error");
      return;
    }
    updateUserRole(uid, targetRole);
    toast(t("✨ تم تعديل صلاحية المستخدم بنجاح.", "✨ User role updated successfully."), "success");
  };

  const openEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditLevel(u.level);
    setEditStudentId(u.studentId);
  };

  const saveEdit = () => {
    if (!editingUser) return;
    updateUserProfileAdmin(editingUser.id, {
      name: editName,
      email: editEmail,
      level: editLevel,
      studentId: editStudentId
    });
    setEditingUser(null);
    toast(t("✨ تم تعديل بيانات ملف العضو بنجاح!", "✨ User profile updated successfully!"), "success");
  };

  const [onlineSessions, setOnlineSessions] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchLiveSessions = () => {
      try {
        const savedSessionsStr = localStorage.getItem("su_active_sessions") || "[]";
        let sessions = JSON.parse(savedSessionsStr);
        if (!Array.isArray(sessions)) sessions = [];
        const now = Date.now();
        sessions = sessions.filter((s: any) => s && s.lastActive && now - s.lastActive < 120000);
        setOnlineSessions(sessions);
      } catch (e) {
        setOnlineSessions([]);
      }
    };

    fetchLiveSessions();
    const interval = setInterval(fetchLiveSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
          {t("إدارة حسابات الأعضاء", "User Account Management")}
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {t(
            "البحث في سجلات الطلاب والمشرفين، تعديل مستويات الصلاحيات، وإيقاف الحسابات المخالفة.",
            "Search student and staff records, adjust role permissions, and suspend accounts."
          )}
        </p>
      </div>

      {/* Live Online Active Users Widget */}
      <Card className="border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-sm">
        <CardHeader className="pb-3 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{t("المتواجدون أونلاين الآن بالمنصة (Live Online Users)", "Live Online Active Visitors")}</span>
            </CardTitle>
            <Badge className="bg-emerald-500 text-white font-mono text-[10px] font-bold">
              {`${onlineSessions.length} ${t("متواجد الآن", "Online Now")}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {onlineSessions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {onlineSessions.map((s) => {
                const isImg = s.avatar && (s.avatar.startsWith("data:image/") || s.avatar.startsWith("http"));
                const targetId = users.find(u => u.email?.toLowerCase().trim() === s.email?.toLowerCase().trim())?.id || s.userId || s.id;
                return (
                  <Link
                    key={s.userId || s.email}
                    href={targetId ? `/profile/${targetId}` : "#"}
                    className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-md flex items-center gap-3 text-xs transition-all cursor-pointer group"
                  >
                    <div className="relative shrink-0 h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center overflow-hidden border border-emerald-500/20 group-hover:scale-105 transition-transform">
                      {isImg ? (
                        <img src={s.avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xl">{s.avatar || "👤"}</span>
                      )}
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                          {getUserLocalizedName(s)}
                        </h5>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold shrink-0">
                          {s.role === "admin" || s.role === "super-admin" ? "⚙️ Admin" : "🧑‍🎓 Student"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate font-mono">{s.email}</p>
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                        🟢 {t("نشط الآن عبر الجلسة الحية", "Active Live Session")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-zinc-500 text-center py-2">
              {t("لا يوجد مستخدمون متواجدون حالياً سوى جلسة الإدارة الحالية", "No other active users online right now")}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Controls: Search and Filters */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-3 sm:p-4 flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={t("ابحث بالاسم، البريد الإلكتروني، أو الرقم الأكاديمي...", "Search by name, email, or student ID...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang === "ar" ? "pr-10" : "pl-10"}
            />
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer w-full sm:w-auto flex-1"
            >
              <option value="ALL">{t("جميع الصلاحيات 🛡️", "All Roles 🛡️")}</option>
              <option value="student">{t("طلاب 🧑‍🎓", "Students 🧑‍🎓")}</option>
              <option value="moderator">{t("منسقون محتوى 📚", "Moderators 📚")}</option>
              <option value="admin">{t("مسؤولون ⚙️", "Admins ⚙️")}</option>
              <option value="super-admin">{t("مشرف أعلى 👑", "Super Admin 👑")}</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer w-full sm:w-auto flex-1"
            >
              <option value="ALL">{t("جميع الحالات 🚦", "All Statuses 🚦")}</option>
              <option value="active">{t("نشط", "Active")}</option>
              <option value="suspended">{t("موقوف 🚫", "Suspended 🚫")}</option>
            </select>

            {/* Add User Button */}
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs px-4 h-10 rounded-xl cursor-pointer w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 shadow-md"
            >
              <UserCheck className="h-4 w-4" />
              <span>{t("إضافة حساب جديد ➕", "Add New Account ➕")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Panel */}
      {selectedIds.length > 0 && (
        <div className="p-3 sm:p-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-850 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-sky-700 dark:text-sky-400">
            {t(`تم اختيار ${selectedIds.length} مستخدمين لتطبيق إجراء جماعي:`, `Selected ${selectedIds.length} users for bulk action:`)}
          </span>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => handleBulkRoleChange("student")}
              className="text-[9px] h-8 font-bold border-sky-300 hover:bg-sky-100 dark:border-sky-800 flex-1 sm:flex-initial"
            >
              {t("تعيين كطالب", "Set Student")}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBulkRoleChange("moderator")}
              className="text-[9px] h-8 font-bold border-sky-300 hover:bg-sky-100 dark:border-sky-800 flex-1 sm:flex-initial"
            >
              {t("تعيين كمنسق", "Set Moderator")}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBulkRoleChange("admin")}
              className="text-[9px] h-8 font-bold border-sky-300 hover:bg-sky-100 dark:border-sky-800 flex-1 sm:flex-initial"
            >
              {t("تعيين كمسؤول", "Set Admin")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="text-[9px] h-8 font-bold gap-1.5 w-full sm:w-auto"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("حذف الحسابات نهائياً", "Delete Permanently")}
            </Button>
          </div>
        </div>
      )}

      {/* Users Table Card */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        {/* Mobile Swipe Hint */}
        <div className="block sm:hidden text-[10px] text-zinc-400 p-2 text-center bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
          ⟷ {t("اسحب الجدول يميناً ويساراً لعرض كافة الأعمدة والتفاصيل", "Swipe table horizontally to view all columns")}
        </div>
        <CardContent className="p-0 overflow-x-auto touch-pan-x">
          <table className="w-full text-right text-xs min-w-[700px]">
            <thead className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200/60 dark:border-zinc-800 font-bold text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="p-4 w-10 text-center">
                  <button onClick={toggleSelectAll} className="cursor-pointer">
                    {selectedIds.length === filteredUsers.length && filteredUsers.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-sky-600" />
                    ) : (
                      <Square className="h-4 w-4 text-zinc-400" />
                    )}
                  </button>
                </th>
                <th className="p-4">{t("المستخدم", "User")}</th>
                <th className="p-4">{t("الرقم الأكاديمي", "Student ID")}</th>
                <th className="p-4">{t("القسم والفرقة", "Dept & Year")}</th>
                <th className="p-4">{t("الصلاحية", "Role")}</th>
                <th className="p-4">{t("الحالة", "Status")}</th>
                <th className="p-4 text-center">{t("إجراءات السيطرة", "Actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isSuspended = u.bio.includes("[SUSPENDED]");
                  const isSelected = selectedIds.includes(u.id);

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-zinc-50/70 dark:hover:bg-zinc-950/40 transition-colors ${isSelected ? "bg-sky-50/40 dark:bg-sky-950/10" : ""
                        }`}
                    >
                      <td className="p-4 text-center">
                        <button onClick={() => toggleSelect(u.id)} className="cursor-pointer">
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-sky-600" />
                          ) : (
                            <Square className="h-4 w-4 text-zinc-400" />
                          )}
                        </button>
                      </td>

                      {/* User Info */}
                      <td className="p-4">
                        <Link
                          href={`/profile/${u.id}`}
                          className="flex items-center gap-3 group cursor-pointer"
                        >
                          <div className="group-hover:scale-105 transition-transform shrink-0">
                            {getUserDisplayAvatar(u)}
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                              {getUserLocalizedName(u)}
                            </h4>
                            <p className="text-[10px] text-zinc-400 font-mono">{u.email}</p>
                          </div>
                        </Link>
                      </td>

                      <td className="p-4 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                        <Link href={`/profile/${u.id}`} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer inline-block">
                          {u.role === "student" ? (
                            u.studentId || "N/A"
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold border border-zinc-200/80 dark:border-zinc-700/80 inline-flex items-center gap-1">
                              💳 {u.studentId || (u.role === "super-admin" ? "SUP-001" : u.role === "admin" ? "ADM-001" : "MOD-001")}
                            </span>
                          )}
                        </Link>
                      </td>

                      <td className="p-4 text-zinc-600 dark:text-zinc-400 text-xs">
                        {u.role === "student" ? (
                          <>
                            <span className="font-semibold block">{u.department}</span>
                            <span className="text-[10px] text-zinc-400 block">{u.level}</span>
                          </>
                        ) : (
                          <>
                            <span className="font-bold text-cyan-600 dark:text-cyan-400 block">{u.level}</span>
                            <span className="text-[10px] text-zinc-400 block">{u.department}</span>
                          </>
                        )}
                      </td>

                      {/* Role Selector */}
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleRoleChange(u.id, e.target.value as UserProfile["role"], u.role)
                          }
                          className="h-8 px-2 rounded-lg border border-zinc-200 bg-white text-[10px] font-bold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 cursor-pointer"
                        >
                          <option value="student">{t("طالب 🧑‍🎓", "Student 🧑‍🎓")}</option>
                          <option value="moderator">{t("منسق محتوى 📚", "Moderator 📚")}</option>
                          <option value="admin">{t("مسؤول ⚙️", "Admin ⚙️")}</option>
                          <option value="super-admin">{t("مشرف أعلى 👑", "Super Admin 👑")}</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isSuspended ? (
                          <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 text-[10px] font-bold py-0.5 px-2 rounded-lg">
                            🚫 {t("موقوف مؤقتاً", "Suspended")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 text-[10px] font-bold py-0.5 px-2 rounded-lg">
                            🟢 {t("نشط", "Active")}
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* View Profile */}
                          <Link
                            href={`/profile/${u.id}`}
                            className="p-1.5 rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-colors cursor-pointer"
                            title={t("عرض الملف الشخصي", "View Profile")}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>

                          {/* Edit info */}
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            title={t("تعديل البيانات", "Edit Info")}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Reset pass */}
                          <button
                            onClick={() => {
                              resetUserPassword(u.id);
                              toast(t(`🔑 تم تصفير كلمة المرور للحساب (${u.name}) بنجاح!`, `🔑 Password reset for (${u.name})!`), "success");
                            }}
                            className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-colors cursor-pointer"
                            title={t("تصفير كلمة المرور", "Reset Password")}
                          >
                            <Key className="h-3.5 w-3.5" />
                          </button>

                          {/* Suspend / Unsuspend */}
                          <button
                            onClick={() => {
                              suspendUser(u.id, !isSuspended);
                              if (!isSuspended) {
                                toast(t(`🚫 تم تجميد وإيقاف حساب (${u.name}) مؤقتاً (دون حذف بياناته).`, `🚫 Account for (${u.name}) suspended temporarily. Data preserved.`), "info");
                              } else {
                                toast(t(`⚡ تم إعادة تنشيط حساب (${u.name}) بنجاح!`, `⚡ Account for (${u.name}) reactivated!`), "success");
                              }
                            }}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${isSuspended
                              ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50"
                              : "text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/50"
                              }`}
                            title={isSuspended ? t("إعادة تنشيط الحساب ⚡", "Reactivate Account ⚡") : t("تجميد / إيقاف الحساب مؤقتاً 🚫", "Suspend Account 🚫")}
                          >
                            {isSuspended ? <UserCheck className="h-3.5 w-3.5" /> : <UserMinus className="h-3.5 w-3.5" />}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(t(`هل أنت متأكد من حذف حساب ${u.name}؟`, `Delete account for ${u.name}?`))) {
                                deleteUser(u.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                            title={t("حذف الحساب", "Delete Account")}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center space-y-2">
                    <HelpCircle className="h-6 w-6 mx-auto text-zinc-400" />
                    <p className="text-xs text-zinc-400">{t("لا يوجد أعضاء مطابقون لخيارات التصفية الحالية", "No users match current filters")}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {editingUser && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <Card className="w-full max-w-md max-h-[90vh] my-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <CardTitle className="text-base font-bold">{t("تعديل بيانات الحساب الأكاديمي", "Edit Academic User Account")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 overflow-y-auto flex-1 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الاسم الكامل", "Full Name")}</label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="text-xs" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("البريد الإلكتروني", "Email Address")}</label>
                <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {editingUser?.role === "student" ? t("الرقم الأكاديمي", "Student ID") : t("كود الكادر والإدارة", "Staff ID")}
                  </label>
                  <Input value={editStudentId} onChange={(e) => setEditStudentId(e.target.value)} className="text-xs font-mono" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {editingUser?.role === "student" ? t("الفرقة الدراسية", "Academic Year") : t("القطاع / الصفة الوظيفية", "Staff Sector / Title")}
                  </label>
                  <Input value={editLevel} onChange={(e) => setEditLevel(e.target.value)} className="text-xs" />
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex gap-2 justify-end bg-zinc-50/50 dark:bg-zinc-950/50">
              <Button variant="outline" size="sm" onClick={() => setEditingUser(null)} className="text-xs font-bold cursor-pointer">
                {t("إلغاء", "Cancel")}
              </Button>
              <Button size="sm" onClick={saveEdit} className="text-xs font-bold cursor-pointer">
                {t("حفظ التغييرات", "Save Changes")}
              </Button>
            </div>
          </Card>
        </div>,
        document.body
      )}

      {/* Add New User Modal */}
      {isAddModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <Card className="w-full max-w-md max-h-[90vh] my-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-sky-600" />
                <span>{t("إضافة حساب إداري أو طالب جديد ➕", "Add New Account ➕")}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                {t("قم بإدخال بيانات الحساب واختيار الصلاحية المطلوبة.", "Enter user details and assign desired role.")}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الاسم الكامل", "Full Name")}</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: د. محمد الإداري"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("البريد الإلكتروني", "Email Address")}</label>
                <Input
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الصلاحية والرتبة", "Role Clearance")}</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserProfile["role"])}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 cursor-pointer"
                >
                  <option value="student">{t("طالب 🧑‍🎓", "Student 🧑‍🎓")}</option>
                  <option value="moderator">{t("منسق محتوى 📚", "Content Moderator 📚")}</option>
                  <option value="admin">{t("مسؤول نظام ⚙️", "System Admin ⚙️")}</option>
                  <option value="super-admin">{t("مشرف أعلى 👑", "Super Admin 👑")}</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {newRole === "student" ? t("القسم والكلية", "Department") : t("القطاع الوظيفي", "Sector")}
                  </label>
                  <Input
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder={newRole === "student" ? "تكنولوجيا المعلومات (IT)" : "إدارة المنصة والسياسات"}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {newRole === "student" ? t("الفرقة الدراسية", "Academic Year") : t("الصفة الوظيفية", "Staff Title")}
                  </label>
                  <Input
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    placeholder={newRole === "student" ? "الفرقة الأولى" : "الكادر الإداري والفني"}
                    className="text-xs"
                  />
                </div>
              </div>
            </CardContent>

            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex gap-2 justify-end bg-zinc-50/50 dark:bg-zinc-950/50">
              <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)} className="text-xs font-bold cursor-pointer">
                {t("إلغاء", "Cancel")}
              </Button>
              <Button size="sm" onClick={handleCreateUser} className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold cursor-pointer">
                {t("إنشاء الحساب فوراً ⚡", "Create Account ⚡")}
              </Button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
