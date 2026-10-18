export interface StaffMember {
  id: string;
  ign: string;
  skinUsername: string;
  discordTag: string;
  hasChat?: boolean;
}

export interface RoleGroup {
  id: string;
  title: string;
  members: StaffMember[];
}

export const DEFAULT_TEAM: RoleGroup[] = [
  {
    id: 'owner',
    title: 'OWNER',
    members: [
      {
        id: 'owner-1',
        ign: '_T_Z',
        skinUsername: '_T_Z',
        discordTag: '_T_Z',
        hasChat: false,
      },
    ],
  },
  {
    id: 'builder',
    title: 'BUILDER',
    members: [
      {
        id: 'builder-1',
        ign: 'Nx4YGzz',
        skinUsername: 'Nx4YGzz',
        discordTag: 'Nx4YGzz',
        hasChat: true,
      },
    ],
  },
  {
    id: 'developer',
    title: 'DEVELOPER',
    members: [
      {
        id: 'dev-1',
        ign: 'Nx4YGzz',
        skinUsername: 'Nx4YGzz',
        discordTag: 'Nx4YGzz',
        hasChat: true,
      },
    ],
  },
  {
    id: 'moderator',
    title: 'MODERATOR',
    members: [
      {
        id: 'mod-1',
        ign: '_T_Z',
        skinUsername: '_T_Z',
        discordTag: '_T_Z',
        hasChat: true,
      },
    ],
  },
];

const STORAGE_KEY = 'anajaksmp_team_members';

export const teamService = {
  getTeam(): RoleGroup[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse team members from storage', e);
    }
    return DEFAULT_TEAM;
  },

  saveTeam(groups: RoleGroup[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      window.dispatchEvent(new CustomEvent('anajaksmp_team_updated', { detail: groups }));
    } catch (e) {
      console.warn('Failed to save team members', e);
    }
  },

  addMember(groupId: string, memberData: Omit<StaffMember, 'id'>): StaffMember {
    const groups = this.getTeam();
    const newMember: StaffMember = {
      ...memberData,
      id: `member-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    let group = groups.find((g) => g.id.toLowerCase() === groupId.toLowerCase());
    if (group) {
      group.members.push(newMember);
    } else {
      // Create new role group
      const newGroup: RoleGroup = {
        id: groupId.toLowerCase().replace(/\s+/g, '-'),
        title: groupId.toUpperCase(),
        members: [newMember],
      };
      groups.push(newGroup);
    }

    this.saveTeam(groups);
    return newMember;
  },

  updateMember(memberId: string, updates: Partial<StaffMember>, newGroupId?: string): boolean {
    const groups = this.getTeam();
    let foundMember: StaffMember | null = null;
    let oldGroup: RoleGroup | null = null;

    for (const g of groups) {
      const idx = g.members.findIndex((m) => m.id === memberId);
      if (idx !== -1) {
        foundMember = { ...g.members[idx], ...updates };
        oldGroup = g;
        if (newGroupId && newGroupId.toLowerCase() !== g.id.toLowerCase()) {
          // Remove from old group
          g.members.splice(idx, 1);
        } else {
          // Update in place
          g.members[idx] = foundMember;
        }
        break;
      }
    }

    if (!foundMember) return false;

    if (newGroupId && oldGroup && newGroupId.toLowerCase() !== oldGroup.id.toLowerCase()) {
      let targetGroup = groups.find((g) => g.id.toLowerCase() === newGroupId.toLowerCase());
      if (targetGroup) {
        targetGroup.members.push(foundMember);
      } else {
        groups.push({
          id: newGroupId.toLowerCase().replace(/\s+/g, '-'),
          title: newGroupId.toUpperCase(),
          members: [foundMember],
        });
      }
    }

    this.saveTeam(groups);
    return true;
  },

  deleteMember(memberId: string): boolean {
    const groups = this.getTeam();
    let removed = false;

    for (const g of groups) {
      const idx = g.members.findIndex((m) => m.id === memberId);
      if (idx !== -1) {
        g.members.splice(idx, 1);
        removed = true;
        break;
      }
    }

    if (removed) {
      this.saveTeam(groups);
    }
    return removed;
  },

  resetToDefault(): RoleGroup[] {
    this.saveTeam(DEFAULT_TEAM);
    return DEFAULT_TEAM;
  },
};
