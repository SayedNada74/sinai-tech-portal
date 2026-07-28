"use client";

import * as React from "react";
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
  HelpCircle
} from "lucide-react";

export default function UserManagementPage() {
  const { t, dir, lang } = useApp();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const {
    users,
    updateUserRole,
    suspendUser,
    deleteUser,
    resetUserPassword,
    updateUserProfileAdmin,
    bulkUpdateRoles,
    bulkDeleteUsers
  } = useAdmin();
  const { user: currentUser } = useAuth();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Edit Modal State
  const [editingUser, setEditingUser] = React.useState<UserProfile | null>(null);
  const [editName, setEditName] = React.useState("");
  const [editEmail, setEditEmail] = React.useState("");
  const [editLevel, setEditLevel] = React.useState("");
  const [editStudentId, setEditStudentId] = React.useState("");

  // Filtering
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const isSuspended = u.bio.includes("[SUSPENDED]");
      const query = searchTerm.toLowerCase().trim();
      const matchQuery =
        !query ||
        u.name.toLowerCase().includes(query) ||
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
      alert(t("⚠️ غير مسموح لك بترقية مستخدمين لدور المشرف الأعلى.", "⚠️ You are not authorized to promote users to Super Admin."));
      return;
    }
    bulkUpdateRoles(selectedIds, role);
    setSelectedIds([]);
    alert(t("⚡ تم تحديث الصلاحيات للمستخدمين المحددين بنجاح.", "⚡ User roles updated successfully."));
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(t(`هل أنت متأكد من حذف ${selectedIds.length} مستخدمين نهائياً؟`, `Are you sure you want to permanently delete ${selectedIds.length} users?`))) {
      bulkDeleteUsers(selectedIds);
      setSelectedIds([]);
      alert(t("🗑️ تم حذف الحسابات المحددة بنجاح.", "🗑️ Selected accounts deleted successfully."));
    }
  };

  // Single Actions Guarded
  const handleRoleChange = (uid: string, targetRole: UserProfile["role"], uRole: string) => {
    if (targetRole === "super-admin" && currentUser?.role !== "super-admin") {
      alert(t("⚠️ فقط المشرف الأعلى (Super Admin) يملك صلاحية تعيين مشرفين أعلى.", "⚠️ Only Super Admins can assign Super Admin role."));
      return;
    }
    if (uRole === "super-admin" && currentUser?.role !== "super-admin") {
      alert(t("⚠️ لا يمكنك تعديل صلاحيات المشرف الأعلى.", "⚠️ You cannot edit Super Admin permissions."));
      return;
    }
    updateUserRole(uid, targetRole);
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
    alert(t("✅ تم تعديل بيانات ملف العضو بنجاح.", "✅ User profile updated successfully."));
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
              {onlineSessions.map((s) => (
                <div key={s.userId} className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-emerald-500/20 flex items-center gap-3 text-xs">
                  <div className="relative shrink-0">
                    <span className="text-xl">{s.avatar || "👤"}</span>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{s.name}</h5>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold shrink-0">
                        {s.role === "admin" || s.role === "super-admin" ? "⚙️ Admin" : "🎓 Student"}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 truncate">{s.email}</p>
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      🟢 {t("نشط الآن عبر الجلسة الحية", "Active Live Session")}
                    </span>
                  </div>
                </div>
              ))}
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
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
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

          <div className="flex gap-2">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer"
            >
              <option value="ALL">{t("جميع الصلاحيات 🛡️", "All Roles 🛡️")}</option>
              <option value="student">{t("طلاب 🎓", "Students 🎓")}</option>
              <option value="moderator">{t("منسقون محتوى 👩‍🏫", "Moderators 👩‍🏫")}</option>
              <option value="admin">{t("مسؤولون ⚙️", "Admins ⚙️")}</option>
              <option value="super-admin">{t("مشرف أعلى 👑", "Super Admin 👑")}</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer"
            >
              <option value="ALL">{t("جميع الحالات 🚦", "All Statuses 🚦")}</option>
              <option value="active">{t("نشط", "Active")}</option>
              <option value="suspended">{t("موقوف 🚫", "Suspended 🚫")}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Panel */}
      {selectedIds.length > 0 && (
        <div className="p-4 bg-violet-50 dark:bg-violet-950/20 border border-violet-200/50 dark:border-violet-850 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-violet-700 dark:text-violet-400">
            {t(`تم اختيار ${selectedIds.length} مستخدمين لتطبيق إجراء جماعي:`, `Selected ${selectedIds.length} users for bulk action:`)}
          </span>

          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="outline"
              onClick={() => handleBulkRoleChange("student")}
              className="text-[9px] h-8 font-bold border-violet-300 hover:bg-violet-100 dark:border-violet-800"
            >
              {t("تعيين كطالب", "Set Student")}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBulkRoleChange("moderator")}
              className="text-[9px] h-8 font-bold border-violet-300 hover:bg-violet-100 dark:border-violet-800"
            >
              {t("تعيين كمنسق", "Set Moderator")}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBulkRoleChange("admin")}
              className="text-[9px] h-8 font-bold border-violet-300 hover:bg-violet-100 dark:border-violet-800"
            >
              {t("تعيين كمسؤول", "Set Admin")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="text-[9px] h-8 font-bold gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("حذف الحسابات نهائياً", "Delete Permanently")}
            </Button>
          </div>
        </div>
      )}

      {/* Users Table Card */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200/60 dark:border-zinc-800 font-bold text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="p-4 w-10 text-center">
                  <button onClick={toggleSelectAll} className="cursor-pointer">
                    {selectedIds.length === filteredUsers.length && filteredUsers.length > 0 ? (
                      <CheckSquare className="h-4 w-4 text-violet-600" />
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
                      className={`hover:bg-zinc-50/70 dark:hover:bg-zinc-950/40 transition-colors ${
                        isSelected ? "bg-violet-50/40 dark:bg-violet-950/10" : ""
                      }`}
                    >
                      <td className="p-4 text-center">
                        <button onClick={() => toggleSelect(u.id)} className="cursor-pointer">
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-violet-600" />
                          ) : (
                            <Square className="h-4 w-4 text-zinc-400" />
                          )}
                        </button>
                      </td>

                      {/* User Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{u.avatar || "👤"}</span>
                          <div>
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{u.name}</h4>
                            <p className="text-[10px] text-zinc-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono font-bold text-zinc-700 dark:text-zinc-300">
                        {u.studentId || "N/A"}
                      </td>

                      <td className="p-4 text-zinc-600 dark:text-zinc-400">
                        <div>{u.department}</div>
                        <div className="text-[9px] text-zinc-400">{u.level}</div>
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
                          <option value="student">{t("طالب 🎓", "Student 🎓")}</option>
                          <option value="moderator">{t("منسق محتوى 👩‍🏫", "Moderator 👩‍🏫")}</option>
                          <option value="admin">{t("مسؤول ⚙️", "Admin ⚙️")}</option>
                          <option value="super-admin">{t("مشرف أعلى 👑", "Super Admin 👑")}</option>
                        </select>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isSuspended ? (
                          <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 text-[9px]">
                            {t("موقوف 🚫", "Suspended 🚫")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:bg-green-950/20 text-[9px]">
                            {t("نشط ✓", "Active ✓")}
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
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
                            onClick={() => resetUserPassword(u.id)}
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors cursor-pointer"
                            title={t("تصفير كلمة المرور", "Reset Password")}
                          >
                            <Key className="h-3.5 w-3.5" />
                          </button>

                          {/* Suspend / Unsuspend */}
                          <button
                            onClick={() => suspendUser(u.id, !isSuspended)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isSuspended
                                ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                                : "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                            }`}
                            title={isSuspended ? t("إلغاء الإيقاف", "Unsuspend") : t("إيقاف الحساب", "Suspend")}
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-hidden">
          <Card className="w-full max-w-md max-h-[85vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الرقم الأكاديمي", "Student ID")}</label>
                  <Input value={editStudentId} onChange={(e) => setEditStudentId(e.target.value)} className="text-xs font-mono" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الفرقة الدراسية", "Academic Year")}</label>
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
    </div>
  );
}
