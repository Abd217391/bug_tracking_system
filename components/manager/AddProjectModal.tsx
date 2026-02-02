"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronDown,
  Check,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";

interface Props {
  setIsProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddProject: (newProject: any) => void;
}

interface User {
  id: number;
  name: string;
  role: string;
}

export default function AddProjectModal({
  setIsProjectModalOpen,
  handleAddProject,
}: Props) {
  // Form State
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [qaList, setQaList] = useState<User[]>([]);
  const [devList, setDevList] = useState<User[]>([]);

  const [selectedQa, setSelectedQa] = useState<number[]>([]);
  const [selectedDev, setSelectedDev] = useState<number[]>([]);

  const [isQaOpen, setIsQaOpen] = useState(false);
  const [isDevOpen, setIsDevOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for click outside
  const qaDropdownRef = useRef<HTMLDivElement>(null);
  const devDropdownRef = useRef<HTMLDivElement>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8000/auth/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: User[]) => {
        setQaList(data.filter((u) => u.role === "qa"));
        setDevList(data.filter((u) => u.role === "developer"));
      })
      .catch((err) => console.error("Failed to fetch users", err));
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        qaDropdownRef.current &&
        !qaDropdownRef.current.contains(event.target as Node)
      ) {
        setIsQaOpen(false);
      }
      if (
        devDropdownRef.current &&
        !devDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDevOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const toggleSelection = (
    id: number,
    list: number[],
    setList: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    setList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Please enter a project name");
    if (selectedQa.length === 0) return alert("Please select at least one QA");
    if (selectedDev.length === 0)
      return alert("Please select at least one Developer");

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:8000/manager/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: name,
          description: details,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to create project");
      }

      const newProject = await res.json();

      await Promise.all(
        selectedQa.map((qaId) =>
          fetch(
            `http://localhost:8000/manager/projects/${newProject.id}/assign-user_new_endpoint?user_id=${qaId}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ),
      );

      await Promise.all(
        selectedDev.map((devId) =>
          fetch(
            `http://localhost:8000/manager/projects/${newProject.id}/assign-user_new_endpoint?user_id=${devId}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ),
      );

      handleAddProject(newProject);
      setIsProjectModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-slate-900">Add new Project</h2>
        </div>

        <div className="p-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Project name
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Short details
              </label>
              <textarea
                placeholder="Enter details here"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition placeholder:text-gray-400 resize-none"
              />
            </div>

            <div className="space-y-1.5 relative" ref={qaDropdownRef}>
              <label className="text-sm font-semibold text-slate-700">
                Assign to (QA)
              </label>
              <button
                onClick={() => setIsQaOpen(!isQaOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white hover:border-blue-400 transition"
              >
                <span
                  className={
                    selectedQa.length ? "text-slate-900" : "text-gray-400"
                  }
                >
                  {selectedQa.length > 0
                    ? `${selectedQa.length} QA(s) selected`
                    : "Select QA team"}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isQaOpen && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto p-1">
                  {qaList.map((user) => {
                    const isSelected = selectedQa.includes(user.id);
                    return (
                      <div
                        key={user.id}
                        onClick={() =>
                          toggleSelection(user.id, selectedQa, setSelectedQa)
                        }
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm ${isSelected ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${isSelected ? "bg-blue-200" : "bg-gray-200"}`}
                          >
                            {getInitials(user.name)}
                          </div>
                          {user.name}
                        </div>
                        {isSelected && <Check size={14} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-1.5 relative" ref={devDropdownRef}>
              <label className="text-sm font-semibold text-slate-700">
                Assign to (Developers)
              </label>
              <button
                onClick={() => setIsDevOpen(!isDevOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white hover:border-blue-400 transition"
              >
                <span
                  className={
                    selectedDev.length ? "text-slate-900" : "text-gray-400"
                  }
                >
                  {selectedDev.length > 0
                    ? `${selectedDev.length} Developer(s) selected`
                    : "Select Developers"}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {isDevOpen && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto p-1">
                  {devList.map((user) => {
                    const isSelected = selectedDev.includes(user.id);
                    return (
                      <div
                        key={user.id}
                        onClick={() =>
                          toggleSelection(user.id, selectedDev, setSelectedDev)
                        }
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-sm ${isSelected ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${isSelected ? "bg-blue-200" : "bg-gray-200"}`}
                          >
                            {getInitials(user.name)}
                          </div>
                          {user.name}
                        </div>
                        {isSelected && <Check size={14} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="h-full min-h-[250px] border-2 border-dashed border-gray-300 rounded-xl relative group hover:border-blue-400 hover:bg-blue-50/30 transition flex flex-col items-center justify-center cursor-pointer bg-gray-50">
              {logoPreview ? (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-w-full max-h-48 object-contain rounded"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogoFile(null);
                      setLogoPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white p-3 rounded-xl shadow-sm mb-3">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500 transition">
                    Upload logo
                  </span>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-6 flex gap-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition transform active:scale-95 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/25"}`}
          >
            {isSubmitting ? "Creating..." : "Add Project"}
          </button>
          <button
            onClick={() => setIsProjectModalOpen(false)}
            className="flex-1 py-3 rounded-xl font-semibold text-slate-700 bg-white border border-gray-200 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
