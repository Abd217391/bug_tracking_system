// Page for selecting user role before signup
"use client";

import Link from "next/link";
import { User, Briefcase, Bug } from "lucide-react";
import RoleCard from "@/components/root/RoleCard";

export default function JoinUsPage() {
  return (
    /* h-screen + overflow-hidden ensures the login link is visible without scrolling */
    <div className="relative h-screen flex flex-col p-6 md:p-12 overflow-hidden bg-white">
      
      {/* --- LOGIN LINK --- */}
      <div className="
        /* Mobile: Centered at the bottom, just like the 'Join Us' text */
        order-last mt-auto pb-6 text-center 
        /* Desktop: Top right, absolute, left-aligned */
        md:absolute md:top-8 md:right-10 md:mt-0 md:pb-0 md:text-left md:order-none
        text-sm
      ">
        <span className="text-gray-400">Already have an account? </span>
        <Link
          href="/login"
          className="text-blue-600 font-bold hover:underline ml-1"
        >
          Login
        </Link>
      </div>

      {/* --- CONTENT WRAPPER --- */}
      <div className="flex flex-col flex-1 justify-center md:justify-start">
        {/* 'text-center' centers 'Join Us!' on mobile to align with the login link below */}
        <div className="text-center md:text-left mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1e1b4b] mb-2">
            Join Us!
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-[280px] md:max-w-[90%] mx-auto md:mx-0">
            To begin this journey, tell us what type of account you’d be opening.
          </p>
        </div>

        {/* Section for role selection */}
        <div className="space-y-3 md:space-y-4">
          <RoleCard
            title="Manager"
            description="Signup as a manager to manage
             the tasks and bugs"
            icon={<User size={20} />}
            href="/signup?role=manager"
            active={false}
          />

          <RoleCard
            title="Developer"
            description="Signup as a Developer to assign the relevant task to QA"
            icon={<Briefcase size={20} />}
            href="/signup?role=developer"
            active={false}
          />

          <RoleCard
            title="QA"
            description="Signup as a QA to create the bugs and report in tasks"
            icon={<Bug size={20} strokeWidth={2.5} />}
            href="/signup?role=qa"
            active={false}
          />
        </div>
      </div>
    </div>
  );
}