"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Power,
  X,
  Check,
  Shield,
  Lock,
  ShoppingCart,
  Package,
  User,
  BarChart3,
  Settings,
  AlertCircle,
} from "lucide-react";
import {
  useStaffStore,
  StaffMember,
  ALL_PERMISSIONS_LIST,
} from "@/lib/staffStore";

export default function UsersManagement() {
  const { staffList, addStaff, updateStaff, deleteStaff, toggleStatus } =
    useStaffStore();
  const [mounted, setMounted] = useState(false);

  // Edit / Add Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formRole, setFormRole] = useState<"SUPER ADMIN" | "STAFF">("STAFF");
  const [formPermissions, setFormPermissions] = useState<string[]>([]);

  // Delete Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormName("");
    setFormEmail("");
    setFormStatus("Active");
    setFormRole("STAFF");
    setFormPermissions([
      "View Orders",
      "Update Order Status",
      "Contact Customers via WhatsApp",
      "View Products",
      "Add New Products",
      "Edit Existing Products",
      "Delete Products",
      "Manage Stock & Inventory",
    ]);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (member: StaffMember) => {
    setEditingStaff(member);
    setFormName(member.name);
    setFormEmail(member.email);
    setFormStatus(member.status);
    setFormRole(member.role);
    setFormPermissions(member.permissions || []);
    setIsModalOpen(true);
  };

  // Role Selection Pre-fills Permissions
  const handleRoleChange = (role: "SUPER ADMIN" | "STAFF") => {
    setFormRole(role);
    if (role === "SUPER ADMIN") {
      setFormPermissions(Object.values(ALL_PERMISSIONS_LIST).flat());
    } else {
      setFormPermissions([
        "View Orders",
        "Update Order Status",
        "Contact Customers via WhatsApp",
        "View Products",
        "Add New Products",
        "Edit Existing Products",
        "Delete Products",
        "Manage Stock & Inventory",
      ]);
    }
  };

  // Permission Checkbox Toggle
  const handlePermissionToggle = (perm: string) => {
    setFormPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  // Select All Permissions
  const handleSelectAllPermissions = () => {
    setFormPermissions(Object.values(ALL_PERMISSIONS_LIST).flat());
  };

  // Clear All Permissions
  const handleClearAllPermissions = () => {
    setFormPermissions([]);
  };

  // Toggle Category Permissions
  const handleToggleCategory = (catKey: string) => {
    const catItems = ALL_PERMISSIONS_LIST[catKey] || [];
    const allSelected = catItems.every((item) =>
      formPermissions.includes(item)
    );
    if (allSelected) {
      setFormPermissions((prev) => prev.filter((p) => !catItems.includes(p)));
    } else {
      setFormPermissions((prev) =>
        Array.from(new Set([...prev, ...catItems]))
      );
    }
  };

  // Submit Modal
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        name: formName,
        email: formEmail,
        status: formStatus,
        role: formRole,
        permissions: formPermissions,
      });
    } else {
      addStaff({
        name: formName,
        email: formEmail,
        status: formStatus,
        role: formRole,
        permissions: formPermissions,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Section 1: Backend Staff Profiles ── */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-neutral-900 text-white rounded-2xl flex items-center justify-center shadow-md shrink-0">
              <Users size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                Backend Staff Profiles
              </h2>
              <p className="text-xs font-semibold text-neutral-400">
                Manage Role-Based Access Control (RBAC) permissions & staff logins.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenAdd}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all shadow-md flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={16} /> Add Staff Member
          </button>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-neutral-100 text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 bg-neutral-50/60">
                <th className="px-6 py-4">MEMBER</th>
                <th className="px-6 py-4">ROLE</th>
                <th className="px-6 py-4">PERMISSIONS</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {staffList.map((member) => (
                <tr key={member.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0 shadow-sm ${
                          member.role === "SUPER ADMIN"
                            ? "bg-gradient-to-br from-pink-500 to-rose-600"
                            : "bg-neutral-800"
                        }`}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900 text-sm leading-tight">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-neutral-400 font-semibold">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full border shadow-2xs inline-block whitespace-nowrap ${
                        member.role === "SUPER ADMIN"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-neutral-700">
                    {member.role === "SUPER ADMIN"
                      ? "All permissions"
                      : `${member.permissions?.length || 0} permissions`}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border flex items-center gap-1.5 w-max ${
                        member.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-neutral-100 text-neutral-500 border-neutral-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          member.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-neutral-400"
                        }`}
                      ></span>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => toggleStatus(member.id)}
                        className={`p-2 rounded-xl transition-all ${
                          member.status === "Active"
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-amber-600 hover:bg-amber-50"
                        }`}
                        title={member.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        <Power size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all"
                        title="Edit Permissions"
                      >
                        <Pencil size={16} />
                      </button>
                      {!member.isBuiltIn && (
                        <button
                          onClick={() => setDeletingId(member.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Permanently Delete Staff"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── STAFF EDIT & ADD MODAL (Matches User Screenshots) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-xl my-8 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-neutral-50/50">
              <div>
                <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                  {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
                </h2>
                <p className="text-xs text-neutral-400 font-semibold mt-0.5">
                  Assign a role and choose individual permissions.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Row 1: Full Name & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-neutral-800 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Candy Staff"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-neutral-800 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="staff@candyworld.lk"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Account Status Card */}
              <div className="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-neutral-900">Account Status</h4>
                  <p className="text-xs text-neutral-400 font-semibold">
                    Inactive accounts cannot access the admin panel.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormStatus(formStatus === "Active" ? "Inactive" : "Active")
                  }
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
                    formStatus === "Active" ? "bg-emerald-500" : "bg-neutral-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                      formStatus === "Active" ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Role Selection Option Cards */}
              <div>
                <label className="block text-xs font-extrabold text-neutral-800 mb-2">
                  Role <span className="text-red-500">*</span>{" "}
                  <span className="text-neutral-400 font-normal">
                    — Selecting a role pre-fills recommended permissions
                  </span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Staff Option */}
                  <div
                    onClick={() => handleRoleChange("STAFF")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formRole === "STAFF"
                        ? "border-red-400 bg-red-50/30 shadow-xs"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formRole === "STAFF"
                            ? "border-red-600 bg-red-600 text-white"
                            : "border-neutral-400"
                        }`}
                      >
                        {formRole === "STAFF" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <span className="font-black text-sm text-neutral-900">Staff</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-semibold pl-6">
                      Standard staff access for everyday operations.
                    </p>
                  </div>

                  {/* Super Admin Option */}
                  <div
                    onClick={() => handleRoleChange("SUPER ADMIN")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      formRole === "SUPER ADMIN"
                        ? "border-red-400 bg-red-50/30 shadow-xs"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formRole === "SUPER ADMIN"
                            ? "border-red-600 bg-red-600 text-white"
                            : "border-neutral-400"
                        }`}
                      >
                        {formRole === "SUPER ADMIN" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                      <span className="font-black text-sm text-neutral-900">Super Admin</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-semibold pl-6">
                      Full unrestricted access to all features.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Access Permissions Section Breakdown ── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <h3 className="text-sm font-black text-neutral-900 tracking-tight">
                    Access Permissions
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-red-600 hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-neutral-300">|</span>
                    <button
                      type="button"
                      onClick={handleClearAllPermissions}
                      className="text-neutral-500 hover:text-neutral-900"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* 1. ORDERS */}
                {(() => {
                  const catItems = ALL_PERMISSIONS_LIST.ORDERS;
                  const selectedCount = catItems.filter((i) =>
                    formPermissions.includes(i)
                  ).length;
                  const isAll = selectedCount === catItems.length;
                  return (
                    <div className="border border-blue-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                      <div className="px-4 py-3 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-900 font-black text-xs">
                          <ShoppingCart size={15} className="text-blue-600" />
                          <span>ORDERS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-neutral-500">
                            {selectedCount}/{catItems.length} selected
                          </span>
                          <input
                            type="checkbox"
                            checked={isAll}
                            onChange={() => handleToggleCategory("ORDERS")}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {catItems.map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 text-xs font-bold text-neutral-800 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={formPermissions.includes(item)}
                              onChange={() => handlePermissionToggle(item)}
                              className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 2. PRODUCTS & INVENTORY */}
                {(() => {
                  const catItems = ALL_PERMISSIONS_LIST.PRODUCTS_AND_INVENTORY;
                  const selectedCount = catItems.filter((i) =>
                    formPermissions.includes(i)
                  ).length;
                  const isAll = selectedCount === catItems.length;
                  return (
                    <div className="border border-blue-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                      <div className="px-4 py-3 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-900 font-black text-xs">
                          <Package size={15} className="text-emerald-600" />
                          <span>PRODUCTS &amp; INVENTORY</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-neutral-500">
                            {selectedCount}/{catItems.length} selected
                          </span>
                          <input
                            type="checkbox"
                            checked={isAll}
                            onChange={() =>
                              handleToggleCategory("PRODUCTS_AND_INVENTORY")
                            }
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {catItems.map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 text-xs font-bold text-neutral-800 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={formPermissions.includes(item)}
                              onChange={() => handlePermissionToggle(item)}
                              className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 3. CUSTOMERS */}
                {(() => {
                  const catItems = ALL_PERMISSIONS_LIST.CUSTOMERS;
                  const selectedCount = catItems.filter((i) =>
                    formPermissions.includes(i)
                  ).length;
                  const isAll = selectedCount === catItems.length;
                  return (
                    <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-neutral-800 font-black text-xs">
                          <User size={15} className="text-amber-600" />
                          <span>CUSTOMERS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-neutral-400">
                            {selectedCount}/{catItems.length} selected
                          </span>
                          <input
                            type="checkbox"
                            checked={isAll}
                            onChange={() => handleToggleCategory("CUSTOMERS")}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {catItems.map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 text-xs font-bold text-neutral-800 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={formPermissions.includes(item)}
                              onChange={() => handlePermissionToggle(item)}
                              className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 4. ANALYTICS */}
                {(() => {
                  const catItems = ALL_PERMISSIONS_LIST.ANALYTICS;
                  const selectedCount = catItems.filter((i) =>
                    formPermissions.includes(i)
                  ).length;
                  const isAll = selectedCount === catItems.length;
                  return (
                    <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-neutral-800 font-black text-xs">
                          <BarChart3 size={15} className="text-purple-600" />
                          <span>ANALYTICS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-neutral-400">
                            {selectedCount}/{catItems.length} selected
                          </span>
                          <input
                            type="checkbox"
                            checked={isAll}
                            onChange={() => handleToggleCategory("ANALYTICS")}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {catItems.map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 text-xs font-bold text-neutral-800 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={formPermissions.includes(item)}
                              onChange={() => handlePermissionToggle(item)}
                              className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 5. SETTINGS */}
                {(() => {
                  const catItems = ALL_PERMISSIONS_LIST.SETTINGS;
                  const selectedCount = catItems.filter((i) =>
                    formPermissions.includes(i)
                  ).length;
                  const isAll = selectedCount === catItems.length;
                  return (
                    <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-neutral-800 font-black text-xs">
                          <Settings size={15} className="text-neutral-600" />
                          <span>SETTINGS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-neutral-400">
                            {selectedCount}/{catItems.length} selected
                          </span>
                          <input
                            type="checkbox"
                            checked={isAll}
                            onChange={() => handleToggleCategory("SETTINGS")}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {catItems.map((item) => (
                          <label
                            key={item}
                            className="flex items-center gap-3 text-xs font-bold text-neutral-800 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={formPermissions.includes(item)}
                              onChange={() => handlePermissionToggle(item)}
                              className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Save & Cancel Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-xs font-black text-neutral-600 hover:bg-neutral-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl text-xs font-black text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 transition-all shadow-md flex items-center gap-2 uppercase tracking-widest"
                >
                  <Check size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200 w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-black text-neutral-900 mb-1">
              Delete Staff Member?
            </h3>
            <p className="text-xs text-neutral-500 font-semibold mb-6">
              Are you sure you want to permanently delete this staff profile? They will immediately lose access to the admin control panel.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-3 border border-neutral-200 rounded-2xl text-xs font-black text-neutral-700 hover:bg-neutral-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStaff(deletingId);
                  setDeletingId(null);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black transition-all shadow-md"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
