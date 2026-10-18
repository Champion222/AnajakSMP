import fs from 'fs';
import path from 'path';

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

const DATA_DIR = path.resolve(process.cwd(), 'data');
const TEAM_FILE = path.join(DATA_DIR, 'team.json');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e: any) {
      console.warn('⚠️ [TeamService] Could not create data dir:', e.message);
    }
  }
}

let cachedTeam: RoleGroup[] | null = null;

export class TeamService {
  static getTeam(): RoleGroup[] {
    if (cachedTeam !== null) {
      return cachedTeam;
    }

    ensureDataDir();

    if (fs.existsSync(TEAM_FILE)) {
      try {
        const raw = fs.readFileSync(TEAM_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedTeam = parsed;
          return cachedTeam;
        }
      } catch (e: any) {
        console.warn('⚠️ [TeamService] Failed to read team.json:', e.message);
      }
    }

    cachedTeam = DEFAULT_TEAM;
    try {
      ensureDataDir();
      fs.writeFileSync(TEAM_FILE, JSON.stringify(cachedTeam, null, 2), 'utf-8');
    } catch (e: any) {
      console.warn('⚠️ [TeamService] Failed to write initial team.json:', e.message);
    }

    return cachedTeam;
  }

  static saveTeam(groups: RoleGroup[]): RoleGroup[] {
    cachedTeam = groups;
    try {
      ensureDataDir();
      fs.writeFileSync(TEAM_FILE, JSON.stringify(groups, null, 2), 'utf-8');
    } catch (e: any) {
      console.warn('⚠️ [TeamService] Failed to save team.json:', e.message);
    }
    return cachedTeam;
  }

  static addMember(groupId: string, memberData: Omit<StaffMember, 'id'>): StaffMember {
    const groups = this.getTeam();
    const newMember: StaffMember = {
      ...memberData,
      id: `member-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };

    let group = groups.find((g) => g.id.toLowerCase() === groupId.toLowerCase());
    if (group) {
      group.members.push(newMember);
    } else {
      const newGroup: RoleGroup = {
        id: groupId.toLowerCase().replace(/\s+/g, '-'),
        title: groupId.toUpperCase(),
        members: [newMember],
      };
      groups.push(newGroup);
    }

    this.saveTeam(groups);
    return newMember;
  }

  static updateMember(memberId: string, updates: Partial<StaffMember>, newGroupId?: string): boolean {
    const groups = this.getTeam();
    let foundMember: StaffMember | null = null;
    let oldGroup: RoleGroup | null = null;

    for (const g of groups) {
      const idx = g.members.findIndex((m) => m.id === memberId);
      if (idx !== -1) {
        foundMember = { ...g.members[idx], ...updates };
        oldGroup = g;
        if (newGroupId && newGroupId.toLowerCase() !== g.id.toLowerCase()) {
          g.members.splice(idx, 1);
        } else {
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
  }

  static deleteMember(memberId: string): boolean {
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
      // Remove empty groups if custom
      const cleaned = groups.filter((g) => g.members.length > 0 || ['owner', 'builder', 'developer', 'moderator'].includes(g.id.toLowerCase()));
      this.saveTeam(cleaned);
    }

    return removed;
  }

  static resetToDefault(): RoleGroup[] {
    return this.saveTeam(DEFAULT_TEAM);
  }
}
