import { supabase, isSupabaseConfigured } from '../db/supabase.js';

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

let cachedTeam: RoleGroup[] | null = null;

export class TeamService {
  static async getTeam(): Promise<RoleGroup[]> {
    if (isSupabaseConfigured && supabase) {
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
          cachedTeam = groups;
          return groups;
        }
      } catch (err: any) {
        console.warn('⚠️ [TeamService] Supabase team fetch error:', err.message);
      }
    }

    if (cachedTeam !== null) {
      return cachedTeam;
    }

    return DEFAULT_TEAM;
  }

  static async saveTeam(groups: RoleGroup[]): Promise<RoleGroup[]> {
    cachedTeam = groups;
    if (isSupabaseConfigured && supabase) {
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
      } catch (err: any) {
        console.warn('⚠️ [TeamService] Supabase team save error:', err.message);
      }
    }
    return cachedTeam;
  }

  static async addMember(groupId: string, memberData: Omit<StaffMember, 'id'>): Promise<StaffMember> {
    const groups = await this.getTeam();
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
  }

  static async updateMember(memberId: string, updates: Partial<StaffMember>, newGroupId?: string): Promise<boolean> {
    const groups = await this.getTeam();
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
  }

  static async deleteMember(memberId: string): Promise<boolean> {
    const groups = await this.getTeam();
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
  }

  static async resetToDefault(): Promise<RoleGroup[]> {
    return this.saveTeam(DEFAULT_TEAM);
  }
}
