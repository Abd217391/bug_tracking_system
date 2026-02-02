// Page for selecting user role before signup
"use client";


import Link from "next/link";
import { User, Briefcase, Bug } from "lucide-react";//importing icons 
import RoleCard from "@/components/root/RoleCard";//importing RoleCard component


export default function JoinUsPage() {
  return (
    <div>
      {/* Floating login link for existing users */}
      <div className="absolute top-8 left-100 text-sm">
        <span className="text-gray-400">Already have an account? </span>
        {/* Link to login page */}
        <Link
          href="/login"
          className="text-blue-600 font-bold hover:underline ml-"
        >
          Login
        </Link>
      </div>

      <div>
        <h1 className="text-4xl font-extrabold text-[#1e1b4b] mb-3">
          Join Us!
        </h1>
        <p className="text-gray-500   max-w-[90%] mb-4">
          To begin this journey, tell us what type of account you’d be opening.
        </p>
      </div>

      {/* Section for role selection */}
      <div className="space-y-8">

        {/* Role card for Manager */}
        <RoleCard
          title="Manager"
          description="Signup as a manager to manage the tasks and bugs"
          icon={<User size={22} />}
          href="/signup?role=manager"
          active={false}
        />

        {/* Role card for Developer */}
        <RoleCard
          title="Developer"
          description="Signup as a Developer to assign the relevant task to QA"
          icon={<Briefcase size={22} />}
          href="/signup?role=developer"
          active={false}
        />

        {/* Role card for QA */}
        <RoleCard
          title="QA"
          description="Signup as a QA to create the bugs and report in tasks"
          icon={<Bug size={22} strokeWidth={2.5} />}
          href="/signup?role=qa"
          active={false}
        />
      </div>
    </div>
  );
}
