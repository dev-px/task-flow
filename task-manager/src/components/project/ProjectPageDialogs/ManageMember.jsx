"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ManageMembersModal({ open, setOpen }) {
  const [search, setSearch] = useState("");

  // Dummy data (replace with API)
  const [members, setMembers] = useState([
    { id: "1", name: "Aman", role: "Owner" },
    { id: "2", name: "Priya", role: "Admin" },
    { id: "3", name: "Rohit", role: "Member" },
  ]);

  const users = [
    { id: "4", name: "Neha" },
    { id: "5", name: "Arjun" },
  ];

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addMember = (user) => {
    setMembers((prev) => [...prev, { ...user, role: "Member" }]);
    setSearch("");
  };

  const removeMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Members</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Suggestions */}
          {search && (
            <div className="border rounded-md p-2 space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between px-2 py-1 hover:bg-muted rounded"
                  >
                    <span className="text-sm">{user.name}</span>
                    <Button size="sm" onClick={() => addMember(user)}>
                      Add
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground px-2">
                  No users found
                </p>
              )}
            </div>
          )}

          {/* Current Members */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Project Members</p>

            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-sm">{member.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                </div>

                {member.role !== "Owner" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMember(member.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
