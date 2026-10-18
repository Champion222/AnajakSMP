import { supabase } from './supabase.js';

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
const API_BASE = ((import.meta as any).env?.VITE_API_URL || '/api').replace(/\/$/, '');

export const teamService = {
  async syncFromServer(): Promise<RoleGroup[]> {
    // 1. Try Backend API
    try {
      const res = await fetch(`${API_BASE}/store/team`);
      const text = await res.text();
      if (res.ok && text.trim().startsWith('{')) {
        const data = JSON.parse(text);
        if (Array.isArray(data.team) && data.team.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.team));
          window.dispatchEvent(new CustomEvent('anajaksmp_team_updated', { detail: data.team }));
          return data.team;
        }
      }
    } catch (e) {
      // Fall through to direct Supabase
    }

    // 2. Direct Supabase Fallback (Guaranteed to work on Vercel without backend server)
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        const groupMap = new Map<string, StaffMember[]>();
        for (const row of data) {
          const groupName = row.role_group;
          if (!groupMap.has(groupName)) {
            groupMap.set(groupName, []);
          }
          groupMap.get(groupName)!.push({
            id: row.id,
            ign: row.ign,
            skinUsername: row.skin_username,
            discordTag: row.discord_tag,
            hasChat: row.has_chat ?? true,
          });
        }

        const groups: RoleGroup[] = [];
        for (const [title, members] of groupMap.entries()) {
          groups.push({
            id: title.toLowerCase().replace(/\s+/g, '-'),
            title,
            members,
          });
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
        window.dispatchEvent(new CustomEvent('anajaksmp_team_updated', { detail: groups }));
        return groups;
      }
    } catch (err) {
      console.warn('Could not sync team from Supabase:', err);
    }

    return this.getTeam();
  },

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

  async saveTeam(groups: RoleGroup[], adminToken?: string): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      window.dispatchEvent(new CustomEvent('anajaksmp_team_updated', { detail: groups }));

      // Attempt backend API
      const token =
        adminToken ||
        localStorage.getItem('anajaksmp_admin_token') ||
        sessionStorage.getItem('anajaksmp_admin_token');

      if (token && !token.startsWith('anajak_admin_session_')) {
        fetch(`${API_BASE}/admin/team`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ groups }),
        }).catch(() => {});
      }

      // Also sync directly to Supabase
      try {
        await supabase.from('team_members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const rows: any[] = [];
        let order = 1;
        for (const g of groups) {
          for (const m of g.members) {
            rows.push({
              role_group: g.title,
              ign: m.ign,
              skin_username: m.skinUsername,
              discord_tag: m.discordTag,
              has_chat: m.hasChat ?? true,
              display_order: order++,
            });
          }
        }
        if (rows.length > 0) {
          await supabase.from('team_members').insert(rows);
        }
      } catch (err) {
        console.warn('Direct Supabase team sync warning:', err);
      }
    } catch (e) {
      console.warn('Failed to save team members', e);
    }
  },

  async addMember(groupId: string, memberData: Omit<StaffMember, 'id'>): Promise<StaffMember> {
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

    await this.saveTeam(groups);
    return newMember;
  },

  async updateMember(memberId: string, updates: Partial<StaffMember>, newGroupId?: string): Promise<boolean> {
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

    await this.saveTeam(groups);
    return true;
  },

  async deleteMember(memberId: string): Promise<boolean> {
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
      const cleaned = groups.filter(
        (g) => g.members.length > 0 || ['owner', 'builder', 'developer', 'moderator'].includes(g.id.toLowerCase())
      );
      await this.saveTeam(cleaned);
    }

    return removed;
  },

  async resetToDefault(): Promise<RoleGroup[]> {
    await this.saveTeam(DEFAULT_TEAM);
    return DEFAULT_TEAM;
  },
};

// Auto-sync on client boot
if (typeof window !== 'undefined') {
  teamService.syncFromServer();
}
